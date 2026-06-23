import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../context/AuthContext";

const YEARS = Array.from(
  { length: new Date().getFullYear() - 1999 },
  (_, i) => new Date().getFullYear() - i
);

const FUELS         = ["Petrol", "Diesel", "Electric", "Hybrid", "CNG"];
const TRANSMISSIONS = ["Manual", "Automatic"];
const CATEGORIES    = ["Hatchback", "Sedan", "SUV", "Electric", "Luxury", "Pickup"];

export default function SellCar() {
  const { user } = useAuth();

  const [form, setForm] = useState({
    carTitle: "",
    year: "",
    km: "",
    price: "",
    fuel: "",
    transmission: "",
    category: "",
    description: "",
    city: "",
    phone: "",
  });

  const [errors, setErrors]   = useState({});  
  const [loading, setLoading] = useState(false);
  const [done, setDone]       = useState(false); 

  // Update a single field in the form object
  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  }

  // Required fields
  function validate() {
    const e = {};
    if (!form.carTitle.trim()) e.carTitle = "Car name is required";
    if (!form.year)            e.year     = "Select year";
    if (!form.km || form.km < 0) e.km    = "Enter valid KM";
    if (!form.price || form.price < 1) e.price = "Enter asking price";
    if (!form.fuel)            e.fuel     = "Select fuel type";
    if (!form.transmission)    e.transmission = "Select transmission";
    if (!form.city.trim())     e.city     = "Enter your city";
    if (!form.phone.match(/^\d{10}$/)) e.phone = "Enter 10-digit phone";
    return e;
  }

  // Submit the form → save to Firestore
  async function handleSubmit(e) {
    e.preventDefault();

    // Validate first
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      // Save to Firestore "listings" collection
      // addDoc creates a new document with an auto-generated ID
      await addDoc(collection(db, "listings"), {
        ...form,                            // all form fields
        sellerName: user.displayName || "User", // from Firebase auth
        email: user.email,                  // from Firebase auth
        userId: user.uid,                   // who submitted it
        status: "pending",                  // admin will review this
        createdAt: serverTimestamp(),       // Firestore server time
      });

      setDone(true); // show success screen
    } catch (err) {
      console.error("Error submitting:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // ── Success screen
  if (done) {
    return (
      <div className="page section">
        <div className="container" style={{ maxWidth: 500, textAlign: "center" }}>
          <div style={{ fontSize: "4rem", marginBottom: 16 }}>🎉</div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: 12 }}>
            Listing Submitted!
          </h2>
          <p style={{ color: "#9ca3af", lineHeight: 1.7, marginBottom: 24 }}>
            Your car has been submitted for review. Our team will contact you
            at <strong style={{ color: "#fff" }}>{form.phone}</strong> within 24 hours.
          </p>
          <button
            onClick={() => { setDone(false); setForm({ carTitle:"",year:"",km:"",price:"",fuel:"",transmission:"",category:"",description:"",city:"",phone:"" }); }}
            className="btn-red"
          >
            List Another Car
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page section">
      <div className="container" style={{ maxWidth: 700 }}>
        <h1 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: 6 }}>
          Sell Your <span style={{ color: "#e63946" }}>Car</span>
        </h1>
        <p style={{ color: "#9ca3af", marginBottom: 32 }}>
          Fill in your car details. Our team will review and list it within 24 hours.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={styles.formBox}>

            {/* Car Title */}
            <div>
              <label className="label">Car Name *</label>
              <input
                type="text"
                value={form.carTitle}
                onChange={(e) => handleChange("carTitle", e.target.value)}
                placeholder="e.g. Maruti Swift VXi 2021"
                className="input"
              />
              {errors.carTitle && <p className="error-text">{errors.carTitle}</p>}
            </div>

            {/* Year + KM */}
            <div className="grid-2">
              <div>
                <label className="label">Year *</label>
                <select value={form.year} onChange={(e) => handleChange("year", e.target.value)} className="input">
                  <option value="">Select Year</option>
                  {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
                {errors.year && <p className="error-text">{errors.year}</p>}
              </div>
              <div>
                <label className="label">Kilometres Driven *</label>
                <input type="number" value={form.km} onChange={(e) => handleChange("km", e.target.value)} placeholder="e.g. 28000" className="input" min="0" />
                {errors.km && <p className="error-text">{errors.km}</p>}
              </div>
            </div>

            {/* Price + Fuel */}
            <div className="grid-2">
              <div>
                <label className="label">Asking Price (₹) *</label>
                <input type="number" value={form.price} onChange={(e) => handleChange("price", e.target.value)} placeholder="e.g. 485000" className="input" min="1" />
                {errors.price && <p className="error-text">{errors.price}</p>}
              </div>
              <div>
                <label className="label">Fuel Type *</label>
                <select value={form.fuel} onChange={(e) => handleChange("fuel", e.target.value)} className="input">
                  <option value="">Select Fuel</option>
                  {FUELS.map((f) => <option key={f} value={f}>{f}</option>)}
                </select>
                {errors.fuel && <p className="error-text">{errors.fuel}</p>}
              </div>
            </div>

            {/* Transmission + Category */}
            <div className="grid-2">
              <div>
                <label className="label">Transmission *</label>
                <select value={form.transmission} onChange={(e) => handleChange("transmission", e.target.value)} className="input">
                  <option value="">Select</option>
                  {TRANSMISSIONS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                {errors.transmission && <p className="error-text">{errors.transmission}</p>}
              </div>
              <div>
                <label className="label">Category</label>
                <select value={form.category} onChange={(e) => handleChange("category", e.target.value)} className="input">
                  <option value="">Select</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {/* City + Phone */}
            <div className="grid-2">
              <div>
                <label className="label">Your City *</label>
                <input type="text" value={form.city} onChange={(e) => handleChange("city", e.target.value)} placeholder="Ahmedabad" className="input" />
                {errors.city && <p className="error-text">{errors.city}</p>}
              </div>
              <div>
                <label className="label">Phone Number *</label>
                <input type="tel" value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} placeholder="9876543210" className="input" maxLength={10} />
                {errors.phone && <p className="error-text">{errors.phone}</p>}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="label">Description (optional)</label>
              <textarea
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Condition, service history, reason for selling..."
                className="input"
                rows={3}
                style={{ resize: "vertical" }}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn-red"
              style={{ width: "100%", padding: 14, fontSize: "1rem", opacity: loading ? 0.7 : 1 }}
              disabled={loading}
            >
              {loading ? "Submitting..." : "🚀 Submit My Car"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  formBox: {
    background: "#16213e",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 16,
    padding: 28,
    display: "flex",
    flexDirection: "column",
    gap: 18,
  },
};
