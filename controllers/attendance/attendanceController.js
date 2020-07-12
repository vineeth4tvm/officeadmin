var attendancemodel = require('../../models/attendancemodel');
var employeeregistrationmodel = require('../../models/employeeregistrationmodel');
const e = require('express');
const session = require('express-session');

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
 //   if(!req.session.username){
   //     req.session.destroy();
   //     res.redirect('/officeadmin/login?error=notsignedin');
   // }
  //  else
     if(req.body.employeeid && req.body.dob && req.body.time){
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
                    res.render('error', {message: message});        
                }
                else if(data == null){
                    
                    console.log('Could not find the requested employee because :'+err);
                    message = 'The user id '+employeeid+' does not exist.</br>It may have already been deleted';
                    res.render('error', {message: message});
                    }
                else{
                    console.log(data);
                    var date1 = new Date;
                    
                    var year1 = date1.getUTCFullYear();
                    year1 = year1.toString();
                    var month1 = date1.getUTCMonth();
                    month1 = month1.toString();
                    var day1 = date1.getUTCDate();
                    day1 = day1.toString();
                    var datestring = year1+month1+day1;
                    
                    var hours1 = date1.getUTCHours().toString();
                    var minutes1 = date1.getUTCMinutes().toString();
                    var seconds1 =  date1.getUTCSeconds().toString();
                    var timestring= hours1+' '+minutes1+' '+seconds1;
                    
                    var attendancemodel1 = new attendancemodel;
                    
                    attendancemodel1.employeeid = employeeid;
                    attendancemodel1.date = datestring;
                    
                    var timetype = req.body.time;

                    if(timetype == 'in'){
                        attendancemodel1.intime = timestring;
                    }
                    else if(timetype == 'out'){
                        attendancemodel1.outtime = timestring;
                    }
                    else{
                        res.render('error', {message: 'The time type given in the request is invalid. Set either In or Out'})
                    }

                    attendancemodel1.markedtime = Date.now();
                    attendancemodel1.markedby = req.session.username;
                    attendancemodel1.modifiedtime = Date.now();
                    attendancemodel1.modifiedby = req.session.username;

                    attendancemodel1.save( function(err, data){
                        if(err){
                            console.log('Could not mark attendance because :'+err)
                            message = 'The user id '+employeeid+' could not be deleted.</br>It may have already been deleted</br>'+err;
                            res.render('error', {message: message});
                        }
                        else{
                            console.log('Attendance has been marked for the user id '+employeeid)
                            message = 'Attendance has been marked for the user id '+employeeid;
                            res.render('attendance/attendancesuccess', {message: message, data: data});
                        }
                    }); 
                }

            })





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