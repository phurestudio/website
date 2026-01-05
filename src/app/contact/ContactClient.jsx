"use client";

import { useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

export default function ContactClient() {
  const formRef = useRef(null);
  const recaptchaRef = useRef(null);
  const [recaptchaKey, setRecaptchaKey] = useState(Date.now());
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!siteKey) {
      setStatus("reCAPTCHA missing: fill in NEXT_PUBLIC_RECAPTCHA_SITE_KEY");
      return;
    }

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") || "";
    const email = formData.get("email") || "";
    const topic = formData.get("topic") || "Contact";
    const message = formData.get("message") || "";

    const captchaInstance = recaptchaRef.current;
    if (!captchaInstance) {
      setStatus("reCAPTCHA didn't load, try again.");
      return;
    }

    const token = captchaInstance.getValue();
    if (!token) {
      setStatus("Confirm the reCAPTCHA to send.");
      return;
    }

    setBusy(true);
    setStatus("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, name, email, topic, message }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Versturen mislukt");

      setStatus("Message sent! We'll get back to you as soon as possible.");
      
      if (formRef.current) {
        formRef.current.reset();
      }

      setRecaptchaKey(Date.now());

    } catch (err) {
      setStatus(err.message || "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="section" style={{ gap: 16 }}>
      <section className="card" style={{ display: "grid", gap: 14 }}>
        <div className="section-title" style={{ alignItems: "flex-start" }}>
          <div>
            <h1 style={{ margin: 0 }}>Contact</h1>
            <p style={{ margin: 0 }}>
              You are welcome to contact us for business inquiries relating to
              app- or game development.
            </p>
          </div>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
          <div
            className="grid"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            }}
          >
            <label style={labelStyle}>
              <span>Your Name (required)</span>
              <input
                name="name"
                required
                placeholder="Your name"
                style={inputStyle}
              />
            </label>

            <label style={labelStyle}>
              <span>Your Email (required)</span>
              <input
                type="email"
                name="email"
                required
                placeholder="you@example.com"
                style={inputStyle}
              />
            </label>
          </div>

          <label style={labelStyle}>
            <span>Subject</span>
            <select name="topic" style={inputStyle}>
              <option value="Project">New project</option>
              <option value="Support">Support</option>
              <option value="Other">Other</option>
            </select>
          </label>

          <label style={labelStyle}>
            <span>Your Message</span>
            <textarea
              name="message"
              required
              rows={6}
              placeholder="Tell us about your ideas or questions"
              style={{ ...inputStyle, minHeight: 140, resize: "vertical" }}
            />
          </label>

          {status ? (
            <div className="card" style={{ padding: "10px 12px" }}>
              {status}
            </div>
          ) : null}

          <ReCAPTCHA
            key={recaptchaKey}
            ref={recaptchaRef}
            sitekey={siteKey || ""}
          />

          <button
            type="submit"
            className="badge"
            disabled={busy}
            style={{ padding: "10px 16px", justifyContent: "center" }}
          >
            {busy ? "Sending…" : "Submit Message"}
          </button>
        </form>
      </section>
    </div>
  );
}

const labelStyle = { display: "grid", gap: 6 };
const inputStyle = {
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid var(--border)",
  background: "#0d111a",
  color: "var(--text)",
  fontSize: 14,
};
