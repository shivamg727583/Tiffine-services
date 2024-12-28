const mongoose = require('mongoose');

const mongoDbURI = process.env.MongoDbURI;


const db =  mongoose.connect(mongoDbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB', err));


module.exports = db;
