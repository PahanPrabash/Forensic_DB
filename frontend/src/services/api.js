const API_BASE_URL = 'http://localhost:5000/api';

// Helper for HTTP requests
const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error.message);
    throw error;
  }
};

export const authAPI = {
  login: (username, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) }),
  register: (userData) => request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  getMe: () => request('/auth/me', { method: 'GET' }),
  updateProfile: (profileData) => request('/auth/profile', { method: 'PUT', body: JSON.stringify(profileData) })
};

export const staffAPI = {
  getAllStaff: () => request('/staff', { method: 'GET' }),
  createStaff: (staffData) => request('/staff', { method: 'POST', body: JSON.stringify(staffData) }),
  updateStatus: (id, isActive) => request(`/staff/${id}/status`, { method: 'PUT', body: JSON.stringify({ isActive }) }),
  deleteStaff: (id) => request(`/staff/${id}`, { method: 'DELETE' }),
  getAllDoctors: () => request('/staff/doctors', { method: 'GET' }),
  createDoctor: (doctorData) => request('/staff/doctors', { method: 'POST', body: JSON.stringify(doctorData) })
};

export const roleAPI = {
  getAllRoles: () => request('/roles', { method: 'GET' }),
  getPermissions: (roleId) => request(`/roles/${roleId}/permissions`, { method: 'GET' }),
  updatePermission: (roleId, permissionData) => request(`/roles/${roleId}/permissions`, { method: 'PUT', body: JSON.stringify(permissionData) })
};

export const dashboardAPI = {
  getStats: () => request('/dashboard/stats', { method: 'GET' })
};

export const caseAPI = {
  getCases: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/cases${query ? `?${query}` : ''}`, { method: 'GET' });
  },
  createCase: (caseData) => request('/cases', { method: 'POST', body: JSON.stringify(caseData) })
};
