import { listGames } from "../../lib/data";

export const metadata = {
  title: "Games | Phure Studios",
  description: "Ontdek de games van Phure Studios.",
};

export const dynamic = "force-dynamic";

export default async function GamesPage() {
  const games = await listGames();
  return (
    <div className="section" style={{ gap: 14 }}>
      <section className="card" style={{ display: "grid", gap: 8 }}>
        <h1 style={{ margin: 0 }}>Our Games</h1>
        <p style={{ margin: 0 }}>
          A selection of our titles. Continue clicking for more information on each game.
        </p>
      </section>

      <div
        className="grid"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 12,
        }}
      >
        {games.map((game) => (
          <article
            key={game.slug}
            className="card"
            style={{ display: "grid", gap: 10, padding: 12 }}
          >
            <a
              href={`/games/${game.slug}`}
              style={{
                display: "block",
                borderRadius: 12,
                overflow: "hidden",
                border: "1px solid #232a39",
                lineHeight: 0,
                aspectRatio: "16 / 9",
                background: "#0d111a",
              }}
            >
              <img
                src={game.banner || game.screenshots?.[0] || ""}
                alt={game.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </a>
            {game.screenshots?.length ? (
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {game.screenshots.slice(0, 3).map((shot, idx) => (
                  <div
                    key={`${shot}-${idx}`}
                    style={{
                      width: 64,
                      height: 44,
                      borderRadius: 8,
                      overflow: "hidden",
                      border: "1px solid var(--border)",
                      background: "#0d111a",
                    }}
                  >
                    <img
                      src={shot}
                      alt={`${game.title} screenshot ${idx + 1}`}
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />
                  </div>
                ))}
              </div>
            ) : null}
            <div style={{ display: "grid", gap: 6 }}>
              <h3 style={{ margin: 0 }}>{game.title}</h3>
              <p style={{ margin: 0 }}>{game.tagline}</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {game.platforms?.map((p) => (
                  <span key={p} className="badge" style={{ fontSize: 12, padding: "4px 8px" }}>
                    {p}
                  </span>
                ))}
              </div>
              <a className="badge" href={`/games/${game.slug}`} style={{ width: "fit-content" }}>
                View game
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
