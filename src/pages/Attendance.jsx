import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { Plus, Search, SlidersHorizontal, MoreVertical, ArrowLeft, ChevronDown } from "lucide-react";

// ── Add Attendance Form ───────────────────────────────────────
const AddAttendanceForm = ({ onBack }) => {
  const hours   = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
  const minutes = ["00", "15", "30", "45"];
  const periods = ["AM", "PM"];

  const [form, setForm] = useState({
    fullName: "", attendanceId: "", date: "", status: "",
    checkInH: "", checkInM: "", checkInP: "AM",
    checkOutH: "", checkOutM: "", checkOutP: "AM",
  });

  const sel = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSave = () => {
    // TODO: POST form data to backend API
    // fetch("/api/attendance", { method: "POST", body: JSON.stringify(form) })
    onBack();
  };

  const SelectBox = ({ value, onChange, options, placeholder }) => (
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        className="appearance-none border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-100 w-full"
      >
        <option value="">{placeholder}</option>
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
      <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
    </div>
  );

  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-5 text-sm">
        <ArrowLeft size={16} />
        <span className="text-lg font-semibold text-gray-800">Add Attendance</span>
      </button>

      <div className="bg-white rounded-xl p-6 shadow-sm max-w-2xl">

        {/* Full Name */}
        <div className="mb-5">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
            👤 Full Name
          </label>
          <input
            placeholder="Enter Your Name"
            value={form.fullName}
            onChange={sel("fullName")}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Attendance ID + Date + Status */}
        <div className="grid grid-cols-3 gap-4 mb-5">
          <div>
            <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
              🗒 Attendance ID
            </label>
            <input
              placeholder="Enter Attendance ID"
              value={form.attendanceId}
              onChange={sel("attendanceId")}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <div>
            <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
              📅 Date
            </label>
            <SelectBox
              value={form.date}
              onChange={sel("date")}
              options={["Today", "Yesterday", "Custom"]}
              placeholder="Select Date"
            />
          </div>
          <div>
            <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
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
            <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-2">
              🕐 Check-In
            </label>
            <div className="flex gap-2">
              <SelectBox value={form.checkInH} onChange={sel("checkInH")} options={hours}   placeholder="Hours"   />
              <SelectBox value={form.checkInM} onChange={sel("checkInM")} options={minutes} placeholder="Mins"    />
              <SelectBox value={form.checkInP} onChange={sel("checkInP")} options={periods} placeholder="AM"      />
            </div>
          </div>
          <div>
            <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-2">
              🕐 Check-Out
            </label>
            <div className="flex gap-2">
              <SelectBox value={form.checkOutH} onChange={sel("checkOutH")} options={hours}   placeholder="Hours" />
              <SelectBox value={form.checkOutM} onChange={sel("checkOutM")} options={minutes} placeholder="Mins"  />
              <SelectBox value={form.checkOutP} onChange={sel("checkOutP")} options={periods} placeholder="AM"    />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button onClick={onBack} className="px-6 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
            Cancel
          </button>
          <button onClick={handleSave} className="px-6 py-2 bg-blue-700 text-white rounded-lg text-sm hover:bg-blue-800">
            Save Attendance
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Attendance Table ──────────────────────────────────────────
const AttendanceTable = ({ onAdd }) => {
  const [tab, setTab]                         = useState("Customer list");
  const [search, setSearch]                   = useState("");
  const [customerAttendance, setCustomerAttendance] = useState([]);
  const [trainerAttendance, setTrainerAttendance]   = useState([]);

  // ── TODO: Uncomment & connect your backend API ────────────
  // useEffect(() => {
  //   fetch("/api/attendance/customers").then(r => r.json()).then(setCustomerAttendance);
  //   fetch("/api/attendance/trainers").then(r => r.json()).then(setTrainerAttendance);
  // }, []);

  const tabs = ["Customer list", "Trainer list"];
  const data = tab === "Customer list" ? customerAttendance : trainerAttendance;

  const filtered = data.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  // Column header label changes based on tab
  const nameLabel = tab === "Customer list" ? "Customer Name" : "Trainer Name";
  const idLabel   = tab === "Customer list" ? "Customer ID"   : "Trainer ID";

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Attendance</h2>

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
          <Plus size={15} /> Add Attendance
        </button>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              placeholder="Search here"
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
              <th className="px-4 py-3 font-medium">{nameLabel}</th>
              <th className="px-4 py-3 font-medium">{idLabel}</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Check-in Time</th>
              <th className="px-4 py-3 font-medium">Check-out Time</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((r, i) => (
                <tr key={i} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <img src={r.avatar} alt={r.name} className="w-7 h-7 rounded-full object-cover" />
                      <span className="font-medium text-gray-800">{r.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{r.id}</td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1 text-blue-600 text-xs font-medium">
                      {r.date} <ChevronDown size={12} />
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{r.checkIn ?? "----------"}</td>
                  <td className="px-4 py-3 text-gray-600">{r.checkOut ?? "----------"}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 text-xs rounded ${
                      r.status === "Present"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-500"
                    }`}>
                      {r.status}
                    </span>
                  </td>
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
                  No attendance records found
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
  const [view, setView] = useState("list"); // "list" | "add"

  return (
    <Layout>
      {view === "add"
        ? <AddAttendanceForm onBack={() => setView("list")} />
        : <AttendanceTable onAdd={() => setView("add")} />
      }
    </Layout>
  );
};

export default Attendance;