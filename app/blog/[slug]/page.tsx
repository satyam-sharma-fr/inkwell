import type { Metadata } from "next";
import { notFound } from "next/navigation";
import MarkdownRenderer from "@/components/markdown-renderer";
import { getPostBySlug, getPublishedPosts } from "@/lib/actions";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  try {
    const posts = await getPublishedPosts();
    return posts.map((post) => ({ slug: post.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Not Found" };
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const date = new Date(post.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <header className="mb-10">
        <time className="text-sm font-medium uppercase tracking-wider text-muted">
          {date}
        </time>
        <h1 className="mt-2 font-serif text-4xl font-bold tracking-tight text-ink">
          {post.title}
        </h1>
        {post.excerpt && <p className="mt-4 text-lg text-muted">{post.excerpt}</p>}
      </header>
      {post.featured_image_url && (
        <img
          src={post.featured_image_url}
          alt={post.title}
          className="mb-10 w-full rounded-lg object-cover"
        />
      )}
      <MarkdownRenderer content={post.content} />
    </article>
  );
}
