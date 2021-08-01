var attendancemodel = require('../../models/attendancemodel');
var employeeregistrationmodel = require('../../models/employeeregistrationmodel');
const session = require('express-session');
const attendance = require('../../models/attendancemodel');




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

            var getDaysInMonth = function(month,year) {
                // Here January is 1 based
                //Day 0 is the last day in the previous month
                return new Date(year, month, 0).getDate();
                // Here January is 0 based
                // return new Date(year, month+1, 0).getDate();
            };




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
            var totaldays = getDaysInMonth(month1,year1);
            totaldays = parseInt(totaldays);
            console.log(totaldays);

            employeeregistrationmodel.find({employmentstatus : 'employed'},'fullname employeedesignation employeeid', function(err, data){
                    if(err){
                        res.render('error', {message : 'couldnt connect to databasae because '+err});
                    }
                    if(!data){
                        res.render('attendance/month_view',{message: 'No employees found in the database'});
                    }

                    else{
                    var employeelist = {};

                    //get attendance data
                    attendancemodel.find({year: year1, month: month1}, function(err, attdata){
                        
                        var key = 0 ;
                        var attresult = {};   
                                            
                        //link and merge data from both collections
                        for (const property in data) {
                            
                            var subattdata = attdata.filter(item => item.employeeid == `${data[property]['employeeid']}`);
                            
                            
                            //console.log(typeof(subattdata[0]));

                            //if there are entries in attendance collection, append to employee collection data rows
                            if(subattdata.length){
                            //console.log('employee list empname: '+`${data[property]['fullname']}` +' , attdata empl id :  '+ subattdata[0]['employeeid']);
                            if(`${data[property]['employeeid']}` == subattdata[0]['employeeid']){
                               
                                attresult[key] = subattdata[0];
                                //console.log(subattdata[0]);
                                var key1 = 1;
                                attresult[key] = {};
                                attresult[key]['intime'] = {};
                                attresult[key]['outtime'] = {};
                                // while (key1 <= totaldays) {
                                //   if(!subattdata[0]['intime']){
                                //         attresult[key]['intime'][key1] = "na";
                                //     }
                                //   else if(!subattdata[0]['outtime']){
                                //         attresult[key]['outtime'][key1] = "na";
                                //     }
                                //   else{
                                //   attresult[key]['intime'][key1] = subattdata[0]['intime'];
                                //   attresult[key]['outtime'][key1] = subattdata[0]['outtime'];
                                //   }
                                //   key1++;
                                //}
                                
                                //

                                

                                attresult[key]['fullname'] = `${data[property]['fullname']}`;
                                
                                
                            }
                            key++;
                        
                        }
                        else{
                            //if no entry is found in attendance collection, populate columns with values 'na'
                            attresult[key]={};
                            attresult[key]= {fullname: `${data[property]['fullname']}`,
                            employeeid : `${data[property]['employeeid']}`,
                            };

                            attresult[key]['intime'] = {};
                            attresult[key]['outtime'] = {};
                            var key1 =1;
                            while(key1 <= totaldays){
                           		attresult[key]['intime'][key1] = 'na';
                            	attresult[key]['outtime'][key1] = 'na';
                            	key1++;
                            }

                            key++; 

                        }
                    }


                        res.render('attendance/month_view', { attresult: attresult, message : 'Monthly Attendance Report for '+datestring, month: datestring});

                       // res.render('attendance/attendancehome', {attresult: attresult, message : message});
                        //{message: empresult}}
                       console.log(attresult);
                   

                    //var date2 = new Date();
                    //console.log('Date in employee list is : '+ attdata);
                    //var empresult = employeelist['1'].fullname;
                    
                    //console.log(attresult[1]['fullname']);
                        
                    
                    }
                    ).lean()}
                    
            }

                )}

        
}
