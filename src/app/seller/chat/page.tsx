"use client";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

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
  read_status: "0" | "1";
  created_at: string;
  sender?: User;
  receiver?: User;
  Product?: Product;
  opponent_id?: number;
  opponent_name?: string;
};

export default function RoomChat() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [userId, setUserId] = useState<number | null>(null);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Chat[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [userName, setUserName] = useState("");
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );
  const { theme, setTheme } = useTheme();
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme && storedTheme !== theme) {
      setTheme(storedTheme);
    }
  }, [theme, setTheme]);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    const storedUserId = localStorage.getItem("id");
    const storedUserName = localStorage.getItem("name");

    if (storedUserId) setUserId(Number(storedUserId));
    if (storedUserName) setUserName(storedUserName);
  }, []);
  const [userProducts, setUserProducts] = useState<Product[]>([]);
  useEffect(() => {
    if (userId) {
      const fetchProducts = async () => {
        try {
          const res = await fetch(
            `https://backend-leftoverz-production.up.railway.app/api/v1/products/user/${userId}`
          );
          const data = await res.json();
          if (res.ok) {
            setUserProducts(data.products);
          } else {
            console.error("Gagal fetch produk:", data.message);
          }
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      };
      fetchProducts();
    }
  }, [userId]);

  const fetchChats = useCallback(async () => {
    if (!userId) return;

    try {
      // Ambil daftar chat
      const res = await fetch(
        `https://backend-leftoverz-production.up.railway.app/api/v1/chats/user/${userId}`
      );
      const data = await res.json();

      if (res.ok) {
        const lastMessages: { [key: number]: Chat } = {};

        // Menggunakan for...of untuk iterasi setiap chat
        for (const chat of data.chats) {
          const opponentId =
            chat.sender_id === userId ? chat.receiver_id : chat.sender_id;

          // Ambil pesan terakhir antara user dan opponent
          const messagesRes = await fetch(
            `https://backend-leftoverz-production.up.railway.app/api/v1/messages/${userId}/${opponentId}`
          );
          const messagesData = await messagesRes.json();

          // Ambil pesan terakhir dari data messages
          const lastMessage = messagesData[messagesData.length - 1];

          if (!lastMessage) continue; // Jika tidak ada pesan, skip

          console.log("Last Message:", lastMessage);

          // Pengecekan format created_at dan logika perbandingan
          const lastMessageDate = new Date(lastMessage.created_at);
          const existingMessageDate = lastMessages[opponentId]
            ? new Date(lastMessages[opponentId].created_at)
            : null;

          // Cek apakah existingMessageDate valid dan lakukan perbandingan
          const lastMessageTime = lastMessageDate.getTime();
          const existingMessageTime = existingMessageDate
            ? existingMessageDate.getTime()
            : 0;

          console.log(
            `Comparing dates: ${
              lastMessage.created_at
            } vs ${existingMessageDate?.toISOString()}`
          );

          // Jika belum ada pesan atau jika pesan yang baru lebih baru
          if (
            !lastMessages[opponentId] ||
            lastMessageTime > existingMessageTime
          ) {
            lastMessages[opponentId] = {
              ...lastMessage,
              opponent_id: opponentId,
              opponent_name:
                chat.sender_id === userId
                  ? chat.receiver?.name
                  : chat.sender?.name,
            };
          }
        }

        // Set chats dengan pesan terakhir dan nama lawan
        setChats(Object.values(lastMessages));
      } else {
        console.error("Gagal fetch chats:", data.message);
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  }, [userId]);
  useEffect(() => {
    if (userId) {
      fetchChats();
    }
  }, [userId, fetchChats]);

  const handleChatSelect = useCallback(
    async (chat: Chat) => {
      const opponentId =
        userId === chat.sender_id ? chat.receiver_id : chat.sender_id;

      const updatedChat = { ...chat, opponent_id: opponentId };
      setSelectedChat(updatedChat);

      localStorage.setItem("selectedChat", JSON.stringify(updatedChat));
      localStorage.setItem("selectedProductId", String(chat.item_id || ""));

      try {
        await fetch(
          `https://backend-leftoverz-production.up.railway.app/api/v1/chats/${chat.id}/read`,
          {
            method: "PUT",
          }
        );

        setChats((prevChats) =>
          prevChats.map((prevChat) =>
            prevChat.id === chat.id
              ? { ...prevChat, read_status: "1" }
              : prevChat
          )
        );
      } catch (error) {
        console.error("Error updating read_status:", error);
      }

      try {
        const res = await fetch(
          `https://backend-leftoverz-production.up.railway.app/api/v1/messages/${userId}/${opponentId}`
        );
        const data = await res.json();

        if (res.ok) {
          let selectedMessages: Chat[];

          if (chat.item_id) {
            selectedMessages = data.filter(
              (msg: Chat) => msg.item_id === chat.item_id
            );
          } else {
            selectedMessages = data;
          }

          setMessages(selectedMessages);
          localStorage.setItem("messages", JSON.stringify(selectedMessages));
        } else {
          setMessages([]);
          console.error("Gagal fetch messages:", data.message);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
        setMessages([]);
      }
    },
    [userId]
  );

  useEffect(() => {
    const storedMessages = localStorage.getItem("messages");
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
  }, []);
  const handleSendMessage = async () => {
    if (!newMessage || !selectedChat || !userId || !selectedProductId) {
      console.warn("Gagal kirim pesan: Ada data yang belum lengkap", {
        newMessage,
        selectedChat,
        userId,
        selectedProductId,
      });
      return;
    }

    const receiver_id = selectedChat.opponent_id!;
    const item_id = selectedProductId;

    try {
      const response = await fetch(
        `https://backend-leftoverz-production.up.railway.app/api/v1/send/messages/${userId}/${receiver_id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ message: newMessage, item_id: item_id }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        const newMessageData: Chat = {
          id: data.chat?.id,
          sender_id: userId,
          receiver_id,
          item_id,
          message: newMessage,
          read_status: "0",
          created_at: new Date().toISOString(),
          sender: { id: userId, name: userName },
          receiver: data.chat?.receiver || {
            id: receiver_id,
          },
        };
        setMessages((prevMessages) => [...prevMessages, newMessageData]);
        setNewMessage("");
      } else {
        console.error("Gagal mengirim pesan:", data.message);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  useEffect(() => {
    const storedSelectedChat = localStorage.getItem("selectedChat");
    const storedProductId = localStorage.getItem("selectedProductId");

    if (storedSelectedChat) {
      const parsedChat = JSON.parse(storedSelectedChat);
      setSelectedChat(parsedChat);
    }

    if (storedProductId) {
      setSelectedProductId(Number(storedProductId));
    }

    const storedMessages = localStorage.getItem("messages");
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
  }, []);

  useEffect(() => {
    if (!userId || !selectedChat) return;
    const interval = setInterval(() => {
      fetchChats();
      handleChatSelect(selectedChat);
    }, 4000);

    return () => clearInterval(interval);
  }, [userId, selectedChat, fetchChats, handleChatSelect]);

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

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isLoading) return null;
  return (
    <div
      className={`items-center ${
        theme === "dark" ? "dark:bg-[#080B2A]" : "bg-white"
      } min-h-screen`}
    >
      <main>
        <Image
          width={100}
          height={100}
          alt=""
          src="/images/bubble.svg"
          className={`lg:h-[356px] lg:w-[356px] ${
            theme === "dark" ? "block" : "hidden"
          } max-lg:w-52 max-lg:h-72 absolute top-0 left-0`}
        />
        <Image
          width={100}
          height={100}
          alt=""
          src="/images/bubble-2.svg"
          className={`lg:h-[356px] lg:w-[356px] ${
            theme === "dark" ? "block" : "hidden"
          } max-lg:w-52 max-lg:h-72 absolute top-0 right-0`}
        />
        <Image
          width={100}
          height={100}
          alt=""
          src="/images/Star-1.svg"
          className="w-4 absolute top-28 right-8 max-lg:hidden -z-0"
        />
        <Image
          width={100}
          height={100}
          alt=""
          src="/images/Star-1.svg"
          className="w-4 absolute top-[400px] right-32 max-lg:hidden -z-0"
        />
        <Image
          width={100}
          height={100}
          alt=""
          src="/images/Star-1.svg"
          className="w-4 absolute top-44 left-10 max-lg:hidden -z-0"
        />
        <Image
          width={100}
          height={100}
          alt=""
          src="/images/Star-1.svg"
          className="w-4 absolute top-36 left-[550px] max-lg:hidden -z-0"
        />
        <div
          className={`pt-28 pb-20 w-full lg:px-20 max-lg:px-6 flex flex-col items-center gap-6 relative ${
            theme === "dark" ? "bg-white/10" : "bg-black/5"
          }`}
        >
          <div className="relative w-full">
            <Image
              width={600}
              height={400}
              alt="Hero About"
              src="/images/hero-product.jpg"
              className="rounded-2xl w-full h-64"
            />

            <div
              className={`absolute top-0 left-0 w-full h-full ${
                theme === "dark"
                  ? "bg-black/50 text-white"
                  : "bg-white/30 text-[#080B2A]"
              } backdrop-blur-md rounded-2xl flex flex-col justify-center max-lg:p-6 lg:ps-20 gap-2 z-40`}
            >
              <h1 className="lg:text-6xl max-lg:text-4xl font-bold">Chat</h1>
              <p className="max-lg:text-base lg:text-lg max-w-3xl">
                Kelola percakapan Anda dengan pembeli atau calon pembeli di
                sini. Jawab pertanyaan, diskusikan detail produk, dan bangun
                komunikasi yang baik untuk meningkatkan kepercayaan dan
                penjualan.
              </p>
            </div>
          </div>
        </div>
        <div className="lg:px-20 max-lg:px-6 py-10 justify-center items-center rounded-lg ">
          <div
            className={`lg:p-10 max-lg:p-4 rounded-2xl border-2 border-blue-400 ${
              theme === "dark" ? "bg-white/5" : "bg-black/5"
            }`}
          >
            <div className="lg:flex lg:flex-row max-lg:flex-col overflow-hidden lg:justify-between h-screen z-50">
              <div className="flex flex-col lg:w-1/5 w-full lg:border-r lg:border-blue-400 max-lg:h-56 overflow-y-auto">
                <div className="border-b-2 border-blue-400 py-4 px-2">
                  <input
                    type="text"
                    placeholder="search chatting"
                    className="py-2 px-2 border-2 border-blue-400 text-blue-400 rounded-xl w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {chats
                  .filter((chat) =>
                    chat.opponent_name
                      ?.toLowerCase()
                      .includes(searchQuery.toLowerCase())
                  )
                  .slice()
                  .reverse().length === 0 ? (
                  <div
                    className={`p-4 mt-4 text-center ${
                      theme === "dark" ? "text-gray-400" : "text-blue-400"
                    }`}
                  >
                    Tidak ada chat
                  </div>
                ) : (
                  chats
                    .filter((chat) =>
                      chat.opponent_name
                        ?.toLowerCase()
                        .includes(searchQuery.toLowerCase())
                    )
                    .slice()
                    .reverse()
                    .map((chat) => (
                      <div
                        key={chat.opponent_id}
                        className="flex items-center gap-4 py-4 px-2 border-b border-blue-400 hover:bg-white/5 transition-colors"
                        onClick={() => handleChatSelect(chat)}
                      >
                        <span className="w-10 h-10 shrink-0 bg-blue-400 rounded-full flex items-center justify-center text-white font-bold">
                          {chat.opponent_name
                            ? chat.opponent_name
                                .split(" ")
                                .map((w) => w.charAt(0))
                                .join("")
                                .toUpperCase()
                            : "NN"}{" "}
                        </span>
                        <div className="flex-1 overflow-hidden">
                          <div
                            className={`text-lg font-semibold truncate capitalize ${
                              theme === "dark" ? "text-white" : "text-blue-400"
                            }`}
                          >
                            {chat.opponent_name || "Nama Tidak Diketahui"}
                          </div>
                          <div
                            className={`text-sm truncate ${
                              theme === "dark"
                                ? "text-gray-400"
                                : "text-[#080B2A]"
                            }`}
                          >
                            {chat.message || "Pesan tidak ada"}
                          </div>
                        </div>

                        {chat.sender_id !== userId &&
                          chat.read_status === "0" && (
                            <span className="ml-2 p-1.5 bg-blue-400 rounded-full">
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
                                  d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                                />
                              </svg>
                            </span>
                          )}
                      </div>
                    ))
                )}
              </div>

              <div className="flex flex-col w-full lg:w-4/5 overflow-hidden">
                <div className="flex-1 overflow-y-auto pt-5">
                  {messages.length === 0 ? (
                    <div
                      className={`flex justify-center items-center h-full text-center ${
                        theme === "dark" ? "text-white" : "text-blue-400"
                      }`}
                    >
                      <div className="block">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-32 h-32 mb-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
                          />
                        </svg>
                        <p> Belum ada pesan</p>
                      </div>
                    </div>
                  ) : (
                    messages.map((message, index) => {
                      const isSender = message.sender_id === userId;
                      const isReceiver = message.receiver_id === userId;

                      return (
                        <div
                          key={index}
                          className={`flex gap-3 ${
                            isSender ? "justify-end" : "justify-start"
                          } mb-4`}
                        >
                          {isReceiver && (
                            <span className="w-10 h-10 shrink-0 bg-blue-300 rounded-full flex items-center justify-center text-white font-bold">
                              {message.sender?.name
                                ? message.sender.name
                                    .split(" ")
                                    .map((word) => word.charAt(0))
                                    .join("")
                                    .toUpperCase()
                                : "?"}
                            </span>
                          )}

                          <div
                            className={`py-3 px-4 rounded-xl ${
                              isSender
                                ? "bg-blue-400 text-white rounded-bl-3xl rounded-tl-3xl"
                                : "bg-blue-300 text-white rounded-br-3xl rounded-tr-3xl"
                            }`}
                          >
                            {message.Product?.name && (
                              <div className="text-xs bg-white border border-blue-400 text-blue-400 flex rounded-lg p-2 font-semibold mb-2 w-fit">
                                Produk : {message.Product.name}
                              </div>
                            )}
                            {message.message}
                          </div>
                          {isSender && (
                            <span className="w-10 h-10 shrink-0 bg-blue-400 rounded-full flex items-center justify-center lg:mr-4 text-white font-bold">
                              {message.sender?.name
                                ? message.sender.name
                                    .split(" ")
                                    .map((word) => word.charAt(0))
                                    .join("")
                                    .toUpperCase()
                                : "?"}
                            </span>
                          )}
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>
                <div className="py-4 flex items-center gap-2 border-t max-lg:bg-[#080B2A] border-blue-400 sticky bottom-0 z-10">
                  <div className="w-1/3 sm:w-1/4">
                    <select
                      value={selectedProductId ?? ""}
                      onChange={(e) =>
                        setSelectedProductId(Number(e.target.value))
                      }
                      className="lg:py-2.5 max-lg:py-2 px-4 w-full border bg-gray-300 text-sm text-black rounded-xl"
                    >
                      <option value="" disabled>
                        Pilih produk
                      </option>
                      {userProducts.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <input
                    className="flex-1 bg-gray-300 text-black lg:py-2.5 max-lg:py-2 px-4 rounded-xl"
                    type="text"
                    placeholder="Type your message here..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <button
                    className="lg:p-3 max-lg:p-2 bg-blue-400 text-white rounded-full aspect-square flex items-center justify-center hover:bg-blue-500 transition-colors"
                    onClick={handleSendMessage}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <button
        onClick={toggleTheme}
        aria-label="Toggle theme"
        title="Toggle theme"
        className={`fixed bottom-6 lg:right-20 max-md:right-8 z-50 p-3 rounded-full bg-blue-400 ${
          theme === "dark"
            ? "text-white border border-white"
            : "text-[#080B2A] border border-[#080B2A]"
        }`}
      >
        {theme === "dark" ? (
          <svg
            role="graphics-symbol"
            viewBox="0 0 15 15"
            width="15"
            height="15"
            fill="none"
            className={`${theme === "dark" ? "block" : "hidden"} w-7 h-7`}
          >
            <path
              d="M2.89998 0.499976C2.89998 0.279062 2.72089 0.0999756 2.49998 0.0999756C2.27906 0.0999756 2.09998 0.279062 2.09998 0.499976V1.09998H1.49998C1.27906 1.09998 1.09998 1.27906 1.09998 1.49998C1.09998 1.72089 1.27906 1.89998 1.49998 1.89998H2.09998V2.49998C2.09998 2.72089 2.27906 2.89998 2.49998 2.89998C2.72089 2.89998 2.89998 2.72089 2.89998 2.49998V1.89998H3.49998C3.72089 1.89998 3.89998 1.72089 3.89998 1.49998C3.89998 1.27906 3.72089 1.09998 3.49998 1.09998H2.89998V0.499976ZM5.89998 3.49998C5.89998 3.27906 5.72089 3.09998 5.49998 3.09998C5.27906 3.09998 5.09998 3.27906 5.09998 3.49998V4.09998H4.49998C4.27906 4.09998 4.09998 4.27906 4.09998 4.49998C4.09998 4.72089 4.27906 4.89998 4.49998 4.89998H5.09998V5.49998C5.09998 5.72089 5.27906 5.89998 5.49998 5.89998C5.72089 5.89998 5.89998 5.72089 5.89998 5.49998V4.89998H6.49998C6.72089 4.89998 6.89998 4.72089 6.89998 4.49998C6.89998 4.27906 6.72089 4.09998 6.49998 4.09998H5.89998V3.49998ZM1.89998 6.49998C1.89998 6.27906 1.72089 6.09998 1.49998 6.09998C1.27906 6.09998 1.09998 6.27906 1.09998 6.49998V7.09998H0.499976C0.279062 7.09998 0.0999756 7.27906 0.0999756 7.49998C0.0999756 7.72089 0.279062 7.89998 0.499976 7.89998H1.09998V8.49998C1.09998 8.72089 1.27906 8.89997 1.49998 8.89997C1.72089 8.89997 1.89998 8.72089 1.89998 8.49998V7.89998H2.49998C2.72089 7.89998 2.89998 7.72089 2.89998 7.49998C2.89998 7.27906 2.72089 7.09998 2.49998 7.09998H1.89998V6.49998ZM8.54406 0.98184L8.24618 0.941586C8.03275 0.917676 7.90692 1.1655 8.02936 1.34194C8.17013 1.54479 8.29981 1.75592 8.41754 1.97445C8.91878 2.90485 9.20322 3.96932 9.20322 5.10022C9.20322 8.37201 6.82247 11.0878 3.69887 11.6097C3.45736 11.65 3.20988 11.6772 2.96008 11.6906C2.74563 11.702 2.62729 11.9535 2.77721 12.1072C2.84551 12.1773 2.91535 12.2458 2.98667 12.3128L3.05883 12.3795L3.31883 12.6045L3.50684 12.7532L3.62796 12.8433L3.81491 12.9742L3.99079 13.089C4.11175 13.1651 4.23536 13.2375 4.36157 13.3059L4.62496 13.4412L4.88553 13.5607L5.18837 13.6828L5.43169 13.7686C5.56564 13.8128 5.70149 13.8529 5.83857 13.8885C5.94262 13.9155 6.04767 13.9401 6.15405 13.9622C6.27993 13.9883 6.40713 14.0109 6.53544 14.0298L6.85241 14.0685L7.11934 14.0892C7.24637 14.0965 7.37436 14.1002 7.50322 14.1002C11.1483 14.1002 14.1032 11.1453 14.1032 7.50023C14.1032 7.25044 14.0893 7.00389 14.0623 6.76131L14.0255 6.48407C13.991 6.26083 13.9453 6.04129 13.8891 5.82642C13.8213 5.56709 13.7382 5.31398 13.6409 5.06881L13.5279 4.80132L13.4507 4.63542L13.3766 4.48666C13.2178 4.17773 13.0353 3.88295 12.8312 3.60423L12.6782 3.40352L12.4793 3.16432L12.3157 2.98361L12.1961 2.85951L12.0355 2.70246L11.8134 2.50184L11.4925 2.24191L11.2483 2.06498L10.9562 1.87446L10.6346 1.68894L10.3073 1.52378L10.1938 1.47176L9.95488 1.3706L9.67791 1.2669L9.42566 1.1846L9.10075 1.09489L8.83599 1.03486L8.54406 0.98184ZM10.4032 5.30023C10.4032 4.27588 10.2002 3.29829 9.83244 2.40604C11.7623 3.28995 13.1032 5.23862 13.1032 7.50023C13.1032 10.593 10.596 13.1002 7.50322 13.1002C6.63646 13.1002 5.81597 12.9036 5.08355 12.5522C6.5419 12.0941 7.81081 11.2082 8.74322 10.0416C8.87963 10.2284 9.10028 10.3497 9.34928 10.3497C9.76349 10.3497 10.0993 10.0139 10.0993 9.59971C10.0993 9.24256 9.84965 8.94373 9.51535 8.86816C9.57741 8.75165 9.63653 8.63334 9.6926 8.51332C9.88358 8.63163 10.1088 8.69993 10.35 8.69993C11.0403 8.69993 11.6 8.14028 11.6 7.44993C11.6 6.75976 11.0406 6.20024 10.3505 6.19993C10.3853 5.90487 10.4032 5.60464 10.4032 5.30023Z"
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
            ></path>
          </svg>
        ) : (
          <svg
            role="graphics-symbol"
            viewBox="0 0 15 15"
            width="15"
            height="15"
            fill="none"
            className={`${theme === "dark" ? "hidden" : "block"} w-7 h-7`}
          >
            <path
              d="M7.5 0C7.77614 0 8 0.223858 8 0.5V2.5C8 2.77614 7.77614 3 7.5 3C7.22386 3 7 2.77614 7 2.5V0.5C7 0.223858 7.22386 0 7.5 0ZM2.1967 2.1967C2.39196 2.00144 2.70854 2.00144 2.90381 2.1967L4.31802 3.61091C4.51328 3.80617 4.51328 4.12276 4.31802 4.31802C4.12276 4.51328 3.80617 4.51328 3.61091 4.31802L2.1967 2.90381C2.00144 2.70854 2.00144 2.39196 2.1967 2.1967ZM0.5 7C0.223858 7 0 7.22386 0 7.5C0 7.77614 0.223858 8 0.5 8H2.5C2.77614 8 3 7.77614 3 7.5C3 7.22386 2.77614 7 2.5 7H0.5ZM2.1967 12.8033C2.00144 12.608 2.00144 12.2915 2.1967 12.0962L3.61091 10.682C3.80617 10.4867 4.12276 10.4867 4.31802 10.682C4.51328 10.8772 4.51328 11.1938 4.31802 11.3891L2.90381 12.8033C2.70854 12.9986 2.39196 12.9986 2.1967 12.8033ZM12.5 7C12.2239 7 12 7.22386 12 7.5C12 7.77614 12.2239 8 12.5 8H14.5C14.7761 8 15 7.77614 15 7.5C15 7.22386 14.7761 7 14.5 7H12.5ZM10.682 4.31802C10.4867 4.12276 10.4867 3.80617 10.682 3.61091L12.0962 2.1967C12.2915 2.00144 12.608 2.00144 12.8033 2.1967C12.9986 2.39196 12.9986 2.70854 12.8033 2.90381L11.3891 4.31802C11.1938 4.51328 10.8772 4.51328 10.682 4.31802ZM8 12.5C8 12.2239 7.77614 12 7.5 12C7.22386 12 7 12.2239 7 12.5V14.5C7 14.7761 7.22386 15 7.5 15C7.77614 15 8 14.7761 8 14.5V12.5ZM10.682 10.682C10.8772 10.4867 11.1938 10.4867 11.3891 10.682L12.8033 12.0962C12.9986 12.2915 12.9986 12.608 12.8033 12.8033C12.608 12.9986 12.2915 12.9986 12.0962 12.8033L10.682 11.3891C10.4867 11.1938 10.4867 10.8772 10.682 10.682ZM5.5 7.5C5.5 6.39543 6.39543 5.5 7.5 5.5C8.60457 5.5 9.5 6.39543 9.5 7.5C9.5 8.60457 8.60457 9.5 7.5 9.5C6.39543 9.5 5.5 8.60457 5.5 7.5ZM7.5 4.5C5.84315 4.5 4.5 5.84315 4.5 7.5C4.5 9.15685 5.84315 10.5 7.5 10.5C9.15685 10.5 10.5 9.15685 10.5 7.5C10.5 5.84315 9.15685 4.5 7.5 4.5Z"
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
            ></path>
          </svg>
        )}
      </button>
    </div>
  );
}
