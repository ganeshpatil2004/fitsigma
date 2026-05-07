import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { Plus, Search, SlidersHorizontal, MoreVertical, ArrowLeft, ChevronDown } from "lucide-react";
import { api } from "../api/api";

// ── Add Attendance Form ───────────────────────────────────────
const AddAttendanceForm = ({ onBack, onSaved }) => {
  const hours   = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
  const minutes = ["00", "15", "30", "45"];
  const periods = ["AM", "PM"];

  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    fullName: "", attendanceId: "", date: "", status: "Present",
    personType: "Customer",
    checkInH: "", checkInM: "", checkInP: "AM",
    checkOutH: "", checkOutM: "", checkOutP: "AM",
  });

  const sel = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const buildTime = (h, m, p) => {
    if (!h || !m) return null;
    return `${h}:${m} ${p}`;
  };

  const handleSave = async () => {
    if (!form.fullName.trim()) {
      alert("Please enter full name.");
      return;
    }
    setSaving(true);
    try {
      await api.markAttendance({
        fullName:     form.fullName,
        personType:   form.personType,
        status:       form.status || "Present",
        checkInTime:  buildTime(form.checkInH, form.checkInM, form.checkInP),
        checkOutTime: buildTime(form.checkOutH, form.checkOutM, form.checkOutP),
        date:         form.date === "Today"
                        ? new Date().toISOString().split("T")[0]
                        : form.date === "Yesterday"
                          ? new Date(Date.now() - 86400000).toISOString().split("T")[0]
                          : form.date || new Date().toISOString().split("T")[0],
      });
      alert("Attendance saved successfully!");
      onSaved();
    } catch (err) {
      alert("Failed to save. Make sure Spring Boot is running on port 8081.");
    } finally {
      setSaving(false);
    }
  };

  const SelectBox = ({ value, onChange, options, placeholder }) => (
    <div className="relative w-full">
      <select
        value={value}
        onChange={onChange}
        className="appearance-none w-full border border-gray-200 rounded-lg px-4 py-3 text-sm bg-gray-50 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-100"
      >
        <option value="">{placeholder}</option>
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
    </div>
  );

  return (
    <div className="p-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-1"
      >
        <ArrowLeft size={18} />
        <span className="text-xl font-semibold text-gray-800">Add Attendance</span>
      </button>
      <p className="text-sm text-gray-400 mb-6 ml-7">Here is the summary of overall data</p>

      <div className="bg-white rounded-xl p-8 shadow-sm" style={{ maxWidth: "680px" }}>

        {/* Full Name */}
        <div className="mb-6">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            👤 Full Name
          </label>
          <input
            placeholder="Enter Full Name"
            value={form.fullName}
            onChange={sel("fullName")}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Person Type + Date + Status */}
        <div className="grid grid-cols-3 gap-5 mb-6">
          <div>
            <label className="flex items-center gap-1 text-sm font-semibold text-gray-700 mb-2">
              🏷 Person Type
            </label>
            <SelectBox
              value={form.personType}
              onChange={sel("personType")}
              options={["Customer", "Trainer"]}
              placeholder="Select Type"
            />
          </div>
          <div>
            <label className="flex items-center gap-1 text-sm font-semibold text-gray-700 mb-2">
              📅 Date
            </label>
            <SelectBox
              value={form.date}
              onChange={sel("date")}
              options={["Today", "Yesterday"]}
              placeholder="Select Date"
            />
          </div>
          <div>
            <label className="flex items-center gap-1 text-sm font-semibold text-gray-700 mb-2">
              📋 Status
            </label>
            <SelectBox
              value={form.status}
              onChange={sel("status")}
              options={["Present", "Absent"]}
              placeholder="Select Status"
            />
          </div>
        </div>

        {/* Check-In + Check-Out */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div>
            <label className="flex items-center gap-1 text-sm font-semibold text-gray-700 mb-2">
              🕐 Check-In
            </label>
            <div className="flex gap-2">
              <SelectBox value={form.checkInH} onChange={sel("checkInH")} options={hours}   placeholder="HH" />
              <SelectBox value={form.checkInM} onChange={sel("checkInM")} options={minutes} placeholder="MM" />
              <SelectBox value={form.checkInP} onChange={sel("checkInP")} options={periods} placeholder="AM" />
            </div>
          </div>
          <div>
            <label className="flex items-center gap-1 text-sm font-semibold text-gray-700 mb-2">
              🕐 Check-Out
            </label>
            <div className="flex gap-2">
              <SelectBox value={form.checkOutH} onChange={sel("checkOutH")} options={hours}   placeholder="HH" />
              <SelectBox value={form.checkOutM} onChange={sel("checkOutM")} options={minutes} placeholder="MM" />
              <SelectBox value={form.checkOutP} onChange={sel("checkOutP")} options={periods} placeholder="AM" />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="px-7 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-7 py-2.5 bg-blue-700 text-white rounded-lg text-sm hover:bg-blue-800 font-medium disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Attendance"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Attendance Table ──────────────────────────────────────────
const AttendanceTable = ({ onAdd }) => {
  const [tab, setTab]   = useState("Customer list");
  const [search, setSearch] = useState("");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const fetchAttendance = (currentTab) => {
    setLoading(true);
    setError(null);
    const endpoint = currentTab === "Customer list"
      ? api.getCustomerAttendance
        ? api.getCustomerAttendance()
        : fetch("http://localhost:8081/api/attendance/customers").then(r => r.json())
      : api.getTrainerAttendance
        ? api.getTrainerAttendance()
        : fetch("http://localhost:8081/api/attendance/trainers").then(r => r.json());

    Promise.resolve(endpoint)
      .then(data => {
        setRecords(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setError("Cannot connect to backend. Make sure Spring Boot is running on port 8081.");
        setLoading(false);
      });
  };

  useEffect(() => { fetchAttendance(tab); }, [tab]);

  const tabs = ["Customer list", "Trainer list"];

  const filtered = records.filter(r =>
    (r.fullName || "").toLowerCase().includes(search.toLowerCase())
  );

  const nameLabel = tab === "Customer list" ? "Customer Name" : "Trainer Name";
  const idLabel   = tab === "Customer list" ? "Customer ID"   : "Trainer ID";

  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit", month: "short", year: "numeric"
    });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-5">Attendance</h2>

      {/* Tabs */}
      <div className="flex gap-8 border-b border-gray-200 mb-6">
        {tabs.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-3 text-sm font-medium transition-colors ${
              tab === t
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
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
          className="flex items-center gap-2 bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm hover:bg-blue-800 font-medium"
        >
          <Plus size={16} /> Add Attendance
        </button>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              placeholder="Search here"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg w-60 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <button className="p-2.5 border border-gray-200 rounded-lg hover:bg-gray-50">
            <SlidersHorizontal size={17} className="text-gray-500" />
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
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 text-xs bg-gray-50 border-b border-gray-100">
              <th className="px-5 py-4 font-semibold">{nameLabel}</th>
              <th className="px-5 py-4 font-semibold">{idLabel}</th>
              <th className="px-5 py-4 font-semibold">Date</th>
              <th className="px-5 py-4 font-semibold">Check-in Time</th>
              <th className="px-5 py-4 font-semibold">Check-out Time</th>
              <th className="px-5 py-4 font-semibold">Status</th>
              <th className="px-5 py-4 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i} className="border-t border-gray-50">
                  {Array.from({ length: 7 }).map((_, j) => (
                    <td key={j} className="px-5 py-4">
                      <div className="h-4 bg-gray-100 rounded animate-pulse w-20" />
                    </td>
                  ))}
                </tr>
              ))
            ) : filtered.length > 0 ? (
              filtered.map((r, i) => (
                <tr key={r.id || i} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                  {/* Name with initials */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm flex-shrink-0">
                        {(r.fullName || "?")[0].toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-800">{r.fullName}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-500">{r.attendanceId || "—"}</td>
                  <td className="px-5 py-4">
                    <span className="flex items-center gap-1 text-blue-600 text-xs font-medium">
                      {formatDate(r.date)} <ChevronDown size={12} />
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-600">{r.checkInTime || "----------"}</td>
                  <td className="px-5 py-4 text-gray-600">{r.checkOutTime || "----------"}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 text-xs rounded-full font-medium ${
                      r.status === "Present"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-500"
                    }`}>
                      {r.status || "—"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete attendance for ${r.fullName}?`)) {
                          api.deleteAttendance(r.id)
                            .then(() => fetchAttendance(tab))
                            .catch(() => alert("Failed to delete."));
                        }
                      }}
                      className="text-gray-400 hover:text-red-500 p-1 rounded hover:bg-gray-100"
                    >
                      <MoreVertical size={17} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-5 py-16 text-center text-gray-300 text-base">
                  {search ? "No records match your search" : "No attendance records found"}
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
const Attendance = () => {
  const [view, setView] = useState("list");

  return (
    <Layout>
      {view === "add"
        ? <AddAttendanceForm onBack={() => setView("list")} onSaved={() => setView("list")} />
        : <AttendanceTable onAdd={() => setView("add")} />
      }
    </Layout>
  );
};

export default Attendance;