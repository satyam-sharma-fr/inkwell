import Link from "next/link";
import PostCard from "@/components/post-card";
import { getRecentPosts } from "@/lib/actions";

export const dynamic = "force-dynamic";

export default async function Home() {
  const posts = await getRecentPosts(3);

  return (
    <div>
      <section className="bg-white py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h1 className="font-serif text-5xl font-bold tracking-tight text-ink">
            Welcome to inkwell
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
            Thoughts, stories, and ideas — written in ink, shared with the world.
          </p>
          <Link
            href="/blog"
            className="mt-8 inline-block rounded-md bg-accent px-6 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-red-600"
          >
            Read the Blog
          </Link>
        </div>
      </section>

      {posts.length > 0 && (
        <section className="mx-auto max-w-4xl px-6 py-16">
          <h2 className="mb-8 font-serif text-2xl font-semibold text-ink">
            Recent Posts
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
