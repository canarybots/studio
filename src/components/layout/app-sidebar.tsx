
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  ClipboardList,
  Stethoscope,
  Brain,
  Settings2,
  HeartPulse,
} from "lucide-react";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator, 
} from "@/components/ui/sidebar";
import { SiteLogo } from "@/components/site-logo";
import { useLanguage } from "@/contexts/language-context";
import { useAuth } from "@/contexts/auth-context"; // Import useAuth
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { token, isLoading } = useAuth(); // Get token and isLoading state

  const menuItems = [
    { href: "/", label: t("sidebar", "dashboard"), icon: LayoutDashboard },
    { type: "separator" as const },
    { href: "/patients", label: t("sidebar", "patients"), icon: Users },
    { href: "/professionals", label: t("sidebar", "professionals"), icon: Briefcase },
    { href: "/appointments", label: t("sidebar", "appointments"), icon: ClipboardList },
    { href: "/treatments", label: t("sidebar", "treatments"), icon: Stethoscope },
    { href: "/specialties", label: t("sidebar", "specialties"), icon: Brain },
    { type: "separator" as const },
    { href: "/settings", label: t("sidebar", "settings"), icon: Settings2 },
  ];

  if (isLoading || !token) {
    // Don't render sidebar if loading auth state or not authenticated
    // Alternatively, you could show a skeleton or a minimal sidebar
    return null; 
  }

  return (
    <Sidebar collapsible="icon" variant="sidebar" side="left">
      <SidebarHeader className="p-4 justify-center hidden md:flex">
         <Link href="/" className="flex items-center gap-2">
            <HeartPulse className="h-8 w-8 text-primary group-data-[collapsible=icon]:h-6 group-data-[collapsible=icon]:w-6 transition-all" />
            <span className="font-semibold text-lg group-data-[collapsible=icon]:hidden">
              {t("appName")}
            </span>
          </Link>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {menuItems.map((item, index) =>
            item.type === "separator" ? (
              <SidebarSeparator key={`sep-${index}`} className="my-2" />
            ) : (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} passHref legacyBehavior>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={{ children: item.label, className: "bg-card text-card-foreground border-border" }}
                    className={cn(
                      "justify-start",
                      pathname === item.href && "bg-sidebar-accent text-sidebar-accent-foreground"
                    )}
                  >
                    <a>
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            )
          )}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-sidebar-border hidden md:flex group-data-[collapsible=icon]:hidden">
        <p className="text-xs text-sidebar-foreground/70">
          © {new Date().getFullYear()} {t("appName")}
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}
