// app/LayoutClient.tsx
"use client";

import { usePathname } from "next/navigation";
import Navbar from "../components/Navbar";
import NavbarSeller from "../components/NavbarSeller";
import NavbarBuyer from "../components/NavbarBuyer";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

export default function LayoutClient({
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

  return isAdminPage ? (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 bg-[#0f1535] text-white flex ml-64 flex-col min-h-screen">
        <div className="flex-1 min-h-screen">{children}</div>
      </main>
    </div>
  ) : (
    <>
      {!isAuthPage && <NavbarComponent />}
      {children}
      {!isAuthPage && <Footer />}
    </>
  );
}
