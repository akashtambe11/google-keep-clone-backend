const mongoose = require('mongoose');

const noteSchema = mongoose.Schema({

    user_email: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true,
        default: ''
    },
    description: {
        type: String,
        required: false,
        default: ''
    },
    label: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'label'
        // default: []
    }],
    reminder: {
        type: Date,
        required: false,
        default: null
    },
    color: {
        type: String,
        required: false,
        default: null
    },
    isPinned: {
        type: Boolean,
        required: false,
        default: false
    },
    isArchived: {
        type: Boolean,
        required: false,
        default: false
    },
    isTrash: {
        type: Boolean,
        required: false,
        default: false
    },
}, 
    { timestamp: true }
)

const Note = mongoose.model('note', noteSchema); //note: collection name

class NoteModel {

    findOne(req) {

        return new Promise((resolve, reject) => {

            Note.findOne(req)
                .then(data => {
                    resolve(data);
                })
                .catch(err => {
                    reject(err);
                })
        });
    }

    findAll(req, callback) {

        Note.find(req, (err, data) => {

            if (err) {
                callback(err);

            } else {
                callback(null, data)
            }
        })
    }


    // findAndPopulate() {

    // }


    // findAllAndPopulate() {

    // }


    updateOne(req, payload, callback) {

        Note.findOneAndUpdate(req, payload, { new: true })
            .then(data => {
                callback(null, data);
            })
            .catch(err => {
                callback(err);
            })
    }


    updateMany(req, res, callback) { 

        Note.updateMany(req, res, { new: true })
            .then(data => {
                callback(null, data);
            })
            .catch(err => {
                callback(err);
            })
    }


    deleteOne(req, callback) {

        Note.findOneAndDelete(req) 
            .then(data => {
                callback(null, data);
            })
            .catch(err => {
                callback(err);  
            })
    } 

    add(req, callback) {
        const note = new Note({
            user_email: req.user_email,
            title: req.title,
            description: req.description,
            reminder: req.reminder,
            color: req.color,
            isPinned: req.isPinned,
            isArchived: req.isArchived,
            isTrash: req.isTrash
        })

        // Save method to save note in database
        note.save((err, data) => {

            if (err) {
                callback(err);

            } else {
                callback(null, data);
            }
        })
    }
}

module.exports = new NoteModel();