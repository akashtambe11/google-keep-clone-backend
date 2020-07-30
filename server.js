// In-build imports
const app = require('express')();
const http = require('http').createServer(app);
const expressValidator = require('express-validator')
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');

// Environment access
require('dotenv').config();
const port = process.env.PORT || 3000;

// Custom imports
const routes = require('./routes/routes');
const database = require('./config/database.config');


// To get Methods logs in console 
app.use(morgan('dev'));

//  Parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded(
    {
        extended: true
    }
));

// To connect Node js and Client site application (Diff Port) together for communication
// Cross-Origin Resource Sharing
app.use(cors(
    {
        'origin': '*'
    }
));

app.use(bodyParser.json());
// app.use(expressValidator());

// To navigate on routes file
// app.use('/', routes);

// Demo route check
app.get('/', (req, res) => {
    res.send('Hello from Keep Clone App');
});

// Listen to server request
http.listen(port, () => {
    database.connect();
    console.log('server is running on Port ' + port);
})