import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Download } from "lucide-react";

const NAVY  = "#1e3a6e";
const NAVY2 = "#3b5998";
const LIGHT = "#c8d4e8";

// ── Reusable Components ───────────────────────────────────────

const StatBox = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="text-lg font-bold text-gray-800">{value}</span>
    <span className="text-xs text-gray-500">{label}</span>
  </div>
);

const BarGraph = ({ title, data }) => (
  <div className="bg-white rounded-xl p-4 flex-1">
    <p className="text-sm font-medium text-gray-700 mb-3">{title}</p>
    {data.length > 0 ? (
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={data} barSize={18}>
          <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip />
          <Bar dataKey="value" fill={NAVY} radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    ) : (
      <div className="h-40 flex items-center justify-center text-gray-200 text-sm">No data</div>
    )}
  </div>
);

const DonutChart = ({ percent, label, sublabel }) => (
  <div className="flex items-center gap-4">
    <div className="relative w-24 h-24">
      <PieChart width={96} height={96}>
        <Pie
          data={[{ value: percent || 0 }, { value: 100 - (percent || 0) }]}
          cx={44} cy={44} innerRadius={30} outerRadius={44}
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
      <p className="text-xs text-gray-500">{label}</p>
      {sublabel && <p className="text-xs text-gray-500">{sublabel}</p>}
    </div>
  </div>
);

const PieDonut = ({ slices }) => (
  <div className="flex items-center gap-6">
    <PieChart width={140} height={140}>
      <Pie
        data={slices} cx={66} cy={66} innerRadius={36} outerRadius={66}
        startAngle={90} endAngle={-270} dataKey="value" strokeWidth={1} stroke="#fff"
      >
        {slices.map((s, i) => <Cell key={i} fill={s.color} />)}
      </Pie>
      <text x={67} y={62} textAnchor="middle" dominantBaseline="middle"
        fontSize={13} fontWeight="bold" fill="#1e3a6e">
        {slices[0]?.value ?? "--"}%
      </text>
      <text x={67} y={78} textAnchor="middle" dominantBaseline="middle"
        fontSize={11} fill="#666">
        {slices[1] ? `${slices[1].value}%` : ""}
      </text>
    </PieChart>
    <div className="flex flex-col gap-1">
      {slices.map((s, i) => (
        <div key={i} className="flex items-center gap-2 text-xs text-gray-600">
          <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: s.color }} />
          {s.label} &nbsp; {s.value}%
        </div>
      ))}
    </div>
  </div>
);

const BarList = ({ items }) => (
  <div className="flex flex-col gap-2 w-full">
    {items.map((item, i) => (
      <div key={i} className="flex items-center gap-2 text-xs text-gray-600">
        <span className="w-24 shrink-0">{item.label}</span>
        <div className="flex-1 bg-gray-100 rounded-full h-2">
          <div
            className="h-2 rounded-full"
            style={{ width: `${item.pct}%`, background: item.pct > 30 ? NAVY : item.pct > 15 ? NAVY2 : LIGHT }}
          />
        </div>
        <span className="w-8 text-right">{item.pct}%</span>
      </div>
    ))}
  </div>
);

const ReportCard = ({ icon, title, stats, onView }) => (
  <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-3">
      <div className="flex items-center gap-2">
        <span className="text-lg">{icon}</span>
        <span className="font-medium text-gray-800 text-sm">{title}</span>
      </div>
      <div className="flex gap-0.5">
        {[3, 4, 5, 4, 3].map((h, i) => (
          <div key={i} className="w-1.5 rounded-sm" style={{ height: h * 4, background: NAVY, opacity: 0.5 + i * 0.1 }} />
        ))}
      </div>
    </div>
    {stats.length > 0 ? (
      stats.map((s, i) => (
        <p key={i} className="text-xs text-gray-500 mb-0.5">
          <span className="font-semibold text-gray-800">{s.value ?? "--"}</span> {s.label}
        </p>
      ))
    ) : (
      <p className="text-xs text-gray-300 mb-0.5">No data available</p>
    )}
    <button
      onClick={onView}
      className="mt-4 w-full bg-blue-700 text-white text-xs py-2 rounded-lg hover:bg-blue-800 transition-colors"
    >
      View Report
    </button>
  </div>
);

// ── Report Detail View ────────────────────────────────────────
const ReportView = ({ title, icon, topLeft, donut, barTitle, barData, bottomLeft, bottomRight }) => (
  <div className="bg-gray-100 rounded-2xl p-6">
    <div className="flex items-center gap-2 mb-5">
      <span className="text-xl">{icon}</span>
      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
    </div>

    <div className="grid grid-cols-2 gap-4 mb-4">
      {/* Top Left: stats + donut */}
      <div className="bg-white rounded-xl p-4">
        <div className="flex gap-8 mb-4">
          {topLeft.map((s, i) => <StatBox key={i} value={s.value ?? "--"} label={s.label} />)}
        </div>
        <DonutChart percent={donut.percent} label={donut.label} sublabel={donut.sublabel} />
      </div>
      {/* Top Right: bar chart */}
      <BarGraph title={barTitle} data={barData} />
    </div>

    <div className="grid grid-cols-2 gap-4 mb-6">
      {/* Bottom Left: pie donut */}
      <div className="bg-white rounded-xl p-4">
        <p className="text-sm font-medium text-gray-700 mb-3">{bottomLeft.title}</p>
        {bottomLeft.slices.length > 0
          ? <PieDonut slices={bottomLeft.slices} />
          : <p className="text-xs text-gray-300">No data</p>
        }
      </div>
      {/* Bottom Right: bar list */}
      <div className="bg-white rounded-xl p-4">
        <p className="text-sm font-medium text-gray-700 mb-3">{bottomRight.title}</p>
        {bottomRight.items.length > 0
          ? <BarList items={bottomRight.items} />
          : <p className="text-xs text-gray-300">No data</p>
        }
      </div>
    </div>

    <div className="flex justify-center">
      <button className="flex items-center gap-2 bg-blue-700 text-white px-6 py-2 rounded-lg text-sm hover:bg-blue-800">
        <Download size={14} /> Download Report
      </button>
    </div>
  </div>
);

// ── Empty report config template (structure only, no values) ──
const emptyReportConfig = {
  topLeft:     [],
  donut:       { percent: null, label: "", sublabel: "" },
  barTitle:    "",
  barData:     [],
  bottomLeft:  { title: "", slices: [] },
  bottomRight: { title: "", items:  [] },
};

// ── Report card definitions (labels only, no stat values) ─────
const reportCards = [
  { key: "target",       icon: "🎯", title: "Target Report"       },
  { key: "client",       icon: "👥", title: "Client Report"       },
  { key: "subscription", icon: "🖥", title: "Subscription Report" },
  { key: "financial",    icon: "🏦", title: "Financial Report"    },
  { key: "attendance",   icon: "✅", title: "Attendance Report"   },
  { key: "enquiry",      icon: "📋", title: "Enquiry Report"      },
];

// ── Main Export ───────────────────────────────────────────────
const Report = () => {
  const [active, setActive]           = useState(null); // null = list view
  const [cardStats, setCardStats]     = useState({});   // { target: [...], client: [...], ... }
  const [reportData, setReportData]   = useState(null); // full data for active report

  // ── TODO: Fetch card summary stats for the list view ─────
  // useEffect(() => {
  //   fetch("/api/reports/summary").then(r => r.json()).then(setCardStats);
  // }, []);

  // ── TODO: Fetch full report data when a report is opened ──
  // useEffect(() => {
  //   if (!active) return;
  //   fetch(`/api/reports/${active}`).then(r => r.json()).then(setReportData);
  // }, [active]);

  if (active) {
    const cfg = reportData ?? emptyReportConfig;
    const card = reportCards.find(c => c.key === active);
    return (
      <Layout>
        <button
          onClick={() => { setActive(null); setReportData(null); }}
          className="text-sm text-gray-500 hover:text-gray-800 mb-4 flex items-center gap-1"
        >
          ← Back to Reports
        </button>
        <ReportView
          title={card.title}
          icon={card.icon}
          topLeft={cfg.topLeft}
          donut={cfg.donut}
          barTitle={cfg.barTitle}
          barData={cfg.barData}
          bottomLeft={cfg.bottomLeft}
          bottomRight={cfg.bottomRight}
        />
      </Layout>
    );
  }

  return (
    <Layout>
      <h2 className="text-xl font-semibold">Reports</h2>
      <p className="text-sm text-gray-400 mb-6">Here is the summary of overall data</p>

      <div className="grid grid-cols-3 gap-5">
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
    </Layout>
  );
};

export default Report;