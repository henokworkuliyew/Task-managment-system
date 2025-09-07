// Simple script to clear all authentication tokens from localStorage
// Run this in browser console or as a standalone script

if (typeof window !== 'undefined' && window.localStorage) {
  console.log('Clearing all authentication tokens...');
  
  // Remove all auth-related items
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  
  // Clear any other potential auth keys
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.includes('token') || key.includes('auth') || key.includes('jwt')) {
      localStorage.removeItem(key);
      console.log(`Removed: ${key}`);
    }
  });
  
  console.log('All tokens cleared. Please refresh the page and login again.');
  
  // Optionally redirect to login
  if (window.location.pathname !== '/auth/login') {
    window.location.href = '/auth/login';
  }
} else {
  console.log('localStorage not available');
}
