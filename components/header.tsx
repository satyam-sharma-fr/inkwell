import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <nav className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-serif text-2xl font-bold tracking-tight text-ink">
          inkwell
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/blog"
            className="text-sm font-medium text-muted transition-colors hover:text-ink"
          >
            Blog
          </Link>
          <Link
            href="/admin"
            className="text-sm font-medium text-muted transition-colors hover:text-ink"
          >
            Admin
          </Link>
        </div>
      </nav>
    </header>
  );
}
