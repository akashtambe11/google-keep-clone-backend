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
                user_id: req.decoded.id // user_id from users collection of database
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
            response.message = 'addNote operation failed';
            res.status(404).send(response);
        }

    }
}

module.exports = new LabelController();