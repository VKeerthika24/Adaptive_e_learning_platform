const db = require('../config/db');
const axios = require('axios');

console.log('HF KEY LOADED (ESSAY):', !!process.env.HF_API_KEY);

const HF_API = 'https://router.huggingface.co/v1/chat/completions';

const headers = {
  Authorization: `Bearer ${process.env.HF_API_KEY}`,
  'Content-Type': 'application/json'
};

/* ============================
   1️⃣ GENERATE ESSAY QUESTION
============================ */
exports.generateEssayQuestion = async (req, res) => {
  const userId = req.user.id;
  const { difficulty } = req.body;

  if (!['easy', 'medium', 'hard'].includes(difficulty)) {
    return res.status(400).json({ message: 'Invalid difficulty level' });
  }

  const timeLimit = {
    easy: 20,
    medium: 30,
    hard: 40
  };

  try {
    // Avoid repeating topics
    const [used] = await db.query(
      'SELECT title FROM essays WHERE user_id = ?',
      [userId]
    );

    const usedTopics = used.map(e => e.title).join('; ') || 'None';

    const prompt = `
You are an IELTS / TOEFL essay examiner.

Generate ONE ${difficulty.toUpperCase()} level essay question.

Rules:
- Opinion / discussion / problem-solution type
- IELTS / TOEFL academic style
- Avoid repeating these topics: ${usedTopics}
- No technical, math, or science topics

Return ONLY the essay question text.
`;

    const hfRes = await axios.post(
      HF_API,
      {
        model: 'meta-llama/Meta-Llama-3-8B-Instruct',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 200
      },
      { headers }
    );

    const question =
      hfRes.data?.choices?.[0]?.message?.content?.trim();

    if (!question) {
      return res.status(500).json({
        message: 'Failed to generate essay question'
      });
    }

    res.json({
      question,
      time_limit_minutes: timeLimit[difficulty]
    });

  } catch (err) {
    console.error('Essay generation error:', err.response?.data || err.message);
    res.status(500).json({
      message: 'Failed to generate essay question'
    });
  }
};

/* ============================
   2️⃣ SUBMIT & EVALUATE ESSAY
============================ */
exports.submitEssay = async (req, res) => {
  const userId = req.user.id;
  const { question, content, difficulty } = req.body;

  if (!question || !content || !difficulty) {
    return res.status(400).json({ message: 'Invalid essay data' });
  }

  const wordCount = content.trim().split(/\s+/).length;

  try {
    const prompt = `
You are an IELTS examiner.

Evaluate the following essay.

Essay Question:
"${question}"

Student Answer:
"${content}"

Give:
- Band score (0–9)
- Short improvement feedback

Return ONLY valid JSON:
{
  "score": 0,
  "feedback": "Short improvement feedback"
}
`;

    const hfRes = await axios.post(
      HF_API,
      {
        model: 'meta-llama/Meta-Llama-3-8B-Instruct',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.4,
        max_tokens: 300
      },
      { headers }
    );

    const raw =
      hfRes.data?.choices?.[0]?.message?.content;

    if (!raw) {
      return res.status(500).json({
        message: 'Failed to evaluate essay'
      });
    }

    // Extract JSON safely
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('HF NON JSON:', raw);
      return res.status(500).json({
        message: 'Invalid evaluation format'
      });
    }

    const evaluation = JSON.parse(jsonMatch[0]);

    await db.query(
      `
      INSERT INTO essays
      (user_id, title, content, difficulty, word_count, evaluation)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        userId,
        question,
        content,
        difficulty,
        wordCount,
        JSON.stringify(evaluation)
      ]
    );

    res.json({
      score: evaluation.score,
      feedback: evaluation.feedback
    });

  } catch (err) {
    console.error('Essay submit error:', err.response?.data || err.message);
    res.status(500).json({
      message: 'Essay evaluation failed'
    });
  }
};
