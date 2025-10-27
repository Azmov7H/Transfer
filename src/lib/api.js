const API_URL = "http://localhost:5000/api"; // غيّر حسب السيرفر

// ============== 🗝️ TOKEN MANAGEMENT ==============
export const setAuthToken = (token) => {
  if (typeof window !== "undefined") localStorage.setItem("token", token);
};

export const getAuthToken = () => {
  if (typeof window !== "undefined") return localStorage.getItem("token");
  return null;
};

export const removeAuthToken = () => {
  if (typeof window !== "undefined") localStorage.removeItem("token");
};

// ============== ⚙️ GENERIC REQUEST FUNCTION ==============
async function request(endpoint, method = "GET", data, requiresAuth = true) {
  const headers = { "Content-Type": "application/json" };

  if (requiresAuth) {
    const token = getAuthToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const options = {
    method,
    headers,
    ...(data ? { body: JSON.stringify(data) } : {}),
  };

  const res = await fetch(`${API_URL}${endpoint}`, options);
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Request failed");
  return json;
}

// ============== 🧍 AUTH ROUTES ==============
export const registerUser = (data) => request("/auth/register", "POST", data, false);
export const loginUser = async (data) => {
  const res = await request("/auth/login", "POST", data, false);
  if (res.token) setAuthToken(res.token);
  return res;
};
export const getCurrentUser = () => request("/users/me", "GET");

// ============== 📦 PRODUCT ROUTES ==============
export const addProduct = (data) => request("/products", "POST", data);
export const getUserProducts = () => request("/products", "GET");
export const getProductById = (id) => request(`/products/${id}`, "GET");
export const updateProductStatus = (id, data) => request(`/products/${id}/status`, "PATCH", data);

// ============== 👮 ADMIN ROUTES ==============
export const getAllUsers = () => request("/admin/users", "GET");
export const approveUser = (id, action) =>
  request(`/admin/users/${id}/approve`, "PATCH", { action });
export const setUserPermission = (id, canAddProducts) =>
  request(`/admin/users/${id}/permission`, "PATCH", { canAddProducts });

// ============== 🚀 AUTO LOAD TOKEN ON STARTUP ==============
export const initAuth = () => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) console.log("Auth token restored from localStorage");
  }
};
