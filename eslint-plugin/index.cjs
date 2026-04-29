/**
 * @rcnr/theme ESLint plugin
 *
 * Rules:
 * - no-raw-tailwind-colors — flags raw text-{color}-N / bg-{color}-N etc.
 *   in JSX className strings; suggests theme classes when known.
 *
 * Usage in a consumer's eslint.config.js (flat config, ESLint 9+):
 *
 *   import rcnrTheme from "@rcnr/theme/eslint-plugin/index.cjs";
 *   export default [
 *     {
 *       plugins: { "@rcnr/theme": rcnrTheme },
 *       rules: {
 *         "@rcnr/theme/no-raw-tailwind-colors": "error",
 *       },
 *     },
 *   ];
 *
 * Or use the preset:
 *
 *   import rcnrTheme from "@rcnr/theme/eslint-plugin/index.cjs";
 *   export default [
 *     ...rcnrTheme.configs.recommended,
 *   ];
 *
 * Reference: see .rcnr/stories/bluebook-refactor-theme-as-contract.md
 */

"use strict";

// ---------------------------------------------------------------------------
// The list of color names that are FORBIDDEN in raw form. These are
// Tailwind palette names that should always go through @rcnr/theme tokens
// or utility classes instead.
// ---------------------------------------------------------------------------
const FORBIDDEN_COLORS = [
  "red", "orange", "amber", "yellow", "lime", "green", "emerald", "teal",
  "cyan", "sky", "blue", "indigo", "violet", "purple", "fuchsia", "pink", "rose",
];

// Pattern: text-{color}-{shade} / bg-{color}-{shade} / border-{color}-{shade}
// / ring-{color}-{shade} / hover:text-{color}-{shade} etc. with optional /opacity.
const RAW_COLOR_RE = new RegExp(
  String.raw`(?:^|\s)((?:hover:|focus:|active:|group-hover:|group-focus:)?(?:text|bg|border|ring|placeholder|divide|outline|fill|stroke|from|to|via)-(?:` +
    FORBIDDEN_COLORS.join("|") +
    String.raw`)-\d+(?:\/\d+)?)\b`,
  "g",
);

// Suggestions: known multi-class patterns we can recommend a replacement for.
const KNOWN_REPLACEMENTS = [
  {
    pattern: /\bbg-emerald-500\/15\s+text-emerald-400(?:\s+ring-1\s+ring-emerald-500\/30)?\b/,
    suggest: "rcnr-badge-active",
  },
  {
    pattern: /\bbg-amber-500\/15\s+text-amber-400(?:\s+ring-1\s+ring-amber-500\/30)?\b/,
    suggest: "rcnr-badge-draft",
  },
  {
    pattern: /\bbg-blue-600(?:\s+hover:bg-blue-700)?\s+text-white\b/,
    suggest: "btn-primary",
  },
  {
    pattern: /\bbg-red-600(?:\s+hover:bg-red-700)?\s+text-white\b/,
    suggest: "btn-danger",
  },
  {
    pattern: /\btext-amber-400\b(?!\/)/,
    suggest: "rcnr-callout-warning__title (in callout context) or text-warning",
  },
  {
    pattern: /\btext-amber-400\/70\b/,
    suggest: "rcnr-callout-warning__body (in callout context)",
  },
  {
    pattern: /\btext-red-400\b(?!\/)/,
    suggest: "rcnr-error-text",
  },
  {
    pattern: /\btext-emerald-400\b(?!\/)/,
    suggest: "rcnr-success-text",
  },
  {
    pattern: /\btext-blue-400\s+hover:text-blue-300\b/,
    suggest: "rcnr-link",
  },
  {
    pattern: /\btext-brand\/(50|60|70)\b/,
    suggest: "text-fg-muted",
  },
  {
    pattern: /\btext-fg\/(50|60|70)\b/,
    suggest: "text-fg-muted",
  },
];

// ---------------------------------------------------------------------------
// Rule definition
// ---------------------------------------------------------------------------

const noRawTailwindColors = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow raw Tailwind color utility classes in JSX className strings; require @rcnr/theme tokens or utility classes.",
      recommended: true,
    },
    schema: [
      {
        type: "object",
        properties: {
          // Files where raw colors are explicitly allowed (e.g. design system itself).
          allowFiles: { type: "array", items: { type: "string" } },
          // Color names allowed in raw form (e.g. you may want to allow `text-white` for buttons).
          allowColors: { type: "array", items: { type: "string" } },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      rawColor:
        "Raw Tailwind color class `{{matched}}` not allowed. Use a @rcnr/theme class instead. {{suggestion}}",
      rawColorNoSuggestion:
        "Raw Tailwind color class `{{matched}}` not allowed. Use a @rcnr/theme class (.rcnr-callout-* / .rcnr-badge-* / .btn-primary / etc.) or migrate to a semantic token.",
    },
  },

  create(context) {
    const opts = context.options[0] || {};
    const allowFiles = opts.allowFiles || [];
    const allowColors = new Set(opts.allowColors || []);

    const filename = context.filename || context.getFilename?.() || "";
    if (allowFiles.some((suffix) => filename.endsWith(suffix))) {
      return {};
    }

    function checkClassNameValue(node, value) {
      if (typeof value !== "string") return;
      const matches = [...value.matchAll(RAW_COLOR_RE)];
      for (const m of matches) {
        const matched = m[1];
        const colorName = matched.match(/-(red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-/)?.[1];
        if (colorName && allowColors.has(colorName)) continue;

        // Find the best replacement suggestion (longest match wins).
        let bestSuggestion = null;
        let bestLen = 0;
        for (const r of KNOWN_REPLACEMENTS) {
          const km = value.match(r.pattern);
          if (km && km[0].length > bestLen) {
            bestLen = km[0].length;
            bestSuggestion = r.suggest;
          }
        }

        context.report({
          node,
          messageId: bestSuggestion ? "rawColor" : "rawColorNoSuggestion",
          data: {
            matched,
            suggestion: bestSuggestion ? `Suggested: \`${bestSuggestion}\`.` : "",
          },
        });
      }
    }

    return {
      JSXAttribute(node) {
        if (node.name?.name !== "className") return;

        // Plain string: <div className="text-amber-400">
        if (node.value?.type === "Literal" && typeof node.value.value === "string") {
          checkClassNameValue(node.value, node.value.value);
          return;
        }

        // Expression container: <div className={...}>
        if (node.value?.type === "JSXExpressionContainer") {
          const expr = node.value.expression;
          // Template literal: className={`text-amber-400 ${...}`}
          if (expr.type === "TemplateLiteral") {
            for (const q of expr.quasis) {
              checkClassNameValue(q, q.value.raw);
            }
            return;
          }
          // String literal: className={"text-amber-400"}
          if (expr.type === "Literal" && typeof expr.value === "string") {
            checkClassNameValue(expr, expr.value);
            return;
          }
          // Conditional: className={cond ? "text-amber-400" : "..."}
          if (expr.type === "ConditionalExpression") {
            for (const branch of [expr.consequent, expr.alternate]) {
              if (branch.type === "Literal" && typeof branch.value === "string") {
                checkClassNameValue(branch, branch.value);
              }
            }
          }
        }
      },
    };
  },
};

// ---------------------------------------------------------------------------
// Plugin export
// ---------------------------------------------------------------------------

const plugin = {
  meta: {
    name: "@rcnr/theme",
    version: "4.1.0",
  },
  rules: {
    "no-raw-tailwind-colors": noRawTailwindColors,
  },
};

plugin.configs = {
  recommended: [
    {
      plugins: { "@rcnr/theme": plugin },
      rules: {
        "@rcnr/theme/no-raw-tailwind-colors": "error",
      },
    },
  ],
};

module.exports = plugin;
