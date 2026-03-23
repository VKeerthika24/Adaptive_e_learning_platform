const router = require('express').Router();
const auth = require('../middleware/auth.middleware');
const { getDashboardData } = require('../controllers/dashboard.controller');

router.get('/', auth, getDashboardData);

module.exports = router;
