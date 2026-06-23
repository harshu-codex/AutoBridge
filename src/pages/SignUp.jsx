import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function SignUp() {
  const { signUp, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // If already logged in, go to home
  if (isLoggedIn) {
    navigate("/", { replace: true });
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!name.trim()) return setError("Please enter your name");
    if (password.length < 6) return setError("Password must be at least 6 characters");
    if (password !== confirm) return setError("Passwords do not match");

    setLoading(true);
    try {
      await signUp(email, password, name.trim());
      navigate("/dashboard");
    } catch (err) {
      if (err.code === "auth/email-already-in-use") setError("This email is already registered.");
      else if (err.code === "auth/invalid-email") setError("Please enter a valid email.");
      else setError("Sign up failed. Please try again.");
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
            Create your free account
          </p>
        </div>
        {error && (
          <div style={styles.errorBox}>⚠️ {error}</div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label className="label">Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Rahul Mehta" className="input" required />
          </div>
          <div>
            <label className="label">Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" className="input" required />
          </div>
          <div>
            <label className="label">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Minimum 6 characters" className="input" required />
          </div>
          <div>
            <label className="label">Confirm Password</label>
            <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Repeat password" className="input" required />
          </div>

          <button
            type="submit"
            className="btn-red"
            style={{ width: "100%", padding: 13, fontSize: "1rem", marginTop: 4, opacity: loading ? 0.7 : 1 }}
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p style={{ textAlign: "center", color: "#9ca3af", fontSize: "0.875rem", marginTop: 20 }}>
          Already have an account?{" "}
          <Link to="/signin" style={{ color: "#e63946", fontWeight: 600 }}>Sign In</Link>
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
    maxWidth: 420,
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
};
