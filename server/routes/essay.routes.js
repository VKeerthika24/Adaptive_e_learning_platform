const router = require('express').Router();
const auth = require('../middleware/auth.middleware');

const essayController = require('../controllers/essay.controller');

console.log('✅ Essay routes loaded');

router.post('/generate', auth, essayController.generateEssayQuestion);
router.post('/submit', auth, essayController.submitEssay);

module.exports = router;
