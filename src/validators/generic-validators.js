function validateEmailFormat(email) {
   const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   return regex.test(email);
};

function isNumber(value) {
   return typeof value === 'number';
}

module.exports = { validateEmailFormat, isNumber };