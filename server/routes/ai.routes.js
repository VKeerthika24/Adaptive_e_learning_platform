const router = require('express').Router();
const { chat, evaluateEssay } = require('../controllers/ai.controller');

router.post('/chat', chat);
router.post('/evaluate', evaluateEssay);

module.exports = router;
