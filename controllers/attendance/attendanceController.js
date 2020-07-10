var attendancemodel = require('../../models/attendancemodel');
var employeeregistrationmodel = require('../../models/employeeregistrationmodel');

exports.home = function(req, res){
    res.render('attendance/attendancehome');
}
exports.mark = function(req, res){
    if(!req.session.username){
        req.session.destroy();
        res.redirect('/officeadmin/login?error=notsignedin');
    }
    else {
            
        if(req.query.time){
        
            if(req.query.time == 'in'){
                res.render('attendance/mark_attendance', {time: 'in'})
            }

            else if(req.query.time == 'out') {
                res.render('attendance/mark_attendance', {time: 'out'})
            }

            else {
                res.render('attendance/choose_attendance');
            }
        }

        else {
            res.render('attendance/choose_attendance');
        }
        
    
    }

}

exports.postmark = function(req, res){
    if(!req.session.username){
        req.session.destroy();
        res.redirect('/officeadmin/login?error=notsignedin');
    }
    else if(req.body.employeeid && req.body.dob && req.body.time){
        var employeeid = parseInt(req.body.employeeid);
        if(isNaN(employeeid)){
            if(req.body.time){
                res.render('attendance/mark_attendance', {time: req.body.time, message : 'Please fill in all details'})
            }
            else{
                res.render('attendance/mark_attendance', {time: 'in', message : 'Please fill in all details'});
            }
        }
        else{
            

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
                    var date1 = new Date;
                    var year = date1.getFullYear;
                    var month = date1.getMonth;
                    var day = date1.getDate; 
                    var attendancemodel1 = new attendancemodel;
                    attendancemodel1.employeeid = employeeid;
                    employeeregistrationmodel.save( function(err, data){
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







        }
       
 

    }

    else{
        if(req.body.time){
            res.render('attendance/mark_attendance', {time: req.body.time, message : 'Please fill in all details'})
        }
        else{
            res.render('attendance/mark_attendance', {time: 'in', message : 'Please fill in all details'});
        }
    }
}