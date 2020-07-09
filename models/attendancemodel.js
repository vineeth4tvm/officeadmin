var mongoose = require('mongoose');
var mongoDB2 = 'mongodb+srv://vineeth4tvm:bluebridge@cluster0-skw0g.mongodb.net/officeadmin?retryWrites=true&w=majority';
mongoose.connect(mongoDB1, { useUnifiedTopology: true, useNewUrlParser: true });
mongoose.set('useCreateIndex', true);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var Schema = mongoose.Schema;

var attendanceSchema = new Schema({
    employeeid:{
        type: Number, required: true
    },
    date : {
        type: String, required: true
    },
    intime:{
        type: String, required: true
    },
    outtime:{
        type: String, required: true, unique: true
    },
    markedtime:{
        type: String, required: true
    },
    markedby:{
        type: String, required: true, unique: true
    },
    modifiedby:{
        type: String, required: true
    },
    modifiedtime:{
        type: String, required: true
    }
});

var attendance = mongoose.model('attendance', attendanceSchema);

module.exports = attendance;