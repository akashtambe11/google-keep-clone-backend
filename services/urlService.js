const validUrl = require('valid-url');
const shortId = require('shortid');
const auth = require('../auth/auth');
const userModel = require('../app/models/userModel');

class UrlService {

    shortenUrl(req, callback) {
        const baseUrl = req.url;
        const urlCode = shortId.generate();
        const isValidUrl = validUrl.isUri(baseUrl); // URI Validation

        if (isValidUrl) {
            try {

                userModel.findOne({ email: req.email })
                    .then(data => {

                        let payload = {
                            id: data._id,
                            email: req.email
                        }

                        // To generetae token
                        let token = auth.generateToken(payload);

                        const longUrl = baseUrl + token;
                        const shortUrl = baseUrl + urlCode;

                        userModel.update({ _id: data._id },
                            {
                                // Updating data of long_url, short_url, url_code
                                long_url: longUrl,
                                short_url: shortUrl,
                                url_code: urlCode
                            },
                            (error, res) => {

                                if (error) {
                                    callback(error);

                                } else {

                                    // Registration response output
                                    let response = {
                                        status: true,
                                        shortUrl: shortUrl,
                                        email: data.email,
                                        message: 'user registered'
                                    };
                                    callback(null, response);
                                }
                            }
                        )
                    })
                    .catch(err => {
                        callback(err);
                    })
            }
            catch (error) {

                let response = {
                    success: false,
                    message: 'server error',
                    error: error
                }

                callback(response);

            }
        }
    }

    // To verify user and setting flag true in database
    verifyUrl(req, callback) {

        userModel.update({ email: req.email },
            {
                // Updating value of isVerified: true
                isVerified: true
            },
            (err, data) => {

                if (err) {
                    callback(err);

                } else {
                    let response = {
                        status: true,
                        message: 'user verified'
                    }
                    callback(null, response);
                }
            }
        )
    }
}

module.exports = new UrlService();