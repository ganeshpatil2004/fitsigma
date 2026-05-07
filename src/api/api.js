const BASE_URL = "http://localhost:8081/api";

export const api = {

  // ── Customers ──────────────────────────────────────────────
  getCustomers: () =>
    fetch(`${BASE_URL}/customers`).then(r => r.json()),

  addCustomer: (data) =>
    fetch(`${BASE_URL}/customers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }).then(r => r.json()),

  updateCustomer: (id, data) =>
    fetch(`${BASE_URL}/customers/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }).then(r => r.json()),

  deleteCustomer: (id) =>
    fetch(`${BASE_URL}/customers/${id}`, { method: "DELETE" }),

  searchCustomers: (name) =>
    fetch(`${BASE_URL}/customers/search?name=${name}`).then(r => r.json()),

  // ── Trainers ───────────────────────────────────────────────
  getTrainers: () =>
    fetch(`${BASE_URL}/trainers`).then(r => r.json()),

  addTrainer: (data) =>
    fetch(`${BASE_URL}/trainers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }).then(r => r.json()),

  updateTrainer: (id, data) =>
    fetch(`${BASE_URL}/trainers/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }).then(r => r.json()),

  deleteTrainer: (id) =>
    fetch(`${BASE_URL}/trainers/${id}`, { method: "DELETE" }),

  searchTrainers: (name) =>
    fetch(`${BASE_URL}/trainers/search?name=${name}`).then(r => r.json()),

  // ── Payments ───────────────────────────────────────────────
  getPayments: () =>
    fetch(`${BASE_URL}/payments`).then(r => r.json()),

  addPayment: (data) =>
    fetch(`${BASE_URL}/payments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }).then(r => r.json()),

  deletePayment: (id) =>
    fetch(`${BASE_URL}/payments/${id}`, { method: "DELETE" }),

  getIncompletePayments: () =>
    fetch(`${BASE_URL}/payments/incomplete`).then(r => r.json()),

  // ── Attendance ─────────────────────────────────────────────
  getAttendance: () =>
    fetch(`${BASE_URL}/attendance`).then(r => r.json()),

  getCustomerAttendance: () =>
    fetch(`${BASE_URL}/attendance/customers`).then(r => r.json()),

  getTrainerAttendance: () =>
    fetch(`${BASE_URL}/attendance/trainers`).then(r => r.json()),

  markAttendance: (data) =>
    fetch(`${BASE_URL}/attendance`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }).then(r => r.json()),

  deleteAttendance: (id) =>
    fetch(`${BASE_URL}/attendance/${id}`, { method: "DELETE" }),

  // ── Enquiries ──────────────────────────────────────────────
  getEnquiries: () =>
    fetch(`${BASE_URL}/enquiries`).then(r => r.json()),

  addEnquiry: (data) =>
    fetch(`${BASE_URL}/enquiries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }).then(r => r.json()),

  deleteEnquiry: (id) =>
    fetch(`${BASE_URL}/enquiries/${id}`, { method: "DELETE" }),

  searchEnquiries: (name) =>
    fetch(`${BASE_URL}/enquiries/search?name=${name}`).then(r => r.json()),

  // ── Reports ────────────────────────────────────────────────
  getReportSummary: () =>
    fetch(`${BASE_URL}/reports/summary`).then(r => r.json()),

  // ── History ────────────────────────────────────────────────
  getHistory: (query) =>
    fetch(`${BASE_URL}/history?query=${encodeURIComponent(query)}`).then(r => r.json()),
};