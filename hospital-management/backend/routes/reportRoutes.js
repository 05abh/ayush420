const express = require('express');
const {
  getPatientReports,
  getHospitalReports,
  getReportById
} = require('../controllers/reportController');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.get('/hospital', getHospitalReports);
router.get('/patient/:patientId', getPatientReports);
router.get('/:reportId', getReportById);

module.exports = router;