var mongoose = require('mongoose');
var mongoDB2 = 'mongodb+srv://cluster0.skw0g.mongodb.net/officeadmin?retryWrites=true&w=majority';
//'mongodb://127.0.0.1:27017/officeadmin';
mongoose.connect(mongoDB2, { useUnifiedTopology: true, useNewUrlParser: true, user: 'vineeth4tvm', pass: 'Bluebridge@2021' });
mongoose.set('useCreateIndex', true);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var Schema = mongoose.Schema;

var attendanceSchema = new Schema({
    employeeid:{
        type: Number, 
    },
    year : {
        type: String, 
    },
    month : {
        type: String, 
    },
    day : {
        type: String, 
    },
    intime:{
        type: String
    },
    outtime:{
        type: String
    },
    markedtime:{
        type: String, 
    },
    markedby:{
        type: String, 
    },
    modifiedby:{
        type: String, 
    },
    modifiedtime:{
        type: String,
    }
});

var attendance = mongoose.model('attendance', attendanceSchema);

module.exports = attendance;