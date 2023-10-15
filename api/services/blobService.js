const path = require('path');
const fs = require('fs');
const { BlobServiceClient, StorageSharedKeyCredential } = require("@azure/storage-blob");
const { azureMediaCredentials, azureThumbnailCredentials } = require("../db/container-connection");

async function downloadBlobAsStream(containerClient, blobName, folderPath) {

    const blobClient = containerClient.getBlobClient(blobName);

    const downloadResponse = await blobClient.download();
    const writableStream = fs.createWriteStream(folderPath);

    downloadResponse.readableStreamBody.pipe(writableStream);
    downloadResponse.readableStreamBody.on('end', () => {
        console.log(`download of ${blobName} succeeded`);
    });
}

async function uploadThumbnailFileToAzure(blobFile, localFilePath, blobContentType) {
    const sharedKeyCredential = new StorageSharedKeyCredential(azureThumbnailCredentials.accountName, azureThumbnailCredentials.accountKey);
    const blobServiceClient = new BlobServiceClient(`https://${azureThumbnailCredentials.accountName}.blob.core.windows.net`, sharedKeyCredential);

    const containerClient = blobServiceClient.getContainerClient(azureThumbnailCredentials.containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(blobFile);

    const blobHTTPHeaders = { blobContentType: blobContentType };

    const response = await blockBlobClient.uploadFile(localFilePath, {
        blobHTTPHeaders
    });

    return blockBlobClient.url;
}

/**
 * upload the URL media file to Azure
 *
 * @param {*} blobFile : the name of the media file
 */
async function uploadFileToAzure(blobFile) {
    //create a local path to where the media file has been saved
    const folderName = 'assets';
    const folderPath = path.resolve(folderName);
    const localPath = `${folderPath}\\${blobFile}`;

    // Create the BlobServiceClient object which will be used to create a container client
    const sharedKeyCredential = new StorageSharedKeyCredential(azureMediaCredentials.accountName, azureMediaCredentials.accountKey);
    const blobServiceClient = new BlobServiceClient(`https://${azureMediaCredentials.accountName}.blob.core.windows.net`, sharedKeyCredential);

    // Get a reference to a container
    const containerClient = blobServiceClient.getContainerClient(azureMediaCredentials.containerName);

    // Get a reference to a blob
    const blockBlobClient = containerClient.getBlockBlobClient(blobFile);

    //upload the media file to the blob container
    await blockBlobClient.uploadFile(localPath);
}

/**
 * retrieve the URL blob media file from Azure
 *
 * @param {*} azureInformation : azure credentials that has the blob URL
 * @param {*} blobName : the name of the blob media file
 * @returns
 */
function getBlobUrl(azureInformation, blobName) {
    // Create the BlobServiceClient object which will be used to create a container client
    const blobServiceClient = new BlobServiceClient(
        `https://${azureInformation.accountName}.blob.core.windows.net`,
        new StorageSharedKeyCredential(azureInformation.accountName, azureInformation.accountKey)
    );

    // Get a reference to a container
    const containerClient = blobServiceClient.getContainerClient(azureInformation.containerName);

    // Get a reference to a blob
    const blobClient = containerClient.getBlobClient(blobName);

    // Return the blob URL
    return blobClient.url;
}

module.exports = {
    downloadBlobAsStream,
    uploadThumbnailFileToAzure,
    getBlobUrl,
    uploadFileToAzure
}