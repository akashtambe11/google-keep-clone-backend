const labelModel = require('../app/models/labelModel');
const noteModel = require('../app/models/noteModel');

class LabelService {

    add(req, callback) {

        labelModel.findOne({ label_name: req.label_name })
            .then(data => {
                // same label can be created infinetly so creating one lebel and reffering
                if (data) {
                    callback(null, data);

                } else {
                    labelModel.addLabel(req, (err, data) => {

                        if (err) {
                            callback(err);

                        } else {
                            callback(null, data);
                        }
                    })
                }
            })
            .catch(err => {
                callback(err);
            })
    }

    update(req, callback) {

        labelModel.update({ _id: req.label_id },
            { label_name: req.label_name },
            (err, data) => {

                if (err) {
                    callback(err)

                } else {
                    callback(null, data);
                }
            }
        )
    }

    search(req, query) {

        return new Promise((resolve, reject) =>{

            noteModel.findAndPopulate(req, query, (err, data) => {
                if(err) {
                    reject(err);

                } else {
                    resolve(data);
                }
            })
        })
    }

    // searchLabel(req) {

    //     return new Promise((resolve, reject) => {

    //         labelModel.findAll(req, (err, success) => {

    //             if (err) {
    //                 reject(err);

    //             } else {
    //                 resolve(success)
    //             }
    //         })
    //     })
    // }


    delete(req, callback) {

        labelModel.delete(req, (err, data) => {

            if (err) {
                callback(err);

            } else {
                callback(null, data);
            }
        })
    }

    getAllLabels(req) {

        return new Promise((resolve, reject) => {

            labelModel.findAll({ user_email: req.email }, (err, success) => {

                if (err) {
                    reject(err);

                } else {
                    resolve(success)
                }
            })
        })
    }
}

module.exports = new LabelService();