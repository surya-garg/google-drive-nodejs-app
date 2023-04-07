
# Google Drive API application in node.js

This app allows you to connect to Google Drive and perform the following tasks:

1. **List files**: You can see a list of all the files in your Google Drive account.
2. **Download files**: You can download files from your Google Drive to your computer.
3. **List users who have access to a file**: You can see a list of all the users who have permission to access a specific file in your Google Drive. It also provides permission monitoring functionality in real-time for any changes in users who have access to the file. This means that if new users are added or existing users are removed from the file, you can see the changes immediately.
The functionality is not fully real-time. I tried using the drive.permissions.watch method to implement it but it is not supported in the Google Drive API.
However, I incorporated similar functionality by polling the Google Drive API at regular intervals of 5 seconds to check for changes in permissions. This means that if new users are added or existing users are removed from the file, you will be able to see the changes on your screen.


## How to Execute the App

To execute the app and perform the above tasks, follow these simple steps:

1. Install Node.js: If you don't have Node.js installed on your computer, you can download Node.js from the official website: https://nodejs.org/en/download/
2. Download the app code: Download the code for the app from the GitHub repository: https://github.com/surya-garg/google-drive-nodejs-app.git
3. Install dependencies: Open a command prompt or terminal window in the folder where you downloaded the app code. Run the following command to install the required dependencies:
  ```npm install```

3. Set up Google Drive API credentials: This includes creating a project in the Google Cloud Console, enabling the Google Drive API and creating credentials (client ID and client secret) - follow the below instructions for these - 
    1. Go to console.cloud.google.com.
    2. Create a new project if you do not have an existing project.
    3. Select the project and select APIs and services.
    4. Click on ENABLE APIS AND SERVICES
    5. In the search box, search for google drive api then enable it for the project created.  
    7. In the Google Cloud console, go to Menu menu > APIs & Services > Credentials.
    8. Go to Credentials
    9. Click Create Credentials > OAuth client ID.
    10. Click Application type > Desktop app.
    11. In the Name field, type a name for the credential. This name is only shown in the Google Cloud console.
    12. Click Create. The OAuth client created screen appears, showing your new Client ID and Client secret.
    13. Click OK. The newly created credential appears under OAuth 2.0 Client IDs.
    14. Save the downloaded JSON file as credentials.json, and move the file to your working directory.

7. Run the app: After setting up the credentials, you can run the app by running the following command in the command prompt or terminal window:
```node index.js``` 
    1. The first time you run the sample, it prompts you to authorize access. If you're not already signed in to your Google Account, you're prompted to sign in. If you're signed in to multiple accounts, select one account to use for authorization. 
    2. Click Accept.

8. Once you are authenticated, you can use the app to perform the tasks listed above using following commands -
    1. For listing files - 
    
        ```node index.js listFiles```
    2. For downloading a file - 
    
        ```node index.js downloadFile <filename> <fileid>```
        
        fileid can be gotten from the result of listFiles api as it lists files with filenames and fileids.
    3. For listing users who have permission to access a given file - 
    
        ```node index.js filePermissions <fileid> ```
        
        fileid can be gotten from the result of listFiles api as it lists files with filenames and fileids.
