const jwt = require('jsonwebtoken');

function generateToken(payload) {
   return jwt.sign(payload, process.env.API_SECRET);
};

function verifyToken(token) {
   return jwt.verify(token, process.env.API_SECRET);
}

module.exports = { generateToken, verifyToken };
