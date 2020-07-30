var mongoose = require('mongoose');

class Database {
    constructor() {
        this.mongoose = mongoose;
        this.port = process.env.PORT;
        this.host = process.env.HOST;
        this.uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/keepCloneDB';
    }

    connect() {
        this.mongoose.connect(this.uri, {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        this.monitor();
    }

    monitor(){
        mongoose.connection.on('connected', () => {
            console.log('Mongoose defualt connection open to: \n' + this.uri);
        });

        mongoose.connection.on('error', (err) => {
            console.log('Mongoose defualt connection error: \n' + err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('Mongoose defualt connection disconnected:');
        });
    }
}

module.exports = new Database();