// Very small "just enough" markdown renderer for the blog body.
// Supports:
//   Paragraph breaks on blank lines
//   **bold** and *italic*
//   [text](url) inline links
//   Lines starting with "- " become <li>
//   Lines starting with "## " become <h3>
// This deliberately avoids a dependency; swap to `react-markdown` later if
// you want tables / code / images.

import React from "react";

function renderInline(text, keyPrefix = "k") {
  // Split on **bold**, *italic* and [text](url) while preserving delimiters.
  const parts = [];
  let cursor = 0;
  const re = /(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;
  let match;
  let idx = 0;
  while ((match = re.exec(text)) !== null) {
    if (match.index > cursor) parts.push(text.slice(cursor, match.index));
    const token = match[0];
    if (token.startsWith("**")) {
      parts.push(<strong key={`${keyPrefix}-b-${idx++}`}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith("*")) {
      parts.push(<em key={`${keyPrefix}-i-${idx++}`}>{token.slice(1, -1)}</em>);
    } else if (token.startsWith("[")) {
      const m = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(token);
      if (m) {
        parts.push(
          <a
            key={`${keyPrefix}-a-${idx++}`}
            href={m[2]}
            target={m[2].startsWith("http") ? "_blank" : undefined}
            rel="noopener noreferrer"
            className="underline text-clay-500 hover:text-clay-600"
          >
            {m[1]}
          </a>
        );
      } else {
        parts.push(token);
      }
    }
    cursor = re.lastIndex;
  }
  if (cursor < text.length) parts.push(text.slice(cursor));
  return parts;
}

export default function MarkdownLite({ text, className = "" }) {
  if (!text) return null;
  const blocks = text.split(/\n{2,}/);
  return (
    <div className={className}>
      {blocks.map((block, i) => {
        const lines = block.split("\n");
        if (lines.every((l) => /^\s*-\s+/.test(l))) {
          return (
            <ul key={i} className="list-disc pl-5 space-y-1.5 my-4">
              {lines.map((l, j) => (
                <li key={j}>{renderInline(l.replace(/^\s*-\s+/, ""), `p-${i}-${j}`)}</li>
              ))}
            </ul>
          );
        }
        if (block.startsWith("## ")) {
          return (
            <h3 key={i} className="font-display text-2xl mt-8 mb-3 text-[#111827]">
              {renderInline(block.replace(/^##\s+/, ""), `h-${i}`)}
            </h3>
          );
        }
        return (
          <p key={i} className="my-4">
            {renderInline(block, `p-${i}`)}
          </p>
        );
      })}
    </div>
  );
}
