import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";

export default function Contact() {
  const [form, setForm]     = useState({ name: "", email: "", phone: "", subject: "General Inquiry", message: "" });
  const [loading, setLoading] = useState(false);
  const [done, setDone]     = useState(false);
  const [error, setError]   = useState("");

  const SUBJECTS = ["General Inquiry", "Buying a Car", "Selling a Car", "Inspection Request", "Report a Problem"];

  function handleChange(field, value) {
    setForm((p) => ({ ...p, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.email || !form.message.trim()) {
      setError("Please fill in Name, Email, and Message.");
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, "contacts"), {
        ...form,
        status: "unread",
        createdAt: serverTimestamp(),
      });
      setDone(true);
    } catch (err) {
      setError("Failed to send. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="page section" style={{ textAlign: "center" }}>
        <div className="container" style={{ maxWidth: 480 }}>
          <div style={{ fontSize: "3.5rem", marginBottom: 12 }}>📬</div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: 10 }}>Message Sent!</h2>
          <p style={{ color: "#9ca3af" }}>We'll reply to <strong style={{ color: "#fff" }}>{form.email}</strong> within 24 hours.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page section">
      <div className="container" style={{ maxWidth: 600 }}>
        <h1 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: 6 }}>
          Contact <span style={{ color: "#e63946" }}>Us</span>
        </h1>
        <p style={{ color: "#9ca3af", marginBottom: 28 }}>We reply within 24 hours on working days.</p>

        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 28 }}>
          {[
            { icon: "📍", text: "Ahmedabad, Gujarat" },
            { icon: "📞", text: "+91-98765-43210" },
            { icon: "✉️", text: "support@autobridge.in" },
          ].map((c) => (
            <div key={c.text} style={{ display: "flex", gap: 8, alignItems: "center", color: "#9ca3af", fontSize: "0.875rem" }}>
              <span>{c.icon}</span><span>{c.text}</span>
            </div>
          ))}
        </div>

        <div style={{ background: "#16213e", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: 28 }}>
          {error && <div style={{ background: "rgba(230,57,70,0.1)", border: "1px solid rgba(230,57,70,0.3)", borderRadius: 8, padding: "10px 14px", color: "#e63946", fontSize: "0.875rem", marginBottom: 16 }}>⚠️ {error}</div>}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div className="grid-2">
              <div>
                <label className="label">Name *</label>
                <input type="text" value={form.name} onChange={(e) => handleChange("name", e.target.value)} placeholder="Your name" className="input" />
              </div>
              <div>
                <label className="label">Email *</label>
                <input type="email" value={form.email} onChange={(e) => handleChange("email", e.target.value)} placeholder="you@email.com" className="input" />
              </div>
            </div>
            <div className="grid-2">
              <div>
                <label className="label">Phone</label>
                <input type="tel" value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} placeholder="Optional" className="input" />
              </div>
              <div>
                <label className="label">Subject</label>
                <select value={form.subject} onChange={(e) => handleChange("subject", e.target.value)} className="input">
                  {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="label">Message *</label>
              <textarea value={form.message} onChange={(e) => handleChange("message", e.target.value)} placeholder="How can we help you?" className="input" rows={4} style={{ resize: "vertical" }} />
            </div>
            <button type="submit" className="btn-red" style={{ padding: 13, fontSize: "1rem", opacity: loading ? 0.7 : 1 }} disabled={loading}>
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
