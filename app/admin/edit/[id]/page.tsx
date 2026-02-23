import { notFound } from "next/navigation";
import PostForm from "@/components/post-form";
import { getPostById, updatePost } from "@/lib/actions";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditPostPage({ params }: Props) {
  const { id } = await params;
  const post = await getPostById(Number(id));
  if (!post) notFound();

  async function handleUpdate(formData: FormData) {
    "use server";
    await updatePost(Number(id), formData);
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="mb-8 font-serif text-3xl font-bold text-ink">Edit Post</h1>
      <PostForm
        action={handleUpdate}
        initial={{
          title: post.title,
          slug: post.slug,
          content: post.content,
          excerpt: post.excerpt,
          featured_image_url: post.featured_image_url,
          published: post.published,
        }}
      />
    </div>
  );
}
