import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import HiddenAdminLink from "@/components/admin/hidden-admin-link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DCI MEDIA Enterprise Suite",
  description: "Integrated CRM, HR, and Business Management Platform",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // The login page has its own layout, so this shouldn't apply to login page anymore
  // This is just an additional safeguard
  return (
    <html lang="de" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div className="p-4">
            {/* Simple Header */}
            <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4">
              <h1 className="text-xl font-semibold">Unternehmen</h1>
            </header>
            {/* Main Content Area */}
            <div className="p-4">{children}</div>
            {/* Hidden Admin Link - activated with Alt+A */}
            <HiddenAdminLink />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
