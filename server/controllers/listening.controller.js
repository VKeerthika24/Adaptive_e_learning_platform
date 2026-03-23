const axios = require("axios");

const HF_CHAT_API = "https://router.huggingface.co/v1/chat/completions";

const headers = {
  Authorization: `Bearer ${process.env.HF_API_KEY}`,
  "Content-Type": "application/json"
};

/* =========================
   START LISTENING
========================= */
exports.startListening = async (req, res) => {
  try {
    // 1️⃣ Generate listening passage
    const passagePrompt = `
Generate a 1–2 minute IELTS listening passage.
Topic: daily life / education / travel.
Simple spoken English.
Do NOT include questions.
`;

    const passageRes = await axios.post(
      HF_CHAT_API,
      {
        model: "meta-llama/Meta-Llama-3-8B-Instruct",
        messages: [{ role: "user", content: passagePrompt }],
        max_tokens: 350
      },
      { headers }
    );

    const passage =
      passageRes.data?.choices?.[0]?.message?.content?.trim();

    if (!passage) {
      return res.status(500).json({ message: "Failed to generate passage" });
    }

    // 2️⃣ Generate questions
    const questionPrompt = `
Based on the following passage, create exactly 5 multiple-choice questions.

PASSAGE:
"${passage}"

Return ONLY valid JSON:
[
  {
    "question": "",
    "options": ["", "", "", ""],
    "answer": "A"
  }
]
`;

    const qRes = await axios.post(
      HF_CHAT_API,
      {
        model: "meta-llama/Meta-Llama-3-8B-Instruct",
        messages: [{ role: "user", content: questionPrompt }],
        max_tokens: 400
      },
      { headers }
    );

    const raw = qRes.data?.choices?.[0]?.message?.content;
    const match = raw?.match(/\[[\s\S]*\]/);

    if (!match) {
      return res.status(500).json({ message: "Invalid question format" });
    }

    const questions = JSON.parse(match[0]);

    // 3️⃣ Send passage + questions
    res.json({
      passage,
      questions
    });

  } catch (err) {
    console.error("LISTENING ERROR:", err.response?.data || err.message);
    res.status(500).json({ message: "Listening generation failed" });
  }
};

/* =========================
   SUBMIT LISTENING
========================= */
exports.submitListening = async (req, res) => {
  const { questions, answers } = req.body;

  let score = 0;

  questions.forEach((q, i) => {
    if (answers[i] === q.answer) score++;
  });

  res.json({
    score,
    total: questions.length,
    correctAnswers: questions.map(q => q.answer)
  });
};
