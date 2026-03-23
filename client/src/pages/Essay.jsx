import { useEffect, useState } from 'react';
import { api } from '../services/api';
import '../styles/Essay.css';

export default function Essay() {
  const [difficulty, setDifficulty] = useState('easy');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [minWords, setMinWords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  /* ================= CONFIG ================= */
  const config = {
    easy: { time: 20 * 60, words: 150 },
    medium: { time: 30 * 60, words: 200 },
    hard: { time: 40 * 60, words: 250 }
  };

  /* ================= TIMER ================= */
  useEffect(() => {
    if (!question || submitted) return;

    if (timeLeft === 0) {
      autoSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(t => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, question]);

  /* ================= GENERATE TOPIC ================= */
  const generateTopic = async () => {
    setLoading(true);
    setAnswer('');
    setResult(null);
    setSubmitted(false);

    try {
      const data = await api('/essay/generate', 'POST', { difficulty });
      setQuestion(data.question);
      setTimeLeft(config[difficulty].time);
      setMinWords(config[difficulty].words);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ================= WORD COUNT ================= */
  const wordCount = answer.trim()
    ? answer.trim().split(/\s+/).length
    : 0;

  /* ================= SUBMIT ================= */
  const submitEssay = async () => {
    if (wordCount < minWords) {
      alert(`Minimum ${minWords} words required`);
      return;
    }

    setSubmitted(true);

    try {
      const data = await api('/essay/submit', 'POST', {
        question,
        content: answer,
        difficulty
      });
      setResult(data);
    } catch (err) {
      alert(err.message);
    }
  };

  /* ================= AUTO SUBMIT ================= */
  const autoSubmit = () => {
    if (!submitted && answer.trim()) {
      submitEssay();
    }
  };

  /* ================= FORMAT TIME ================= */
  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="essay-page">
      <div className="essay-inner">

        {/* HEADER */}
        <div className="essay-header">
          <h1 className="essay-title-main">Essay Writing</h1>
          {!question && (
            <button
              className="btn btn-outline"
              onClick={generateTopic}
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Generate Topic'}
            </button>
          )}
        </div>

        {/* DIFFICULTY */}
        {!question && (
          <div className="card">
            <div className="difficulty-grid">
              {['easy', 'medium', 'hard'].map(level => (
                <button
                  key={level}
                  className={`level-btn ${
                    difficulty === level
                      ? `level-${level}`
                      : 'level-inactive'
                  }`}
                  onClick={() => setDifficulty(level)}
                >
                  {level.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* QUESTION */}
        {question && (
          <div className="prompt-card">
            <div className="prompt-content">
              <h4 className="prompt-title">Essay Question</h4>
              <p className="prompt-text">{question}</p>
              <p className="prompt-text">
                ⏱ {formatTime(timeLeft)} | 📝 {wordCount}/{minWords}
              </p>
            </div>
          </div>
        )}

        {/* ANSWER */}
        {question && !result && (
          <div className="card form-card">
            <div className="textarea-wrap">
              <textarea
                className="textarea"
                rows="10"
                placeholder="Write your essay here..."
                value={answer}
                disabled={submitted}
                onChange={(e) => setAnswer(e.target.value)}
              />
              <span className="word-count">
                {wordCount} words
              </span>
            </div>

            <button
              className="btn full btn-primary"
              onClick={submitEssay}
              disabled={submitted}
            >
              Submit Essay
            </button>
          </div>
        )}

        {/* RESULT */}
        {result && (
          <div className="card gradient-score">
            <div className="score-top">
              <h3>Band Score</h3>
              <div className="big-score">{result.score}</div>
            </div>
            <p>{result.feedback}</p>
          </div>
        )}

      </div>
    </div>
  );
}
