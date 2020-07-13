var mongoose = require('mongoose');
var mongoDB2 = 'mongodb+srv://vineeth4tvm:bluebridge@cluster0-skw0g.mongodb.net/officeadmin?retryWrites=true&w=majority';
mongoose.connect(mongoDB2, { useUnifiedTopology: true, useNewUrlParser: true });
mongoose.set('useCreateIndex', true);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var Schema = mongoose.Schema;

var attendanceSchema = new Schema({
    employeeid:{
        type: Number, 
    },
    date : {
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