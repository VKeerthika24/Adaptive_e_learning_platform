import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/Auth.css';

export default function Auth() {
  const { login, signup } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        if (!fullName.trim()) {
          setError('Full name is required');
          setLoading(false);
          return;
        }
        await signup(fullName, email, password);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <div className="auth-card">
          <h2 className="title">English Learning Platform</h2>
          <p className="subtitle">
            {isLogin ? 'Welcome back! Login to continue' : 'Create your account to start learning'}
          </p>

          {/* Toggle */}
          <div className="toggle">
            <button
              className={`toggle-btn ${isLogin ? 'active' : ''}`}
              onClick={() => setIsLogin(true)}
              type="button"
            >
              Login
            </button>
            <button
              className={`toggle-btn ${!isLogin ? 'active' : ''}`}
              onClick={() => setIsLogin(false)}
              type="button"
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form className="form" onSubmit={handleSubmit}>
            {!isLogin && (
              <input
                className="text-input"
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            )}

            <input
              className="text-input"
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              className="text-input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && <div className="error">{error}</div>}

            <button className="submit-btn" type="submit" disabled={loading}>
              {loading
                ? 'Please wait...'
                : isLogin
                ? 'Login'
                : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
