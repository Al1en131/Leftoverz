"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

type User = {
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
};
type Product = {
  id: number;
  name: string;
  email: string;
  no_hp: string;
  role: string;
  image: string[];
  description: string;
  price: number;
  status: string;
  user_id: number;
  seller?: { name: string };
  user?: {
    subdistrict: string;
    ward: string;
    regency: string;
    province: string;
  };
};

export default function ProductDetail() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Chat[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [userId, setUserId] = useState<number | null>(null);
  const [userName, setUserName] = useState("");
  const params = useParams();
  const productId = params?.id;
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);

  useEffect(() => {
    const storedUserId = localStorage.getItem("id");
    const storedUserName = localStorage.getItem("name");

    if (storedUserId) setUserId(Number(storedUserId));
    if (storedUserName) setUserName(storedUserName);
  }, []);
  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `http://127.0.0.1:1031/api/v1/product/detail/${productId}`
        );
        const data = await res.json();

        if (!res.ok) throw new Error(data.message);

        let parsedImage = data.product.image;

        try {
          parsedImage = JSON.parse(parsedImage);
        } catch {
          console.log("Image is not in valid JSON format, skipping parsing.");
        }

        console.log("Parsed image data:", parsedImage);

        const formattedImages = Array.isArray(parsedImage)
          ? parsedImage.map(
              (imgUrl: string) => `http://127.0.0.1:1031${imgUrl}`
            )
          : parsedImage?.url
          ? [`http://127.0.0.1:1031${parsedImage.url}`]
          : [];

        setProduct({
          ...data.product,
          image: formattedImages,
        });

        setSelectedImage(formattedImages[0] || null);
        setLoading(false);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error(err.message);
        } else {
          console.error("An unknown error occurred");
        }
      }
    };

    fetchProduct();
  }, [productId]);

  const openChat = async () => {
    setIsChatOpen(true);

    const opponentId = product?.user_id;
    console.log("Opponent ID:", opponentId); // Log the opponentId

    if (!userId || !opponentId) return;

    try {
      const res = await fetch(
        `http://127.0.0.1:1031/api/v1/messages/${userId}/${opponentId}`
      );
      const data = await res.json();
      console.log("Fetched messages:", data); // Log the fetched messages

      if (res.ok) {
        const filteredMessages = product?.id
          ? data.filter((msg: Chat) => msg.item_id === product.id)
          : data;

        console.log("Filtered messages:", filteredMessages); // Log the filtered messages

        const unreadChat = filteredMessages.find(
          (msg: Chat) => msg.receiver_id === userId && msg.read_status === "0"
        );

        if (unreadChat) {
          await fetch(
            `http://127.0.0.1:1031/api/v1/chats/${unreadChat.id}/read`,
            {
              method: "PUT",
            }
          );

          setChats((prevChats) =>
            prevChats.map((chat) =>
              chat.id === unreadChat.id ? { ...chat, read_status: "1" } : chat
            )
          );
          setHasUnreadMessages(false);
        }

        setMessages(filteredMessages);
        localStorage.setItem("messages", JSON.stringify(filteredMessages));

        // Here, we ensure that selectedChat is set correctly
        const firstChat = filteredMessages[0]; // or any logic to select the correct chat
        setSelectedChat(firstChat);
      } else {
        setMessages([]);
        console.error("Failed to fetch messages:", data.message);
      }
    } catch (error) {
      console.error("Error opening chat:", error);
      setMessages([]);
    }
  };

  const handleSendMessage = async () => {
    console.log("newMessage:", newMessage);
    console.log("selectedChat:", selectedChat);
    console.log("userId:", userId);

    if (!newMessage || !selectedChat || !userId) {
      console.log("Missing data to send the message");
      return;
    }

    const receiver_id = product?.user_id ?? selectedChat?.receiver_id;
    if (!receiver_id) {
      console.error("Receiver ID is missing.");
      return;
    }

    const item_id = selectedChat.item_id;

    console.log("Sending message to", receiver_id, "for item", item_id);

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
        // Add the new message to the chat
        const newMessageData: Chat = {
          id: data.chat?.id,
          sender_id: userId,
          receiver_id,
          item_id : selectedChat.item_id,
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
        setSelectedChat((prevChat) =>
          prevChat ? { ...prevChat, message: newMessage } : prevChat
        );
        setNewMessage("");
        const updatedMessages = [...messages, newMessageData];
        localStorage.setItem("messages", JSON.stringify(updatedMessages));
      } else {
        console.error("Failed to send message:", data.message);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="bg-[#080B2A] min-h-screen flex flex-col items-center">
      <Image
        width={100}
        height={100}
        alt=""
        src="/images/bubble.svg"
        className="h-[356px] w-[356px] absolute top-0 left-0 -z-0 max-lg:hidden"
      />
      <Image
        width={100}
        height={100}
        alt=""
        src="/images/bubble-2.svg"
        className="h-[356px] w-[356px] absolute top-0 right-0 max-lg:hidden"
      />
      <Image
        width={100}
        height={100}
        alt=""
        src="/images/Star-1.svg"
        className="w-8 absolute top-28 max-lg:hidden right-26 -z-0"
      />
      <Image
        width={100}
        height={100}
        alt=""
        src="/images/Star-1.svg"
        className="w-4 absolute top-28 right-96 max-lg:hidden -z-0"
      />
      <Image
        width={100}
        height={100}
        alt=""
        src="/images/Star-1.svg"
        className="w-4 absolute top-[750px] left-56 max-lg:hidden -z-0"
      />
      <Image
        width={100}
        height={100}
        alt=""
        src="/images/Star-1.svg"
        className="w-4 absolute top-[700px] max-lg:hidden right-[300px] -z-0"
      />
      <div className="md:flex md:gap-10 max-lg:gap-4 md:p-20 max-lg:px-6 w-full max-lg:py-14 mt-10 h-auto">
        <div className="md:w-4/12 max-lg:w-full z-40 max-lg:mb-4">
          <div className="h-96 rounded-lg overflow-hidden">
            {product && (
              <Image
                src={selectedImage ?? "/placeholder.jpg"}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-96 object-cover rounded-lg"
              />
            )}
          </div>
          <div className="grid grid-cols-5 gap-4 md:mt-6 max-lg:mt-0">
            {product?.image.map((img, index) => (
              <button key={index} onClick={() => setSelectedImage(img)}>
                <Image
                  src={img}
                  alt={`Thumbnail ${index}`}
                  width={100}
                  height={100}
                  className="md:w-24 md:h-24 max-lg:h-16 object-cover rounded-lg"
                />
              </button>
            ))}
          </div>
        </div>
        <div className="mb-4 md:w-8/12 max-lg:w-full block items-center relative">
          <div className="block">
            <h3 className="text-white text-xl mb-2 font-bold tracking-wide">
              {product?.name}
            </h3>
            <p className="mb-2 !capitalize">
              {product?.user?.ward}, {product?.user?.subdistrict},{" "}
              {product?.user?.regency}, {product?.user?.province}
            </p>
            <div className="flex items-center mb-8 gap-2">
              <span className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center">
                {product?.seller?.name
                  ? product?.seller.name
                      .split(" ")
                      .map((word) => word.charAt(0))
                      .join("")
                      .toUpperCase()
                  : "?"}
              </span>
              <p className="text-blue-400 font-semibold">
                {product?.seller?.name}
              </p>
            </div>
            <p className="text-base max-lg:text-justify">
              {product?.description}
            </p>
          </div>
          <div className="flex items-center gap-4 md:absolute max-lg:mt-4 max-lg:justify-end md:bottom-0 md:right-0">
            <Image
              src="/images/heart-remove.svg"
              width={100}
              height={100}
              alt=""
              className="w-8 h-8 text-white"
            />
            <Link
              href=""
              className="bg-[#15BFFD] px-6 py-3 text-center w-40 text-white rounded-full hover:bg-transparent z-50 hover:text-[#15BFFD] hover:border-2 hover:border-[#15BFFD]"
            >
              Beli
            </Link>
          </div>
        </div>
      </div>
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={openChat}
          className="relative bg-[#15BFFD] hover:bg-blue-400 text-white p-4 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          <Image
            width={100}
            height={100}
            alt=""
            src="/images/chat.svg"
            className="w-8 h-8"
          />
          {hasUnreadMessages && (
            <span className="absolute top-1 right-1 bg-red-500 w-3 h-3 rounded-full border border-white" />
          )}
        </button>

        {isChatOpen && (
          <div className="mt-4 w-80 bg-white border border-blue-400 rounded-2xl shadow-xl overflow-hidden animate-fade-in">
            <div className="bg-[#15BFFD] text-white px-4 py-3 font-semibold flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 bg-gray-300 rounded-full"></span>
                <p className="text-white font-semibold">{}</p>
              </div>
              <button onClick={() => setIsChatOpen(false)}>
                <svg
                  className="w-6 h-6 text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18 17.94 6M18 18 6.06 6"
                  />
                </svg>
              </button>
            </div>
            <div className="p-4 max-h-60 overflow-y-auto space-y-3 text-sm">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`p-2 rounded-lg w-fit ${
                    msg.sender_id === userId
                      ? "text-white bg-[#15BFFD] self-end ml-auto text-right"
                      : "text-gray-700 bg-gray-300"
                  }`}
                >
                  {msg.message}
                </div>
              ))}
            </div>

            <div className="border-t px-4 py-2 bg-gray-50">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Tulis pesan..."
                  className="flex-grow px-3 py-2 text-sm text-blue-400 border rounded-lg focus:outline-none"
                />
                <button
                  type="submit"
                  className="text-white bg-[#15BFFD] px-3 py-2 rounded-lg text-sm hover:bg-blue-400"
                >
                  Kirim
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
