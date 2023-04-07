# google-drive-nodejs-app
Google Drive API application in node.js
h1. Google Drive App

This app allows you to connect to Google Drive and perform the following tasks:

1. List files: You can see a list of all the files in your Google Drive account.
2. Download files: You can download files from your Google Drive to your computer.
3. List users who have access to a file: You can see a list of all the users who have permission to access a specific file in your Google Drive. It also provides permission monitoring functionality in real-time for any changes in users who have access to the file. This means that if new users are added or existing users are removed from the file, you will be notified immediately and you can see the changes.
The functionality is not fully real-time. I tried using the drive.permissions.watch method to implement it but it is not supported in the Google Drive API.
However, I incorporated similar functionality by polling the Google Drive API at regular intervals to check for changes in permissions. This means that if new users are added or existing users are removed from the file, you will be able to see the changes on your screen.


h3. How to Execute the App

To execute the app and perform the above tasks, follow these simple steps:

1. Install Node.js: If you don't have Node.js installed on your computer, you can download Node.js from the official website: https://nodejs.org/en/download/
2. Download the app code: Download the code for the app from the GitHub repository: https://github.com/your-repo-url
3. Install dependencies: Open a command prompt or terminal window in the folder where you downloaded the app code. Run the following command to install the required dependencies:
<code>npm install</code>

3. Set up Google Drive API credentials: This includes creating a project in the Google Cloud Console, enabling the Google Drive API - follow the below instructions for these - 
1. Go to console.cloud.google.com.
2. Create a new project if you do not have an existing project.
3. Select the project and select APIs and services.
4. Click on ENABLE APIS AND SERVICES
5. In the search box, search for google drive api then enable it for the project created. 
6. Create credentials (client ID and client secret) - 
    a. In the Google Cloud console, go to Menu menu > APIs & Services > Credentials.
    b. Go to Credentials
    c. Click Create Credentials > OAuth client ID.
    d. Click Application type > Desktop app.
    e. In the Name field, type a name for the credential. This name is only shown in the Google Cloud console.
    f. Click Create. The OAuth client created screen appears, showing your new Client ID and Client secret.
    g. Click OK. The newly created credential appears under OAuth 2.0 Client IDs.
    h. Save the downloaded JSON file as credentials.json, and move the file to your working directory.

7. Run the app: After setting up the credentials, you can run the app by running the following command in the command prompt or terminal window:
The first time you run the sample, it prompts you to authorize access:

    a. If you're not already signed in to your Google Account, you're prompted to sign in. If you're signed in to multiple accounts, select one account to use for authorization.
    b. Click Accept.
    <code> node index.js </code>

8. Once you are authenticated, you can use the app to perform the tasks listed above using following commands -  
    a. For listing files - 
    <code>node index.js listFiles</code>
    b. For downloading a file - 
    <code>node index.js downloadFile <filename> <fileid></code>
    fileid can be gotten from the result of listFiles api as it lists files with filenames and fileids.
    c. For listing users who have permission to access a given file - 
    <code>node index.jsfilePermissions <fileid> </code>
    fileid can be gotten from the result of listFiles api as it lists files with filenames and fileids.
