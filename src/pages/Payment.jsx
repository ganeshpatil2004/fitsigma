import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { Plus, Search, SlidersHorizontal, MoreVertical, ArrowLeft } from "lucide-react";

// ── Add Payment Form ──────────────────────────────────────────
const AddPaymentForm = ({ onBack }) => {
  const [form, setForm] = useState({
    fullName: "", totalAmount: "", mode: "",
    paymentDate: "", dueDate: "", remainingAmount: "",
  });

  const handleSave = () => {
    // TODO: POST form data to backend API
    // fetch("/api/payments", { method: "POST", body: JSON.stringify(form) })
    onBack();
  };

  return (
    <div>
      {/* Header */}
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-gray-500 hover:text-gray-800 mb-1 text-sm"
      >
        <ArrowLeft size={16} />
        <span className="text-lg font-semibold text-gray-800 ml-1">Add Payment</span>
      </button>
      <p className="text-xs text-gray-400 mb-6 ml-6">Here is the summary of overall data</p>

      <div className="bg-white rounded-xl p-6 shadow-sm max-w-2xl">

        {/* Full Name */}
        <div className="mb-5">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
            👤 Full Name
          </label>
          <input
            placeholder="Enter Your Name"
            value={form.fullName}
            onChange={e => setForm({ ...form, fullName: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Total Amount + Mode of Payment */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Total Amount</label>
            <input
              placeholder="Enter The Total Amount"
              value={form.totalAmount}
              onChange={e => setForm({ ...form, totalAmount: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
              🖥 Mode of Payment
            </label>
            <select
              value={form.mode}
              onChange={e => setForm({ ...form, mode: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-100"
            >
              <option value="">Select Mode</option>
              <option>Online</option>
              <option>Cash</option>
              <option>Card</option>
            </select>
          </div>
        </div>

        {/* Payment Date + Due Date */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
              📅 Payment Date
            </label>
            <input
              type="date"
              value={form.paymentDate}
              onChange={e => setForm({ ...form, paymentDate: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
              📅 Due Date
            </label>
            <input
              type="date"
              value={form.dueDate}
              onChange={e => setForm({ ...form, dueDate: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* Remaining Amount */}
        <div className="mb-8">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
            ⏳ Remaining Amount
          </label>
          <input
            placeholder="Enter the Amount"
            value={form.remainingAmount}
            onChange={e => setForm({ ...form, remainingAmount: e.target.value })}
            className="w-48 border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="px-6 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-700 text-white rounded-lg text-sm hover:bg-blue-800"
          >
            Save Payment
          </button>
        </div>

      </div>
    </div>
  );
};

// ── Payment Table ─────────────────────────────────────────────
const PaymentTable = ({ onAdd }) => {
  const [tab, setTab]         = useState("Payment List");
  const [search, setSearch]   = useState("");
  const [payments, setPayments] = useState([]);

  // ── TODO: Uncomment & connect your backend API ────────────
  // useEffect(() => {
  //   fetch("/api/payments").then(r => r.json()).then(setPayments);
  // }, []);

  const tabs = ["Payment List", "Incomplete Payments"];

  const filtered = payments.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    if (tab === "Incomplete Payments") return matchSearch && p.dueDate !== "Completed";
    return matchSearch;
  });

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Payment</h2>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-gray-200 mb-5">
        {tabs.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-2 text-sm font-medium transition-colors ${
              tab === t
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center mb-5">
        <button
          onClick={onAdd}
          className="flex items-center gap-2 bg-blue-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-800"
        >
          <Plus size={15} /> Add Payment
        </button>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              placeholder="Search Customers"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-8 pr-4 py-2 text-sm border border-gray-200 rounded-lg w-52 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
            <SlidersHorizontal size={16} className="text-gray-500" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 text-xs border-b border-gray-100">
              <th className="px-4 py-3 font-medium">Customer Name</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Mode of Payment</th>
              <th className="px-4 py-3 font-medium">Payment Date</th>
              <th className="px-4 py-3 font-medium">Remaining Amount</th>
              <th className="px-4 py-3 font-medium">Due Date</th>
              <th className="px-4 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((p, i) => (
                <tr key={i} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <img src={p.avatar} alt={p.name} className="w-7 h-7 rounded-full object-cover" />
                      <span className="font-medium text-gray-800">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{p.amount}</td>
                  <td className="px-4 py-3 text-gray-600">{p.mode}</td>
                  <td className="px-4 py-3 text-gray-600">{p.paymentDate}</td>
                  <td className="px-4 py-3 font-medium text-red-500">{p.remaining}</td>
                  <td className="px-4 py-3 text-gray-600">{p.dueDate}</td>
                  <td className="px-4 py-3">
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-gray-300 text-sm">
                  No payment records found
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
  const [view, setView] = useState("list"); // "list" | "add"

  return (
    <Layout>
      {view === "add"
        ? <AddPaymentForm onBack={() => setView("list")} />
        : <PaymentTable onAdd={() => setView("add")} />
      }
    </Layout>
  );
};

export default Payment;