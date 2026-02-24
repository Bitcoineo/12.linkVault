import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="p-6 max-w-lg mx-auto text-center space-y-4 mt-20">
      <h2 className="text-lg font-semibold text-foreground">Not found</h2>
      <p className="text-sm text-muted">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="inline-block px-4 py-2 text-sm font-medium rounded-md bg-accent text-white hover:bg-accent-hover transition"
      >
        Back to bookmarks
      </Link>
    </div>
  );
}
