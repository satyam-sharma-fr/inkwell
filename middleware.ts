import { NextRequest, NextResponse } from "next/server";

async function hmacSign(payload: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = request.cookies.get("inkwell_session")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    const secret = process.env.SESSION_SECRET;
    if (!secret) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    const lastDot = token.lastIndexOf(".");
    if (lastDot === -1) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    const payload = token.substring(0, lastDot);
    const signature = token.substring(lastDot + 1);
    const expected = await hmacSign(payload, secret);

    if (signature !== expected) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    try {
      const data = JSON.parse(payload);
      if (data.exp && Date.now() > data.exp) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
