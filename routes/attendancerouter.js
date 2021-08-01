var express = require('express');
var router = express.Router();
var attendanceController = require('../controllers/attendance/attendanceController');
var month_viewController = require('../controllers/attendance/month_viewController');

router.get('/', attendanceController.home);
router.get('/mark', attendanceController.mark);
router.post('/mark', attendanceController.postmark);
router.get('/month_view', month_viewController.month_view);


module.exports = router;