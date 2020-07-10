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