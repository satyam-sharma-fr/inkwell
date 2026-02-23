import Link from "next/link";
import type { Post } from "@/lib/actions";

export default function PostCard({ post }: { post: Post }) {
  const date = new Date(post.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="group rounded-lg border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md">
      {post.featured_image_url && (
        <div className="mb-4 overflow-hidden rounded-md">
          <img
            src={post.featured_image_url}
            alt={post.title}
            className="h-48 w-full object-cover transition-transform group-hover:scale-105"
          />
        </div>
      )}
      <time className="text-xs font-medium uppercase tracking-wider text-muted">
        {date}
      </time>
      <h2 className="mt-2 font-serif text-xl font-semibold text-ink">
        <Link href={`/blog/${post.slug}`} className="hover:text-accent">
          {post.title}
        </Link>
      </h2>
      {post.excerpt && (
        <p className="mt-2 text-sm leading-relaxed text-muted">{post.excerpt}</p>
      )}
      <Link
        href={`/blog/${post.slug}`}
        className="mt-4 inline-block text-sm font-medium text-accent hover:underline"
      >
        Read more &rarr;
      </Link>
    </article>
  );
}
