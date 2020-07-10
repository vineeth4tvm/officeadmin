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
                var id = "01";
                if(data != ''){
                var stringval = JSON.stringify(data);
                var objectval = JSON.parse(stringval);
                var id1 = objectval[0]['employeeid'].toString();
                id1 = id1.substr(-2);
                id = parseInt(id1) + 1;
                if(id < 10){
                    id= "0"+id.toString();
                }
            }
                var year = new Date().getFullYear();
                var emid = year+id.toString();
                console.lo</tr>g(id);
                res.render('emp_registration', {title : 'Register New Employee', msg: message, msg2: message2, empid: emid});
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
        employeeregistrationmodel1.employmentstatus = req.body.employmentstatus;
        employeeregistrationmodel1.joiningdate = req.body.joiningdate;
        employeeregistrationmodel1.save(function (err, data){
            if(err){
                console.log('Error : '+err);
                res.redirect('/officeadmin/register?emptyfields=true&&error='+err);
            }

            else{
            res.render('employee_success', {
                 title : 'Employee Created!',
                 titlemsg: 'New Employee has been successfully Created',
                 employee : data
                 })
            
            }
        });
    }

    else{
            res.redirect('/officeadmin/register?emptyfields=true');
        } 
    }
}

exports.delete = function(req, res){
    if(!req.session.username){
        req.session.destroy();
        res.redirect('/officeadmin/login?error=notsignedin');
    }
    else if(req.query.employeeid){
        var employeeid = parseInt(req.query.employeeid);
        console.log(employeeid);
        if(isNaN(employeeid)){
            console.log('Bad value given as employee id');
            message = 'The userid you have entered is wrong. Please verify and try again!';
            res.render('deleteemployee', {message: message});
        }
        else { 
            employeeregistrationmodel.findOne({employeeid : employeeid}, 'employeeid', function (err, data){
            if (err) {
                console.log('Could not connect to the database because :'+err);
                message = 'Could not connect to database because : '+err;
                res.render('deleteemployee', {message: message});        
            }
            else if(data == null){
                
                console.log('Could not find the requested employee because :'+err);
                message = 'The user id '+employeeid+' does not exist.</br>It may have already been deleted';
                res.render('deleteemployee', {message: message});
                }
            else{
                console.log(data);
                employeeregistrationmodel.deleteOne({employeeid : employeeid}, function(err){
                    if(err){
                        console.log('Could not delete the requested employee because :'+err)
                        message = 'The user id '+employeeid+' could not be deleted.</br>It may have already been deleted</br>'+err;
                        res.render('deleteemployee', {message: message});
                    }
                    else{
                        console.log('The employee you requested '+employeeid+' has been successfully deleted')
                        message = 'The user id <b>'+employeeid+'</b> has been deleted successfully';
                        res.render('deleteemployee', {message: message});
                    }
                }); 
            }
          
        });
    }
    }
        else{

            console.log('employeeid not given in url '+employeeid+' has been successfully deleted')
                        message = 'The employee id has not been selected.</br>Please go back and make sure you click on a valid link';
                        res.render('deleteemployee', {message: message});
                    }
}

exports.edit = function(req, res){
    if(!req.session.username){
        req.session.destroy();
        res.redirect('/officeadmin/login?error=notsignedin');
    }
    var message = '';
    var message2 = '';
    if(req.query.emptyfields == 'true'){
        message = 'Please fill in all details and try again';
    }

    if(req.query.error){
        console.log(req.query.error);
        message2 = req.query.error;
    }

    if(req.query.employeeid){
        var employeeid = parseInt(req.query.employeeid);
        console.log(employeeid);
        if(isNaN(employeeid)){
            console.log('Bad value given as employee id');
            var error = [];
            error.status = 'The userid you have entered is wrong. Please verify and try again!';
            res.render('error', {error: error});
        }
        else { 
            employeeregistrationmodel.findOne({employeeid : employeeid}, {}, function (err, data){
            if (err) {
                console.log('Could not connect to the database because :'+err);
                var error = [];
                error.status = 'Could not connect to the database because :'+err;
                error.stack = 'error in fetching employee details.</br>Please check your internet connection';
                res.render('error', {error: error});
            }
            else if(data == null){
                
                console.log('Could not find the requested employee because :'+err);
                
                var error = [];
                error.status = 'Could not find the requested employee because :'+err;
                error.stack = 'Error in fetching employee details.</br>Please check your internet connection';
                res.render('error', {error: error});
                }
            else{
                console.log(data);
                        //console.log('The employee you requested '+employeeid+' has been successfully deleted')
                        //message = 'The user id <b>'+employeeid+'</b> has been deleted successfully';
                    res.render('emp_edit', {data : data, message: message, message2: message2});
                   
                }; 
            });
        }
          
    }
        else{

            console.log('employeeid not given in url '+employeeid+' has been successfully deleted')
                    var error = [];
                    error.status = 'No employee id given in URL. Please check the link you clicked.'
                    message = 'The employee id has not been selected.</br>Please go back and make sure you clicked on a valid link';
                    res.render('error', {error: error, message : message});
            }

    }

exports.view = function(req, res){
    if(!req.session.username){
        req.session.destroy();
        res.redirect('/officeadmin/login?error=notsignedin');
    }

    else { employeeregistrationmodel.find({}, 'fullname employeeid employeedesignation joiningdate employmentstatus employeeid', function(err, data){
        if(err){
            var error = [];
            error.status = 'server connection error';
            error.stack = 'error in fetching employee list';
            res.render('error', {error: error});
        }


        else{
            var message = '';
            if(data == ''){
             message = 'No employees available in the database';   
            }
            else{
                
            
            }
            res.render('view_employees', {employee: data, message: message});
        }
    });
    }

}

exports.update = function(req, res){

    //employeeregistrationmodel2 = new employeeregistrationmodel;
    if(!req.session.username){
        req.session.destroy();
        res.redirect('/officeadmin/login?error=notsignedin');
    }
    else {
    if(req.body.fullname && req.body.dob && req.body.id_proof && req.body.idproofnumber && req.body.address_proof && req.body.addressproofnumber && req.body.address1 && req.body.address2 && req.body.address3 && req.body.pin && req.body.mobile && req.body.email && req.body.guardian_name && req.body.guardian_phone && req.body.guardian_address && req.body.employeedesignation ){
        employeeregistrationmodel.updateOne({employeeid : req.body.employeeid} , {
        fullname : req.body.fullname,
        dob : req.body.dob,
        id_proof : req.body.id_proof,
        idproofnumber : req.body.idproofnumber,
        address_proof : req.body.address_proof,
        addressproofnumber : req.body.addressproofnumber,
        address1 : req.body.address1,
        address2 : req.body.address2,
        address3 : req.body.address3,
        pin : req.body.pin,
        mobile : req.body.mobile,
        email : req.body.email,
        guardian_name : req.body.guardian_name,
        guardian_phone : req.body.guardian_phone,
        guardian_address : req.body.guardian_address,
        updated_by : req.session.username,
        updated_on : Date.now(),
        employeedesignation : req.body.employeedesignation,
        employmentstatus : req.body.employmentstatus,
        joiningdate : req.body.joiningdate,
        },function (err, data){
            if(err){
                console.log('Error : '+err);
                res.redirect('/officeadmin/editemployee?employeeid='+req.body.employeeid+'&emptyfields=true&&error='+err);
            }

            else{
            
                employeeregistrationmodel.findOne({employeeid : req.body.employeeid}, {}, function (err, data){
                    if (err) {
                        console.log('Could not connect to the database because :'+err);
                        var error = [];
                        error.status = 'Could not connect to the database because :'+err;
                        error.stack = 'error in fetching employee details.</br>Please check your internet connection';
                        res.render('error', {error: error});
                    }
                    else if(data == null){
                        
                        console.log('Could not find the requested employee because :'+err);
                        
                        var error = [];
                        error.status = 'Could not find the requested employee because :'+err;
                        error.stack = 'Error in fetching employee details.</br>Please check your internet connection';
                        res.render('error', {error: error});
                        }
                    else{
                        console.log(data);
                                //console.log('The employee you requested '+employeeid+' has been successfully deleted')
                                //message = 'The user id <b>'+employeeid+'</b> has been deleted successfully';
                            res.render('employee_success', {employee : data, message: 'Changes saved successfully'});
                           
                        }; 
                });




            }
        });
    }

    else{
            res.redirect('/officeadmin/editemployee?employeeid='+req.body.employeeid+'&emptyfields=true');
        } 
    }

}


exports.profile = function(req, res){
    if(!req.session.username){
        req.session.destroy();
        res.redirect('/officeadmin/login?error=notsignedin');
    }
    else if(req.query.employeeid){
        var employeeid = parseInt(req.query.employeeid);
        console.log(employeeid);
        if(isNaN(employeeid)){
            console.log('Bad value given as employee id');
            message = 'Bad url. The userid you have entered is wrong. Please verify and try again!';
            res.render('error', {message: message});
        }
        else { 
            employeeregistrationmodel.findOne({employeeid : employeeid}, {}, function (err, data){
            if (err) {
                console.log('Could not connect to the database because :'+err);
                message = 'Could not connect to database because : '+err;
                res.render('error', {message: message});        
            }
            else if(data == null){
                
                console.log('Could not find the requested employee because :'+err);
                message = 'The user id '+employeeid+' does not exist. It may have already been deleted';
                res.render('error', {message: message});
                }
            else{

                res.render('employeeprofile', {employee : data});
               
            }
          
        });
    }
    }

    else{
        var error = [];
        var message = "Couldn't read employeeid.";
        error.status = "Make sure you clicked on a valid link";
        error.stack = 'You may report this error to admin';

        console.log('employeeid not given in url ')
        message = 'The employee id has not been selected. </br>Please go back and make sure you clicked on a valid link';
        res.render('error', {message: message, error: error});
    
    }
}

