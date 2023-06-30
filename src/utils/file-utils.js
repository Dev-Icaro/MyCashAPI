const fs = require('fs');

function fileExists(path) {
   return fs.existsSync(path) ? true : false;
}

module.exports = { fileExists };