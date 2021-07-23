var attendancemodel = require('../../models/attendancemodel');
var employeeregistrationmodel = require('../../models/employeeregistrationmodel');
const session = require('express-session');
const attendance = require('../../models/attendancemodel');

//show attendance homepage with summary of present date attendance
exports.home = function(req, res){
    if(!req.session.username){
        req.session.destroy();
        res.redirect('/officeadmin/login?error=notsignedin');
    }
    else {
        if(req.query.year && req.query.month && req.query.day){
            var year = parseInt(req.query.year);
            var year1 = year.toString();
            var month = parseInt(req.query.month);
            var month1 = month.toString();
            var day = parseInt(req.query.day);
            var day1 = day.toString();

            var message = 'Status of Attendance for date '+day1+'-'+month1+'-'+year1;
        }
        else{
            var date1 = new Date(Date.now()+19800000);
            var year1 = date1.getUTCFullYear();
            year1 = year1.toString();
            var month1 = date1.getUTCMonth() + 1;
            month1 = month1.toString();
            var day1 = date1.getUTCDate();
            day1 = day1.toString();
            
            var message = 'Todays attendance status ('+day1+'-'+month1+'-'+year1+')';
        } 
            if(isNaN(year1) || isNaN(month1) || isNaN(day1)){
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
                    attendancemodel.find({year: year1, month: month1, day: day1}, function(err, attdata){
                        
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
                            year : year1,
                            month : month1,
                            day: day1
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
                        var now1 = Date.now();
                        var milliseconds1 = 19800000;
                        var date1 = new Date(now1+milliseconds1);
                        var year1 = date1.getUTCFullYear();
                        year1 = year1.toString();
                        var month1 = date1.getUTCMonth() + 1;
                        month1 = month1.toString();
                        var day1 = date1.getDate();
                        day1 = day1.toString();
                        var datestring = year1+month1+day1;

                    var hours1 = date1.getUTCHours().toString();
                    var minutes1 = date1.getUTCMinutes().toString();
                    var seconds1 =  date1.getUTCSeconds().toString();
                    var timestring= hours1+' '+minutes1+' '+seconds1;
                        //checking if attendance entry exists for given date.
                    attendancemodel.count({employeeid : employeeid, year : year1, month : month1, day: day1}, function(err, count){
                    
                    
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
                attendancemodel.findOne({employeeid : employeeid, year : year1, month : month1, day: day1}, function(err, data){
                        if(err){
                            res.render('error', {message: 'error in connection :'+err});
                        }    
                        console.log(timetype);
                        if(data[timetype] != 'na'){
                            console.log('data timetype is '+typeof(data[timetype]));
                            var message = timetype.toUpperCase()+' already marked for id: '+employeeid+' at '+data[timetype];
                            res.render('attendance/mark_attendance', {time: req.body.time, message: message});
                        }
                        else if (data[timetype] == 'na'){
                            console.log('data timetype is '+typeof(data[timetype]));
                            
                            //update the attendance entry  timwetype with time.
                            attendancemodel.updateOne({employeeid : employeeid, year : year1, month : month1, day: day1},{
                                
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
                        attendancemodel1.year = year1;
                        attendancemodel1.month = month1;
                        attendancemodel1.day = day1;
                        attendancemodel1.intime = intime;
                        attendancemodel1.outtime = outtime;
                        attendancemodel1.markedtime = Date.now()+19800000;
                        attendancemodel1.markedby = req.session.username;
                        attendancemodel1.modifiedtime = Date.now()+19800000;
                        attendancemodel1.modifiedby = req.session.username;
    
                        attendancemodel1.save( function(err, data){
                            if(err){
                                console.log('Could not mark attendance because :'+err)
                                message = 'Could not mark attendance for '+employeeid+' because </br>'+err;
                                res.render('error', {message: message});
                            }
                            else{
                                console.log('Attendance has been marked for employee: '+employeeid)
                                message = 'Attendance has been marked for employee: '+employeeid;
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

exports.month_view = function(req,res){
    
    if(!req.session.username){
        req.session.destroy();
        res.redirect('/officeadmin/login?error=notsignedin');
     }

     else{


            var months = ['January','January','February','March',
                            'April','May','June','July',
                            'August','September','October',
                            'November','December'];

            if(!req.query.month || !req.query.year || parseInt(req.query.month) <1 || parseInt(req.query.month) > 12 || parseInt(req.query.year) > 2025 || parseInt(req.query.year) < 2021){
                var now1 = Date.now();
                var milliseconds1 = 19800000;
                var date1 = new Date(now1+milliseconds1);
                var year1 = date1.getUTCFullYear();
                year1 = year1.toString();
                var month1 = date1.getUTCMonth() + 1;
                month1 = month1.toString();
                var day1 = date1.getUTCDate();
                day1 = day1.toString();
                
                var month_name = months[month1];
                
            }   

            
            
            else{

                var month1 = parseInt(req.query.month);
                var year1  = parseInt(req.query.year);
                var month_name = months[month1];

            }
            var datestring = month_name+'-'+year1;
        
            
            res.render('error', { message : 'Monthly Attendance Report for '+datestring})

        
        
        }


        
}

