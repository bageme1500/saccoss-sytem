const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

async function apiRequest(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new ApiError(
        data.error || `HTTP error! status: ${response.status}`,
        response.status,
        data
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(error.message || 'Network error', 0, {});
  }
}

// User API
export const userApi = {
  getAll: () => apiRequest('/users'),
  getById: (id) => apiRequest(`/users/${id}`),
  create: (userData) => apiRequest('/users', { method: 'POST', body: userData }),
};

// Role API
export const roleApi = {
  create: (name) => apiRequest('/roles', { method: 'POST', body: { name } }),
};

// Membership API
export const membershipApi = {
  getAll: () => apiRequest('/memberships'),
  create: (membershipData) =>
    apiRequest('/memberships', { method: 'POST', body: membershipData }),
};

// Monthly Contribution API
export const contributionApi = {
  getAll: () => apiRequest('/monthly_contributions'),
  create: (contributionData) =>
    apiRequest('/monthly_contributions', { method: 'POST', body: contributionData }),
};

// Payment API
export const paymentApi = {
  getAll: () => apiRequest('/payments'),
  create: (paymentData) =>
    apiRequest('/payments', { method: 'POST', body: paymentData }),
};

export default {
  userApi,
  roleApi,
  membershipApi,
  contributionApi,
  paymentApi,
};

