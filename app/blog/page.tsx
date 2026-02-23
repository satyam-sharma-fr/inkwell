import type { Metadata } from "next";
import PostCard from "@/components/post-card";
import { getPublishedPosts } from "@/lib/actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog",
};

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="mb-8 font-serif text-3xl font-bold text-ink">All Posts</h1>
      {posts.length === 0 ? (
        <p className="text-muted">No posts yet. Check back soon!</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
