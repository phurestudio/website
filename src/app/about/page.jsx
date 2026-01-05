export const metadata = {
  title: "About | Phure Studios",
  description: "Leer Phure Studios kennen: onze games, educatie en samenwerkingen.",
};

const chips = [
  "Founded in 2009",
  "Leeuwarden, The Netherlands",
  "PC • Console • Mobile • VR",
  "Game design & development",
  "Teaching since 2014",
];

const highlights = [
  "Future-proof games across all genres using the latest technology.",
  "Immersive experiences for players on major platforms, including VR.",
  "A blend of creativity, entertainment, and functionality in every title.",
  "Hundreds of students taught to build games: programming, 2D/3D art, level & character design.",
];

const businessPartners = [
  {
    name: "Firda",
    href: "https://firda.nl",
    logo: "/assets/businesses/firda.jpg",
  },
  {
    name: "NHL Stenden - Hotel Management School",
    href: "https://www.nhlstenden.com/en/hotelmanagementschool",
    logo: "/assets/businesses/nhl_hotelmanagementschool_stenden.jpg",
  },
  {
    name: "NHL Stenden - Notiz Hotel",
    href: "https://www.notizhotel.com/en/",
    logo: "/assets/businesses/nhl_notizhotel_stenden.png",
  },
  {
    name: "NHL Stenden - University of Applied Sciences",
    href: "https://www.nhlstenden.com/en",
    logo: "/assets/businesses/nhl_universityofas_stenden.jpg",
  },
  {
    name: "Triangle Studios",
    href: "https://triangle-studios.com/",
    logo: "/assets/businesses/trianglestudios.png",
  },
];

export default function AboutPage() {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <section
        className="card"
        style={{
          padding: 26,
          position: "relative",
          overflow: "hidden",
          background:
            "linear-gradient(135deg, rgba(124,92,255,0.16), rgba(61,220,151,0.08))",
          border: "1px solid #273043",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.08), transparent 32%)",
          }}
        />
        <div style={{ position: "relative", display: "grid", gap: 12 }}>
          <span className="badge" style={{ width: "fit-content" }}>
            About Us
          </span>
          <h1 style={{ marginBottom: 2 }}>Phure Studios</h1>
          <p style={{ maxWidth: 760 }}>
            Phure Studios is a game design and development company based in
            Leeuwarden, The Netherlands, founded in 2009. With a passion for
            creativity and innovation, we have developed a variety of
            entertaining games that have been well received worldwide.
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              marginTop: 6,
            }}
          >
            {chips.map((chip) => (
              <span
                key={chip}
                className="badge"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  borderColor: "rgba(255,255,255,0.16)",
                }}
              >
                {chip}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="card" style={{ display: "grid", gap: 12 }}>
        <h2>What we create</h2>
        <p>
          Using the latest technology, we create future-proof games across all
          genres, delivering immersive experiences for players on major
          platforms, including PC, consoles, mobile devices, and Virtual Reality
          (VR). Our focus is on blending creativity, entertainment, and
          functionality to craft unique and engaging gameplay.
        </p>
        <ul style={{ display: "grid", gap: 6, paddingLeft: 18 }}>
          {highlights.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <div className="grid">
        <section className="card" style={{ display: "grid", gap: 10, alignContent: "start" }}>
          <h3>Games</h3>
          <p>
            Phure Studios is best known for games like CatSpin, which Apple
            featured on the front page of numerous App Stores worldwide, earning
            spots in the "New and Noteworthy" and "What's Hot" lists across
            multiple countries.
          </p>
          <p>
            Check out our Games page to explore our titles and experience them
            for yourself! We look forward to seeing your high scores on our
            online leaderboards.
          </p>
          <a
            className="badge"
            href="/games"
            style={{ width: "fit-content", marginTop: 2 }}
          >
            View our games
          </a>
        </section>

        <section className="card" style={{ display: "grid", gap: 10, alignContent: "start" }}>
          <h3>Game Development &amp; Education</h3>
          <p>
            With extensive experience in game development, we have been teaching
            game design and development at a college level since 2014. Hundreds
            of students have learned to create their own games, gaining skills
            in programming, 2D and 3D art, concept art, level design, character
            design, and more. Sharing knowledge and inspiring the next
            generation of game developers is an integral part of what we do.
          </p>
        </section>
      </div>

      <section className="card" style={{ display: "grid", gap: 12 }}>
        <h2 style={{ margin: 0 }}>Business Collaborations</h2>
        <p style={{ margin: 0 }}>
          Phure Studios has collaborated on various Virtual Reality simulations,
          helping students learn skills such as mixing drinks, maintaining safe
          hotel kitchens, and mastering the steps of hotel housekeeping. Additionally, 
          we have worked with partners to enhance their games and develop custom solutions. 
          Some of our collaborations include:
        </p>
        <div
          className="grid"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: 12,
          }}
        >
          {businessPartners.map((partner) => (
            <a
              key={partner.name}
              className="card"
              style={{
                padding: 10,
                display: "grid",
                gap: 8,
                alignContent: "start",
                background: "rgba(255,255,255,0.03)",
                color: "inherit",
              }}
              href={partner.href}
              target="_blank"
              rel="noreferrer"
            >
              <div
                style={{
                  width: "100%",
                  aspectRatio: "4 / 3",
                  borderRadius: 10,
                  overflow: "hidden",
                  border: "1px solid var(--border)",
                  background: "#0d111a",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <img
                  src={partner.logo}
                  alt={partner.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <p style={{ margin: 0, fontWeight: 600 }}>{partner.name}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="card" style={{ display: "grid", gap: 10 }}>
        <h2>Privacy Policy</h2>
        <p>
          We value your privacy and are committed to transparency. You can read
          our full <a href="/privacy">Privacy Policy</a> for more details.
        </p>
      </section>

      <section className="card" style={{ display: "grid", gap: 12 }}>
        <h2>Get in Touch</h2>
        <p>
          Thank you for taking the time to learn about Phure Studios! If you
          have any questions or would like to reach out, feel free to contact us
          via email or phone. Please note that we are based in The Netherlands
          and may be in a different timezone than yours.
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <a className="badge" href="/contact">
            Contact page
          </a>
        </div>
      </section>
    </div>
  );
}
