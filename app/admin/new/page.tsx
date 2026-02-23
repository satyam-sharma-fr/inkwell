import PostForm from "@/components/post-form";
import { createPost } from "@/lib/actions";

export default function NewPostPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="mb-8 font-serif text-3xl font-bold text-ink">New Post</h1>
      <PostForm action={createPost} />
    </div>
  );
}
