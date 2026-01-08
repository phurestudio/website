import { ensureTables, getPool } from "./db";
import { games as seedGames } from "./games";

const CACHE_TTL_MS = Number(process.env.DATA_CACHE_TTL_MS || 15000);
const cache = {
  games: { data: null, expiresAt: 0 },
  newsList: new Map(),
  gameBySlug: new Map(),
  newsBySlug: new Map(),
};
let schemaReady = false;

async function ensureSchemaOnce() {
  if (schemaReady) return;
  await ensureTables();
  schemaReady = true;
}

function isFresh(entry) {
  return entry && entry.expiresAt > Date.now();
}

function setCached(mapOrEntry, key, data) {
  const entry = { data, expiresAt: Date.now() + CACHE_TTL_MS };
  if (mapOrEntry instanceof Map) {
    mapOrEntry.set(key, entry);
  } else {
    mapOrEntry.data = data;
    mapOrEntry.expiresAt = entry.expiresAt;
  }
  return data;
}

function slugify(input = "") {
  return input
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function parseListValue(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      /* ignore */
    }
    return value
      .split(/[,;\n]/)
      .map((v) => v.trim())
      .filter(Boolean);
  }
  return [];
}

function mapGameRow(row) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    tagline: row.tagline,
    banner: row.banner,
    screenshots: parseListValue(row.screenshots),
    youtubeUrl: row.youtube_url,
    playstoreUrl: row.playstore_url,
    steamUrl: row.steam_url,
    appstoreUrl: row.appstore_url,
    description: row.description,
    platforms: parseListValue(row.platforms),
    features: parseListValue(row.features),
  };
}

function parseImages(value) {
  return parseListValue(value)
    .map((v) => (v || "").trim())
    .filter(Boolean)
    .slice(0, 3);
}

function mapNewsRow(row) {
  const excerpt =
    row.excerpt ||
    (row.body
      ? `${row.body.slice(0, 180)}${row.body.length > 180 ? "..." : ""}`
      : "");
  const images = parseImages(row.images);
  if (!images.length && row.image) {
    images.push(row.image);
  }
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt,
    image: images[0] || row.image,
    images,
    gameSlug: row.game_slug || null,
    youtubeUrl: row.youtube_url,
    body: row.body,
    date: row.published_at
      ? new Date(row.published_at).toISOString().slice(0, 10)
      : undefined,
  };
}

export async function listGames() {
  try {
    if (isFresh(cache.games)) return cache.games.data;
    const pool = getPool();
    const [rows] = await pool.query("SELECT * FROM games ORDER BY created_at DESC");
    if (!rows.length) return setCached(cache.games, null, seedGames);
    return setCached(cache.games, null, rows.map(mapGameRow));
  } catch (err) {
    console.error("Unable to fetch games, falling back to seed data", err);
    return setCached(cache.games, null, seedGames);
  }
}

export async function getGame(slug) {
  try {
    const cached = cache.gameBySlug.get(slug);
    if (isFresh(cached)) return cached.data;
    if (isFresh(cache.games)) {
      const found = cache.games.data?.find((g) => g.slug === slug);
      if (found) return setCached(cache.gameBySlug, slug, found);
    }
    const pool = getPool();
    const [rows] = await pool.query("SELECT * FROM games WHERE slug = ? LIMIT 1", [slug]);
    if (rows.length) return setCached(cache.gameBySlug, slug, mapGameRow(rows[0]));
  } catch (err) {
    console.error("Unable to fetch game, falling back to seed data", err);
  }
  const fallback = seedGames.find((g) => g.slug === slug) || null;
  if (fallback) return setCached(cache.gameBySlug, slug, fallback);
  return null;
}

export async function createGame(payload) {
  const {
    title,
    slug,
    tagline,
    banner,
    screenshots,
    youtubeUrl,
    playstoreUrl,
    steamUrl,
    appstoreUrl,
    description,
    platforms,
    features,
  } = payload;
  const normalizedSlug = slugify(slug || title);
  if (!normalizedSlug) {
    throw new Error("Slug of titel is verplicht");
  }
  const normalizedVideo = (youtubeUrl || "").trim();
  const normalizedStore = (playstoreUrl || "").trim();
  const normalizedSteam = (steamUrl || "").trim();
  const normalizedAppStore = (appstoreUrl || "").trim();

  await ensureSchemaOnce();
  const pool = getPool();
  await pool.query(
    `
      INSERT INTO games (slug, title, tagline, banner, screenshots, youtube_url, playstore_url, steam_url, appstore_url, description, platforms, features)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE title = VALUES(title), tagline = VALUES(tagline), banner = VALUES(banner), screenshots = VALUES(screenshots), youtube_url = VALUES(youtube_url), playstore_url = VALUES(playstore_url), steam_url = VALUES(steam_url), appstore_url = VALUES(appstore_url), description = VALUES(description), platforms = VALUES(platforms), features = VALUES(features)
    `,
    [
      normalizedSlug,
      title,
      tagline || "",
      banner || "",
      JSON.stringify(parseListValue(screenshots)),
      normalizedVideo,
      normalizedStore,
      normalizedSteam,
      normalizedAppStore,
      description || "",
      JSON.stringify(parseListValue(platforms)),
      JSON.stringify(parseListValue(features)),
    ]
  );

  cache.games.expiresAt = 0;
  cache.gameBySlug.clear();
  return normalizedSlug;
}

export async function listNews(limit = 5, gameSlug = null) {
  try {
    const key = `${gameSlug || ""}:${Number(limit)}`;
    const cached = cache.newsList.get(key);
    if (isFresh(cached)) return cached.data;
    const pool = getPool();
    if (gameSlug) {
      const [rows] = await pool.query(
        "SELECT * FROM news_posts WHERE game_slug = ? ORDER BY published_at DESC LIMIT ?",
        [gameSlug, Number(limit)]
      );
      return setCached(cache.newsList, key, rows.map(mapNewsRow));
    }
    const [rows] = await pool.query(
      "SELECT * FROM news_posts ORDER BY published_at DESC LIMIT ?",
      [Number(limit)]
    );
    return setCached(cache.newsList, key, rows.map(mapNewsRow));
  } catch (err) {
    console.error("Unable to fetch news", err);
    return setCached(cache.newsList, `${gameSlug || ""}:${Number(limit)}`, []);
  }
}

export async function getNews(slug) {
  try {
    const cached = cache.newsBySlug.get(slug);
    if (isFresh(cached)) return cached.data;
    const pool = getPool();
    const [rows] = await pool.query("SELECT * FROM news_posts WHERE slug = ? LIMIT 1", [slug]);
    if (rows.length) return setCached(cache.newsBySlug, slug, mapNewsRow(rows[0]));
  } catch (err) {
    console.error("Unable to fetch news post", err);
  }
  return null;
}

export async function createNews(payload) {
  const { title, slug, body, excerpt, image, images, youtubeUrl, gameSlug, published_at } = payload;
  const normalizedSlug = slugify(slug || title);
  if (!normalizedSlug) {
    throw new Error("Slug of titel is verplicht");
  }
  const normalizedVideo = (youtubeUrl || "").trim();
  const normalizedImages = parseImages(images);
  const finalImages = normalizedImages.length ? normalizedImages : parseImages(image);
  const primaryImage = image || finalImages[0] || "";

  await ensureSchemaOnce();
  const pool = getPool();
  const finalExcerpt =
    excerpt ||
    (body ? `${body.slice(0, 220)}${body.length > 220 ? "..." : ""}` : null);

  await pool.query(
    `
      INSERT INTO news_posts (slug, title, excerpt, images, image, youtube_url, body, game_slug, published_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, COALESCE(?, NOW()))
      ON DUPLICATE KEY UPDATE title = VALUES(title), excerpt = VALUES(excerpt), images = VALUES(images), image = VALUES(image), youtube_url = VALUES(youtube_url), body = VALUES(body), game_slug = VALUES(game_slug), published_at = COALESCE(VALUES(published_at), news_posts.published_at)
    `,
    [
      normalizedSlug,
      title,
      finalExcerpt,
      JSON.stringify(finalImages),
      primaryImage,
      normalizedVideo,
      body || "",
      gameSlug || null,
      published_at || null,
    ]
  );

  cache.newsList.clear();
  cache.newsBySlug.clear();
  return normalizedSlug;
}
