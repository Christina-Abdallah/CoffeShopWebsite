const ADMIN_API_URL =
  import.meta.env.VITE_ADMIN_API_URL || "http://localhost:3000/api/admin";

async function handleResponse(res) {
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.message || "Request failed");
  }
  return data;
}

async function fetchCsrfToken() {
  const res = await fetch(`${ADMIN_API_URL}/csrf-token`, {
    credentials: "include",
  });
  const data = await handleResponse(res);
  return data.csrfToken;
}

const fetchOptions = {
  credentials: "include",
  headers: { "Content-Type": "application/json" },
};

// Auth
export async function adminLogin(email, password) {
  const csrfToken = await fetchCsrfToken();
  const res = await fetch(`${ADMIN_API_URL}/auth/login`, {
    ...fetchOptions,
    method: "POST",
    headers: { ...fetchOptions.headers, "X-CSRF-Token": csrfToken },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(res);
}

export async function adminLogout() {
  const csrfToken = await fetchCsrfToken();
  const res = await fetch(`${ADMIN_API_URL}/auth/logout`, {
    ...fetchOptions,
    method: "POST",
    headers: { ...fetchOptions.headers, "X-CSRF-Token": csrfToken },
  });
  return handleResponse(res);
}

export async function adminMe() {
  const res = await fetch(`${ADMIN_API_URL}/auth/me`, fetchOptions);
  return handleResponse(res);
}

// Dashboard
export async function getDashboard() {
  const csrfToken = await fetchCsrfToken();
  const res = await fetch(`${ADMIN_API_URL}/dashboard`, {
    ...fetchOptions,
    headers: { ...fetchOptions.headers, "X-CSRF-Token": csrfToken },
  });
  return handleResponse(res);
}

// Menu
export async function getMenuItems() {
  const csrfToken = await fetchCsrfToken();
  const res = await fetch(`${ADMIN_API_URL}/menu`, {
    ...fetchOptions,
    headers: { ...fetchOptions.headers, "X-CSRF-Token": csrfToken },
  });
  return handleResponse(res);
}

export async function createMenuItem(item) {
  const csrfToken = await fetchCsrfToken();
  const res = await fetch(`${ADMIN_API_URL}/menu`, {
    ...fetchOptions,
    method: "POST",
    headers: { ...fetchOptions.headers, "X-CSRF-Token": csrfToken },
    body: JSON.stringify(item),
  });
  return handleResponse(res);
}

export async function updateMenuItem(id, item) {
  const csrfToken = await fetchCsrfToken();
  const res = await fetch(`${ADMIN_API_URL}/menu/${id}`, {
    ...fetchOptions,
    method: "PATCH",
    headers: { ...fetchOptions.headers, "X-CSRF-Token": csrfToken },
    body: JSON.stringify(item),
  });
  return handleResponse(res);
}

export async function deleteMenuItem(id) {
  const csrfToken = await fetchCsrfToken();
  const res = await fetch(`${ADMIN_API_URL}/menu/${id}`, {
    ...fetchOptions,
    method: "DELETE",
    headers: { ...fetchOptions.headers, "X-CSRF-Token": csrfToken },
  });
  return handleResponse(res);
}

// Staff
export async function getStaff() {
  const csrfToken = await fetchCsrfToken();
  const res = await fetch(`${ADMIN_API_URL}/staff`, {
    ...fetchOptions,
    headers: { ...fetchOptions.headers, "X-CSRF-Token": csrfToken },
  });
  return handleResponse(res);
}

export async function createStaff(member) {
  const csrfToken = await fetchCsrfToken();
  const res = await fetch(`${ADMIN_API_URL}/staff`, {
    ...fetchOptions,
    method: "POST",
    headers: { ...fetchOptions.headers, "X-CSRF-Token": csrfToken },
    body: JSON.stringify(member),
  });
  return handleResponse(res);
}

export async function updateStaff(id, member) {
  const csrfToken = await fetchCsrfToken();
  const res = await fetch(`${ADMIN_API_URL}/staff/${id}`, {
    ...fetchOptions,
    method: "PATCH",
    headers: { ...fetchOptions.headers, "X-CSRF-Token": csrfToken },
    body: JSON.stringify(member),
  });
  return handleResponse(res);
}

export async function deleteStaff(id) {
  const csrfToken = await fetchCsrfToken();
  const res = await fetch(`${ADMIN_API_URL}/staff/${id}`, {
    ...fetchOptions,
    method: "DELETE",
    headers: { ...fetchOptions.headers, "X-CSRF-Token": csrfToken },
  });
  return handleResponse(res);
}

// Reservations (public API reused)
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export async function getAdminReservations() {
  const res = await fetch(`${API_URL}/reservations`, {
    credentials: "include",
  });
  return handleResponse(res);
}

export async function updateReservation(id, payload) {
  const res = await fetch(`${API_URL}/reservations/${id}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

// Messages
export async function getMessages() {
  const csrfToken = await fetchCsrfToken();
  const res = await fetch(`${ADMIN_API_URL}/messages`, {
    ...fetchOptions,
    headers: { ...fetchOptions.headers, "X-CSRF-Token": csrfToken },
  });
  return handleResponse(res);
}

export async function updateMessageStatus(id, status) {
  const csrfToken = await fetchCsrfToken();
  const res = await fetch(`${ADMIN_API_URL}/messages/${id}/status`, {
    ...fetchOptions,
    method: "PATCH",
    headers: { ...fetchOptions.headers, "X-CSRF-Token": csrfToken },
    body: JSON.stringify({ status }),
  });
  return handleResponse(res);
}
