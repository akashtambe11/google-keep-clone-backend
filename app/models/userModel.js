const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isVerified: {
        type: String,
        default: false,
        required: false
    },
    long_url: {
        type: String,
        required: false
    },
    short_url: {
        type: String,
        required: false
    },
    url_code: {
        type: String,
        required: false
    },
    forgot_token: {
        type: String,
        required: false
    },
});

const User = mongoose.model('users', userSchema); //users: collection name

class Model {

    // Method to find requested data in Database.
    findOne(req) {

        return new Promise((resolve, reject) => {

            User.findOne(req)
                .then(data => {
                    resolve(data)
                })
                .catch(err => {
                    console.log(err);
                    reject(err);
                })
        });
    }

    // Method to update requested data in Database.
    update(req, res, callback) {

        User.updateOne(req, res)

            .then(data => {
                callback(null, data);
            })
            .catch(err => {
                callback(err);
            })
    }

    // User Registration
    register(req, callback) {

        let RegistrationObject = new User({
            firstName: req.firstName,
            lastName: req.lastName,
            email: req.email,
            password: req.password
        });

        // MongoDB method to save data in Database.
        RegistrationObject.save((error, result) => {

            if (error) {
                callback(error);
            } else {
                let response = {
                    email: result.email
                }
                callback(null, response);
            }
        });
    }
}


module.exports = new Model();