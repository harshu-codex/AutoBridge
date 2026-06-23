import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function SignIn() {
  const { signIn, isLoggedIn } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();

  // Where to go after login (the page user was trying to visit)
  const from = location.state?.from?.pathname || "/dashboard";

  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  if (isLoggedIn) {
    navigate(from, { replace: true });
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signIn(email, password);
      navigate(from, { replace: true }); // go back to where they came from
    } catch (err) {
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        setError("Invalid email or password.");
      } else {
        setError("Sign in failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <Link to="/" style={{ fontSize: "1.5rem", fontWeight: 800, color: "#fff" }}>
            <span style={{ color: "#e63946" }}>Auto</span>Bridge
          </Link>
          <p style={{ color: "#9ca3af", fontSize: "0.875rem", marginTop: 6 }}>
            Sign in to your account
          </p>
        </div>

        {/* Redirect notice */}
        {location.state?.from && (
          <div style={{ ...styles.infoBox, marginBottom: 16 }}>
            🔒 Please sign in to access that page.
          </div>
        )}

        {error && <div style={styles.errorBox}>⚠️ {error}</div>}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label className="label">Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" className="input" required />
          </div>
          <div>
            <label className="label">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="input" required />
          </div>

          <button
            type="submit"
            className="btn-red"
            style={{ width: "100%", padding: 13, fontSize: "1rem", marginTop: 4, opacity: loading ? 0.7 : 1 }}
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p style={{ textAlign: "center", color: "#9ca3af", fontSize: "0.875rem", marginTop: 20 }}>
          Don't have an account?{" "}
          <Link to="/signup" style={{ color: "#e63946", fontWeight: 600 }}>Sign Up free</Link>
        </p>
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
    background: "linear-gradient(160deg, #0f0f1a 0%, #1a1a2e 100%)",
    padding: 24,
  },
  card: {
    background: "#16213e",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 16,
    padding: 32,
    width: "100%",
    maxWidth: 400,
  },
  errorBox: {
    background: "rgba(230,57,70,0.1)",
    border: "1px solid rgba(230,57,70,0.3)",
    borderRadius: 8,
    padding: "10px 14px",
    color: "#e63946",
    fontSize: "0.875rem",
    marginBottom: 16,
  },
  infoBox: {
    background: "rgba(244,162,97,0.08)",
    border: "1px solid rgba(244,162,97,0.2)",
    borderRadius: 8,
    padding: "10px 14px",
    color: "#f4a261",
    fontSize: "0.82rem",
  },
};
