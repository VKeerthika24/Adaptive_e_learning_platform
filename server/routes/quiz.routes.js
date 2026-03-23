const router = require('express').Router();
const auth = require('../middleware/auth.middleware');

const {
  generateQuiz,
  submitQuiz
} = require('../controllers/quiz.controller');

router.post('/generate', auth, generateQuiz);
router.post('/submit', auth, submitQuiz);

module.exports = router;
