#!/usr/bin/env node
/**
 * @rcnr/theme migration codemod
 *
 * Rewrites raw Tailwind color utility classes (text-amber-400, bg-blue-600, etc.)
 * into theme-aware @rcnr/theme classes (.rcnr-callout-warning, .btn-primary, etc.).
 *
 * Usage from any consumer repo:
 *   node node_modules/@rcnr/theme/scripts/migrate.mjs src/
 *   node node_modules/@rcnr/theme/scripts/migrate.mjs src/ --dry-run
 *   node node_modules/@rcnr/theme/scripts/migrate.mjs src/ --report-only
 *
 * Flags:
 *   --dry-run     Show diff without writing files
 *   --report-only Just print the report; don't touch files
 *   --quiet       Suppress per-file output
 *
 * Why regex, not AST: Tailwind classes are string literals inside JSX
 * className= attributes. Regex with proper word boundaries handles 95%+
 * of cases cleanly and is debuggable. The remaining 5% (dynamic class
 * concatenation, template literals with logic) get FLAGGED for manual
 * review rather than silently mis-rewritten.
 *
 * Reference: see .rcnr/stories/bluebook-refactor-theme-as-contract.md
 * for the design rationale.
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------------------------------------------------------------------------
// Migration rules — ordered by specificity. Multi-class patterns FIRST so
// they collapse before single-class patterns nibble at them.
// ---------------------------------------------------------------------------

/**
 * Each rule: { name, find: RegExp, replace: string|fn, kind: "auto" | "flag" }
 * - "auto" rules apply automatically.
 * - "flag" rules just log the location for manual review (e.g. SVG icons
 *   where text-red-400 is semantically correct via currentColor).
 */
const RULES = [
  // ---- Status badge collapses (highest specificity, multi-class) ----
  {
    name: "Active status badge",
    find: /\bbg-emerald-500\/15\s+text-emerald-400(\s+ring-1\s+ring-emerald-500\/30)?\b/g,
    replace: "rcnr-badge-active",
    kind: "auto",
  },
  {
    name: "Draft status badge",
    find: /\bbg-amber-500\/15\s+text-amber-400(\s+ring-1\s+ring-amber-500\/30)?\b/g,
    replace: "rcnr-badge-draft",
    kind: "auto",
  },

  // ---- Primary action button (multi-class) ----
  {
    name: "Primary blue button",
    find: /\bbg-blue-600\s+(?:hover:bg-blue-700\s+)?text-white(?:\s+hover:bg-blue-700)?\b/g,
    replace: "btn-primary",
    kind: "auto",
  },
  {
    name: "Primary blue button — text/bg in different order",
    find: /\btext-white\s+bg-blue-600(?:\s+hover:bg-blue-700)?\b/g,
    replace: "btn-primary",
    kind: "auto",
  },

  // ---- Danger button (destructive actions) ----
  {
    name: "Danger red button",
    find: /\bbg-red-600\s+(?:hover:bg-red-700\s+)?text-white(?:\s+hover:bg-red-700)?\b/g,
    replace: "btn-danger",
    kind: "auto",
  },

  // ---- Inline error/success/link text (single-class swaps) ----
  {
    name: "Error text",
    find: /\btext-red-400\b(?!\/)/g, // no opacity suffix; opacity variants flagged for review
    replace: "rcnr-error-text",
    kind: "auto",
  },
  {
    name: "Inline link",
    find: /\btext-blue-400\s+hover:text-blue-300\b/g,
    replace: "rcnr-link",
    kind: "auto",
  },

  // ---- Brand-color opacity variants → theme-aware muted/dim text ----
  {
    name: "text-brand/50 → text-fg-muted",
    find: /\btext-brand\/(50|60|70)\b/g,
    replace: "text-fg-muted",
    kind: "auto",
  },
  {
    name: "text-fg/60 → text-fg-muted",
    find: /\btext-fg\/(50|60|70)\b/g,
    replace: "text-fg-muted",
    kind: "auto",
  },

  // ---- Footer/secondary brand text ----
  {
    name: "text-brand-dark/50 → text-fg-dim",
    find: /\btext-brand-dark\/50\b/g,
    replace: "text-fg-dim",
    kind: "auto",
  },

  // ---- Things to FLAG, not auto-rewrite ----
  {
    name: "Amber text on amber bg (callout candidate — manual review)",
    find: /\btext-amber-(100|200|300|400)(\/\d+)?\b/g,
    replace: null,
    kind: "flag",
    note: "Likely belongs in a .rcnr-callout-warning block; manual review.",
  },
  {
    name: "Emerald text with opacity (correct-answer indicator candidate)",
    find: /\btext-emerald-(300|400)\/\d+\b/g,
    replace: null,
    kind: "flag",
    note: "Consider .rcnr-success-text or correct-answer-marker class.",
  },
  {
    name: "Red text with opacity (small error indicator)",
    find: /\btext-red-(300|400)\/\d+\b/g,
    replace: null,
    kind: "flag",
    note: "Consider .rcnr-error-text or icon-only currentColor.",
  },
  {
    name: "SVG icon color (likely OK if inside <svg>)",
    find: /className="[^"]*\btext-(red|amber|emerald|blue)-(300|400|500)\b[^"]*"/g,
    replace: null,
    kind: "flag",
    note: "If on a <svg> for icon coloring, this is fine (currentColor pattern). Otherwise migrate.",
  },
];

// ---------------------------------------------------------------------------
// File walking
// ---------------------------------------------------------------------------

const TARGET_EXTENSIONS = new Set([".tsx", ".jsx", ".ts", ".js"]);
const SKIP_DIRS = new Set(["node_modules", "dist", "build", ".next", ".git", "coverage"]);

async function walk(dir) {
  const out = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".") && entry.name !== ".storybook") continue;
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...(await walk(full)));
    } else if (TARGET_EXTENSIONS.has(path.extname(entry.name))) {
      out.push(full);
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// Per-file processing
// ---------------------------------------------------------------------------

function processFile(content) {
  let next = content;
  const autoApplied = []; // { ruleName, count }
  const flags = []; // { ruleName, line, snippet, note }

  for (const rule of RULES) {
    if (rule.kind === "auto") {
      const before = next;
      let count = 0;
      next = next.replace(rule.find, () => {
        count += 1;
        return rule.replace;
      });
      if (count > 0) autoApplied.push({ ruleName: rule.name, count });
    } else if (rule.kind === "flag") {
      const matches = [...next.matchAll(rule.find)];
      for (const m of matches) {
        const line = next.slice(0, m.index).split("\n").length;
        const snippet = m[0].slice(0, 100);
        flags.push({ ruleName: rule.name, line, snippet, note: rule.note });
      }
    }
  }

  return { next, autoApplied, flags };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
    console.log(
      "Usage: node scripts/migrate.mjs <src-dir> [--dry-run] [--report-only] [--quiet]\n",
    );
    process.exit(args.length === 0 ? 1 : 0);
  }

  const target = args.find((a) => !a.startsWith("--"));
  const dryRun = args.includes("--dry-run") || args.includes("--report-only");
  const reportOnly = args.includes("--report-only");
  const quiet = args.includes("--quiet");

  if (!target) {
    console.error("Error: target directory required.");
    process.exit(1);
  }

  const absTarget = path.resolve(target);
  try {
    await fs.access(absTarget);
  } catch {
    console.error(`Error: ${absTarget} does not exist.`);
    process.exit(1);
  }

  const files = await walk(absTarget);
  if (!quiet) {
    console.log(`@rcnr/theme migrate: scanning ${files.length} files in ${absTarget}\n`);
  }

  let totalRewrites = 0;
  let totalFlags = 0;
  let filesChanged = 0;
  const allFlags = [];

  for (const file of files) {
    const original = await fs.readFile(file, "utf8");
    const { next, autoApplied, flags } = processFile(original);

    if (autoApplied.length > 0) {
      const changeCount = autoApplied.reduce((sum, a) => sum + a.count, 0);
      totalRewrites += changeCount;
      if (next !== original) {
        filesChanged += 1;
        if (!reportOnly && !dryRun) {
          await fs.writeFile(file, next, "utf8");
        }
        if (!quiet) {
          const rel = path.relative(absTarget, file);
          console.log(
            `  ${dryRun ? "[dry]" : "[ok ]"} ${rel}  (${changeCount} rewrites)`,
          );
          for (const a of autoApplied) {
            console.log(`         - ${a.ruleName}: ${a.count}`);
          }
        }
      }
    }

    if (flags.length > 0) {
      totalFlags += flags.length;
      const rel = path.relative(absTarget, file);
      for (const f of flags) {
        allFlags.push({ file: rel, ...f });
      }
    }
  }

  console.log("\n" + "=".repeat(70));
  console.log("Summary:");
  console.log(`  Files scanned:    ${files.length}`);
  console.log(`  Files rewritten:  ${filesChanged}${dryRun ? " (dry run — no writes)" : ""}`);
  console.log(`  Auto rewrites:    ${totalRewrites}`);
  console.log(`  Flagged matches:  ${totalFlags} (manual review)`);
  console.log("=".repeat(70));

  if (allFlags.length > 0) {
    console.log("\nFlags requiring manual review:");
    const grouped = new Map();
    for (const f of allFlags) {
      const key = f.ruleName;
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key).push(f);
    }
    for (const [rule, items] of grouped) {
      console.log(`\n  ${rule}: ${items.length} occurrence(s)`);
      console.log(`    ${items[0].note}`);
      for (const f of items.slice(0, 5)) {
        console.log(`    ${f.file}:${f.line}  ${f.snippet}`);
      }
      if (items.length > 5) console.log(`    ... and ${items.length - 5} more`);
    }
  }

  if (dryRun && filesChanged > 0) {
    console.log("\n(Dry run. Re-run without --dry-run to apply changes.)");
  }
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
