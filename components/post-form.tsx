"use client";

import { useState } from "react";
import ImageUpload from "./image-upload";
import MarkdownRenderer from "./markdown-renderer";

type PostFormProps = {
  action: (formData: FormData) => Promise<void>;
  initial?: {
    title: string;
    slug: string;
    content: string;
    excerpt: string | null;
    featured_image_url: string | null;
    published: boolean;
  };
};

export default function PostForm({ action, initial }: PostFormProps) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [imageUrl, setImageUrl] = useState(initial?.featured_image_url ?? "");
  const [published, setPublished] = useState(initial?.published ?? false);
  const [showPreview, setShowPreview] = useState(false);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!initial) {
      setSlug(
        value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "")
      );
    }
  }

  return (
    <form action={action} className="space-y-6">
      <div>
        <label htmlFor="title" className="mb-1 block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        />
      </div>

      <div>
        <label htmlFor="slug" className="mb-1 block text-sm font-medium text-gray-700">
          Slug
        </label>
        <input
          id="slug"
          name="slug"
          type="text"
          required
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 font-mono text-sm shadow-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        />
      </div>

      <div>
        <label htmlFor="excerpt" className="mb-1 block text-sm font-medium text-gray-700">
          Excerpt
        </label>
        <textarea
          id="excerpt"
          name="excerpt"
          rows={2}
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        />
      </div>

      <ImageUpload currentUrl={imageUrl || null} onUploaded={setImageUrl} />
      <input type="hidden" name="featured_image_url" value={imageUrl} />

      <div>
        <div className="mb-1 flex items-center justify-between">
          <label htmlFor="content" className="text-sm font-medium text-gray-700">
            Content (Markdown)
          </label>
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="text-sm font-medium text-accent hover:underline"
          >
            {showPreview ? "Edit" : "Preview"}
          </button>
        </div>
        {showPreview ? (
          <div className="min-h-[300px] rounded-md border border-gray-300 p-4">
            <MarkdownRenderer content={content} />
          </div>
        ) : (
          <textarea
            id="content"
            name="content"
            rows={16}
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 font-mono text-sm shadow-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        )}
      </div>

      <div className="flex items-center gap-2">
        <input
          id="published"
          type="checkbox"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-accent focus:ring-accent"
        />
        <label htmlFor="published" className="text-sm font-medium text-gray-700">
          Publish immediately
        </label>
      </div>
      <input type="hidden" name="published" value={published ? "true" : "false"} />

      <button
        type="submit"
        className="rounded-md bg-accent px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
      >
        {initial ? "Update Post" : "Create Post"}
      </button>
    </form>
  );
}
