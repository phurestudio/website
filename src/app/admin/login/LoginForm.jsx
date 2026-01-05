"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState({ loading: false, error: "" });

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus({ loading: true, error: "" });
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Inloggen mislukt");
      }
      router.push("/admin");
    } catch (err) {
      setStatus({ loading: false, error: err.message });
      return;
    }
  }

  return (
    <section
      className="card"
      style={{
        width: "min(520px, 100%)",
        display: "grid",
        gap: 14,
        padding: 22,
      }}
    >
      <div style={{ display: "grid", gap: 6 }}>
        <h1 style={{ margin: 0 }}>Admin Login</h1>
        <p style={{ margin: 0 }}>
          Log in om het beheerpaneel te openen en games/nieuws te beheren.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
        <label style={{ display: "grid", gap: 6 }}>
          <span>Gebruikersnaam</span>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Admin gebruikersnaam"
            required
            style={inputStyle}
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span>Wachtwoord</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Wachtwoord"
            required
            style={inputStyle}
          />
        </label>

        {status.error ? (
          <div
            className="card"
            style={{
              borderColor: "#ff8c8c",
              background: "rgba(255, 140, 140, 0.08)",
              padding: "10px 12px",
            }}
          >
            {status.error}
          </div>
        ) : null}

        <button
          type="submit"
          className="badge"
          disabled={status.loading}
          style={{ justifyContent: "center", padding: "10px 16px" }}
        >
          {status.loading ? "Bezig met inloggen..." : "Log in"}
        </button>
      </form>

      <p style={{ margin: 0, color: "var(--muted)", fontSize: 13 }}>
        Nog geen admin account? Zet een gebruiker in de database of vul de env-variabelen{" "}
        <code>ADMIN_BOOTSTRAP_USER</code> en <code>ADMIN_BOOTSTRAP_PASS</code> in.
      </p>
    </section>
  );
}

const inputStyle = {
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid var(--border)",
  background: "#0d111a",
  color: "var(--text)",
  fontSize: 14,
};
