

export const logoutAction = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  
  if (typeof window !== 'undefined') {
    window.location.href = '/auth/login';
  }
};