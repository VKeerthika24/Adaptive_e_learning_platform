const router = require("express").Router();
const auth = require("../middleware/auth.middleware");

const {
  startListening,
  submitListening
} = require("../controllers/listening.controller");

console.log("✅ Listening routes loaded");

router.post("/start", auth, startListening);
router.post("/submit", auth, submitListening);

module.exports = router;
