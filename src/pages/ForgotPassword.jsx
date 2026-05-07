import React, { useState, useRef, useEffect } from "react";
import { Eye, EyeOff, Mail, ArrowLeft, ShieldCheck, KeyRound } from "lucide-react";
import { useNavigate } from "react-router-dom";

/*
  ╔══════════════════════════════════════════════════════════════╗
  ║  EMAILJS SETUP — do this once before running                 ║
  ║                                                              ║
  ║  1. Go to https://www.emailjs.com  → Sign up (free)         ║
  ║  2. Add an Email Service (Gmail recommended)                 ║
  ║     → Services → Add New Service → Gmail → Connect          ║
  ║  3. Create an Email Template:                                ║
  ║     → Email Templates → Create New Template                  ║
  ║     Template subject: "GymDesk – Your OTP Code"             ║
  ║     Template body:                                           ║
  ║       Hi {{to_name}},                                        ║
  ║       Your OTP for GymDesk password reset: {{otp}}           ║
  ║       This OTP expires in 10 minutes.                        ║
  ║  4. Copy your keys from Account → API Keys                   ║
  ║     and replace the 3 constants below:                       ║
  ╚══════════════════════════════════════════════════════════════╝
*/
const EMAILJS_SERVICE_ID  = "YOUR_SERVICE_ID";   // e.g. "service_abc123"
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";  // e.g. "template_xyz789"
const EMAILJS_PUBLIC_KEY  = "YOUR_PUBLIC_KEY";   // e.g. "aBcDeFgHiJkLmNoP"

// ── Generate 6-digit OTP ──────────────────────────────────────
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// ── Send OTP via EmailJS ──────────────────────────────────────
const sendOTPEmail = async (toEmail, otp) => {
  // Dynamically load EmailJS SDK (no npm install needed)
  if (!window.emailjs) {
    await new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
    window.emailjs.init(EMAILJS_PUBLIC_KEY);
  }

  return window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
    to_email: toEmail,
    to_name:  toEmail.split("@")[0],
    otp:      otp,
  });
};

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1=email, 2=otp, 3=newpw

  // Step 1
  const [email, setEmail]       = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [sending, setSending]   = useState(false);

  // Step 2
  const [otp, setOtp]           = useState(["","","","","",""]);
  const [otpErr, setOtpErr]     = useState("");
  const [resendCd, setResendCd] = useState(0);
  const otpRefs                 = useRef([]);

  // Step 3
  const [newPw, setNewPw]         = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showNew, setShowNew]     = useState(false);
  const [showConf, setShowConf]   = useState(false);
  const [pwErr, setPwErr]         = useState("");
  const [success, setSuccess]     = useState(false);
  const [resetting, setResetting] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (resendCd <= 0) return;
    const t = setTimeout(() => setResendCd(r => r - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCd]);

  // ── Step 1: Send OTP ─────────────────────────────────────
  const handleSendOTP = async () => {
    setEmailErr("");
    if (!email.trim()) { setEmailErr("Please enter your email address."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setEmailErr("Enter a valid email address."); return; }

    setSending(true);
    try {
      const newOTP = generateOTP();
      await sendOTPEmail(email.trim(), newOTP);
      sessionStorage.setItem("reset_otp",   newOTP);
      sessionStorage.setItem("reset_email", email.trim());
      sessionStorage.setItem("reset_exp",   Date.now() + 10 * 60 * 1000); // 10 min expiry
      setResendCd(60);
      setStep(2);
    } catch (err) {
      setEmailErr("Failed to send OTP. Check your EmailJS config or try again.");
      console.error("EmailJS error:", err);
    }
    setSending(false);
  };

  // ── OTP input helpers ────────────────────────────────────
  const handleOtpChange = (i, val) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[i] = val.slice(-1);
    setOtp(next);
    if (val && i < 5) otpRefs.current[i + 1]?.focus();
  };
  const handleOtpKeyDown = (i, e) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus();
  };
  const handleOtpPaste = (e) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (text.length === 6) { setOtp(text.split("")); otpRefs.current[5]?.focus(); }
    e.preventDefault();
  };

  // ── Step 2: Verify OTP ───────────────────────────────────
  const handleVerifyOTP = () => {
    setOtpErr("");
    const entered  = otp.join("");
    const expected = sessionStorage.getItem("reset_otp") || "";
    const expiry   = parseInt(sessionStorage.getItem("reset_exp") || "0");
    if (entered.length < 6)  { setOtpErr("Enter all 6 digits."); return; }
    if (Date.now() > expiry) { setOtpErr("OTP expired. Please request a new one."); return; }
    if (entered !== expected){ setOtpErr("Incorrect OTP. Please try again."); return; }
    setStep(3);
  };

  const handleResend = async () => {
    if (resendCd > 0 || sending) return;
    setSending(true);
    try {
      const newOTP = generateOTP();
      await sendOTPEmail(email, newOTP);
      sessionStorage.setItem("reset_otp", newOTP);
      sessionStorage.setItem("reset_exp", Date.now() + 10 * 60 * 1000);
      setOtp(["","","","","",""]);
      setOtpErr("");
      setResendCd(60);
      otpRefs.current[0]?.focus();
    } catch { setOtpErr("Failed to resend. Try again."); }
    setSending(false);
  };

  // ── Step 3: Reset Password ───────────────────────────────
  const handleReset = async () => {
    setPwErr("");
    if (!newPw)              { setPwErr("Enter a new password."); return; }
    if (newPw.length < 6)   { setPwErr("Password must be at least 6 characters."); return; }
    if (newPw !== confirmPw) { setPwErr("Passwords do not match."); return; }

    setResetting(true);
    await new Promise(r => setTimeout(r, 800));

    // Update localStorage (replace with API call in production)
    const stored = JSON.parse(localStorage.getItem("userData") || "{}");
    stored.password = newPw;
    localStorage.setItem("userData", JSON.stringify(stored));

    sessionStorage.removeItem("reset_otp");
    sessionStorage.removeItem("reset_email");
    sessionStorage.removeItem("reset_exp");

    setSuccess(true);
    setResetting(false);
    setTimeout(() => navigate("/"), 2500);
  };

  // ── shared styles ────────────────────────────────────────
  const panelStyle = {
    position:"absolute", top:0, left:0, bottom:0,
    width:"400px",
    display:"flex", flexDirection:"column", justifyContent:"center",
    padding:"0 44px", boxSizing:"border-box",
  };

  const inputStyle = {
    width:"100%", height:46,
    padding:"0 14px",
    background:"rgba(255,255,255,0.93)",
    border:"1.5px solid rgba(255,255,255,0.5)",
    borderRadius:8, fontSize:14, color:"#111",
    outline:"none", boxSizing:"border-box",
    fontFamily:"inherit",
  };

  const btnStyle = {
    width:"100%", height:46,
    background:"#2563eb", border:"none", borderRadius:8,
    color:"#fff", fontSize:14, fontWeight:700,
    cursor:"pointer", fontFamily:"inherit",
    display:"flex", alignItems:"center", justifyContent:"center", gap:8,
    transition:"background 0.15s",
  };

  const floatLabel = {
    position:"absolute", top:-9, left:10,
    background:"rgba(235,235,235,0.97)",
    padding:"0 5px", fontSize:"10px", fontWeight:800,
    color:"#444", borderRadius:3, zIndex:1,
    letterSpacing:"0.07em", textTransform:"uppercase",
  };

  const errBox = (msg) => msg ? (
    <div style={{ padding:"9px 13px", background:"rgba(220,38,38,0.15)", border:"1px solid rgba(220,38,38,0.4)", borderRadius:7, color:"#fca5a5", fontSize:12.5, marginBottom:10 }}>
      {msg}
    </div>
  ) : null;

  const iconBox = (Icon) => (
    <div style={{ width:50, height:50, borderRadius:14, background:"rgba(37,99,235,0.25)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:18 }}>
      <Icon size={22} color="#60a5fa" />
    </div>
  );

  return (
    <div style={{ position:"fixed", inset:0, fontFamily:"'Segoe UI', system-ui, sans-serif", overflow:"hidden" }}>

      {/* Background */}
      <img src="/gym.jpg" alt="gym" style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", objectPosition:"center right" }} />
      <div style={{ position:"absolute", inset:0, background:"rgba(8,10,18,0.55)" }} />
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(to right, rgba(8,10,20,0.97) 0%, rgba(8,10,20,0.75) 40%, transparent 68%)" }} />

      <div style={panelStyle}>

        {/* Logo */}
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:36 }}>
          <div style={{ width:32, height:32, background:"#2563eb", borderRadius:7, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26C17.81 13.47 19 11.38 19 9c0-3.87-3.13-7-7-7z" fill="white"/>
              <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1z" fill="white"/>
            </svg>
          </div>
          <span style={{ color:"#fff", fontWeight:700, fontSize:19 }}>GymDesk</span>
        </div>

        {/* ── STEP 1: Email ──────────────────────────── */}
        {step === 1 && (
          <div>
            {iconBox(Mail)}
            <h2 style={{ color:"#fff", fontSize:24, fontWeight:700, margin:"0 0 8px" }}>Forgot Password?</h2>
            <p style={{ color:"rgba(255,255,255,0.5)", fontSize:13, margin:"0 0 24px", lineHeight:1.6 }}>
              Enter your registered email. We'll send a 6‑digit OTP to verify your identity.
            </p>

            {/* reserved error space */}
            <div style={{ minHeight:40, marginBottom:6 }}>{errBox(emailErr)}</div>

            <div style={{ position:"relative", marginBottom:14 }}>
              <span style={floatLabel}>Email Address</span>
              <input
                type="email" value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSendOTP()}
                placeholder="admin@gmail.com"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor="#2563eb"}
                onBlur={e  => e.target.style.borderColor="rgba(255,255,255,0.5)"}
              />
            </div>

            <button
              onClick={handleSendOTP} disabled={sending}
              style={{ ...btnStyle, opacity:sending?0.7:1, cursor:sending?"not-allowed":"pointer", marginBottom:14 }}
              onMouseEnter={e => { if(!sending) e.currentTarget.style.background="#1d4ed8"; }}
              onMouseLeave={e => e.currentTarget.style.background="#2563eb"}
            >
              {sending ? (
                <>
                  <svg style={{ animation:"spin 1s linear infinite" }} width="15" height="15" viewBox="0 0 24 24" fill="none">
                    <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
                    <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeOpacity="0.3"/>
                    <path d="M4 12a8 8 0 018-8" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                  </svg>
                  Sending OTP...
                </>
              ) : "Send OTP"}
            </button>

            <p style={{ textAlign:"center", fontSize:12.5, color:"rgba(255,255,255,0.45)" }}>
              Remember your password?{" "}
              <span onClick={() => navigate("/")} style={{ color:"#60a5fa", fontWeight:600, cursor:"pointer" }}>Login</span>
            </p>
          </div>
        )}

        {/* ── STEP 2: OTP ───────────────────────────── */}
        {step === 2 && (
          <div>
            <button onClick={() => setStep(1)} style={{ display:"flex", alignItems:"center", gap:6, background:"none", border:"none", color:"rgba(255,255,255,0.5)", fontSize:13, cursor:"pointer", marginBottom:20, padding:0 }}>
              <ArrowLeft size={14}/> Back
            </button>

            {iconBox(ShieldCheck)}
            <h2 style={{ color:"#fff", fontSize:24, fontWeight:700, margin:"0 0 6px" }}>Check Your Email</h2>
            <p style={{ color:"rgba(255,255,255,0.5)", fontSize:13, margin:"0 0 4px" }}>We sent a 6‑digit OTP to</p>
            <p style={{ color:"#60a5fa", fontSize:13, fontWeight:700, margin:"0 0 22px" }}>{email}</p>

            {/* reserved error space */}
            <div style={{ minHeight:40, marginBottom:8 }}>{errBox(otpErr)}</div>

            {/* ── 6 OTP boxes ─────────────────────── */}
            <div style={{ display:"flex", gap:8, marginBottom:18 }} onPaste={handleOtpPaste}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={el => otpRefs.current[i] = el}
                  type="text" inputMode="numeric" maxLength={1}
                  value={digit}
                  onChange={e => handleOtpChange(i, e.target.value)}
                  onKeyDown={e => handleOtpKeyDown(i, e)}
                  style={{
                    width:48, height:54, flexShrink:0,
                    textAlign:"center", fontSize:22, fontWeight:800,
                    background: digit ? "rgba(255,255,255,0.97)" : "rgba(255,255,255,0.1)",
                    border: digit ? "2px solid #2563eb" : "1.5px solid rgba(255,255,255,0.2)",
                    borderRadius:10, color: digit ? "#111" : "#fff",
                    outline:"none", fontFamily:"monospace",
                    transition:"all 0.15s", cursor:"text",
                  }}
                  onFocus={e => { e.target.style.border="2px solid #60a5fa"; e.target.style.boxShadow="0 0 0 3px rgba(96,165,250,0.2)"; }}
                  onBlur={e  => { e.target.style.boxShadow="none"; e.target.style.border = digit ? "2px solid #2563eb" : "1.5px solid rgba(255,255,255,0.2)"; }}
                />
              ))}
            </div>

            <button
              onClick={handleVerifyOTP}
              style={{ ...btnStyle, marginBottom:14 }}
              onMouseEnter={e => e.currentTarget.style.background="#1d4ed8"}
              onMouseLeave={e => e.currentTarget.style.background="#2563eb"}
            >
              Verify OTP
            </button>

            <p style={{ textAlign:"center", fontSize:12.5, color:"rgba(255,255,255,0.45)" }}>
              Didn't receive it?{" "}
              <span
                onClick={handleResend}
                style={{ color: resendCd > 0 ? "rgba(96,165,250,0.35)" : "#60a5fa", fontWeight:600, cursor: resendCd > 0 ? "default" : "pointer" }}
              >
                {resendCd > 0 ? `Resend in ${resendCd}s` : sending ? "Sending..." : "Resend OTP"}
              </span>
            </p>
          </div>
        )}

        {/* ── STEP 3: New Password ───────────────── */}
        {step === 3 && (
          <div>
            {iconBox(KeyRound)}
            <h2 style={{ color:"#fff", fontSize:24, fontWeight:700, margin:"0 0 8px" }}>
              {success ? "Password Reset!" : "Set New Password"}
            </h2>
            <p style={{ color:"rgba(255,255,255,0.5)", fontSize:13, margin:"0 0 22px", lineHeight:1.6 }}>
              {success ? "Redirecting to login..." : "Choose a strong password (min. 6 characters)."}
            </p>

            {success ? (
              <div style={{ padding:"16px 18px", background:"rgba(16,185,129,0.15)", border:"1px solid rgba(16,185,129,0.4)", borderRadius:10, color:"#6ee7b7", fontSize:14, fontWeight:700, textAlign:"center" }}>
                ✓ Password updated successfully!
              </div>
            ) : (
              <>
                <div style={{ minHeight:40, marginBottom:6 }}>{errBox(pwErr)}</div>

                {/* New password */}
                <div style={{ position:"relative", marginBottom:14 }}>
                  <span style={floatLabel}>New Password</span>
                  <input
                    type={showNew?"text":"password"} value={newPw}
                    onChange={e => setNewPw(e.target.value)}
                    placeholder="Min. 6 characters"
                    style={{ ...inputStyle, paddingRight:42 }}
                    onFocus={e => e.target.style.borderColor="#2563eb"}
                    onBlur={e  => e.target.style.borderColor="rgba(255,255,255,0.5)"}
                  />
                  <button type="button" onClick={() => setShowNew(v=>!v)} style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"#666", display:"flex", padding:0 }}>
                    {showNew ? <EyeOff size={15}/> : <Eye size={15}/>}
                  </button>
                </div>

                {/* Confirm password */}
                <div style={{ position:"relative", marginBottom:6 }}>
                  <span style={floatLabel}>Confirm Password</span>
                  <input
                    type={showConf?"text":"password"} value={confirmPw}
                    onChange={e => setConfirmPw(e.target.value)}
                    onKeyDown={e => e.key==="Enter" && handleReset()}
                    placeholder="Re-enter password"
                    style={{ ...inputStyle, paddingRight:42 }}
                    onFocus={e => e.target.style.borderColor="#2563eb"}
                    onBlur={e  => e.target.style.borderColor="rgba(255,255,255,0.5)"}
                  />
                  <button type="button" onClick={() => setShowConf(v=>!v)} style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"#666", display:"flex", padding:0 }}>
                    {showConf ? <EyeOff size={15}/> : <Eye size={15}/>}
                  </button>
                </div>

                {/* Match indicator — fixed height */}
                <div style={{ minHeight:22, marginBottom:14 }}>
                  {confirmPw && (
                    <p style={{ fontSize:12, color: newPw===confirmPw ? "#6ee7b7" : "#fca5a5", margin:0 }}>
                      {newPw===confirmPw ? "✓ Passwords match" : "✗ Passwords do not match"}
                    </p>
                  )}
                </div>

                <button
                  onClick={handleReset} disabled={resetting}
                  style={{ ...btnStyle, opacity:resetting?0.7:1, cursor:resetting?"not-allowed":"pointer", marginBottom:14 }}
                  onMouseEnter={e => { if(!resetting) e.currentTarget.style.background="#1d4ed8"; }}
                  onMouseLeave={e => e.currentTarget.style.background="#2563eb"}
                >
                  {resetting ? "Updating..." : "Reset Password"}
                </button>

                <p style={{ textAlign:"center", fontSize:12.5, color:"rgba(255,255,255,0.45)" }}>
                  Remember it now?{" "}
                  <span onClick={() => navigate("/")} style={{ color:"#60a5fa", fontWeight:600, cursor:"pointer" }}>Login</span>
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;