import { cookies } from "next/headers";

export const runtime = "nodejs";

const COOKIE_NAME = "admin_token";
const DEFAULT_OWNER = process.env.GITHUB_OWNER || "phurestudio";
const DEFAULT_REPO = process.env.GITHUB_REPO || "website";
const DEFAULT_BRANCH = process.env.GITHUB_BRANCH || "main";
const BASE_PATH = process.env.GITHUB_UPLOAD_PATH || "public/uploads";
const MAX_BYTES = Number(process.env.GITHUB_UPLOAD_MAX_BYTES || 8_000_000);

function isAuthorized(req) {
  const cookieToken = cookies().get(COOKIE_NAME)?.value;
  const headerToken = req.headers.get("admin_token");
  const token = cookieToken || headerToken;
  return token && token === process.env.ADMIN_API_TOKEN;
}

function sanitizeName(name = "") {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

function buildPath(fileName, folder = "") {
  const safeName = sanitizeName(fileName || "upload.bin");
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const random = Math.random().toString(36).slice(2, 8);
  const prefix = folder ? `${folder.replace(/[^a-zA-Z0-9/_-]/g, "")}/` : "";
  return `${BASE_PATH}/${prefix}${timestamp}-${random}-${safeName}`;
}

async function uploadToGitHub(file, folder = "") {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error("GITHUB_TOKEN is not set");
  }

  const owner = DEFAULT_OWNER;
  const repo = DEFAULT_REPO;
  const branch = DEFAULT_BRANCH;
  const path = buildPath(file.name, folder);
  const content = Buffer.from(await file.arrayBuffer()).toString("base64");

  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "phure-site-admin",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: `Upload ${file.name}`,
      content,
      branch,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const message = err?.message || "Failed to upload file";
    throw new Error(message);
  }

  const data = await res.json();
  const url =
    data?.content?.download_url ||
    `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`;

  return { url, path };
}

export async function POST(req) {
  if (!isAuthorized(req)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file");
  const folder = form.get("folder") || "";

  if (!file || typeof file === "string") {
    return new Response(JSON.stringify({ error: "No file provided" }), { status: 400 });
  }

  if (MAX_BYTES && file.size > MAX_BYTES) {
    return new Response(
      JSON.stringify({ error: `File too large (max ${MAX_BYTES} bytes)` }),
      { status: 400 }
    );
  }

  try {
    const result = await uploadToGitHub(file, folder.toString());
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Upload failed", err);
    const error = err?.message || "Upload failed";
    return new Response(JSON.stringify({ error }), { status: 500 });
  }
}
