const path = require('path');
const fs = require('fs');
const { BlobServiceClient, StorageSharedKeyCredential } = require("@azure/storage-blob");

function azureCredentials () {
    const credentials = {
        accountName: "jasonfinfileuploadstor",
        accountKey: process.env.ACCOUNT_KEY,
        containerName: "upload"       
    }

    return credentials;
}

async function downloadBlobAsStream(containerClient, blobName, folderPath) {

    const blobClient = containerClient.getBlobClient(blobName);

    const downloadResponse = await blobClient.download();
    const writableStream = fs.createWriteStream(folderPath);

    downloadResponse.readableStreamBody.pipe(writableStream);
    downloadResponse.readableStreamBody.on('end', () => {
        console.log(`download of ${blobName} succeeded`);
    });   
}

const getMedia = async (req, res) => {
    const fileName = req.body.file_name;
    const courseId = req.body.course_id;
    
    if (!req.isAuthorized) {
        return res.status(401).json({ error: true, message: "Not authorized!" });
    }

    const folderName = 'assets';
    const folderPath = path.resolve(folderName);
    const course_name = `course_${courseId}`;
    const localPath = `${folderPath}\\${course_name}\\${fileName}`;


    const azureInformation = azureCredentials();

    const sharedKeyCredential = new StorageSharedKeyCredential(azureInformation.accountName, azureInformation.accountKey);
    const blobServiceClient = new BlobServiceClient(`https://${azureInformation.accountName}.blob.core.windows.net`, sharedKeyCredential);

    const containerClient = blobServiceClient.getContainerClient(azureInformation.containerName);

    try {
        downloadBlobAsStream(containerClient, fileName, localPath);

        return res.status(200).json({
            "success": true,
            "result": `File '${fileName}' downloaded successfully.`
          })  
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Download failed.');
    }
    
}

async function uploadFileToAzure(blobFile, localFilePath) {

    const azureInformation = azureCredentials();

    const sharedKeyCredential = new StorageSharedKeyCredential(azureInformation.accountName, azureInformation.accountKey);
    const blobServiceClient = new BlobServiceClient(`https://${azureInformation.accountName}.blob.core.windows.net`, sharedKeyCredential);

    const containerClient = blobServiceClient.getContainerClient(azureInformation.containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(blobFile);

    const response = await blockBlobClient.uploadFile(localFilePath);

    console.log("\n respone: \n");
    console.log(response);
}

const uploadMedia = (req, res) => {
    const fileName = req.body.file_name;
    const courseId = req.body.course_id;

    if (!req.isAuthorized) {
        return res.status(401).json({ error: true, message: "Not authorized!" });
    }

    const folderName = 'assets';
    const folderPath = path.resolve(folderName);

    const course_name = `course_${courseId}`;

    const localPath = `${folderPath}\\${course_name}\\${fileName}`;

    console.log(localPath);

    uploadFileToAzure(fileName, localPath)
    .then(() => {
        return res.status(200).json({
            "success": true,
            "result": `File '${fileName}' uploaded successfully.`
          })  
    })
    .catch((error) => {
        console.error("Error uploading file:", error);
        return res.status(400).json({
            error: true,
            "success": false,
            "result": `nope`
          })
    });
}

// router.post('/upload1', upload.single('file'), async (req, res) => {

//     const accountName = "jasonfinfileuploadstor";
//     const accountKey = process.env.ACCOUNT_KEY;
//     const containerName = "upload";

//     try {
//         const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
//         const blobServiceClient = new BlobServiceClient(`https://${accountName}.blob.core.windows.net`, sharedKeyCredential);

//         const containerClient = blobServiceClient.getContainerClient(containerName);
//         const blobName = req.file.originalname;

//         const blockBlobClient = containerClient.getBlockBlobClient(blobName);

//         await blockBlobClient.uploadStream(req.file.buffer, req.file.size, 0, {
//             blobHTTPHeaders: {
//                 blobContentType: req.file.mimetype
//             }
//         });

//         res.status(200).send('File uploaded successfully');
//     } catch (error) {
//         console.error('Error uploading file:', error);
//         res.status(500).send('Error uploading file');
//     }
// });

module.exports = {
    getMedia,
    uploadMedia
};
