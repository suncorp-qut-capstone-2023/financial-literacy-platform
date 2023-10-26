/**
 * This file is for setting up connection to the media blob storage on a container
 **/

/**
 * This function is to set up the credentials for the azure blob storage
 * @param accountName
 * @param accountKey
 * @param containerName
 * @returns {{accountName, containerName, accountKey}}
 */
function azureCredentials(accountName, accountKey, containerName) {
    return {
        accountName: accountName,
        accountKey: accountKey,
        containerName: containerName
    }
}

const JCMG_ACCOUNT_NAME = 'jcmg' || process.env.AZURE_STORAGE_ACCOUNT_NAME;
const JCMG_ACCOUNT_KEY = process.env.AZURE_STORAGE_ACCOUNT_KEY;

const azureMediaCredentials = azureCredentials(JCMG_ACCOUNT_NAME, JCMG_ACCOUNT_KEY, 'media');
const azureThumbnailCredentials = azureCredentials(JCMG_ACCOUNT_NAME, JCMG_ACCOUNT_KEY, 'thumbnails');

module.exports = {
    azureMediaCredentials,
    azureThumbnailCredentials
}