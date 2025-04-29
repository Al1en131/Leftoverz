"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import Image from "next/image";

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
  const [loading, setLoading] = useState(true);
  const [dateString, setDateString] = useState({
    day: "",
    fullDate: "",
  });

  useEffect(() => {
    const now = new Date();
    const optionsDay: Intl.DateTimeFormatOptions = { weekday: "long" };
    const optionsDate: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "short",
      year: "numeric",
    };

    const day = now.toLocaleDateString("en-US", optionsDay); // "Wednesday"
    const fullDate = now.toLocaleDateString("en-GB", optionsDate); // "12 Jul 2025"

    setDateString({ day, fullDate });
  }, []);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://127.0.0.1:1031/api/v1/chats", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

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

  return (
    <div className="min-h-screen bg-[#060B26] text-white px-6 pt-6 relative">
      <Image
        width={100}
        height={100}
        alt=""
        src="/images/admin.png"
        className="w-full absolute right-0 top-0 h-full mb-0"
      />
      <div className="flex justify-between items-center mb-7 relative z-20">
        <h1 className="text-3xl font-bold">Chats</h1>
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
            <span className="text-sm font-normal">Welcome back,</span>
            <h2 className="text-xl font-semibold mb-1">Mark Johnson</h2>
            <p className="text-sm text-gray-300">
              Glad to see you again! Ask me anything.
            </p>
            <button className="mt-4 text-white text-sm flex items-center gap-2">
              Tap to record →
            </button>
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
            <h3 className="text-xl font-bold">Chat List</h3>
            <p>All user conversations</p>
          </div>
          <div className="flex gap-2 items-center">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search..."
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
              <th className="px-6 py-3 text-center">No.</th>
              <th className="px-6 py-3 text-center">Sender</th>
              <th className="px-6 py-3 text-center">Receiver</th>
              <th className="px-6 py-3 text-center">Message</th>
              <th className="px-6 py-3 text-center">Product</th>
              <th className="px-6 py-3 text-center">Read Status</th>
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
                  No chats found
                </td>
              </tr>
            ) : (
              chats.map((chat, index) => (
                <tr key={chat.id} className="border-b border-[#56577A]">
                  <td className="px-6 py-4 text-center">{index + 1}</td>
                  <td className="px-6 py-4 text-center">
                    {chat.sender?.name || "-"}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {chat.receiver?.name || "-"}
                  </td>
                  <td className="px-6 py-4 text-center">{chat.message}</td>
                  <td className="px-6 py-4 text-center">
                    {chat.Product?.name || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-center">
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
      </div>
    </div>
  );
}
