import { useState } from 'react';
import { useAuth } from './context/AuthContext';

// Pages
import Auth from './pages/Auth';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Quiz from './pages/Quiz';
import Essay from './pages/Essay';
import Speaking from './pages/Speaking'; // ✅ IMPORT SPEAKING
import Profile from './pages/Profile';
import Listening from './pages/Listening';

// Components
import Navbar from './components/Navbar';

export default function App() {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState('home');

  // 🔐 If user is NOT logged in → show Auth page
  if (!user) {
    return <Auth />;
  }

  // 📄 Decide which page to show
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={setCurrentPage} />;

      case 'dashboard':
        return <Dashboard />;

      case 'quiz':
        return <Quiz />;

      case 'essay':
        return <Essay />;

      case 'speaking': // ✅ HANDLE SPEAKING
        return <Speaking />;
        
      case 'listening':
        return <Listening />;


      case 'profile':
        return <Profile />;

      default:
        return <Home onNavigate={setCurrentPage} />;
    }
  };

  return (
    <>
      <Navbar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
      />
      {renderPage()}
    </>
  );
}
