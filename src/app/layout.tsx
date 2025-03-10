"use client";

import Navbar from "../components/Navbar"; // Navbar untuk halaman umum (Home, About, dll.)
import NavbarSeller from "../components/NavbarSeller"; // Navbar untuk seller
import NavbarBuyer from "../components/NavbarBuyer"; // Navbar untuk buyer
import NavbarDashboardSeller from "../components/NavbarDashboardSeller"; // Navbar khusus dashboard seller
import Footer from "../components/Footer";
import { usePathname } from "next/navigation"; // Import usePathname
import "../styles/globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname(); // Mendapatkan pathname saat ini

  // Mengecek jika kita berada di halaman login atau register
  const isAuthPage =
    pathname === "/auth/login" || pathname === "/auth/register";

  // Mengecek jika kita berada di halaman seller
  const isSellerPage = pathname.startsWith("/seller");

  // Mengecek jika kita berada di halaman dashboard seller
  const isSellerDashboardPage =
    pathname.startsWith("/seller/my-product") ||
    pathname.startsWith("/seller/transaction");

  // Mengecek jika kita berada di halaman buyer
  const isBuyerPage = pathname.startsWith("/buyer");

  // Menentukan Navbar berdasarkan halaman
  let NavbarComponent = Navbar; // Default Navbar untuk halaman umum

  // Menggunakan NavbarDashboardSeller jika berada di halaman dashboard seller (my-product atau transaction)
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
        {/* Menampilkan Navbar dan Footer hanya jika bukan di halaman auth/login dan auth/register */}
        {!isAuthPage && <NavbarComponent />}
        <main>{children}</main>
        {!isAuthPage && <Footer />}
      </body>
    </html>
  );
}
