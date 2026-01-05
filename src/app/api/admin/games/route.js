import { cookies } from "next/headers";
import { games } from "@/lib/games";

const COOKIE_NAME = "admin_token";

function isAuthorized(req) {
  const cookieToken = cookies().get(COOKIE_NAME)?.value;
  const headerToken = req.headers.get("admin_token");
  const token = cookieToken || headerToken;
  return token && token === process.env.ADMIN_TOKEN;
}

export async function GET(req) {
  if (!isAuthorized(req)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  return new Response(JSON.stringify({ games }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(req) {
  if (!isAuthorized(req)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  try {
    const payload = await req.json();
    // Push new game to your in-memory games array
    // WARNING: This resets on redeploy. For permanent storage, use a DB.
    games.push(payload);

    return new Response(JSON.stringify({ message: "Game added", slug: payload.slug }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to add game" }), { status: 500 });
  }
}
