import React, { useState } from "react";
import Layout from "../components/Layout";
import { Bell, Lock, Shield, Eye, EyeOff, CheckCircle, Save, Sliders } from "lucide-react";

// ── Toggle switch ─────────────────────────────────────────────
const Toggle = ({ checked, onChange }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={`w-11 h-6 rounded-full transition-colors duration-200 relative flex-shrink-0 focus:outline-none ${
      checked ? "bg-blue-600" : "bg-gray-200"
    }`}
  >
    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${checked ? "translate-x-5" : "translate-x-0.5"}`} />
  </button>
);

const Section = ({ title, subtitle, icon: Icon, children }) => (
  <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-5">
    <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3 bg-gray-50">
      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
        <Icon size={15} className="text-blue-600" />
      </div>
      <div>
        <p className="text-sm font-bold text-gray-800">{title}</p>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
    </div>
    <div className="px-6 py-2">{children}</div>
  </div>
);

const Row = ({ label, desc, children }) => (
  <div className="flex items-center justify-between py-3.5 border-b border-gray-50 last:border-0">
    <div className="pr-4">
      <p className="text-sm font-semibold text-gray-700">{label}</p>
      {desc && <p className="text-xs text-gray-400 mt-0.5">{desc}</p>}
    </div>
    {children}
  </div>
);

// ── Shared credential helpers (same defaults as Login) ────────
const DEFAULT_CREDS = { email: "admin@gmail.com", password: "1234" };
const loadCreds     = () => { try { return JSON.parse(localStorage.getItem("adminCredentials")) || DEFAULT_CREDS; } catch { return DEFAULT_CREDS; } };
const saveCreds     = (data) => localStorage.setItem("adminCredentials", JSON.stringify(data));

// ── Settings persistence ──────────────────────────────────────
const SETTINGS_KEY    = "gymdesk_settings";
const loadSettings    = () => { try { return JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {}; } catch { return {}; } };
const persistSettings = (data) => localStorage.setItem(SETTINGS_KEY, JSON.stringify(data));

const Settings = () => {
  const persisted = loadSettings();

  const [notif, setNotif] = useState({
    newMember: true, payment: true, expiry: true,
    attendance: false, enquiry: true, emailDigest: false,
    ...(persisted.notif || {}),
  });

  const [privacy, setPrivacy] = useState({
    showEmail: true, showPhone: false, twoFactor: false,
    ...(persisted.privacy || {}),
  });

  const [prefs, setPrefs] = useState({
    compactView: false, language: "English",
    timezone: "Asia/Kolkata", currency: "INR",
    ...(persisted.prefs || {}),
  });

  const [pwForm, setPwForm]   = useState({ current: "", newPw: "", confirm: "" });
  const [showPw, setShowPw]   = useState({ current: false, newPw: false, confirm: false });
  const [pwError, setPwError] = useState("");
  const [pwDone,  setPwDone]  = useState(false);
  const [saved,   setSaved]   = useState(false);

  const toggleN = (k) => setNotif(p  => ({ ...p, [k]: !p[k] }));
  const toggleP = (k) => setPrivacy(p => ({ ...p, [k]: !p[k] }));
  const toggleR = (k) => setPrefs(p  => ({ ...p, [k]: !p[k] }));

  const handleSaveAll = () => {
    persistSettings({ notif, privacy, prefs });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  // ── KEY FIX: verifies current pw, saves new pw to adminCredentials ──
  const handleChangePw = () => {
    setPwError("");

    if (!pwForm.current)                { setPwError("Enter your current password.");    return; }
    if (pwForm.newPw.length < 6)        { setPwError("New password min. 6 characters."); return; }
    if (pwForm.newPw !== pwForm.confirm) { setPwError("Passwords do not match.");         return; }

    const creds = loadCreds();

    // Verify current password is correct
    if (pwForm.current !== creds.password) {
      setPwError("Current password is incorrect.");
      return;
    }

    // Save new password — Login will now use this
    saveCreds({ ...creds, password: pwForm.newPw });

    setPwForm({ current: "", newPw: "", confirm: "" });
    setPwDone(true);
    setTimeout(() => setPwDone(false), 3000);
  };

  const PwField = ({ field, placeholder }) => (
    <div className="relative">
      <input
        type={showPw[field] ? "text" : "password"}
        placeholder={placeholder}
        value={pwForm[field]}
        onChange={e => setPwForm(p => ({ ...p, [field]: e.target.value }))}
        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm bg-gray-50 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
      />
      <button
        type="button"
        onClick={() => setShowPw(p => ({ ...p, [field]: !p[field] }))}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
      >
        {showPw[field] ? <EyeOff size={14} /> : <Eye size={14} />}
      </button>
    </div>
  );

  return (
    <Layout>
      <div className="px-8 py-6" style={{ maxWidth: "720px" }}>

        <h2 className="text-2xl font-bold text-gray-800 mb-1">Settings</h2>
        <p className="text-sm text-gray-400 mb-6">Manage your account preferences and security</p>

        {saved && (
          <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-5 text-sm font-semibold">
            <CheckCircle size={15} /> Settings saved successfully!
          </div>
        )}

        {/* Notifications */}
        <Section title="Notifications" subtitle="Choose what alerts you receive" icon={Bell}>
          <Row label="New Member Joined"    desc="Alert when a new customer signs up"><Toggle checked={notif.newMember}   onChange={() => toggleN("newMember")} /></Row>
          <Row label="Payment Received"     desc="Alert on every successful payment"><Toggle checked={notif.payment}     onChange={() => toggleN("payment")} /></Row>
          <Row label="Membership Expiry"    desc="Remind 7 days before membership expires"><Toggle checked={notif.expiry}      onChange={() => toggleN("expiry")} /></Row>
          <Row label="Attendance Alerts"    desc="Daily attendance summary email"><Toggle checked={notif.attendance}  onChange={() => toggleN("attendance")} /></Row>
          <Row label="Enquiry Received"     desc="New gym enquiry submitted by visitor"><Toggle checked={notif.enquiry}     onChange={() => toggleN("enquiry")} /></Row>
          <Row label="Weekly Email Digest"  desc="Summary report every Monday morning"><Toggle checked={notif.emailDigest} onChange={() => toggleN("emailDigest")} /></Row>
        </Section>

        {/* Change Password */}
        <Section title="Change Password" subtitle="Update your login credentials securely" icon={Lock}>
          {pwDone && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-3 py-2.5 rounded-lg my-3 text-sm font-semibold">
              <CheckCircle size={14} /> Password changed! Use new password next login.
            </div>
          )}
          {pwError && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2.5 rounded-lg my-3 text-sm font-medium">
              {pwError}
            </div>
          )}
          <div className="flex flex-col gap-3 py-3">
            <PwField field="current" placeholder="Current password" />
            <PwField field="newPw"   placeholder="New password (min. 6 characters)" />
            <PwField field="confirm" placeholder="Confirm new password" />
            <button
              onClick={handleChangePw}
              className="self-start mt-1 px-6 py-2.5 bg-blue-700 text-white text-sm rounded-lg hover:bg-blue-800 font-semibold"
            >
              Update Password
            </button>
          </div>
        </Section>

        {/* Privacy & Security */}
        <Section title="Privacy & Security" subtitle="Control visibility and account access" icon={Shield}>
          <Row label="Show Email to Staff"       desc="Staff members can view your email"><Toggle checked={privacy.showEmail}  onChange={() => toggleP("showEmail")} /></Row>
          <Row label="Show Phone to Staff"       desc="Staff members can view your phone"><Toggle checked={privacy.showPhone}  onChange={() => toggleP("showPhone")} /></Row>
          <Row label="Two-Factor Authentication" desc="Extra security code required on login"><Toggle checked={privacy.twoFactor}  onChange={() => toggleP("twoFactor")} /></Row>
        </Section>

        {/* Preferences */}
        <Section title="Preferences" subtitle="Personalise your dashboard experience" icon={Sliders}>
          <Row label="Compact View" desc="Reduce spacing in tables and lists">
            <Toggle checked={prefs.compactView} onChange={() => toggleR("compactView")} />
          </Row>
          <Row label="Language">
            <select value={prefs.language} onChange={e => setPrefs(p => ({ ...p, language: e.target.value }))} className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-100 min-w-[130px]">
              {["English","Hindi","Marathi","Kannada","Tamil"].map(l => <option key={l}>{l}</option>)}
            </select>
          </Row>
          <Row label="Timezone">
            <select value={prefs.timezone} onChange={e => setPrefs(p => ({ ...p, timezone: e.target.value }))} className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-100 min-w-[160px]">
              {["Asia/Kolkata","Asia/Dubai","Europe/London","America/New_York"].map(t => <option key={t}>{t}</option>)}
            </select>
          </Row>
          <Row label="Currency">
            <select value={prefs.currency} onChange={e => setPrefs(p => ({ ...p, currency: e.target.value }))} className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-100 min-w-[100px]">
              {["INR","USD","EUR","GBP","AED"].map(c => <option key={c}>{c}</option>)}
            </select>
          </Row>
        </Section>

        <div className="flex justify-end pb-8">
          <button onClick={handleSaveAll} className="flex items-center gap-2 px-8 py-3 bg-blue-700 text-white rounded-xl text-sm hover:bg-blue-800 font-bold shadow-sm">
            <Save size={15} /> Save All Settings
          </button>
        </div>

      </div>
    </Layout>
  );
};

export default Settings;