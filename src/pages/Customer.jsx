import React, { useState } from "react";
import Layout from "../components/Layout";
import { Plus, Search, SlidersHorizontal, MoreVertical, ArrowLeft, Upload, User } from "lucide-react";

// ── Status Badge ─────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const styles = {
    Active:  "bg-green-100 text-green-600",
    Expired: "bg-red-100 text-red-500",
    Pending: "bg-yellow-100 text-yellow-600",
  };
  return (
    <span className={`px-2 py-0.5 text-xs rounded ${styles[status] || "bg-gray-100 text-gray-500"}`}>
      {status}
    </span>
  );
};

// ── Payment Badge ─────────────────────────────────────────────
const PaymentBadge = ({ payment }) => {
  const styles = {
    Paid:    "border border-green-400 text-green-600",
    Pending: "border border-orange-400 text-orange-500",
  };
  return (
    <span className={`px-3 py-0.5 text-xs rounded ${styles[payment] || ""}`}>
      {payment}
    </span>
  );
};

// ── Add Customer Form ─────────────────────────────────────────
const AddCustomerForm = ({ onBack, onSave }) => {
  const [photo, setPhoto] = useState(null);
  const [form, setForm] = useState({
    fullName: "", email: "", address: "",
    joiningDate: "", membershipPlan: "", gender: "",
    mobile: "", dob: "", acquisitionSource: "",
  });

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (file) setPhoto(URL.createObjectURL(file));
  };

  const handleSave = () => {
    // TODO: POST form data to backend API
    // fetch("/api/customers", { method: "POST", body: JSON.stringify(form) })
    onBack();
  };

  return (
    <div>
      {/* Back */}
      <button onClick={onBack} className="flex items-center gap-1 text-gray-500 hover:text-gray-800 mb-4 text-sm">
        <ArrowLeft size={16} /> Add Customer
      </button>

      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="grid grid-cols-2 gap-8">

          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-5">

            {/* Full Name */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <User size={14} /> Full Name
              </label>
              <input
                placeholder="Enter Your Name"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
                value={form.fullName}
                onChange={e => setForm({ ...form, fullName: e.target.value })}
              />
            </div>

            {/* Email */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <span>✉</span> Email Address
              </label>
              <input
                placeholder="Enter Your Email"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
              />
            </div>

            {/* Address */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <span>📍</span> Address
              </label>
              <input
                placeholder="Enter Your Address"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
                value={form.address}
                onChange={e => setForm({ ...form, address: e.target.value })}
              />
            </div>

            {/* Row: Joining Date + Membership Plan + Gender */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">📅 Joining Date</label>
                <input
                  type="date"
                  className="w-full border border-gray-200 rounded-lg px-2 py-2 text-xs focus:outline-none"
                  value={form.joiningDate}
                  onChange={e => setForm({ ...form, joiningDate: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">📋 Membership Plan</label>
                <select
                  className="w-full border border-gray-200 rounded-lg px-2 py-2 text-xs focus:outline-none bg-white"
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
                <label className="text-xs font-medium text-gray-700 mb-1 block">💡 Gender</label>
                <select
                  className="w-full border border-gray-200 rounded-lg px-2 py-2 text-xs focus:outline-none bg-white"
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

            {/* Row: Mobile + DOB + Acquisition */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">📞 Mobile Number</label>
                <div className="flex border border-gray-200 rounded-lg overflow-hidden text-xs">
                  <span className="bg-gray-50 px-2 py-2 text-gray-500 border-r border-gray-200">+91</span>
                  <input
                    placeholder="Enter Mobile No"
                    className="flex-1 px-2 py-2 focus:outline-none"
                    value={form.mobile}
                    onChange={e => setForm({ ...form, mobile: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">📅 Date of Birth</label>
                <input
                  type="date"
                  className="w-full border border-gray-200 rounded-lg px-2 py-2 text-xs focus:outline-none"
                  value={form.dob}
                  onChange={e => setForm({ ...form, dob: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">📅 Acquisition Source</label>
                <select
                  className="w-full border border-gray-200 rounded-lg px-2 py-2 text-xs focus:outline-none bg-white"
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
          <div className="flex flex-col items-center gap-3 pt-6">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 self-start">
              <User size={14} /> Profile Photo
            </label>
            <div className="w-36 h-36 rounded-xl border-2 border-gray-200 flex items-center justify-center overflow-hidden bg-gray-50">
              {photo
                ? <img src={photo} alt="preview" className="w-full h-full object-cover" />
                : <User size={52} className="text-gray-300" />
              }
            </div>
            <label className="cursor-pointer border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2">
              <Upload size={14} /> Upload Photo
              <input type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
            </label>
          </div>

        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-8">
          <button onClick={onBack} className="px-6 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
            Cancel
          </button>
          <button onClick={handleSave} className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
            Save Customer
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Customer List ─────────────────────────────────────────────
const CustomerList = ({ onAdd }) => {
  const [tab, setTab]       = useState("All Customers");
  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState([]);

  // ── TODO: Uncomment & connect your backend API ────────────
  // useEffect(() => {
  //   fetch("/api/customers").then(r => r.json()).then(setCustomers);
  // }, []);

  const tabs = ["All Customers", "Paid Customers", "Pending Customers"];

  const filtered = customers.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    if (tab === "Paid Customers")    return matchSearch && c.payment === "Paid";
    if (tab === "Pending Customers") return matchSearch && c.payment === "Pending";
    return matchSearch;
  });

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Customers</h2>

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

      {/* Actions Row */}
      <div className="flex justify-between items-center mb-5">
        <button
          onClick={onAdd}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
        >
          <Plus size={15} /> Add Customer
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
              <th className="px-4 py-3 font-medium">Customer ID</th>
              <th className="px-4 py-3 font-medium">Mobile No</th>
              <th className="px-4 py-3 font-medium">Joined-Date</th>
              <th className="px-4 py-3 font-medium">Membership Plan</th>
              <th className="px-4 py-3 font-medium">Membership Status</th>
              <th className="px-4 py-3 font-medium">Payment</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((c, i) => (
                <tr key={i} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <img src={c.avatar} alt={c.name} className="w-7 h-7 rounded-full object-cover" />
                      <span className="font-medium text-gray-800">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{c.id}</td>
                  <td className="px-4 py-3 text-gray-600">{c.mobile}</td>
                  <td className="px-4 py-3 text-gray-600">{c.joined}</td>
                  <td className="px-4 py-3 text-gray-600">{c.plan}</td>
                  <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                  <td className="px-4 py-3"><PaymentBadge payment={c.payment} /></td>
                  <td className="px-4 py-3">
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-gray-300 text-sm">
                  No customers found
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

  return (
    <Layout>
      {showForm
        ? <AddCustomerForm onBack={() => setShowForm(false)} />
        : <CustomerList onAdd={() => setShowForm(true)} />
      }
    </Layout>
  );
};

export default Customer;