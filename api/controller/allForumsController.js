const forumModel = require("../models/Forum");

const getForums = async (req, res) => {
    try {
        const forums = await forumModel.getForums();
        res.status(200).json(forums);
    } catch (error) {
        res.status(500).json({ message: "Database error!" });
    }
};

module.exports = {
    getForums
}