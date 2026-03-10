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

export { RCNRFooter, type RCNRFooterProps, RCNRHeader, type RCNRHeaderProps, RCNRMountainLogo, RCNRSubNav, type RCNRSubNavProps, ReportIssueModal, RequestToolModal, ThemeToggle };
