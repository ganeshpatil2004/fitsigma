import React, { useState } from "react";
import Layout from "../components/Layout";
import { User, Mail, Phone, MapPin, Save, X, CheckCircle, Building } from "lucide-react";

const avatarColor = (name = "") => {
  const palette = ["#2563eb","#7c3aed","#db2777","#059669","#d97706","#dc2626","#0891b2","#65a30d"];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return palette[Math.abs(h) % palette.length];
};

const getInitials = (name = "") =>
  name.split(" ").filter(Boolean).map(w => w[0].toUpperCase()).join("").slice(0, 2) || "A";

// ── Shared helpers (same keys as Login & Settings) ────────────
const DEFAULT_CREDS = { email: "admin@gmail.com", password: "1234" };
const loadCreds     = () => { try { return JSON.parse(localStorage.getItem("adminCredentials")) || DEFAULT_CREDS; } catch { return DEFAULT_CREDS; } };
const saveCreds     = (data) => localStorage.setItem("adminCredentials", JSON.stringify(data));

const PROFILE_KEY   = "profileData";
const loadProfile   = () => { try { return JSON.parse(localStorage.getItem(PROFILE_KEY)) || {}; } catch { return {}; } };
const saveProfile   = (data) => localStorage.setItem(PROFILE_KEY, JSON.stringify(data));

const MyProfile = () => {
  const stored = loadProfile();

  const [editing, setEditing] = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [form, setForm] = useState({
    name:    stored.name    || "",
    email:   stored.email   || loadCreds().email || "",  // pre-fill from credentials if blank
    phone:   stored.phone   || "",
    address: stored.address || "",
    gym:     stored.gym     || "GymDesk Fitness Center",
  });
  const [original, setOriginal] = useState({ ...form });

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSave = () => {
    // Save profile display data
    saveProfile(form);

    // ── KEY FIX: keep login email in sync with profile email ──
    const creds = loadCreds();
    saveCreds({ ...creds, email: form.email });

    setOriginal({ ...form });
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleCancel = () => {
    setForm({ ...original });
    setEditing(false);
  };

  const initials = getInitials(form.name || "Admin");
  const bgColor  = avatarColor(form.name || "Admin");

  return (
    <Layout>
      <div className="px-8 py-6">

        <h2 className="text-2xl font-bold text-gray-800 mb-1">My Profile</h2>
        <p className="text-sm text-gray-400 mb-6">View and update your personal information</p>

        {saved && (
          <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-6 text-sm font-semibold">
            <CheckCircle size={16} /> Profile updated! Your new email is now your login email.
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden" style={{ maxWidth: "720px" }}>

          {/* Blue header strip */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-6 flex items-center gap-6">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 ring-4 ring-white/30"
              style={{ backgroundColor: bgColor }}
            >
              {initials}
            </div>
            <div>
              <h3 className="text-white text-xl font-bold">{form.name || "Admin"}</h3>
              <p className="text-blue-200 text-sm mt-0.5">{form.email || "No email set"}</p>
              <span className="inline-block mt-2 px-3 py-0.5 bg-white/20 text-white text-xs rounded-full font-semibold">
                Super Admin
              </span>
            </div>
          </div>

          {/* Form body */}
          <div className="px-8 py-7">

            <div className="flex justify-between items-center mb-6">
              <h4 className="text-base font-bold text-gray-700">Personal Information</h4>
              {!editing ? (
                <button onClick={() => setEditing(true)} className="px-5 py-2 bg-blue-700 text-white text-sm rounded-lg hover:bg-blue-800 font-semibold">
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={handleCancel} className="flex items-center gap-1.5 px-4 py-2 border border-gray-300 text-gray-600 text-sm rounded-lg hover:bg-gray-50 font-semibold">
                    <X size={13} /> Cancel
                  </button>
                  <button onClick={handleSave} className="flex items-center gap-1.5 px-4 py-2 bg-blue-700 text-white text-sm rounded-lg hover:bg-blue-800 font-semibold">
                    <Save size={13} /> Save Changes
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-5 mb-6">

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-600 mb-2">
                  <User size={13} className="text-blue-500" /> Full Name
                </label>
                <input value={form.name} onChange={set("name")} disabled={!editing} placeholder="Enter your name"
                  className={`w-full border rounded-lg px-4 py-3 text-sm ${editing ? "border-blue-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100" : "border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"}`} />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-600 mb-2">
                  <Mail size={13} className="text-blue-500" /> Email Address
                  {editing && <span className="text-xs text-orange-500 font-normal">(also updates login email)</span>}
                </label>
                <input type="email" value={form.email} onChange={set("email")} disabled={!editing} placeholder="Enter your email"
                  className={`w-full border rounded-lg px-4 py-3 text-sm ${editing ? "border-blue-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100" : "border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"}`} />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-600 mb-2">
                  <Phone size={13} className="text-blue-500" /> Phone Number
                </label>
                <input value={form.phone} onChange={set("phone")} disabled={!editing} placeholder="+91 00000 00000"
                  className={`w-full border rounded-lg px-4 py-3 text-sm ${editing ? "border-blue-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100" : "border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"}`} />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-600 mb-2">
                  <MapPin size={13} className="text-blue-500" /> Address
                </label>
                <input value={form.address} onChange={set("address")} disabled={!editing} placeholder="Enter your address"
                  className={`w-full border rounded-lg px-4 py-3 text-sm ${editing ? "border-blue-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100" : "border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"}`} />
              </div>

            </div>

            <div className="pt-5 border-t border-gray-100">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Gym Details</h4>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-600 mb-2">
                    <Building size={13} className="text-blue-500" /> Gym Name
                  </label>
                  <input value={form.gym} onChange={set("gym")} disabled={!editing}
                    className={`w-full border rounded-lg px-4 py-3 text-sm ${editing ? "border-blue-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100" : "border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"}`} />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-600 mb-2">
                    <User size={13} className="text-blue-500" /> Role
                  </label>
                  <input value="Super Admin" disabled className="w-full border border-gray-200 bg-gray-50 text-gray-400 rounded-lg px-4 py-3 text-sm cursor-not-allowed" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MyProfile;