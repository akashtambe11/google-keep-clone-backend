const noteService = require('../services/noteService');

class NoteController {

    //addNote api to create new note
    async addNote(req, res) {
        try {

            req.check('title', 'Title cannot be empty').notEmpty();

            const errors = await req.validationErrors();
            if (errors) {
                res.send(422).json({ errors: errors });
            }

            // requset payload object
            let request = {
                user_email: req.decoded.email,
                title: req.body.title,
                description: req.body.description,
                label: req.body.label || null,
                reminder: req.body.reminder || null,
                color: req.body.color || null,
                isPinned: req.body.isPinned || false,
                isArchived: req.body.isArchived || false,
                isTrash: req.body.isTrash || false
            }

            // note service called and request object is passed to it
            noteService.add(request, (err, data) => {

                if (err) {
                    res.status(422).send(err);
                    
                } else {
                    
                    // addNote output
                    let response = {
                        id: data._id,
                        title: data.title,
                        message: 'note created successfully'
                    }
                    res.status(200).send(response)
                }
            }) 

        }
        catch (error) {
            let response = {};
            response.status = false;
            response.message = error.message;
            res.status(404).send(response); 
        }
    }

}

module.exports = new NoteController();