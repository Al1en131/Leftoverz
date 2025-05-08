"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

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
  opponent_id?: number; // untuk mempermudah pengiriman pesan
};

export default function RoomChat() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Chat[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const storedUserId = localStorage.getItem("id");
    const storedUserName = localStorage.getItem("name");

    if (storedUserId) setUserId(Number(storedUserId));
    if (storedUserName) setUserName(storedUserName);
  }, []);

  useEffect(() => {
    const fetchChats = async () => {
      if (!userId) return;

      try {
        const res = await fetch(
          `http://127.0.0.1:1031/api/v1/chats/user/${userId}`
        );
        const data = await res.json();

        if (res.ok) {
          const lastMessages = data.chats.reduce(
            (acc: { [key: number]: Chat }, chat: Chat) => {
              const opponentId =
                chat.sender_id === userId ? chat.receiver_id : chat.sender_id;
              if (
                !acc[opponentId] ||
                new Date(chat.created_at) > new Date(acc[opponentId].created_at)
              ) {
                acc[opponentId] = { ...chat, opponent_id: opponentId };
              }
              return acc;
            },
            {}
          );

          setChats(Object.values(lastMessages));
        } else {
          console.error("Gagal fetch chats:", data.message);
        }
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };

    fetchChats();
  }, [userId]);

  const handleChatSelect = async (chat: Chat) => {
    const opponentId =
      userId === chat.sender_id ? chat.receiver_id : chat.sender_id;

    setSelectedChat({ ...chat, opponent_id: opponentId });

    try {
      await fetch(`http://127.0.0.1:1031/api/v1/chats/${chat.id}/read`, {
        method: "PUT",
      });
      setChats((prevChats) =>
        prevChats.map((prevChat) =>
          prevChat.id === chat.id ? { ...prevChat, read_status: "1" } : prevChat
        )
      );
    } catch (error) {
      console.error("Error updating read_status:", error);
    }

    try {
      const res = await fetch(
        `http://127.0.0.1:1031/api/v1/messages/${userId}/${opponentId}`
      );
      const data = await res.json();

      if (res.ok) {
        const selectedMessages = data.filter(
          (msg: Chat) => msg.item_id === chat.item_id
        );
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
  };

  useEffect(() => {
    const storedMessages = localStorage.getItem("messages");
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
  }, []);

  const handleSendMessage = async () => {
    if (!newMessage || !selectedChat || !userId) return;

    const receiver_id = selectedChat.opponent_id!;
    const item_id = selectedChat.item_id;

    try {
      const response = await fetch(
        `http://127.0.0.1:1031/api/v1/send/messages/${userId}/${receiver_id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ message: newMessage }),
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
            name: "Receiver",
          },
        };

        setMessages((prevMessages) => [...prevMessages, newMessageData]);

        // Perbarui selectedChat hanya jika sesuai
        setSelectedChat((prevChat) =>
          prevChat ? { ...prevChat, message: newMessage } : prevChat
        );

        setNewMessage("");
        const updatedMessages = [...messages, newMessageData];
        localStorage.setItem("messages", JSON.stringify(updatedMessages));
      } else {
        console.error("Gagal mengirim pesan:", data.message);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="items-center bg-[#080B2A] min-h-screen">
      <main>
        <Image
          width={100}
          height={100}
          alt=""
          src="/images/bubble.svg"
          className="h-[356px] w-[356px] absolute top-0 left-0"
        />
        <Image
          width={100}
          height={100}
          alt=""
          src="/images/bubble-2.svg"
          className="h-[356px] w-[356px] absolute top-0 right-0"
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
        <div className="bg-white/5 pt-28 pb-20 w-full lg:px-20 max-lg:px-6 flex flex-col items-center gap-6 relative">
          <div className="relative w-full">
            <Image
              width={600}
              height={400}
              alt="Hero About"
              src="/images/hero-product.jpg"
              className="rounded-2xl w-full h-64"
            />

            <div className="absolute top-0 left-0 w-full h-full bg-black/50 backdrop-blur-md rounded-2xl flex flex-col justify-center max-lg:p-6 md:ps-20 gap-2 text-white z-40">
              <h1 className="lg:text-6xl max-lg:text-4xl font-bold">Chat</h1>
              <p className="max-lg:text-base md:text-lg max-w-3xl">
                Contrary to popular belief, Lorem Ipsum is not simply random
                text. It has roots in a piece of classical Latin literature from
                45 BC, making it over 2000 years old.
              </p>
            </div>
          </div>
        </div>
        <div className="lg:px-20 max-lg:px-6 py-10 justify-center items-center rounded-lg ">
          <div className="bg-white/5 p-10 rounded-2xl border-2 border-blue-400">
            <div className="lg:flex lg:flex-row lg:justify-between max-lg:block z-50">
              <div className="flex flex-col lg:w-2/5 max-lg:w-full lg:border-r-2 overflow-y-auto h-[calc(100vh-64px)]">
                <div className="border-b-2 py-4 px-2">
                  <input
                    type="text"
                    placeholder="search chatting"
                    className="py-2 px-2 border-2 border-gray-200 rounded-2xl w-full"
                  />
                </div>
                {chats
                  .slice()
                  .reverse()
                  .map((chat) => (
                    <div
                      key={chat.id}
                      className="flex items-center gap-4 py-4 px-2 border-b border-white/10 hover:bg-white/5 transition-colors"
                      onClick={() => handleChatSelect(chat)} // Menambahkan event onClick
                    >
                      <span className="w-10 h-10 shrink-0 bg-blue-400 rounded-full flex items-center justify-center text-white font-bold">
                        {userId === chat.sender_id
                          ? chat.receiver?.name
                              ?.split(" ")
                              .map((w) => w.charAt(0))
                              .join("")
                              .toUpperCase()
                          : chat.sender?.name
                              ?.split(" ")
                              .map((w) => w.charAt(0))
                              .join("")
                              .toUpperCase()}
                      </span>
                      <div className="flex-1 overflow-hidden">
                        <div className="text-lg font-semibold truncate">
                          {chat.sender?.name}
                        </div>
                        <div className="text-sm text-gray-400 truncate">
                          {chat.message}
                        </div>
                      </div>

                      {/* Menambahkan ikon khusus jika chat belum dibaca */}
                      {chat.read_status === "0" && (
                        <span className="ml-2">
                          {/* Ikon untuk chat belum dibaca */}
                          <svg
                            className="w-6 h-6 text-blue-400"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fillRule="evenodd"
                              d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v5a1 1 0 1 0 2 0V8Zm-1 7a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2H12Z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </span>
                      )}
                    </div>
                  ))}
              </div>

              <div className="w-full lg:px-5 flex flex-col justify-between">
                <div className="flex flex-col mt-5 overflow-y-auto grow px-1">
                  {messages.map((message, index) => {
                    const isSender = message.sender_id === userId; // Periksa apakah user yang sedang login adalah pengirim
                    const isReceiver = message.receiver_id === userId; // Periksa apakah user yang sedang login adalah penerima
                    console.log(`Message index: ${index}`);
                    console.log("message.sender_id:", message.sender_id);
                    console.log("message.receiver_id:", message.receiver_id);
                    console.log("userId:", userId);
                    console.log("isSender:", isSender);
                    console.log("isReceiver:", isReceiver);
                    return (
                      <div
                        key={index}
                        className={`flex gap-3 ${
                          isSender ? "justify-end" : "justify-start"
                        } mb-4`}
                      >
                        {/* Avatar untuk penerima */}
                        {isReceiver && (
                          <span className="w-10 h-10 shrink-0 bg-blue-400 rounded-full flex items-center justify-center text-white font-bold">
                            {message.sender?.name
                              ? message.sender.name
                                  .split(" ")
                                  .map((word) => word.charAt(0))
                                  .join("")
                                  .toUpperCase()
                              : "?"}
                          </span>
                        )}

                        {/* Pesan */}
                        <div
                          className={`py-3 px-4 rounded-xl ${
                            isSender
                              ? "bg-blue-400 text-white rounded-bl-3xl rounded-tl-3xl"
                              : "bg-blue-100 text-blue-400 rounded-br-3xl rounded-tr-3xl"
                          }`}
                        >
                          {message.message}
                        </div>

                        {/* Avatar untuk pengirim, hanya tampilkan di pesan yang dikirim oleh user yang sedang login */}
                        {isSender && (
                          <span className="w-10 h-10 shrink-0 bg-blue-400 rounded-full flex items-center justify-center text-white font-bold">
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
                  })}
                </div>

                {/* Message input section */}
                <div className="pt-5 flex items-center gap-2">
                  <input
                    className="w-full bg-gray-300 text-black py-2.5 px-4 rounded-xl"
                    type="text"
                    placeholder="Type your message here..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <button
                    className="p-3 bg-blue-400 text-white rounded-full aspect-square flex items-center justify-center hover:bg-blue-500 transition-colors"
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
    </div>
  );
}
