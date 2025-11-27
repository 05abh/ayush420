import axios from 'axios';
import { API_BASE_URL, STORAGE_KEYS } from '../utils';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  registerPatient: (data) => api.post('/auth/register/patient', data),
  registerHospital: (data) => api.post('/auth/register/hospital', data),
};

// Patient API
export const patientAPI = {
  searchHospitals: (params) => api.get('/patient/hospitals', { params }),
  bookBed: (data) => api.post('/patient/book-bed', data),
  getMyBookings: () => api.get('/patient/my-bookings'),
};

// Hospital API
export const hospitalAPI = {
  getBookings: () => api.get('/hospital/bookings'),
  updateBookingStatus: (bookingId, status) => 
    api.put(`/hospital/booking/${bookingId}/status`, { status }),
  updateBedAvailability: (availableBeds) => 
    api.put('/hospital/beds', { availableBeds }),
  updateTreatmentDetails: (bookingId, data) => 
    api.put(`/hospital/booking/${bookingId}/treatment`, data),
  dischargePatient: (bookingId, dischargeData) => 
    api.put(`/hospital/booking/${bookingId}/discharge`, dischargeData), // Send object, not just string
};

 
// Add to your existing API exports
export const reportAPI = {
  getHospitalReports: () => api.get('/reports/hospital'),
  getPatientReports: (patientId) => api.get(`/reports/patient/${patientId}`),
  getReportById: (reportId) => api.get(`/reports/${reportId}`)
};
// Admin API
export const adminAPI = {
  getUsers: () => api.get('/admin/users'),
  getAnalytics: () => api.get('/admin/analytics'),
};

export default api;