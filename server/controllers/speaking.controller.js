const axios = require("axios");

console.log("HF KEY LOADED (SPEAKING):", !!process.env.HF_API_KEY);

const HF_API = "https://router.huggingface.co/v1/chat/completions";

const headers = {
  Authorization: `Bearer ${process.env.HF_API_KEY}`,
  "Content-Type": "application/json"
};

/* ===========================
   1️⃣ GENERATE SPEAKING TOPIC
=========================== */
exports.startSpeaking = async (req, res) => {
  const { level } = req.body;

  if (!["easy", "medium", "hard"].includes(level)) {
    return res.status(400).json({ message: "Invalid level" });
  }

  const prompts = {
    easy: [
      "Describe your favorite food.",
      "What do you usually do on weekends?",
      "Talk about your hometown."
    ],
    medium: [
      "Describe a memorable journey you had.",
      "Talk about a hobby you enjoy and why.",
      "Describe a person who inspires you."
    ],
    hard: [
      "Do you think technology makes life easier or more stressful?",
      "Should students learn online or offline? Why?",
      "Is climate change a serious threat to humanity?"
    ]
  };

  const topic =
    prompts[level][Math.floor(Math.random() * prompts[level].length)];

  res.json({ topic });
};

/* ===========================
   2️⃣ EVALUATE SPEAKING (NLP)
=========================== */
exports.evaluateSpeaking = async (req, res) => {
  const { topic, transcript } = req.body;

  if (!topic || !transcript) {
    return res.status(400).json({
      message: "Topic and transcript are required"
    });
  }

  try {
    const prompt = `
You are an IELTS speaking examiner.

Evaluate the following spoken response.

Topic:
"${topic}"

Student Response:
"${transcript}"

Give evaluation in JSON only:
{
  "score": 0,
  "fluency": "",
  "grammar": "",
  "vocabulary": "",
  "coherence": "",
  "feedback": "",
  "corrected_sample": ""
}
`;

    const hfRes = await axios.post(
      HF_API,
      {
        model: "meta-llama/Meta-Llama-3-8B-Instruct",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.4,
        max_tokens: 600
      },
      { headers }
    );

    const text =
      hfRes.data?.choices?.[0]?.message?.content;

    if (!text) {
      return res.status(500).json({
        message: "Empty AI response"
      });
    }

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return res.status(500).json({
        message: "Invalid AI output"
      });
    }

    const evaluation = JSON.parse(jsonMatch[0]);

    res.json(evaluation);

  } catch (err) {
    console.error("SPEAKING EVAL ERROR:", err.response?.data || err.message);
    res.status(500).json({
      message: "Failed to evaluate speaking"
    });
  }
};
