import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/contexts/language-context";
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import { cn } from "@/lib/utils";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Physio Insights",
  description: "Clinical Dashboard for Santiago Gómez Physiotherapy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          geistSans.variable,
          geistMono.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            <SidebarProvider>
              <div className="flex min-h-screen">
                <AppSidebar />
                <SidebarInset className="flex flex-col flex-1">
                  <SiteHeader />
                  <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                    {children}
                  </main>
                </SidebarInset>
              </div>
            </SidebarProvider>
            <Toaster />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

// Helper for ThemeProvider props if needed in future
declare module '@/components/theme-provider' {
  interface ThemeProviderProps {
    attribute?: string;
    enableSystem?: boolean;
    disableTransitionOnChange?: boolean;
  }
}
