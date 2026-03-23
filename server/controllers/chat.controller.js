const axios = require('axios');

console.log('HF KEY LOADED (CHAT):', !!process.env.HF_API_KEY);

const HF_API = 'https://router.huggingface.co/v1/chat/completions';

exports.chatWithAI = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ message: 'Message is required' });
  }

  try {
    const prompt = `
You are an AI English Tutor.

You help students with:
- Grammar
- Vocabulary
- IELTS & TOEFL preparation
- Essay structure
- Sentence correction

Answer clearly and simply.

Student question:
"${message}"
`;

    const hfRes = await axios.post(
      HF_API,
      {
        model: 'meta-llama/Meta-Llama-3-8B-Instruct',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.6,
        max_tokens: 300
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const reply =
      hfRes.data?.choices?.[0]?.message?.content;

    if (!reply) {
      return res.json({
        reply: '⚠️ AI could not generate a response.'
      });
    }

    res.json({ reply });

  } catch (err) {
    console.error('CHAT ERROR:', err.response?.data || err.message);
    res.status(500).json({
      reply: '⚠️ AI is busy. Please try again.'
    });
  }
};
