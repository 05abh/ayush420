// Utility functions
exports.validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

exports.formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN');
};