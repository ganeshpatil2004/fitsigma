import React, { useState } from "react";
import Layout from "../components/Layout";
import { User, MoreVertical } from "lucide-react";

const History = () => {
  const [search, setSearch]   = useState("");
  const [history, setHistory] = useState([]);

  const handleGet = () => {
    // TODO: Fetch customer history from backend API
    // fetch(`/api/history?query=${encodeURIComponent(search)}`)
    //   .then(r => r.json())
    //   .then(setHistory);
  };

  return (
    <Layout>
      <h2 className="text-xl font-semibold mb-6">Customer History</h2>

      {/* Search Bar */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
            <User size={14} /> Customer Name (ID)
          </label>
          <input
            placeholder="Enter Customer Name (ID)"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleGet()}
            className="w-72 border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <button
          onClick={handleGet}
          className="px-5 py-2 bg-blue-700 text-white rounded-lg text-sm hover:bg-blue-800"
        >
          Get Details
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 text-xs border-b border-gray-100">
              <th className="px-4 py-3 font-medium">Customer Name</th>
              <th className="px-4 py-3 font-medium">Duration</th>
              <th className="px-4 py-3 font-medium">Start Date</th>
              <th className="px-4 py-3 font-medium">End Date</th>
              <th className="px-4 py-3 font-medium">Membership Plan</th>
              <th className="px-4 py-3 font-medium">Membership Status</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {history.length > 0 ? (
              history.map((h, i) => (
                <tr key={i} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <img src={h.avatar} alt={h.name} className="w-7 h-7 rounded-full object-cover" />
                      <span className="font-medium text-gray-800">{h.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{h.duration}</td>
                  <td className="px-4 py-3 text-gray-600">{h.startDate}</td>
                  <td className="px-4 py-3 text-gray-600">{h.endDate}</td>
                  <td className="px-4 py-3 text-gray-600">{h.plan}</td>
                  <td className="px-4 py-3 text-gray-600">{h.status}</td>
                  <td className="px-4 py-3 text-gray-700 font-medium">{h.amount}</td>
                  <td className="px-4 py-3">
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-gray-300 text-sm">
                  Search a customer to view their history
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="flex justify-end pr-1 pb-1">
          <div className="w-1 h-16 bg-blue-600 rounded-full" />
        </div>
      </div>
    </Layout>
  );
};

export default History;