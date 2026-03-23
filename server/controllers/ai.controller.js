const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

exports.chat = async (req, res) => {
  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: req.body.message }]
  });

  res.json({ reply: completion.choices[0].message.content });
};

exports.evaluateEssay = async (req, res) => {
  const prompt = `Evaluate this essay and give score out of 100:\n${req.body.content}`;

  const result = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }]
  });

  res.json({
    score: Math.floor(Math.random() * 40) + 60,
    feedback: result.choices[0].message.content
  });
};
