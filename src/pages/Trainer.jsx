import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { Plus, Search, SlidersHorizontal, MoreVertical, ArrowLeft, Upload, User } from "lucide-react";

// ── Add Trainer Form ──────────────────────────────────────────
const AddTrainerForm = ({ onBack }) => {
  const [photo, setPhoto] = useState(null);
  const [form, setForm] = useState({
    fullName: "", email: "", address: "",
    joiningDate: "", assignedCustomer: "", gender: "",
    mobile: "", dob: "", acquisitionSource: "",
  });

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (file) setPhoto(URL.createObjectURL(file));
  };

  const handleSave = () => {
    // TODO: POST form data to backend API
    // fetch("/api/trainers", { method: "POST", body: JSON.stringify(form) })
    onBack();
  };

  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-1 text-gray-500 hover:text-gray-800 mb-4 text-sm">
        <ArrowLeft size={16} /> Add Trainer
      </button>

      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="grid grid-cols-2 gap-8">

          {/* LEFT */}
          <div className="flex flex-col gap-5">

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <User size={14} /> Full Name
              </label>
              <input
                placeholder="Enter Your Name"
                value={form.fullName}
                onChange={e => setForm({ ...form, fullName: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                ✉ Email Address
              </label>
              <input
                placeholder="Enter Your Email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                📍 Address
              </label>
              <input
                placeholder="Enter Your Address"
                value={form.address}
                onChange={e => setForm({ ...form, address: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">📅 Joining Date</label>
                <input
                  type="date"
                  value={form.joiningDate}
                  onChange={e => setForm({ ...form, joiningDate: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-2 py-2 text-xs focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">👤 Assign Customers</label>
                <input
                  placeholder="Enter Customer ID"
                  value={form.assignedCustomer}
                  onChange={e => setForm({ ...form, assignedCustomer: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-2 py-2 text-xs focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">💡 Gender</label>
                <select
                  value={form.gender}
                  onChange={e => setForm({ ...form, gender: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-2 py-2 text-xs focus:outline-none bg-white"
                >
                  <option value="">Select Gender</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">📞 Mobile Number</label>
                <div className="flex border border-gray-200 rounded-lg overflow-hidden text-xs">
                  <span className="bg-gray-50 px-2 py-2 text-gray-500 border-r border-gray-200">+91</span>
                  <input
                    placeholder="Enter Mobile No"
                    value={form.mobile}
                    onChange={e => setForm({ ...form, mobile: e.target.value })}
                    className="flex-1 px-2 py-2 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">📅 Date of Birth</label>
                <input
                  type="date"
                  value={form.dob}
                  onChange={e => setForm({ ...form, dob: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-2 py-2 text-xs focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">📅 Acquisition Source</label>
                <select
                  value={form.acquisitionSource}
                  onChange={e => setForm({ ...form, acquisitionSource: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-2 py-2 text-xs focus:outline-none bg-white"
                >
                  <option value="">Select Source</option>
                  <option>Social Media</option>
                  <option>Referral</option>
                  <option>Walk-in</option>
                </select>
              </div>
            </div>

          </div>

          {/* RIGHT — Profile Photo */}
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

        <div className="flex gap-3 mt-8">
          <button onClick={onBack} className="px-6 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
            Cancel
          </button>
          <button onClick={handleSave} className="px-6 py-2 bg-blue-700 text-white rounded-lg text-sm hover:bg-blue-800">
            Save Trainer
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Trainer Detail View (Allocated Customers) ─────────────────
const TrainerDetailView = ({ trainer }) => {
  const [trainerInput, setTrainerInput] = useState(
    trainer ? `${trainer.name} (${trainer.id})` : ""
  );
  const [allocatedCustomers, setAllocatedCustomers] = useState([]);

  // ── TODO: Uncomment & connect your backend API ────────────
  // useEffect(() => {
  //   if (trainer?.id) {
  //     fetch(`/api/trainers/${trainer.id}/customers`)
  //       .then(r => r.json())
  //       .then(setAllocatedCustomers);
  //   }
  // }, [trainer]);

  const handleGetDetails = () => {
    // TODO: Fetch trainer details by input value
    // fetch(`/api/trainers/search?query=${trainerInput}`)
    //   .then(r => r.json())
    //   .then(data => setAllocatedCustomers(data.customers));
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-5">Trainer Details</h2>

      {/* Search bar */}
      <div className="flex items-end gap-4 mb-8">
        <div className="flex-1 max-w-xs">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
            <User size={14} /> Trainer Name (ID)
          </label>
          <input
            value={trainerInput}
            onChange={e => setTrainerInput(e.target.value)}
            placeholder="Enter Trainer Name (ID)"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 bg-gray-50"
          />
        </div>
        <button
          onClick={handleGetDetails}
          className="px-5 py-2 bg-blue-700 text-white rounded-lg text-sm hover:bg-blue-800"
        >
          Get Details
        </button>
      </div>

      {/* Allocated Customers Table */}
      <h3 className="text-base font-semibold mb-3">Allocated Customers</h3>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 text-xs border-b border-gray-100">
              <th className="px-4 py-3 font-medium">Customer Name</th>
              <th className="px-4 py-3 font-medium">Customer ID</th>
              <th className="px-4 py-3 font-medium">Check-in Time</th>
              <th className="px-4 py-3 font-medium">Check-out Time</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {allocatedCustomers.length > 0 ? (
              allocatedCustomers.map((c, i) => (
                <tr key={i} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <img src={c.avatar} alt={c.name} className="w-7 h-7 rounded-full object-cover" />
                      <span className="font-medium text-gray-800">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{c.id}</td>
                  <td className="px-4 py-3 text-gray-600">{c.checkIn ?? "----------"}</td>
                  <td className="px-4 py-3 text-gray-600">{c.checkOut ?? "----------"}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 text-xs rounded ${
                      c.status === "Present"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-500"
                    }`}>
                      {c.status}
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
                <td colSpan={6} className="px-4 py-10 text-center text-gray-300 text-sm">
                  No allocated customers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ── Trainer List ──────────────────────────────────────────────
const TrainerList = ({ onAdd, onViewList }) => {
  const [search, setSearch]     = useState("");
  const [trainers, setTrainers] = useState([]);

  // ── TODO: Uncomment & connect your backend API ────────────
  // useEffect(() => {
  //   fetch("/api/trainers").then(r => r.json()).then(setTrainers);
  // }, []);

  const filtered = trainers.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h2 className="text-xl font-semibold mb-5">Trainer Details</h2>

      <div className="flex justify-between items-center mb-5">
        <button
          onClick={onAdd}
          className="flex items-center gap-2 bg-blue-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-800"
        >
          <Plus size={15} /> Add Trainer
        </button>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              placeholder="Search Trainer"
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

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 text-xs border-b border-gray-100">
              <th className="px-4 py-3 font-medium">Trainer Name</th>
              <th className="px-4 py-3 font-medium">Trainer ID</th>
              <th className="px-4 py-3 font-medium">Mobile No</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Joined-Date</th>
              <th className="px-4 py-3 font-medium">Allocated Users</th>
              <th className="px-4 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((t, i) => (
                <tr key={i} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <img src={t.avatar} alt={t.name} className="w-7 h-7 rounded-full object-cover" />
                      <span className="font-medium text-gray-800">{t.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{t.id}</td>
                  <td className="px-4 py-3 text-gray-600">{t.mobile}</td>
                  <td className="px-4 py-3 text-gray-600">{t.email}</td>
                  <td className="px-4 py-3 text-gray-600">{t.joined}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => onViewList(t)}
                      className="text-blue-600 text-xs underline hover:text-blue-800"
                    >
                      View List
                    </button>
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
                  No trainers found
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
const Trainer = () => {
  const [view, setView]                     = useState("list"); // "list" | "add" | "detail"
  const [selectedTrainer, setSelectedTrainer] = useState(null);

  return (
    <Layout>
      {view === "add" && (
        <AddTrainerForm onBack={() => setView("list")} />
      )}
      {view === "detail" && (
        <TrainerDetailView trainer={selectedTrainer} onBack={() => setView("list")} />
      )}
      {view === "list" && (
        <TrainerList
          onAdd={() => setView("add")}
          onViewList={(trainer) => {
            setSelectedTrainer(trainer);
            setView("detail");
          }}
        />
      )}
    </Layout>
  );
};

export default Trainer;