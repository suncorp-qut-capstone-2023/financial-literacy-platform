/**
 * This file is for setting up connection to the media blob storage on a container
 **/

/**
 * @type { 
 *      accountName: string, 
 *      accountKey: string,
 *      containerName: string
 * }
 */
module.exports = {
    accountName: "jcmg",
    accountKey: process.env.ACCOUNT_KEY,
    containerName: "media"
};