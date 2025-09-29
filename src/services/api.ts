import axios from 'axios';
import { getToken, getRefreshToken, setTokens, clearTokens } from './auth';

// Create axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Debug logging for development
    if (process.env.NODE_ENV === 'development') {
      console.log('API Request:', {
        url: config.url,
        method: config.method,
        baseURL: config.baseURL,
        fullURL: `${config.baseURL}${config.url}`,
        headers: config.headers,
        data: config.data
      });
    }
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => {
    // Debug logging for development
    if (process.env.NODE_ENV === 'development') {
      console.log('API Response:', {
        url: response.config.url,
        method: response.config.method,
        status: response.status,
        statusText: response.statusText,
        data: response.data
      });
    }
    return response;
  },
  async (error) => {
    // Debug logging for development
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
    }
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = getRefreshToken();
        
        if (refreshToken) {
          const response = await axios.post(`${api.defaults.baseURL}/auth/refresh`, {
            refreshToken,
          });
          
          const { accessToken, refreshToken: newRefreshToken } = response.data;
          
          // Update localStorage with new tokens
          setTokens(accessToken, newRefreshToken);
          
          // Retry original request
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect to login
        clearTokens();
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login', credentials),
    
  register: (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }) => api.post('/auth/register', userData),
    
  logout: () => api.post('/auth/logout'),
    
  refreshToken: (refreshToken: string) =>
    api.post('/auth/refresh', { refreshToken }),
    
  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),
    
  resetPassword: (token: string, password: string) =>
    api.post('/auth/reset-password', { token, password }),
    
  verifyEmail: (token: string) =>
    api.post('/auth/verify-email', { token }),
    
  changePassword: (passwords: {
    currentPassword: string;
    newPassword: string;
  }) => api.put('/auth/change-password', passwords),
};

// User API
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  
  updateProfile: (profileData: any) =>
    api.put('/users/profile', profileData),
    
  uploadProfileImage: (imageFile: File) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    return api.post('/users/profile/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  
  getBookings: (params?: any) =>
    api.get('/users/bookings', { params }),
    
  getAddresses: () => api.get('/users/addresses'),
  
  addAddress: (addressData: any) =>
    api.post('/users/addresses', addressData),
    
  updateAddress: (addressId: string, addressData: any) =>
    api.put(`/users/addresses/${addressId}`, addressData),
    
  deleteAddress: (addressId: string) =>
    api.delete(`/users/addresses/${addressId}`),
    
  getNotifications: (params?: any) =>
    api.get('/users/notifications', { params }),
    
  deleteAccount: () => api.delete('/users/account'),
};

// Booking API
export const bookingAPI = {
  searchBookings: (params?: any) =>
    api.get('/bookings/search', { params }),
    
  createBooking: (bookingData: {
    panditId: string;
    serviceId: string;
    bookingDate: string;
    bookingTime: string;
    timezone: string;
    specialInstructions?: string;
  }) => api.post('/bookings', bookingData),
    
  getBooking: (bookingId: string) =>
    api.get(`/bookings/${bookingId}`),
    
  updateBooking: (bookingId: string, bookingData: any) =>
    api.put(`/bookings/${bookingId}`, bookingData),
    
  cancelBooking: (bookingId: string, reason: string) =>
    api.put(`/bookings/${bookingId}/cancel`, { reason }),
    
  rescheduleBooking: (bookingId: string, newDateTime: string) =>
    api.put(`/bookings/${bookingId}/reschedule`, { newDateTime }),
    
  addReview: (bookingId: string, reviewData: {
    rating: number;
    comment: string;
  }) => api.post(`/bookings/${bookingId}/review`, reviewData),
    
  getAvailableSlots: (panditId: string, date: string) =>
    api.get(`/bookings/availability/${panditId}`, { params: { date } }),
};

// Services API
export const serviceAPI = {
  getAllServices: (params?: any) =>
    api.get('/services', { params }),
    
  searchServices: (params?: any) =>
    api.get('/services/search', { params }),
    
  getService: (serviceId: string) =>
    api.get(`/services/${serviceId}`),
    
  getServiceCategories: () =>
    api.get('/services/categories'),
    
  getServicesByCategory: (category: string) =>
    api.get(`/services/category/${category}`),
};

// Pandit API
export const panditAPI = {
  searchPandits: (params?: any) =>
    api.get('/pandits/search', { params }),
    
  getPandit: (panditId: string) =>
    api.get(`/pandits/${panditId}`),
    
  getAvailablePandits: (filters: {
    serviceId?: string;
    date?: string;
    time?: string;
    location?: string;
  }) => api.get('/pandits/available', { params: filters }),
    
  getPanditReviews: (panditId: string) =>
    api.get(`/pandits/${panditId}/reviews`),
    
  getPanditAvailability: (panditId: string, date?: string) =>
    api.get(`/pandits/${panditId}/availability`, { params: { date } }),
    
  registerPandit: (registrationData: FormData) =>
    api.post('/pandits/register', registrationData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
    
  createPanditProfile: (profileData: FormData) =>
    api.post('/pandits/profile', profileData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
    
  updatePanditProfile: (profileData: any) =>
    api.put('/pandits/profile/me', profileData),
    
  getPanditBookings: (params?: any) =>
    api.get('/pandits/bookings', { params }),
    
  updateBookingStatus: (bookingId: string, status: string) =>
    api.put(`/pandits/bookings/${bookingId}/status`, { status }),
};

// Payment API
export const paymentAPI = {
  createPayment: (paymentData: {
    bookingId: string;
    amount: number;
    currency: string;
    paymentMethod: string;
  }) => api.post('/payments', paymentData),
    
  processPayment: (paymentId: string, paymentData: any) =>
    api.put(`/payments/${paymentId}/process`, paymentData),
    
  verifyPayment: (paymentId: string) =>
    api.get(`/payments/${paymentId}/verify`),
    
  searchPayments: (params?: any) =>
    api.get('/payments/search', { params }),
    
  getPaymentHistory: () =>
    api.get('/payments/history'),
    
  createRefund: (paymentId: string, refundData: {
    amount?: number;
    reason: string;
  }) => api.post(`/payments/${paymentId}/refund`, refundData),
};

// Notification API
export const notificationAPI = {
  getNotifications: (params?: any) =>
    api.get('/notifications/me', { params }),
    
  markAsRead: (notificationId: string) =>
    api.put(`/notifications/${notificationId}/read`),
    
  markAllAsRead: () =>
    api.put('/notifications/read-all'),
    
  updateNotificationPreferences: (preferences: any) =>
    api.put('/notifications/preferences', preferences),
    
  sendNotification: (notificationData: {
    userId: string;
    type: string;
    title: string;
    message: string;
    data?: any;
  }) => api.post('/notifications', notificationData),
};

// Streaming API
export const streamingAPI = {
  createMeeting: (meetingData: {
    bookingId: string;
    topic: string;
    duration: number;
    password?: string;
    provider?: string;
  }) => api.post('/streaming/meetings', meetingData),
    
  getMeeting: (meetingId: string) =>
    api.get(`/streaming/meetings/${meetingId}`),
    
  joinMeeting: (meetingId: string, joinData: {
    password?: string;
    userName: string;
    userEmail?: string;
  }) => api.post(`/streaming/meetings/${meetingId}/join`, joinData),
    
  endMeeting: (meetingId: string, reason?: string) =>
    api.put(`/streaming/meetings/${meetingId}/end`, { reason }),
    
  getMeetingParticipants: (meetingId: string) =>
    api.get(`/streaming/meetings/${meetingId}/participants`),
    
  sendWebRTCSignal: (meetingId: string, signalData: {
    signal: string;
    type: string;
    targetUserId?: string;
  }) => api.post(`/streaming/webrtc/${meetingId}/signal`, signalData),
    
  getWebRTCSignals: (meetingId: string, fromTimestamp?: string) =>
    api.get(`/streaming/webrtc/${meetingId}/signals`, { 
      params: { from: fromTimestamp } 
    }),
    
  getStreamingStats: () =>
    api.get('/streaming/stats'),
};

// Admin API
export const adminAPI = {
  // Dashboard
  getDashboardStats: () =>
    api.get('/admin/dashboard/stats'),
    
  // Users
  getUsers: (params?: any) =>
    api.get('/admin/users', { params }),
    
  getUser: (userId: string) =>
    api.get(`/admin/users/${userId}`),
    
  updateUserStatus: (userId: string, status: { isActive: boolean }) =>
    api.put(`/admin/users/${userId}/status`, status),
    
  deleteUser: (userId: string) =>
    api.delete(`/admin/users/${userId}`),
    
  // Pandits
  getPandits: (params?: any) =>
    api.get('/admin/pandits', { params }),
    
  getPandit: (panditId: string) =>
    api.get(`/admin/pandits/${panditId}`),
    
  verifyPandit: (panditId: string) =>
    api.put(`/admin/pandits/${panditId}/verify`),
    
  unverifyPandit: (panditId: string) =>
    api.put(`/admin/pandits/${panditId}/unverify`),
    
  getPanditPerformance: (panditId: string) =>
    api.get(`/admin/pandits/${panditId}/performance`),
    
  // Services Management
  getServices: (params?: any) =>
    api.get('/services', { params }),
    
  getService: (serviceId: string) =>
    api.get(`/services/${serviceId}`),
    
  createService: (serviceData: any) =>
    api.post('/services', serviceData),
    
  updateService: (serviceId: string, serviceData: any) =>
    api.patch(`/services/${serviceId}`, serviceData),
    
  deleteService: (serviceId: string) =>
    api.delete(`/services/${serviceId}`),
    
  getServiceStats: () =>
    api.get('/admin/services/stats'),
    
  // Analytics
  getAnalytics: () =>
    api.get('/admin/analytics'),
};

export default api;
