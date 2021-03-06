const mongoose = require('mongoose');

const labelSchema = mongoose.Schema({

    user_email: {
        type: String,
        required: true
    },
    label_name: {
        type: String,
        required: true,
        unique: true
    }
});

const Label = mongoose.model('label', labelSchema); //label: collection name

class LabelModel {

    // Method to find requested data in Database.
    findOne(req) {

        return new Promise((resolve, reject) => {

            Label.findOne(req)

                .then(data => {
                    resolve(data);
                })
                .catch(err => {
                    reject(err);
                })
        })
    }

    // Method to find requested all data in Database.
    findAll(req, callback) {


        console.log(req);
        Label.find(req, (err, data) => {

            if (err) {
                callback(err);

            } else {
                //condition to check availability of data
                if (data.length != 0) {
                    callback(null, data);

                } else {
                    callback({
                        message: "data not found"
                    });
                }
            }
        });
    }

    // Method to update requested data in Database.
    update(req, res, callback) {

        Label.findOneAndUpdate(req, res, { new: true })

            .then(data => {
                callback(null, data);
            })
            .catch(err => {
                callback(err)
            })
    }

    // Method to delete requested data in Database.
    delete(req, callback) {

        Label.findOneAndDelete(req, (err, data) => {

            if (err) {
                callback(err);

            } else {
                callback(null, data);
            }
        })
    }

    addLabel(req, callback) {

        let lebelObject = new Label({
            label_name: req.label_name,
            user_email: req.user_email
        })

        lebelObject.save((err, data) => {

            if (err) {
                callback(err);

            } else {

                let response = {
                    // addLabel output
                    status: true,
                    _id: data._id, //lebel id
                    label_name: data.label_name,
                    message: "label created succesfully"
                }
                callback(null, response);
            }
        })
    }


}

module.exports = new LabelModel();