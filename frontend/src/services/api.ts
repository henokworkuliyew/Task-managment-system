import axios from 'axios';
import { setupInterceptors } from '../utils/apiInterceptors';

let API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
API_URL = API_URL.trim();

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

setupInterceptors(api);

export default api;