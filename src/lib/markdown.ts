/**
 * Minimal, safe Markdown -> HTML for blog posts: ## headings, paragraphs, - lists, 1. lists,
 * **bold**, *italic*, [links](/path). All text is HTML-escaped first, so admins can't inject scripts.
 */
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

function inline(s: string) {
  return esc(s)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*])\*(?!\s)(.+?)\*/g, "$1<em>$2</em>")
    .replace(/\[([^\]]+)\]\(((?:https?:\/\/|\/)[^)\s]*)\)/g, (_m, text, href) => {
      const external = href.startsWith("http");
      return `<a href="${href}"${external ? ' rel="noopener" target="_blank"' : ""}>${text}</a>`;
    });
}

export function slugHeading(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function renderMarkdown(md: string) {
  const blocks = md.replace(/\r\n/g, "\n").split(/\n{2,}/);
  const out: string[] = [];
  for (const raw of blocks) {
    const block = raw.trim();
    if (!block) continue;
    const h = block.match(/^(#{2,4})\s+(.+)$/);
    if (h && !block.includes("\n")) {
      const level = h[1].length;
      out.push(`<h${level} id="${slugHeading(h[2])}">${inline(h[2])}</h${level}>`);
      continue;
    }
    const lines = block.split("\n");
    if (lines.every((l) => /^\s*[-*]\s+/.test(l))) {
      out.push(`<ul>${lines.map((l) => `<li>${inline(l.replace(/^\s*[-*]\s+/, ""))}</li>`).join("")}</ul>`);
      continue;
    }
    if (lines.every((l) => /^\s*\d+\.\s+/.test(l))) {
      out.push(`<ol>${lines.map((l) => `<li>${inline(l.replace(/^\s*\d+\.\s+/, ""))}</li>`).join("")}</ol>`);
      continue;
    }
    out.push(`<p>${lines.map(inline).join("<br />")}</p>`);
  }
  return out.join("\n");
}

export function headings(md: string) {
  return [...md.matchAll(/^##\s+(.+)$/gm)].map((m) => ({ id: slugHeading(m[1]), text: m[1].replace(/\*\*/g, "") }));
}

export function readingMinutes(md: string) {
  return Math.max(2, Math.round(md.split(/\s+/).length / 220));
}
