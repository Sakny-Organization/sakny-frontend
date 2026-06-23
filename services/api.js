const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

class ApiService {
  constructor(baseUrl = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  getHeaders() {
    const headers = {
      "Content-Type": "application/json",
    };
    const token = localStorage.getItem("token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const config = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            errorData.error ||
            `HTTP error! status: ${response.status}`,
        );
      }

      return await response.json();
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  async login(email, password) {
    return this.request("/v1/auth/authenticate", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async register({ name, email, password, phone, housingRole }) {
    return this.request("/v1/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password, phone, housingRole }),
    });
  }

  async getCurrentUser() {
    const response = await this.request("/v1/profile", {
      method: "GET",
    });
    return response.data || response;
  }

  async updateUser(userData) {
    return this.request("/v1/profile", {
      method: "PUT",
      body: JSON.stringify(userData),
    });
  }

  async sendOtp({ identifier, channel, purpose }) {
    return this.request("/v1/auth/send-otp", {
      method: "POST",
      body: JSON.stringify({ identifier, channel, purpose }),
    });
  }

  async verifyOtp({ identifier, code, channel, purpose }) {
    return this.request("/v1/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ identifier, code, channel, purpose }),
    });
  }

  async resetPassword({ identifier, code, channel, newPassword }) {
    return this.request("/v1/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ identifier, code, channel, newPassword }),
    });
  }

  setToken(token) {
    localStorage.setItem("token", token);
  }

  removeToken() {
    localStorage.removeItem("token");
  }
}

export default new ApiService();
