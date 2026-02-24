"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface SidebarLinkProps {
  href: string;
  label: string;
  paramKey?: string;
  paramValue?: string;
}

export function SidebarLink({ href, label, paramKey, paramValue }: SidebarLinkProps) {
  const searchParams = useSearchParams();

  const isActive = paramKey
    ? searchParams.get(paramKey) === paramValue
    : !searchParams.get("collectionId") && !searchParams.get("tagId") && !searchParams.get("search");

  return (
    <Link
      href={href}
      className={`block px-3 py-2 rounded-md text-sm transition-colors ${
        isActive
          ? "bg-accent/15 text-accent font-medium"
          : "text-muted hover:text-foreground hover:bg-card"
      }`}
    >
      {label}
    </Link>
  );
}
