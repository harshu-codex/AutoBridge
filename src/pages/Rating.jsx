import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs, orderBy, query, serverTimestamp, where } from "firebase/firestore";
import { db } from "../firebase/config";

function Stars({ value, onChange, readonly }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span
          key={s}
          onClick={() => !readonly && onChange && onChange(s)}
          onMouseEnter={() => !readonly && setHover(s)}
          onMouseLeave={() => !readonly && setHover(0)}
          style={{
            fontSize: readonly ? "1rem" : "1.4rem",
            color: s <= (hover || value) ? "#fbbf24" : "#374151",
            cursor: readonly ? "default" : "pointer",
            transition: "color 0.3s",
          }}
        >★</span>
      ))}
    </div>
  );
}

export  function Rating() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", city: "", role: "Buyer", rating: 0, comment: "" });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  // Load  reviews from Firestore
  useEffect(() => {
    async function load() {
      try {
       const snap = await getDocs(collection(db, "reviews"));
        setReviews(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleSubmit(e) {
    setError("");
    e.preventDefault();
    if (!form.name.trim()) return setError("Name is required");
    if (form.rating === 0) return setError("Please select a rating");
    if (form.comment.length < 10) return setError("Comment must be at least 10 characters");
    const newReview = {
      ...form,
      id: crypto.randomUUID,
      status: "published",
    };

    setSubmitting(true);

    try {
      await addDoc(collection(db, "reviews"), {
        ...newReview,
        createdAt: serverTimestamp(),
      });

      setReviews((prev) => [newReview, ...prev]);
      setDone(true);
    } catch (err) {
      console.error(err);
      setError("Failed to submit review");
    } finally {
      setSubmitting(false);
    }

    setReviews((prev) => [newReview, ...prev]);
    setDone(true);
    setTimeout(() => {
      setDone(false);
    }, 3000);
  }
  const avg = reviews.length ? (reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / reviews.length).toFixed(1) : "0.0";

  return (
    <div className="page section">
      <div className="container">
        <h1 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: 6, textAlign: "center" }}>
          Customer <span style={{ color: "#e63946" }}>Reviews</span>
        </h1>
        <p style={{ textAlign: "center", color: "#9ca3af", marginBottom: 32 }}>
          ⭐ {avg} average from {reviews.length} reviews
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 28, alignItems: "start" }}>
          {/* Reviews List */}
          <div>
            {loading && <p style={{ color: "#9ca3af" }}>Loading reviews...</p>}
            {!loading && reviews.length === 0 && <p style={{ color: "#9ca3af" }}>No reviews yet. Be the first!</p>}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {reviews.map((r) => (
                <div key={r.id} className="card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                    <div>
                      <p style={{ fontWeight: 700, margin: 0 }}>{r.name}</p>
                      <p style={{ color: "#9ca3af", fontSize: "0.78rem", margin: "2px 0 0" }}>{r.role} · {r.city}</p>
                    </div>
                    <Stars value={r.rating} readonly />
                  </div>
                  <p style={{ color: "#d1d5db", fontSize: "0.9rem", lineHeight: 1.6, margin: 0 }}>"{r.comment}"</p>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Review Form */}
          <div style={{ background: "#16213e", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: 24, position: "sticky", top: 80 }}>
            <h3 style={{ fontWeight: 700, marginBottom: 16, fontSize: "1rem" }}>Write a Review</h3>
            {done ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ fontSize: "2.5rem", marginBottom: 8 }}>🎉</div>
                <p style={{ color: "#2a9d8f", fontWeight: 600 }}>Review submitted!</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {error && <p style={{ color: "#e63946", fontSize: "0.82rem" }}>⚠️ {error}</p>}
                <div className="input-group">
                  <label className="label">Name *</label>
                  <input type="text" value={form.name} onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Your name" className="input" />
                </div>
                <div className="grid-2">
                  <div className="input-group">
                    <label className="label">City</label>
                    <input type="text" value={form.city} onChange={(e) => setForm(p => ({ ...p, city: e.target.value }))} placeholder="Ahmedabad" className="input" />
                  </div>
                  <div className="input-group">
                    <label className="label">I am a</label>
                    <select value={form.role} onChange={(e) => setForm(p => ({ ...p, role: e.target.value }))} className="input">
                      <option>Buyer</option>
                      <option>Seller</option>
                    </select>
                  </div>
                </div>
                <div className="input-group">
                  <label className="label">Rating *</label>
                  <Stars value={form.rating} onChange={(v) => setForm(p => ({ ...p, rating: v }))} />
                </div>
                <div className="input-group">
                  <label className="label">Review *</label>
                  <textarea value={form.comment} onChange={(e) => setForm(p => ({ ...p, comment: e.target.value }))} placeholder="Share your experience..." className="input" rows={3} style={{ resize: "vertical" }} />
                </div>
                <button type="submit" className="btn-red" style={{ padding: 11, opacity: submitting ? 0.7 : 1 }} disabled={submitting}>
                  {submitting ? "Posting..." : "Post Review"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}