import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { Plus, Search, SlidersHorizontal, MoreVertical, ArrowLeft } from "lucide-react";
import { api } from "../api/api";

// ── Add Payment Form ──────────────────────────────────────────
const AddPaymentForm = ({ onBack, onSaved }) => {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    fullName: "", totalAmount: "", mode: "",
    paymentDate: "", dueDate: "", remainingAmount: "",
  });

  const handleSave = async () => {
    if (!form.fullName.trim()) {
      alert("Please enter customer name.");
      return;
    }
    if (!form.totalAmount) {
      alert("Please enter total amount.");
      return;
    }
    setSaving(true);
    try {
      await api.addPayment({
        fullName:        form.fullName,
        totalAmount:     parseFloat(form.totalAmount)     || 0,
        remainingAmount: parseFloat(form.remainingAmount) || 0,
        modeOfPayment:   form.mode,
        paymentDate:     form.paymentDate || null,
        dueDate:         form.dueDate     || null,
      });
      alert("Payment saved successfully!");
      onSaved();
    } catch (err) {
      alert("Failed to save. Make sure Spring Boot is running on port 8081.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-1"
      >
        <ArrowLeft size={20} />
        <span className="text-2xl font-bold text-gray-800">Add Payment</span>
      </button>
      <p className="text-sm text-gray-400 mb-7 ml-8">Here is the summary of overall data</p>

      <div className="bg-white rounded-xl p-8 shadow-sm" style={{ maxWidth: "700px" }}>

        {/* Full Name */}
        <div className="mb-6">
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
            👤 Full Name
          </label>
          <input
            placeholder="Enter Customer Name"
            value={form.fullName}
            onChange={e => setForm({ ...form, fullName: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Total Amount + Mode */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="text-sm font-bold text-gray-700 mb-2 block">Total Amount (₹)</label>
            <input
              placeholder="Enter Total Amount"
              type="number"
              value={form.totalAmount}
              onChange={e => setForm({ ...form, totalAmount: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <div>
            <label className="text-sm font-bold text-gray-700 mb-2 block">🖥 Mode of Payment</label>
            <select
              value={form.mode}
              onChange={e => setForm({ ...form, mode: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-100"
            >
              <option value="">Select Mode</option>
              <option>Online</option>
              <option>Cash</option>
              <option>Card</option>
            </select>
          </div>
        </div>

        {/* Payment Date + Due Date */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="text-sm font-bold text-gray-700 mb-2 block">📅 Payment Date</label>
            <input
              type="date"
              value={form.paymentDate}
              onChange={e => setForm({ ...form, paymentDate: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <div>
            <label className="text-sm font-bold text-gray-700 mb-2 block">📅 Due Date</label>
            <input
              type="date"
              value={form.dueDate}
              onChange={e => setForm({ ...form, dueDate: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* Remaining Amount */}
        <div className="mb-9">
          <label className="text-sm font-bold text-gray-700 mb-2 block">⏳ Remaining Amount (₹)</label>
          <input
            placeholder="Enter Remaining Amount"
            type="number"
            value={form.remainingAmount}
            onChange={e => setForm({ ...form, remainingAmount: e.target.value })}
            className="w-64 border border-gray-200 rounded-lg px-4 py-3 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            onClick={onBack}
            className="px-7 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-7 py-2.5 bg-blue-700 text-white rounded-lg text-sm hover:bg-blue-800 font-semibold disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Payment"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Payment Table ─────────────────────────────────────────────
const PaymentTable = ({ onAdd }) => {
  const [tab, setTab]           = useState("Payment List");
  const [search, setSearch]     = useState("");
  const [payments, setPayments] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  const fetchPayments = () => {
    setLoading(true);
    setError(null);
    api.getPayments()
      .then(data => {
        setPayments(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setError("Cannot connect to backend. Make sure Spring Boot is running on port 8081.");
        setLoading(false);
      });
  };

  useEffect(() => { fetchPayments(); }, []);

  const tabs = ["Payment List", "Incomplete Payments"];

  const filtered = payments.filter(p => {
    const matchSearch = (p.fullName || "").toLowerCase().includes(search.toLowerCase());
    if (tab === "Incomplete Payments") return matchSearch && p.status === "Pending";
    return matchSearch;
  });

  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit", month: "short", year: "numeric"
    });
  };

  return (
    <div className="px-8 py-6">

      <h2 className="text-2xl font-bold text-gray-800 mb-5">Payment</h2>

      {/* Tabs */}
      <div className="flex gap-8 border-b border-gray-200 mb-6">
        {tabs.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-3 text-sm font-semibold transition-colors ${
              tab === t
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Actions row */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={onAdd}
          className="flex items-center gap-2 border-2 border-blue-600 text-blue-700 bg-white px-5 py-2.5 rounded-lg text-sm hover:bg-blue-50 font-bold"
        >
          <div className="w-5 h-5 rounded-full border-2 border-blue-600 flex items-center justify-center">
            <Plus size={12} strokeWidth={3} />
          </div>
          Add Payment
        </button>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              placeholder="Search Customers"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 pr-5 py-2.5 text-sm border border-gray-200 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <button className="p-2.5 border border-gray-200 rounded-lg hover:bg-gray-50">
            <SlidersHorizontal size={18} className="text-gray-500" />
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
          ⚠️ {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl overflow-hidden border border-gray-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-gray-200">
              <th className="px-5 py-4 text-sm font-bold text-gray-700">Customer Name</th>
              <th className="px-5 py-4 text-sm font-bold text-gray-700">Amount (₹)</th>
              <th className="px-5 py-4 text-sm font-bold text-gray-700">Mode of Payment</th>
              <th className="px-5 py-4 text-sm font-bold text-gray-700">Payment Date</th>
              <th className="px-5 py-4 text-sm font-bold text-gray-700">Remaining Amount</th>
              <th className="px-5 py-4 text-sm font-bold text-gray-700">Due Date</th>
              <th className="px-5 py-4 text-sm font-bold text-gray-700">Status</th>
              <th className="px-5 py-4 text-sm font-bold text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i} className="border-t border-gray-100">
                  {Array.from({ length: 8 }).map((_, j) => (
                    <td key={j} className="px-5 py-4">
                      <div className="h-4 bg-gray-100 rounded animate-pulse w-20" />
                    </td>
                  ))}
                </tr>
              ))
            ) : filtered.length > 0 ? (
              filtered.map((p, i) => (
                <tr key={p.id || i} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm flex-shrink-0">
                        {(p.fullName || "?")[0].toUpperCase()}
                      </div>
                      <span className="font-semibold text-gray-800 text-sm">{p.fullName}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm font-semibold text-gray-800">
                    ₹{p.totalAmount?.toLocaleString() || "0"}
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">{p.modeOfPayment || "—"}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">{formatDate(p.paymentDate)}</td>
                  <td className="px-5 py-4 text-sm">
                    {p.status === "Completed" ? (
                      <span className="text-teal-500 font-semibold">-------</span>
                    ) : (
                      <span className="text-red-500 font-semibold">
                        ₹{p.remainingAmount?.toLocaleString() || "0"}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">{formatDate(p.dueDate)}</td>
                  <td className="px-5 py-4">
                    <span className={`px-3 py-1 text-xs rounded font-medium ${
                      p.status === "Completed"
                        ? "bg-green-100 text-green-600"
                        : "bg-orange-100 text-orange-500"
                    }`}>
                      {p.status || "Pending"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete payment for ${p.fullName}?`)) {
                          api.deletePayment(p.id)
                            .then(fetchPayments)
                            .catch(() => alert("Failed to delete."));
                        }
                      }}
                      className="text-gray-400 hover:text-red-500 p-1 rounded hover:bg-gray-100"
                    >
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-5 py-16 text-center text-gray-300 text-base font-medium">
                  {search ? "No payments match your search" : "No payment records found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ── Main Export ───────────────────────────────────────────────
const Payment = () => {
  const [view, setView] = useState("list");

  return (
    <Layout>
      {view === "add"
        ? <AddPaymentForm onBack={() => setView("list")} onSaved={() => setView("list")} />
        : <PaymentTable onAdd={() => setView("add")} />
      }
    </Layout>
  );
};

export default Payment;