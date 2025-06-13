"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";

interface Chat {
  id: number;
  sender_id: number;
  receiver_id: number;
  item_id: number;
  message: string;
  read_status: "0" | "1";
  sender: {
    id: number;
    name: string;
    email: string;
  };
  receiver: {
    id: number;
    name: string;
    email: string;
  };
  Product: {
    id: number;
    name: string;
  };
}

export default function NavbarBuyer() {
  const { theme, setTheme } = useTheme();
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [userId, setUserId] = useState<number | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const storedName = localStorage.getItem("name");
    const storedEmail = localStorage.getItem("email");
    const storedUserId = localStorage.getItem("id");

    if (storedName) setName(storedName);
    if (storedEmail) setEmail(storedEmail);
    if (storedUserId) setUserId(Number(storedUserId)); // 👈 konversi ke number
  }, []);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme && storedTheme !== theme) {
      setTheme(storedTheme);
    }
  }, [theme, setTheme]);
  const [chats, setChats] = useState<Chat[]>([]);

  const [hasNewMessage, setHasNewMessage] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `https://backend-leftoverz-production.up.railway.app/api/v1/chats/user/${userId}`
        );
        const data = await res.json();

        if (res.ok && data.chats) {
          setChats(data.chats);
          const unread = data.chats.some(
            (chat: Chat) =>
              chat.sender_id !== userId && chat.read_status === "0"
          );
          setHasNewMessage(unread); // 🔁 update ping merah
        }
      } catch (error) {
        console.error("Polling chat error:", error);
      }
    }, 10000); // tiap 10 detik

    return () => clearInterval(interval); // bersihkan saat unmount
  }, [userId]);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const handleLogout = async () => {
    try {
      await fetch(
        "https://backend-leftoverz-production.up.railway.app/api/v1/logout",
        { method: "POST" }
      );
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
  const navLinks = [
    { href: "/buyer", label: "Beranda" },
    { href: "/buyer/about", label: "Tentang Kami" },
    { href: "/buyer/product", label: "Produk" },
    { href: "/buyer/favorite", label: "Favorit" },
    { href: "/buyer/my-order", label: "Pesanan Saya" },
  ];

  return (
    <nav className="absolute top-0 left-0 w-full py-6 max-lg:px-6 px-20 bg-transparent z-50">
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
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className=" text-lg font-semibold">
          <Image
            width={100}
            height={100}
            src="/images/logo.png"
            alt="Logo"
            className={`${theme === "dark" ? "block" : "block"} h-12 w-36`}
          />
          {/* <Image
            width={100}
            height={100}
            src="/images/logo-light.png"
            alt="Logo"
            className={`${theme === "dark" ? "hidden" : "block"} h-12 w-36`}
          /> */}
        </Link>
        <div className="hidden lg:flex items-center space-x-12 text-lg">
          {navLinks.map(({ href, label }, index) => (
            <Link
              key={index}
              href={href}
              className={`capitalize ${
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
            <button onClick={togglePopup} className="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6 text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                />
              </svg>

              {hasNewMessage && (
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></span>
              )}
            </button>

            {showPopup && (
              <div className="absolute right-0 mt-2 w-72 bg-[#080B2A] shadow-md rounded-md p-4 z-50 text-black">
                <h4 className="font-semibold text-gray-800 mb-2">
                  Pesan Masuk
                </h4>
                {chats
                  .filter(
                    (chat) =>
                      chat.sender_id !== Number(userId) &&
                      chat.read_status === "0"
                  )
                  .map((chat) => (
                    <div key={chat.id} className="mb-2">
                      <p className="text-sm">
                        Pesan dari <strong>{chat.sender.name}</strong> terkait
                        produk <strong>{chat.Product.name}</strong>
                      </p>
                      <Link
                        href={`/buyer/product/${chat.Product.id}`}
                        className="text-blue-500 text-sm hover:underline"
                      >
                        Lihat Produk
                      </Link>
                    </div>
                  ))}
                {chats.filter(
                  (chat) =>
                    chat.sender_id !== Number(userId) &&
                    chat.read_status === "0"
                ).length === 0 && (
                  <p className="text-sm text-gray-500">Tidak ada pesan baru.</p>
                )}
              </div>
            )}
          </div>

          <div className="relative">
            <button onClick={() => setProfileOpen(!profileOpen)}>
              <span
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  theme === "dark"
                    ? "text-white bg-blue-400"
                    : "text-white bg-blue-400"
                }`}
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
                  href="/buyer/detail-profile"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                >
                  Edit Profil
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
                href="/buyer/detail-profile"
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
              >
                Edit Profil
              </Link>
              <button
                className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                onClick={() => setShowLogoutPopup(true)}
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
                  : "dark:text-white text-blue-400"
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
