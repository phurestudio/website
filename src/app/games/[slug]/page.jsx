import { notFound } from "next/navigation";
import { getGame, listGames, listNews } from "../../../lib/data";

export const dynamic = "force-dynamic";

function getYoutubeEmbedUrl(url) {
  const input = (url || "").trim();
  if (!input) return null;
  try {
    const parsed = new URL(input);
    const host = parsed.hostname;
    let videoId = "";

    if (host.includes("youtu.be")) {
      videoId = parsed.pathname.slice(1);
    } else if (host.includes("youtube.com")) {
      if (parsed.pathname === "/watch") {
        videoId = parsed.searchParams.get("v");
      } else if (parsed.pathname.startsWith("/embed/")) {
        videoId = parsed.pathname.split("/").pop();
      } else if (parsed.pathname.startsWith("/shorts/")) {
        videoId = parsed.pathname.split("/")[2];
      }
    }

    if (!videoId) return input;
    return `https://www.youtube.com/embed/${videoId}`;
  } catch {
    return input;
  }
}

export async function generateStaticParams() {
  const games = await listGames();
  return games.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }) {
  const game = await getGame(params.slug);
  if (!game) return { title: "Game | Phure Studios" };
  return {
    title: `${game.title} | Phure Studios`,
    description: game.tagline,
    openGraph: {
      title: game.title,
      description: game.tagline,
      images: game.banner ? [{ url: game.banner }] : [],
    },
  };
}

export default async function GameDetailPage({ params }) {
  const game = await getGame(params.slug);
  if (!game) return notFound();
  const allGames = await listGames();
  const otherGames = allGames.filter((g) => g.slug !== game.slug).slice(0, 3);
  const gameNews = await listNews(3, game.slug);

  const descriptionParagraphs = game.description
    ? game.description.split(/\n\s*\n/).filter(Boolean)
    : [];
  const embedUrl = getYoutubeEmbedUrl(game.youtubeUrl);

  return (
    <div className="section" style={{ gap: 14 }}>
      <section
        className="card"
        style={{
          display: "grid",
          gap: 12,
          padding: 0,
          overflow: "hidden",
        }}
      >
        {game.banner ? (
          <img
            src={game.banner}
            alt={game.title}
            style={{ width: "100%", height: 320, objectFit: "cover" }}
          />
        ) : null}
        <div style={{ padding: 18, display: "grid", gap: 10 }}>
          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "grid", gap: 6 }}>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                <h1 style={{ margin: 0 }}>{game.title}</h1>
                {game.platforms?.map((p) => (
                  <span key={p} className="badge" style={{ fontSize: 12, padding: "4px 8px" }}>
                    {p}
                  </span>
                ))}
              </div>
              <p style={{ margin: 0 }}>{game.tagline}</p>
            </div>
            {(game.playstoreUrl || game.appstoreUrl || game.steamUrl) ? (
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "flex-end" }}>
                {game.playstoreUrl ? (
                  <a
                    href={game.playstoreUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: "inline-block", lineHeight: 0 }}
                  >
                    <img
                      src="/assets/playstores/google_play_link.png"
                      alt="Get it on Google Play"
                      style={{ height: 46 }}
                    />
                  </a>
                ) : null}
                {game.steamUrl ? (
                  <a
                    href={game.steamUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: "inline-block", lineHeight: 0 }}
                  >
                    <img
                      src="/assets/playstores/steam.png"
                      alt="View on Steam"
                      style={{ height: 46 }}
                    />
                  </a>
                ) : null}
                {game.appstoreUrl ? (
                  <a
                    href={game.appstoreUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: "inline-block", lineHeight: 0 }}
                  >
                    <img
                      src="/assets/playstores/iphone_link.png"
                      alt="Download on the App Store"
                      style={{ height: 46 }}
                    />
                  </a>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="card" style={{ display: "grid", gap: 10 }}>
        <h2 style={{ margin: 0 }}>About this game</h2>
        {embedUrl ? (
          <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid var(--border)" }}>
            <iframe
              src={embedUrl}
              title={`${game.title} trailer`}
              style={{ width: "100%", height: 320, border: "none", display: "block" }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : null}
        {descriptionParagraphs.length ? (
          <div style={{ display: "grid", gap: 10 }}>
            {descriptionParagraphs.map((paragraph, idx) => (
              <p key={idx} style={{ margin: 0 }}>
                {paragraph}
              </p>
            ))}
          </div>
        ) : (
          <p style={{ margin: 0 }}>{game.description}</p>
        )}
        {game.features?.length ? (
          <div style={{ display: "grid", gap: 6 }}>
            <h3 style={{ margin: "6px 0 0 0" }}>Features</h3>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {game.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>

      <section className="card" style={{ display: "grid", gap: 10 }}>
        <div className="section-title" style={{ alignItems: "center" }}>
          <h2 style={{ margin: 0 }}>Latest updates</h2>
          <a className="badge" href="/news">
            Latest news
          </a>
        </div>
        {gameNews.length ? (
          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
            {gameNews.map((post) => (
              <a
                key={post.slug}
                href={`/news/${post.slug}`}
                className="card"
                style={{
                  padding: 14,
                  display: "grid",
                  gap: 8,
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <div className="badge" style={{ width: "fit-content" }}>
                  {post.date || "Recent"}
                </div>
                <h3 style={{ margin: 0 }}>{post.title}</h3>
                <p style={{ margin: 0 }}>{post.excerpt}</p>
              </a>
            ))}
          </div>
        ) : (
          <p style={{ margin: 0 }}>No updates have been published yet for this game.</p>
        )}
      </section>

      <section className="card" style={{ display: "grid", gap: 10 }}>
        <div className="section-title" style={{ alignItems: "center" }}>
          <h2 style={{ margin: 0 }}>Play more of our games</h2>
        </div>
        {otherGames.length ? (
          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
            {otherGames.map((g) => (
              <a
                key={g.slug}
                href={`/games/${g.slug}`}
                className="card"
                style={{
                  padding: 12,
                  display: "grid",
                  gap: 8,
                  textDecoration: "none",
                  color: "inherit",
                  background: "rgba(255,255,255,0.02)",
                }}
              >
                <div
                  style={{
                    borderRadius: 10,
                    overflow: "hidden",
                    border: "1px solid var(--border)",
                    height: 120,
                    background: "#0d111a",
                  }}
                  aria-hidden="true"
                >
                  {g.banner ? (
                    <img
                      src={g.banner}
                      alt={g.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />
                  ) : null}
                </div>
                <div style={{ display: "grid", gap: 4 }}>
                  <h3 style={{ margin: 0 }}>{g.title}</h3>
                  {g.tagline ? <p style={{ margin: 0 }}>{g.tagline}</p> : null}
                </div>
              </a>
            ))}
          </div>
        ) : (
          <p style={{ margin: 0 }}>Meer games worden later toegevoegd.</p>
        )}
      </section>
    </div>
  );
}
