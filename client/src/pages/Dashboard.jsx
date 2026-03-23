import { useEffect, useState } from 'react';
import { api } from '../services/api';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(null);
  const [recentQuizzes, setRecentQuizzes] = useState([]);
  const [recentEssays, setRecentEssays] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const data = await api('/dashboard');
      setProgress(data.progress);
      setRecentQuizzes(data.recentQuizzes);
      setRecentEssays(data.recentEssays);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <p className="loading-text">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return <p className="error-text">{error}</p>;
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-inner">

        {/* ================= HEADER ================= */}
        <div className="page-header">
          <h2 className="page-title">Dashboard</h2>
          <p className="page-subtitle">
            Track your learning progress and recent activity
          </p>
        </div>

        {/* ================= STATS ================= */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-top">
              <div className="stat-icon-wrap stat-blue">Q</div>
            </div>
            <div className="stat-value">{progress.total_quizzes}</div>
            <div className="stat-label">Total Quizzes</div>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <div className="stat-icon-wrap stat-green">E</div>
            </div>
            <div className="stat-value">{progress.total_essays}</div>
            <div className="stat-label">Total Essays</div>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <div className="stat-icon-wrap stat-orange">%</div>
            </div>
            <div className="stat-value">
              {Math.round(progress.average_quiz_score)}
            </div>
            <div className="stat-label">Avg Quiz Score</div>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <div className="stat-icon-wrap stat-red">★</div>
            </div>
            <div className="stat-value">
              {Math.round(progress.average_essay_score)}
            </div>
            <div className="stat-label">Avg Essay Score</div>
          </div>
        </div>

        {/* ================= RECENT ACTIVITY ================= */}
        <div className="recent-grid">

          {/* Recent Quizzes */}
          <div className="panel white-panel">
            <h3 className="panel-title">Recent Quizzes</h3>

            {recentQuizzes.length === 0 ? (
              <div className="empty-state">
                <p>No quizzes taken yet</p>
              </div>
            ) : (
              <div className="list-space">
                {recentQuizzes.map((quiz, index) => (
                  <div key={index} className="list-item">
                    <div className="list-row">
                      <span className={`badge badge-${quiz.difficulty}`}>
                        {quiz.difficulty.toUpperCase()}
                      </span>
                      <span className="quiz-score">
                        {quiz.score}
                      </span>
                    </div>
                    <div className="list-subtext">
                      Attempted on {new Date(quiz.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Essays */}
          <div className="panel white-panel">
            <h3 className="panel-title">Recent Essays</h3>

            {recentEssays.length === 0 ? (
              <div className="empty-state">
                <p>No essays submitted yet</p>
              </div>
            ) : (
              <div className="list-space">
                {recentEssays.map((essay) => (
                  <div key={essay.id} className="list-item">
                    <div className="list-row align-start">
                      <p className="essay-title">{essay.title}</p>
                      <span className={`badge badge-${essay.difficulty}`}>
                        {essay.difficulty}
                      </span>
                    </div>
                    <div className="list-subtext">
                      Submitted on {new Date(essay.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
