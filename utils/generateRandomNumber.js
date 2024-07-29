exports.generateRandomNumber = (numDigits) => {
    if (numDigits <= 0) {
      return;
    }
    const min = Math.pow(10, numDigits - 1); // Minimum value with the specified number of digits
    const max = Math.pow(10, numDigits) - 1; // Maximum value with the specified number of digits
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }