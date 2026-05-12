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

  async register({ name, email, password, phone }) {
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
    const params = new URLSearchParams();
    if (filters.location) params.append("location", filters.location);
    if (filters.minBudget) params.append("minBudget", filters.minBudget);
    if (filters.maxBudget) params.append("maxBudget", filters.maxBudget);
    if (filters.gender && filters.gender !== "All")
      params.append("gender", filters.gender);
    if (filters.lifestyle && filters.lifestyle.length > 0) {
      filters.lifestyle.forEach((l) => params.append("lifestyle", l));
    }
    if (filters.smoking) params.append("smoking", filters.smoking);
    if (filters.pets) params.append("pets", filters.pets);
    if (filters.sortBy) params.append("sortBy", filters.sortBy);

    const queryString = params.toString();
    const response = await this.request(
      `/v1/search/roommates${queryString ? "?" + queryString : ""}`,
      {
        method: "GET",
      },
    );
    return response.data || [];
  }

  async getRoommateById(id) {
    const response = await this.request(`/v1/search/roommates/${id}`, {
      method: "GET",
    });
    return response.data;
  }

  async getRecommendations(limit = 6) {
    const response = await this.request(
      `/v1/search/recommendations?limit=${limit}`,
      {
        method: "GET",
      },
    );
    return response.data || [];
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
