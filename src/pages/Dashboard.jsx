import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { Search, SlidersHorizontal, Eye, TrendingUp, TrendingDown } from "lucide-react";

// ── Customer Overview Card (popup) ────────────────────────────
const OverviewCard = ({ customer, onClose }) => (
  <div className="fixed inset-0 bg-black/20 z-50 flex items-center justify-center" onClick={onClose}>
    <div className="bg-white rounded-2xl p-5 w-64 shadow-xl" onClick={e => e.stopPropagation()}>
      <p className="text-sm font-semibold text-gray-700 mb-3">Customer overview</p>
      <div className="flex items-center gap-3 mb-4">
        <img src={customer.avatar} alt={customer.name}
          className="w-14 h-14 rounded-full object-cover ring-2 ring-gray-100" />
        <div>
          <p className="text-xs text-gray-400">Name</p>
          <p className="text-sm font-semibold text-blue-600">{customer.name}</p>
        </div>
      </div>
      <div className="flex flex-col gap-2 text-xs text-gray-600">
        {[
          ["Mobile No",     customer.mobile],
          ["Email",         customer.email],
          ["Work-Schedule", customer.schedule],
          ["Trainer name",  customer.trainer],
        ].map(([label, val]) => (
          <div key={label} className="flex justify-between">
            <span className="text-gray-400 w-28">{label}</span>
            <span className="font-medium text-gray-700">{val}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ── Dashboard ─────────────────────────────────────────────────
const Dashboard = () => {
  const navigate = useNavigate();
  const [search, setSearch]       = useState("");
  const [selected, setSelected]   = useState(null);
  const [statsData, setStatsData] = useState([]);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user !== "loggedIn") navigate("/");
  }, [navigate]);

  // ── TODO: Uncomment & connect your backend API ────────────
  // useEffect(() => {
  //   fetch("/api/dashboard/stats").then(r => r.json()).then(setStatsData);
  //   fetch("/api/dashboard/customers").then(r => r.json()).then(setCustomers);
  // }, []);

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      {/* Title */}
      <h2 className="text-xl font-semibold">Dashboard</h2>
      <p className="text-xs text-gray-400 mb-5">Here is the summary of overall data</p>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {statsData.length > 0 ? (
          statsData.map((s, i) => (
            <div key={i} className="bg-white rounded-xl p-4 shadow-sm flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-base">{s.icon}</span>
                <span className="text-xs text-gray-500">{s.label}</span>
              </div>
              <div className="flex items-end justify-between">
                <span className="text-xl font-bold text-gray-800">{s.value}</span>
                <span className={`flex items-center gap-0.5 text-xs font-medium ${s.up ? "text-green-500" : "text-red-400"}`}>
                  {s.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {s.trend}
                </span>
              </div>
            </div>
          ))
        ) : (
          // Skeleton placeholders — maintain layout until backend data arrives
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-4 shadow-sm flex flex-col gap-3">
              <div className="h-3 w-24 bg-gray-100 rounded" />
              <div className="h-6 w-16 bg-gray-100 rounded" />
            </div>
          ))
        )}
      </div>

      <hr className="border-gray-200 mb-6" />

      {/* Customer Overview Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-semibold text-gray-800">Customer overview</h3>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              placeholder="Search here"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-8 pr-4 py-2 text-sm border border-gray-200 rounded-lg w-48 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
            <SlidersHorizontal size={15} className="text-gray-500" />
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
              <th className="px-4 py-3 font-medium">Check-in</th>
              <th className="px-4 py-3 font-medium">Check-out</th>
              <th className="px-4 py-3 font-medium">Work-Schedule</th>
              <th className="px-4 py-3 font-medium">Trainer name</th>
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
                  <td className="px-4 py-3 text-gray-600">{c.checkIn}</td>
                  <td className="px-4 py-3 text-gray-600">{c.checkOut}</td>
                  <td className="px-4 py-3 text-gray-600">{c.schedule}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-gray-700">
                      <span className="text-xs">🚶</span>
                      <span className="text-blue-600 text-xs underline cursor-pointer">{c.trainer}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setSelected(c)}
                      className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700"
                    >
                      <Eye size={13} className="text-white" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-gray-300 text-sm">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Overview Popup */}
      {selected && <OverviewCard customer={selected} onClose={() => setSelected(null)} />}
    </Layout>
  );
};

export default Dashboard;