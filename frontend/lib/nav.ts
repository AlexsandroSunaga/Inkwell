import type { LucideIcon } from "lucide-react";
import {
  Activity,
  BarChart3,
  BookOpen,
  Bot,
  Cable,
  LayoutDashboard,
  Settings,
  Users,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  keywords?: string;
  group: "workspace" | "intelligence" | "admin";
};

export const dashboardNav: NavItem[] = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, group: "workspace", keywords: "home metrics" },
  { href: "/dashboard/chat", label: "Assistant", icon: Bot, group: "workspace", keywords: "rag chat copilot" },
  { href: "/dashboard/documents", label: "Knowledge base", icon: BookOpen, group: "intelligence", keywords: "documents ingest pdf" },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3, group: "intelligence", keywords: "charts usage gaps" },
  { href: "/dashboard/activity", label: "Audit log", icon: Activity, group: "admin", keywords: "history compliance" },
  { href: "/dashboard/team", label: "Team & roles", icon: Users, group: "admin", keywords: "members permissions" },
  { href: "/dashboard/integrations", label: "Integrations", icon: Cable, group: "admin", keywords: "openai connectors" },
  { href: "/dashboard/settings", label: "Settings", icon: Settings, group: "admin", keywords: "models security" },
];

export const navGroups: { id: NavItem["group"]; label: string }[] = [
  { id: "workspace", label: "Workspace" },
  { id: "intelligence", label: "Intelligence" },
  { id: "admin", label: "Administration" },
];
