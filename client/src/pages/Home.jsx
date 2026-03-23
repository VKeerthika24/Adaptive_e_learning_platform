import '../styles/Home.css';
import AIChatbot from '../components/AIChatbot'; // ✅ IMPORT CHATBOT

export default function Home({ onNavigate }) {
  return (
    <div className="home-page">
      <div className="home-inner">

        {/* ================= CHATBOT (TOP RIGHT) ================= */}
        <div className="chatbot-top-right">
          <AIChatbot />
        </div>

        {/* ================= HERO SECTION ================= */}
        <section className="hero">
          <div className="hero-copy">
            <h1 className="hero-title">
              Adaptive E-Learning Platform
              <span className="hero-highlight">
                AI-Powered English Proficiency Training
              </span>
            </h1>

            <p className="hero-sub">
              Prepare for IELTS and TOEFL with adaptive quizzes, timed essay
              writing, AI-based evaluation, and personalized feedback —
              all in one intelligent learning platform.
            </p>

            <div className="hero-cta">
              <button
                className="btn btn-primary"
                onClick={() => onNavigate('quiz')}
              >
                Start Quiz
              </button>

              <button
                className="btn btn-outline"
                onClick={() => onNavigate('essay')}
              >
                Write Essay
              </button>
            </div>
          </div>

          {/* ================= HERO STATS ================= */}
          <div className="hero-stats">
            <div className="stat">
              <div className="stat-value">AI</div>
              <div className="stat-label">Evaluation</div>
            </div>

            <div className="stat">
              <div className="stat-value">3</div>
              <div className="stat-label">Difficulty Levels</div>
            </div>

            <div className="stat">
              <div className="stat-value">IELTS</div>
              <div className="stat-label">Exam Style</div>
            </div>
          </div>
        </section>

        {/* ================= FEATURES SECTION ================= */}
        <section className="features-section">
          <h2 className="section-title">Key Features</h2>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon feat-blue">
                <span className="icon">Q</span>
              </div>
              <h3 className="feature-title">Adaptive Quizzes</h3>
              <p className="feature-desc">
                AI-generated grammar and vocabulary questions that adapt
                to your performance and skill level.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon feat-green">
                <span className="icon">E</span>
              </div>
              <h3 className="feature-title">Essay Writing</h3>
              <p className="feature-desc">
                IELTS-style essay questions with strict time limits
                and word-count validation.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon feat-orange">
                <span className="icon">A</span>
              </div>
              <h3 className="feature-title">AI Evaluation</h3>
              <p className="feature-desc">
                Instant band scores and constructive feedback based on
                IELTS and TOEFL assessment criteria.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon feat-cyan">
                <span className="icon">D</span>
              </div>
              <h3 className="feature-title">Progress Dashboard</h3>
              <p className="feature-desc">
                Track quiz attempts, essay scores, averages,
                and recent learning activity.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon feat-red">
                <span className="icon">T</span>
              </div>
              <h3 className="feature-title">Timed Practice</h3>
              <p className="feature-desc">
                Experience real exam pressure with countdown timers
                and automatic submission.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon feat-blue">
                <span className="icon">P</span>
              </div>
              <h3 className="feature-title">Personalized Learning</h3>
              <p className="feature-desc">
                AI-driven insights help learners focus on weak areas
                and improve faster.
              </p>
            </div>
          </div>
        </section>

        {/* ================= CTA SECTION ================= */}
        <section className="cta-section">
          <h2 className="cta-title">Start Your English Journey Today</h2>
          <p className="cta-sub">
            Build confidence, improve fluency, and succeed in IELTS or TOEFL
            with AI-powered preparation.
          </p>

          <button
            className="btn-cta"
            onClick={() => onNavigate('dashboard')}
          >
            View Dashboard
          </button>
        </section>

      </div>
    </div>
  );
}
