"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import NavbarSeller from "./NavbarSeller";
import NavbarBuyer from "./NavbarBuyer";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import ThemeProvider from "./theme-provider";

export default function MainLayout({
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

  let NavbarComponent = Navbar;
  if (isSellerPage) NavbarComponent = NavbarSeller;
  else if (isBuyerPage) NavbarComponent = NavbarBuyer;

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {isAdminPage ? (
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 bg-[#0f1535] text-white flex ml-64 flex-col min-h-screen">
            <div className="flex-1">{children}</div>
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
  );
}
