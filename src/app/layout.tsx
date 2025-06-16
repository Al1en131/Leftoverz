"use client";

import Navbar from "../components/Navbar";
import NavbarSeller from "../components/NavbarSeller";
import NavbarBuyer from "../components/NavbarBuyer";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { usePathname } from "next/navigation";
import "../styles/globals.css";
import ThemeProvider from "../components/theme-provider";
import { useEffect } from "react";
import { useTheme } from "next-themes";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isAuthPage =
    pathname === "/auth/login" || pathname === "/auth/register";

  const isSellerPage = pathname.startsWith("/seller");
  const isBuyerPage = pathname.startsWith("/buyer");
  const isAdminPage = pathname.startsWith("/admin");
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme && storedTheme !== theme) {
      setTheme(storedTheme as "light" | "dark");
    }
  }, [theme, setTheme]);

  let NavbarComponent: React.ComponentType = Navbar;

  if (isSellerPage) {
    NavbarComponent = NavbarSeller;
  } else if (isBuyerPage) {
    NavbarComponent = NavbarBuyer;
  }

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={theme === "dark" ? "dark" : ""}
    >
      <head />
      <body
        className={`${theme === "dark" ? "bg-[#080B2A]" : "bg-white"} relative`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {isAdminPage ? (
            <div className="flex min-h-screen">
              <Sidebar />
              <main className="flex-1 bg-[#0f1535] text-white flex flex-col min-h-screen overflow-hidden">
                <div className="flex-1 min-h-screen">{children}</div>
              </main>
            </div>
          ) : (
            <>
              {!isAuthPage && <NavbarComponent />}
              {children}
              {!isAuthPage && <Footer />}
            </>
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}
