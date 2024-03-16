import axios from 'axios';
import Constant from '../constant/Constant';

const apiClient = axios.create({
    baseURL: Constant.BASE_URL,
});

// Function to make authorized requests
export const makeAuthorizedRequest = (method, url, data, accessToken) => {
    return apiClient({
        method,
        url,
        data,
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
};

// Function to make unauthorized requests
export const makeUnauthorizedRequest = (method, url, data) => {
    return apiClient({
        method,
        url,
        data,
    });
};

// Request interceptor
// apiClient.interceptors.request.use(
//     (config) => {
//       console.log('Making request to:', config.url);
//       return config;
//     },
//     (error) => {
//       console.error('Request error:', error.message);
//       return Promise.reject(error);
//     }
//   );
  
//   // Response interceptor
//   apiClient.interceptors.response.use(
//     (response) => {
//       console.log('Received response from:', response.config.url);
//       return response;
//     },
//     (error) => {
//       console.error('Response error:', error.message);
//       return Promise.reject(error);
//     }
//   );
  