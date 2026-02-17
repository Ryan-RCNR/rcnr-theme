"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  RCNRFooter: () => RCNRFooter_default,
  RCNRHeader: () => RCNRHeader_default,
  RCNRMountainLogo: () => RCNRMountainLogo_default,
  RCNRSubNav: () => RCNRSubNav_default
});
module.exports = __toCommonJS(index_exports);

// src/RCNRMountainLogo.tsx
var import_jsx_runtime = require("react/jsx-runtime");
function RCNRMountainLogo({
  href = "https://teacher.rcnr.net",
  className = ""
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "a",
    {
      href,
      className: `flex items-center justify-center w-10 h-10 rounded-lg bg-brand/10 hover:bg-brand/20 transition-colors ${className}`,
      title: "Back to Dashboard",
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
        "svg",
        {
          width: "28",
          height: "24",
          viewBox: "0 0 120 100",
          fill: "none",
          xmlns: "http://www.w3.org/2000/svg",
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              "path",
              {
                d: "M10,90l26.48-39.76h.31s4.54,5.02,4.54,5.02l.32-.16,23.06-37.14,17.34,28.63,3.65-4.61,30.22,48.03h-8.43c-7.17-12.26-15.51-24.35-23.06-36.26-1.43.52-2.03,3.6-3.49,3.97l-16.31-25.93-21.87,34.36-5.09-5.01-19.48,28.87h-8.19Z",
                fill: "#99D9D9"
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              "path",
              {
                d: "M89.84,90h-5.73c-6.34-8.18-12.93-16.89-19.64-24.65-6.66,8.19-13.04,16.6-19.89,24.65h-5.81l25.69-39.76,25.37,39.76Z",
                fill: "#99D9D9"
              }
            )
          ]
        }
      )
    }
  );
}
var RCNRMountainLogo_default = RCNRMountainLogo;

// src/RCNRHeader.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
function NavButton({
  onClick,
  icon,
  label,
  title
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
    "button",
    {
      onClick,
      className: "flex items-center gap-2 px-3 py-2 text-brand/70 hover:text-brand hover:bg-brand/5 rounded-lg transition-colors",
      title: title ?? label,
      children: [
        icon,
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "hidden md:inline text-sm", children: label })
      ]
    }
  );
}
var defaultReportIssue = () => window.open("https://rcnr.net/support?type=bug", "_blank");
var defaultRequestTool = () => window.open("https://rcnr.net/support?type=feature", "_blank");
function RCNRHeader({
  toolName,
  dashboardUrl = "https://teacher.rcnr.net",
  extraNavItems,
  userAvatar,
  onHowItWorks,
  onReportIssue = defaultReportIssue,
  onRequestTool = defaultRequestTool
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("header", { className: "glass-card border-b border-brand/15 px-6 py-4", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "flex items-center justify-between", children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "flex items-center gap-4", children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(RCNRMountainLogo_default, { href: dashboardUrl }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "text-xl font-serif text-brand", children: toolName })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "flex items-center gap-2", children: [
      extraNavItems?.map((item) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
        NavButton,
        {
          onClick: item.onClick,
          icon: item.icon,
          label: item.label
        },
        item.label
      )),
      onHowItWorks && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
        NavButton,
        {
          onClick: onHowItWorks,
          label: "How It Works",
          icon: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
            "svg",
            {
              className: "w-[18px] h-[18px]",
              fill: "none",
              viewBox: "0 0 24 24",
              stroke: "currentColor",
              strokeWidth: 2,
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("circle", { cx: "12", cy: "12", r: "10" }),
                /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                  "path",
                  {
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    d: "M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("line", { x1: "12", y1: "17", x2: "12.01", y2: "17" })
              ]
            }
          )
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
        NavButton,
        {
          onClick: onReportIssue,
          label: "Report Issue",
          icon: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
            "svg",
            {
              className: "w-[18px] h-[18px]",
              fill: "none",
              viewBox: "0 0 24 24",
              stroke: "currentColor",
              strokeWidth: 2,
              children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                "path",
                {
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                }
              )
            }
          )
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
        NavButton,
        {
          onClick: onRequestTool,
          label: "Request Tool",
          icon: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
            "svg",
            {
              className: "w-[18px] h-[18px]",
              fill: "none",
              viewBox: "0 0 24 24",
              stroke: "currentColor",
              strokeWidth: 2,
              children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                "path",
                {
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  d: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                }
              )
            }
          )
        }
      ),
      userAvatar
    ] })
  ] }) });
}
var RCNRHeader_default = RCNRHeader;

// src/RCNRSubNav.tsx
var import_jsx_runtime3 = require("react/jsx-runtime");
function RCNRSubNav({ tabs }) {
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("nav", { className: "flex items-center gap-1 px-6 py-2 border-b border-brand/10 bg-surface/50", children: tabs.map((tab) => {
    const isWarning = tab.variant === "warning";
    const activeClass = isWarning ? "bg-warning/10 text-warning border border-warning/20" : "bg-brand/15 text-brand";
    const inactiveClass = isWarning ? "text-warning/70 hover:text-warning hover:bg-warning/5 border border-warning/10" : "text-brand/50 hover:text-brand hover:bg-brand/5";
    const className = `flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${tab.active ? activeClass : inactiveClass}`;
    if (tab.href) {
      return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("a", { href: tab.href, className, children: [
        tab.icon,
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { children: tab.label })
      ] }, tab.label);
    }
    return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
      "button",
      {
        onClick: tab.onClick,
        className,
        children: [
          tab.icon,
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { children: tab.label })
        ]
      },
      tab.label
    );
  }) });
}
var RCNRSubNav_default = RCNRSubNav;

// src/RCNRFooter.tsx
var import_jsx_runtime4 = require("react/jsx-runtime");
function RCNRFooter({
  toolName,
  linkUrl = "https://rcnr.net"
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("footer", { className: "mt-auto py-4 text-center text-sm text-brand-dark/50", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
    "a",
    {
      href: linkUrl,
      className: "hover:text-brand transition-colors",
      children: [
        toolName,
        " \u2014 Part of the RCNR Teacher Toolbox"
      ]
    }
  ) });
}
var RCNRFooter_default = RCNRFooter;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  RCNRFooter,
  RCNRHeader,
  RCNRMountainLogo,
  RCNRSubNav
});
//# sourceMappingURL=index.js.map