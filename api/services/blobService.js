const path = require('path');
const fs = require('fs');
const { BlobServiceClient, StorageSharedKeyCredential } = require("@azure/storage-blob");
const { azureMediaCredentials, azureThumbnailCredentials } = require("../db/container-connection");

async function uploadThumbnailFileToAzure(blobFile, localFilePath, blobContentType) {

    if (!blobFile || !localFilePath || !blobContentType) {
        throw new Error('Invalid parameters provided');
    }

    if (!fs.existsSync(localFilePath)) {
        throw new Error(`File not found: ${localFilePath}`);
    }

    try {
        const sharedKeyCredential = new StorageSharedKeyCredential(azureThumbnailCredentials.accountName, azureThumbnailCredentials.accountKey);
        const blobServiceClient = new BlobServiceClient(`https://${azureThumbnailCredentials.accountName}.blob.core.windows.net`, sharedKeyCredential);

        const containerClient = blobServiceClient.getContainerClient(azureThumbnailCredentials.containerName);
        const blockBlobClient = containerClient.getBlockBlobClient(blobFile);

        const blobHTTPHeaders = { blobContentType: blobContentType };

        await blockBlobClient.uploadFile(localFilePath, {
            blobHTTPHeaders
        });

        return blockBlobClient.url;
    } catch (error) {
        throw new Error(`Failed to upload thumbnail to Azure: ${error.message}`);
    }
}

/**
 * upload the URL media file to Azure
 *
 * @param {*} blobFile : the name of the media file
 */
async function uploadFileToAzure(blobFile) {
    if (!blobFile) {
        throw new Error('Invalid blobFile parameter provided');
    }

    const folderName = 'assets';
    const localPath = path.join(folderName, blobFile);

    if (!fs.existsSync(localPath)) {
        throw new Error(`File not found: ${localPath}`);
    }

    try {
        const sharedKeyCredential = new StorageSharedKeyCredential(azureMediaCredentials.accountName, azureMediaCredentials.accountKey);
        const blobServiceClient = new BlobServiceClient(`https://${azureMediaCredentials.accountName}.blob.core.windows.net`, sharedKeyCredential);

        const containerClient = blobServiceClient.getContainerClient(azureMediaCredentials.containerName);
        const blockBlobClient = containerClient.getBlockBlobClient(blobFile);

        await blockBlobClient.uploadFile(localPath);

        console.log(`File "${blobFile}" is uploaded`);
    } catch (error) {
        throw new Error(`Failed to upload file to Azure: ${error.message}`);
    }
}

/**
 * retrieve the URL blob media file from Azure
 *
 * @param {*} azureInformation : azure credentials that has the blob URL
 * @param {*} blobName : the name of the blob media file
 * @returns
 */
function getBlobUrl(azureInformation, blobName) {
    if (!azureInformation || !blobName) {
        throw new Error('Invalid parameters provided');
    }

    try {
        const blobServiceClient = new BlobServiceClient(
            `https://${azureInformation.accountName}.blob.core.windows.net`,
            new StorageSharedKeyCredential(azureInformation.accountName, azureInformation.accountKey)
        );

        const containerClient = blobServiceClient.getContainerClient(azureInformation.containerName);
        const blobClient = containerClient.getBlobClient(blobName);

        return blobClient.url;
    } catch (error) {
        throw new Error(`Failed to get blob URL from Azure: ${error.message}`);
    }
}

module.exports = {
    uploadThumbnailFileToAzure,
    getBlobUrl,
    uploadFileToAzure
}