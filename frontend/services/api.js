const API_BASE_URL = "/api";

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
        console.log("API Error Response:", errorData);
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

  // Auth endpoints
  async login(email, password) {
    return this.request("/v1/auth/authenticate", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async register(name, email, password, phone) {
    return this.request("/v1/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password, phone }),
    });
  }

  async refreshToken(refreshToken) {
    return this.request("/v1/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    });
  }

  // User endpoints
  async getCurrentUser() {
    return this.request("/users/me", {
      method: "GET",
    });
  }

  async updateUser(userData) {
    return this.request("/users/me", {
      method: "PUT",
      body: JSON.stringify(userData),
    });
  }

  // Roommate/Listing endpoints
  async getRoommates(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    return this.request(`/roommates?${params}`, {
      method: "GET",
    });
  }

  async getRoommateById(id) {
    return this.request(`/roommates/${id}`, {
      method: "GET",
    });
  }

  // Save token to localStorage
  setToken(token) {
    localStorage.setItem("token", token);
  }

  // Remove token from localStorage
  removeToken() {
    localStorage.removeItem("token");
  }
}

export default new ApiService();
