import { useState } from "react";
import { api } from "../services/api";
import "../styles/Listening.css";

export default function Listening() {
  const [passage, setPassage] = useState("");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [listened, setListened] = useState(false);
  const [playing, setPlaying] = useState(false);

  /* ================= SPEAK AUDIO ================= */
  const playAudio = (text) => {
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.9;

    utterance.onstart = () => setPlaying(true);
    utterance.onend = () => {
      setPlaying(false);
      setListened(true);
    };

    speechSynthesis.speak(utterance);
  };

  /* ================= START ================= */
  const startListening = async () => {
    setLoading(true);
    setResult(null);
    setQuestions([]);
    setAnswers([]);
    setListened(false);
    setPlaying(false);

    try {
      const data = await api("/listening/start", "POST");

      setPassage(data.passage);
      setQuestions(data.questions);
      setAnswers(Array(data.questions.length).fill(null));

      // 🔊 Play audio
      playAudio(data.passage);
    } catch {
      alert("Failed to start listening test");
    } finally {
      setLoading(false);
    }
  };

  /* ================= SUBMIT ================= */
  const submit = async () => {
    const res = await api("/listening/submit", "POST", {
      questions,
      answers
    });
    setResult(res);
  };

  return (
    <div className="listening-page">
      <h2>Listening Practice</h2>

      {!passage && (
        <button onClick={startListening} disabled={loading}>
          {loading ? "Preparing audio…" : "Start Listening Test"}
        </button>
      )}

      {/* 🎧 AUDIO PLAYING INDICATOR */}
      {playing && (
        <div className="listening-status">
          <div className="audio-icon">🎧</div>
          <p className="audio-text">
            Audio is playing…<br />
            <span>Listen carefully. Questions will appear after.</span>
          </p>
          <div className="pulse"></div>
        </div>
      )}

      {/* QUESTIONS */}
      {listened && !result && (
        <>
          {questions.map((q, i) => (
            <div key={i} className="question-card">
              <p>{q.question}</p>
              {q.options.map((opt, idx) => (
                <label key={idx}>
                  <input
                    type="radio"
                    name={`q${i}`}
                    onChange={() => {
                      const copy = [...answers];
                      copy[i] = String.fromCharCode(65 + idx);
                      setAnswers(copy);
                    }}
                  />
                  {opt}
                </label>
              ))}
            </div>
          ))}

          <button onClick={submit}>Submit Answers</button>
        </>
      )}

      {/* RESULT */}
      {result && (
        <div className="result-card">
          <h3>
            Score: {result.score}/{result.total}
          </h3>
          <p>
            Correct Answers: {result.correctAnswers.join(", ")}
          </p>
        </div>
      )}
    </div>
  );
}
