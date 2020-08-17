require('dotenv').config();
var jwt = require('jsonwebtoken');
const userModel = require('../app/models/userModel');


class Auth {

    generateToken(payload) {

        // console.log('From Auth.js = \n', payload);

        let token = jwt.sign(
            payload,
            process.env.JWT_KEY,
            { expiresIn: "24hr" }
        );
        return token;
    }


    verificationToken(req, res, next) {

        let urlToken = req.params.shortenUrl;

        userModel.findOne({ url_code: urlToken })
            .then(data => {

                if (data == null) {

                    res.status(422).send({
                        // Short id i.e.(verify/:shortId) from url and url_code stored in database does not matched
                        message: 'No data found'
                    });

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
                res.status(422).send(err);
            })
    }


    resetToken(req, res, next) {

        if (req.params.token) {

            userModel.findOne({ forgot_token: req.params.token })
                .then(data => {

                    if (data == null) {

                        res.status(422).send({
                            // token from url and forgot_token stored in database does not matched
                            message: 'no data found'
                        });

                    } else {

                        let emailToken = req.params.token;

                        jwt.verify(emailToken, process.env.JWT_KEY, (err, decoded) => {

                            if (err) {
                                req.decoded = null;
                                req.authenticated = false;
                                res.status(422).send(err + '\ntoken expired');

                            } else {
                                req.decoded = decoded;
                                req.authenticated = true;
                                next();
                            }
                        });

                    }
                })
                .catch(err => {
                    res.status(422).send(err);
                });

        } else {

            return res.status(422).send({
                message: 'token not found in url'
            });
        }
    }

    loginToken(req, res, next) {

        if (req.headers.token) {

            let bearHeader = req.headers.token;

            jwt.verify(bearHeader, process.env.JWT_KEY, (err, decoded) => {

                if (err) {
                    req.decoded = null;
                    res.status(422).send(err + '\ntoken expired');

                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            return res.status(422).send({
                message: "token not found in header"
            })
        }
    }
}

module.exports = new Auth();