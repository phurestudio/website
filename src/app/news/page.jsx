import { listNews } from "../../lib/data";

export const metadata = {
  title: "News | Phure Studios",
  description: "The latest updates and news of Phure Studios.",
};

export const dynamic = "force-dynamic";

export default async function NewsPage() {
  const posts = await listNews(20);

  return (
    <div className="section" style={{ gap: 14 }}>
      <section className="card" style={{ display: "grid", gap: 8 }}>
        <h1 style={{ margin: 0 }}>News</h1>
        <p style={{ margin: 0 }}>
          The most recent updates from Phure Studios.
        </p>
      </section>

      {posts.length ? (
        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          {posts.map((post) => (
            <a
              key={post.slug}
              href={`/news/${post.slug}`}
              className="card"
              style={{
                padding: 14,
                display: "grid",
                gap: 8,
                color: "inherit",
                textDecoration: "none",
              }}
            >
              {post.banner || post.images?.[0] ? (
                <div
                  style={{
                    width: "100%",
                    height: 160,
                    borderRadius: 10,
                    overflow: "hidden",
                    border: "1px solid var(--border)",
                    background: "#0d111a",
                  }}
                >
                  <img
                    src={post.banner || post.images?.[0]}
                    alt={post.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                      background: "transparent",
                    }}
                  />
                </div>
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: 160,
                    borderRadius: 10,
                    border: "1px solid var(--border)",
                    background: "transparent",
                  }}
                  aria-hidden="true"
                />
              )}
              {post.images?.length ? (
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {post.images.slice(0, 3).map((img, idx) => (
                    <div
                      key={`${img}-${idx}`}
                      style={{
                        width: 56,
                        height: 40,
                        borderRadius: 8,
                        overflow: "hidden",
                        border: "1px solid var(--border)",
                        background: "#0d111a",
                      }}
                    >
                      <img
                        src={img}
                        alt={`${post.title} screenshot ${idx + 1}`}
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                      />
                    </div>
                  ))}
                </div>
              ) : null}
              <div className="badge" style={{ width: "fit-content" }}>
                {post.date || "Onbekend"}
              </div>
              <h3 style={{ margin: 0 }}>{post.title}</h3>
              <p style={{ margin: 0 }}>{post.excerpt}</p>
            </a>
          ))}
        </div>
      ) : (
        <p style={{ margin: 0 }}>Nog geen nieuwsberichten beschikbaar.</p>
      )}
    </div>
  );
}
