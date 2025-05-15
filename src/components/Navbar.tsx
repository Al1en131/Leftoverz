"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="absolute top-0 left-0 w-full py-6 max-lg:px-6 px-20 bg-transparent z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-lg font-semibold">
          <Image
            width={100}
            height={100}
            src="/images/logo.png"
            alt="Logo"
            className="h-12 w-36"
          />
        </Link>

        <div className="hidden lg:flex space-x-12 text-lg z-50">
          {["/", "/about", "/product"].map((route, index) => (
            <Link
              key={index}
              href={route}
              className={`${
                pathname === route
                  ? "font-bold text-gradian border-b-2 pb-2 text-gradian-border tracking-wide"
                  : "text-white"
              } capitalize`} 
            >
              {route === "/"
                ? "Home"
                : route.replace("/", "").replace("-", " ")}
            </Link>
          ))}
        </div>

        <button
          className="lg:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </div>

      {isOpen && (
        <div className="lg:hidden bg-[#080B2A] absolute top-full left-0 capitalize w-full py-4 px-6 z-50 space-y-4">
          {["/", "/about", "/product"].map((route, index) => (
            <Link
              key={index}
              href={route}
              className={`block text-lg capitalize ${
                // Menambahkan kelas `capitalize`
                pathname === route
                  ? "font-bold text-gradian border-b-2 capitalize pb-2 z-50 text-gradian-border tracking-wide"
                  : "text-white z-50 capitalize"
              }`}
              onClick={() => setIsOpen(false)}
            >
              {route === "/"
                ? "Home"
                : route
                    .replace("/", "") // Hapus slash di awal
                    .replace(/-/g, " ") // Ganti "-" jadi spasi
                    .split(" ") // Pecah jadi array kata
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Kapital huruf pertama tiap kata
                    .join(" ")}{" "}
              {/* Gabung lagi jadi string */}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
