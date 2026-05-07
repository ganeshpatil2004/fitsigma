import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { Plus, Search, SlidersHorizontal, MoreVertical, ArrowLeft, Upload, User } from "lucide-react";
import { api } from "../api/api";

// ── Add Enquiries Form ────────────────────────────────────────
const AddEnquiriesForm = ({ onBack, onSaved }) => {
  const [photo, setPhoto]   = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm]     = useState({
    fullName: "", email: "", address: "",
    mobile: "", lastFollowup: "", nextFollowup: "",
  });

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (file) setPhoto(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!form.fullName.trim()) {
      alert("Please enter full name.");
      return;
    }
    setSaving(true);
    try {
      await api.addEnquiry({
        fullName:     form.fullName,
        email:        form.email,
        address:      form.address,
        mobile:       form.mobile,
        lastFollowup: form.lastFollowup || null,
        nextFollowup: form.nextFollowup || null,
      });
      alert("Enquiry saved successfully!");
      onSaved();
    } catch (err) {
      alert("Failed to save. Make sure Spring Boot is running on port 8081.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6">
      <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-1">
        <ArrowLeft size={18} />
        <span className="text-xl font-semibold text-gray-800">Add Enquiries</span>
      </button>
      <p className="text-sm text-gray-400 mb-6 ml-7">Here is the summary of overall data</p>

      <div className="bg-white rounded-xl p-8 shadow-sm">
        <div className="grid grid-cols-2 gap-10">

          {/* LEFT */}
          <div className="flex flex-col gap-6">

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <User size={14} /> Full Name
              </label>
              <input
                placeholder="Enter Your Name"
                value={form.fullName}
                onChange={e => setForm({ ...form, fullName: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                ✉ Email Address
              </label>
              <input
                placeholder="Enter Your Email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                📍 Address
              </label>
              <input
                placeholder="Enter Your Address"
                value={form.address}
                onChange={e => setForm({ ...form, address: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">📞 Mobile</label>
                <div className="flex border border-gray-200 rounded-lg overflow-hidden text-sm bg-gray-50">
                  <span className="px-2 py-2.5 text-gray-500 border-r border-gray-200 bg-gray-100 text-xs">+91</span>
                  <input
                    placeholder="Mobile No"
                    className="flex-1 px-2 py-2.5 focus:outline-none bg-gray-50 text-sm"
                    value={form.mobile}
                    onChange={e => setForm({ ...form, mobile: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">📅 Last Follow-Up</label>
                <input
                  type="date"
                  value={form.lastFollowup}
                  onChange={e => setForm({ ...form, lastFollowup: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">📅 Next Follow-Up</label>
                <input
                  type="date"
                  value={form.nextFollowup}
                  onChange={e => setForm({ ...form, nextFollowup: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 focus:outline-none"
                />
              </div>
            </div>

          </div>

          {/* RIGHT — Profile Photo */}
          <div className="flex flex-col items-center gap-4 pt-4">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 self-start">
              <User size={14} /> Profile Photo
            </label>
            <div className="w-40 h-40 rounded-xl border-2 border-gray-200 flex items-center justify-center overflow-hidden bg-gray-50">
              {photo
                ? <img src={photo} alt="preview" className="w-full h-full object-cover" />
                : <User size={56} className="text-gray-300" />
              }
            </div>
            <label className="cursor-pointer border border-gray-300 rounded-lg px-5 py-2.5 text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2 font-medium">
              <Upload size={15} /> Upload Photo
              <input type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
            </label>
          </div>

        </div>

        <div className="flex gap-3 mt-8">
          <button onClick={onBack} className="px-7 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 font-medium">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-7 py-2.5 bg-blue-700 text-white rounded-lg text-sm hover:bg-blue-800 font-medium disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Enquiry"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Enquiries List ────────────────────────────────────────────
const EnquiriesList = ({ onAdd }) => {
  const [search, setSearch]       = useState("");
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  const fetchEnquiries = () => {
    setLoading(true);
    setError(null);
    api.getEnquiries()
      .then(data => {
        setEnquiries(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setError("Cannot connect to backend. Make sure Spring Boot is running on port 8081.");
        setLoading(false);
      });
  };

  useEffect(() => { fetchEnquiries(); }, []);

  const filtered = enquiries.filter(e =>
    (e.fullName || "").toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit", month: "short", year: "numeric"
    });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Gym Enquiries</h2>

      <div className="flex justify-between items-center mb-6">
        <button
          onClick={onAdd}
          className="flex items-center gap-2 bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm hover:bg-blue-800 font-medium"
        >
          <Plus size={16} /> Add Enquiries
        </button>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              placeholder="Search Customers"
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

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
          ⚠️ {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 text-xs bg-gray-50 border-b border-gray-100">
              <th className="px-5 py-4 font-semibold">Customer Name</th>
              <th className="px-5 py-4 font-semibold">Mobile No</th>
              <th className="px-5 py-4 font-semibold">Email</th>
              <th className="px-5 py-4 font-semibold">Last Followup</th>
              <th className="px-5 py-4 font-semibold">Next Followup</th>
              <th className="px-5 py-4 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i} className="border-t border-gray-50">
                  {Array.from({ length: 6 }).map((_, j) => (
                    <td key={j} className="px-5 py-4">
                      <div className="h-4 bg-gray-100 rounded animate-pulse w-20" />
                    </td>
                  ))}
                </tr>
              ))
            ) : filtered.length > 0 ? (
              filtered.map((e, i) => (
                <tr key={e.id || i} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm flex-shrink-0">
                        {(e.fullName || "?")[0].toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-800">{e.fullName}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-600">{e.mobile || "—"}</td>
                  <td className="px-5 py-4 text-gray-600">{e.email || "—"}</td>
                  <td className="px-5 py-4 text-gray-600">{formatDate(e.lastFollowup)}</td>
                  <td className="px-5 py-4 text-gray-600">{formatDate(e.nextFollowup)}</td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete enquiry for ${e.fullName}?`)) {
                          api.deleteEnquiry(e.id)
                            .then(fetchEnquiries)
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
                <td colSpan={6} className="px-5 py-16 text-center text-gray-300 text-base">
                  {search ? "No enquiries match your search" : "No enquiries found"}
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
const GymEnquiries = () => {
  const [view, setView] = useState("list");

  return (
    <Layout>
      {view === "add"
        ? <AddEnquiriesForm onBack={() => setView("list")} onSaved={() => setView("list")} />
        : <EnquiriesList onAdd={() => setView("add")} />
      }
    </Layout>
  );
};

export default GymEnquiries;