const labelService = require('../services/labelService');
const noteService = require('../services/noteService');

class LabelController {

    async addLabel(req, res) {

        try {

            req.check('label_name', 'name cannot be empty').notEmpty();

            const errors = await req.validationErrors();
            if (errors) {
                return res.status(422).json({ errors: errors })
            }

            let request = {
                label_name: req.body.label_name,
                user_email: req.decoded.email // user_id from users collection of database
            }

            console.log(request);

            labelService.add(request, (err, data) => {
                if (err) {
                    res.status(422).send(err);

                } else {
                    res.status(200).send(data);
                }
            });
        }
        catch (error) {
            let response = {};
            response.status = false;
            response.message = 'addLabel operation failed';
            res.status(404).send(response);
        }

    }

    // NOTE:
    // Non-exist labels are also get updated;
    // Add validation for the same;
    // First find reqested id by findOne method and then add validation 
    async updateLabel(req, res) {
        try {
            req.check('label_id', 'label id cannot be empty').notEmpty();
            req.check('label_name', 'label name cannot be empty').notEmpty();

            const errors = await req.validationErrors();
            if (errors) {
                res.status(422).json({ errors: errors })
            }

            labelService.update(req.body, (err, data) => {

                if (err) {
                    res.status(422).send(err);

                } else {

                    // getAllNotes controller not added yet -----
                    res.status(200).send(data);
                }
            })

        }
        catch (error) {
            let response = {};
            response.status = false;
            response.message = 'UpdateLabel operation failed';
            res.status(404).send(response);
        }
    }

    // NOTE:
    // Non-exist labels are also get deleted;
    // Add validation for the same;
    // First find reqested id by findOne method and then add validation 
    async deleteLabel(req, res) {
        req.check('label_id', 'Label Id cannot be empty').notEmpty();

        const errors = await req.validationErrors();
        if (errors) {
            res.status(422).json({ errors: errors });
        }

        let request = {
            _id: req.body.label_id
        }

        labelService.delete(request, (err, data) => {

            if (err) {
                res.status(422).send(err);

            } else {

                //removeLabel service not added yet -----
                res.status(200).send(data);
            }
        })
    }
}

module.exports = new LabelController();