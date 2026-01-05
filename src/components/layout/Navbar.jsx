const links = [
  { href: "/", label: "Home" },
  { href: "/games", label: "Games" },
  { href: "/news", label: "News" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy" },
];

export default function Navbar() {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backdropFilter: "blur(8px)",
        background: "rgba(11,13,18,.7)",
        borderBottom: "1px solid #1f2430"
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 0"
        }}
      >
        <a
          href="/"
          style={{
            display: "flex",
            gap: 10,
            alignItems: "center",
            fontWeight: 800,
            letterSpacing: 0.5
          }}
        >
          <img
            src="/assets/logos/logo_small.png"
            alt="Phure Studios logo"
            width={34}
            height={34}
            style={{ borderRadius: 10, objectFit: "cover" }}
          />
          Phure Studios
        </a>

        <nav style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {links.map(l => (
            <a
              key={l.href}
              href={l.href}
              className="badge badge--accent"
              style={{ padding: "8px 10px", fontSize: 14 }}
            >
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
