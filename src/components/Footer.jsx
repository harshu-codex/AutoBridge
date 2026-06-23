import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div className="container">
        {/* Top row */}
        <div style={styles.topRow}>
          {/* Brand */}
          <div>
            <div style={styles.logo}>
              <span style={{ color: "#e63946" }}>Auto</span>Bridge
            </div>
            <p style={{ color: "#6b7280", fontSize: "0.875rem", marginTop: 8, maxWidth: 260 }}>
              India's trusted platform to buy and sell cars safely in Gujarat.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <p style={styles.colTitle}>Quick Links</p>
            {[
              { to: "/",        label: "Home" },
              { to: "/buy",     label: "Buy Cars" },
              { to: "/sell",    label: "Sell Car" },
              { to: "/about",   label: "About Us" },
              { to: "/contact", label: "Contact" },
            ].map((l) => (
              <Link key={l.to} to={l.to} style={styles.footLink}>{l.label}</Link>
            ))}
          </div>

          {/* Contact */}
          <div>
            <p style={styles.colTitle}>Contact</p>
            <p style={styles.footText}>📍 Ahmedabad, Gujarat</p>
            <p style={styles.footText}>📞 +91-98765-43210</p>
            <p style={styles.footText}>✉️ support@autobridge.in</p>
          </div>
        </div>

        {/* Bottom row */}
        <div style={styles.bottomRow}>
          <p style={{ color: "#4b5563", fontSize: "0.8rem" }}>
            © {new Date().getFullYear()} AutoBridge. Made with ❤️ in Gujarat.
          </p>
          <Link to="/admin/login" style={{ color: "#374151", fontSize: "0.75rem" }}>
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    backgroundColor: "#0a0a14",
    borderTop: "1px solid rgba(255,255,255,0.07)",
    paddingTop: 48,
    paddingBottom: 24,
    marginTop: 40,
  },
  topRow: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr 1fr",
    gap: 40,
    marginBottom: 40,
  },
  logo: {
    fontSize: "1.3rem",
    fontWeight: 800,
    color: "#fff",
  },
  colTitle: {
    color: "#fff",
    fontWeight: 700,
    fontSize: "0.9rem",
    marginBottom: 12,
  },
  footLink: {
    display: "block",
    color: "#6b7280",
    fontSize: "0.85rem",
    marginBottom: 8,
    transition: "color 0.2s",
  },
  footText: {
    color: "#6b7280",
    fontSize: "0.85rem",
    marginBottom: 8,
  },
  bottomRow: {
    borderTop: "1px solid rgba(255,255,255,0.06)",
    paddingTop: 20,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
};
