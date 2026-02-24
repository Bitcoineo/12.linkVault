import { getCollections } from "@/lib/collections";
import { SidebarLink } from "./sidebar-link";

export async function Sidebar() {
  const result = await getCollections();
  const collections = result.data ?? [];

  return (
    <aside className="w-64 flex-shrink-0 bg-sidebar-bg border-r border-card-border p-4 flex flex-col gap-6">
      <div className="px-3">
        <h1 className="text-lg font-bold text-foreground tracking-tight">
          LinkVault
        </h1>
      </div>

      <nav className="flex flex-col gap-1">
        <SidebarLink href="/" label="All Bookmarks" />
      </nav>

      {collections.length > 0 && (
        <div className="flex flex-col gap-1">
          <span className="px-3 text-xs font-semibold uppercase tracking-wider text-muted">
            Collections
          </span>
          <nav className="flex flex-col gap-1">
            {collections.map((col) => (
              <SidebarLink
                key={col.id}
                href={`/?collectionId=${col.id}`}
                label={col.name}
                paramKey="collectionId"
                paramValue={col.id}
              />
            ))}
          </nav>
        </div>
      )}
    </aside>
  );
}
