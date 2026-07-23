const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://mini-crm-backend-5see.onrender.com/api';

function getAuthHeader() {
  const token = localStorage.getItem('crm_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

async function handleResponse(response) {
  const data = await response.json();
  if (!response.ok) {
    if (response.status === 401) {
      // Clear token if expired or unauthorized
      localStorage.removeItem('crm_token');
      localStorage.removeItem('crm_user');
    }
    throw new Error(data.error || 'API Request failed');
  }
  return data;
}

export const api = {
  // Auth API
  auth: {
    login: async (email, password) => {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      return handleResponse(res);
    },
    getMe: async () => {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: getAuthHeader()
      });
      return handleResponse(res);
    }
  },

  // Lead Management API
  leads: {
    getAll: async (filters = {}) => {
      const queryParams = new URLSearchParams(filters).toString();
      const res = await fetch(`${API_BASE}/leads?${queryParams}`, {
        headers: getAuthHeader()
      });
      return handleResponse(res);
    },
    getById: async (id) => {
      const res = await fetch(`${API_BASE}/leads/${id}`, {
        headers: getAuthHeader()
      });
      return handleResponse(res);
    },
    create: async (leadData) => {
      const res = await fetch(`${API_BASE}/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify(leadData)
      });
      return handleResponse(res);
    },
    update: async (id, leadData) => {
      const res = await fetch(`${API_BASE}/leads/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify(leadData)
      });
      return handleResponse(res);
    },
    updateStatus: async (id, status) => {
      const res = await fetch(`${API_BASE}/leads/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify({ status })
      });
      return handleResponse(res);
    },
    addNote: async (id, { content, type }) => {
      const res = await fetch(`${API_BASE}/leads/${id}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify({ content, type })
      });
      return handleResponse(res);
    },
    delete: async (id) => {
      const res = await fetch(`${API_BASE}/leads/${id}`, {
        method: 'DELETE',
        headers: getAuthHeader()
      });
      return handleResponse(res);
    }
  },

  // Analytics API
  analytics: {
    getSummary: async () => {
      const res = await fetch(`${API_BASE}/analytics/summary`, {
        headers: getAuthHeader()
      });
      return handleResponse(res);
    }
  },

  // Public Lead Form API
  public: {
    submitContact: async (leadData) => {
      const res = await fetch(`${API_BASE}/public/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData)
      });
      return handleResponse(res);
    }
  }
};
