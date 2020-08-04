const userModel = require('../app/models/userModel');
const util = require('../services/utilService');
const { register } = require('../controllers/userController');

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
}


module.exports = new UserService();