const API_URL = "https://elearning-backend.onrender.com";

export const api = async (endpoint, method = 'GET', body = null) => {
  const token = localStorage.getItem('token');

  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    }
  };

  // ✅ Attach body only for non-GET requests
  if (body && method !== 'GET') {
    options.body = JSON.stringify(body);
  }

  let res;
  try {
    res = await fetch(`${API_URL}${endpoint}`, options);
  } catch (networkError) {
    // 🔴 Server not reachable / CORS / offline
    throw new Error('Unable to connect to server. Please try again later.');
  }

  // ✅ Try to parse JSON safely
  let data;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    throw new Error(
      data?.message || 'Something went wrong. Please try again.'
    );
  }

  return data;
};
