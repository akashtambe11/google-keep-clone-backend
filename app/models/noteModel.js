const mongoose = require('mongoose');
const { rejects } = require('assert');

const noteSchema = mongoose.Schema({

    user_id: {
        type: String,
        require: true
    },
    title: {
        type: String,
        require: true,
        // default: ''
    },
    description: {
        type: String,
        require: false,
        default: ''
    },
    lebel: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'lebel'
    }],
    reminder: {
        type: Date,
        require: false,
        default: null
    },
    color: {
        type: String,
        require: false,
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