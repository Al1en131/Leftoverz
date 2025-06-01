"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme && storedTheme !== theme) {
      setTheme(storedTheme as "light" | "dark");
    }
  }, [theme, setTheme]);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    const storedName = localStorage.getItem("name");
    const storedEmail = localStorage.getItem("email");
    if (storedName) setName(storedName);
    if (storedEmail) setEmail(storedEmail);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("https://backend-leftoverz-production.up.railway.app/api/v1/logout", { method: "POST" });
      localStorage.removeItem("token");
      localStorage.removeItem("email");
      localStorage.removeItem("role");
      localStorage.removeItem("name");
      localStorage.removeItem("id");
      localStorage.removeItem("no_hp");
      router.push("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const navLinks = [
    { href: "/seller", label: "Home" },
    { href: "/seller/about", label: "About" },
    { href: "/seller/my-product", label: "My Product" },
    { href: "/seller/transaction", label: "Transaction" },
    { href: "/seller/chat", label: "Chat" },
  ];

  return (
    <>
      {showLogoutPopup && (
        <div className="fixed inset-0 bg-black/55 flex items-center justify-center z-100">
          <div
            className={`border-blue-400 border rounded-lg py-8 px-14 shadow-lg text-center ${
              theme === "dark" ? "bg-[#080B2A]" : "bg-white"
            }`}
          >
            <div className="flex justify-center mb-4">
              <Image
                src="/images/warning.svg"
                width={80}
                height={80}
                alt="Confirm"
                className="w-20 h-20"
              />
            </div>
            <h2 className="text-2xl font-bold mb-1 text-blue-400">Logout</h2>
            <p className="mb-6 text-blue-400">
              Apakah Anda yakin ingin logout?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleLogout}
                className="bg-blue-400 hover:bg-blue-500 text-white font-semibold py-2 px-6 rounded-full"
              >
                Ya
              </button>
              <button
                onClick={() => setShowLogoutPopup(false)}
                className="bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-6 rounded-full"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
      <nav className="absolute top-0 left-0 w-full py-6 max-lg:px-6 px-20 bg-transparent z-50">
        {" "}
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-lg font-semibold">
            <Image
              width={100}
              height={100}
              src="/images/logo.png"
              alt="Logo"
              className={`${theme === "dark" ? "block" : "hidden"} h-12 w-36`}
            />
            <Image
              width={100}
              height={100}
              src="/images/logo-light.png"
              alt="Logo"
              className={`${theme === "dark" ? "hidden" : "block"} h-12 w-36`}
            />
          </Link>

          <div className="hidden lg:flex items-center space-x-12 text-lg">
            {navLinks.map(({ href, label }, index) => (
              <Link
                key={index}
                href={href}
                className={`
  capitalize
  ${
    pathname === href
      ? "font-bold text-gradian border-b-2 pb-2 text-gradian-border tracking-wide"
      : theme === "dark"
      ? "text-white"
      : "text-blue-400"
  }
`}
              >
                {label}
              </Link>
            ))}

            <div className="relative">
              <button onClick={() => setProfileOpen(!profileOpen)}>
                <span
                  className={`
  w-10 h-10 rounded-full flex items-center justify-center
  ${theme === "dark" ? "text-white bg-blue-400" : "text-white bg-blue-400"}
`}
                >
                  {name
                    ? name
                        .split(" ")
                        .map((word) => word.charAt(0))
                        .join("")
                        .toUpperCase()
                    : "?"}
                </span>
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2">
                  <div className="px-4 py-2 text-gray-800">
                    <p className="font-semibold leading-5">{name}</p>
                    <p className="text-sm text-gray-500">{email}</p>
                  </div>
                  <hr />
                  <Link
                    href="/seller/detail-profile"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    Edit Profile
                  </Link>
                  <button
                    className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                    onClick={() => setShowLogoutPopup(true)}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 lg:hidden relative">
            <button onClick={() => setProfileOpen(!profileOpen)}>
              <span
                className={`
  w-10 h-10 rounded-full flex items-center justify-center
  ${theme === "dark" ? "text-white bg-blue-400" : "text-white bg-blue-400"}
`}
              >
                {name
                  ? name
                      .split(" ")
                      .map((word) => word.charAt(0))
                      .join("")
                      .toUpperCase()
                  : "?"}
              </span>
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-12 w-48 bg-white shadow-lg rounded-lg py-2 z-50">
                <div className="px-4 py-2 text-gray-800">
                  <p className="font-semibold leading-5">{name}</p>
                  <p className="text-sm text-gray-500">{email}</p>
                </div>
                <hr />
                <Link
                  href="/seller/detail-profile"
                  className="block px-4 py-2 text-gray-800 z-50 hover:bg-gray-100"
                >
                  Edit Profile
                </Link>
                <button
                  className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                  onClick={() => setShowLogoutPopup(true)}
                >
                  Logout
                </button>
              </div>
            )}
            <button
              className="dark:text-white text-blue-400"
              onClick={() => setIsOpen(!isOpen)}
            >
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
        {/* Mobile Menu Dropdown */}
        {isOpen && (
          <div
            className={`
  block lg:hidden absolute top-full left-0 w-full py-4 px-6 z-40 space-y-4
  ${theme === "dark" ? "bg-[#080B2A]" : "bg-white"}
`}
          >
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
    </>
  );
}
