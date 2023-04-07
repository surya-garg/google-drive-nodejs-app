const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const {authenticate} = require('@google-cloud/local-auth');
const {google} = require('googleapis');

const SCOPES = ['https://www.googleapis.com/auth/drive.readonly',
                'https://www.googleapis.com/auth/drive.metadata.readonly'];

const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

/**
 * Reads previously authorized credentials from the save file.
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
 */
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 */
async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

/**
 * List files.
 * node index.js listFiles
 */
async function listFiles(authClient) {
  const drive = google.drive({version: 'v3', auth: authClient});
  const res = await drive.files.list({
    fields: 'nextPageToken, files(id, name)',
  });
  const files = res.data.files;
  if (files.length === 0) {
    console.log('No files found.');
    return;
  }

  console.log('Files:');
  files.map((file) => {
    console.log(`${file.name} (${file.id})`);
  });
}


/**
 * Downloads file.
 * Filname and fileid must be provided as command line arguments.
 * node index.js downloadFile <filename> <fileid>
 */
async function downloadFile(authClient) {
  const drive = google.drive({version: 'v3', auth: authClient});
  if(!process.argv[3] || !process.argv[4]) {
    console.log('No filename or fileid provided.');
    return;
  }
  const fileId = process.argv[4];
  const filename = process.argv[3];
  var dest = fs.createWriteStream(filename);
  drive.files.watch
  drive.files.get({fileId: fileId, alt: 'media'}, {responseType: 'stream'},
    function(err, res){
       res.data
       .on('end', () => {
          console.log('Done');
       })
       .on('error', err => {
          console.log('Error', err);
       })
       .pipe(dest);
    }
  );
}

/**
 * Retrieve File Permissions and does real time permissions monitoring.
 * Fileid must be provided as command line argument.
 * node index.js filePermissions <fileid>
 */
async function filePermissions(authClient) {
  const drive = google.drive({version: 'v3', auth: authClient});
  if(!process.argv[3]) {
    console.log('No file id provided.');
    return;
  }
  const fileId = process.argv[3];
  try {
    const response = await drive.permissions.list({
      fileId: fileId,
      fields: 'permissions(id, emailAddress, role, type)',
    });

    var users = response.data.permissions;
    if (users.length === 0) {
      console.log('No permissions found.');
      return;
    }
    console.log('Permissions:');
    users.map((permission) => {
      console.log(`${permission.emailAddress} (${permission.role}) (${permission.type}) (${permission.id})`);
    });

    // look for changes in permissions every 5 seconds
    setInterval(async () => {
        const newResponse = await drive.permissions.list({ fileId });
        const newUsers = newResponse.data.permissions;

        const addedUsers = newUsers.filter((newUser) => {
            return !users.some((user) => user.id === newUser.id);
        });

        const removedUsers = users.filter((user) => {
            return !newUsers.some((newUser) => newUser.id === user.id);
        });

        // Update the list of users and display changes
        users.push(...addedUsers);
        users = users.filter((user) => {
            return !removedUsers.some((removedUser) => removedUser.id === user.id);
        });

        if (addedUsers.length > 0) {
            console.log(`Added users: ${addedUsers.map((user) => user.emailAddress).join(', ')}`);
        }

        if (removedUsers.length > 0) {
            console.log(`Removed users: ${removedUsers.map((user) => user.emailAddress).join(', ')}`);
        }
      }, 5000);
  } catch (err) {
    console.error('Error listing users with access to file:', err);
  }
}

if(process.argv[2] == 'listFiles'){
	authorize().then(listFiles).catch(console.error)
} else if(process.argv[2] == 'downloadFile'){
  authorize().then(downloadFile).catch(console.error)
} else if(process.argv[2] == 'filePermissions'){
  authorize().then(filePermissions).catch(console.error)
} else {
  authorize()
  console.log('No command provided. Please provide one of the following commands:\n' +
              'listFiles/downloadFile <filename> <fileid>/filePermissions <fileid>');
}
