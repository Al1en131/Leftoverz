"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

type User = {
  id: number;
  name: string;
};

type Product = {
  id: number;
  name: string;
};

type Chat = {
  id: number;
  sender_id: number;
  receiver_id: number;
  item_id: number;
  message: string;
  read_status: 0 | 1;
  created_at: string;
  sender?: User;
  receiver?: User;
  Product?: Product;
};

export default function Chats() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [dateString, setDateString] = useState({
    day: "",
    fullDate: "",
  });
  const filteredChats = chats.filter((chat) => {
    const search = searchTerm.toLowerCase();
    return (
      chat.sender?.name?.toLowerCase().includes(search) ||
      chat.receiver?.name?.toLowerCase().includes(search) ||
      chat.message.toLowerCase().includes(search)
    );
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const paginatedchats = filteredChats.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredChats.length / itemsPerPage);

  useEffect(() => {
    const now = new Date();
    const optionsDay: Intl.DateTimeFormatOptions = { weekday: "long" };
    const optionsDate: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "short",
      year: "numeric",
    };

    const day = now.toLocaleDateString("id-ID", optionsDay);
    const fullDate = now.toLocaleDateString("id-ID", optionsDate);

    setDateString({ day, fullDate });
  }, []);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "https://backend-leftoverz-production.up.railway.app/api/v1/chats",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch products");
        }

        const data = await response.json();
        setChats(data.chats);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Error fetching products:", error.message);
        } else {
          console.error("An unknown error occurred:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/auth/login");
    } else {
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) return null;
  return (
    <div className="min-h-screen bg-[#060B26] text-white px-6 py-6 relative">
      <Image
        width={100}
        height={100}
        alt=""
        src="/images/admin.png"
        className="w-full absolute right-0 top-0 h-full mb-0"
      />
      <div className="flex justify-between items-center mb-7 relative z-20">
        <h1 className="text-3xl font-bold">Pesan</h1>
        <div className="relative flex justify-end gap-4 w-full">
          <div className="block">
            <p>{dateString.day}</p>
            <p>{dateString.fullDate}</p>
          </div>
        </div>
      </div>
      <div className="mb-6 z-20">
        <div
          className="relative rounded-lg flex justify-between items-center z-40 text-start shadow-lg"
          style={{
            background:
              "linear-gradient(to bottom right, rgba(6, 11, 38, 0.74), rgba(26, 31, 55, 0.5))",
          }}
        >
          <div className="absolute inset-0 opacity-40 rounded-lg"></div>
          <div className="relative z-10 text-white p-6">
            <span className="text-sm font-normal">Selamat Datang,</span>
            <h2 className="text-xl font-semibold mb-1">Admin Leftoverz</h2>
            <p className="text-sm text-gray-300">
              Selamat datang kembali! Kelola dashboard dengan mudah di sini.
            </p>
            <Link
              href="/admin/users"
              className="mt-4 text-white text-sm flex items-center gap-2"
            >
              Ketuk untuk ke dashboard
            </Link>
          </div>
          <div className="z-10">
            <Image
              src="/images/chats.png"
              alt="Welcome"
              width={300}
              height={300}
              className="rounded-lg absolute right-0 h-56 w-56 -top-10"
            />
          </div>
        </div>
      </div>
      <div
        className="relative overflow-x-auto rounded-lg"
        style={{
          background:
            "linear-gradient(to bottom right, rgba(6, 11, 38, 0.74), rgba(26, 31, 55, 0.5))",
        }}
      >
        <div className="px-6 pt-5 pb-8 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold">Daftar Percakapan</h3>
            <p>Semua percakapan pengguna</p>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <input
                type="text"
                placeholder="Cari..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 rounded text-white placeholder-gray-400 bg-transparent focus:outline-none"
              />
              <Search
                className="absolute top-2.5 right-3 text-gray-400"
                size={18}
              />
            </div>
          </div>
        </div>
        <table className="w-full rounded-lg my-4 max-lg:px-6 overflow-hidden">
          <thead className="text-white text-md">
            <tr className="border-b-2 border-[#56577A]">
              <th className="px-3 py-3 text-center">No.</th>
              <th className="px-3 py-3 text-left">Pengirim</th>
              <th className="px-3 py-3 text-left">Penerima</th>
              <th className="px-3 py-3 text-left">Pesan</th>
              <th className="px-3 py-3 text-left">Produk</th>
              <th className="px-3 py-3 text-center">Status Terbaca</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-6">
                  Loading chats...
                </td>
              </tr>
            ) : chats.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-6">
                  Tidak ada pesan
                </td>
              </tr>
            ) : (
              paginatedchats.map((chat, index) => (
                <tr key={chat.id} className="border-b border-[#56577A]">
                  <td className="px-3 py-4 text-center">
                    {" "}
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="px-3 py-4 text-left">
                    {chat.sender?.name && chat.sender.name.length > 25
                      ? chat.sender.name.slice(0, 25) + "..."
                      : chat.sender?.name}
                  </td>
                  <td className="px-3 py-4 text-left">
                    {chat.receiver?.name && chat.receiver.name.length > 25
                      ? chat.receiver.name.slice(0, 25) + "..."
                      : chat.receiver?.name}
                  </td>
                  <td className="px-3 py-4 text-left">{chat.message}</td>
                  <td className="px-3 py-4 text-left">
                    {chat.Product?.name && chat.Product.name.length > 25
                      ? chat.Product.name.slice(0, 25) + "..."
                      : chat.Product?.name}
                  </td>
                  <td className="px-3 py-4 text-center">
                    {chat.read_status == 0 ? (
                      <button className="px-4 py-1 bg-red-500 text-white rounded-full text-sm">
                        Belum Dibaca
                      </button>
                    ) : (
                      <button className="px-4 py-1 bg-blue-400 text-white rounded-full text-sm">
                        Sudah Dibaca
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="flex justify-center my-4 gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded ${
              currentPage === 1
                ? "bg-blue-400 text-gray-300 cursor-not-allowed"
                : "bg-blue-700 hover:bg-blue-800"
            } text-white`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5 8.25 12l7.5-7.5"
              />
            </svg>
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded ${
              currentPage === totalPages
                ? "bg-blue-400 text-gray-300 cursor-not-allowed"
                : "bg-blue-700 hover:bg-blue-800"
            } text-white`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5 8.25 12l7.5-7.5"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
