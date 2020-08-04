require('dotenv').config();
var jwt = require('jsonwebtoken');
const userModel = require('../app/models/userModel');

class Auth {
    generateToken(payload) {

        let token = jwt.sign(
            payload,
            process.env.JWT_KEY,
            { expiresIn: "24hr" }
        );
        return token;
    }
}

module.exports = new Auth();