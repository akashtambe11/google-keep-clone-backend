const mongoose = require('mongoose');

const noteSchema = mongoose.Schema({

    user_id: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true,
        // default: ''
    },
    description: {
        type: String,
        required: false,
        default: ''
    },
    lebel: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'lebel'
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

}

module.exports = new NoteModel();