import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { Plus, Search, SlidersHorizontal, MoreVertical, ArrowLeft, Upload, User } from "lucide-react";

// ── Add Enquiries Form ────────────────────────────────────────
const AddEnquiriesForm = ({ onBack }) => {
  const [photo, setPhoto] = useState(null);
  const [form, setForm] = useState({
    fullName: "", email: "", address: "",
    mobile: "", lastFollowup: "", nextFollowup: "",
  });

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (file) setPhoto(URL.createObjectURL(file));
  };

  const handleSave = () => {
    // TODO: POST form data to backend API
    // fetch("/api/enquiries", { method: "POST", body: JSON.stringify(form) })
    onBack();
  };

  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-5 text-sm">
        <ArrowLeft size={16} />
        <span className="text-lg font-semibold text-gray-800">Add Enquiries</span>
      </button>

      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="grid grid-cols-2 gap-8">

          {/* LEFT */}
          <div className="flex flex-col gap-5">

            {/* Full Name */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <User size={14} /> Full Name
              </label>
              <input
                placeholder="Enter Your Name"
                value={form.fullName}
                onChange={e => setForm({ ...form, fullName: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Email */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                ✉ Email Address
              </label>
              <input
                placeholder="Enter Your Email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Address */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                📍 Address
              </label>
              <input
                placeholder="Enter Your Address"
                value={form.address}
                onChange={e => setForm({ ...form, address: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Mobile + Last Follow-Up + Next Follow-Up */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">📞 Mobile Number</label>
                <div className="flex border border-gray-200 rounded-lg overflow-hidden text-xs bg-gray-50">
                  <span className="px-2 py-2 text-gray-500 border-r border-gray-200 bg-gray-100">+91</span>
                  <input
                    placeholder="Enter Mobile No"
                    className="flex-1 px-2 py-2 focus:outline-none bg-gray-50"
                    value={form.mobile}
                    onChange={e => setForm({ ...form, mobile: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">📅 Last Follow-Up</label>
                <input
                  type="date"
                  value={form.lastFollowup}
                  onChange={e => setForm({ ...form, lastFollowup: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-2 py-2 text-xs bg-gray-50 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">📅 Next Follow-Up</label>
                <input
                  type="date"
                  value={form.nextFollowup}
                  onChange={e => setForm({ ...form, nextFollowup: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-2 py-2 text-xs bg-gray-50 focus:outline-none"
                />
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

        {/* Buttons */}
        <div className="flex gap-3 mt-8">
          <button onClick={onBack} className="px-6 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
            Cancel
          </button>
          <button onClick={handleSave} className="px-6 py-2 bg-blue-700 text-white rounded-lg text-sm hover:bg-blue-800">
            Save Enquiry
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

  // ── TODO: Uncomment & connect your backend API ────────────
  // useEffect(() => {
  //   fetch("/api/enquiries").then(r => r.json()).then(setEnquiries);
  // }, []);

  const filtered = enquiries.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h2 className="text-xl font-semibold mb-5">Gym Enquiries</h2>

      {/* Actions */}
      <div className="flex justify-between items-center mb-5">
        <button
          onClick={onAdd}
          className="flex items-center gap-2 bg-blue-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-800"
        >
          <Plus size={15} /> Add Enquiries
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
              <th className="px-4 py-3 font-medium">Mobile No</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Last Followup</th>
              <th className="px-4 py-3 font-medium">Next Followup</th>
              <th className="px-4 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((e, i) => (
                <tr key={i} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <img src={e.avatar} alt={e.name} className="w-7 h-7 rounded-full object-cover" />
                      <span className="font-medium text-gray-800">{e.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{e.mobile}</td>
                  <td className="px-4 py-3 text-gray-600">{e.email}</td>
                  <td className="px-4 py-3 text-gray-600">{e.lastFollowup}</td>
                  <td className="px-4 py-3 text-gray-600">{e.nextFollowup}</td>
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
                  No enquiries found
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
  const [view, setView] = useState("list"); // "list" | "add"

  return (
    <Layout>
      {view === "add"
        ? <AddEnquiriesForm onBack={() => setView("list")} />
        : <EnquiriesList onAdd={() => setView("add")} />
      }
    </Layout>
  );
};

export default GymEnquiries;