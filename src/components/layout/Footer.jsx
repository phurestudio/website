export default function Footer() {
  const year = new Date().getFullYear();
  const boxBase = {
    display: "grid",
    borderRadius: 10,
    border: "1px solid #1f2430",
    background: "linear-gradient(135deg, rgba(34, 35, 42, 0.95), rgba(20, 21, 28, 0.95))",
    alignSelf: "flex-start",
    fontFamily: "Segoe UI",
    fontWeight: 500,
  };
  const addressBoxStyle = {
    ...boxBase,
    gap: 8,
    minWidth: 220,
    lineHeight: 1.5,
    padding: 14,
  };
  const contactBoxStyle = {
    ...boxBase,
    gap: 4, 
    minWidth: 200,
    lineHeight: 1.4,
    padding: 10,
  };

  return (
    <footer style={{ borderTop: "1px solid #1f2430", marginTop: 32, paddingTop: 16 }}>
      <div
        className="container section"
        style={{
          display: "grid",
          gap: 12,
          color: "var(--text)",
          fontSize: 14,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            alignItems: "flex-start",
            gap: 16,
          }}
        >
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <div style={addressBoxStyle}>
              <span>Van Cronenburchstraat 46</span>
              <span>8921 AP Leeuwarden, NL</span>
              <span>KvK nummer: 01149677</span>
            </div>
            <div style={contactBoxStyle}>
              <a href="tel:+31582038378" style={{ color: "inherit", textDecoration: "none" }}>
                Tel: +31 (0)58 2038378
              </a>
              <a href="mailto:info@phurestudios.com" style={{ color: "inherit", textDecoration: "none" }}>
                Email: info@phurestudios.com
              </a>
            </div>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <a href="/privacy" className="badge">
              Privacy Policy
            </a>
            <a href="/contact" className="badge">
              Contact
            </a>
          </div>
        </div>

        <p style={{ margin: 0, opacity: 0.8, fontSize: 13 }}>
          © {year} Phure Studios — Made by Danny
        </p>
      </div>
    </footer>
  );
}
