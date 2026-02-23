"use server";

import { getDb } from "./db";
import { verifyPassword, createSession, clearSession } from "./auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type Post = {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  featured_image_url: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
};

// --- Read operations ---

export async function getPublishedPosts(): Promise<Post[]> {
  const sql = getDb();
  const rows = await sql`
    SELECT * FROM posts WHERE published = true ORDER BY created_at DESC
  `;
  return rows as Post[];
}

export async function getRecentPosts(limit = 3): Promise<Post[]> {
  const sql = getDb();
  const rows = await sql`
    SELECT * FROM posts WHERE published = true ORDER BY created_at DESC LIMIT ${limit}
  `;
  return rows as Post[];
}

export async function getAllPosts(): Promise<Post[]> {
  const sql = getDb();
  const rows = await sql`
    SELECT * FROM posts ORDER BY created_at DESC
  `;
  return rows as Post[];
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const sql = getDb();
  const rows = await sql`
    SELECT * FROM posts WHERE slug = ${slug} AND published = true LIMIT 1
  `;
  return (rows[0] as Post) ?? null;
}

export async function getPostById(id: number): Promise<Post | null> {
  const sql = getDb();
  const rows = await sql`
    SELECT * FROM posts WHERE id = ${id} LIMIT 1
  `;
  return (rows[0] as Post) ?? null;
}

// --- Write operations ---

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function createPost(formData: FormData): Promise<void> {
  const title = formData.get("title") as string;
  const slug = (formData.get("slug") as string) || generateSlug(title);
  const content = formData.get("content") as string;
  const excerpt = (formData.get("excerpt") as string) || null;
  const featuredImageUrl = (formData.get("featured_image_url") as string) || null;
  const published = formData.get("published") === "true";

  const sql = getDb();
  await sql`
    INSERT INTO posts (title, slug, content, excerpt, featured_image_url, published)
    VALUES (${title}, ${slug}, ${content}, ${excerpt}, ${featuredImageUrl}, ${published})
  `;

  revalidatePath("/blog");
  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function updatePost(id: number, formData: FormData): Promise<void> {
  const title = formData.get("title") as string;
  const slug = (formData.get("slug") as string) || generateSlug(title);
  const content = formData.get("content") as string;
  const excerpt = (formData.get("excerpt") as string) || null;
  const featuredImageUrl = (formData.get("featured_image_url") as string) || null;
  const published = formData.get("published") === "true";

  const sql = getDb();
  await sql`
    UPDATE posts
    SET title = ${title}, slug = ${slug}, content = ${content}, excerpt = ${excerpt},
        featured_image_url = ${featuredImageUrl}, published = ${published},
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ${id}
  `;

  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function deletePost(id: number): Promise<void> {
  const sql = getDb();
  await sql`DELETE FROM posts WHERE id = ${id}`;

  revalidatePath("/blog");
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function togglePublish(id: number): Promise<void> {
  const sql = getDb();
  await sql`
    UPDATE posts SET published = NOT published, updated_at = CURRENT_TIMESTAMP WHERE id = ${id}
  `;

  revalidatePath("/blog");
  revalidatePath("/");
  revalidatePath("/admin");
}

// --- Auth operations ---

export async function loginAdmin(
  _prevState: { error: string } | null,
  formData: FormData
): Promise<{ error: string } | null> {
  const password = formData.get("password") as string;

  if (!password) {
    return { error: "Password is required" };
  }

  const valid = await verifyPassword(password);
  if (!valid) {
    return { error: "Invalid password" };
  }

  await createSession();
  redirect("/admin");
}

export async function logoutAdmin(): Promise<void> {
  await clearSession();
  redirect("/admin/login");
}
