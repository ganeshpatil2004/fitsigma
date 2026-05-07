import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { Plus, Search, SlidersHorizontal, MoreVertical, ArrowLeft, Upload, User } from "lucide-react";
import { api } from "../api/api";

// ── Add Trainer Form ──────────────────────────────────────────
const AddTrainerForm = ({ onBack, onSaved }) => {
  const [photo, setPhoto] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    fullName: "", email: "", address: "",
    joiningDate: "", assignedCustomer: "", gender: "",
    mobile: "", dob: "", acquisitionSource: "",
  });

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (file) setPhoto(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!form.fullName.trim()) {
      alert("Please enter trainer full name.");
      return;
    }
    setSaving(true);
    try {
      await api.addTrainer({
        fullName:          form.fullName,
        email:             form.email,
        address:           form.address,
        mobile:            form.mobile,
        gender:            form.gender,
        assignedCustomer:  form.assignedCustomer,
        acquisitionSource: form.acquisitionSource,
        joiningDate:       form.joiningDate || null,
        dateOfBirth:       form.dob         || null,
      });
      alert("Trainer saved successfully!");
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
        <ArrowLeft size={20} /> Add Trainer
      </button>

      <div className="bg-white rounded-xl p-8 shadow-sm">
        <div className="grid grid-cols-2 gap-10">

          {/* LEFT */}
          <div className="flex flex-col gap-6">

            <div>
              <label className="flex items-center gap-2 text-base font-medium text-gray-700 mb-2">
                <User size={16} /> Full Name
              </label>
              <input
                placeholder="Enter Your Name"
                value={form.fullName}
                onChange={e => setForm({ ...form, fullName: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-base font-medium text-gray-700 mb-2">
                ✉ Email Address
              </label>
              <input
                placeholder="Enter Your Email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-base font-medium text-gray-700 mb-2">
                📍 Address
              </label>
              <input
                placeholder="Enter Your Address"
                value={form.address}
                onChange={e => setForm({ ...form, address: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">📅 Joining Date</label>
                <input
                  type="date"
                  value={form.joiningDate}
                  onChange={e => setForm({ ...form, joiningDate: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">👤 Assign Customers</label>
                <input
                  placeholder="Customer ID"
                  value={form.assignedCustomer}
                  onChange={e => setForm({ ...form, assignedCustomer: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">💡 Gender</label>
                <select
                  value={form.gender}
                  onChange={e => setForm({ ...form, gender: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none bg-white"
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
                    value={form.mobile}
                    onChange={e => setForm({ ...form, mobile: e.target.value })}
                    className="flex-1 px-3 py-2.5 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">📅 Date of Birth</label>
                <input
                  type="date"
                  value={form.dob}
                  onChange={e => setForm({ ...form, dob: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">📅 Acquisition Source</label>
                <select
                  value={form.acquisitionSource}
                  onChange={e => setForm({ ...form, acquisitionSource: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none bg-white"
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

        <div className="flex gap-4 mt-10">
          <button onClick={onBack} className="px-7 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-7 py-2.5 bg-blue-700 text-white rounded-lg text-sm hover:bg-blue-800 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Trainer"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Trainer Detail View ───────────────────────────────────────
const TrainerDetailView = ({ trainer, onBack }) => {
  const [trainerInput, setTrainerInput] = useState(
    trainer ? `${trainer.fullName} (${trainer.trainerId})` : ""
  );

  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-5 text-base">
        <ArrowLeft size={20} /> Back to Trainers
      </button>

      <h2 className="text-2xl font-semibold mb-6">Trainer Details</h2>

      <div className="flex items-end gap-5 mb-9">
        <div className="flex-1 max-w-sm">
          <label className="flex items-center gap-2 text-base font-medium text-gray-700 mb-2">
            <User size={16} /> Trainer Name (ID)
          </label>
          <input
            value={trainerInput}
            onChange={e => setTrainerInput(e.target.value)}
            placeholder="Enter Trainer Name (ID)"
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 bg-gray-50"
          />
        </div>
        <button className="px-6 py-3 bg-blue-700 text-white rounded-lg text-sm hover:bg-blue-800">
          Get Details
        </button>
      </div>

      {/* Trainer Info Card */}
      {trainer && (
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <div className="flex items-center gap-5 mb-5">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-2xl">
              {(trainer.fullName || "?")[0].toUpperCase()}
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-800">{trainer.fullName}</p>
              <p className="text-sm text-gray-400">{trainer.trainerId} · {trainer.email}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            {[
              ["Mobile",    trainer.mobile       || "—"],
              ["Gender",    trainer.gender        || "—"],
              ["Address",   trainer.address       || "—"],
              ["Joining Date", trainer.joiningDate
                ? new Date(trainer.joiningDate).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" })
                : "—"],
              ["Assigned Customer", trainer.assignedCustomer || "—"],
              ["Source",    trainer.acquisitionSource || "—"],
            ].map(([label, val]) => (
              <div key={label} className="bg-gray-50 rounded-lg px-4 py-3">
                <p className="text-xs text-gray-400 mb-1">{label}</p>
                <p className="font-medium text-gray-700">{val}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Allocated Customers Table */}
      <h3 className="text-lg font-semibold mb-4">Allocated Customers</h3>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 text-sm border-b border-gray-100">
              <th className="px-5 py-4 font-medium">Customer Name</th>
              <th className="px-5 py-4 font-medium">Customer ID</th>
              <th className="px-5 py-4 font-medium">Check-in Time</th>
              <th className="px-5 py-4 font-medium">Check-out Time</th>
              <th className="px-5 py-4 font-medium">Status</th>
              <th className="px-5 py-4 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={6} className="px-5 py-14 text-center text-gray-300 text-base">
                No allocated customers found
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ── Trainer List ──────────────────────────────────────────────
const TrainerList = ({ onAdd, onViewDetail }) => {
  const [search, setSearch]     = useState("");
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  const fetchTrainers = () => {
    setLoading(true);
    setError(null);
    api.getTrainers()
      .then(data => {
        setTrainers(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setError("Cannot connect to backend. Make sure Spring Boot is running on port 8081.");
        setLoading(false);
      });
  };

  useEffect(() => { fetchTrainers(); }, []);

  const filtered = trainers.filter(t =>
    (t.fullName || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Trainer Details</h2>

      <div className="flex justify-between items-center mb-6">
        <button
          onClick={onAdd}
          className="flex items-center gap-2 bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm hover:bg-blue-800"
        >
          <Plus size={17} /> Add Trainer
        </button>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              placeholder="Search Trainer"
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

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
          ⚠️ {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 text-sm border-b border-gray-100">
              <th className="px-5 py-4 font-medium">Trainer Name</th>
              <th className="px-5 py-4 font-medium">Trainer ID</th>
              <th className="px-5 py-4 font-medium">Mobile No</th>
              <th className="px-5 py-4 font-medium">Email</th>
              <th className="px-5 py-4 font-medium">Joined-Date</th>
              <th className="px-5 py-4 font-medium">Allocated Users</th>
              <th className="px-5 py-4 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={i} className="border-t border-gray-50">
                  {Array.from({ length: 7 }).map((_, j) => (
                    <td key={j} className="px-5 py-4">
                      <div className="h-4 bg-gray-100 rounded animate-pulse w-24" />
                    </td>
                  ))}
                </tr>
              ))
            ) : filtered.length > 0 ? (
              filtered.map((t, i) => (
                <tr key={t.id || i} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm flex-shrink-0">
                        {(t.fullName || "?")[0].toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-800">{t.fullName}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-500">{t.trainerId || "—"}</td>
                  <td className="px-5 py-4 text-gray-600">{t.mobile || "—"}</td>
                  <td className="px-5 py-4 text-gray-600">{t.email || "—"}</td>
                  <td className="px-5 py-4 text-gray-600">
                    {t.joiningDate
                      ? new Date(t.joiningDate).toLocaleDateString("en-IN", {
                          day: "2-digit", month: "short", year: "numeric"
                        })
                      : "—"}
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => onViewDetail(t)}
                      className="text-blue-600 text-sm underline hover:text-blue-800"
                    >
                      View List
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete trainer ${t.fullName}?`)) {
                          api.deleteTrainer(t.id)
                            .then(fetchTrainers)
                            .catch(() => alert("Failed to delete trainer."));
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
                <td colSpan={7} className="px-5 py-14 text-center text-gray-300 text-base">
                  {search ? "No trainers match your search" : "No trainers found"}
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
  const [view, setView]                       = useState("list");
  const [selectedTrainer, setSelectedTrainer] = useState(null);

  const handleSaved = () => setView("list");

  return (
    <Layout>
      {view === "add" && (
        <AddTrainerForm onBack={() => setView("list")} onSaved={handleSaved} />
      )}
      {view === "detail" && (
        <TrainerDetailView trainer={selectedTrainer} onBack={() => setView("list")} />
      )}
      {view === "list" && (
        <TrainerList
          onAdd={() => setView("add")}
          onViewDetail={(trainer) => {
            setSelectedTrainer(trainer);
            setView("detail");
          }}
        />
      )}
    </Layout>
  );
};

export default Trainer;