
const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

async function handleResponse(res) {
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message =
      data?.message ||
      data?.error ||
      "An error occurred.";

    throw new Error(message);
  }

  return data;
}

// ==========================================
// RESERVATIONS
// ==========================================

export async function createReservation(payload) {
  const res = await fetch(`${API_URL}/reservations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return handleResponse(res);
}

export async function getReservations() {
  const res = await fetch(`${API_URL}/reservations`);

  return handleResponse(res);
}

export async function getReservationById(id) {
  const res = await fetch(`${API_URL}/reservations/${id}`);

  return handleResponse(res);
}

export async function updateReservation(id, payload) {
  const res = await fetch(`${API_URL}/reservations/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return handleResponse(res);
}

export async function deleteReservation(id) {
  const res = await fetch(`${API_URL}/reservations/${id}`, {
    method: "DELETE",
  });

  return handleResponse(res);
}

export async function checkAvailability(date) {
  const res = await fetch(
    `${API_URL}/reservations/availability?date=${encodeURIComponent(date)}`
  );

  return handleResponse(res);
}

// ==========================================
// CONTACT
// ==========================================

export async function createContactMessage(payload) {
  const res = await fetch(`${API_URL}/contact`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return handleResponse(res);
}