import type { Result } from "./types";
import { ok, err } from "./types";

type Metadata = {
  title: string | null;
  faviconUrl: string | null;
};

function extractFaviconUrl(html: string, baseUrl: string): string | null {
  // <link rel="icon" href="..."> or <link rel="shortcut icon" href="...">
  const patterns = [
    /<link\s+[^>]*rel=["'](?:shortcut\s+)?icon["'][^>]*href=["']([^"']+)["'][^>]*>/i,
    /<link\s+[^>]*href=["']([^"']+)["'][^>]*rel=["'](?:shortcut\s+)?icon["'][^>]*>/i,
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) {
      try {
        return new URL(match[1], baseUrl).toString();
      } catch {
        continue;
      }
    }
  }

  // Fallback: /favicon.ico at the domain root
  try {
    const urlObj = new URL(baseUrl);
    return `${urlObj.origin}/favicon.ico`;
  } catch {
    return null;
  }
}

export async function fetchMetadata(
  url: string
): Promise<Result<Metadata>> {
  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "LinkVault/1.0" },
      signal: AbortSignal.timeout(10_000),
      redirect: "follow",
    });

    if (!response.ok) {
      return err(`HTTP ${response.status} ${response.statusText}`);
    }

    const html = await response.text();

    const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : null;

    const faviconUrl = extractFaviconUrl(html, url);

    return ok({ title, faviconUrl });
  } catch (e) {
    if (e instanceof Error) {
      if (e.name === "TimeoutError") return err("Request timed out");
      return err(`Failed to fetch metadata: ${e.message}`);
    }
    return err("Failed to fetch metadata");
  }
}
