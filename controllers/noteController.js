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

            // request payload object
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


    // getListing(req, res) {

    // }


    getAllNotes(req, res) {
        try {

            noteService.getAllNotes(req.decoded)
                .then(result => {
                    res.status(200).send(result);

                })
                .catch(err => {
                    res.status(422).send(err);

                })

        }
        catch (error) {
            res.status(422).send({ message: "Operation failed" });
        }
    }


    searchNotes(req, res) {
        try {

            // search content should bi in body
            if ('search' in req.body && 'email' in req.decoded) {

                req.check('search', 'search content cannot be empty').notEmpty();

                const errors = req.validationErrors();
                if (errors) {
                    res.send(422).json({ errors: errors })
                }

                // request payload object
                let request = {
                    email: req.decoded.email,
                    search: req.body.search
                }

                // searchNote called to search for require note
                noteService.searchNote(request, (err, result) => {

                    if (err) {
                        res.status(422).send(err);

                    } else {
                        res.status(200).send(result);
                    }
                });

            } else {
                return res.status(422).send({ message: "no search field found in request body" });
            }
        }
        catch (error) {
            let response = {};
            response.status = false;
            response.data = error;
            res.status(404).send(response);
        }
    }

}

module.exports = new NoteController();