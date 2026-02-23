import Link from "next/link";
import { getAllPosts, deletePost, togglePublish, logoutAdmin } from "@/lib/actions";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const posts = await getAllPosts();

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-serif text-3xl font-bold text-ink">Dashboard</h1>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/new"
            className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-600"
          >
            New Post
          </Link>
          <form action={logoutAdmin}>
            <button
              type="submit"
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              Logout
            </button>
          </form>
        </div>
      </div>

      {posts.length === 0 ? (
        <p className="text-muted">No posts yet. Create your first post!</p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3 font-medium text-gray-700">Title</th>
                <th className="px-4 py-3 font-medium text-gray-700">Status</th>
                <th className="px-4 py-3 font-medium text-gray-700">Date</th>
                <th className="px-4 py-3 text-right font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {posts.map((post) => (
                <tr key={post.id} className="bg-white">
                  <td className="px-4 py-3 font-medium text-ink">{post.title}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        post.published
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {post.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {new Date(post.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/edit/${post.id}`}
                        className="text-sm font-medium text-accent hover:underline"
                      >
                        Edit
                      </Link>
                      <form
                        action={async () => {
                          "use server";
                          await togglePublish(post.id);
                        }}
                      >
                        <button
                          type="submit"
                          className="text-sm font-medium text-blue-600 hover:underline"
                        >
                          {post.published ? "Unpublish" : "Publish"}
                        </button>
                      </form>
                      <form
                        action={async () => {
                          "use server";
                          await deletePost(post.id);
                        }}
                      >
                        <button
                          type="submit"
                          className="text-sm font-medium text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
