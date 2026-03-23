const router = require("express").Router();
const auth = require("../middleware/auth.middleware");

const {
  startSpeaking,
  evaluateSpeaking
} = require("../controllers/speaking.controller");

console.log("✅ Speaking routes loaded");

router.post("/start", auth, startSpeaking);
router.post("/evaluate", auth, evaluateSpeaking);

module.exports = router;
