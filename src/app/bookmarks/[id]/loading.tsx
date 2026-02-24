export default function BookmarkDetailLoading() {
  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6 animate-pulse">
      {/* Back link */}
      <div className="h-4 w-32 bg-card rounded" />

      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="w-8 h-8 bg-card rounded-md" />
        <div className="flex-1 space-y-2">
          <div className="h-6 w-2/3 bg-card rounded" />
          <div className="h-4 w-1/2 bg-card rounded" />
        </div>
      </div>

      {/* Description */}
      <div className="bg-card border border-card-border rounded-lg p-4 space-y-2">
        <div className="h-4 w-full bg-card-border rounded" />
        <div className="h-4 w-3/4 bg-card-border rounded" />
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <div className="h-3 w-12 bg-card rounded" />
        <div className="flex gap-2">
          <div className="h-6 w-16 bg-card-border rounded-full" />
          <div className="h-6 w-20 bg-card-border rounded-full" />
        </div>
      </div>

      {/* Metadata */}
      <div className="h-3 w-24 bg-card rounded" />

      {/* Actions */}
      <div className="flex gap-3 pt-2 border-t border-card-border">
        <div className="h-9 w-16 bg-card rounded-md" />
        <div className="h-9 w-20 bg-card rounded-md" />
      </div>
    </div>
  );
}
