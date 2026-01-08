import { notFound } from "next/navigation";
import { getNews } from "../../../lib/data";

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

export async function generateMetadata({ params }) {
  const post = await getNews(params.slug);
  if (!post) return { title: "News | Phure Studios" };
  return {
    title: `${post.title} | Phure Studios`,
    description: post.excerpt || "Nieuwsbericht van Phure Studios",
  };
}

export default async function NewsDetailPage({ params }) {
  const post = await getNews(params.slug);
  if (!post) return notFound();
  const embedUrl = getYoutubeEmbedUrl(post.youtubeUrl);
  const images = post.images?.length ? post.images : [];

  return (
    <div className="section" style={{ gap: 14 }}>
      <section className="card" style={{ display: "grid", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <div className="badge">{post.date || "Onbekend"}</div>
          <h1 style={{ margin: 0 }}>{post.title}</h1>
        </div>
        {post.banner ? (
          <div
            style={{
              width: "100%",
              borderRadius: 12,
              overflow: "hidden",
              border: "1px solid var(--border)",
              background: "#0d111a",
              minHeight: 180,
            }}
          >
            <img
              src={post.banner}
              alt={`${post.title} banner`}
              style={{
                width: "100%",
                height: "100%",
                maxHeight: 360,
                objectFit: "cover",
                display: "block",
              }}
            />
          </div>
        ) : null}
        {embedUrl ? (
          <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid var(--border)" }}>
            <iframe
              src={embedUrl}
              title={`${post.title} video`}
              style={{ width: "100%", height: 320, border: "none", display: "block" }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : null}
        <p style={{ whiteSpace: "pre-line", margin: 0 }}>{post.body || post.excerpt}</p>
        {images.length ? (
          <div style={{ display: "grid", gap: 10 }}>
            <h3 style={{ margin: "6px 0 0 0" }}>Screenshots</h3>
            <div
              style={{
                display: "grid",
                gap: 10,
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              }}
            >
              {images.map((img, idx) => (
                <div
                  key={`${img}-${idx}`}
                  style={{
                    width: "100%",
                    borderRadius: 12,
                    overflow: "hidden",
                    border: "1px solid var(--border)",
                    background: "#0d111a",
                    minHeight: 180,
                  }}
                >
                  <img
                    src={img}
                    alt={`${post.title} screenshot ${idx + 1}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      maxHeight: 360,
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}
