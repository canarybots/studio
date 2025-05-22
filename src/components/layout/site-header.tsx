
"use client";

import { SiteLogo } from "@/components/site-logo";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useLanguage } from "@/contexts/language-context";
import { cn } from "@/lib/utils";

interface SiteHeaderProps {
  className?: string;
}

export function SiteHeader({ className }: SiteHeaderProps) {
  const { token, logout } = useAuth();
  const { t } = useLanguage();

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className
      )}
    >
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0 px-4 md:px-8">
        <div className="flex items-center gap-2">
          {token && <SidebarTrigger className="md:hidden" />}
          <SiteLogo />
        </div>
        
        <div className="flex flex-1 items-center justify-end space-x-2">
          <LanguageSwitcher />
          <ThemeSwitcher />
          {token && (
            <Button variant="ghost" size="icon" onClick={logout} title={t('logoutTooltip')}>
              <LogOut className="h-[1.2rem] w-[1.2rem]" />
              <span className="sr-only">{t('logout')}</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
