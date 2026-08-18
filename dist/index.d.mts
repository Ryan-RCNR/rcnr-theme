import * as react_jsx_runtime from 'react/jsx-runtime';
import { ReactNode } from 'react';

interface RCNRHeaderProps {
    toolName: string;
    dashboardUrl?: string;
    extraNavItems?: {
        label: string;
        icon?: ReactNode;
        onClick: () => void;
    }[];
    userAvatar?: ReactNode;
    onHowItWorks?: () => void;
    onReportIssue?: () => void;
    onRequestTool?: () => void;
}
interface RCNRSubNavProps {
    tabs: {
        label: string;
        href?: string;
        onClick?: () => void;
        active: boolean;
        icon?: ReactNode;
        variant?: 'default' | 'warning';
    }[];
}
interface RCNRFooterProps {
    toolName: string;
    linkUrl?: string;
}
type SubscriptionWallState = 'loading' | 'active' | 'inactive';
interface SubscriptionWallProps {
    /** Map from GET /api/subscription/status: loading/active render children; inactive shows the wall. */
    state: SubscriptionWallState;
    /** The gate's own teacher-readable copy (`detail` from the status endpoint). */
    detail?: string;
    toolName: string;
    /** Defaults to https://rcnr.net/subscribe */
    subscribeUrl?: string;
    /** Consumer wires Clerk signOut; omitting hides the "wrong account?" link. */
    onSignOut?: () => void;
    children: ReactNode;
}

declare function RCNRHeader({ toolName, dashboardUrl, extraNavItems, userAvatar, onHowItWorks, onReportIssue, onRequestTool, }: RCNRHeaderProps): react_jsx_runtime.JSX.Element;

declare function RCNRSubNav({ tabs }: RCNRSubNavProps): react_jsx_runtime.JSX.Element;

declare function RCNRFooter({ toolName, linkUrl, }: RCNRFooterProps): react_jsx_runtime.JSX.Element;

interface RCNRMountainLogoProps {
    href?: string;
    className?: string;
}
declare function RCNRMountainLogo({ href, className, }: RCNRMountainLogoProps): react_jsx_runtime.JSX.Element;

declare function ThemeToggle(): react_jsx_runtime.JSX.Element;

interface ReportIssueModalProps {
    isOpen: boolean;
    onClose: () => void;
    toolName: string;
    apiBaseUrl?: string;
    userEmail?: string;
}
declare function ReportIssueModal({ isOpen, onClose, toolName, apiBaseUrl, userEmail, }: ReportIssueModalProps): react_jsx_runtime.JSX.Element | null;

interface RequestToolModalProps {
    isOpen: boolean;
    onClose: () => void;
    toolName: string;
    apiBaseUrl?: string;
    userEmail?: string;
}
declare function RequestToolModal({ isOpen, onClose, toolName, apiBaseUrl, userEmail, }: RequestToolModalProps): react_jsx_runtime.JSX.Element | null;

/**
 * SubscriptionWall — an honest door, not a lock.
 *
 * Presentational only. The consumer fetches `GET /api/subscription/status`
 * (rcnr-ai-api) and maps it to `state`; this component just decides what to
 * show:
 *
 *   loading  → children (fail-open: never punish a paying teacher with a
 *              spinner wall on every cold load — the API gate still enforces)
 *   active   → children
 *   inactive → full-screen renew/subscribe panel with the gate's own `detail`
 *              copy, a CTA to rcnr.net/subscribe, and a "wrong account?"
 *              escape hatch (consumer supplies `onSignOut` from Clerk).
 *
 * Enforcement is the API's job (every tool route fails closed). This exists so
 * a non-subscriber learns they're paywalled BEFORE typing a topic and clicking
 * generate — the 2026-08-16 support-email trap.
 */
declare function SubscriptionWall({ state, detail, toolName, subscribeUrl, onSignOut, children, }: SubscriptionWallProps): ReactNode;

export { RCNRFooter, type RCNRFooterProps, RCNRHeader, type RCNRHeaderProps, RCNRMountainLogo, RCNRSubNav, type RCNRSubNavProps, ReportIssueModal, RequestToolModal, SubscriptionWall, type SubscriptionWallProps, type SubscriptionWallState, ThemeToggle };
