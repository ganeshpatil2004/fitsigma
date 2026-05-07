import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { Plus, Search, SlidersHorizontal, MoreVertical, ArrowLeft, Upload, User } from "lucide-react";
import { api } from "../api/api";

// ── Status Badge ─────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const styles = {
    Active:  "bg-green-100 text-green-600",
    Expired: "bg-red-100 text-red-500",
    Pending: "bg-yellow-100 text-yellow-600",
  };
  return (
    <span className={`px-3 py-1 text-sm rounded ${styles[status] || "bg-gray-100 text-gray-500"}`}>
      {status}
    </span>
  );
};

// ── Payment Badge ─────────────────────────────────────────────
const PaymentBadge = ({ payment }) => {
  const styles = {
    Paid:    "border border-green-400 text-green-600 bg-green-50",
    Pending: "border border-orange-400 text-orange-500 bg-orange-50",
  };
  return (
    <span className={`px-4 py-1 text-sm rounded font-medium ${styles[payment] || ""}`}>
      {payment}
    </span>
  );
};

// ── Add Customer Form ─────────────────────────────────────────
const AddCustomerForm = ({ onBack, onSaved }) => {
  const [photo, setPhoto]   = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm]     = useState({
    fullName: "", email: "", address: "",
    joiningDate: "", membershipPlan: "", gender: "",
    mobile: "", dob: "", acquisitionSource: "",
  });

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (file) setPhoto(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!form.fullName.trim()) {
      alert("Please enter customer full name.");
      return;
    }
    setSaving(true);
    try {
      await api.addCustomer({
        fullName:          form.fullName,
        email:             form.email,
        address:           form.address,
        mobile:            form.mobile,
        gender:            form.gender,
        membershipPlan:    form.membershipPlan,
        membershipStatus:  "Active",
        paymentStatus:     "Pending",
        acquisitionSource: form.acquisitionSource,
        joiningDate:       form.joiningDate || null,
        dateOfBirth:       form.dob         || null,
      });
      alert("Customer saved successfully!");
      onSaved();
    } catch (err) {
      alert("Failed to save. Make sure Spring Boot is running on port 8081.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-5 text-base">
        <ArrowLeft size={20} /> Add Customer
      </button>

      <div className="bg-white rounded-xl p-8 shadow-sm">
        <div className="grid grid-cols-2 gap-10">

          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-6">

            <div>
              <label className="flex items-center gap-2 text-base font-medium text-gray-700 mb-2">
                <User size={16} /> Full Name
              </label>
              <input
                placeholder="Enter Your Name"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
                value={form.fullName}
                onChange={e => setForm({ ...form, fullName: e.target.value })}
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-base font-medium text-gray-700 mb-2">
                <span>✉</span> Email Address
              </label>
              <input
                placeholder="Enter Your Email"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-base font-medium text-gray-700 mb-2">
                <span>📍</span> Address
              </label>
              <input
                placeholder="Enter Your Address"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
                value={form.address}
                onChange={e => setForm({ ...form, address: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">📅 Joining Date</label>
                <input
                  type="date"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none"
                  value={form.joiningDate}
                  onChange={e => setForm({ ...form, joiningDate: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">📋 Membership Plan</label>
                <select
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none bg-white"
                  value={form.membershipPlan}
                  onChange={e => setForm({ ...form, membershipPlan: e.target.value })}
                >
                  <option value="">Select Plan</option>
                  <option>Basic</option>
                  <option>Gold</option>
                  <option>Premium</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">💡 Gender</label>
                <select
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none bg-white"
                  value={form.gender}
                  onChange={e => setForm({ ...form, gender: e.target.value })}
                >
                  <option value="">Select Gender</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">📞 Mobile Number</label>
                <div className="flex border border-gray-200 rounded-lg overflow-hidden text-sm">
                  <span className="bg-gray-50 px-3 py-2.5 text-gray-500 border-r border-gray-200">+91</span>
                  <input
                    placeholder="Enter Mobile No"
                    className="flex-1 px-3 py-2.5 focus:outline-none"
                    value={form.mobile}
                    onChange={e => setForm({ ...form, mobile: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">📅 Date of Birth</label>
                <input
                  type="date"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none"
                  value={form.dob}
                  onChange={e => setForm({ ...form, dob: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">📅 Acquisition Source</label>
                <select
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none bg-white"
                  value={form.acquisitionSource}
                  onChange={e => setForm({ ...form, acquisitionSource: e.target.value })}
                >
                  <option value="">Select Source</option>
                  <option>Social Media</option>
                  <option>Referral</option>
                  <option>Walk-in</option>
                </select>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN — Profile Photo */}
          <div className="flex flex-col items-center gap-4 pt-6">
            <label className="flex items-center gap-2 text-base font-medium text-gray-700 self-start">
              <User size={16} /> Profile Photo
            </label>
            <div className="w-44 h-44 rounded-xl border-2 border-gray-200 flex items-center justify-center overflow-hidden bg-gray-50">
              {photo
                ? <img src={photo} alt="preview" className="w-full h-full object-cover" />
                : <User size={64} className="text-gray-300" />
              }
            </div>
            <label className="cursor-pointer border border-gray-300 rounded-lg px-5 py-2.5 text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2">
              <Upload size={16} /> Upload Photo
              <input type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
            </label>
          </div>

        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-10">
          <button
            onClick={onBack}
            className="px-7 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-7 py-2.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Customer"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Customer List ─────────────────────────────────────────────
const CustomerList = ({ onAdd }) => {
  const [tab, setTab]             = useState("All Customers");
  const [search, setSearch]       = useState("");
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  const fetchCustomers = () => {
    setLoading(true);
    setError(null);
    api.getCustomers()
      .then(data => {
        setCustomers(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setError("Cannot connect to backend. Make sure Spring Boot is running on port 8081.");
        setLoading(false);
      });
  };

  useEffect(() => { fetchCustomers(); }, []);

  const tabs = ["All Customers", "Paid Customers", "Pending Customers"];

  const filtered = customers.filter(c => {
    const name = (c.fullName || "").toLowerCase();
    const matchSearch = name.includes(search.toLowerCase());
    if (tab === "Paid Customers")    return matchSearch && c.paymentStatus === "Paid";
    if (tab === "Pending Customers") return matchSearch && c.paymentStatus === "Pending";
    return matchSearch;
  });

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-5">Customers</h2>

      {/* Tabs */}
      <div className="flex gap-8 border-b border-gray-200 mb-6">
        {tabs.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-2.5 text-base font-medium transition-colors ${
              tab === t
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Actions Row */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={onAdd}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm hover:bg-blue-700"
        >
          <Plus size={17} /> Add Customer
        </button>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              placeholder="Search Customers"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 pr-5 py-2.5 text-sm border border-gray-200 rounded-lg w-60 focus:outline-none focus:ring-2 focus:ring-blue-100"
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
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 text-sm border-b border-gray-100">
              <th className="px-5 py-4 font-medium">Customer Name</th>
              <th className="px-5 py-4 font-medium">Customer ID</th>
              <th className="px-5 py-4 font-medium">Mobile No</th>
              <th className="px-5 py-4 font-medium">Joined-Date</th>
              <th className="px-5 py-4 font-medium">Membership Plan</th>
              <th className="px-5 py-4 font-medium">Membership Status</th>
              <th className="px-5 py-4 font-medium">Payment</th>
              <th className="px-5 py-4"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i} className="border-t border-gray-50">
                  {Array.from({ length: 8 }).map((_, j) => (
                    <td key={j} className="px-5 py-4">
                      <div className="h-4 bg-gray-100 rounded animate-pulse w-24" />
                    </td>
                  ))}
                </tr>
              ))
            ) : filtered.length > 0 ? (
              filtered.map((c, i) => (
                <tr key={c.id || i} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm flex-shrink-0">
                        {(c.fullName || "?")[0].toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-800">{c.fullName}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-500">{c.customerId || "—"}</td>
                  <td className="px-5 py-4 text-gray-600">{c.mobile || "—"}</td>
                  <td className="px-5 py-4 text-gray-600">
                    {c.joiningDate
                      ? new Date(c.joiningDate).toLocaleDateString("en-IN", {
                          day: "2-digit", month: "short", year: "numeric"
                        })
                      : "—"}
                  </td>
                  <td className="px-5 py-4 text-gray-600">{c.membershipPlan || "—"}</td>
                  <td className="px-5 py-4">
                    <StatusBadge status={c.membershipStatus || "Pending"} />
                  </td>
                  <td className="px-5 py-4">
                    <PaymentBadge payment={c.paymentStatus || "Pending"} />
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete ${c.fullName}?`)) {
                          api.deleteCustomer(c.id)
                            .then(fetchCustomers)
                            .catch(() => alert("Failed to delete customer."));
                        }
                      }}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-5 py-14 text-center text-gray-300 text-base">
                  {search ? "No customers match your search" : "No customers found"}
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
const Customer = () => {
  const [showForm, setShowForm] = useState(false);
  const [, setRefresh]          = useState(0);

  const handleSaved = () => {
    setShowForm(false);
    setRefresh(r => r + 1);
  };

  return (
    <Layout>
      {showForm
        ? <AddCustomerForm onBack={() => setShowForm(false)} onSaved={handleSaved} />
        : <CustomerList onAdd={() => setShowForm(true)} />
      }
    </Layout>
  );
};

export default Customer;