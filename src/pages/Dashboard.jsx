import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../context/AuthContext";

const STATUS_COLORS = {
  pending:  { bg: "rgba(244,162,97,0.15)",  color: "#f4a261" },
  approved: { bg: "rgba(42,157,143,0.15)",  color: "#2a9d8f" },
  rejected: { bg: "rgba(230,57,70,0.15)",   color: "#e63946" },
};

export default function Dashboard() {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading]   = useState(true);

  // Load this user's listings from Firestore
  useEffect(() => {
    async function load() {
      try {
        const q = query(
          collection(db, "listings"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );
        const snap = await getDocs(q);
        setListings(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user.uid]);

  function formatPrice(p) {
    return `₹${(Number(p) / 100000).toFixed(1)}L`;
  }

  function formatDate(ts) {
    if (!ts) return "—";
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  }

  return (
    <div className="page section">
      <div className="container">

        {/* Welcome header */}
        <div style={styles.header}>
          <div>
            <h1 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: 4 }}>
              Welcome, {user?.displayName || "User"} 👋
            </h1>
            <p style={{ color: "#9ca3af" }}>{user?.email}</p>
          </div>
          <Link to="/sell" className="btn-red">+ List a Car</Link>
        </div>

        {/* My Listings */}
        <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: 16 }}>
          My Listings ({listings.length})
        </h2>

        {loading && <p style={{ color: "#9ca3af" }}>Loading...</p>}

        {!loading && listings.length === 0 && (
          <div style={styles.emptyBox}>
            <p style={{ fontSize: "2.5rem", marginBottom: 10 }}>🚗</p>
            <p style={{ color: "#9ca3af", marginBottom: 20 }}>
              You haven't listed any cars yet.
            </p>
            <Link to="/sell" className="btn-red">Sell My First Car</Link>
          </div>
        )}

        {/* Listings table */}
        {!loading && listings.length > 0 && (
          <div style={styles.tableBox}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.theadRow}>
                  <th style={styles.th}>Car</th>
                  <th style={styles.th}>Price</th>
                  <th style={styles.th}>Submitted</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {listings.map((l) => {
                  const sc = STATUS_COLORS[l.status] || STATUS_COLORS.pending;
                  return (
                    <tr key={l.id} style={styles.tr}>
                      <td style={styles.td}>
                        <p style={{ fontWeight: 600, margin: 0 }}>{l.carTitle}</p>
                        <p style={{ color: "#9ca3af", fontSize: "0.78rem", margin: 0 }}>
                          {l.year} · {l.fuel} · {l.city}
                        </p>
                      </td>
                      <td style={{ ...styles.td, color: "#e63946", fontWeight: 700 }}>
                        {formatPrice(l.price)}
                      </td>
                      <td style={{ ...styles.td, color: "#9ca3af", fontSize: "0.82rem" }}>
                        {formatDate(l.createdAt)}
                      </td>
                      <td style={styles.td}>
                        <span style={{
                          background: sc.bg,
                          color: sc.color,
                          padding: "3px 10px",
                          borderRadius: 20,
                          fontSize: "0.72rem",
                          fontWeight: 700,
                          textTransform: "capitalize",
                        }}>
                          {l.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Status guide */}
        <div style={styles.guide}>
          <p style={{ fontWeight: 600, marginBottom: 10, fontSize: "0.9rem" }}>Status Guide:</p>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            <span>⏳ <strong>Pending</strong> — Admin is reviewing</span>
            <span>✅ <strong>Approved</strong> — Live on Buy Cars page</span>
            <span>❌ <strong>Rejected</strong> — Did not meet requirements</span>
          </div>
        </div>

      </div>
    </div>
  );
}

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 32,
    padding: 24,
    background: "#16213e",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.08)",
  },
  emptyBox: {
    textAlign: "center",
    padding: "60px 20px",
    background: "#16213e",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.08)",
  },
  tableBox: {
    background: "#16213e",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 20,
  },
  table: { width: "100%", borderCollapse: "collapse" },
  theadRow: { borderBottom: "1px solid rgba(255,255,255,0.08)" },
  th: {
    padding: "12px 16px",
    textAlign: "left",
    color: "#6b7280",
    fontSize: "0.75rem",
    fontWeight: 600,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
  },
  tr: { borderBottom: "1px solid rgba(255,255,255,0.04)" },
  td: { padding: "14px 16px", verticalAlign: "middle" },
  guide: {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 10,
    padding: "14px 18px",
    color: "#9ca3af",
    fontSize: "0.85rem",
  },
};
