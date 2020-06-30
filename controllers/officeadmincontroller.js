exports.home = function(req, res){
    sess = req.session;
    if(!sess.username){
        sess.destroy((err) => {
            if(err){
                console.log(err);
            }
        })
        res.redirect('/officeadmin/login?error=notsignedin');
    }
    else{
        var user = sess.username;
        res.render('admin_home', {username: user});
    }

}


exports.login = function(req, res){
    var sess = req.session;
    sess.destroy((err) => {
        if(err){
            console.log(err);
        }
    })
    var errorcode = {};
    var errormsg = '';
    errorcode.notsignedin = 'User not signed in. Please sign in to continue';
    errorcode.emptyfields = 'Please fill in both fields';
    errorcode.wronguser = 'Wrong Username'
    errorcode.wrongpassword = 'Wrong Password';
    errorcode.loggedout = 'You have been logged out successfully';
    if(req.query.error){
        error = req.query.error;
        errormsg = errorcode[error];
        if(errormsg == undefined){
            errormsg = '';
        }
        //console.log(error + errormsg);
    }
    res.render('admin_login', {title : 'Admin login', error : errormsg});

}

exports.authenticatelogin = function(req, res){
    console.log(req.body.username);
    if(!req.body.username || !req.body.password){
        res.redirect('/officeadmin/login?error=emptyfields');
    }

    else{
    
        var user = req.body.username;
        var password = req.body.password;
        var realuser = 'admin';
        var realpassword = 'password';

        if(user == realuser){
            
            if(password == realpassword){
                var sess = req.session;
                sess.username = realuser;
                res.redirect('/officeadmin/home');
            }
            else{
                
                res.redirect('/officeadmin/login?error=wrongpassword')

            }

        }
        else{

            res.redirect('/officeadmin/login?error=wronguser');

        }

    }
}


exports.logout = function(req, res){

    var sess = req.session;
    sess.destroy((err) => {
        if(err){
            console.log(err);
        }
    })

    res.redirect('/officeadmin/login?error=loggedout');
        
}