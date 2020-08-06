// const {check, validationResult} = require('express-validator');
const userService = require('../services/userService');
const userModel = require('../app/models/userModel');
const urlService = require('../services/urlService');
const authentication = require('../auth/auth');
const mailService = require('../services/mailService.js');

class UserController {

    async register(req, res) {

        try {
            req.check('firstName', 'Length of name should be 2 charecters').isLength({ min: 2 });
            req.check('lastName', 'Last name cannot be empty').notEmpty();
            req.check('email', 'Invalid email address').isEmail();
            req.check('password', 'Invalid password').notEmpty().isLength({ min: 6 });

            const errors = await req.validationErrors();
            if (errors) {
                return res.status(422).json({ errors: errors });
            }

            // On success of register Service, it will return data containing email. 
            // Email is then shorten and verfication mail is sent.
            userService.register(req.body)

                .then(data => {

                    let request = {
                        email: data.email,
                        // Change it while using Angular at front end (i.e. 4200)
                        url: 'http://localhost:3000/verify/'
                    }

                    // It will shorten the url to before sending to nodemailer.
                    urlService.shortenUrl(request, (err, result) => {

                        if (err) {
                            res.status(422).send(err);
                        } else {
                            // Verification short url send to Email address.
                            mailService.sendVerifyLink(result.shortUrl, result.email);
                            res.status(200).send(result);
                        }
                    })
                })
                .catch(err => {
                    res.status(422).send(err);
                })
        }
        catch (error) {
            let response = {};
            response.success = false;
            response.data = error;
            res.status(404).send(response);

        }
    }

    // To verify and validate email
    async verifyMail(req, res) {

        try {
            // Taking decoded key from req object
            urlService.verifyUrl(req.decoded, (err, data) => {

                if (err)
                    res.status(422).send(err);
                else
                    res.status(200).send(data);

            });
        }
        catch (error) {
            let response = {};
            response.success = false;
            response.data = error;
            res.status(404).send(response);
        }
    }

}

module.exports = new UserController();