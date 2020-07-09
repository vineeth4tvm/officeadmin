var express = require('express');
var router = express.Router();
var officeadminController = require('../controllers/officeadmincontroller');
var employeeController = require('../controllers/officeadmin/employeeController');


router.get('/home', officeadminController.home);

router.get('/', officeadminController.login);

router.get('/login', officeadminController.login);

router.get('/logout', officeadminController.logout);

router.post('/login', officeadminController.authenticatelogin);

router.get('/register', employeeController.register);

router.post('/register', employeeController.saveemployee);

router.get('/editemployee', employeeController.edit);

router.get('/viewemployees', employeeController.view);

router.get('/deleteemployee', employeeController.delete);

router.post('/editemployee', employeeController.update);

module.exports = router;