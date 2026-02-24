"use client";

interface ErrorPageProps {
  error: Error;
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <div className="p-6 max-w-lg mx-auto text-center space-y-4 mt-20">
      <div className="bg-card border border-card-border rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold text-foreground">
          Something went wrong
        </h2>
        <p className="text-sm text-muted">{error.message}</p>
        <button
          onClick={reset}
          className="px-4 py-2 text-sm font-medium rounded-md bg-accent text-white hover:bg-accent-hover transition"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
