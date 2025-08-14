import useAdminAuth from "@/hooks/useAdminAuth";
import axios from "axios";

// Helper function to get the appropriate token
const adminAuthToken = useAdminAuth();
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    // Check for admin token first
    const adminToken = adminAuthToken?.token ?? sessionStorage.getItem("adminAuthToken");
    if (adminToken) {
      return { token: adminToken, type: 'admin' };
    }
    // Fallback to user token
    const userToken = sessionStorage.getItem("authToken");
    if (userToken) {
      return { token: userToken, type: 'user' };
    }
  }
  return { token: null, type: null };
};

export const axiosPrivate = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${adminAuthToken?.token ?? sessionStorage.getItem("adminAuthToken")}`
  },
});

// Request interceptor for private axios (authenticated requests)
axiosPrivate.interceptors.request.use(
  (config) => {
    const { token } = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for private axios
// axiosPrivate.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       // Handle unauthorized access
//       const { type } = getAuthToken();
//       if (type === 'admin') {
//         sessionStorage.removeItem("adminAuthToken");
//         window.location.href = '/admin/auth';
//       } else {
//         sessionStorage.removeItem("authToken");
//         window.location.href = '/auth';
//       }
//     }
//     return Promise.reject(error);
//   }
// );

export const axiosPublic = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for public axios (no auth redirect)
axiosPublic.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle public API errors without auth redirect
    return Promise.reject(error);
  }
);