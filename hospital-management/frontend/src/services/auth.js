import { authAPI } from './api';

export const authService = {
  async login(email, password, role) {
    const response = await authAPI.login({ email, password, role });
    return response.data;
  },

  async registerPatient(userData) {
    const response = await authAPI.registerPatient(userData);
    return response.data;
  },

  async registerHospital(userData) {
    const response = await authAPI.registerHospital(userData);
    return response.data;
  },
};