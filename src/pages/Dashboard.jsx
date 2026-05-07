import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { Search, SlidersHorizontal, Eye, TrendingUp, TrendingDown, Users, UserCog, CreditCard, CalendarCheck } from "lucide-react";
import { api } from "../api/api";

// ── Customer Overview Card (popup) ────────────────────────────
const OverviewCard = ({ customer, onClose }) => (
  <div className="fixed inset-0 bg-black/20 z-50 flex items-center justify-center" onClick={onClose}>
    <div className="bg-white rounded-2xl p-8 w-96 shadow-xl" onClick={e => e.stopPropagation()}>
      <p className="text-lg font-semibold text-gray-700 mb-5">Customer overview</p>

      {/* Avatar with initials */}
      <div className="flex items-center gap-5 mb-6">
        <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-2xl flex-shrink-0">
          {(customer.fullName || "?")[0].toUpperCase()}
        </div>
        <div>
          <p className="text-sm text-gray-400 mb-0.5">Name</p>
          <p className="text-base font-semibold text-blue-600">{customer.fullName}</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 text-sm text-gray-600">
        {[
          ["Customer ID",      customer.customerId   || "—"],
          ["Mobile No",        customer.mobile       || "—"],
          ["Email",            customer.email        || "—"],
          ["Membership Plan",  customer.membershipPlan || "—"],
          ["Membership Status",customer.membershipStatus || "—"],
          ["Payment Status",   customer.paymentStatus || "—"],
        ].map(([label, val]) => (
          <div key={label} className="flex justify-between">
            <span className="text-gray-400 w-40">{label}</span>
            <span className="font-medium text-gray-700">{val}</span>
          </div>
        ))}
      </div>

      <button
        onClick={onClose}
        className="mt-6 w-full py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700"
      >
        Close
      </button>
    </div>
  </div>
);

// ── Dashboard ─────────────────────────────────────────────────
const Dashboard = () => {
  const navigate = useNavigate();
  const [search, setSearch]       = useState("");
  const [selected, setSelected]   = useState(null);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user !== "loggedIn") navigate("/");
  }, [navigate]);

  // Fetch customers from Spring Boot backend
  useEffect(() => {
    api.getCustomers()
      .then(data => {
        setCustomers(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setError("Cannot connect to backend. Make sure Spring Boot is running on port 8080.");
        setLoading(false);
      });
  }, []);

  // ── Compute stats from real customer data ─────────────────
  const totalCustomers  = customers.length;
  const activeMembers   = customers.filter(c => c.membershipStatus === "Active").length;
  const paidCustomers   = customers.filter(c => c.paymentStatus === "Paid").length;
  const pendingPayments = customers.filter(c => c.paymentStatus === "Pending").length;
  const expiredMembers  = customers.filter(c => c.membershipStatus === "Expired").length;
  const goldMembers     = customers.filter(c => c.membershipPlan === "Gold").length;
  const premiumMembers  = customers.filter(c => c.membershipPlan === "Premium").length;
  const basicMembers    = customers.filter(c => c.membershipPlan === "Basic").length;

  const statsData = [
    { icon: <Users size={18} className="text-blue-500" />,    label: "Total Customers",   value: totalCustomers,  trend: "All time",  up: true  },
    { icon: <CalendarCheck size={18} className="text-green-500" />, label: "Active Members", value: activeMembers, trend: "Active now", up: true  },
    { icon: <CreditCard size={18} className="text-purple-500" />,   label: "Paid Customers", value: paidCustomers, trend: "Paid",      up: true  },
    { icon: <UserCog size={18} className="text-orange-500" />, label: "Pending Payments",  value: pendingPayments, trend: "Pending",  up: false },
    { icon: <Users size={18} className="text-red-400" />,      label: "Expired Members",   value: expiredMembers,  trend: "Expired",  up: false },
    { icon: <Users size={18} className="text-yellow-500" />,   label: "Gold Members",      value: goldMembers,     trend: "Gold plan", up: true  },
    { icon: <Users size={18} className="text-indigo-500" />,   label: "Premium Members",   value: premiumMembers,  trend: "Premium",  up: true  },
    { icon: <Users size={18} className="text-gray-500" />,     label: "Basic Members",     value: basicMembers,    trend: "Basic plan",up: true  },
  ];

  const filtered = customers.filter(c =>
    (c.fullName || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div className="px-8 py-6">

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
        <p className="text-sm text-gray-400 mb-7">Here is the summary of overall data</p>

        {/* Error Banner */}
        {error && (
          <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
            ⚠️ {error}
          </div>
        )}

        {/* Stats Grid — 4 columns, 2 rows */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {loading ? (
            // Skeleton placeholders
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-2xl p-5 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white animate-pulse" />
                  <div className="h-3.5 w-24 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="h-7 w-16 bg-gray-200 rounded animate-pulse" />
              </div>
            ))
          ) : (
            statsData.map((s, i) => (
              <div key={i} className="bg-gray-100 rounded-2xl p-5 flex flex-col gap-3">
                {/* Icon + Label row */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-sm">
                    {s.icon}
                  </div>
                  <span className="text-sm text-gray-500 font-medium">{s.label}</span>
                </div>
                {/* Value + Trend row */}
                <div className="flex items-end justify-between mt-1">
                  <span className="text-2xl font-bold text-gray-800">{s.value}</span>
                  <span className={`flex items-center gap-0.5 text-xs font-semibold ${s.up ? "text-green-500" : "text-red-400"}`}>
                    {s.up ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                    {s.trend}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        <hr className="border-gray-200 mb-7" />

        {/* Customer Overview Header */}
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-xl font-bold text-gray-800">Customer overview</h3>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                placeholder="Search here"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-10 pr-5 py-2.5 text-sm border border-gray-200 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <button className="p-2.5 border border-gray-200 rounded-lg hover:bg-gray-50">
              <SlidersHorizontal size={17} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl overflow-hidden border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-gray-200">
                <th className="px-5 py-4 text-sm font-bold text-gray-700">Customer Name</th>
                <th className="px-5 py-4 text-sm font-bold text-gray-700">Customer ID</th>
                <th className="px-5 py-4 text-sm font-bold text-gray-700">Mobile No</th>
                <th className="px-5 py-4 text-sm font-bold text-gray-700">Membership Plan</th>
                <th className="px-5 py-4 text-sm font-bold text-gray-700">Membership Status</th>
                <th className="px-5 py-4 text-sm font-bold text-gray-700">Payment</th>
                <th className="px-5 py-4"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-t border-gray-100">
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-4 bg-gray-100 rounded animate-pulse w-24" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length > 0 ? (
                filtered.map((c, i) => (
                  <tr key={c.id || i} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                    {/* Name with initials avatar */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm flex-shrink-0">
                          {(c.fullName || "?")[0].toUpperCase()}
                        </div>
                        <span className="font-semibold text-gray-800 text-sm">{c.fullName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500 font-medium">{c.customerId || "—"}</td>
                    <td className="px-5 py-4 text-sm text-gray-600">{c.mobile || "—"}</td>
                    <td className="px-5 py-4 text-sm text-gray-600">{c.membershipPlan || "—"}</td>
                    <td className="px-5 py-4">
                      <span className={`px-3 py-1 text-xs rounded font-medium ${
                        c.membershipStatus === "Active"  ? "bg-green-100 text-green-600" :
                        c.membershipStatus === "Expired" ? "bg-red-100 text-red-500" :
                        "bg-yellow-100 text-yellow-600"
                      }`}>
                        {c.membershipStatus || "Pending"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-3 py-1 text-xs rounded font-medium border ${
                        c.paymentStatus === "Paid"
                          ? "border-green-400 text-green-600 bg-green-50"
                          : "border-orange-400 text-orange-500 bg-orange-50"
                      }`}>
                        {c.paymentStatus || "Pending"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => setSelected(c)}
                        className="w-9 h-9 bg-blue-700 rounded-xl flex items-center justify-center hover:bg-blue-800 transition-colors"
                      >
                        <Eye size={16} className="text-white" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center text-gray-300 text-base font-medium">
                    {customers.length === 0
                      ? "No customers yet — add one from the Customer page"
                      : "No customers match your search"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Overview Popup */}
      {selected && <OverviewCard customer={selected} onClose={() => setSelected(null)} />}
    </Layout>
  );
};

export default Dashboard;