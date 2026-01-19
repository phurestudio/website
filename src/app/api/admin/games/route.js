import { cookies } from "next/headers";
import { createGame, deleteGameBySlug, listGames } from "@/lib/data";

const COOKIE_NAME = "admin_token";

function isAuthorized(req) {
  const cookieToken = cookies().get(COOKIE_NAME)?.value;
  const headerToken = req.headers.get("admin_token");
  const token = cookieToken || headerToken;
  return token && token === process.env.ADMIN_API_TOKEN;
}

export async function GET(req) {
  if (!isAuthorized(req)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  try {
    const games = await listGames();
    return new Response(JSON.stringify({ games }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Failed to list games", err);
    return new Response(JSON.stringify({ error: "Failed to list games" }), { status: 500 });
  }
}

export async function POST(req) {
  if (!isAuthorized(req)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  try {
    const payload = await req.json();
    const slug = await createGame({
      title: payload.title,
      slug: payload.slug,
      tagline: payload.tagline,
      banner: payload.banner,
      screenshots: payload.screenshots,
      youtubeUrl: payload.youtubeUrl,
      playstoreUrl: payload.playstoreUrl,
      steamUrl: payload.steamUrl,
      appstoreUrl: payload.appstoreUrl,
      description: payload.description,
      platforms: payload.platforms,
      features: payload.features,
    });

    return new Response(JSON.stringify({ message: "Game added", slug }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Failed to add game", err);
    const error = err?.message || "Failed to add game";
    return new Response(JSON.stringify({ error }), { status: 500 });
  }
}

export async function PUT(req) {
  if (!isAuthorized(req)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  try {
    const payload = await req.json();
    const slug = await createGame(payload);

    return new Response(JSON.stringify({ message: "Game updated", slug }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Failed to update game", err);
    const error = err?.message || "Failed to update game";
    return new Response(JSON.stringify({ error }), { status: 500 });
  }
}

export async function DELETE(req) {
  if (!isAuthorized(req)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  try {
    const url = new URL(req.url);
    const slug = url.searchParams.get("slug");
    if (!slug) {
      return new Response(JSON.stringify({ error: "Missing slug" }), { status: 400 });
    }

    const deleted = await deleteGameBySlug(slug);
    if (!deleted) {
      return new Response(JSON.stringify({ error: "Game not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "Game deleted", slug }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Failed to delete game", err);
    const error = err?.message || "Failed to delete game";
    return new Response(JSON.stringify({ error }), { status: 500 });
  }
}
