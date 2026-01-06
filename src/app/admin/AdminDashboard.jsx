"use client";

import { useEffect, useState } from "react";

function parseList(text) {
  return text
    .split(/[,;\n]/)
    .map((v) => v.trim())
    .filter(Boolean);
}

async function uploadFiles(files, folder = "", max = 3) {
  const normalized = Array.from(files || [])
    .filter((file) => file && typeof file === "object" && file.size > 0)
    .slice(0, max);
  if (!normalized.length) return [];

  const uploaded = [];
  for (const file of normalized) {
    const formData = new FormData();
    formData.append("file", file);
    if (folder) formData.append("folder", folder);

    const res = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data?.error || "Upload failed");
    }
    uploaded.push(data.url);
  }

  return uploaded;
}

export default function AdminDashboard() {
  const [gameStatus, setGameStatus] = useState({ loading: false, message: "" });
  const [newsStatus, setNewsStatus] = useState({ loading: false, message: "" });
  const [games, setGames] = useState([]);

  useEffect(() => {
    async function loadGames() {
      try {
        const res = await fetch("/api/admin/games");
        if (!res.ok) throw new Error();
        const data = await res.json();
        setGames(Array.isArray(data.games) ? data.games : []);
      } catch {
        setGames([]);
      }
    }
    loadGames();
  }, []);

  async function handleGameSubmit(e) {
    e.preventDefault();
    const formEl = e.currentTarget;
    const form = new FormData(formEl);

    setGameStatus({ loading: true, message: "Uploading files..." });
    try {
      const bannerFile = form.get("bannerFile");
      const screenshots = form.getAll("game_screenshots");

      const [bannerUrl = ""] =
        bannerFile && bannerFile.size
          ? await uploadFiles([bannerFile], "games/banners", 1)
          : [];
      const screenshotUrls = await uploadFiles(screenshots, "games/screenshots", 3);

      const payload = {
        title: form.get("title"),
        slug: form.get("slug"),
        tagline: form.get("tagline"),
        banner: bannerUrl,
        screenshots: screenshotUrls,
        youtubeUrl: form.get("youtubeUrl"),
        playstoreUrl: form.get("playstoreUrl"),
        steamUrl: form.get("steamUrl"),
        appstoreUrl: form.get("appstoreUrl"),
        description: form.get("description"),
        platforms: parseList(form.get("platforms") || ""),
        features: parseList(form.get("features") || ""),
      };

      const res = await fetch("/api/admin/games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Opslaan mislukt");
      setGameStatus({ loading: false, message: `Game opgeslagen (slug: ${data.slug})` });
      formEl.reset();
    } catch (err) {
      setGameStatus({ loading: false, message: err.message });
    }
  }

  async function handleNewsSubmit(e) {
    e.preventDefault();
    const formEl = e.currentTarget;
    const form = new FormData(formEl);

    setNewsStatus({ loading: true, message: "Uploading files..." });
    try {
      const uploadedImages = await uploadFiles(form.getAll("news_images"), "news/images", 3);
      const selectedGame = (form.get("news_gameSlug") || "").toString().trim();
      const payload = {
        title: form.get("news_title"),
        slug: form.get("news_slug"),
        excerpt: form.get("news_excerpt"),
        images: uploadedImages,
        image: uploadedImages[0] || "",
        youtubeUrl: form.get("news_youtubeUrl"),
        gameSlug: selectedGame || null,
        body: form.get("news_body"),
      };
      const res = await fetch("/api/admin/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Opslaan mislukt");
      setNewsStatus({ loading: false, message: `Nieuws geplaatst (slug: ${data.slug})` });
      formEl.reset();
    } catch (err) {
      setNewsStatus({ loading: false, message: err.message });
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  return (
    <div className="section">
      <section
        className="card"
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
      >
        <div>
          <h1 style={{ margin: 0 }}>Admin panel</h1>
          <p style={{ margin: 0 }}>Add new games and news articles.</p>
        </div>
        <button className="badge" onClick={handleLogout} style={{ padding: "10px 14px" }}>
          Logout
        </button>
      </section>

      <div
        className="grid"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", alignItems: "start" }}
      >
        <section className="card" style={{ display: "grid", gap: 12 }}>
          <div>
            <h2 style={{ margin: 0 }}>New game</h2>
            <p style={{ margin: 0 }}>Add a new game card.</p>
          </div>
          <form onSubmit={handleGameSubmit} style={{ display: "grid", gap: 10 }}>
            <label style={labelStyle}>
              <span>Title *</span>
              <input name="title" required style={inputStyle} placeholder="Game title" />
            </label>
            <label style={labelStyle}>
              <span>URL name (optional)</span>
              <input name="slug" style={inputStyle} placeholder="catspin" />
            </label>
            <label style={labelStyle}>
              <span>Banner upload</span>
              <input
                name="bannerFile"
                type="file"
                accept="image/*"
                style={inputStyle}
              />
            </label>
            <label style={labelStyle}>
              <span>Screenshots (max 3)</span>
              <input
                name="game_screenshots"
                type="file"
                accept="image/*"
                multiple
                style={inputStyle}
              />
            </label>
            <label style={labelStyle}>
              <span>YouTube URL (optional)</span>
              <input
                name="youtubeUrl"
                style={inputStyle}
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </label>
            <label style={labelStyle}>
              <span>Play Store URL (optional)</span>
              <input
                name="playstoreUrl"
                style={inputStyle}
                placeholder="https://play.google.com/store/apps/details?id=..."
              />
            </label>
            <label style={labelStyle}>
              <span>Steam URL (optional)</span>
              <input
                name="steamUrl"
                style={inputStyle}
                placeholder="https://store.steampowered.com/app/..."
              />
            </label>
            <label style={labelStyle}>
              <span>App Store URL (optional)</span>
              <input
                name="appstoreUrl"
                style={inputStyle}
                placeholder="https://apps.apple.com/app/id..."
              />
            </label>
            <label style={labelStyle}>
              <span>Short description</span>
              <input name="tagline" style={inputStyle} placeholder="Short description" />
            </label>
            <label style={labelStyle}>
              <span>Full description</span>
              <textarea
                name="description"
                rows={4}
                style={textAreaStyle}
                placeholder="Full description"
              />
            </label>
            <label style={labelStyle}>
              <span>Features (comma or new lines)</span>
              <textarea
                name="features"
                rows={3}
                style={textAreaStyle}
                placeholder="Leaderboards&#10;Co-op"
              />
            </label>
            <label style={labelStyle}>
              <span>Platforms (comma, dot-comma or new lines)</span>
              <textarea
                name="platforms"
                rows={2}
                style={textAreaStyle}
                placeholder="iOS, Android"
              />
            </label>
            {gameStatus.message ? (
              <div className="card" style={{ padding: "10px 12px" }}>
                {gameStatus.message}
              </div>
            ) : null}
            <button
              type="submit"
              className="badge"
              disabled={gameStatus.loading}
              style={{ justifyContent: "center", padding: "10px 16px" }}
            >
              {gameStatus.loading ? "Save..." : "Save game"}
            </button>
          </form>
        </section>

        <section className="card" style={{ display: "grid", gap: 12 }}>
          <div>
            <h2 style={{ margin: 0 }}>News article</h2>
            <p style={{ margin: 0 }}>Publish news articles that will be displayed on the home & news-page.</p>
          </div>
          <form onSubmit={handleNewsSubmit} style={{ display: "grid", gap: 10, marginTop: -6 }}>
            <label style={labelStyle}>
              <span>Title *</span>
              <input name="news_title" required style={inputStyle} placeholder="Title of the news article" />
            </label>
            <label style={labelStyle}>
              <span>URL name (optional)</span>
              <input name="news_slug" style={inputStyle} placeholder="News URL" />
            </label>
            <label style={labelStyle}>
              <span>Link to a game (optional)</span>
              <select name="news_gameSlug" style={inputStyle} defaultValue="">
                <option value="">No link</option>
                {games.map((g) => (
                  <option key={g.slug} value={g.slug}>
                    {g.title}
                  </option>
                ))}
              </select>
            </label>
            <label style={labelStyle}>
              <span>Screenshots (max 3) - (optional)</span>
              <input
                name="news_images"
                type="file"
                accept="image/*"
                multiple
                style={inputStyle}
              />
            </label>
            <label style={labelStyle}>
              <span>YouTube URL (optional)</span>
              <input
                name="news_youtubeUrl"
                style={inputStyle}
                placeholder="https://youtu.be/..."
              />
            </label>
            <label style={labelStyle}>
              <span>Short description (optional)</span>
              <textarea
                name="news_excerpt"
                rows={2}
                style={textAreaStyle}
                placeholder="Short description"
              />
            </label>
            <label style={labelStyle}>
              <span>Complete news article</span>
              <textarea
                name="news_body"
                rows={6}
                style={textAreaStyle}
                placeholder="Complete news article"
              />
            </label>
            {newsStatus.message ? (
              <div className="card" style={{ padding: "10px 12px" }}>
                {newsStatus.message}
              </div>
            ) : null}
            <button
              type="submit"
              className="badge"
              disabled={newsStatus.loading}
              style={{ justifyContent: "center", padding: "10px 16px" }}
            >
              {newsStatus.loading ? "Save..." : "Save news article"}
            </button>
          </form>
        </section>
      </div>
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
const textAreaStyle = { ...inputStyle, minHeight: 80, resize: "vertical" };
