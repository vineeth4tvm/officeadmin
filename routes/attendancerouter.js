var express = require('express');
var router = express.Router();
var attendanceController = require('../controllers/attendance/attendanceController');


router.get('/', attendanceController.home);
router.get('/mark', attendanceController.mark);


module.exports = router;