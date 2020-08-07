const userModel = require('../app/models/userModel');
const util = require('../services/utilService');


class UserService {

    register(req) {

        return new Promise((resolve, reject) => {

            userModel.findOne({ email: req.email })

                .then(data => {

                    // If data found then reject method with message object.
                    if (data) {
                        reject({
                            message: 'Email-Id alredy Exist'
                        });

                    } else {
                        // Password hasing using bcrypt
                        let hash = util.hashPassword(req.password)
                        hash.then(data => {

                            // request payload
                            let request = {
                                firstName: req.firstName,
                                lastName: req.lastName,
                                email: req.email,
                                password: data
                            }

                            // Request is send to userModel for storing in database
                            userModel.register(request, (err, result) => {

                                if (err) {
                                    reject(err);

                                } else {
                                    resolve(result);
                                }
                            })
                        })
                            .catch(err => {
                                reject(err);
                            });
                    }
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    login(req, callback) {

        userModel.findOne({ email: req.email })
            .then(data => {

                if (data.isVerified) {

                    util.comparePassword(req.password, data.password, (err, result) => {

                        if (err) {
                            callback(err);

                        } else if (result) {

                            userModel.login(data, (err, res) => {

                                if (err) {
                                    callback(err);

                                } else {
                                    callback(null, res);
                                }
                            })

                        } else {
                            callback({
                                message: 'Invalid Password'
                            })
                        }
                    })

                } else {
                    callback({
                        message: 'User not Verified'
                    })
                }
            })
            .catch(err => {
                callback({
                    message: 'User not recognised'
                })
            })
    }


    forgot(req) {
        return new Promise((resolve, reject) => {

            userModel.findOne({email: req.email})
            .then(data => {

                if(data.isVerified) {

                    // Forgot response output
                    let result = {
                        status: true,
                        id: data._id,
                        email: data.email,
                        message: 'forgot email sent'
                    }
                    resolve(result);

                }else {
                    reject({
                        message: 'user not verified'
                    });
                }
            })
            .catch(err => {
                reject({
                    message: 'user not registered'
                });

            });
        });
    }



    reset(req) {

        return new Promise((resolve, reject) => {

            userModel.findOne({ email: req.email })
                .then(data => {

                    let hash = util.hashPassword(req.new_password)
                    hash
                        .then(res => {

                            let request = {
                                _id: data._id,
                                password: res
                            }

                            userModel.reset(request)

                                .then(response => {
                                    resolve(response);
                                })
                                .catch(err => {
                                    reject(err);
                                })
                        })
                        .catch(err => {
                            reject(err);
                        })
                })
                .catch(err => {
                    reject(err);
                })
        })
    }
}


module.exports = new UserService();