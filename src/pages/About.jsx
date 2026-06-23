import React from "react";
import { Link } from "react-router-dom";

const VALUES = [
  { icon: "🤝", title: "Trust First",    desc: "Every car is verified. Every payment is protected." },
  { icon: "⚡", title: "Fast & Easy",    desc: "List your car or find one in minutes, not days." },
  { icon: "💎", title: "Transparent",    desc: "No hidden fees. What you see is what you pay." },
  { icon: "🛡️", title: "Safe Payments", desc: "Escrow-protected — pay only when you're satisfied." },
];

const TEAM = [
  { initials: "RD", name: "Rohan Desai",    role: "Founder & CEO",     color: "#e63946" },
  { initials: "MS", name: "Meera Shah",     role: "Head of Operations", color: "#f4a261" },
  { initials: "KP", name: "Kaushal Patel",  role: "Lead Inspector",     color: "#2a9d8f" },
  { initials: "TM", name: "Tanya Mehta",    role: "Customer Support",   color: "#457b9d" },
];

const FAQ = [
  { q: "Is AutoBridge free for buyers?",      a: "Yes! Browsing is free. A small fee applies only when a deal closes." },
  { q: "How does car inspection work?",        a: "Our certified mechanic visits your location and checks 150 points for free." },
  { q: "How long does selling take?",          a: "Most cars sell within 7-14 days. Premium listings sell faster." },
  { q: "Is the payment secure?",               a: "Yes. We use escrow — seller gets paid only after buyer is satisfied." },
  { q: "Do you help with RC transfer?",        a: "Absolutely. We handle all paperwork so you don't visit the RTO." },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div style={{ background: "#16213e", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, marginBottom: 8, overflow: "hidden" }}>
      <button onClick={() => setOpen(!open)} style={{ width: "100%", background: "none", border: "none", padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", color: "#f0f0ff", fontSize: "0.9rem", fontWeight: 600, textAlign: "left", gap: 12 }}>
        {q}
        <span style={{ color: "#e63946", fontSize: "1.1rem", flexShrink: 0 }}>{open ? "−" : "+"}</span>
      </button>
      {open && <p style={{ padding: "0 18px 14px", color: "#9ca3af", fontSize: "0.875rem", lineHeight: 1.65, margin: 0 }}>{a}</p>}
    </div>
  );
}

export default function About() {
  return (
    <div className="page">

      {/* Hero */}
      <section style={{ background: "linear-gradient(160deg, #0f0f1a 0%, #1a1a2e 100%)", padding: "70px 20px" }}>
        <div className="container" style={{ maxWidth: 680, textAlign: "center" }}>
          <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700, marginBottom: 16 }}>
            India's Most Trusted <span style={{ color: "#e63946" }}>Car Middleman</span>
          </h1>
          <p style={{ color: "#9ca3af", lineHeight: 1.75, fontSize: "1rem" }}>
            Founded in Ahmedabad in 2020, AutoBridge was built to make buying and selling second-hand cars simple, safe, and stress-free for everyone in Gujarat.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="section">
        <div className="container">
          <h2 className="section-title mb-32">Our <span>Values</span></h2>
          <div className="grid-4">
            {VALUES.map((v) => (
              <div key={v.title} className="card" style={{ textAlign: "center" }}>
                <div style={{ fontSize: "2rem", marginBottom: 10 }}>{v.icon}</div>
                <h3 style={{ fontWeight: 700, marginBottom: 8, fontSize: "0.95rem" }}>{v.title}</h3>
                <p style={{ color: "#9ca3af", fontSize: "0.85rem", lineHeight: 1.6 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section" style={{ background: "#0a0a14" }}>
        <div className="container">
          <h2 className="section-title mb-32">Meet the <span>Team</span></h2>
          <div style={{ display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap" }}>
            {TEAM.map((m) => (
              <div key={m.name} className="card" style={{ textAlign: "center", width: 160 }}>
                <div style={{ width: 60, height: 60, borderRadius: "50%", background: m.color, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "1.1rem", color: "#fff", margin: "0 auto 12px" }}>
                  {m.initials}
                </div>
                <p style={{ fontWeight: 700, margin: 0, fontSize: "0.9rem" }}>{m.name}</p>
                <p style={{ color: "#9ca3af", fontSize: "0.78rem", marginTop: 4 }}>{m.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section">
        <div className="container" style={{ maxWidth: 700 }}>
          <h2 className="section-title mb-32">Frequently Asked <span>Questions</span></h2>
          {FAQ.map((item) => <FAQItem key={item.q} q={item.q} a={item.a} />)}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "linear-gradient(135deg, #c1121f 0%, #e63946 100%)", padding: "56px 20px", textAlign: "center" }}>
        <div className="container">
          <h2 style={{ fontSize: "1.7rem", fontWeight: 700, color: "#fff", marginBottom: 12 }}>
            Ready to Get Started?
          </h2>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/buy" style={{ background: "#fff", color: "#e63946", padding: "11px 28px", borderRadius: 8, fontWeight: 700, textDecoration: "none" }}>Browse Cars</Link>
            <Link to="/sell" style={{ background: "rgba(255,255,255,0.15)", color: "#fff", border: "2px solid rgba(255,255,255,0.4)", padding: "11px 28px", borderRadius: 8, fontWeight: 700, textDecoration: "none" }}>Sell My Car</Link>
          </div>
        </div>
      </section>

    </div>
  );
}
