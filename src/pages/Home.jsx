import React from "react";
import { Link } from "react-router-dom";

const STATS = [
  { number: "12,000+", label: "Cars Sold" },
  { number: "50,000+", label: "Happy Customers" },
  { number: "99%", label: "Safe Deals" },
  { number: "25+", label: "Cities Covered" },
];

const HOW_IT_WORKS = [
  {
    icon: "fa-solid fa-magnifying-glass",
    step: "1",
    title: "Search Cars",
    desc: "Browse verified used cars based on your budget, brand, city and preferences.",
  },
  {
    icon: "fa-solid fa-clipboard-check",
    step: "2",
    title: "Inspection",
    desc: "Every vehicle undergoes a detailed inspection by certified experts.",
  },
  {
    icon: "fa-solid fa-handshake",
    step: "3",
    title: "Best Deal",
    desc: "We help negotiate fair prices and ensure a transparent transaction.",
  },
  {
    icon: "fa-solid fa-car-side",
    step: "4",
    title: "Drive Home",
    desc: "RC transfer, paperwork and delivery support handled by AutoBridge.",
  },
];

const trustItems = [
  {
    text: "Free Inspection",
    icon: "fa-solid fa-circle-check",
  },
  {
    text: "Safe Payment",
    icon: "fa-solid fa-shield-halved",
  },
  {
    text: "RC Transfer Help",
    icon: "fa-solid fa-file-contract",
  },
];

export default function Home() {
  return (
    <div className="page">
      {/* HERO */}
      <section style={styles.hero}>
        <div className="container">
          <div style={styles.heroContent}>
            <span style={styles.heroLabel}>
              India's Trusted Car Marketplace
            </span>

            <h1 style={styles.heroTitle}>
              Buy & Sell Cars with
              <br />
              <span style={{ color: "#e63946" }}>
                Complete Confidence
              </span>
            </h1>

            <p style={styles.heroSubtitle}>
              AutoBridge connects buyers and sellers with verified
              listings, professional inspections, safe payments and
              hassle-free ownership transfer.
            </p>

            <div style={styles.heroButtons}>
              <Link
                to="/buy"
                className="btn-red"
                style={styles.heroBtn}
              >
                Browse Cars
              </Link>

              <Link
                to="/sell"
                className="btn-outline"
                style={styles.heroBtn}
              >
                Sell My Car
              </Link>
            </div>

            <div style={styles.trustRow}>
              {trustItems.map((item) => (
                <div key={item.text} style={styles.trustItem}>
                  <i
                    className={item.icon}
                    style={{ color: "#e63946" }}
                  ></i>
                  {item.text}
                </div>
              ))}
            </div>

            <div style={styles.heroImageWrapper}>
              <img
                src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1400&auto=format&fit=crop"
                alt="Car"
                style={styles.heroImage}
              />
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section
        className="section"
        style={{ backgroundColor: "#0a0a14" }}
      >
        <div className="container">
          <div className="grid-4">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="card"
                style={styles.statCard}
              >
                <h2 style={styles.statNumber}>
                  {stat.number}
                </h2>
                <p style={styles.statLabel}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">
            How <span>It Works</span>
          </h2>

          <p
            style={{
              textAlign: "center",
              color: "#9ca3af",
              marginBottom: "40px",
            }}
          >
            Four simple steps to your next car
          </p>

          <div className="grid-4">
            {HOW_IT_WORKS.map((item) => (
              <div
                key={item.step}
                className="card"
                style={styles.workCard}
              >
                <div style={styles.stepNumber}>
                  {item.step}
                </div>

                <div style={styles.workIcon}>
                  <i className={item.icon}></i>
                </div>

                <h3 style={styles.workTitle}>
                  {item.title}
                </h3>

                <p style={styles.workDesc}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE */}
      <section
        className="section"
        style={{ background: "#111827" }}
      >
        <div className="container">
          <h2 className="section-title" style={{paddingBottom: "30px"}}>
            Why Choose <span>AutoBridge</span>
          </h2>

          <div className="grid-3">
            <div className="card">
              <i
                className="fa-solid fa-shield-halved"
                style={styles.featureIcon}
              ></i>
              <h3>Verified Cars</h3>
              <p style={styles.featureText}>
                Every listing is checked before it goes live.
              </p>
            </div>

            <div className="card">
              <i
                className="fa-solid fa-money-bill-transfer"
                style={styles.featureIcon}
              ></i>
              <h3>Secure Payments</h3>
              <p style={styles.featureText}>
                Safe and transparent payment process.
              </p>
            </div>

            <div className="card">
              <i
                className="fa-solid fa-file-signature"
                style={styles.featureIcon}
              ></i>
              <h3>RC Transfer Support</h3>
              <p style={styles.featureText}>
                Complete paperwork assistance included.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={styles.ctaBanner}>
        <div
          className="container"
          style={{ textAlign: "center" }}
        >
          <h2 style={styles.ctaTitle}>
            Ready to Find Your Dream Car?
          </h2>

          <p style={styles.ctaText}>
            Join 50,000+ happy customers across India.
          </p>

          <div style={styles.ctaButtons}>
            <Link
              to="/buy"
              style={{
                ...styles.ctaBtn,
                background: "#fff",
                color: "#e63946",
              }}
            >
              Find a Car
            </Link>

            <Link
              to="/sell"
              style={{
                ...styles.ctaBtn,
                background:
                  "rgba(255,255,255,0.12)",
                color: "#fff",
                border:
                  "2px solid rgba(255,255,255,0.3)",
              }}
            >
              Sell My Car
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

const styles = {
  hero: {
    minHeight: "100vh",
    padding: "120px 20px 80px",
    background:
      "linear-gradient(160deg,#0f0f1a 0%,#1a1a2e 100%)",
  },

  heroContent: {
    textAlign: "center",
  },

  heroLabel: {
    display: "inline-block",
    background: "rgba(230,57,70,0.15)",
    color: "#e63946",
    padding: "8px 18px",
    borderRadius: "50px",
    fontWeight: 700,
    marginBottom: "25px",
    border: "1px solid rgba(230,57,70,0.3)",
  },

  heroTitle: {
    fontSize: "clamp(2.5rem, 7vw, 5rem)",
    fontWeight: 800,
    lineHeight: 1.15,
    marginBottom: "20px",
  },

  heroSubtitle: {
    maxWidth: "700px",
    margin: "0 auto 35px",
    color: "#9ca3af",
    lineHeight: 1.8,
    fontSize: "1.1rem",
  },

  heroButtons: {
    display: "flex",
    justifyContent: "center",
    gap: "16px",
    flexWrap: "wrap",
  },

  heroBtn: {
    padding: "14px 32px",
  },

  trustRow: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: "14px",
    marginTop: "35px",
  },

  trustItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 18px",
    background: "rgba(255,255,255,0.05)",
    borderRadius: "50px",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "#d1d5db",
  },

  heroImageWrapper: {
    marginTop: "60px",
  },

  heroImage: {
    width: "100%",
    maxWidth: "950px",
    margin: "0 auto",
    borderRadius: "24px",
    boxShadow:
      "0 25px 60px rgba(0,0,0,0.45)",
  },

  statCard: {
    textAlign: "center",
  },

  statNumber: {
    color: "#e63946",
    fontSize: "2.3rem",
    fontWeight: 800,
  },

  statLabel: {
    color: "#9ca3af",
  },

  workCard: {
    textAlign: "center",
    position: "relative",
  },

  stepNumber: {
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    background: "#e63946",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    margin: "0 auto",
  },

  workIcon: {
    fontSize: "2rem",
    color: "#e63946",
    margin: "20px 0",
  },

  workTitle: {
    marginBottom: "10px",
  },

  workDesc: {
    color: "#9ca3af",
  },

  featureIcon: {
    fontSize: "2rem",
    color: "#e63946",
    marginBottom: "15px",
  },

  featureText: {
    color: "#9ca3af",
    marginTop: "10px",
  },

  ctaBanner: {
    padding: "100px 20px",
    background:
      "linear-gradient(135deg,#c1121f 0%,#e63946 100%)",
  },

  ctaTitle: {
    fontSize: "clamp(2rem,4vw,3rem)",
    marginBottom: "12px",
  },

  ctaText: {
    marginBottom: "30px",
    color: "rgba(255,255,255,0.8)",
  },

  ctaButtons: {
    display: "flex",
    justifyContent: "center",
    gap: "16px",
    flexWrap: "wrap",
  },

  ctaBtn: {
    padding: "14px 30px",
    borderRadius: "10px",
    fontWeight: "700",
    textDecoration: "none",
  },
};