import axios from 'axios';

const API_BASE = 'http://localhost:4000/api';

export function setAuthHeaders(user) {
  if (user) {
    axios.defaults.headers.common['x-user-id'] = String(user.id);
    axios.defaults.headers.common['x-user-role'] = user.role;
  } else {
    delete axios.defaults.headers.common['x-user-id'];
    delete axios.defaults.headers.common['x-user-role'];
  }
}

export async function login(email, password) {
  const { data } = await axios.post(`${API_BASE}/auth/login`, { email, password });
  return data.user;
}

export async function registerUser(payload) {
  const { data } = await axios.post(`${API_BASE}/auth/register`, payload);
  return data.user;
}

export async function fetchTickets() {
  const { data } = await axios.get(`${API_BASE}/tickets`);
  return data.tickets;
}

export async function createTicket(payload) {
  const { data } = await axios.post(`${API_BASE}/tickets`, payload);
  return data.ticket;
}

export async function updateTicket(id, payload) {
  const { data } = await axios.put(`${API_BASE}/tickets/${id}`, payload);
  return data.ticket;
}

export async function listResolvers() {
  const { data } = await axios.get(`${API_BASE}/users/resolvers`);
  return data.resolvers;
}
