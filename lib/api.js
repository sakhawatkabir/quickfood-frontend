const BASE = "/api";

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}

async function handleResponse(res) {
  let data = null;
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    try {
      data = await res.json();
    } catch {
      data = null;
    }
  }

  if (!res.ok) {
    const message =
      data?.error ||
      data?.message ||
      data?.detail ||
      `Request failed with status ${res.status}`;
    throw new Error(message);
  }
  return data;
}

// ── Auth

export async function loginUser({ username, password }) {
  const res = await fetch(`${BASE}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  return handleResponse(res);
}

export async function registerUser({ username, email, password, password2 }) {
  const res = await fetch(`${BASE}/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password, password2 }),
  });
  return handleResponse(res);
}

// ── User Profile

export async function fetchProfile() {
  const res = await fetch(`${BASE}/users/profile`, {
    headers: { Authorization: `Bearer ${getToken()}` },
    cache: "no-store",
  });
  return handleResponse(res);
}

export async function updateProfile(data) {
  const res = await fetch(`${BASE}/users/update-profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

// ── Menu Items

export async function fetchMenuItems() {
  const res = await fetch(`${BASE}/menu-items`, { cache: "no-store" });
  return handleResponse(res);
}

// ── Restaurants (public)

export async function fetchRestaurants() {
  const res = await fetch(`${BASE}/restaurants`, { cache: "no-store" });
  return handleResponse(res);
}

export async function fetchRestaurant(id) {
  const res = await fetch(`${BASE}/restaurant/${id}`, { cache: "no-store" });
  return handleResponse(res);
}

// ── Owner Restaurants

export async function fetchOwnerRestaurants() {
  const res = await fetch(`${BASE}/owner-restaurants`, {
    headers: { Authorization: `Bearer ${getToken()}` },
    cache: "no-store",
  });
  return handleResponse(res);
}

export async function createRestaurant(formData) {
  const res = await fetch(`${BASE}/create-restaurant`, {
    method: "POST",
    headers: { Authorization: `Bearer ${getToken()}` },
    body: formData,
  });
  return handleResponse(res);
}

export async function updateRestaurant(formData) {
  const res = await fetch(`${BASE}/update-restaurant`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${getToken()}` },
    body: formData,
  });
  return handleResponse(res);
}

export async function deleteRestaurant(id) {
  const res = await fetch(`${BASE}/delete-restaurant?id=${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return handleResponse(res);
}

// ── Menu Items

export async function fetchOwnerMenuItems() {
  const res = await fetch(`${BASE}/restaurant-menu-items`, {
    headers: { Authorization: `Bearer ${getToken()}` },
    cache: "no-store",
  });
  return handleResponse(res);
}

export async function fetchMenuItem(id) {
  const res = await fetch(`${BASE}/menu-item/${id}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
    cache: "no-store",
  });
  return handleResponse(res);
}

export async function createMenuItem(formData) {
  const res = await fetch(`${BASE}/create-menus`, {
    method: "POST",
    headers: { Authorization: `Bearer ${getToken()}` },
    body: formData,
  });
  return handleResponse(res);
}

export async function updateMenuItem({ id, formData }) {
  const res = await fetch(`${BASE}/menu-update/${id}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${getToken()}` },
    body: formData,
  });
  return handleResponse(res);
}

export async function deleteMenuItem(id) {
  const res = await fetch(`${BASE}/delete-menu/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return handleResponse(res);
}

// ── Orders

export async function createOrder(data) {
  const res = await fetch(`${BASE}/create-order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function fetchMyOrders() {
  const res = await fetch(`${BASE}/my-orders`, {
    headers: { Authorization: `Bearer ${getToken()}` },
    cache: "no-store",
  });
  return handleResponse(res);
}

export async function fetchUserOrders() {
  const res = await fetch(`${BASE}/user-orders`, {
    headers: { Authorization: `Bearer ${getToken()}` },
    cache: "no-store",
  });
  return handleResponse(res);
}

export async function updateOrderStatus({ id, status }) {
  const res = await fetch(`${BASE}/update-order-status/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ status }),
  });
  return handleResponse(res);
}

// ── Admin

export async function fetchAdminStats() {
  const res = await fetch(`${BASE}/admin/stats`, {
    headers: { Authorization: `Bearer ${getToken()}` },
    cache: "no-store",
  });
  return handleResponse(res);
}

export async function fetchAdminUsers() {
  const res = await fetch(`${BASE}/admin/users`, {
    headers: { Authorization: `Bearer ${getToken()}` },
    cache: "no-store",
  });
  return handleResponse(res);
}

export async function deleteUser(id) {
  const res = await fetch(`${BASE}/admin/users?id=${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return handleResponse(res);
}

export async function updateUserRole({ id, role }) {
  const res = await fetch(`${BASE}/admin/users`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ id, role }),
  });
  return handleResponse(res);
}

export async function fetchAdminOrders() {
  const res = await fetch(`${BASE}/admin/orders`, {
    headers: { Authorization: `Bearer ${getToken()}` },
    cache: "no-store",
  });
  return handleResponse(res);
}

export async function updateAdminOrderStatus({ id, status }) {
  const res = await fetch(`${BASE}/admin/orders`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ id, status }),
  });
  return handleResponse(res);
}

export async function fetchAdminRestaurants() {
  const res = await fetch(`${BASE}/admin/restaurants`, {
    headers: { Authorization: `Bearer ${getToken()}` },
    cache: "no-store",
  });
  return handleResponse(res);
}

export async function fetchAdminMenuItems() {
  const res = await fetch(`${BASE}/admin/menu-items`, {
    headers: { Authorization: `Bearer ${getToken()}` },
    cache: "no-store",
  });
  return handleResponse(res);
}

export async function updateMenuItemAvailability({ id, is_available }) {
  const res = await fetch(`${BASE}/admin/menu-items`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ id, is_available }),
  });
  return handleResponse(res);
}
