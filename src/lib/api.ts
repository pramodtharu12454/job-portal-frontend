import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export default api;

export const authAPI = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data: any) => api.put('/auth/profile', data),
  changePassword: (data: any) => api.put('/auth/change-password', data),
};

export const jobsAPI = {
  getJobs: (params?: any) => api.get('/jobs', { params }),
  getMyJobs: (params?: any) => api.get('/jobs/my', { params }),
  getJob: (id: string) => api.get(`/jobs/${id}`),
  createJob: (data: any) => api.post('/jobs', data),
  updateJob: (id: string, data: any) => api.put(`/jobs/${id}`, data),
  deleteJob: (id: string) => api.delete(`/jobs/${id}`),
  approveJob: (id: string, status: string) => api.put(`/jobs/${id}/approve`, { status }),
};

export const applicationsAPI = {
  getApplications: (params?: any) => api.get('/applications', { params }),
  apply: (jobId: string, data: FormData) => api.post(`/applications/${jobId}/apply`, data),
  updateStatus: (id: string, data: any) => api.put(`/applications/${id}/status`, data),
};

export const categoriesAPI = {
  getCategories: () => api.get('/categories'),
  createCategory: (data: any) => api.post('/categories', data),
  updateCategory: (id: string, data: any) => api.put(`/categories/${id}`, data),
  deleteCategory: (id: string) => api.delete(`/categories/${id}`),
};

export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: (params?: any) => api.get('/admin/users', { params }),
  toggleUserStatus: (id: string) => api.put(`/admin/users/${id}/toggle-status`),
  updateUserRole: (id: string, role: string) => api.put(`/admin/users/${id}/role`, { role }),
  getAllJobs: (params?: any) => api.get('/admin/jobs', { params }),
};

export const cvAPI = {
  getCVs: () => api.get('/cv'),
  getCV: (id: string) => api.get(`/cv/${id}`),
  createCV: (data: any) => api.post('/cv', data),
  updateCV: (id: string, data: any) => api.put(`/cv/${id}`, data),
  deleteCV: (id: string) => api.delete(`/cv/${id}`),
  duplicateCV: (id: string) => api.post(`/cv/${id}/duplicate`),
};

export const helpAPI = {
  contact: (data: { name: string; email: string; message: string }) => api.post('/help/contact', data),
};

export const notificationsAPI = {
  getNotifications: () => api.get('/notifications'),
  markAsRead: (id: string) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
};

export const uploadAPI = {
  photo: (data: FormData) => api.post('/upload/photo', data),
  companyLogo: (data: FormData) => api.post('/upload/company-logo', data),
  cvPhoto: (data: FormData) => api.post('/upload/cv-photo', data),
  jobImage: (data: FormData) => api.post('/upload/job-image', data),
};

export const usersAPI = {
  uploadPhoto: (data: FormData) => api.put('/users/photo', data),
  uploadCompanyLogo: (data: FormData) => api.put('/users/company-logo', data),
  saveJob: (jobId: string) => api.post(`/users/save-job/${jobId}`),
  getSavedJobs: () => api.get('/users/saved-jobs'),
};
