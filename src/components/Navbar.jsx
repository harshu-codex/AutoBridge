import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isLoggedIn, user, logOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const [isMobile, setIsMobile] = useState(
    window.innerWidth < 900
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 900);
    };


    window.addEventListener("resize", handleResize);

    return () =>
      window.removeEventListener("resize", handleResize);
  }, []);

  async function handleLogout() {
    await logOut();
    navigate("/");
  }

  function isActive(path) {
    return location.pathname === path;
  }

  const links = [
    { to: "/", label: "Home" },
    { to: "/buy", label: "Buy Cars" },
    { to: "/sell", label: "Sell Car" },
    { to: "/about", label: "About" },
    { to: "/ratings", label: "Reviews" },
    { to: "/contact", label: "Contact" },
  ];

  return (<nav style={styles.nav}> <div style={styles.inner}> <Link to="/" style={styles.logo}>
    <span style={{ color: "#e63946" }}>Auto</span>Bridge </Link>
    {!isMobile && (
      <>
        <div style={styles.desktopLinks}>
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              style={{
                ...styles.link,
                color: isActive(link.to)
                  ? "#e63946"
                  : "#d1d5db",
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div style={styles.authArea}>
          {isLoggedIn ? (
            <div style={{ position: "relative" }}>
              <div
                style={styles.avatar}
                onClick={() =>
                  setProfileOpen(!profileOpen)
                }
              >
                {(user?.displayName?.[0] || "U")
                  .toUpperCase()}
              </div>

              {profileOpen && (
                <div style={styles.profileDropdown}>
                  <div style={styles.profileHeader}>
                    <strong>
                      {user?.displayName || "User"}
                    </strong>
                    <small>{user?.email}</small>
                  </div>

                  <Link
                    to="/dashboard"
                    style={styles.dropdownItem}
                    onClick={() =>
                      setProfileOpen(false)
                    }
                  >
                    Dashboard
                  </Link>

                  <Link
                    to="/buy"
                    style={styles.dropdownItem}
                    onClick={() =>
                      setProfileOpen(false)
                    }
                  >
                    My Cars
                  </Link>

                  <Link
                    to="/sell"
                    style={styles.dropdownItem}
                    onClick={() =>
                      setProfileOpen(false)
                    }
                  >
                    Sell Car
                  </Link>

                  <button
                    style={styles.logoutBtn}
                    onClick={handleLogout}
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/signin"
                style={styles.btnOutline}
              >
                Sign In
              </Link>

              <Link
                to="/signup"
                style={styles.btnRed}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </>
    )}

    {isMobile && (
      <button
        style={styles.mobileBtn}
        onClick={() =>
          setMenuOpen(!menuOpen)
        }
      >
        <i
          className={
            menuOpen
              ? "fa-solid fa-xmark"
              : "fa-solid fa-bars"
          }
        />
      </button>
    )}
  </div>

    {isMobile && menuOpen && (
      <div style={styles.mobileMenu}>
        {isLoggedIn && (
          <div style={styles.mobileProfile}>
            <div style={styles.avatar}>
              {(user?.displayName?.[0] || "U")
                .toUpperCase()}
            </div>

            <div>
              <div style={{ color: "#fff" }}>
                {user?.displayName}
              </div>

              <small
                style={{ color: "#9ca3af" }}
              >
                {user?.email}
              </small>
            </div>
          </div>
        )}

        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            style={styles.mobileLink}
            onClick={() =>
              setMenuOpen(false)
            }
          >
            {link.label}
          </Link>
        ))}

        <hr
          style={{
            borderColor:
              "rgba(255,255,255,0.08)",
          }}
        />

        {isLoggedIn ? (
          <>
            <Link
              to="/dashboard"
              style={styles.mobileLink}
            >
              Dashboard
            </Link>

            <button
              style={styles.mobileLogout}
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
            >
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link
              to="/signin"
              style={styles.mobileLink}
            >
              Sign In
            </Link>

            <Link
              to="/signup"
              style={styles.mobileLink}
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    )}
  </nav>
  );
}

const styles = {
  nav: {
    position: "sticky",
    top: 0,
    zIndex: 1000,
    background: "#0f172a",
    borderBottom:
      "1px solid rgba(255,255,255,0.08)",
  },

  inner: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "0 24px",
    height: "80px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },

  logo: {
    color: "#fff",
    fontSize: "1.8rem",
    fontWeight: 800,
    textDecoration: "none",
  },

  desktopLinks: {
    display: "flex",
    gap: "20px",
  },

  link: {
    textDecoration: "none",
    fontWeight: 600,
    fontSize: "1rem",
  },

  authArea: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  btnRed: {
    background: "#e63946",
    color: "#fff",
    padding: "10px 18px",
    borderRadius: "10px",
    textDecoration: "none",
    fontWeight: 600,
  },

  btnOutline: {
    border: "1px solid rgba(255,255,255,.15)",
    color: "#fff",
    padding: "10px 18px",
    borderRadius: "10px",
    textDecoration: "none",
  },

  avatar: {
    width: "46px",
    height: "46px",
    borderRadius: "50%",
    background: "#e63946",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontWeight: 700,
  },

  profileDropdown: {
    position: "absolute",
    top: "60px",
    right: 0,
    width: "250px",
    background: "#1e293b",
    borderRadius: "12px",
    overflow: "hidden",
  },

  profileHeader: {
    padding: "15px",
    color: "#fff",
    borderBottom:
      "1px solid rgba(255,255,255,.08)",
    display: "flex",
    flexDirection: "column",
  },

  dropdownItem: {
    display: "block",
    padding: "14px 16px",
    color: "#d1d5db",
    textDecoration: "none",
  },

  logoutBtn: {
    width: "100%",
    border: "none",
    background: "transparent",
    color: "#ef4444",
    padding: "14px 16px",
    textAlign: "left",
    cursor: "pointer",
  },

  mobileBtn: {
    background: "transparent",
    border: "none",
    color: "#fff",
    fontSize: "1.6rem",
    cursor: "pointer",
  },

  mobileMenu: {
    background: "#111827",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  mobileProfile: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "10px",
  },

  mobileLink: {
    color: "#d1d5db",
    textDecoration: "none",
    padding: "8px 0",
  },

  mobileLogout: {
    background: "transparent",
    border: "none",
    color: "#ef4444",
    textAlign: "left",
    cursor: "pointer",
    padding: "8px 0",
  },
};
