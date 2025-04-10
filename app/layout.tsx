import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"; // Import Sidebar components
import { Home, Building, Settings } from "lucide-react"; // Example icons
import Link from "next/link"; // Import Link

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
  return (
    <html lang="de" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider defaultOpen={false}> {/* Sidebar initially collapsed */}
            <Sidebar className="flex-shrink-0">
              <SidebarHeader>
                {/* Placeholder for Logo or Title */}
                <h2 className="font-semibold p-2 group-data-[collapsible=icon]:hidden">DCI CRM</h2>
              </SidebarHeader>
              <SidebarContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <Link href="/">
                      <div>
                        <SidebarMenuButton tooltip="Dashboard">
                          <Home />
                          <span>Dashboard</span>
                        </SidebarMenuButton>
                      </div>
                    </Link>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                     <Link href="/unternehmen">
                       <div>
                         <SidebarMenuButton tooltip="Unternehmen" isActive>
                           <Building />
                           <span>Unternehmen</span>
                         </SidebarMenuButton>
                       </div>
                     </Link>
                  </SidebarMenuItem>
                   {/* Add more menu items as needed */}
                </SidebarMenu>
              </SidebarContent>
              <SidebarFooter>
                 <SidebarMenu>
                   <SidebarMenuItem>
                     <Link href="/settings">
                       <div>
                         <SidebarMenuButton tooltip="Settings">
                           <Settings />
                           <span>Settings</span>
                         </SidebarMenuButton>
                       </div>
                     </Link>
                  </SidebarMenuItem>
                 </SidebarMenu>
              </SidebarFooter>
            </Sidebar>
            <SidebarInset>
              {/* Simple Header for the trigger */}
              <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4">
                 <SidebarTrigger />
                 <h1 className="text-xl font-semibold">Unternehmen</h1> {/* Example Title */}
              </header>
              {/* Main Content Area */}
              <div className="p-4">{children}</div> 
            </SidebarInset>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}



import './globals.css'
