import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <div>
        <h1
          style={{
            fontSize: "7rem",
            fontWeight: "800",
            color: "#e63946",
            margin: 0,
          }}
        >
          404
        </h1>

        <h2 style={{ marginTop: "10px" }}>
          Oops! Page Not Found
        </h2>

        <p
          style={{
            color: "#9ca3af",
            maxWidth: "500px",
            margin: "15px auto",
          }}
        >
          The page you're looking for doesn't exist or may have been moved.
        </p>

        <Link
          to="/"
          style={{
            display: "inline-block",
            background: "#e63946",
            color: "#fff",
            padding: "12px 24px",
            borderRadius: "8px",
            textDecoration: "none",
            marginTop: "15px",
          }}
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}