
import axios from 'axios';
import { BASE_URL } from '../env';

export const request = axios.create({
    baseURL: BASE_URL
});

request.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
