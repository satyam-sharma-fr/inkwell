export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-4xl px-6 py-8 text-center text-sm text-muted">
        <p>&copy; {new Date().getFullYear()} inkwell. All rights reserved.</p>
      </div>
    </footer>
  );
}
