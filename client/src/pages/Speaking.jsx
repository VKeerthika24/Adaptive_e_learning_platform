import { useState, useEffect, useRef } from "react";
import { api } from "../services/api";
import "../styles/Speaking.css";

export default function Speaking() {
  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState("easy");
  const [timeLeft, setTimeLeft] = useState(60);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [result, setResult] = useState(null);
  const recognitionRef = useRef(null);

  /* ================= START TOPIC ================= */
  const startSpeaking = async () => {
    setTopic("");
    setTranscript("");
    setResult(null);
    setTimeLeft(60);

    const data = await api("/speaking/start", "POST", { level });
    setTopic(data.topic);
  };

  /* ================= TIMER ================= */
  useEffect(() => {
    if (!topic || timeLeft === 0) return;

    const timer = setInterval(() => {
      setTimeLeft(t => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [topic, timeLeft]);

  /* ================= SPEECH TO TEXT ================= */
  const startRecording = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;

    recognition.onresult = (e) => {
      let text = "";
      for (let i = 0; i < e.results.length; i++) {
        text += e.results[i][0].transcript + " ";
      }
      setTranscript(text.trim());
    };

    recognition.start();
    recognitionRef.current = recognition;
    setListening(true);
  };

  /* ================= STOP & EVALUATE ================= */
  const stopRecording = async () => {
    recognitionRef.current?.stop();
    setListening(false);

    if (!transcript || transcript.length < 20) {
      alert("Please speak a little more for evaluation.");
      return;
    }

    const data = await api("/speaking/evaluate", "POST", {
      topic,
      transcript
    });

    setResult(data);
  };

  return (
    <div className="speaking-page">
      <h2>Speaking Practice – Mode 2</h2>
      <p className="speaking-subtitle">
        AI & NLP-based Speaking Evaluation
      </p>

      {/* ================= CONTROLS ================= */}
      {!topic && (
        <div className="speaking-controls">
          <select value={level} onChange={e => setLevel(e.target.value)}>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          <button onClick={startSpeaking}>Start Speaking</button>
        </div>
      )}

      {/* ================= SPEAKING CARD ================= */}
      {topic && (
        <div className="speaking-card">
          <h3>Your Topic</h3>
          <p className="speaking-topic">{topic}</p>

          <div className="timer">⏱ {timeLeft}s</div>

          {!listening ? (
            <button onClick={startRecording}>🎙 Start Recording</button>
          ) : (
            <button onClick={stopRecording}>⏹ Stop & Evaluate</button>
          )}

          <div className="transcript">
            <h4>Your Answer</h4>
            <p>{transcript || "Listening..."}</p>
          </div>
        </div>
      )}

      {/* ================= RESULT ================= */}
      {result && (
        <div className="result-card">
          <h3>AI Speaking Evaluation</h3>

          <p className="band-score">
            ⭐ Band Score: <strong>{result.score}</strong>
          </p>

          <div className="evaluation-grid">
            {result.fluency && (
              <p><strong>Fluency:</strong> {result.fluency}</p>
            )}
            {result.grammar && (
              <p><strong>Grammar:</strong> {result.grammar}</p>
            )}
            {result.vocabulary && (
              <p><strong>Vocabulary:</strong> {result.vocabulary}</p>
            )}
            {result.coherence && (
              <p><strong>Coherence:</strong> {result.coherence}</p>
            )}
          </div>

          <p className="feedback">
            <strong>Overall Feedback:</strong> {result.feedback}
          </p>

          {result.corrected_sample && (
            <div className="correction">
              <h4>Improved Sample Answer</h4>
              <p>{result.corrected_sample}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
