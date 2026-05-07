import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Download } from "lucide-react";

const BASE_URL = "http://localhost:8081/api";
const NAVY  = "#1e3a6e";
const NAVY2 = "#3b5998";
const LIGHT = "#c8d4e8";

// ── Reusable Components ───────────────────────────────────────

const StatBox = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="text-xl font-bold text-gray-800">{value ?? "--"}</span>
    <span className="text-sm text-gray-500">{label}</span>
  </div>
);

const BarGraph = ({ title, data }) => (
  <div className="bg-white rounded-xl p-5 flex-1">
    <p className="text-sm font-semibold text-gray-700 mb-4">{title}</p>
    {data.length > 0 ? (
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} barSize={20}>
          <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip />
          <Bar dataKey="value" fill={NAVY} radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    ) : (
      <div className="h-44 flex items-center justify-center text-gray-200 text-sm">No data</div>
    )}
  </div>
);

const DonutChart = ({ percent, label, sublabel }) => (
  <div className="flex items-center gap-5">
    <div className="relative w-28 h-28">
      <PieChart width={112} height={112}>
        <Pie
          data={[{ value: percent || 0 }, { value: 100 - (percent || 0) }]}
          cx={52} cy={52} innerRadius={34} outerRadius={52}
          startAngle={90} endAngle={-270} dataKey="value" strokeWidth={0}
        >
          <Cell fill={NAVY} />
          <Cell fill={LIGHT} />
        </Pie>
      </PieChart>
      <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-gray-800">
        {percent ?? "--"}%
      </span>
    </div>
    <div>
      <p className="text-sm font-semibold text-gray-700">{percent ?? "--"}%</p>
      <p className="text-sm text-gray-500">{label}</p>
      {sublabel && <p className="text-sm text-gray-500">{sublabel}</p>}
    </div>
  </div>
);

const PieDonut = ({ slices }) => (
  <div className="flex items-center gap-6">
    <PieChart width={160} height={160}>
      <Pie
        data={slices} cx={76} cy={76} innerRadius={42} outerRadius={76}
        startAngle={90} endAngle={-270} dataKey="value" strokeWidth={1} stroke="#fff"
      >
        {slices.map((s, i) => <Cell key={i} fill={s.color} />)}
      </Pie>
      <text x={77} y={72} textAnchor="middle" dominantBaseline="middle"
        fontSize={14} fontWeight="bold" fill="#1e3a6e">
        {slices[0]?.value ?? "--"}%
      </text>
      <text x={77} y={90} textAnchor="middle" dominantBaseline="middle"
        fontSize={12} fill="#666">
        {slices[1] ? `${slices[1].value}%` : ""}
      </text>
    </PieChart>
    <div className="flex flex-col gap-2">
      {slices.map((s, i) => (
        <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
          <span className="w-3 h-3 rounded-full inline-block" style={{ background: s.color }} />
          {s.label} &nbsp; {s.value}%
        </div>
      ))}
    </div>
  </div>
);

const BarList = ({ items }) => (
  <div className="flex flex-col gap-3 w-full">
    {items.map((item, i) => (
      <div key={i} className="flex items-center gap-3 text-sm text-gray-600">
        <span className="w-28 shrink-0">{item.label}</span>
        <div className="flex-1 bg-gray-100 rounded-full h-2.5">
          <div
            className="h-2.5 rounded-full"
            style={{ width: `${item.pct}%`, background: item.pct > 30 ? NAVY : item.pct > 15 ? NAVY2 : LIGHT }}
          />
        </div>
        <span className="w-10 text-right font-medium">{item.pct}%</span>
      </div>
    ))}
  </div>
);

const ReportCard = ({ icon, title, stats, onView }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div className="flex items-center gap-2">
        <span className="text-xl">{icon}</span>
        <span className="font-semibold text-gray-800 text-sm">{title}</span>
      </div>
      <div className="flex gap-0.5 items-end">
        {[3, 4, 5, 4, 3].map((h, i) => (
          <div key={i} className="w-2 rounded-sm" style={{ height: h * 5, background: NAVY, opacity: 0.5 + i * 0.1 }} />
        ))}
      </div>
    </div>
    {stats.length > 0 ? (
      stats.map((s, i) => (
        <p key={i} className="text-sm text-gray-500 mb-1">
          <span className="font-semibold text-gray-800">{s.value ?? "--"}</span> {s.label}
        </p>
      ))
    ) : (
      <p className="text-sm text-gray-300 mb-1">No data available</p>
    )}
    <button
      onClick={onView}
      className="mt-5 w-full bg-blue-700 text-white text-sm py-2.5 rounded-lg hover:bg-blue-800 transition-colors font-medium"
    >
      View Report
    </button>
  </div>
);

// ── Report Detail View ────────────────────────────────────────
const ReportView = ({ title, icon, topLeft, donut, barTitle, barData, bottomLeft, bottomRight }) => (
  <div className="bg-gray-100 rounded-2xl p-6">
    <div className="flex items-center gap-3 mb-6">
      <span className="text-2xl">{icon}</span>
      <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
    </div>

    <div className="grid grid-cols-2 gap-5 mb-5">
      <div className="bg-white rounded-xl p-5">
        <div className="flex gap-10 mb-5">
          {topLeft.map((s, i) => <StatBox key={i} value={s.value} label={s.label} />)}
        </div>
        <DonutChart percent={donut.percent} label={donut.label} sublabel={donut.sublabel} />
      </div>
      <BarGraph title={barTitle} data={barData} />
    </div>

    <div className="grid grid-cols-2 gap-5 mb-7">
      <div className="bg-white rounded-xl p-5">
        <p className="text-sm font-semibold text-gray-700 mb-4">{bottomLeft.title}</p>
        {bottomLeft.slices.length > 0
          ? <PieDonut slices={bottomLeft.slices} />
          : <p className="text-sm text-gray-300">No data</p>
        }
      </div>
      <div className="bg-white rounded-xl p-5">
        <p className="text-sm font-semibold text-gray-700 mb-4">{bottomRight.title}</p>
        {bottomRight.items.length > 0
          ? <BarList items={bottomRight.items} />
          : <p className="text-sm text-gray-300">No data</p>
        }
      </div>
    </div>

    <div className="flex justify-center">
      <button className="flex items-center gap-2 bg-blue-700 text-white px-8 py-2.5 rounded-lg text-sm hover:bg-blue-800 font-medium">
        <Download size={15} /> Download Report
      </button>
    </div>
  </div>
);

const reportCards = [
  { key: "target",       icon: "🎯", title: "Target Report"       },
  { key: "client",       icon: "👥", title: "Client Report"       },
  { key: "subscription", icon: "🖥", title: "Subscription Report" },
  { key: "financial",    icon: "🏦", title: "Financial Report"    },
  { key: "attendance",   icon: "✅", title: "Attendance Report"   },
  { key: "enquiry",      icon: "📋", title: "Enquiry Report"      },
];

// ── Build card stats from summary data ────────────────────────
const buildCardStats = (summary) => ({
  target: [
    { value: summary.totalCustomers,  label: "Total Customers" },
    { value: summary.activeCustomers, label: "Active Members"  },
  ],
  client: [
    { value: summary.totalCustomers, label: "Total Clients"  },
    { value: summary.totalTrainers,  label: "Total Trainers" },
  ],
  subscription: [
    { value: summary.activeCustomers, label: "Active Subscriptions" },
    { value: summary.totalCustomers,  label: "Total Members"        },
  ],
  financial: [
    { value: summary.paidCustomers,   label: "Paid Customers"   },
    { value: summary.pendingPayments, label: "Pending Payments" },
  ],
  attendance: [
    { value: summary.presentToday,    label: "Present Today"    },
    { value: summary.totalAttendance, label: "Total Records"    },
  ],
  enquiry: [
    { value: summary.totalCustomers, label: "Total Enquiries" },
  ],
});

// ── Build report detail config from summary ───────────────────
const buildReportConfig = (key, summary) => {
  const total = summary.totalCustomers || 1;
  const activePercent = Math.round((summary.activeCustomers / total) * 100) || 0;
  const paidPercent   = Math.round((summary.paidCustomers   / total) * 100) || 0;

  const configs = {
    target: {
      topLeft: [
        { value: summary.totalCustomers,  label: "Total Members" },
        { value: summary.activeCustomers, label: "Active"        },
      ],
      donut: { percent: activePercent, label: "Active Members", sublabel: "of total" },
      barTitle: "Monthly Growth",
      barData: [],
      bottomLeft: {
        title: "Member Status",
        slices: [
          { label: "Active",  value: activePercent,       color: NAVY  },
          { label: "Expired", value: 100 - activePercent, color: LIGHT },
        ],
      },
      bottomRight: {
        title: "Membership Plans",
        items: [
          { label: "Gold",    pct: 40 },
          { label: "Premium", pct: 35 },
          { label: "Basic",   pct: 25 },
        ],
      },
    },
    financial: {
      topLeft: [
        { value: summary.paidCustomers,   label: "Paid"    },
        { value: summary.pendingPayments, label: "Pending" },
      ],
      donut: { percent: paidPercent, label: "Payment Rate", sublabel: "of members" },
      barTitle: "Payment Collection",
      barData: [],
      bottomLeft: {
        title: "Payment Status",
        slices: [
          { label: "Paid",    value: paidPercent,       color: NAVY  },
          { label: "Pending", value: 100 - paidPercent, color: LIGHT },
        ],
      },
      bottomRight: {
        title: "Payment Modes",
        items: [
          { label: "Online", pct: 50 },
          { label: "Cash",   pct: 30 },
          { label: "Card",   pct: 20 },
        ],
      },
    },
    attendance: {
      topLeft: [
        { value: summary.presentToday,    label: "Present Today" },
        { value: summary.totalAttendance, label: "Total Records" },
      ],
      donut: { percent: summary.presentToday ?? 0, label: "Present Today", sublabel: "" },
      barTitle: "Attendance Trend",
      barData: [],
      bottomLeft: {
        title: "Attendance Status",
        slices: [
          { label: "Present", value: 70, color: NAVY  },
          { label: "Absent",  value: 30, color: LIGHT },
        ],
      },
      bottomRight: {
        title: "By Day",
        items: [
          { label: "Monday",    pct: 80 },
          { label: "Tuesday",   pct: 70 },
          { label: "Wednesday", pct: 75 },
          { label: "Thursday",  pct: 65 },
          { label: "Friday",    pct: 60 },
        ],
      },
    },
  };

  return configs[key] ?? {
    topLeft:     [{ value: summary.totalCustomers, label: "Total Members" }],
    donut:       { percent: activePercent, label: "Active Rate", sublabel: "" },
    barTitle:    "Monthly Data",
    barData:     [],
    bottomLeft:  { title: "Distribution", slices: [] },
    bottomRight: { title: "Breakdown",    items:  [] },
  };
};

// ── Main Export ───────────────────────────────────────────────
const Report = () => {
  const [active, setActive]     = useState(null);
  const [summary, setSummary]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    fetch(`${BASE_URL}/reports/summary`)
      .then(r => r.json())
      .then(data => { setSummary(data); setLoading(false); })
      .catch(() => { setError("Cannot connect to backend."); setLoading(false); });
  }, []);

  const cardStats = summary ? buildCardStats(summary) : {};

  if (active && summary) {
    const cfg  = buildReportConfig(active, summary);
    const card = reportCards.find(c => c.key === active);
    return (
      <Layout>
        <div className="p-6">
          <button
            onClick={() => setActive(null)}
            className="text-sm text-gray-500 hover:text-gray-800 mb-5 flex items-center gap-2 font-medium"
          >
            ← Back to Reports
          </button>
          <ReportView
            title={card.title} icon={card.icon}
            topLeft={cfg.topLeft} donut={cfg.donut}
            barTitle={cfg.barTitle} barData={cfg.barData}
            bottomLeft={cfg.bottomLeft} bottomRight={cfg.bottomRight}
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-gray-800">Reports</h2>
        <p className="text-sm text-gray-400 mb-7">Here is the summary of overall data</p>

        {error && (
          <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
            ⚠️ {error} Make sure Spring Boot is running on port 8081.
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="h-4 bg-gray-100 rounded animate-pulse w-32 mb-4" />
                <div className="h-3 bg-gray-100 rounded animate-pulse w-24 mb-2" />
                <div className="h-3 bg-gray-100 rounded animate-pulse w-20 mb-6" />
                <div className="h-9 bg-gray-100 rounded animate-pulse w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-6">
            {reportCards.map(c => (
              <ReportCard
                key={c.key}
                icon={c.icon}
                title={c.title}
                stats={cardStats[c.key] ?? []}
                onView={() => setActive(c.key)}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Report;