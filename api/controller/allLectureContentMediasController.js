const Material = require('../models/Material');

const getALLMaterial = async (req, res) => {
    try {
        // get courses from database
        const all_material = await Material.getALLMaterial();

        // return courses
        return res.status(200).json(all_material);
    }
    catch (err) {
        // return error
        return res.status(500).json({
            error: true,
            message: err
        });
    }
}

module.exports = {
    getALLMaterial
}