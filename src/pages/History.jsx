import React, { useState } from "react";
import Layout from "../components/Layout";
import { User, MoreVertical, Search } from "lucide-react";
import { api } from "../api/api";

const History = () => {
  const [search, setSearch]     = useState("");
  const [history, setHistory]   = useState([]);
  const [loading, setLoading]   = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError]       = useState(null);

  const handleGet = async () => {
    if (!search.trim()) {
      alert("Please enter a customer name to search.");
      return;
    }
    setLoading(true);
    setError(null);
    setSearched(true);
    try {
      const data = await api.getHistory(search);
      const customers = Array.isArray(data.customers) ? data.customers : [];
      const payments  = Array.isArray(data.payments)  ? data.payments  : [];

      const rows = customers.map(c => {
        const payment = payments.find(p =>
          p.fullName?.toLowerCase() === c.fullName?.toLowerCase()
        );
        return {
          id:          c.id,
          customerId:  c.customerId,
          fullName:    c.fullName,
          plan:        c.membershipPlan   || "—",
          status:      c.membershipStatus || "—",
          startDate:   c.joiningDate      || null,
          amount:      payment?.totalAmount   ?? null,
          paymentMode: payment?.modeOfPayment || "—",
        };
      });

      payments.forEach(p => {
        const exists = rows.some(r =>
          r.fullName?.toLowerCase() === p.fullName?.toLowerCase()
        );
        if (!exists) {
          rows.push({
            id:          p.id,
            customerId:  "—",
            fullName:    p.fullName,
            plan:        "—",
            status:      p.status || "—",
            startDate:   p.paymentDate || null,
            amount:      p.totalAmount ?? null,
            paymentMode: p.modeOfPayment || "—",
          });
        }
      });

      setHistory(rows);
    } catch (err) {
      setError("Cannot connect to backend. Make sure Spring Boot is running on port 8081.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit", month: "short", year: "numeric"
    });
  };

  return (
    <Layout>
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-7">Customer History</h2>

        <div className="flex items-end justify-between mb-7">
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <User size={15} /> Customer Name (ID)
            </label>
            <input
              placeholder="Enter Customer Name (ID)"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleGet()}
              className="w-80 border border-gray-200 rounded-lg px-4 py-3 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <button
            onClick={handleGet}
            disabled={loading}
            className="px-7 py-3 bg-blue-700 text-white rounded-lg text-sm hover:bg-blue-800 font-medium disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Searching...
              </>
            ) : (
              <><Search size={15} /> Get Details</>
            )}
          </button>
        </div>

        {error && (
          <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
            ⚠️ {error}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 text-xs bg-gray-50 border-b border-gray-100">
                <th className="px-5 py-4 font-semibold">Customer Name</th>
                <th className="px-5 py-4 font-semibold">Customer ID</th>
                <th className="px-5 py-4 font-semibold">Joining Date</th>
                <th className="px-5 py-4 font-semibold">Membership Plan</th>
                <th className="px-5 py-4 font-semibold">Membership Status</th>
                <th className="px-5 py-4 font-semibold">Amount Paid (₹)</th>
                <th className="px-5 py-4 font-semibold">Payment Mode</th>
                <th className="px-5 py-4"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="border-t border-gray-50">
                    {Array.from({ length: 8 }).map((_, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-4 bg-gray-100 rounded animate-pulse w-20" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : history.length > 0 ? (
                history.map((h, i) => (
                  <tr key={h.id || i} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm flex-shrink-0">
                          {(h.fullName || "?")[0].toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-800">{h.fullName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-500">{h.customerId || "—"}</td>
                    <td className="px-5 py-4 text-gray-600">{formatDate(h.startDate)}</td>
                    <td className="px-5 py-4 text-gray-600">{h.plan}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 text-xs rounded-full font-medium ${
                        h.status === "Active"
                          ? "bg-green-100 text-green-600"
                          : h.status === "Expired"
                            ? "bg-red-100 text-red-500"
                            : "bg-yellow-100 text-yellow-600"
                      }`}>
                        {h.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-700 font-semibold">
                      {h.amount != null ? `₹${h.amount.toLocaleString()}` : "—"}
                    </td>
                    <td className="px-5 py-4 text-gray-600">{h.paymentMode}</td>
                    <td className="px-5 py-4">
                      <button className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100">
                        <MoreVertical size={17} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-5 py-16 text-center text-gray-300 text-base">
                    {searched
                      ? `No history found for "${search}"`
                      : "Search a customer name to view their history"
                    }
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default History;