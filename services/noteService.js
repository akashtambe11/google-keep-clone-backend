// const redis = require('./cache');

const noteModel = require('../app/models/noteModel');
const labelService = require('./labelService');

class NoteService {

    add(req, callback) {

        // add method called to save note
        noteModel.add(req, (err, res) => {

            if (err) {
                callback(err);

            } else {
                let count = 0;

                // If label not found in body
                if (!('label' in req) || req.label.length == 0) {

                    //this.getAllNotes({email:req.user_email});
                    callback(null, res);

                }

                // Each label get index, and one by one label will be added in array
                for (let i = 0; i < req.label.length; i++) {

                    let newLabelPayload = {
                        user_email: req.user_email,
                        label_name: req.label[i]
                    }

                    // Label service is called to add label attached to note
                    labelService.add(newLabelPayload, (err, result) => {

                        if (result._id != null) {

                            // To add all labels in label array
                            let labelID = [];
                            labelID.push(result._id);

                            // To create object for update in mongoDB
                            let label = {
                                $addToSet: {
                                    label: labelID
                                }
                            }

                            // Update note according to title
                            noteModel.updateOne({ title: req.title }, label, (error, success) => {

                                if (error) {
                                    callback(error);

                                } else {
                                    count++;

                                    // Callback all data when count reaches to label length
                                    if (count == req.label.length) {

                                        callback(null, success);
                                    }
                                }
                            });

                        } else if (err) {
                            callback(err);

                        } else {
                            callback({ message: "Id not found" });
                        }
                    });
                }


            }
        })
    }

    getAllNotes(req) {

        return new Promise((resolve, reject) => {

            noteModel.findAllAndPopulate({ user_email: req.email }, (err, data) => {

                if (err) {
                    reject(err);

                } else {

                    // Intialise empty array to push data in it.
                    let noteArray = [];

                    for (let i = 0; i < data.length; i++) {

                        if (data[i].reminder == null) {

                            let request = {
                                id: data[i]._id,
                                title: data[i].title,
                                description: data[i].description,
                                label: data[i].label,
                                reminder: data[i].reminder,
                                color: data[i].color,
                                isPinned: data[i].isPinned,
                                isArchived: data[i].isArchived,
                                isTrash: data[i].isTrash,
                            }
                            noteArray.push(request);

                        } else {
                            //  --------------- not null reminder not added yet
                            console.log("reminder with not null will be added later");
                        }
                    }
                    // ----------- redis set to be added here
                    resolve(data)

                }
            })
        })
    }

    
}

module.exports = new NoteService();