var attendancemodel = require('../../models/attendancemodel');
var employeeregistrationmodel = require('../../models/employeeregistrationmodel');
const e = require('express');
const session = require('express-session');
const attendance = require('../../models/attendancemodel');

//show attendance homepage with summary of present date attendance
exports.home = function(req, res){
    if(!req.session.username){
        req.session.destroy();
        res.redirect('/officeadmin/login?error=notsignedin');
    }
    else {
        if(req.query.date){
            var viewdate = parseInt(req.query.date);
            var message = 'Status of Attendance for date '+viewdate;
        }
        else{
            var date1 = new Date;
            var year1 = date1.getUTCFullYear();
            year1 = year1.toString();
            var month1 = date1.getUTCMonth() + 1;
            month1 = month1.toString();
            var day1 = date1.getUTCDate();
            day1 = day1.toString();
            var viewdate = year1+month1+day1;
            var message = 'Todays attendance status';
        } 
            if(isNaN(viewdate)){
                res.render('error', {message: 'invalid value given as date'});
            }
            else{
                employeeregistrationmodel.find({employmentstatus : 'employed'},'fullname employeedesignation employeeid', function(err, data){
                    if(err){
                        res.render('error', {message : 'couldnt connect to databasae because '+err});
                    }
                    if(!data){
                        res.render('attendancehome',{message: 'No employees found in the database'});
                    }

                    else{
                    var employeelist = {};
                    attendancemodel.find({date: viewdate}, function(err, attdata){
                        
                        var key = 0 ;
                        var attresult = {};   
                                            
                        
                        for (const property in data) {
                            
                            var subattdata = attdata.filter(item => item.employeeid == `${data[property]['employeeid']}`);
                            
                            
                            console.log(typeof(subattdata[0]));
                            if(subattdata.length){
                            console.log('employee list empname: '+`${data[property]['fullname']}` +' , attdata empl id :  '+ subattdata[0]['employeeid']);
                            if(`${data[property]['employeeid']}` == subattdata[0]['employeeid']){
                               
                                attresult[key] = {};

                                attresult[key] = subattdata[0];

                                attresult[key]['fullname'] = `${data[property]['fullname']}`;
                                
                                
                            }
                            key++;
                        
                        }
                        else{
                            attresult[key]={};
                            attresult[key]= {fullname: `${data[property]['fullname']}`,
                            employeeid : `${data[property]['employeeid']}`,
                            intime: 'na',
                            outtime: 'na',
                            date: viewdate
                            };
                            key++; 

                        }
                    }

                        res.render('attendance/attendancehome', {attresult: attresult, message : message});
                        //{message: empresult}}
                       
                   

                    //var date2 = new Date();
                    //console.log('Date in employee list is : '+ attdata);
                    //var empresult = employeelist['1'].fullname;
                    
                    //console.log(attresult[1]['fullname']);
                        
                    
                    }
                    ).lean()}
                    
            }

                )}
        
    
    }
}


//show attendance marking page with correct type according to the type value in the clicked link

exports.mark = function(req, res){
    if(!req.session.username){
        req.session.destroy();
        res.redirect('/officeadmin/login?error=notsignedin');
    }
    else {
            
        if(req.query.time){
        //show attendance marking page with correct type according to the type value in the clicked link
            if(req.query.time == 'in'){
                res.render('attendance/mark_attendance', {time: 'intime'})
            }

            else if(req.query.time == 'out') {
                res.render('attendance/mark_attendance', {time: 'outtime'})
            }

            else {
                res.render('attendance/choose_attendance');
            }
        }
        //show choose attendance type page if timetype is not given in url
        else {
            res.render('attendance/choose_attendance');
        }
        
    
    }

}

//processing work part of attendance mark request

exports.postmark = function(req, res){
   if(!req.session.username){
     req.session.destroy();
     res.redirect('/officeadmin/login?error=notsignedin');
  }
 else{
     
     //if all values are receieved from post request then proceed to marking process
     if(req.body.employeeid && req.body.dob && req.body.time){
        var employeeid = parseInt(req.body.employeeid);

        //Check if Nan value is present in employee id. often due to bad values in form data [non numeric values] db requests can fail.
        if(isNaN(employeeid)){
            if(req.body.time){
                res.render('attendance/mark_attendance', {time: req.body.time, message : 'Please fill in all details'})
            }
            else{
                res.render('attendance/mark_attendance', {time: 'in', message : 'Please fill in all details'});
            }
        }
        //update existing attendance collection entry/document whose value is '' with present time
        else{
            //checking if emp id is correct
            employeeregistrationmodel.findOne({employeeid : employeeid}, 'employeeid dob', function (err, data){
                if (err) {
                    console.log('Could not connect to the database because :'+err);
                    message = 'Could not connect to database because : '+err;
                    res.render('error', {message: message});        
                }
                else if(data == null){
                    
                    console.log('Could not find the requested employee because :'+err);
                    message = 'The user id '+employeeid+' does not exist. It may have been deleted';
                    res.render('attendance/mark_attendance', {time: req.body.time, message: message});
                    }
                else{
                    if (req.body.dob == data.dob) {
                        var date1 = new Date;
                        var year1 = date1.getUTCFullYear();
                        year1 = year1.toString();
                        var month1 = date1.getUTCMonth() + 1;
                        month1 = month1.toString();
                        var day1 = date1.getUTCDate();
                        day1 = day1.toString();
                        var datestring = year1+month1+day1;

                    var hours1 = date1.getUTCHours().toString();
                    var minutes1 = date1.getUTCMinutes().toString();
                    var seconds1 =  date1.getUTCSeconds().toString();
                    var timestring= hours1+' '+minutes1+' '+seconds1;
                        //checking if attendance entry exists for given date.
                    attendancemodel.count({employeeid : employeeid, date : datestring}, function(err, count){
                    
                    
                    var timetype = req.body.time;
                    console.log('value of timetype is :'+timetype);
                    employeeid = req.body.employeeid;
                    date = datestring;

                    if(count == 1){
                        
                        if(timetype != 'intime' && timetype != 'outtime') {
                            res.render('error', {message: 'The time type given in the request is invalid. Set either In or Out'})
                        }
                        else {
                        // get data from attendance entry to find if already marked or yet to be marked  
                attendancemodel.findOne({employeeid : employeeid, date: datestring}, function(err, data){
                        if(err){
                            res.render('error', {message: 'error in connection :'+err});
                        }    
                        console.log(timetype);
                        if(data[timetype] != 'na'){
                            console.log('data timetype is '+typeof(data[timetype]));
                            var message = timetype.toUpperCase()+' already marked for '+employeeid+' at '+data[timetype];
                            res.render('attendance/mark_attendance', {time: req.body.time, message: message});
                        }
                        else if (data[timetype] == 'na'){
                            console.log('data timetype is '+typeof(data[timetype]));
                            
                            //update the attendance entry  timwetype with time.
                            attendancemodel.updateOne({employeeid : employeeid, date: datestring},{
                                
                            [timetype]: timestring,
                            modifiedtime : timestring,
                            modifiedby : req.session.username  

                            }, function(err, count){

                                if(err){

                                    res.render('error', {message: 'couldnt mark attendance because : '+error});

                                }

                                else{
                                    res.render('attendance/attendancesuccess', {message: 'attendance marked for '+ employeeid + ' at '+timestring });
                                }

                            })
                        }
                    })
                    }  
                }

              //create a new attendance entry if time is not marked in timetype column ie, intime or outtime  and timeype column value is not '',
              //then create a collection entry with all details with value '' for the other time type

                else {

                    var timetype = req.body.time;
                    var outtime = 'na';
                    var intime = 'na';

                    if(timetype == 'intime'){
                        
                        intime = timestring;
                    }
                    else if(timetype == 'outtime'){
                       
                        outtime = timestring;
                    }
                    else{
                        res.render('error', {message: 'The time type given in the request is invalid. Set either In or Out'})
                    }

                        attendancemodel1 = new attendancemodel;
    
                        attendancemodel1.employeeid = employeeid;
                        attendancemodel1.date = datestring;
                        attendancemodel1.intime = intime;
                        attendancemodel1.outtime = outtime;
                        attendancemodel1.markedtime = Date.now();
                        attendancemodel1.markedby = req.session.username;
                        attendancemodel1.modifiedtime = Date.now();
                        attendancemodel1.modifiedby = req.session.username;
    
                        attendancemodel1.save( function(err, data){
                            if(err){
                                console.log('Could not mark attendance because :'+err)
                                message = 'Could not mark attendance for '+employeeid+' because </br>'+err;
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

                else{
                    res.render('attendance/mark_attendance', {time: req.body.time, message : 'please check date of birth enterd for employee: '+employeeid});
                }
            }
          
        })
    }
     }

    else{
        if(req.body.time){
            res.render('attendance/mark_attendance', {time: req.body.time, message : 'Please fill in all details'})
        }
        else{
            res.render('attendance/choose_attendance');
        }
    }
    }
}