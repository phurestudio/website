import { cookies } from "next/headers";
import { createNews, listNews } from "@/lib/data";

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
    const url = new URL(req.url);
    const limit = Number(url.searchParams.get("limit") || 50);
    const news = await listNews(limit);
    return new Response(JSON.stringify({ news }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Failed to list news", err);
    return new Response(JSON.stringify({ error: "Failed to list news" }), { status: 500 });
  }
}

export async function POST(req) {
  if (!isAuthorized(req)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  try {
    const payload = await req.json();
    const slug = await createNews({
      title: payload.title,
      slug: payload.slug,
      excerpt: payload.excerpt,
      banner: payload.banner,
      screenshots: payload.screenshots,
      youtubeUrl: payload.youtubeUrl,
      gameSlug: payload.gameSlug,
      body: payload.body,
    });

    return new Response(JSON.stringify({ message: "News added", slug }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Failed to add news", err);
    const error = err?.message || "Failed to add news";
    return new Response(JSON.stringify({ error }), { status: 500 });
  }
}
