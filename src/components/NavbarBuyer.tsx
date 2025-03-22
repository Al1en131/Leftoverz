"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavbarBuyer() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const navLinks = [
    { href: "/buyer/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/product", label: "Product" },
    { href: "/buyer/my-order", label: "My Order" },
  ];

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
        <div className="hidden md:flex items-center space-x-12 text-lg">
          {navLinks.map(({ href, label }, index) => (
            <Link
              key={index}
              href={href}
              className={`${
                pathname === href
                  ? "font-bold text-gradian border-b-2 pb-2 text-gradian-border tracking-wide"
                  : "text-white"
              } capitalize`}
            >
              {label}
            </Link>
          ))}
          <div className="relative">
            <button onClick={() => setProfileOpen(!profileOpen)}>
              <Image
                width={40}
                height={40}
                src="/images/profile.jpg"
                alt="Profile"
                className="w-10 h-10 rounded-full cursor-pointer"
              />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2">
                <div className="px-4 py-2 text-gray-800">
                  <p className="font-semibold">John Doe</p>
                  <p className="text-sm text-gray-500">john.doe@example.com</p>
                </div>
                <hr />
                <Link
                  href="/buyer/favorite"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                >
                  Favorit
                </Link>
                <button
                  className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                  onClick={() => console.log("Logout")}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 md:hidden relative">
          <button onClick={() => setProfileOpen(!profileOpen)}>
            <Image
              width={40}
              height={40}
              src="/images/profile.jpg"
              alt="Profile"
              className="w-10 h-10 rounded-full cursor-pointer"
            />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-12 w-48 bg-white shadow-lg rounded-lg py-2 z-50">
              <div className="px-4 py-2 text-gray-800">
                <p className="font-semibold">John Doe</p>
                <p className="text-sm text-gray-500">john.doe@example.com</p>
              </div>
              <hr />
              <Link
                href="/buyer/favorite"
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
              >
                Favorit
              </Link>
              <button
                className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                onClick={() => console.log("Logout")}
              >
                Logout
              </button>
            </div>
          )}
          <button className="text-white" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="block md:hidden bg-[#080B2A] absolute top-full left-0 w-full py-4 px-6 z-40 space-y-4">
          {navLinks.map(({ href, label }, index) => (
            <Link
              key={index}
              href={href}
              className={`block text-lg capitalize ${
                pathname === href
                  ? "font-bold text-gradian border-b-2 pb-2 text-gradian-border tracking-wide"
                  : "text-white"
              }`}
              onClick={() => setIsOpen(false)}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
