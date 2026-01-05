export default function LatestNews({ posts = [] }) {
  return (
    <div className="grid">
      {posts.map((p) => (
        <article key={p.slug || p.title} className="card" style={{ padding: 14, display: "grid", gap: 8 }}>
          <div className="badge" style={{ marginBottom: 6 }}>{p.date || "Recent"}</div>
          <h3 style={{ margin: 0 }}>{p.title}</h3>
          <p style={{ margin: 0 }}>{p.excerpt}</p>
          <div>
            <a className="badge" href="/news" style={{ padding: "6px 10px" }}>
              View news
            </a>
          </div>
        </article>
      ))}
    </div>
  );
}
