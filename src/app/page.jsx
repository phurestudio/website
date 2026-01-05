import BannerSlider from "../components/home/BannerSlider";
import LatestNews from "../components/home/LatestNews";
import { listGames, listNews } from "../lib/data";

export const dynamic = "force-dynamic";

function pickFeatured(games, limit = 4) {
  if (!Array.isArray(games)) return [];
  const copy = [...games];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, limit);
}

export default async function HomePage() {
  const [games, news] = await Promise.all([listGames(), listNews(3)]);
  const featured = pickFeatured(games);
  return (
    <div className="section" style={{ gap: 16 }}>
      <section className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div
          style={{
            padding: "18px 18px 0 18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <h1 style={{ margin: 0 }}>Our Games</h1>
        </div>
        <div style={{ padding: 18 }}>
          <BannerSlider games={featured} />
        </div>
      </section>

      <section className="card" style={{ display: "grid", gap: 10 }}>
        <h2>Welcome to Phure Studios</h2>
        <p style={{ maxWidth: 1250 }}>
          We have experience developing a range of successful games for PC, consoles, mobile and VR. We are helping out others while we’re at it. Getting requests for developing serious games or purely for entertainment and even teaching at colleges helping students design and develop their own games!
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <a className="badge" href="/games">
            View our games
          </a>
          <a className="badge" href="/about">
            About us
          </a>
        </div>
      </section>

      <section className="card" style={{ display: "grid", gap: 12 }}>
        <div className="section-title">
          <h2>Featured games</h2>
          <a className="badge" href="/games">
            All games
          </a>
        </div>
        <div
          className="grid"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 12,
          }}
        >
          {featured.map((game) => (
            <article
              key={game.slug}
              className="card"
              style={{
                padding: 12,
                display: "grid",
                gap: 8,
                background: "rgba(255,255,255,0.02)",
              }}
            >
              <a
                href={`/games/${game.slug}`}
                style={{
                  display: "block",
                  position: "relative",
                  borderRadius: 12,
                  overflow: "hidden",
                  border: "1px solid #232a39",
                  lineHeight: 0,
                  aspectRatio: "16 / 9",
                  background: "#0d111a",
                }}
              >
                <img
                  src={game.banner}
                  alt={game.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </a>
              <div style={{ display: "grid", gap: 4 }}>
                <h3 style={{ margin: 0 }}>{game.title}</h3>
                <p style={{ margin: 0 }}>{game.tagline}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="card" style={{ display: "grid", gap: 10 }}>
        <div className="section-title">
          <h2>Latest News</h2>
          <a href="/news" className="badge">
            View all
          </a>
        </div>
        {news.length ? (
          <LatestNews posts={news} />
        ) : (
          <p style={{ margin: 0 }}>No news has been added.</p>
        )}
      </section>

    </div>
  );
}
