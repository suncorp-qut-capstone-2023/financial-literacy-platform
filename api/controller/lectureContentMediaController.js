const Material = require("../models/Material");
const azureCredentials = require("../db/container-connection");
const { isValidInt } = require("../utils/validation");
const { BlobServiceClient, StorageSharedKeyCredential } = require("@azure/storage-blob");
const path = require('path');

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

const getMaterial = async (req, res) => {
    // get course id from params
    let materialID;
    try {
        materialID = isValidInt(req.query.materialID);
    } catch (err) {
        return res.status(400).json({
            error: true,
            message: "Bad request. Please specify the correct data type of materialID"
        });
    }

    try {
        // get course from database
        const material = await Material.getMaterial(materialID);

        // return course
        return res.status(200).json(material);
    }
    catch (err) {

        //error related to foreign key is not properly applied to
        if (err.errno === 1452) {
            return res.status(500).json({
                error: true,
                message: "foreign key constraint fails"
            });
        }

        // return error
        return res.status(500).json({
            error: true,
            message: err
        });
    }
}

/**
 * upload the URL media file to Azure
 * 
 * @param {*} azureInformation : azure credentials to upload the media file
 * @param {*} blobFile : the name of the media file
 */
async function uploadFileToAzure(azureInformation, blobFile) {
    //create a local path to where the media file has been saved
    const folderName = 'assets';
    const folderPath = path.resolve(folderName);
    const localPath = `${folderPath}\\${blobFile}`;

    // Create the BlobServiceClient object which will be used to create a container client
    const sharedKeyCredential = new StorageSharedKeyCredential(azureInformation.accountName, azureInformation.accountKey);
    const blobServiceClient = new BlobServiceClient(`https://${azureInformation.accountName}.blob.core.windows.net`, sharedKeyCredential);

    // Get a reference to a container
    const containerClient = blobServiceClient.getContainerClient(azureInformation.containerName);

    // Get a reference to a blob
    const blockBlobClient = containerClient.getBlockBlobClient(blobFile);

    //upload the media file to the blob container
    await blockBlobClient.uploadFile(localPath);
}

const createMaterial = async (req, res) => {
    // received request body information
    const { material_name, media_file_name } = req.body;
    data = {};

    if ( !material_name ) {
        return res.status(400).json({
            success_addition: false,
            error: true,
            message: "Bad request. Please specify the course name and category type."
        });
    } else {
        data["MATERIAL_NAME"] = material_name;
    }

    //if media exist
    if (media_file_name) {
        //upload the file to the Azure container
        try {
            await uploadFileToAzure(azureCredentials, media_file_name);
        } catch (error) {
            console.error("Error uploading file:", error);
            return res.status(500).json({
                error: true,
                message: `media with the local path '${error.path}' has not been found`
            });
        }

        //get the blob URL then used it as the input
        data["MATERIAL_URL"] = getBlobUrl(azureCredentials, media_file_name);
    }

    try {
        // create material in database
        const result = await Material.createMaterial(data);

        // return material has been updated
        if (result === true) {
            return res.status(200).json({message: "new material data has been successfully added!"});
        } else {
            return res.status(400).json({
                error: true,
                message:  `the creation of a new material data has failed`
            });
        }
    }
    catch (err) {

        //error related to foreign key is not properly applied to
        if (err.errno === 1452) {
            return res.status(500).json({
                error: true,
                message: "foreign key constraint fails"
            });
        }else if (err.errno === 1406) {

            const data = err.sqlMessage.match(/'([^']+)'/);

            return res.status(500).json({
                error: true,
                message: `data too long for ${data[0]}`
            });
        } else {
            // return error
            return res.status(500).json({
                error: true,
                message: err.message
            });            
        }
    }
}

const updateMaterial = async (req, res) => {
    // received request body information
    let materialID;
    try {
        materialID = isValidInt(req.query.materialID);
    } catch (err) {
        return res.status(400).json({
            error: true,
            message: "Bad request. Please specify the correct data type of materialID"
        });
    }
    const material_name = req.body.material_name;
    const new_media_file_name = req.body.new_media_file_name;

    if ( !material_name || !materialID ) {
        return res.status(400).json({
            success_addition: false,
            error: true,
            message: "Bad request. Please specify set and where data type, set and where condition, set and where value, and the intended table"
        });
    }

    //existing value to be updated
    const value = {
        "MATERIAL_ID": materialID,
        "MATERIAL_NAME": material_name
    };

    //if the new media file is provided
    if (new_media_file_name) {
        //upload the file to the Azure container
        try {
            await uploadFileToAzure(azureCredentials, new_media_file_name);
        } catch (error) {
            console.error("Error uploading file:", error);
            return res.status(500).json({
                error: true,
                message: `media with the local path '${error.path}' has not been found`
            });
        }

        //get the blob URL then used it as the input
        value["MATERIAL_URL"] = getBlobUrl(azureCredentials, new_media_file_name);
    }

    try {
        // update material in database
        const result = await Material.updateMaterial(materialID, value);

        // return course
        if (result === true) {
            return res.status(200).json({"message": `table 'material' has been updated`});
        } else {
            return res.status(400).json({
                error: true,
                message:  `data on 'material' table with condition COURSE_ID = ${value[1]} has not been found`
            });
        }
    }
    catch (err) {

        const data = err.sqlMessage.match(/'([^']+)'/);

        if (err.errno === 1054) {
            return res.status(500).json({
                error: true,
                message: `unknown column: ${data[0]}`
            });
        } else if (err.errno === 1366) {
            return res.status(500).json({
                error: true,
                message: `Incorrect integer value: ${data[0]}`
            });
        }else if (err.errno === 1406) {
            return res.status(500).json({
                error: true,
                message: `data too long for ${data[0]}`
            });
        }else if (err.errno === 3140) {
            return res.status(500).json({
                error: true,
                message: `Incorrect JSON text value`
            });
        }else {
            return res.status(500).json({
                error: true,
                message: err.message
            });            
        }
    }
}

const deleteMaterial = async (req, res) => {
    // get course id from params
    let materialID;
    try {
        materialID = isValidInt(req.query.materialID);
    } catch (err) {
        return res.status(400).json({
            error: true,
            message: "Bad request. Please specify the correct data type of materialID"
        });
    }

    let courseID;
    try {
        courseID = isValidInt(req.query.courseID);
    } catch (err) {
        return res.status(400).json({
            error: true,
            message: "Bad request. Please specify the correct data type of courseID"
        });
    }

    let moduleID;
    try {
        moduleID = isValidInt(req.query.moduleID);
    } catch (err) {
        return res.status(400).json({
            error: true,
            message: "Bad request. Please specify the correct data type of moduleID"
        });
    }

    let lectureID;
    try {
        lectureID = isValidInt(req.query.lectureID);
    } catch (err) {
        return res.status(400).json({
            error: true,
            message: "Bad request. Please specify the correct data type of lectureID"
        });
    }

    let contentID;
    try {
        contentID = isValidInt(req.query.contentID);
    } catch (err) {
        return res.status(400).json({
            error: true,
            message: "Bad request. Please specify the correct data type of contentID"
        });
    }

    if (!materialID || !courseID || !moduleID || !lectureID || !contentID) {
        return res.status(400).json({
            success_addition: false,
            error: true,
            message: "Bad request. Please specify the materialID, courseID, moduleID, lectureID, and contentID."
        });
    }

    try {

        const result = await Material.deleteMaterial(courseID, moduleID, lectureID, contentID, materialID);

        // return course
        if (result === true) {
            return res.status(200).json({"message": `data with the condition ID = ${materialID} on table 'material' has been deleted`});
        } else {
            return res.status(400).json({
                error: true,
                message:  `data on 'material' table with condition ID = ${materialID} has not been found`
            });
        }

    }
    catch (err) {
        //find data type, such as "COURSE_ID"
        const data = err.sqlMessage.match(/'([^']+)'/);

        //error related to foreign key is not properly applied to
        if (err.errno === 1452) {
            return res.status(500).json({
                error: true,
                message: "foreign key constraint fails. Delete all foreign key used with the related primary key."
            });
        } else if (err.errno === 1451) {
            return res.status(500).json({
                error: true,
                message: "foreign key constraint fails. The foreign key used with the related primary key has not been found."
            });
        } else if (err.errno === 1264) {
            return res.status(500).json({
                error: true,
                message: `${data[0]} integer value is too large`
            });
        } else if (err.errno === 1292) {
            return res.status(500).json({
                error: true,
                message: `incorrect double value: ${data[0]}`
            });
        } else if (err.errno === 1406) {
            return res.status(500).json({
                error: true,
                message: `data too long for ${data[0]}`
            });
        } else {
            return res.status(500).json({
            error: true,
            message: err.message
            });
        }
    }
}

module.exports = {
    getMaterial,
    createMaterial,
    updateMaterial,
    deleteMaterial
}