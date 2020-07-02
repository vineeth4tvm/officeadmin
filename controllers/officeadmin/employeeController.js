var employeeregistrationmodel = require('../../models/employeeregistrationmodel');

exports.register = function(req, res){
    if(!req.session.username){
        res.redirect('/officeadmin/login?error=notsignedin');
    }
    else{
        var message = '';
        var message2 = '';
        if(req.query.emptyfields == 'true'){
            message = 'Please fill in all details and try again';
        }
        if(req.query.error){
            console.log(req.query.error);
            message2 = req.query.error;
        }
        var empid ='';
        //employeeregistrationmodel2 = new employeeregistrationmodel;
        //employeeregistrationmodel2.employeeid.find({},)
        var id;
        var employee = employeeregistrationmodel.find().sort({employeeid: -1}).limit(1);
        employee.exec(function(err, data){
            if(err){
                console.log(err);
            }
            else{
                var stringval = JSON.stringify(data);
                var objectval = JSON.parse(stringval);
                var id1 = objectval[0]['employeeid'];
                id = parseInt(id1) + 1;
                var ydate = Date.now();
                var year = ydate.getFullYear();
                //var id = parseInt(id1) + 1;
                console.log(id);
                res.render('emp_registration', {title : 'Register New Employee', msg: message, msg2: message2, empid: id});
            }
        })
        
        
    }

}

exports.saveemployee = function(req, res){
    employeeregistrationmodel1 = new employeeregistrationmodel;
    if(!req.session.username){
        req.session.destroy();
        res.redirect('/officeadmin/login?error=notsignedin');
    }
    else {
    if(req.body.fullname && req.body.dob && req.body.id_proof && req.body.idproofnumber && req.body.address_proof && req.body.addressproofnumber && req.body.address1 && req.body.address2 && req.body.address3 && req.body.pin && req.body.mobile && req.body.email && req.body.guardian_name && req.body.guardian_phone && req.body.guardian_address && req.body.employeedesignation ){
        employeeregistrationmodel1.fullname = req.body.fullname;
        employeeregistrationmodel1.dob = req.body.dob;
        employeeregistrationmodel1.id_proof = req.body.id_proof;
        employeeregistrationmodel1.idproofnumber = req.body.idproofnumber;
        employeeregistrationmodel1.address_proof = req.body.address_proof;
        employeeregistrationmodel1.addressproofnumber = req.body.addressproofnumber;
        employeeregistrationmodel1.address1 = req.body.address1;
        employeeregistrationmodel1.address2 = req.body.address2;
        employeeregistrationmodel1.address3 = req.body.address3;
        employeeregistrationmodel1.pin = req.body.pin;
        employeeregistrationmodel1.mobile = req.body.mobile;
        employeeregistrationmodel1.email = req.body.email;
        employeeregistrationmodel1.guardian_name = req.body.guardian_name;
        employeeregistrationmodel1.guardian_phone = req.body.guardian_phone;
        employeeregistrationmodel1.guardian_address = req.body.guardian_address;
        employeeregistrationmodel1.employeeid = req.body.employeeid;
        employeeregistrationmodel1.created_by = req.session.username;
        employeeregistrationmodel1.created_on = Date.now();
        employeeregistrationmodel1.updated_by = req.session.username;
        employeeregistrationmodel1.updated_on = Date.now();
        employeeregistrationmodel1.employeedesignation = req.body.employeedesignation;
        employeeregistrationmodel1.save(function (err, data){
            if(err){
                console.log('Error : '+err);
                res.redirect('/officeadmin/register?emptyfields=true&&error='+err);
            }

            else{
            res.render('employee_success', {
                 title : 'Employee Created!',
                 fullname : data.fullname,
                 dob: data.dob, 
                 id_proof: data.id_proof,
                 idproofnumber: data.idproofnumber, 
                 address_proof: data.address_proof,
                 addressproofnumber : data.addressproofnumber,
                 address1 : data.address1,
                 address2 : data.address2,
                 address3 : data.address3,
                 pin : data.pin,
                 mobile: data.mobile,
                 email : data.email,
                 guardian_name : data.guardian_name,
                 guardian_phone : data.guardian_phone,
                 guardian_address : data.guardian_address,
                 employeeid : data.employeeid,
                 created_by : data.created_by,
                 created_on : data.created_on,
                 updated_by : data.updated_by, 
                 updated_on : data.updated_on, 
                 employeedesignation : data.employeedesignation
                 })
            
            }
        });
    }

    else{
            res.redirect('/officeadmin/register?emptyfields=true');
        } 
    }
}

exports.edit = function(req, res){
    if(!req.session.username){
        req.session.destroy();
        res.redirect('/officeadmin/login?error=notsignedin');
    }
    if(req.query.username){

    }
    else{
        var err = [];
        err.status = 'Bad URL';
        err.stack = 'Please check the link that you clicked';
        res.render('error', {message: 'The page you are looking for could not be found', error : err} )
    }
 
    
}