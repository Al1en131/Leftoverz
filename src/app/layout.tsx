"use client";

import Navbar from "../components/Navbar";
import NavbarSeller from "../components/NavbarSeller";
import NavbarBuyer from "../components/NavbarBuyer";
import NavbarDashboardSeller from "../components/NavbarDashboardSeller";
import Sidebar from "@/components/Sidebar";
import Footer from "../components/Footer";
import { usePathname } from "next/navigation";
import "../styles/globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isAuthPage =
    pathname === "/auth/login" || pathname === "/auth/register";

  const isSellerPage = pathname.startsWith("/seller");

  const isSellerDashboardPage =
    pathname.startsWith("/seller/my-product") ||
    pathname.startsWith("/seller/transaction") ||
    pathname.startsWith("/seller/chat");

  const isBuyerPage = pathname.startsWith("/buyer");
  const isAdminPage = pathname.startsWith("/admin");

  let NavbarComponent = Navbar;

  if (isSellerDashboardPage) {
    NavbarComponent = NavbarDashboardSeller;
  } else if (isSellerPage) {
    NavbarComponent = NavbarSeller;
  } else if (isBuyerPage) {
    NavbarComponent = NavbarBuyer;
  }

  return (
    <html lang="en">
      <body className="bg-[#080B2A] relative">
        {isAdminPage ? (
          <div className="flex min-h-screen">
            <Sidebar /> 
            <main className="flex-1 bg-[#0f1535] text-white">
              {children}
            </main>
          </div>
        ) : (
          <>
            {!isAuthPage && <NavbarComponent />}
            <main>{children}</main>
            {!isAuthPage && <Footer />}
          </>
        )}
      </body>
    </html>
  );
}
