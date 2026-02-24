export default function DashboardLoading() {
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="h-8 w-36 bg-card rounded" />
        <div className="h-10 w-32 bg-card rounded-md" />
      </div>

      {/* Search bar */}
      <div className="h-11 w-full bg-card rounded-lg" />

      {/* Tag pills */}
      <div className="flex gap-2">
        <div className="h-7 w-20 bg-card rounded-full" />
        <div className="h-7 w-16 bg-card rounded-full" />
        <div className="h-7 w-24 bg-card rounded-full" />
        <div className="h-7 w-14 bg-card rounded-full" />
      </div>

      {/* Card grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-card border border-card-border rounded-lg p-4 space-y-3"
          >
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-card-border rounded-sm" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 bg-card-border rounded" />
                <div className="h-3 w-1/2 bg-card-border rounded" />
              </div>
            </div>
            <div className="flex gap-1.5">
              <div className="h-5 w-14 bg-card-border rounded-full" />
              <div className="h-5 w-10 bg-card-border rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
