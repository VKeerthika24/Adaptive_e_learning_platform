// ✅ BASE URL (IMPORTANT: includes /api)
const API_URL = "https://elearning-backend.onrender.com/api";

// ✅ Generic API function
export const api = async (endpoint, method = "GET", body = null) => {
  const token = localStorage.getItem("token");

  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };

  // ✅ Attach body for POST/PUT/PATCH
  if (body && method !== "GET") {
    options.body = JSON.stringify(body);
  }

  let res;

  try {
    res = await fetch(`${API_URL}${endpoint}`, options);
  } catch (error) {
    // 🔴 Network / server down
    throw new Error("Unable to connect to server. Please try again later.");
  }

  let data;

  try {
    data = await res.json();
  } catch {
    data = null;
  }

  // ❌ Handle API errors
  if (!res.ok) {
    throw new Error(
      data?.message || "Something went wrong. Please try again."
    );
  }

  return data;
};