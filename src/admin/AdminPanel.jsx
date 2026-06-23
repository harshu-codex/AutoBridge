import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection, getDocs, updateDoc, deleteDoc,
  doc, orderBy, query, onSnapshot
} from "firebase/firestore";
import { db } from "../firebase/config";

// ── Simple badge component
function Badge({ status }) {
  const map = {
    pending:   { bg: "rgba(244,162,97,0.2)",  color: "#f4a261" },
    approved:  { bg: "rgba(42,157,143,0.2)",  color: "#2a9d8f" },
    rejected:  { bg: "rgba(230,57,70,0.2)",   color: "#e63946" },
    unread:    { bg: "rgba(230,57,70,0.2)",   color: "#e63946" },
    read:      { bg: "rgba(100,149,237,0.2)", color: "#6495ED" },
    resolved:  { bg: "rgba(42,157,143,0.2)",  color: "#2a9d8f" },
    published: { bg: "rgba(42,157,143,0.2)",  color: "#2a9d8f" },
    hidden:    { bg: "rgba(255,255,255,0.08)", color: "#6b7280" },
  };
  const s = map[status] || map.pending;
  return (
    <span style={{ background: s.bg, color: s.color, padding: "3px 10px", borderRadius: 20, fontSize: "0.72rem", fontWeight: 700, textTransform: "capitalize" }}>
      {status}
    </span>
  );
}

// ── Format Firestore timestamp
function formatDate(ts) {
  if (!ts) return "—";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

// ── Format price
function fmtPrice(p) {
  return p ? `₹${(Number(p) / 100000).toFixed(1)}L` : "—";
}

export default function AdminPanel() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("dashboard"); // active tab

  // Data state
  const [listings, setListings] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [reviews,  setReviews]  = useState([]);
  const [loading,  setLoading]  = useState(true);

  // Load all data from Firestore using real-time listeners (onSnapshot)
  useEffect(() => {
    // Listings
    const unsubListings = onSnapshot(
      query(collection(db, "listings"), orderBy("createdAt", "desc")),
      (snap) => setListings(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );
    // Contacts
    const unsubContacts = onSnapshot(
      query(collection(db, "contacts"), orderBy("createdAt", "desc")),
      (snap) => setContacts(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );
    // Reviews
    const unsubReviews = onSnapshot(
      query(collection(db, "reviews"), orderBy("createdAt", "desc")),
      (snap) => {
        setReviews(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      }
    );
    // Cleanup listeners when component unmounts
    return () => { unsubListings(); unsubContacts(); unsubReviews(); };
  }, []);

  // ── Update a document field in Firestore
  async function updateField(collectionName, docId, field, value) {
    await updateDoc(doc(db, collectionName, docId), { [field]: value });
  }

  // ── Delete a document
  async function deleteItem(collectionName, docId) {
    if (window.confirm("Delete permanently?")) {
      await deleteDoc(doc(db, collectionName, docId));
    }
  }

  // ── Admin logout
  function handleLogout() {
    localStorage.removeItem("isAdmin");
    navigate("/admin/login");
  }

  // ── Stats for dashboard tab
  const stats = {
    totalListings:   listings.length,
    pendingListings: listings.filter((l) => l.status === "pending").length,
    totalMessages:   contacts.length,
    unreadMessages:  contacts.filter((c) => c.status === "unread").length,
    totalReviews:    reviews.length,
  };

  // ── Tab buttons
  const TABS = [
    { id: "dashboard", label: "📊 Dashboard" },
    { id: "listings",  label: `🚗 Listings ${stats.pendingListings > 0 ? `(${stats.pendingListings} pending)` : ""}` },
    { id: "messages",  label: `📬 Messages ${stats.unreadMessages > 0 ? `(${stats.unreadMessages} unread)` : ""}` },
    { id: "reviews",   label: "⭐ Reviews" },
  ];

  return (
    <div style={styles.page}>
      {/* ── Sidebar ──────────────────────────── */}
      <aside style={styles.sidebar}>
        <div style={styles.sidebarLogo}>
          <span style={{ color: "#e63946" }}>Auto</span>Bridge
          <span style={{ fontSize: "0.65rem", color: "#6b7280", display: "block", marginTop: 2 }}>ADMIN</span>
        </div>

        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              ...styles.sidebarBtn,
              background: tab === t.id ? "rgba(230,57,70,0.15)" : "transparent",
              color: tab === t.id ? "#e63946" : "#9ca3af",
              borderLeft: `3px solid ${tab === t.id ? "#e63946" : "transparent"}`,
            }}
          >
            {t.label}
          </button>
        ))}

        <div style={{ marginTop: "auto", padding: "16px 16px 0" }}>
          <a href="/" target="_blank" rel="noreferrer" style={{ color: "#6b7280", fontSize: "0.78rem", display: "block", marginBottom: 8 }}>🌐 View Site</a>
          <button onClick={handleLogout} style={{ color: "#e63946", background: "none", border: "1px solid rgba(230,57,70,0.2)", borderRadius: 6, padding: "7px 14px", cursor: "pointer", fontSize: "0.82rem", width: "100%" }}>
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main Content ─────────────────────── */}
      <main style={styles.main}>
        {loading ? (
          <p style={{ color: "#9ca3af", padding: 40 }}>Loading data...</p>
        ) : (
          <>
            {/* DASHBOARD TAB */}
            {tab === "dashboard" && <DashboardTab stats={stats} />}

            {/* LISTINGS TAB */}
            {tab === "listings" && (
              <ListingsTab
                listings={listings}
                onApprove={(id) => updateField("listings", id, "status", "approved")}
                onReject={(id)  => updateField("listings", id, "status", "rejected")}
                onDelete={(id)  => deleteItem("listings", id)}
                fmtPrice={fmtPrice}
                formatDate={formatDate}
              />
            )}

            {/* MESSAGES TAB */}
            {tab === "messages" && (
              <MessagesTab
                contacts={contacts}
                onRead={(id)     => updateField("contacts", id, "status", "read")}
                onResolve={(id)  => updateField("contacts", id, "status", "resolved")}
                onDelete={(id)   => deleteItem("contacts", id)}
                formatDate={formatDate}
              />
            )}

            {/* REVIEWS TAB */}
            {tab === "reviews" && (
              <ReviewsTab
                reviews={reviews}
                onHide={(id)    => updateField("reviews", id, "status", "hidden")}
                onShow={(id)    => updateField("reviews", id, "status", "published")}
                onDelete={(id)  => deleteItem("reviews", id)}
                formatDate={formatDate}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}

// ─────────────────────────────────────────────
// Sub-components for each tab (all in same file
// for simplicity - easier for beginners to read)
// ─────────────────────────────────────────────

// ── Dashboard Tab
function DashboardTab({ stats }) {
  const items = [
    { icon: "🚗", label: "Total Listings",   value: stats.totalListings },
    { icon: "⏳", label: "Pending Review",   value: stats.pendingListings },
    { icon: "📬", label: "Total Messages",   value: stats.totalMessages },
    { icon: "🔴", label: "Unread Messages",  value: stats.unreadMessages },
    { icon: "⭐", label: "Total Reviews",    value: stats.totalReviews },
  ];
  return (
    <div>
      <h2 style={styles.pageTitle}>Dashboard</h2>
      <p style={{ color: "#9ca3af", marginBottom: 24 }}>Live overview of your platform data.</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
        {items.map((item) => (
          <div key={item.label} style={styles.statCard}>
            <div style={{ fontSize: "1.8rem", marginBottom: 6 }}>{item.icon}</div>
            <p style={{ fontSize: "1.8rem", fontWeight: 800, color: "#e63946", margin: 0 }}>{item.value}</p>
            <p style={{ color: "#9ca3af", fontSize: "0.82rem", margin: "4px 0 0" }}>{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Listings Tab
function ListingsTab({ listings, onApprove, onReject, onDelete, fmtPrice, formatDate }) {
  const [filter, setFilter] = useState("all");
  const filtered = listings.filter((l) => filter === "all" || l.status === filter);

  return (
    <div>
      <h2 style={styles.pageTitle}>Car Listings ({listings.length})</h2>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {["all","pending","approved","rejected"].map((f) => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: "6px 16px", borderRadius: 20, border: `1.5px solid ${filter === f ? "#e63946" : "rgba(255,255,255,0.12)"}`, background: filter === f ? "rgba(230,57,70,0.1)" : "transparent", color: filter === f ? "#e63946" : "#9ca3af", cursor: "pointer", fontWeight: 600, fontSize: "0.8rem", textTransform: "capitalize" }}>
            {f} ({f === "all" ? listings.length : listings.filter(l => l.status === f).length})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? <p style={{ color: "#9ca3af" }}>No listings here.</p> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map((l) => (
            <div key={l.id} style={styles.listItem}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", marginBottom: 4 }}>
                  <strong>{l.carTitle}</strong>
                  <Badge status={l.status} />
                  <span style={{ color: "#e63946", fontWeight: 700 }}>{fmtPrice(l.price)}</span>
                </div>
                <p style={{ color: "#9ca3af", fontSize: "0.8rem", margin: 0 }}>
                  {l.year} · {l.fuel} · {l.transmission} · {l.city} · by {l.sellerName} · {l.phone} · {formatDate(l.createdAt)}
                </p>
                {l.description && <p style={{ color: "#6b7280", fontSize: "0.78rem", margin: "4px 0 0" }}>{l.description}</p>}
              </div>
              <div style={{ display: "flex", gap: 6, flexShrink: 0, flexWrap: "wrap" }}>
                {l.status !== "approved" && (
                  <button onClick={() => onApprove(l.id)} style={styles.btnGreen}>✅ Approve</button>
                )}
                {l.status !== "rejected" && (
                  <button onClick={() => onReject(l.id)} style={styles.btnOrange}>❌ Reject</button>
                )}
                <button onClick={() => onDelete(l.id)} style={styles.btnRed}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Messages Tab
function MessagesTab({ contacts, onRead, onResolve, onDelete, formatDate }) {
  const [selected, setSelected] = useState(null);

  return (
    <div>
      <h2 style={styles.pageTitle}>Messages ({contacts.length})</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {contacts.length === 0 && <p style={{ color: "#9ca3af" }}>No messages yet.</p>}
        {contacts.map((c) => (
          <div key={c.id} style={{ ...styles.listItem, borderLeft: `3px solid ${c.status === "unread" ? "#e63946" : "rgba(255,255,255,0.06)"}`, cursor: "pointer" }} onClick={() => { setSelected(selected?.id === c.id ? null : c); onRead(c.id); }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", marginBottom: 4 }}>
                <strong>{c.name}</strong>
                <Badge status={c.status} />
                <span style={{ color: "#9ca3af", fontSize: "0.8rem" }}>{c.subject}</span>
                <span style={{ color: "#6b7280", fontSize: "0.78rem" }}>{formatDate(c.createdAt)}</span>
              </div>
              <p style={{ color: "#9ca3af", fontSize: "0.8rem", margin: 0 }}>{c.email} · {c.phone || "No phone"}</p>
              {selected?.id === c.id && (
                <div style={{ marginTop: 10, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8, padding: 12 }}>
                  <p style={{ color: "#d1d5db", fontSize: "0.875rem", lineHeight: 1.65, margin: 0 }}>{c.message}</p>
                </div>
              )}
            </div>
            <div style={{ display: "flex", gap: 6, flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
              {c.status !== "resolved" && <button onClick={() => onResolve(c.id)} style={styles.btnGreen}>✅ Resolve</button>}
              <button onClick={() => onDelete(c.id)} style={styles.btnRed}>🗑️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Reviews Tab
function ReviewsTab({ reviews, onHide, onShow, onDelete, formatDate }) {
  return (
    <div>
      <h2 style={styles.pageTitle}>Reviews ({reviews.length})</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {reviews.length === 0 && <p style={{ color: "#9ca3af" }}>No reviews yet.</p>}
        {reviews.map((r) => (
          <div key={r.id} style={{ ...styles.listItem, opacity: r.status === "hidden" ? 0.55 : 1 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", marginBottom: 4 }}>
                <strong>{r.name}</strong>
                <Badge status={r.status || "published"} />
                <span style={{ color: "#fbbf24" }}>{"★".repeat(r.rating)}</span>
                <span style={{ color: "#9ca3af", fontSize: "0.78rem" }}>{r.role} · {r.city} · {formatDate(r.createdAt)}</span>
              </div>
              <p style={{ color: "#9ca3af", fontSize: "0.85rem", margin: 0 }}>"{r.comment}"</p>
            </div>
            <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
              {r.status === "published"
                ? <button onClick={() => onHide(r.id)} style={styles.btnOrange}>🙈 Hide</button>
                : <button onClick={() => onShow(r.id)} style={styles.btnGreen}>📢 Show</button>
              }
              <button onClick={() => onDelete(r.id)} style={styles.btnRed}>🗑️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Shared styles
const styles = {
  page: {
    display: "flex",
    minHeight: "100vh",
    background: "#0f0f1a",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    color: "#f0f0ff",
  },
  sidebar: {
    width: 220,
    background: "#0a0a14",
    borderRight: "1px solid rgba(255,255,255,0.07)",
    display: "flex",
    flexDirection: "column",
    padding: "0 0 20px",
    position: "sticky",
    top: 0,
    height: "100vh",
    overflowY: "auto",
    flexShrink: 0,
  },
  sidebarLogo: {
    padding: "20px 16px 16px",
    fontWeight: 800,
    fontSize: "1.2rem",
    borderBottom: "1px solid rgba(255,255,255,0.07)",
    marginBottom: 8,
  },
  sidebarBtn: {
    width: "100%",
    background: "none",
    border: "none",
    borderLeft: "3px solid transparent",
    padding: "11px 16px",
    textAlign: "left",
    cursor: "pointer",
    fontSize: "0.85rem",
    fontWeight: 500,
    transition: "all 0.15s",
  },
  main: {
    flex: 1,
    padding: 28,
    overflowX: "hidden",
  },
  pageTitle: {
    fontSize: "1.4rem",
    fontWeight: 700,
    marginBottom: 6,
  },
  statCard: {
    background: "#16213e",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 12,
    padding: "20px 24px",
    textAlign: "center",
    minWidth: 140,
  },
  listItem: {
    background: "#16213e",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 10,
    padding: "14px 16px",
    display: "flex",
    gap: 12,
    alignItems: "flex-start",
  },
  btnGreen:  { padding: "5px 12px", borderRadius: 6, background: "rgba(42,157,143,0.15)",  border: "1px solid rgba(42,157,143,0.3)",  color: "#2a9d8f", cursor: "pointer", fontSize: "0.78rem", fontWeight: 600 },
  btnOrange: { padding: "5px 12px", borderRadius: 6, background: "rgba(244,162,97,0.15)",  border: "1px solid rgba(244,162,97,0.3)",  color: "#f4a261", cursor: "pointer", fontSize: "0.78rem", fontWeight: 600 },
  btnRed:    { padding: "5px 12px", borderRadius: 6, background: "rgba(230,57,70,0.1)",    border: "1px solid rgba(230,57,70,0.2)",   color: "#e63946", cursor: "pointer", fontSize: "0.78rem", fontWeight: 600 },
};
