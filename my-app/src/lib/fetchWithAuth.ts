export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No token found. Please login first.");
  }

  const res = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (res.status === 401) {
    // Token expired or invalid
    throw new Error("Unauthorized. Token may be invalid or expired.");
  }

  return res;
}
