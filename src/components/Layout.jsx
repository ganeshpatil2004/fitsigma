import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { Bell, ChevronDown, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Layout = ({ children }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">

      <Sidebar />

      {/* Right Side */}
      <div className="ml-40 flex flex-col flex-1 min-h-screen">

        {/* Header */}
        <div className="bg-white px-4 py-2.5 flex justify-between items-center border-b border-gray-200 sticky top-0 z-40">

          <div className="relative">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              placeholder="Search here"
              className="pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg w-52 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="flex items-center gap-2">
            <button className="p-1.5 rounded-full hover:bg-gray-100 transition">
              <Bell size={16} className="text-gray-600" />
            </button>

            <div className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-1.5 hover:bg-gray-100 px-2 py-1 rounded-lg transition"
              >
                <img
                  src="https://i.pravatar.cc/32"
                  alt="Admin"
                  className="w-6 h-6 rounded-full object-cover"
                />
                <span className="text-xs font-medium text-gray-700">Admin</span>
                <ChevronDown size={12} className="text-gray-500" />
              </button>

              {open && (
                <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-100 rounded-lg shadow-lg z-50">
                  <button
                    onClick={logout}
                    className="w-full text-left px-3 py-2 text-xs text-red-500 hover:bg-gray-50 rounded-lg"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-4 overflow-y-auto flex-1">
          {children}
        </div>

      </div>
    </div>
  );
};

export default Layout;