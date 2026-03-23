import { useEffect, useState } from 'react';
import { api } from '../services/api';
import '../styles/Quiz.css';

export default function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [difficulty, setDifficulty] = useState(null);
  const [timeLeft, setTimeLeft] = useState(20);
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);

  /* ================= TIMER ================= */
  useEffect(() => {
    if (!difficulty || completed) return;

    if (timeLeft === 0) {
      handleNext();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(t => t - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, difficulty, completed]);

  /* ================= START QUIZ ================= */
  const startQuiz = async (level) => {
    try {
      setLoading(true);

      const data = await api('/quiz/generate', 'POST', {
        difficulty: level
      });

      // ✅ FIX: safe assignment
      setQuestions(Array.isArray(data.quiz) ? data.quiz : []);
      setDifficulty(level);
      setCurrent(0);
      setScore(0);
      setCompleted(false);
      setTimeLeft(20);
      setSelected(null);

    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ================= NEXT ================= */
  const handleNext = () => {
    const q = questions[current];
    if (!q) return;

    const selectedLetter =
      selected !== null
        ? String.fromCharCode(65 + selected)
        : null;

    if (selectedLetter === q.answer) {
      setScore(s => s + 1);
    }

    setSelected(null);
    setTimeLeft(20);

    if (current < questions.length - 1) {
      setCurrent(c => c + 1);
    } else {
      setCompleted(true);
    }
  };

  /* ================= DIFFICULTY PAGE ================= */
  if (!difficulty) {
    return (
      <div className="quiz-page">
        <div className="quiz-inner">
          <div className="quiz-header">
            <h1 className="quiz-title">English Proficiency Quiz</h1>
            <p className="quiz-desc">Choose a difficulty level to begin</p>
          </div>

          {loading && <p className="loading-text">Loading questions…</p>}

          <div className="difficulty-grid">
            <div
              className="difficulty-card difficulty-easy"
              onClick={() => startQuiz('easy')}
            >
              <div className="difficulty-emoji">😊</div>
              <h2>Easy</h2>
              <p>Basic grammar & vocabulary</p>
            </div>

            <div
              className="difficulty-card difficulty-medium"
              onClick={() => startQuiz('medium')}
            >
              <div className="difficulty-emoji">😐</div>
              <h2>Medium</h2>
              <p>Sentence correction & usage</p>
            </div>

            <div
              className="difficulty-card difficulty-expert"
              onClick={() => startQuiz('hard')}
            >
              <div className="difficulty-emoji">🔥</div>
              <h2>Hard</h2>
              <p>IELTS / TOEFL level</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ================= RESULT ================= */
  if (completed) {
    return (
      <div className="quiz-page">
        <div className="quiz-inner narrow">
          <div className="result-card">
            <h2 className="result-title">Quiz Completed</h2>
            <div className="result-score">{score}</div>
            <p className="result-percent">out of {questions.length}</p>

            <p className="quiz-desc">
              {score >= 15
                ? 'Excellent proficiency 🎉'
                : score >= 10
                ? 'Good, keep practicing 👍'
                : 'Needs focused practice 📘'}
            </p>

            <button
              className="btn-primary"
              onClick={() => setDifficulty(null)}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ================= QUESTION ================= */
  const q = questions[current];
  if (!q) return null;

  return (
    <div className="quiz-page">
      <div className="quiz-inner">
        <div className="quiz-card">

          <div className="quiz-top">
            <div className="q-meta">
              Question {current + 1} / {questions.length}
            </div>

            <div className="q-timer">
              <span className={`q-time ${timeLeft <= 5 ? 'danger' : ''}`}>
                ⏱ {timeLeft}s
              </span>
            </div>
          </div>

          <div className="quiz-info">
            <span className={`difficulty-badge ${difficulty}`}>
              {difficulty.toUpperCase()}
            </span>
            <span className="score-display">Score: {score}</span>
          </div>

          <p className="question-text">{q.question}</p>

          <div className="options-list">
            {q.options.map((opt, idx) => (
              <button
                key={idx}
                className={`option-btn ${selected === idx ? 'selected' : ''}`}
                onClick={() => setSelected(idx)}
              >
                <span className="option-letter">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="option-text">{opt}</span>
              </button>
            ))}
          </div>

          <button
            className="next-btn"
            disabled={selected === null}
            onClick={handleNext}
          >
            {current === questions.length - 1
              ? 'Finish Quiz'
              : 'Next'}
          </button>

        </div>
      </div>
    </div>
  );
}
