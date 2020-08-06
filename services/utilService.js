require('dotenv').config();
const bcrypt = require('bcryptjs');

class UtilService {

    hashPassword(req) {

        return new Promise((resolve, reject) => {

            let saltRound = parseInt(process.env.SALT_ROUND);

            bcrypt.hash(req, saltRound)
                .then(data => {
                    resolve(data);
                })
                .catch(err => {
                    reject(err);
                })
        });
    }

    comparePassword(req, data, callback) {

        bcrypt.compare(req, data, (err, result) => {

            if (err) {
                callback(err);

            } else {
                callback(null, result);
            }
        })
    }
}

module.exports = new UtilService();