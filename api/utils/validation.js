// Validate Request Header
const validateHeader = (header) => {
    if (!header || typeof header === 'undefined' || header.split(' ').length !== 2) {
        return false;
    }
    return true;
};

// Validate integer
function isValidInt(value) {

    // Attempt to convert the string to an integer
    let integerValue = parseInt(value, 10);

    // Check if it's a valid integer
    if (!isNaN(integerValue)) {
        value = integerValue;
    }

    return value;
}

module.exports = {
    validateHeader,
    isValidInt
}