require('dotenv').config();
var jwt = require('jsonwebtoken');
const userModel = require('../app/models/userModel');
const { ReplSet } = require('mongodb');

class Auth {
    generateToken(payload) {

        let token = jwt.sign(
            payload,
            process.env.JWT_KEY,
            { expiresIn: "24hr" }
        );
        return token;
    }

    verificationToken(req, res, next) {
        let bearHeader = req.params.shortenUrl;

        userModel.findOne({ url_code: bearHeader })
            .then(data => {

                if (data == null) {
                    let response = {
                        message: 'no data found'
                    }
                    res.status(422).send(response);

                } else {

                    let urlArr = data.long_url.split('/');
                    // Taking value after last slash (/)
                    let url = urlArr[urlArr.length - 1];

                    jwt.verify(url, process.env.JWT_KEY, (err, decoded) => {

                        if (err) {
                            req.decoded = null
                            req.authenticated = false;
                            res.status(422).send(err);

                        } else {
                            req.decoded = decoded;
                            req.authenticated = true;
                            next();
                        }
                    })
                }
            })
            .catch(err => {
                ReplSet.status(422).send(err);
            })

    }
}

module.exports = new Auth();