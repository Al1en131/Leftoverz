"use client";

import Navbar from "../components/Navbar";
import NavbarSeller from "../components/NavbarSeller";
import NavbarBuyer from "../components/NavbarBuyer";
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
  const isBuyerPage = pathname.startsWith("/buyer");
  const isAdminPage = pathname.startsWith("/admin");

  let NavbarComponent = Navbar;

  if (isSellerPage) {
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
            <main className="flex-1 bg-[#0f1535] text-white flex flex-col min-h-screen">
              <div className="flex-1">{children}</div>
              <div className="pt-4">
                <Footer />
              </div>
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
