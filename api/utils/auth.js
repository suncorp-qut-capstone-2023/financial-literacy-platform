const bcrypt = require('bcrypt');

exports.hashPassword = async function(password){
    try{
        const salt = await bcrypt.genSalt(12)
        return await bcrypt.hash(password, salt);
    }
    catch(err) {
        throw err;
    }
}

exports.comparePassword = function(password, hash){
    return bcrypt.compare(password, hash)
}