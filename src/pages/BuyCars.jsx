import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../firebase/config";

export default function BuyCars() {
  const [cars, setCars]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [fuelFilter, setFuel]   = useState("All");
  const [maxPrice, setMaxPrice] = useState(5000000);

  const FUELS = ["All", "Petrol", "Diesel", "Electric", "CNG"];

  // Load approved listings from Firestore on page load
  useEffect(() => {
    async function loadCars() {
      try {
      
        const q = query(
          collection(db, "listings"),
          where("status", "==", "approved"),
          orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);

        // Convert each document to a plain object with its ID
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCars(data);
      } catch (err) {
        console.error("Error loading cars:", err);
      } finally {
        setLoading(false);
      }
    }
    loadCars();
  }, []); 

  // Filter cars based on search text, fuel, and price
  const filtered = cars.filter((car) => {
    const matchSearch =
      !search ||
      car.carTitle?.toLowerCase().includes(search.toLowerCase()) ||
      car.city?.toLowerCase().includes(search.toLowerCase());

    const matchFuel = fuelFilter === "All" || car.fuel === fuelFilter;
    const matchPrice = Number(car.price) <= maxPrice;

    return matchSearch && matchFuel && matchPrice;
  });

  function formatPrice(p) {
    return `₹${(Number(p) / 100000).toFixed(1)}L`;
  }

  return (
    <div className="page section">
      <div className="container">
        <h1 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: 6 }}>
          Browse <span style={{ color: "#e63946" }}>Cars</span>
        </h1>
        <p style={{ color: "#9ca3af", marginBottom: 28 }}>
          {filtered.length} verified cars available
        </p>

        {/* ── Filters Row ──────────── */}
        <div style={styles.filtersRow}>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 Search by car name or city..."
            className="input"
            style={{ flex: 2, minWidth: 200 }}
          />

          {/* Fuel dropdown */}
          <select
            value={fuelFilter}
            onChange={(e) => setFuel(e.target.value)}
            className="input"
            style={{ flex: 1, minWidth: 120 }}
          >
            {FUELS.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>

          {/* Price range */}
          <div style={{ flex: 1.5, minWidth: 180 }}>
            <p style={{ color: "#9ca3af", fontSize: "0.78rem", marginBottom: 4 }}>
              Max price: {formatPrice(maxPrice)}
            </p>
            <input
              type="range"
              min={100000}
              max={5000000}
              step={50000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              style={{ width: "100%", accentColor: "#e63946" }}
            />
          </div>

          {/* Reset button */}
          <button
            onClick={() => { setSearch(""); setFuel("All"); setMaxPrice(5000000); }}
            className="btn-outline"
            style={{ padding: "10px 16px", fontSize: "0.85rem", whiteSpace: "nowrap" }}
          >
            Reset
          </button>
        </div>

        {/* ── Loading state ────── */}
        {loading && (
          <div style={{ textAlign: "center", padding: 60, color: "#9ca3af" }}>
            Loading cars...
          </div>
        )}

        {/* ── Empty state ────────── */}
        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: 60 }}>
            <div style={{ fontSize: "3rem", marginBottom: 12 }}>🚗</div>
            <p style={{ color: "#9ca3af" }}>No cars found. Try different filters.</p>
          </div>
        )}

        {/* ── Car Grid ───────── */}
        {!loading && filtered.length > 0 && (
          <div className="grid-3">
            {filtered.map((car) => (
              <CarCard key={car.id} car={car} formatPrice={formatPrice} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CarCard({ car, formatPrice }) {
  const [showContact, setShowContact] = useState(false);

  return (
    <div className="card" style={{ padding: 0, overflow: "hidden" }}>
      {/* Car image */}
      <div style={styles.imgBox}>
        <img
          src={car.imageUrl || `https://placehold.co/400x220/16213e/e63946?text=${encodeURIComponent(car.carTitle || "Car")}`}
          alt={car.carTitle}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          onError={(e) => { e.target.src = `https://placehold.co/400x220/16213e/e63946?text=Car`; }}
        />
        {/* Badge */}
        <span style={styles.badge}>✅ Verified</span>
      </div>

      {/* Car details */}
      <div style={{ padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
          <h3 style={{ fontSize: "0.95rem", fontWeight: 700, flex: 1 }}>{car.carTitle}</h3>
          <span style={{ color: "#e63946", fontWeight: 800, fontSize: "1rem", marginLeft: 8 }}>
            {formatPrice(car.price)}
          </span>
        </div>

        {/* Specs row */}
        <div style={styles.specsRow}>
          <span>📅 {car.year}</span>
          <span>⛽ {car.fuel}</span>
          <span>⚙️ {car.transmission}</span>
          <span>📍 {car.city}</span>
        </div>

        <hr className="divider" />

        {/* Seller + contact */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ fontSize: "0.75rem", color: "#6b7280" }}>Seller</p>
            <p style={{ fontSize: "0.875rem", fontWeight: 600 }}>{car.sellerName}</p>
          </div>
          <button
            onClick={() => setShowContact(!showContact)}
            className="btn-red"
            style={{ padding: "7px 16px", fontSize: "0.82rem" }}
          >
            Contact
          </button>
        </div>

        {/* Show phone when contact clicked */}
        {showContact && (
          <div style={styles.contactBox}>
            📞 {car.phone} &nbsp;|&nbsp; ✉️ {car.email}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  filtersRow: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
    marginBottom: 28,
    alignItems: "flex-end",
  },
  imgBox: {
    height: 200,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#0a0a14",
  },
  badge: {
    position: "absolute",
    top: 10,
    left: 10,
    background: "rgba(42,157,143,0.85)",
    color: "#fff",
    padding: "3px 10px",
    borderRadius: 20,
    fontSize: "0.7rem",
    fontWeight: 700,
  },
  specsRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
  },
  contactBox: {
    marginTop: 10,
    background: "rgba(230,57,70,0.08)",
    border: "1px solid rgba(230,57,70,0.2)",
    borderRadius: 8,
    padding: "8px 12px",
    fontSize: "0.82rem",
    color: "#d1d5db",
  },
};
