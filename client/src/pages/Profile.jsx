import { useAuth } from '../context/AuthContext';
import '../styles/global.css';

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="profile-container">
      <h2>Profile</h2>

      <div className="profile-card">
        <p>
          <strong>Name:</strong> {user?.name}
        </p>

        <p>
          <strong>User ID:</strong> {user?.id}
        </p>

        <p>
          <strong>Status:</strong> Active
        </p>
      </div>
    </div>
  );
}
