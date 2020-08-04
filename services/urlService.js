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
                                // User schema Model: data
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
}

module.exports = new UrlService();