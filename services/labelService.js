const labelModel = require('../app/models/labelModel');

class LabelService {

    add(req, callback) {

        labelModel.findOne({ label_name: req.label_name })
            .then(data => {
                // same label can be created infinetly so creating one lebel and refering
                if (data) {
                    //removed null i.e. (null, data)
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
}

module.exports = new LabelService();