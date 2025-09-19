export const API_BASE =
  process.env.REACT_APP_API_BASE || "http://localhost:8000/api";

// Fetch dashboard statistics
export const fetchStats = async () => {
  try {
    const response = await fetch(`${API_BASE}/stats/`);
    if (!response.ok) {
      throw new Error('Failed to fetch stats');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching stats:', error);
    throw error;
  }
};
