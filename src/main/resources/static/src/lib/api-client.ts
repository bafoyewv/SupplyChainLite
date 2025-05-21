import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://10.30.13.205:3000/api/v1',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    withCredentials: true
});

export default apiClient;