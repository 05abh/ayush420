// Remove the localhost:5000 - now using proxy
export const API_BASE_URL = 'http://localhost:5001/api'; // Changed to 5001

// Local Storage Keys
export const STORAGE_KEYS = {
  USER: 'hospital_user',
  TOKEN: 'hospital_token'
};

// Format date
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Validate email
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};