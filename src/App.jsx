import { useState, useEffect, useRef } from "react";

// ─── INITIAL DATA STORE ───────────────────────────────────────────────────────
const INITIAL_USERS = [
  { id: "ADM-SUPER", password: "admin2024!", role: "administrator", name: "Administrator Khalid Rana", age: 48, sex: "Male", doj: "2010-01-01", dept: "Administration" },
  { id: "DR-001", password: "dr001pass", role: "doctor", name: "Dr. Ahmed Khan", age: 45, sex: "Male", doj: "2018-03-15", dept: "General Medicine", specialization: "Internal Medicine" },
  { id: "DR-002", password: "dr002pass", role: "doctor", name: "Dr. Sara Malik", age: 38, sex: "Female", doj: "2020-06-01", dept: "Cardiology", specialization: "Cardiology" },
  { id: "HO-001", password: "ho001pass", role: "house_officer", name: "HO Bilal Chaudhry", age: 26, sex: "Male", doj: "2024-01-15", dept: "General Medicine", ward: "Panel" },
  { id: "HO-002", password: "ho002pass", role: "house_officer", name: "HO Nadia Farooq", age: 25, sex: "Female", doj: "2024-02-01", dept: "Cardiology", ward: "Private" },
  { id: "NRS-001", password: "nrs001pass", role: "nurse", name: "Nurse Fatima Iqbal", age: 30, sex: "Female", doj: "2021-01-10", dept: "General Ward", shift: "Morning" },
  { id: "NRS-002", password: "nrs002pass", role: "nurse", name: "Nurse Ayesha Bano", age: 27, sex: "Female", doj: "2022-04-20", dept: "ICU", shift: "Night" },
  { id: "ADM-001", password: "adm001pass", role: "admission_officer", name: "Tariq Mehmood", age: 35, sex: "Male", doj: "2019-08-05", dept: "Admissions" },
  { id: "MTR-001", password: "mtr001pass", role: "matron", name: "Matron Zainab Hussain", age: 50, sex: "Female", doj: "2010-02-28", dept: "Nursing Administration" },
  { id: "PHR-001", password: "phr001pass", role: "pharmacy", name: "Pharmacist Khalid khan", age: 40, sex: "Male", doj: "2017-11-12", dept: "Pharmacy" },
];

const INITIAL_PATIENTS = [
  { admissionNo: "IPD-2024-001", name: "Muhammad Raza", age: 55, sex: "Male", doa: "2024-06-01", time: "09:30", ward: "Panel", doctor: "DR-001", admittedBy: "ADM-001", diagnosis: "", prescriptions: [], nurseRequests: [], matronApprovals: [], dispensed: [], administered: [], discharged: false, dischargeInfo: null },
  { admissionNo: "IPD-2024-002", name: "Zara Sheikh", age: 34, sex: "Female", doa: "2024-06-02", time: "14:00", ward: "Private", doctor: "DR-002", admittedBy: "ADM-001", diagnosis: "", prescriptions: [], nurseRequests: [], matronApprovals: [], dispensed: [], administered: [], discharged: false, dischargeInfo: null },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function genAdmNo(patients) {
  const yr = new Date().getFullYear();
  const n = String(patients.length + 1).padStart(3, "0");
  return `IPD-${yr}-${n}`;
}
function now() {
  const d = new Date();
  return { date: d.toISOString().split("T")[0], time: d.toTimeString().slice(0, 5) };
}
function getUserName(users, id) {
  const u = users.find(x => x.id === id);
  return u ? u.name : id;
}

// ─── ICONS ────────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 20 }) => {
  const icons = {
    hospital: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    user: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    lock: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
    logout: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    bed: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 20v-8a2 2 0 012-2h16a2 2 0 012 2v8"/><path d="M2 10V6a2 2 0 012-2h4"/><path d="M22 10V6a2 2 0 00-2-2h-4"/><line x1="2" y1="16" x2="22" y2="16"/></svg>,
    pill: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.5 20H4a2 2 0 01-2-2V6a2 2 0 012-2h3.9a2 2 0 011.69.9l.81 1.2a2 2 0 001.67.9H20a2 2 0 012 2v2"/><circle cx="18" cy="18" r="3"/><path d="M18 15v6"/><path d="M15 18h6"/></svg>,
    check: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>,
    plus: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    stethoscope: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4.8 2.3A.3.3 0 105 2H4a2 2 0 00-2 2v5a6 6 0 006 6v0a6 6 0 006-6V4a2 2 0 00-2-2h-1a.2.2 0 10.3.3"/><path d="M8 15v1a6 6 0 006 6v0a6 6 0 006-6v-4"/><circle cx="20" cy="10" r="2"/></svg>,
    clipboard: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>,
    shield: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    package: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 002 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
    eye: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
    calendar: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    cross: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    alert: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
    settings: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
    trash: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>,
    edit: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    users: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
    activity: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
    door: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 3H3v18h18V10"/><path d="M13 3v7h7"/><circle cx="16" cy="12" r="1"/></svg>,
    refresh: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>,
  };
  return icons[name] || null;
};

// ─── ROLE CONFIG ──────────────────────────────────────────────────────────────
const ROLE_CONFIG = {
  administrator: { label: "Administrator", color: "#dc2626", bg: "#fee2e2", icon: "settings" },
  doctor: { label: "Doctor", color: "#0ea5e9", bg: "#e0f2fe", icon: "stethoscope" },
  house_officer: { label: "House Officer", color: "#6366f1", bg: "#eef2ff", icon: "activity" },
  nurse: { label: "Nurse", color: "#10b981", bg: "#d1fae5", icon: "clipboard" },
  admission_officer: { label: "Admission Officer", color: "#f59e0b", bg: "#fef3c7", icon: "clipboard" },
  matron: { label: "Matron", color: "#8b5cf6", bg: "#ede9fe", icon: "shield" },
  pharmacy: { label: "Pharmacist", color: "#ef4444", bg: "#fee2e2", icon: "pill" },
};

// ─── TOAST ────────────────────────────────────────────────────────────────────
function Toast({ toasts }) {
  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999, display: "flex", flexDirection: "column", gap: 8 }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          background: t.type === "success" ? "#065f46" : t.type === "error" ? "#7f1d1d" : "#1e3a5f",
          color: "#fff", padding: "12px 20px", borderRadius: 10, fontSize: 14,
          boxShadow: "0 8px 32px rgba(0,0,0,0.3)", display: "flex", alignItems: "center", gap: 10,
          animation: "slideIn 0.3s ease", minWidth: 220
        }}>
          <Icon name={t.type === "success" ? "check" : "alert"} size={16} />
          {t.msg}
        </div>
      ))}
    </div>
  );
}

// ─── CONFIRM MODAL ─────────────────────────────────────────────────────────────
function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 10000, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: 32, maxWidth: 400, width: "90%", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: "#0f172a", marginBottom: 24, lineHeight: 1.5 }}>{message}</div>
        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
          <button onClick={onCancel} style={{ padding: "10px 20px", borderRadius: 8, border: "1.5px solid #e2e8f0", background: "#fff", color: "#475569", fontWeight: 600, cursor: "pointer", fontSize: 14 }}>Cancel</button>
          <button onClick={onConfirm} style={{ padding: "10px 20px", borderRadius: 8, border: "none", background: "linear-gradient(135deg,#ef4444,#dc2626)", color: "#fff", fontWeight: 600, cursor: "pointer", fontSize: 14 }}>Confirm</button>
        </div>
      </div>
    </div>
  );
}

// ─── LOGIN PAGE ───────────────────────────────────────────────────────────────
function LoginPage({ onLogin, users }) {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [particles] = useState(() => Array.from({ length: 18 }, (_, i) => ({
    id: i, x: Math.random() * 100, y: Math.random() * 100,
    size: 2 + Math.random() * 4, delay: Math.random() * 4, dur: 3 + Math.random() * 4,
  })));

  const handleLogin = () => {
    setLoading(true); setError("");
    setTimeout(() => {
      const found = users.find(u => u.id === id.trim() && u.password === pw.trim());
      if (found) { onLogin(found); }
      else { setError("Invalid ID or Password. Please try again."); }
      setLoading(false);
    }, 800);
  };

  const quickLogins = [
    { label: "Admin", id: "ADM-SUPER", pw: "admin2024!" },
    { label: "Doctor", id: "DR-001", pw: "dr001pass" },
    { label: "House Officer", id: "HO-001", pw: "ho001pass" },
    { label: "Nurse", id: "NRS-001", pw: "nrs001pass" },
    { label: "Admission", id: "ADM-001", pw: "adm001pass" },
    { label: "Matron", id: "MTR-001", pw: "mtr001pass" },
    { label: "Pharmacy", id: "PHR-001", pw: "phr001pass" },
  ];

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "linear-gradient(135deg, #0f1b35 0%, #1a2d5a 40%, #0d3b6e 70%, #0a2540 100%)",
      fontFamily: "'Segoe UI', system-ui, sans-serif", position: "relative", overflow: "hidden"
    }}>
      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0) scale(1);opacity:0.4} 50%{transform:translateY(-30px) scale(1.2);opacity:0.8} }
        @keyframes slideIn { from{transform:translateX(40px);opacity:0} to{transform:translateX(0);opacity:1} }
        @keyframes fadeUp { from{transform:translateY(30px);opacity:0} to{transform:translateY(0);opacity:1} }
        @keyframes pulse { 0%,100%{box-shadow:0 0 0 0 rgba(14,165,233,0.4)} 50%{box-shadow:0 0 0 12px rgba(14,165,233,0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        .login-input { background:rgba(255,255,255,0.06)!important; border:1.5px solid rgba(255,255,255,0.12)!important; color:#fff!important; transition:all 0.2s; }
        .login-input:focus { border-color:#0ea5e9!important; background:rgba(14,165,233,0.08)!important; outline:none; box-shadow:0 0 0 3px rgba(14,165,233,0.15)!important; }
        .login-input::placeholder { color:rgba(255,255,255,0.35)!important; }
        .login-btn { background:linear-gradient(135deg,#0ea5e9,#2563eb); border:none; color:#fff; font-weight:700; letter-spacing:1px; cursor:pointer; transition:all 0.2s; }
        .login-btn:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 8px 24px rgba(14,165,233,0.5); }
        .login-btn:disabled { opacity:0.6; cursor:not-allowed; }
        .badge-chip { display:inline-flex; align-items:center; gap:4px; padding:3px 10px; border-radius:20px; font-size:11px; font-weight:600; background:rgba(255,255,255,0.07); color:rgba(255,255,255,0.5); border:1px solid rgba(255,255,255,0.1); margin:2px; }
      `}</style>
      {particles.map(p => (
        <div key={p.id} style={{ position: "absolute", left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, borderRadius: "50%", background: "rgba(14,165,233,0.5)", animation: `float ${p.dur}s ${p.delay}s ease-in-out infinite`, pointerEvents: "none" }} />
      ))}
      <div style={{ position: "absolute", right: "8%", top: "12%", opacity: 0.06, transform: "rotate(15deg)" }}><Icon name="cross" size={200} /></div>
      <div style={{ display: "flex", alignItems: "stretch", gap: 0, maxWidth: 900, width: "95%", boxShadow: "0 32px 80px rgba(0,0,0,0.6)", borderRadius: 24, overflow: "hidden", animation: "fadeUp 0.6s ease" }}>
        <div style={{ flex: 1, background: "linear-gradient(160deg,#0369a1,#1d4ed8)", padding: "52px 40px", display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 36 }}>
              <div style={{ background: "#fff", borderRadius: 14, padding: 10, display: "flex", alignItems: "center", justifyContent: "center", animation: "pulse 2s ease-in-out infinite" }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="#1d4ed8"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              </div>
              <div>
                <div style={{ color: "#fff", fontWeight: 800, fontSize: 22, letterSpacing: 1 }}>HBS</div>
                <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 11, letterSpacing: 2, textTransform: "uppercase" }}>Tertiary Care Teaching Hospital Islamabad</div>
              </div>
            </div>
            <h2 style={{ color: "#fff", fontSize: 26, fontWeight: 700, margin: "0 0 12px", lineHeight: 1.3 }}>Hospital Information Management System</h2>
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 13, lineHeight: 1.7, margin: "0 0 28px" }}>
              A unified platform connecting all hospital departments — from admission to pharmacy — for seamless patient care.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {["Administrator","Doctors","House Officers","Nurses","Matron","Pharmacy","Admissions"].map(r => (
                <span key={r} className="badge-chip">{r}</span>
              ))}
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.15)", paddingTop: 24, marginTop: 32 }}>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, margin: 0 }}>© 2024 HBS General Hospital · All rights reserved</p>
          </div>
        </div>
        <div style={{ width: 390, background: "rgba(10,18,35,0.95)", backdropFilter: "blur(20px)", padding: "44px 40px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg,#0ea5e9,#2563eb)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
              <Icon name="hospital" size={26} />
            </div>
            <h3 style={{ color: "#fff", margin: "0 0 4px", fontSize: 20, fontWeight: 700 }}>Welcome Back</h3>
            <p style={{ color: "rgba(255,255,255,0.4)", margin: 0, fontSize: 12 }}>Sign in with your employee ID</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 600, display: "block", marginBottom: 7 }}>Employee ID</label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)" }}><Icon name="user" size={16} /></span>
                <input className="login-input" value={id} onChange={e => setId(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} placeholder="e.g. DR-001, HO-001, ADM-SUPER" style={{ width: "100%", padding: "12px 14px 12px 42px", borderRadius: 10, fontSize: 13, boxSizing: "border-box" }} />
              </div>
            </div>
            <div>
              <label style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 600, display: "block", marginBottom: 7 }}>Password</label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)" }}><Icon name="lock" size={16} /></span>
                <input className="login-input" type={showPw ? "text" : "password"} value={pw} onChange={e => setPw(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} placeholder="Enter your password" style={{ width: "100%", padding: "12px 42px 12px 42px", borderRadius: 10, fontSize: 13, boxSizing: "border-box" }} />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", padding: 0 }}><Icon name="eye" size={16} /></button>
              </div>
            </div>
            {error && (<div style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "10px 14px", color: "#fca5a5", fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}><Icon name="alert" size={14} /> {error}</div>)}
            <button type="button" className="login-btn" onClick={handleLogin} disabled={loading} style={{ padding: "13px", borderRadius: 10, fontSize: 14, marginTop: 2 }}>
              {loading ? <span style={{ display: "inline-block", width: 18, height: 18, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /> : "LOGIN"}
            </button>
          </div>
          <div style={{ marginTop: 20, borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 16 }}>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 10, textAlign: "center", margin: "0 0 8px", letterSpacing: 0.5 }}>Quick Login — click any role to fill:</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5, justifyContent: "center" }}>
              {quickLogins.map(q => (
                <button key={q.id} type="button" onClick={() => { setId(q.id); setPw(q.pw); setError(""); }}
                  style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.6)", borderRadius: 20, padding: "3px 10px", fontSize: 10, cursor: "pointer", fontWeight: 600, transition: "all 0.15s" }}
                  onMouseEnter={e => { e.target.style.background = "rgba(255,255,255,0.15)"; e.target.style.color = "#fff"; }}
                  onMouseLeave={e => { e.target.style.background = "rgba(255,255,255,0.07)"; e.target.style.color = "rgba(255,255,255,0.6)"; }}>
                  {q.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP SHELL ───────────────────────────────────────────────────────────
export default function App() {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [user, setUser] = useState(null);
  const [patients, setPatients] = useState(INITIAL_PATIENTS);
  const [activeTab, setActiveTab] = useState("home");
  const [toasts, setToasts] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const toastRef = useRef(0);

  const toast = (msg, type = "success") => {
    const id = ++toastRef.current;
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  };

  const showConfirm = (message, onConfirm) => setConfirm({ message, onConfirm });

  if (!user) return <LoginPage onLogin={setUser} users={users} />;

  const rc = ROLE_CONFIG[user.role];

  const navItems = [
    { key: "home", label: "Home", icon: "hospital" },
    { key: "profile", label: "Profile", icon: "user" },
    { key: "indoor", label: "Indoor (IPD)", icon: "bed" },
    ...(user.role === "administrator" ? [
      { key: "admin_users", label: "Manage Users", icon: "users" },
      { key: "admin_patients", label: "Manage Patients", icon: "activity" },
      { key: "admit", label: "Admit Patient", icon: "plus" },
    ] : []),
    ...(user.role === "admission_officer" ? [
      { key: "admit", label: "Admit Patient", icon: "plus" },
      { key: "discharge_list", label: "Discharge / Re-admit", icon: "door" },
    ] : []),
    ...(user.role === "doctor" ? [
      { key: "prescribe", label: "My Prescriptions", icon: "stethoscope" },
      { key: "discharge_list", label: "Discharge Patient", icon: "door" },
    ] : []),
    ...(user.role === "house_officer" ? [
      { key: "ho_prescribe", label: "Add Medication", icon: "pill" },
      { key: "discharge_list", label: "Discharge Patient", icon: "door" },
    ] : []),
    ...(user.role === "nurse" ? [
      { key: "request_meds", label: "Med Requests", icon: "pill" },
      { key: "receive_meds", label: "Receive Meds", icon: "package" },
      { key: "administer", label: "Administer", icon: "check" },
    ] : []),
    ...(user.role === "matron" ? [{ key: "approvals", label: "Approvals", icon: "shield" }] : []),
    ...(user.role === "pharmacy" ? [{ key: "dispense", label: "Dispense Meds", icon: "package" }] : []),
  ];

  const content = () => {
    switch (activeTab) {
      case "home": return <HomePage user={user} patients={patients} users={users} rc={rc} />;
      case "profile": return <ProfilePage user={user} rc={rc} />;
      case "indoor": return <IndoorPage user={user} patients={patients} users={users} setSelectedPatient={p => setSelectedPatient(p)} />;
      case "admit": return <AdmitPage patients={patients} setPatients={setPatients} user={user} users={users} toast={toast} />;
      case "prescribe": return <PrescribePage user={user} patients={patients} setPatients={setPatients} toast={toast} />;
      case "ho_prescribe": return <HOPrescribePage user={user} patients={patients} setPatients={setPatients} toast={toast} />;
      case "discharge_list": return <DischargePage user={user} patients={patients} setPatients={setPatients} users={users} toast={toast} showConfirm={showConfirm} />;
      case "request_meds": return <NurseRequestPage user={user} patients={patients} setPatients={setPatients} toast={toast} />;
      case "receive_meds": return <NurseReceivePage user={user} patients={patients} setPatients={setPatients} toast={toast} />;
      case "approvals": return <MatronApprovalsPage user={user} patients={patients} setPatients={setPatients} toast={toast} />;
      case "dispense": return <PharmacyDispensePage user={user} patients={patients} setPatients={setPatients} toast={toast} />;
      case "administer": return <NurseAdministerPage user={user} patients={patients} setPatients={setPatients} toast={toast} />;
      case "admin_users": return <AdminUsersPage users={users} setUsers={setUsers} user={user} toast={toast} showConfirm={showConfirm} />;
      case "admin_patients": return <AdminPatientsPage patients={patients} setPatients={setPatients} users={users} toast={toast} showConfirm={showConfirm} />;
      default: return <HomePage user={user} patients={patients} users={users} rc={rc} />;
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif", background: "#f0f4f8" }}>
      <style>{`
        @keyframes slideIn { from{transform:translateX(40px);opacity:0} to{transform:translateX(0);opacity:1} }
        @keyframes fadeUp { from{transform:translateY(20px);opacity:0} to{transform:translateY(0);opacity:1} }
        @keyframes spin { to{transform:rotate(360deg)} }
        .nav-item { display:flex; align-items:center; gap:10px; padding:10px 14px; border-radius:10px; cursor:pointer; transition:all 0.18s; color:rgba(255,255,255,0.6); font-size:13px; font-weight:500; border:none; background:none; width:100%; text-align:left; }
        .nav-item:hover { background:rgba(255,255,255,0.1); color:#fff; }
        .nav-item.active { background:rgba(255,255,255,0.18); color:#fff; font-weight:700; }
        .card { background:#fff; border-radius:14px; box-shadow:0 2px 12px rgba(0,0,0,0.07); padding:24px; }
        .btn-primary { background:linear-gradient(135deg,#0ea5e9,#2563eb); color:#fff; border:none; padding:10px 20px; border-radius:8px; font-weight:600; font-size:14px; cursor:pointer; transition:all 0.2s; }
        .btn-primary:hover { transform:translateY(-1px); box-shadow:0 4px 14px rgba(14,165,233,0.4); }
        .btn-success { background:linear-gradient(135deg,#10b981,#059669); color:#fff; border:none; padding:8px 16px; border-radius:8px; font-weight:600; font-size:13px; cursor:pointer; transition:all 0.2s; }
        .btn-success:hover { transform:translateY(-1px); box-shadow:0 4px 14px rgba(16,185,129,0.4); }
        .btn-danger { background:linear-gradient(135deg,#ef4444,#dc2626); color:#fff; border:none; padding:8px 16px; border-radius:8px; font-weight:600; font-size:13px; cursor:pointer; transition:all 0.2s; }
        .btn-danger:hover { transform:translateY(-1px); }
        .btn-warning { background:linear-gradient(135deg,#f59e0b,#d97706); color:#fff; border:none; padding:8px 16px; border-radius:8px; font-weight:600; font-size:13px; cursor:pointer; transition:all 0.2s; }
        .btn-purple { background:linear-gradient(135deg,#8b5cf6,#7c3aed); color:#fff; border:none; padding:8px 16px; border-radius:8px; font-weight:600; font-size:13px; cursor:pointer; transition:all 0.2s; }
        .form-input { width:100%; padding:10px 14px; border:1.5px solid #e2e8f0; border-radius:8px; font-size:14px; color:#1e293b; background:#fff; transition:border 0.2s; box-sizing:border-box; }
        .form-input:focus { border-color:#0ea5e9; outline:none; box-shadow:0 0 0 3px rgba(14,165,233,0.1); }
        .patient-card { background:#fff; border-radius:12px; padding:16px 20px; box-shadow:0 2px 8px rgba(0,0,0,0.06); border-left:4px solid #0ea5e9; margin-bottom:12px; transition:all 0.2s; cursor:pointer; }
        .patient-card:hover { transform:translateY(-2px); box-shadow:0 6px 20px rgba(0,0,0,0.1); }
        .badge { display:inline-flex; align-items:center; gap:4px; padding:3px 10px; border-radius:20px; font-size:12px; font-weight:600; }
        .badge-panel { background:#dbeafe; color:#1d4ed8; }
        .badge-private { background:#ede9fe; color:#7c3aed; }
        .badge-pending { background:#fef3c7; color:#d97706; }
        .badge-approved { background:#d1fae5; color:#059669; }
        .badge-dispensed { background:#dbeafe; color:#2563eb; }
        .badge-administered { background:#d1fae5; color:#047857; }
        .badge-discharged { background:#fee2e2; color:#dc2626; }
        .badge-ho { background:#eef2ff; color:#4f46e5; }
        .stat-card { background:#fff; border-radius:14px; padding:20px 24px; box-shadow:0 2px 12px rgba(0,0,0,0.06); display:flex; flex-direction:column; gap:8px; }
        table { width:100%; border-collapse:collapse; }
        th { background:#f8fafc; color:#64748b; font-size:12px; font-weight:600; letter-spacing:0.8px; text-transform:uppercase; padding:12px 16px; text-align:left; }
        td { padding:12px 16px; border-bottom:1px solid #f1f5f9; font-size:14px; color:#334155; }
        tr:last-child td { border-bottom:none; }
        tr:hover td { background:#f8fafc; }
        label { font-size:13px; font-weight:600; color:#475569; display:block; margin-bottom:6px; }
      `}</style>

      {/* Sidebar */}
      <div style={{ width: 238, background: `linear-gradient(180deg, ${rc.color} 0%, ${rc.color}dd 100%)`, display: "flex", flexDirection: "column", padding: "20px 12px", position: "sticky", top: 0, height: "100vh", overflowY: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, padding: "0 4px" }}>
          <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: 10, padding: 8 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          </div>
          <div>
            <div style={{ color: "#fff", fontWeight: 800, fontSize: 17, letterSpacing: 0.5 }}>HBS</div>
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase" }}>Hospital</div>
          </div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 10, padding: "10px 12px", marginBottom: 18, marginTop: 8 }}>
          <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 10, letterSpacing: 1, textTransform: "uppercase", fontWeight: 600 }}>Logged in as</div>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 12, marginTop: 2 }}>{user.name}</div>
          <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 10, marginTop: 1 }}>{rc.label} · {user.id}</div>
        </div>
        <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 600, marginBottom: 6, paddingLeft: 4 }}>Main Module</div>
        <nav style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
          {navItems.map(item => (
            <button key={item.key} className={`nav-item ${activeTab === item.key ? "active" : ""}`} onClick={() => setActiveTab(item.key)}>
              <Icon name={item.icon} size={16} />{item.label}
            </button>
          ))}
        </nav>
        <button onClick={() => setUser(null)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 10, cursor: "pointer", color: "rgba(255,255,255,0.7)", background: "rgba(255,255,255,0.1)", border: "none", fontSize: 13, fontWeight: 500, marginTop: 8 }}>
          <Icon name="logout" size={16} /> Logout
        </button>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: "24px 28px", overflowY: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#0f172a" }}>
              {navItems.find(n => n.key === activeTab)?.label || "Dashboard"}
            </h1>
            <p style={{ margin: "3px 0 0", color: "#94a3b8", fontSize: 12 }}>
              {new Date().toLocaleDateString("en-PK", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ background: rc.bg, color: rc.color, borderRadius: 10, padding: "7px 14px", fontSize: 12, fontWeight: 700 }}>{rc.label}</div>
          </div>
        </div>
        <div style={{ animation: "fadeUp 0.3s ease" }}>{content()}</div>
      </div>

      {/* Patient Detail Modal */}
      {selectedPatient && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 9990, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#fff", borderRadius: 20, maxWidth: 680, width: "100%", maxHeight: "88vh", overflowY: "auto", padding: 32, position: "relative" }}>
            <button onClick={() => setSelectedPatient(null)} style={{ position: "absolute", top: 16, right: 16, background: "#f1f5f9", border: "none", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b" }}><Icon name="cross" size={16} /></button>
            <PatientDetailModal patient={selectedPatient} users={users} />
          </div>
        </div>
      )}

      {confirm && (
        <ConfirmModal
          message={confirm.message}
          onConfirm={() => { confirm.onConfirm(); setConfirm(null); }}
          onCancel={() => setConfirm(null)}
        />
      )}
      <Toast toasts={toasts} />
    </div>
  );
}

// ─── PATIENT DETAIL MODAL ──────────────────────────────────────────────────────
function PatientDetailModal({ patient: p, users }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#0f172a" }}>{p.name}</h2>
          <div style={{ color: "#64748b", fontSize: 13, marginTop: 3 }}>{p.age}yrs · {p.sex} · <span style={{ fontWeight: 600, color: "#0ea5e9" }}>{p.admissionNo}</span></div>
        </div>
        <div style={{ textAlign: "right" }}>
          <span className={`badge badge-${p.ward.toLowerCase()}`}>{p.ward} Ward</span>
          {p.discharged && <div style={{ marginTop: 4 }}><span className="badge badge-discharged">Discharged</span></div>}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Admitted By", value: getUserName(users, p.admittedBy) },
          { label: "Doctor", value: getUserName(users, p.doctor) },
          { label: "Date of Admission", value: `${p.doa} at ${p.time}` },
          { label: "Contact", value: p.contact || "—" },
          { label: "Address", value: p.address || "—" },
          { label: "Chief Complaint", value: p.complaint || "—" },
        ].map(f => (
          <div key={f.label} style={{ background: "#f8fafc", borderRadius: 8, padding: "10px 14px" }}>
            <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 3 }}>{f.label}</div>
            <div style={{ fontSize: 13, color: "#0f172a", fontWeight: 600 }}>{f.value}</div>
          </div>
        ))}
      </div>
      {p.diagnosis && (
        <div style={{ background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 10, padding: "12px 16px", marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: "#0369a1", fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 4 }}>Diagnosis</div>
          <div style={{ color: "#0f172a", fontWeight: 600 }}>{p.diagnosis}</div>
        </div>
      )}
      {p.prescriptions.length > 0 && (
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", marginBottom: 10 }}>Prescriptions</div>
          <table>
            <thead><tr><th>Medicine</th><th>Dose</th><th>Frequency</th><th>Duration</th><th>By</th></tr></thead>
            <tbody>
              {p.prescriptions.map((m, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600 }}>{m.name}</td>
                  <td>{m.dose}</td>
                  <td>{m.freq}</td>
                  <td>{m.duration}</td>
                  <td><span className={`badge ${m.prescribedBy && m.prescribedBy.startsWith("HO") ? "badge-ho" : "badge-panel"}`}>{m.prescribedByName || "Doctor"}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {p.dischargeInfo && (
        <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "12px 16px", marginTop: 16 }}>
          <div style={{ fontSize: 11, color: "#dc2626", fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 4 }}>Discharge Information</div>
          <div style={{ fontSize: 13, color: "#0f172a" }}>Discharged by: <strong>{getUserName(users, p.dischargeInfo.dischargedBy)}</strong> on {p.dischargeInfo.dischargedAt}</div>
          {p.dischargeInfo.notes && <div style={{ color: "#64748b", fontSize: 12, marginTop: 4 }}>{p.dischargeInfo.notes}</div>}
        </div>
      )}
    </div>
  );
}

// ─── HOME PAGE ─────────────────────────────────────────────────────────────────
function HomePage({ user, patients, users, rc }) {
  const active = patients.filter(p => !p.discharged);
  const stats = [
    { label: "Active Patients", value: active.length, icon: "bed", color: "#0ea5e9" },
    { label: "Admitted Today", value: active.filter(p => p.doa === now().date).length, icon: "calendar", color: "#10b981" },
    { label: "Panel Ward", value: active.filter(p => p.ward === "Panel").length, icon: "clipboard", color: "#f59e0b" },
    { label: "Private Ward", value: active.filter(p => p.ward === "Private").length, icon: "shield", color: "#8b5cf6" },
  ];
  return (
    <div>
      <div style={{ background: `linear-gradient(135deg, ${rc.color}15, ${rc.color}05)`, border: `1px solid ${rc.color}30`, borderRadius: 16, padding: "20px 24px", marginBottom: 20 }}>
        <h2 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 700, color: "#0f172a" }}>Welcome to HBS Hospital Management System</h2>
        <p style={{ margin: 0, color: "#64748b", fontSize: 13 }}>HBS General Hospital · Indoor Patient Management (IPD Module)</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 20 }}>
        {stats.map(s => (
          <div key={s.label} className="stat-card">
            <div style={{ width: 38, height: 38, borderRadius: 10, background: `${s.color}15`, display: "flex", alignItems: "center", justifyContent: "center", color: s.color }}>
              <Icon name={s.icon} size={18} />
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, color: "#0f172a" }}>{s.value}</div>
            <div style={{ fontSize: 12, color: "#64748b", fontWeight: 500 }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div className="card">
        <h3 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 700, color: "#0f172a" }}>Recent Active Admissions</h3>
        <table>
          <thead><tr><th>Admission No</th><th>Patient Name</th><th>Ward</th><th>Doctor</th><th>DOA</th><th>Status</th></tr></thead>
          <tbody>
            {active.slice(-6).reverse().map(p => (
              <tr key={p.admissionNo}>
                <td style={{ fontWeight: 600, color: "#0ea5e9" }}>{p.admissionNo}</td>
                <td>{p.name}</td>
                <td><span className={`badge badge-${p.ward.toLowerCase()}`}>{p.ward}</span></td>
                <td style={{ color: "#64748b" }}>{getUserName(users, p.doctor)}</td>
                <td>{p.doa} {p.time}</td>
                <td><span className="badge badge-approved">Active</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── PROFILE PAGE ──────────────────────────────────────────────────────────────
function ProfilePage({ user, rc }) {
  const fields = [
    { label: "Full Name", value: user.name },
    { label: "Employee ID", value: user.id },
    { label: "Role", value: ROLE_CONFIG[user.role].label },
    { label: "Age", value: user.age },
    { label: "Sex", value: user.sex },
    { label: "Department", value: user.dept },
    { label: "Date of Joining", value: user.doj },
    ...(user.specialization ? [{ label: "Specialization", value: user.specialization }] : []),
    ...(user.shift ? [{ label: "Shift", value: user.shift }] : []),
    ...(user.ward ? [{ label: "Assigned Ward", value: user.ward }] : []),
  ];
  return (
    <div style={{ maxWidth: 600 }}>
      <div className="card">
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 24, paddingBottom: 20, borderBottom: "1px solid #f1f5f9" }}>
          <div style={{ width: 68, height: 68, borderRadius: "50%", background: `linear-gradient(135deg, ${rc.color}, ${rc.color}88)`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 24, fontWeight: 700 }}>
            {user.name.charAt(0)}
          </div>
          <div>
            <h2 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 700, color: "#0f172a" }}>{user.name}</h2>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: rc.bg, color: rc.color, padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
              <Icon name={rc.icon} size={12} />{rc.label}
            </div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {fields.map(f => (
            <div key={f.label} style={{ background: "#f8fafc", borderRadius: 10, padding: "12px 14px" }}>
              <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 3 }}>{f.label}</div>
              <div style={{ fontSize: 14, color: "#0f172a", fontWeight: 600 }}>{f.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── INDOOR / IPD PAGE ────────────────────────────────────────────────────────
function IndoorPage({ user, patients, users, setSelectedPatient }) {
  const [search, setSearch] = useState("");
  const [wardFilter, setWardFilter] = useState("All");
  const [showDischarged, setShowDischarged] = useState(false);

  const visible = patients.filter(p => {
    if (!showDischarged && p.discharged) return false;
    if (showDischarged && !p.discharged) return false;
    // House officers see all patients in all wards
    if (user.role === "doctor" && p.doctor !== user.id) return false;
    if (wardFilter !== "All" && p.ward !== wardFilter) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.admissionNo.includes(search)) return false;
    return true;
  });

  return (
    <div>
      <div style={{ display: "flex", gap: 12, marginBottom: 18, alignItems: "center", flexWrap: "wrap" }}>
        <input className="form-input" placeholder="Search by name or admission no..." value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: 300 }} />
        {["All", "Panel", "Private"].map(w => (
          <button key={w} onClick={() => setWardFilter(w)}
            style={{ padding: "8px 16px", borderRadius: 8, border: "1.5px solid", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.15s",
              background: wardFilter === w ? "#0ea5e9" : "#fff", borderColor: wardFilter === w ? "#0ea5e9" : "#e2e8f0",
              color: wardFilter === w ? "#fff" : "#475569" }}>
            {w}
          </button>
        ))}
        <button onClick={() => setShowDischarged(!showDischarged)}
          style={{ padding: "8px 16px", borderRadius: 8, border: "1.5px solid", fontSize: 13, fontWeight: 600, cursor: "pointer",
            background: showDischarged ? "#fee2e2" : "#fff", borderColor: showDischarged ? "#ef4444" : "#e2e8f0",
            color: showDischarged ? "#dc2626" : "#475569" }}>
          {showDischarged ? "Show Active" : "Show Discharged"}
        </button>
      </div>
      {visible.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, color: "#94a3b8" }}>
          <Icon name="bed" size={48} /><p style={{ marginTop: 16 }}>No patients found</p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {visible.map(p => <PatientCard key={p.admissionNo} patient={p} user={user} users={users} onClick={() => setSelectedPatient(p)} />)}
        </div>
      )}
    </div>
  );
}

function PatientCard({ patient: p, user, users, onClick }) {
  const steps = [
    { key: "admitted", label: "Admitted", done: true },
    { key: "diagnosed", label: "Diagnosed", done: !!p.diagnosis },
    { key: "requested", label: "Meds Requested", done: p.nurseRequests?.length > 0 },
    { key: "approved", label: "Approved", done: p.matronApprovals?.length > 0 },
    { key: "dispensed", label: "Dispensed", done: p.dispensed?.length > 0 },
    { key: "administered", label: "Administered", done: p.administered?.length > 0 },
  ];
  return (
    <div className="patient-card" onClick={onClick} style={{ borderLeftColor: p.discharged ? "#ef4444" : p.ward === "Private" ? "#8b5cf6" : "#0ea5e9" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>{p.name}</span>
            <span className={`badge badge-${p.ward.toLowerCase()}`}>{p.ward}</span>
            {p.discharged && <span className="badge badge-discharged">Discharged</span>}
          </div>
          <div style={{ color: "#64748b", fontSize: 12, marginTop: 2 }}>
            {p.age}yrs · {p.sex} · Adm No: <strong>{p.admissionNo}</strong>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 12, color: "#64748b" }}>{p.doa} · {p.time}</div>
          <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 1 }}>Dr: {getUserName(users, p.doctor)}</div>
        </div>
      </div>
      {!p.discharged && (
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {steps.map((s, i) => (
            <div key={s.key} style={{ display: "flex", alignItems: "center", gap: 4, flex: 1 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
                <div style={{ width: 18, height: 18, borderRadius: "50%", background: s.done ? "#10b981" : "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {s.done && <Icon name="check" size={10} />}
                </div>
                <div style={{ fontSize: 8, color: s.done ? "#10b981" : "#94a3b8", fontWeight: 600, marginTop: 2, textAlign: "center", whiteSpace: "nowrap" }}>{s.label}</div>
              </div>
              {i < steps.length - 1 && <div style={{ height: 2, flex: 0.5, background: steps[i + 1].done ? "#10b981" : "#e2e8f0", borderRadius: 2, marginBottom: 14 }} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── ADMIT PATIENT ─────────────────────────────────────────────────────────────
function AdmitPage({ patients, setPatients, user, users, toast }) {
  const [form, setForm] = useState({ name: "", age: "", sex: "Male", ward: "Panel", doctor: "", contact: "", address: "", complaint: "" });
  const [saving, setSaving] = useState(false);
  const doctors = users.filter(u => u.role === "doctor");

  const submit = () => {
    if (!form.name || !form.age || !form.doctor) { toast("Please fill all required fields", "error"); return; }
    setSaving(true);
    setTimeout(() => {
      const n = now();
      const newPat = {
        admissionNo: genAdmNo(patients),
        name: form.name, age: parseInt(form.age), sex: form.sex,
        ward: form.ward, doctor: form.doctor, contact: form.contact,
        address: form.address, complaint: form.complaint,
        doa: n.date, time: n.time, admittedBy: user.id,
        diagnosis: "", prescriptions: [], nurseRequests: [], matronApprovals: [], dispensed: [], administered: [],
        discharged: false, dischargeInfo: null
      };
      setPatients(p => [...p, newPat]);
      setForm({ name: "", age: "", sex: "Male", ward: "Panel", doctor: "", contact: "", address: "", complaint: "" });
      toast(`Patient ${newPat.name} admitted — ${newPat.admissionNo}`);
      setSaving(false);
    }, 600);
  };

  return (
    <div style={{ maxWidth: 680 }}>
      <div className="card">
        <h3 style={{ margin: "0 0 18px", fontSize: 15, fontWeight: 700, color: "#0f172a" }}>New Patient Admission</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div style={{ gridColumn: "1/-1" }}>
            <label>Patient Full Name *</label>
            <input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Enter full name" />
          </div>
          <div>
            <label>Age *</label>
            <input className="form-input" type="number" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} placeholder="Age in years" />
          </div>
          <div>
            <label>Sex</label>
            <select className="form-input" value={form.sex} onChange={e => setForm({ ...form, sex: e.target.value })}>
              <option>Male</option><option>Female</option><option>Other</option>
            </select>
          </div>
          <div>
            <label>Ward</label>
            <select className="form-input" value={form.ward} onChange={e => setForm({ ...form, ward: e.target.value })}>
              <option value="Panel">Panel</option><option value="Private">Private</option>
            </select>
          </div>
          <div>
            <label>Assigned Doctor *</label>
            <select className="form-input" value={form.doctor} onChange={e => setForm({ ...form, doctor: e.target.value })}>
              <option value="">-- Select Doctor --</option>
              {doctors.map(d => <option key={d.id} value={d.id}>{d.name} ({d.specialization || d.dept})</option>)}
            </select>
          </div>
          <div>
            <label>Contact Number</label>
            <input className="form-input" value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} placeholder="Phone number" />
          </div>
          <div>
            <label>Address</label>
            <input className="form-input" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="City / Area" />
          </div>
          <div style={{ gridColumn: "1/-1" }}>
            <label>Chief Complaint</label>
            <textarea className="form-input" value={form.complaint} onChange={e => setForm({ ...form, complaint: e.target.value })} placeholder="Reason for admission..." rows={3} style={{ resize: "vertical" }} />
          </div>
        </div>
        <button className="btn-primary" onClick={submit} disabled={saving} style={{ marginTop: 18, minWidth: 160 }}>
          {saving ? "Admitting..." : "Admit Patient"}
        </button>
      </div>
    </div>
  );
}

// ─── DISCHARGE PAGE ────────────────────────────────────────────────────────────
function DischargePage({ user, patients, setPatients, users, toast, showConfirm }) {
  const [notes, setNotes] = useState({});
  const [saving, setSaving] = useState(null);

  // Who can discharge whom:
  // - Doctor: only their own patients
  // - Admission officer: all active patients (and can re-admit)
  // - House officer: only patients admitted by the doctor they assist (all ward patients visible to them)
  // - Administrator: all patients
  const canDischarge = (p) => {
    if (p.discharged) return false;
    if (user.role === "administrator") return true;
    if (user.role === "admission_officer") return true;
    if (user.role === "doctor") return p.doctor === user.id;
    if (user.role === "house_officer") return true; // HO can discharge any ward patient
    return false;
  };

  const activePatients = patients.filter(p => !p.discharged && canDischarge(p));
  const dischargedPatients = patients.filter(p => p.discharged);

  const discharge = (admNo, patName) => {
    showConfirm(`Discharge ${patName}? This will mark the patient as discharged.`, () => {
      setSaving(admNo);
      setTimeout(() => {
        setPatients(ps => ps.map(p => p.admissionNo !== admNo ? p : {
          ...p, discharged: true,
          dischargeInfo: { dischargedBy: user.id, dischargedAt: `${now().date} ${now().time}`, notes: notes[admNo] || "" }
        }));
        toast(`Patient ${patName} discharged successfully`);
        setSaving(null);
      }, 500);
    });
  };

  const readmit = (admNo, patName) => {
    if (!["admission_officer", "administrator"].includes(user.role)) {
      toast("Only Admission Officer or Administrator can re-admit patients", "error"); return;
    }
    showConfirm(`Re-admit ${patName}?`, () => {
      setPatients(ps => ps.map(p => p.admissionNo !== admNo ? p : {
        ...p, discharged: false, dischargeInfo: null
      }));
      toast(`Patient ${patName} re-admitted successfully`);
    });
  };

  return (
    <div>
      {/* Active patients to discharge */}
      <div className="card" style={{ marginBottom: 20 }}>
        <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700 }}>Active Patients — Discharge</h3>
        {activePatients.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40, color: "#94a3b8" }}>
            <Icon name="check" size={40} /><p style={{ marginTop: 12 }}>No active patients to discharge.</p>
          </div>
        ) : activePatients.map(p => (
          <div key={p.admissionNo} style={{ borderBottom: "1px solid #f1f5f9", paddingBottom: 16, marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{p.name} <span style={{ color: "#94a3b8", fontWeight: 400, fontSize: 12 }}>({p.admissionNo})</span></div>
                <div style={{ color: "#64748b", fontSize: 12, marginTop: 2 }}>{p.ward} Ward · Dr: {getUserName(users, p.doctor)} · Admitted: {p.doa}</div>
                <div style={{ marginTop: 10, maxWidth: 420 }}>
                  <label style={{ fontSize: 11 }}>Discharge Notes (optional)</label>
                  <input className="form-input" placeholder="Reason for discharge, follow-up instructions..." value={notes[p.admissionNo] || ""} onChange={e => setNotes({ ...notes, [p.admissionNo]: e.target.value })} style={{ fontSize: 13 }} />
                </div>
              </div>
              <button className="btn-danger" onClick={() => discharge(p.admissionNo, p.name)} disabled={saving === p.admissionNo} style={{ marginTop: 4 }}>
                {saving === p.admissionNo ? "..." : "Discharge"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Discharged patients — re-admit option for admission officer/admin */}
      {["admission_officer", "administrator"].includes(user.role) && dischargedPatients.length > 0 && (
        <div className="card">
          <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700 }}>Discharged Patients — Re-admit</h3>
          {dischargedPatients.map(p => (
            <div key={p.admissionNo} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f1f5f9", paddingBottom: 12, marginBottom: 12 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{p.name} <span style={{ color: "#94a3b8", fontWeight: 400, fontSize: 12 }}>({p.admissionNo})</span></div>
                <div style={{ color: "#64748b", fontSize: 12 }}>{p.ward} Ward · Discharged: {p.dischargeInfo?.dischargedAt || "—"}</div>
                {p.dischargeInfo?.notes && <div style={{ color: "#94a3b8", fontSize: 11, marginTop: 2 }}>{p.dischargeInfo.notes}</div>}
              </div>
              <button className="btn-success" onClick={() => readmit(p.admissionNo, p.name)} style={{ whiteSpace: "nowrap" }}>
                <Icon name="refresh" size={13} /> Re-admit
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── DOCTOR: PRESCRIBE (shows advised medications, not tracking) ───────────────
function PrescribePage({ user, patients, setPatients, toast }) {
  const myPatients = patients.filter(p => p.doctor === user.id && !p.discharged);
  const [sel, setSel] = useState(null);
  const [diag, setDiag] = useState("");
  const [history, setHistory] = useState("");
  const [meds, setMeds] = useState([{ name: "", dose: "", freq: "", duration: "" }]);
  const [saving, setSaving] = useState(false);

  const selPat = myPatients.find(p => p.admissionNo === sel);

  useEffect(() => {
    if (selPat) {
      setDiag(selPat.diagnosis || "");
      setHistory(selPat.patientHistory || "");
      setMeds(selPat.prescriptions.length ? selPat.prescriptions : [{ name: "", dose: "", freq: "", duration: "" }]);
    }
  }, [sel]);

  const addMed = () => setMeds([...meds, { name: "", dose: "", freq: "", duration: "" }]);
  const updateMed = (i, k, v) => { const m = [...meds]; m[i][k] = v; setMeds(m); };

  const save = () => {
    if (!selPat || !diag) { toast("Please select patient and enter diagnosis", "error"); return; }
    setSaving(true);
    setTimeout(() => {
      setPatients(ps => ps.map(p => p.admissionNo === sel
        ? { ...p, diagnosis: diag, patientHistory: history, prescriptions: meds.filter(m => m.name).map(m => ({ ...m, prescribedBy: user.id, prescribedByName: user.name })) }
        : p));
      toast("Prescription saved successfully");
      setSaving(false);
    }, 500);
  };

  return (
    <div style={{ maxWidth: 760 }}>
      {/* Patient selector */}
      <div className="card" style={{ marginBottom: 16 }}>
        <label>Select Patient</label>
        <select className="form-input" value={sel || ""} onChange={e => setSel(e.target.value)} style={{ maxWidth: 420 }}>
          <option value="">-- Choose your patient --</option>
          {myPatients.map(p => <option key={p.admissionNo} value={p.admissionNo}>{p.name} · {p.admissionNo} · {p.ward}</option>)}
        </select>
      </div>

      {selPat && (
        <div className="card">
          <div style={{ background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 10, padding: "12px 16px", marginBottom: 18 }}>
            <div style={{ fontWeight: 700, color: "#0369a1" }}>{selPat.name}</div>
            <div style={{ color: "#0284c7", fontSize: 12 }}>{selPat.age}yrs · {selPat.sex} · {selPat.ward} Ward · Adm: {selPat.doa}</div>
            {selPat.complaint && <div style={{ color: "#0369a1", fontSize: 12, marginTop: 3 }}>Complaint: {selPat.complaint}</div>}
          </div>

          <div style={{ display: "grid", gap: 14 }}>
            <div>
              <label>Patient History</label>
              <textarea className="form-input" value={history} onChange={e => setHistory(e.target.value)} placeholder="Past medical history, allergies..." rows={2} style={{ resize: "vertical" }} />
            </div>
            <div>
              <label>Diagnosis *</label>
              <textarea className="form-input" value={diag} onChange={e => setDiag(e.target.value)} placeholder="Enter diagnosis..." rows={2} style={{ resize: "vertical" }} />
            </div>
          </div>

          {/* Advised medications */}
          <div style={{ marginTop: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <label style={{ margin: 0, fontSize: 14 }}>Advised Medications</label>
              <button className="btn-primary" onClick={addMed} style={{ padding: "6px 14px", fontSize: 12 }}>+ Add Medication</button>
            </div>
            {/* Show already-saved meds from HO if any */}
            {selPat.prescriptions.some(m => m.prescribedBy && m.prescribedBy.startsWith("HO")) && (
              <div style={{ background: "#eef2ff", border: "1px solid #c7d2fe", borderRadius: 8, padding: "10px 14px", marginBottom: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#4f46e5", marginBottom: 6 }}>Medications added by House Officer:</div>
                {selPat.prescriptions.filter(m => m.prescribedBy && m.prescribedBy.startsWith("HO")).map((m, i) => (
                  <div key={i} style={{ fontSize: 12, color: "#374151" }}>{m.name} — {m.dose} · {m.freq} · {m.duration} <span style={{ color: "#6366f1" }}>({m.prescribedByName})</span></div>
                ))}
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {meds.map((m, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr auto", gap: 8, alignItems: "end" }}>
                  <div><label style={{ fontSize: 11 }}>Medicine Name</label><input className="form-input" value={m.name} onChange={e => updateMed(i, "name", e.target.value)} placeholder="e.g. Paracetamol" /></div>
                  <div><label style={{ fontSize: 11 }}>Dose</label><input className="form-input" value={m.dose} onChange={e => updateMed(i, "dose", e.target.value)} placeholder="500mg" /></div>
                  <div><label style={{ fontSize: 11 }}>Frequency</label><input className="form-input" value={m.freq} onChange={e => updateMed(i, "freq", e.target.value)} placeholder="TDS" /></div>
                  <div><label style={{ fontSize: 11 }}>Duration</label><input className="form-input" value={m.duration} onChange={e => updateMed(i, "duration", e.target.value)} placeholder="5 days" /></div>
                  <button onClick={() => setMeds(meds.filter((_, j) => j !== i))} style={{ background: "#fee2e2", border: "none", color: "#dc2626", borderRadius: 8, padding: "10px 12px", cursor: "pointer" }}>✕</button>
                </div>
              ))}
            </div>
          </div>

          <button className="btn-primary" onClick={save} disabled={saving} style={{ marginTop: 20 }}>
            {saving ? "Saving..." : "Save Prescription"}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── HOUSE OFFICER: ADD MEDICATION ────────────────────────────────────────────
function HOPrescribePage({ user, patients, setPatients, toast }) {
  // HO can see ALL active patients regardless of doctor
  const activePatients = patients.filter(p => !p.discharged);
  const [sel, setSel] = useState(null);
  const [meds, setMeds] = useState([{ name: "", dose: "", freq: "", duration: "" }]);
  const [saving, setSaving] = useState(false);

  const selPat = activePatients.find(p => p.admissionNo === sel);

  useEffect(() => { if (sel) setMeds([{ name: "", dose: "", freq: "", duration: "" }]); }, [sel]);

  const addMed = () => setMeds([...meds, { name: "", dose: "", freq: "", duration: "" }]);
  const updateMed = (i, k, v) => { const m = [...meds]; m[i][k] = v; setMeds(m); };

  const save = () => {
    if (!selPat) { toast("Please select a patient", "error"); return; }
    const valid = meds.filter(m => m.name);
    if (!valid.length) { toast("Add at least one medication", "error"); return; }
    setSaving(true);
    setTimeout(() => {
      const newMeds = valid.map(m => ({ ...m, prescribedBy: user.id, prescribedByName: user.name }));
      setPatients(ps => ps.map(p => p.admissionNo === sel
        ? { ...p, prescriptions: [...p.prescriptions, ...newMeds] }
        : p));
      toast(`${valid.length} medication(s) added to IPD list for ${selPat.name}`);
      setMeds([{ name: "", dose: "", freq: "", duration: "" }]);
      setSaving(false);
    }, 500);
  };

  return (
    <div style={{ maxWidth: 760 }}>
      <div style={{ background: "#eef2ff", border: "1px solid #c7d2fe", borderRadius: 12, padding: "14px 18px", marginBottom: 16 }}>
        <div style={{ fontWeight: 700, color: "#4f46e5", fontSize: 14 }}>House Officer — Add Medication to IPD List</div>
        <div style={{ color: "#6366f1", fontSize: 12, marginTop: 2 }}>You can add medications to any active patient's IPD list. All entries are tagged with your ID.</div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <label>Select Patient (All Wards)</label>
        <select className="form-input" value={sel || ""} onChange={e => setSel(e.target.value)} style={{ maxWidth: 460 }}>
          <option value="">-- Choose patient --</option>
          {activePatients.map(p => <option key={p.admissionNo} value={p.admissionNo}>{p.name} · {p.admissionNo} · {p.ward} Ward</option>)}
        </select>
      </div>

      {selPat && (
        <div className="card">
          <div style={{ background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 10, padding: "12px 16px", marginBottom: 16 }}>
            <div style={{ fontWeight: 700, color: "#0369a1" }}>{selPat.name}</div>
            <div style={{ color: "#0284c7", fontSize: 12 }}>{selPat.age}yrs · {selPat.sex} · {selPat.ward} Ward · Dr: {selPat.doctor}</div>
            {selPat.diagnosis && <div style={{ color: "#0369a1", fontSize: 12, marginTop: 3 }}>Diagnosis: {selPat.diagnosis}</div>}
          </div>

          {selPat.prescriptions.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>Current IPD Medication List</div>
              <table>
                <thead><tr><th>Medicine</th><th>Dose</th><th>Frequency</th><th>Duration</th><th>Added By</th></tr></thead>
                <tbody>
                  {selPat.prescriptions.map((m, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 600 }}>{m.name}</td>
                      <td>{m.dose}</td>
                      <td>{m.freq}</td>
                      <td>{m.duration}</td>
                      <td><span className={`badge ${m.prescribedBy && m.prescribedBy.startsWith("HO") ? "badge-ho" : "badge-panel"}`}>{m.prescribedByName || "Doctor"}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <label style={{ margin: 0 }}>Add New Medications</label>
              <button className="btn-purple" onClick={addMed} style={{ padding: "6px 14px", fontSize: 12 }}>+ Add Row</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {meds.map((m, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr auto", gap: 8, alignItems: "end" }}>
                  <div><label style={{ fontSize: 11 }}>Medicine Name</label><input className="form-input" value={m.name} onChange={e => updateMed(i, "name", e.target.value)} placeholder="e.g. Metformin" /></div>
                  <div><label style={{ fontSize: 11 }}>Dose</label><input className="form-input" value={m.dose} onChange={e => updateMed(i, "dose", e.target.value)} placeholder="500mg" /></div>
                  <div><label style={{ fontSize: 11 }}>Frequency</label><input className="form-input" value={m.freq} onChange={e => updateMed(i, "freq", e.target.value)} placeholder="BD" /></div>
                  <div><label style={{ fontSize: 11 }}>Duration</label><input className="form-input" value={m.duration} onChange={e => updateMed(i, "duration", e.target.value)} placeholder="3 days" /></div>
                  <button onClick={() => setMeds(meds.filter((_, j) => j !== i))} style={{ background: "#fee2e2", border: "none", color: "#dc2626", borderRadius: 8, padding: "10px 12px", cursor: "pointer" }}>✕</button>
                </div>
              ))}
            </div>
          </div>
          <button className="btn-purple" onClick={save} disabled={saving} style={{ marginTop: 20 }}>
            {saving ? "Saving..." : "Add to IPD List"}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── NURSE: REQUEST MEDS ──────────────────────────────────────────────────────
function NurseRequestPage({ user, patients, setPatients, toast }) {
  const [saving, setSaving] = useState(null);
  const withPrescriptions = patients.filter(p => p.prescriptions.length > 0 && !p.discharged);

  const requestMed = (patAdmNo, medIdx) => {
    setSaving(`${patAdmNo}-${medIdx}`);
    setTimeout(() => {
      setPatients(ps => ps.map(p => {
        if (p.admissionNo !== patAdmNo) return p;
        const req = { medIdx, medName: p.prescriptions[medIdx].name, dose: p.prescriptions[medIdx].dose, freq: p.prescriptions[medIdx].freq, requestedBy: user.id, requestedAt: `${now().date} ${now().time}`, status: "pending" };
        const already = p.nurseRequests.some(r => r.medIdx === medIdx);
        if (already) return p;
        return { ...p, nurseRequests: [...p.nurseRequests, req] };
      }));
      toast("Medication request sent to Matron");
      setSaving(null);
    }, 500);
  };

  return (
    <div>
      {withPrescriptions.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: 60, color: "#94a3b8" }}>
          <Icon name="pill" size={48} /><p style={{ marginTop: 16 }}>No prescriptions available yet.</p>
        </div>
      ) : withPrescriptions.map(p => (
        <div key={p.admissionNo} className="card" style={{ marginBottom: 16 }}>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 15 }}>{p.name}</div>
            <div style={{ color: "#64748b", fontSize: 12 }}>{p.admissionNo} · {p.ward} · Dr: {p.doctor}</div>
            {p.diagnosis && <div style={{ color: "#475569", fontSize: 12, marginTop: 3 }}>Dx: {p.diagnosis}</div>}
          </div>
          <table>
            <thead><tr><th>Medicine</th><th>Dose</th><th>Frequency</th><th>Duration</th><th>Added By</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {p.prescriptions.map((m, i) => {
                const req = p.nurseRequests.find(r => r.medIdx === i);
                return (
                  <tr key={i}>
                    <td style={{ fontWeight: 600 }}>{m.name}</td>
                    <td>{m.dose}</td>
                    <td>{m.freq}</td>
                    <td>{m.duration}</td>
                    <td><span className={`badge ${m.prescribedBy && m.prescribedBy.startsWith("HO") ? "badge-ho" : "badge-panel"}`}>{m.prescribedByName || "Doctor"}</span></td>
                    <td>
                      {req ? <span className={`badge badge-${req.status === "pending" ? "pending" : req.status === "approved" ? "approved" : "pending"}`} style={req.status === "rejected" ? { background: "#fee2e2", color: "#dc2626" } : {}}>{req.status}</span>
                        : <span className="badge" style={{ background: "#f1f5f9", color: "#94a3b8" }}>Not requested</span>}
                    </td>
                    <td>
                      {!req && (
                        <button className="btn-primary" onClick={() => requestMed(p.admissionNo, i)} disabled={saving === `${p.admissionNo}-${i}`} style={{ padding: "6px 14px", fontSize: 12 }}>
                          {saving === `${p.admissionNo}-${i}` ? "..." : "Request"}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

// ─── MATRON: APPROVALS (with editable quantity) ───────────────────────────────
function MatronApprovalsPage({ user, patients, setPatients, toast }) {
  const [saving, setSaving] = useState(null);
  const [quantities, setQuantities] = useState({});

  const pendingItems = patients.flatMap(p =>
    p.nurseRequests.filter(r => r.status === "pending").map(r => ({ ...r, patient: p }))
  );

  const decide = (patAdmNo, medIdx, approve) => {
    setSaving(`${patAdmNo}-${medIdx}`);
    const qty = quantities[`${patAdmNo}-${medIdx}`] || "";
    setTimeout(() => {
      setPatients(ps => ps.map(p => {
        if (p.admissionNo !== patAdmNo) return p;
        const reqs = p.nurseRequests.map(r =>
          r.medIdx === medIdx ? { ...r, status: approve ? "approved" : "rejected", decidedBy: user.id, decidedAt: `${now().date} ${now().time}`, approvedQty: qty } : r
        );
        const approvals = approve ? [...p.matronApprovals, { medIdx, approvedAt: `${now().date} ${now().time}`, quantity: qty }] : p.matronApprovals;
        return { ...p, nurseRequests: reqs, matronApprovals: approvals };
      }));
      toast(approve ? "Medication approved for pharmacy" : "Medication request rejected", approve ? "success" : "error");
      setSaving(null);
    }, 500);
  };

  return (
    <div>
      {pendingItems.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: 60, color: "#94a3b8" }}>
          <Icon name="shield" size={48} /><p style={{ marginTop: 16 }}>No pending medication approvals.</p>
        </div>
      ) : (
        <div>
          <div style={{ marginBottom: 14, color: "#64748b", fontSize: 13 }}>{pendingItems.length} request(s) awaiting approval</div>
          {pendingItems.map((r, idx) => {
            const k = `${r.patient.admissionNo}-${r.medIdx}`;
            return (
              <div key={idx} className="card" style={{ marginBottom: 12, borderLeft: "4px solid #f59e0b" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{r.patient.name} <span style={{ color: "#94a3b8", fontWeight: 400, fontSize: 12 }}>({r.patient.admissionNo})</span></div>
                    <div style={{ color: "#64748b", fontSize: 12 }}>Requested by: {r.requestedBy} · {r.requestedAt}</div>
                    <div style={{ marginTop: 10, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
                      <div style={{ background: "#f8fafc", borderRadius: 8, padding: "8px 12px" }}>
                        <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase" }}>Medicine</div>
                        <div style={{ fontWeight: 700, fontSize: 15, color: "#0f172a" }}>{r.medName}</div>
                      </div>
                      <div style={{ background: "#f8fafc", borderRadius: 8, padding: "8px 12px" }}>
                        <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase" }}>Dose</div>
                        <div style={{ fontWeight: 600 }}>{r.dose}</div>
                      </div>
                      <div style={{ background: "#f8fafc", borderRadius: 8, padding: "8px 12px" }}>
                        <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase" }}>Frequency</div>
                        <div style={{ fontWeight: 600 }}>{r.freq}</div>
                      </div>
                      {/* Editable quantity field */}
                      <div>
                        <div style={{ fontSize: 10, color: "#8b5cf6", fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>Approved Quantity</div>
                        <input
                          className="form-input"
                          style={{ width: 140, fontSize: 13, borderColor: "#8b5cf6" }}
                          placeholder="e.g. 10 tablets"
                          value={quantities[k] || ""}
                          onChange={e => setQuantities({ ...quantities, [k]: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                    <button className="btn-success" onClick={() => decide(r.patient.admissionNo, r.medIdx, true)} disabled={saving === k}>✓ Approve</button>
                    <button className="btn-danger" onClick={() => decide(r.patient.admissionNo, r.medIdx, false)} disabled={saving === k}>✕ Reject</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {patients.some(p => p.nurseRequests.some(r => r.status !== "pending")) && (
        <div className="card" style={{ marginTop: 20 }}>
          <h3 style={{ margin: "0 0 14px", fontSize: 14, fontWeight: 700 }}>Decision History</h3>
          <table>
            <thead><tr><th>Patient</th><th>Medicine</th><th>Quantity</th><th>Status</th><th>Decided At</th></tr></thead>
            <tbody>
              {patients.flatMap(p =>
                p.nurseRequests.filter(r => r.status !== "pending").map((r, i) => (
                  <tr key={i}>
                    <td>{p.name}</td>
                    <td style={{ fontWeight: 600 }}>{r.medName}</td>
                    <td>{r.approvedQty || "—"}</td>
                    <td><span className={`badge`} style={r.status === "approved" ? { background: "#d1fae5", color: "#059669" } : { background: "#fee2e2", color: "#dc2626" }}>{r.status}</span></td>
                    <td style={{ color: "#64748b" }}>{r.decidedAt}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── PHARMACY: DISPENSE ───────────────────────────────────────────────────────
function PharmacyDispensePage({ user, patients, setPatients, toast }) {
  const [saving, setSaving] = useState(null);

  const approvedItems = patients.flatMap(p =>
    p.nurseRequests.filter(r => r.status === "approved" && !p.dispensed.some(d => d.medIdx === r.medIdx))
      .map(r => ({ ...r, patient: p }))
  );

  const dispense = (patAdmNo, medIdx, medName) => {
    setSaving(`${patAdmNo}-${medIdx}`);
    setTimeout(() => {
      setPatients(ps => ps.map(p => {
        if (p.admissionNo !== patAdmNo) return p;
        return { ...p, dispensed: [...p.dispensed, { medIdx, medName, dispensedBy: user.id, dispensedAt: `${now().date} ${now().time}` }] };
      }));
      toast(`${medName} dispensed to nurse`);
      setSaving(null);
    }, 500);
  };

  return (
    <div>
      {approvedItems.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: 60, color: "#94a3b8" }}>
          <Icon name="package" size={48} /><p style={{ marginTop: 16 }}>No approved medications pending dispensing.</p>
        </div>
      ) : (
        <div>
          <div style={{ marginBottom: 14, color: "#64748b", fontSize: 13 }}>{approvedItems.length} medication(s) approved — ready to dispense</div>
          {approvedItems.map((r, i) => (
            <div key={i} className="card" style={{ marginBottom: 12, borderLeft: "4px solid #0ea5e9" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{r.patient.name} <span style={{ color: "#94a3b8", fontWeight: 400, fontSize: 12 }}>({r.patient.admissionNo})</span></div>
                  <div style={{ color: "#64748b", fontSize: 12 }}>{r.patient.ward} Ward · Dr: {r.patient.doctor}</div>
                  <div style={{ marginTop: 8 }}>
                    <span style={{ fontWeight: 700, fontSize: 15, color: "#0f172a" }}>{r.medName}</span>
                    <span style={{ color: "#64748b", marginLeft: 10, fontSize: 12 }}>{r.dose} · {r.freq}</span>
                    {r.approvedQty && <span style={{ color: "#8b5cf6", marginLeft: 10, fontSize: 12, fontWeight: 600 }}>Qty: {r.approvedQty}</span>}
                    <span className="badge badge-approved" style={{ marginLeft: 10 }}>Matron Approved</span>
                  </div>
                </div>
                <button className="btn-primary" onClick={() => dispense(r.patient.admissionNo, r.medIdx, r.medName)} disabled={saving === `${r.patient.admissionNo}-${r.medIdx}`}>
                  {saving === `${r.patient.admissionNo}-${r.medIdx}` ? "Dispensing..." : "Dispense"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {patients.some(p => p.dispensed.length > 0) && (
        <div className="card" style={{ marginTop: 20 }}>
          <h3 style={{ margin: "0 0 14px", fontSize: 14, fontWeight: 700 }}>Dispensed History</h3>
          <table>
            <thead><tr><th>Patient</th><th>Medicine</th><th>Dispensed At</th><th>By</th></tr></thead>
            <tbody>
              {patients.flatMap(p => p.dispensed.map((d, i) => (
                <tr key={i}><td>{p.name}</td><td style={{ fontWeight: 600 }}>{d.medName}</td><td style={{ color: "#64748b" }}>{d.dispensedAt}</td><td>{d.dispensedBy}</td></tr>
              )))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── NURSE: RECEIVE MEDICATIONS (new) ─────────────────────────────────────────
function NurseReceivePage({ user, patients, setPatients, toast }) {
  const [saving, setSaving] = useState(null);

  // Show dispensed items that haven't been "received" yet by nurse
  const toReceive = patients.flatMap(p =>
    p.dispensed.filter(d => !d.receivedByNurse)
      .map(d => ({ ...d, patient: p }))
  );

  const receive = (patAdmNo, medIdx, medName) => {
    setSaving(`${patAdmNo}-${medIdx}`);
    setTimeout(() => {
      setPatients(ps => ps.map(p => {
        if (p.admissionNo !== patAdmNo) return p;
        return {
          ...p,
          dispensed: p.dispensed.map(d =>
            d.medIdx === medIdx ? { ...d, receivedByNurse: user.id, receivedAt: `${now().date} ${now().time}` } : d
          )
        };
      }));
      toast(`${medName} received from pharmacy — ready to administer`);
      setSaving(null);
    }, 500);
  };

  return (
    <div>
      <div style={{ background: "#ecfdf5", border: "1px solid #a7f3d0", borderRadius: 12, padding: "12px 18px", marginBottom: 16 }}>
        <div style={{ fontWeight: 700, color: "#059669", fontSize: 13 }}>Receive Medications from Pharmacy</div>
        <div style={{ color: "#047857", fontSize: 12, marginTop: 2 }}>Confirm receipt of medications dispensed by pharmacy. After receiving, you can administer them to patients.</div>
      </div>
      {toReceive.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: 60, color: "#94a3b8" }}>
          <Icon name="package" size={48} /><p style={{ marginTop: 16 }}>No medications pending receipt from pharmacy.</p>
        </div>
      ) : (
        <div>
          <div style={{ marginBottom: 12, color: "#64748b", fontSize: 13 }}>{toReceive.length} medication(s) dispatched by pharmacy</div>
          {toReceive.map((d, i) => {
            const k = `${d.patient.admissionNo}-${d.medIdx}`;
            return (
              <div key={i} className="card" style={{ marginBottom: 12, borderLeft: "4px solid #10b981" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{d.patient.name} <span style={{ color: "#94a3b8", fontWeight: 400, fontSize: 12 }}>({d.patient.admissionNo})</span></div>
                    <div style={{ color: "#64748b", fontSize: 12 }}>{d.patient.ward} Ward · Dispensed by: {d.dispensedBy} at {d.dispensedAt}</div>
                    <div style={{ marginTop: 6 }}>
                      <span style={{ fontWeight: 700, fontSize: 15, color: "#0f172a" }}>{d.medName}</span>
                      <span className="badge badge-dispensed" style={{ marginLeft: 10 }}>Dispensed by Pharmacy</span>
                    </div>
                  </div>
                  <button className="btn-success" onClick={() => receive(d.patient.admissionNo, d.medIdx, d.medName)} disabled={saving === k}>
                    {saving === k ? "..." : "✓ Received"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {patients.some(p => p.dispensed.some(d => d.receivedByNurse)) && (
        <div className="card" style={{ marginTop: 20 }}>
          <h3 style={{ margin: "0 0 14px", fontSize: 14, fontWeight: 700 }}>Received History</h3>
          <table>
            <thead><tr><th>Patient</th><th>Medicine</th><th>Received At</th><th>By</th></tr></thead>
            <tbody>
              {patients.flatMap(p => p.dispensed.filter(d => d.receivedByNurse).map((d, i) => (
                <tr key={i}><td>{p.name}</td><td style={{ fontWeight: 600 }}>{d.medName}</td><td style={{ color: "#64748b" }}>{d.receivedAt}</td><td>{d.receivedByNurse}</td></tr>
              )))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── NURSE: ADMINISTER ────────────────────────────────────────────────────────
function NurseAdministerPage({ user, patients, setPatients, toast }) {
  const [saving, setSaving] = useState(null);
  const [notes, setNotes] = useState({});

  // Only show received (not yet administered) medications
  const dispensedItems = patients.flatMap(p =>
    p.dispensed.filter(d => d.receivedByNurse && !p.administered.some(a => a.medIdx === d.medIdx))
      .map(d => ({ ...d, patient: p }))
  );

  const administer = (patAdmNo, medIdx, medName) => {
    setSaving(`${patAdmNo}-${medIdx}`);
    setTimeout(() => {
      setPatients(ps => ps.map(p => {
        if (p.admissionNo !== patAdmNo) return p;
        return { ...p, administered: [...p.administered, { medIdx, medName, administeredBy: user.id, administeredAt: `${now().date} ${now().time}`, notes: notes[`${patAdmNo}-${medIdx}`] || "" }] };
      }));
      toast(`${medName} administered to patient`);
      setSaving(null);
    }, 500);
  };

  return (
    <div>
      {dispensedItems.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: 60, color: "#94a3b8" }}>
          <Icon name="check" size={48} /><p style={{ marginTop: 16 }}>No medicines pending administration. Receive medicines first.</p>
        </div>
      ) : (
        <div>
          <div style={{ marginBottom: 14, color: "#64748b", fontSize: 13 }}>{dispensedItems.length} medicine(s) received — ready to administer</div>
          {dispensedItems.map((d, i) => {
            const k = `${d.patient.admissionNo}-${d.medIdx}`;
            return (
              <div key={i} className="card" style={{ marginBottom: 12, borderLeft: "4px solid #10b981" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{d.patient.name} <span style={{ color: "#94a3b8", fontWeight: 400, fontSize: 12 }}>({d.patient.admissionNo})</span></div>
                    <div style={{ color: "#64748b", fontSize: 12 }}>{d.patient.ward} Ward</div>
                    <div style={{ marginTop: 6 }}>
                      <span style={{ fontWeight: 700, fontSize: 15, color: "#0f172a" }}>{d.medName}</span>
                      <span className="badge badge-dispensed" style={{ marginLeft: 10 }}>Received from Pharmacy</span>
                    </div>
                    <div style={{ marginTop: 10 }}>
                      <label style={{ fontSize: 11 }}>Administration Notes (optional)</label>
                      <input className="form-input" style={{ maxWidth: 360 }} value={notes[k] || ""} onChange={e => setNotes({ ...notes, [k]: e.target.value })} placeholder="e.g. Given with food, IV administered..." />
                    </div>
                  </div>
                  <button className="btn-success" onClick={() => administer(d.patient.admissionNo, d.medIdx, d.medName)} disabled={saving === k} style={{ marginTop: 4 }}>
                    {saving === k ? "..." : "✓ Administered"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {patients.some(p => p.administered.length > 0) && (
        <div className="card" style={{ marginTop: 20 }}>
          <h3 style={{ margin: "0 0 14px", fontSize: 14, fontWeight: 700 }}>Administration History</h3>
          <table>
            <thead><tr><th>Patient</th><th>Medicine</th><th>Administered At</th><th>Notes</th></tr></thead>
            <tbody>
              {patients.flatMap(p => p.administered.map((a, i) => (
                <tr key={i}><td>{p.name}</td><td style={{ fontWeight: 600 }}>{a.medName}</td><td style={{ color: "#64748b" }}>{a.administeredAt}</td><td style={{ color: "#64748b" }}>{a.notes || "—"}</td></tr>
              )))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── ADMINISTRATOR: MANAGE USERS ──────────────────────────────────────────────
function AdminUsersPage({ users, setUsers, user, toast, showConfirm }) {
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [adding, setAdding] = useState(false);
  const [newUser, setNewUser] = useState({ id: "", password: "", role: "doctor", name: "", age: "", sex: "Male", doj: now().date, dept: "", specialization: "", shift: "", ward: "" });

  const roles = Object.keys(ROLE_CONFIG);

  const startEdit = (u) => { setEditing(u.id); setEditForm({ ...u }); };
  const saveEdit = () => {
    setUsers(us => us.map(u => u.id === editing ? { ...editForm } : u));
    toast("User information updated"); setEditing(null);
  };
  const deleteUser = (uid, uname) => {
    if (uid === user.id) { toast("Cannot delete your own account", "error"); return; }
    showConfirm(`Delete user ${uname}? This cannot be undone.`, () => {
      setUsers(us => us.filter(u => u.id !== uid));
      toast(`User ${uname} deleted`);
    });
  };
  const addUser = () => {
    if (!newUser.id || !newUser.password || !newUser.name || !newUser.role) { toast("Fill all required fields", "error"); return; }
    if (users.some(u => u.id === newUser.id)) { toast("ID already exists", "error"); return; }
    setUsers(us => [...us, { ...newUser, age: parseInt(newUser.age) || 30 }]);
    toast(`User ${newUser.name} created`);
    setAdding(false);
    setNewUser({ id: "", password: "", role: "doctor", name: "", age: "", sex: "Male", doj: now().date, dept: "", specialization: "", shift: "", ward: "" });
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 12, padding: "12px 18px", flex: 1, marginRight: 16 }}>
          <div style={{ fontWeight: 700, color: "#dc2626", fontSize: 14 }}>Administrator — User Management</div>
          <div style={{ color: "#ef4444", fontSize: 12, marginTop: 2 }}>Full control: create, edit, delete any user account and assign roles.</div>
        </div>
        <button className="btn-danger" onClick={() => setAdding(!adding)} style={{ whiteSpace: "nowrap" }}>
          {adding ? "Cancel" : "+ Add New User"}
        </button>
      </div>

      {adding && (
        <div className="card" style={{ marginBottom: 18, borderLeft: "4px solid #dc2626" }}>
          <h3 style={{ margin: "0 0 14px", fontSize: 14, fontWeight: 700 }}>Create New User</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            <div><label>Employee ID *</label><input className="form-input" value={newUser.id} onChange={e => setNewUser({ ...newUser, id: e.target.value })} placeholder="e.g. DR-003" /></div>
            <div><label>Password *</label><input className="form-input" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} placeholder="Set password" /></div>
            <div><label>Role *</label>
              <select className="form-input" value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })}>
                {roles.map(r => <option key={r} value={r}>{ROLE_CONFIG[r].label}</option>)}
              </select>
            </div>
            <div style={{ gridColumn: "1/-1" }}><label>Full Name *</label><input className="form-input" value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} placeholder="Full name" /></div>
            <div><label>Age</label><input className="form-input" type="number" value={newUser.age} onChange={e => setNewUser({ ...newUser, age: e.target.value })} /></div>
            <div><label>Sex</label>
              <select className="form-input" value={newUser.sex} onChange={e => setNewUser({ ...newUser, sex: e.target.value })}>
                <option>Male</option><option>Female</option><option>Other</option>
              </select>
            </div>
            <div><label>Date of Joining</label><input className="form-input" type="date" value={newUser.doj} onChange={e => setNewUser({ ...newUser, doj: e.target.value })} /></div>
            <div><label>Department</label><input className="form-input" value={newUser.dept} onChange={e => setNewUser({ ...newUser, dept: e.target.value })} placeholder="e.g. Cardiology" /></div>
            {(newUser.role === "doctor" || newUser.role === "house_officer") && (
              <div><label>Specialization / Ward</label><input className="form-input" value={newUser.specialization} onChange={e => setNewUser({ ...newUser, specialization: e.target.value })} /></div>
            )}
            {newUser.role === "nurse" && (
              <div><label>Shift</label>
                <select className="form-input" value={newUser.shift} onChange={e => setNewUser({ ...newUser, shift: e.target.value })}>
                  <option>Morning</option><option>Evening</option><option>Night</option>
                </select>
              </div>
            )}
          </div>
          <button className="btn-danger" onClick={addUser} style={{ marginTop: 14 }}>Create User</button>
        </div>
      )}

      <div className="card">
        <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700 }}>All System Users ({users.length})</h3>
        <table>
          <thead><tr><th>ID</th><th>Name</th><th>Role</th><th>Department</th><th>Joined</th><th>Actions</th></tr></thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                {editing === u.id ? (
                  <td colSpan={6} style={{ padding: "16px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                      <div><label style={{ fontSize: 11 }}>Name</label><input className="form-input" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} /></div>
                      <div><label style={{ fontSize: 11 }}>Role</label>
                        <select className="form-input" value={editForm.role} onChange={e => setEditForm({ ...editForm, role: e.target.value })}>
                          {roles.map(r => <option key={r} value={r}>{ROLE_CONFIG[r].label}</option>)}
                        </select>
                      </div>
                      <div><label style={{ fontSize: 11 }}>Department</label><input className="form-input" value={editForm.dept} onChange={e => setEditForm({ ...editForm, dept: e.target.value })} /></div>
                      <div><label style={{ fontSize: 11 }}>Age</label><input className="form-input" type="number" value={editForm.age} onChange={e => setEditForm({ ...editForm, age: parseInt(e.target.value) })} /></div>
                      <div><label style={{ fontSize: 11 }}>Password</label><input className="form-input" value={editForm.password} onChange={e => setEditForm({ ...editForm, password: e.target.value })} /></div>
                    </div>
                    <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                      <button className="btn-success" onClick={saveEdit}>Save</button>
                      <button onClick={() => setEditing(null)} style={{ padding: "8px 16px", borderRadius: 8, border: "1.5px solid #e2e8f0", background: "#fff", color: "#475569", fontWeight: 600, cursor: "pointer", fontSize: 13 }}>Cancel</button>
                    </div>
                  </td>
                ) : (
                  <>
                    <td style={{ fontWeight: 600, color: ROLE_CONFIG[u.role]?.color || "#0f172a" }}>{u.id}</td>
                    <td>{u.name}</td>
                    <td><span className="badge" style={{ background: ROLE_CONFIG[u.role]?.bg, color: ROLE_CONFIG[u.role]?.color }}>{ROLE_CONFIG[u.role]?.label}</span></td>
                    <td style={{ color: "#64748b" }}>{u.dept}</td>
                    <td style={{ color: "#64748b" }}>{u.doj}</td>
                    <td>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button onClick={() => startEdit(u)} style={{ background: "#dbeafe", border: "none", color: "#2563eb", borderRadius: 6, padding: "5px 10px", cursor: "pointer", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}><Icon name="edit" size={12} /> Edit</button>
                        {u.id !== user.id && <button onClick={() => deleteUser(u.id, u.name)} style={{ background: "#fee2e2", border: "none", color: "#dc2626", borderRadius: 6, padding: "5px 10px", cursor: "pointer", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}><Icon name="trash" size={12} /> Delete</button>}
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── ADMINISTRATOR: MANAGE PATIENTS ──────────────────────────────────────────
function AdminPatientsPage({ patients, setPatients, users, toast, showConfirm }) {
  const [editingAdm, setEditingAdm] = useState(null);
  const [editForm, setEditForm] = useState({});

  const deleteEntry = (admNo, name) => {
    showConfirm(`Permanently delete all records for ${name} (${admNo})? This removes the entire patient entry.`, () => {
      setPatients(ps => ps.filter(p => p.admissionNo !== admNo));
      toast(`Patient record ${admNo} deleted`);
    });
  };

  const deleteWrongPrescription = (admNo, medIdx) => {
    showConfirm("Delete this prescription entry? (Wrong entry correction)", () => {
      setPatients(ps => ps.map(p => p.admissionNo !== admNo ? p : { ...p, prescriptions: p.prescriptions.filter((_, i) => i !== medIdx) }));
      toast("Wrong prescription entry removed");
    });
  };

  return (
    <div>
      <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 12, padding: "12px 18px", marginBottom: 18 }}>
        <div style={{ fontWeight: 700, color: "#dc2626", fontSize: 14 }}>Administrator — Patient Records Management</div>
        <div style={{ color: "#ef4444", fontSize: 12, marginTop: 2 }}>Full access: edit patient info, delete wrong entries, remove patient records.</div>
      </div>

      {patients.map(p => (
        <div key={p.admissionNo} className="card" style={{ marginBottom: 14, borderLeft: `4px solid ${p.discharged ? "#ef4444" : "#0ea5e9"}` }}>
          {editingAdm === p.admissionNo ? (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 12 }}>
                <div><label style={{ fontSize: 11 }}>Name</label><input className="form-input" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} /></div>
                <div><label style={{ fontSize: 11 }}>Age</label><input className="form-input" type="number" value={editForm.age} onChange={e => setEditForm({ ...editForm, age: parseInt(e.target.value) })} /></div>
                <div><label style={{ fontSize: 11 }}>Ward</label>
                  <select className="form-input" value={editForm.ward} onChange={e => setEditForm({ ...editForm, ward: e.target.value })}>
                    <option>Panel</option><option>Private</option>
                  </select>
                </div>
                <div><label style={{ fontSize: 11 }}>Doctor</label>
                  <select className="form-input" value={editForm.doctor} onChange={e => setEditForm({ ...editForm, doctor: e.target.value })}>
                    {users.filter(u => u.role === "doctor").map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
                <div><label style={{ fontSize: 11 }}>Diagnosis</label><input className="form-input" value={editForm.diagnosis} onChange={e => setEditForm({ ...editForm, diagnosis: e.target.value })} /></div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn-success" onClick={() => { setPatients(ps => ps.map(pp => pp.admissionNo !== p.admissionNo ? pp : { ...pp, ...editForm })); setEditingAdm(null); toast("Patient record updated"); }}>Save</button>
                <button onClick={() => setEditingAdm(null)} style={{ padding: "8px 16px", borderRadius: 8, border: "1.5px solid #e2e8f0", background: "#fff", color: "#475569", fontWeight: 600, cursor: "pointer", fontSize: 13 }}>Cancel</button>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{p.name} <span style={{ color: "#94a3b8", fontWeight: 400, fontSize: 12 }}>({p.admissionNo})</span> {p.discharged && <span className="badge badge-discharged" style={{ marginLeft: 6 }}>Discharged</span>}</div>
                  <div style={{ color: "#64748b", fontSize: 12 }}>{p.age}yrs · {p.sex} · {p.ward} Ward · Dr: {getUserName(users, p.doctor)} · DOA: {p.doa}</div>
                  {p.diagnosis && <div style={{ color: "#475569", fontSize: 12, marginTop: 2 }}>Dx: {p.diagnosis}</div>}
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button onClick={() => { setEditingAdm(p.admissionNo); setEditForm({ name: p.name, age: p.age, ward: p.ward, doctor: p.doctor, diagnosis: p.diagnosis }); }} style={{ background: "#dbeafe", border: "none", color: "#2563eb", borderRadius: 6, padding: "5px 10px", cursor: "pointer", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}><Icon name="edit" size={12} /> Edit</button>
                  <button onClick={() => deleteEntry(p.admissionNo, p.name)} style={{ background: "#fee2e2", border: "none", color: "#dc2626", borderRadius: 6, padding: "5px 10px", cursor: "pointer", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}><Icon name="trash" size={12} /> Delete Record</button>
                </div>
              </div>
              {/* Wrong entry deletion for prescriptions */}
              {p.prescriptions.length > 0 && (
                <div style={{ marginTop: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>Prescriptions (click 🗑 to delete wrong entry)</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {p.prescriptions.map((m, i) => (
                      <div key={i} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, padding: "6px 10px", display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
                        <span style={{ fontWeight: 600 }}>{m.name}</span>
                        <span style={{ color: "#64748b" }}>{m.dose} · {m.freq}</span>
                        <span style={{ color: "#6366f1", fontSize: 10 }}>{m.prescribedByName || "—"}</span>
                        <button onClick={() => deleteWrongPrescription(p.admissionNo, i)} style={{ background: "#fee2e2", border: "none", color: "#dc2626", borderRadius: 4, padding: "2px 6px", cursor: "pointer", fontSize: 11 }}>🗑</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
