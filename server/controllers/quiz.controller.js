const db = require('../config/db');
const axios = require('axios');

console.log('HF KEY LOADED:', !!process.env.HF_API_KEY);

const HF_API = 'https://router.huggingface.co/v1/chat/completions';

const headers = {
  Authorization: `Bearer ${process.env.HF_API_KEY}`,
  'Content-Type': 'application/json'
};

/* ============================
   1️⃣ GENERATE QUIZ (20 MCQs)
============================ */
exports.generateQuiz = async (req, res) => {
  const { difficulty } = req.body;

  if (!['easy', 'medium', 'hard'].includes(difficulty)) {
    return res.status(400).json({ message: 'Invalid difficulty' });
  }

  try {
    const prompt = `
Create 20 ${difficulty} level English multiple-choice questions.

Rules:
- IELTS / TOEFL style
- Grammar, vocabulary, reading
- Exactly 4 options per question
- Correct answer must be A, B, C, or D

Return ONLY valid JSON in this format:
[
  {
    "question": "Question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer": "A"
  }
]
`;

    const hfRes = await axios.post(
      HF_API,
      {
        model: 'meta-llama/Meta-Llama-3-8B-Instruct',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 2000
      },
      { headers }
    );

    const rawText = hfRes.data?.choices?.[0]?.message?.content;

    if (!rawText) {
      console.error('HF EMPTY RESPONSE:', hfRes.data);
      return res.status(500).json({
        message: 'Empty response from AI model'
      });
    }

    // Extract JSON safely
    const jsonMatch = rawText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.error('HF NON-JSON OUTPUT:', rawText);
      return res.status(500).json({
        message: 'AI response was not valid JSON'
      });
    }

    const quiz = JSON.parse(jsonMatch[0]);

    // Safety check: ensure 20 questions
    if (!Array.isArray(quiz) || quiz.length < 20) {
      return res.status(500).json({
        message: 'AI did not generate 20 questions'
      });
    }

    return res.json({ quiz });

  } catch (err) {
    console.error(
      'HF REQUEST ERROR:',
      err.response?.data || err.message
    );
    return res.status(500).json({
      message: 'Failed to generate quiz'
    });
  }
};

/* ============================
   2️⃣ SUBMIT QUIZ
============================ */
exports.submitQuiz = async (req, res) => {
  const userId = req.user.id;
  const { quiz, answers } = req.body;

  if (!quiz || !answers) {
    return res.status(400).json({ message: 'Invalid quiz data' });
  }

  let score = 0;
  quiz.forEach((q, i) => {
    if (answers[i] === q.answer) score++;
  });

  try {
    await db.query(
      `INSERT INTO quiz_results (user_id, score, total)
       VALUES (?, ?, ?)`,
      [userId, score, quiz.length]
    );

    return res.json({
      score,
      total: quiz.length
    });

  } catch (err) {
    console.error('Quiz submit error:', err.message);
    return res.status(500).json({
      message: 'Quiz submission failed'
    });
  }
};
