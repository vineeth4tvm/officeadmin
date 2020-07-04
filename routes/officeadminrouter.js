var express = require('express');
var router = express.Router();
var officeadminController = require('../controllers/officeadminController');
var employeeController = require('../controllers/officeadmin/employeeController');
//require('../models/webquery');
/* Post web query. */

router.get('/home', officeadminController.home);

router.get('/', officeadminController.login);

router.get('/login', officeadminController.login);

router.get('/logout', officeadminController.logout);

router.post('/login', officeadminController.authenticatelogin);

router.get('/register', employeeController.register);

router.post('/register', employeeController.saveemployee);

router.get('/editemployee', employeeController.edit);

module.exports = router;