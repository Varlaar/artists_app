import axios from 'axios';
import { API_URL } from '../assets/constants';

const instance = axios.create({
  baseURL: API_URL,
  timeout: 1000
});

export default instance;