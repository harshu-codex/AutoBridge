import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const ADMIN_EMAIL = process.env.REACT_APP_ADMIN_EMAIL || "admin@autobridge.in";
const ADMIN_PASSWORD = process.env.REACT_APP_ADMIN_PASSWORD || "Admin@123";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (localStorage.getItem("isAdmin") === "true") {
    navigate("/admin", { replace: true });
    return null;
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        localStorage.setItem("isAdmin", "true"); // save admin session
        navigate("/admin", { replace: true });
      } else {
        setError("Invalid admin credentials.");
      }
      setLoading(false);
    }, 400);
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={styles.icon}>⚙️</div>
          <h1 style={{ fontSize: "1.3rem", fontWeight: 700, margin: "10px 0 4px" }}>Admin Panel</h1>
          <p style={{ color: "#9ca3af", fontSize: "0.85rem" }}>AutoBridge — Restricted Access</p>
        </div>

        <div style={styles.hint}>
          📧 {ADMIN_EMAIL}<br />
          🔑 {ADMIN_PASSWORD}
        </div>

        {error && <div style={styles.error}>⚠️ {error}</div>}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label className="label">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" placeholder="admin@autobridge.in" required />
          </div>
          <div>
            <label className="label">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input" placeholder="••••••••" required />
          </div>
          <button type="submit" className="btn-red" style={{ padding: 12, fontSize: "1rem", opacity: loading ? 0.7 : 1 }} disabled={loading}>
            {loading ? "Checking..." : "🔐 Login as Admin"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: 20 }}>
          <Link to="/" style={{ color: "#6b7280", fontSize: "0.82rem" }}>← Back to Site</Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#07070f",
    padding: 24,
  },
  card: {
    background: "#16213e",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 16,
    padding: 32,
    width: "100%",
    maxWidth: 380,
  },
  icon: {
    width: 52,
    height: 52,
    background: "#e63946",
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.4rem",
    margin: "0 auto",
  },
  hint: {
    background: "rgba(244,162,97,0.08)",
    border: "1px solid rgba(244,162,97,0.2)",
    borderRadius: 8,
    padding: "10px 14px",
    color: "#f4a261",
    fontSize: "0.8rem",
    lineHeight: 1.7,
    marginBottom: 16,
  },
  error: {
    background: "rgba(230,57,70,0.1)",
    border: "1px solid rgba(230,57,70,0.3)",
    borderRadius: 8,
    padding: "10px 14px",
    color: "#e63946",
    fontSize: "0.875rem",
    marginBottom: 14,
  },
};
