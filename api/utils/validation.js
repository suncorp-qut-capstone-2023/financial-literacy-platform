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
    isValidInt
}