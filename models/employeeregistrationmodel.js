var mongoose = require('mongoose');
var mongoDB1 = 'mongodb://127.0.0.1:27017/officeadmin';
mongoose.connect(mongoDB1, { useUnifiedTopology: true, useNewUrlParser: true });
mongoose.set('useCreateIndex', true);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var Schema = mongoose.Schema;

var employeeregistrationSchema = new Schema({
    fullname:{
        type: String, required: true
    },
    dob : {
        type: Number, required: true
    },
    id_proof:{
        type: String, required: true
    },
    idproofnumber:{
        type: String, required: true, unique: true
    },
    address_proof:{
        type: String, required: true
    },
    addressproofnumber:{
        type: String, required: true, unique: true
    },
    address1:{
        type: String, required: true
    },
    address2:{
        type: String, required: true
    },
    address3:{
        type: String, required: true
    },
    pin:{
        type: String, required: true
    },
    mobile:{
        type: String, required: true, unique: true
    },
    email:{
        type: String, required: true, unique: true
    },
    guardian_name:{
        type: String, required: true
    },
    guardian_phone:{
        type: String, required: true
    },
    guardian_address:{
        type: String, required: true
    },
    created_on:{
        type: Number
    },
    updated_on:{
        type: Number, required: true
    },
    created_by:{
        type: String
    },
    updated_by:{
        type: String
    },
    employeeid:{
        type: Number,
        unique: true,
        required: true
    },
    employeedesignation:{
        type: String,
        required: true
    },
    employmentstatus:{
        type: String,
        required: true
    },
    joiningdate:{
        type: Number,
        required: true
    },
    salary:{
        type: Number,
        required: true
    },
    idfile:{ 
        type: String, 
    },
    addressfile:{ 
        type: String,      
    }, 
    photo:{ 
        type: String,  
    }
});

var employeeregistration = mongoose.model('employeeregistration', employeeregistrationSchema);

module.exports = employeeregistration;