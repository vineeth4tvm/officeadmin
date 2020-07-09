exports.home = function(req, res){
    res.render('attendance/attendancehome');
}
exports.mark = function(req, res){
    res.render('attendance/mark_attendance', {type: 'In Attendance'});
}