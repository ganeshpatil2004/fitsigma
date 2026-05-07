import React, { useState, useRef, useEffect } from "react";
import Sidebar, { SIDEBAR_WIDTH } from "./Sidebar";
import {
  Bell, ChevronDown, Search, User,
  Settings, LogOut, Shield, Phone, Mail,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// ── colour from name ──────────────────────────────────────────
const avatarColor = (name = "") => {
  const palette = ["#2563eb","#7c3aed","#db2777","#059669","#d97706","#dc2626","#0891b2","#65a30d"];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return palette[Math.abs(h) % palette.length];
};

// ── Initials Avatar ───────────────────────────────────────────
const Avatar = ({ name, size = "sm" }) => {
  const initials = name.split(" ").filter(Boolean).map(w => w[0].toUpperCase()).join("").slice(0, 2);
  const dim = size === "lg" ? "w-14 h-14 text-lg" : "w-9 h-9 text-sm";
  return (
    <div
      className={`${dim} rounded-full flex items-center justify-center font-bold text-white flex-shrink-0`}
      style={{ backgroundColor: avatarColor(name) }}
    >
      {initials}
    </div>
  );
};

// ── KEY FIX: read from "profileData" — same key MyProfile saves to ──
const loadProfile = () => {
  try { return JSON.parse(localStorage.getItem("profileData")) || {}; }
  catch { return {}; }
};

const Layout = ({ children }) => {
  const [open, setOpen]           = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  // ── Re-read profile every time dropdown opens so header stays fresh ──
  const [profile, setProfile]     = useState(loadProfile);
  const dropdownRef               = useRef(null);
  const notifRef                  = useRef(null);
  const navigate                  = useNavigate();

  const name  = (profile.name  || "Admin").trim();
  const email = (profile.email || "").trim();
  const phone = (profile.phone || "+91 98765 43210").trim();
  const gym   = (profile.gym   || "GymDesk Fitness Center").trim();
  const role  = "Super Admin";

  // ── Refresh profile from storage whenever dropdown opens ─────
  const handleToggleDropdown = () => {
    if (!open) setProfile(loadProfile()); // re-read latest saved profile
    setOpen(v => !v);
  };

  const logout = () => {
    localStorage.removeItem("user"); // only remove auth key, keep profileData
    navigate("/");
  };

  const goTo = (path) => {
    setOpen(false);
    navigate(path);
  };

  // Close on outside click
  useEffect(() => {
    const fn = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false);
      if (notifRef.current   && !notifRef.current.contains(e.target))     setShowNotif(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex flex-col flex-1 min-h-screen" style={{ marginLeft: `${SIDEBAR_WIDTH}px` }}>

        {/* ── Header ───────────────────────────────────── */}
        <div className="bg-[#0f172a] px-8 py-3 flex justify-between items-center sticky top-0 z-40">

          {/* Search */}
          <div className="relative">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              placeholder="Search here"
              className="pl-10 pr-5 py-2.5 text-sm rounded-full w-72 bg-white/10 text-gray-200 placeholder-gray-400 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-4">

            {/* ── Bell ─────────────────────────────────── */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setShowNotif(v => !v)}
                className="relative p-2 rounded-full hover:bg-white/10 transition"
              >
                <Bell size={21} className="text-gray-300" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              </button>

              {showNotif && (
                <div className="absolute right-0 mt-3 w-72 bg-white rounded-xl shadow-2xl z-50 overflow-hidden border border-gray-100">
                  <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                    <p className="text-sm font-bold text-gray-800">Notifications</p>
                    <span className="text-xs text-blue-600 cursor-pointer hover:underline">Mark all read</span>
                  </div>
                  <div className="px-4 py-10 text-center text-sm text-gray-300">
                    No new notifications
                  </div>
                </div>
              )}
            </div>

            {/* ── Profile ──────────────────────────────── */}
            <div className="relative" ref={dropdownRef}>

              <button
                onClick={handleToggleDropdown}
                className="flex items-center gap-2.5 hover:bg-white/10 px-3 py-1.5 rounded-xl transition"
              >
                <Avatar name={name} size="sm" />
                <div className="text-left hidden sm:block">
                  <p className="text-sm font-semibold text-white leading-tight">{name}</p>
                  <p className="text-xs text-gray-400 leading-tight">{role}</p>
                </div>
                <ChevronDown
                  size={14}
                  className={`text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                />
              </button>

              {/* ── Dropdown ─────────────────────────── */}
              {open && (
                <div className="absolute right-0 mt-3 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden border border-gray-100" style={{ width: "288px" }}>

                  {/* Gradient header */}
                  <div className="bg-gradient-to-br from-blue-600 to-blue-800 px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={name} size="lg" />
                      <div className="overflow-hidden flex-1">
                        <p className="text-white font-bold text-base leading-tight truncate">{name}</p>
                        <p className="text-blue-200 text-xs mt-0.5 truncate">{email || "No email set"}</p>
                        <span className="inline-block mt-1.5 px-2.5 py-0.5 bg-white/25 text-white text-xs rounded-full font-semibold">
                          {role}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Account details */}
                  <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                      Account Details
                    </p>
                    <div className="flex flex-col gap-2.5">
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <Shield size={13} className="text-blue-600" />
                        </div>
                        <span className="truncate">{gym}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <Phone size={13} className="text-blue-600" />
                        </div>
                        <span>{phone}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <Mail size={13} className="text-blue-600" />
                        </div>
                        <span className="truncate">{email || "Not provided"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Menu items */}
                  <div className="py-1">
                    <button
                      onClick={() => goTo("/profile")}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
                        <User size={13} className="text-gray-500 group-hover:text-blue-600" />
                      </div>
                      <span className="font-medium">My Profile</span>
                    </button>
                    <button
                      onClick={() => goTo("/settings")}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
                        <Settings size={13} className="text-gray-500 group-hover:text-blue-600" />
                      </div>
                      <span className="font-medium">Settings</span>
                    </button>
                  </div>

                  {/* Logout */}
                  <div className="border-t border-gray-100 py-1">
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors font-semibold"
                    >
                      <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center">
                        <LogOut size={13} className="text-red-500" />
                      </div>
                      Logout
                    </button>
                  </div>

                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Page Content ─────────────────────────────── */}
        <div className="overflow-y-auto flex-1">
          {children}
        </div>

      </div>
    </div>
  );
};

export default Layout;