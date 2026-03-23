const router = require('express').Router();
const auth = require('../middleware/auth.middleware');
const { chatWithAI } = require('../controllers/chat.controller');

console.log('✅ Chat routes loaded');

router.post('/', auth, chatWithAI);

module.exports = router;
