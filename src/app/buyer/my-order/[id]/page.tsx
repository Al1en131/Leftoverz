"use client";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useParams, useRouter } from "next/navigation";
import Transaction from "@/app/seller/transaction/page";

type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  address: string;
  subdistrict: string;
  province: string;
  ward: string;
  regency: string;
  postal_code: string;
  payment_account_number: string;
  account_holder_name: string;
  payment_type: string;
};
type SenderUser = {
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
  sender?: SenderUser;
  receiver?: SenderUser;
  Product?: Product;
  opponent_id?: number;
};
type Product = {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  role: string;
  image: string[];
  description: string;
  price: number;
  status: string;
  user_id: number;
  used_duration: string;
  original_price: number;
  seller?: { name: string; phone_number: number };
  user?: {
    subdistrict: string;
    ward: string;
    regency: string;
    province: string;
    name: string;
  };
};

type RawTransaction = {
  id: number;
  order_id: string;
  buyer_id: number;
  seller_id: number;
  item_id: number;
  payment_method: "COD" | "e-wallet" | "bank transfer";
  status: "success" | "paid" | "cancelled" | null;
  created_at: string;
  total: number;
  awb: string;
  courir: string;
  item?: {
    name: string;
    image: string[];
    price: number;
  };
  buyer?: { name: string };
  seller?: {
    name: string;
    address: string;
    ward: string;
    regency: string;
    province: string;
    subdistrict: string;
    postal_code: number;
  };
};

type Transaction = RawTransaction & {
  item_name: string;
  buyer_name: string;
  seller_name: string;
  image: string[];
};

type TrackingDataType = {
  summary: {
    awb: string;
    courier: string;
    status: string;
    date: string;
    weight: string;
    amount: string;
  };
  detail: {
    origin: string;
    destination: string;
    shipper: string;
    receiver: string;
  };
  history: {
    date: string;
    desc: string;
  }[];
};

export default function BuyProduct() {
  const [user, setUser] = useState<User | null>(null);
  const params = useParams();
  const transactionId = params?.id;
  const [productId, setProductId] = useState<number | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const { theme, setTheme } = useTheme();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [trackingData, setTrackingData] = useState<TrackingDataType | null>(
    null
  );
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Chat[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [product] = useState<Product | null>(null);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    if (user && user.name) {
      setUserName(user.name);
    }
  }, [user]);
  useEffect(() => {
    const fetchTransactionById = async () => {
      try {
        if (!userId || !transactionId) return;

        const res = await fetch(
          `https://backend-leftoverz-production.up.railway.app/api/v1/${userId}/transaction/${transactionId}`
        );
        const response: { transaction: RawTransaction; message: string } =
          await res.json();

        if (res.ok) {
          const t = response.transaction;
          setProductId(t.item_id);

          let imageArray: string[] = [];

          if (typeof t.item?.image === "string") {
            try {
              imageArray = JSON.parse(t.item.image);
            } catch {
              imageArray = [t.item.image];
            }
          } else if (Array.isArray(t.item?.image)) {
            imageArray = t.item.image;
          }

          const mappedTransaction: Transaction = {
            ...t,
            item_name: t.item?.name || "Unknown",
            buyer_name: t.buyer?.name || "Unknown",
            seller_name: t.seller?.name || "Unknown",
            image: imageArray,
          };

          setTransaction(mappedTransaction);
        } else {
          console.error("Fetch error:", response.message);
        }
      } catch (error) {
        console.error("Network error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionById();
  }, [userId, transactionId]);
  const openChat = useCallback(async () => {
    setIsChatOpen(true);

    const opponentId = product?.user_id;
    if (!userId || !opponentId || !productId) return;

    try {
      const res = await fetch(
        `https://backend-leftoverz-production.up.railway.app/api/v1/chats/product/${productId}/${userId}/${opponentId}`
      );
      const data = await res.json();

      if (res.ok) {
        const chatMessages = Array.isArray(data.chats) ? data.chats : [];
        const unreadChat = chatMessages.find(
          (msg: Chat) => msg.receiver_id === userId && msg.read_status === "0"
        );

        if (unreadChat) {
          await fetch(
            `https://backend-leftoverz-production.up.railway.app/api/v1/chats/${unreadChat.id}/read`,
            {
              method: "PUT",
            }
          );

          setMessages((prevChats) =>
            prevChats.map((chat) =>
              chat.id === unreadChat.id ? { ...chat, read_status: "1" } : chat
            )
          );
        }

        setMessages(chatMessages);
        localStorage.setItem("messages", JSON.stringify(chatMessages));
      } else {
        setMessages([]);
        console.error("Failed to fetch messages:", data.message);
      }
    } catch (error) {
      console.error("Error opening chat:", error);
      setMessages([]);
    }
  }, [userId, productId, product]);

  useEffect(() => {
    const checkUnreadMessages = async () => {
      if (!userId || !productId || !product?.user_id) return;

      try {
        const res = await fetch(
          `https://backend-leftoverz-production.up.railway.app/api/v1/chats/product/${productId}/${userId}/${product.user_id}`
        );
        const data = await res.json();

        if (res.ok) {
          const chatMessages = Array.isArray(data.chats) ? data.chats : [];
          const hasUnread = chatMessages.some(
            (msg: Chat) => msg.receiver_id === userId && msg.read_status === "0"
          );
          setHasUnreadMessages(hasUnread);
        }
      } catch (error) {
        console.error("Failed to check unread messages:", error);
      }
    };

    checkUnreadMessages();

    const interval = setInterval(() => {
      checkUnreadMessages();
    }, 5000);

    return () => clearInterval(interval);
  }, [userId, productId, product]);

  useEffect(() => {
    if (isChatOpen) {
      openChat();
      const intervalId = setInterval(() => {
        openChat();
      }, 5000);
      return () => clearInterval(intervalId);
    }
  }, [isChatOpen, openChat, userId, productId, product]);

  const handleSendMessage = async () => {
    if (!newMessage || !productId || !userId || !product?.user_id) return;

    const receiver_id = product.user_id;

    try {
      const response = await fetch(
        `https://backend-leftoverz-production.up.railway.app/api/v1/send/${productId}/${userId}/${receiver_id}`,
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
          item_id: Number(productId),
          message: newMessage,
          read_status: "0",
          created_at: new Date().toISOString(),
          sender: { id: userId, name: userName },
          receiver: data.chat?.receiver || {
            id: receiver_id,
            name: "Receiver",
          },
        };

        const updatedMessages = [...messages, newMessageData];
        setMessages(updatedMessages);
        setSelectedChat((prev) =>
          prev ? { ...prev, message: newMessage } : prev
        );
        console.log(selectedChat);
        setNewMessage("");
        localStorage.setItem("messages", JSON.stringify(updatedMessages));
      } else {
        console.error("Failed to send message:", data.message);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme && storedTheme !== theme) {
      setTheme(storedTheme);
    }
  }, [theme, setTheme]);
  useEffect(() => {
    const storedUserId = localStorage.getItem("id");
    const token = localStorage.getItem("token");

    if (storedUserId && token) {
      const id = Number(storedUserId);
      setUserId(id);

      const fetchUser = async () => {
        try {
          const response = await fetch(
            `https://backend-leftoverz-production.up.railway.app/api/v1/user/${id}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const data = await response.json();
          if (data?.user) {
            setUser({
              ...data.user,
              id: String(data.user.id),
            });
          }
        } catch (error) {
          console.error("Failed to fetch user:", error);
        }
      };

      fetchUser();
    }
  }, []);
  const [loading, setLoading] = useState(true);

  const handleTrackPackage = async () => {
    try {
      const courier = transaction?.courir?.toLowerCase();
      const awb = transaction?.awb;

      if (!courier || !awb) {
        alert("Data ekspedisi tidak lengkap.");
        return;
      }

      let apiKey = "";
      let courierParam = courier;
      switch (courier) {
        case "jne":
          apiKey =
            "23ef9d28f62d15ac694e6d87d2c384549e7ba507f87f85ae933cbe93ada1fe3d";
          break;
        case "jnt":
          apiKey =
            "23ef9d28f62d15ac694e6d87d2c384549e7ba507f87f85ae933cbe93ada1fe3d";
          break;
        case "si cepat":
        case "sicepat":
          apiKey =
            "23ef9d28f62d15ac694e6d87d2c384549e7ba507f87f85ae933cbe93ada1fe3d";
          courierParam = "sicepat";
          break;
        default:
          alert("Kurir tidak dikenali.");
          return;
      }

      const res = await fetch(
        `https://api.binderbyte.com/v1/track?api_key=${apiKey}&courier=${courierParam}&awb=${awb}`
      );
      const result = await res.json();

      if (result.status === 200) {
        setTrackingData(result.data);
        setShowTrackingModal(true);
      } else {
        alert("Tracking gagal: " + result.message);
      }
    } catch (err) {
      console.error("Tracking Error:", err);
      alert("Terjadi kesalahan saat tracking.");
    }
  };
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
    <>
      <div
        className={`min-h-screen flex flex-col items-center ${
          theme === "dark" ? "bg-[#080B2A]" : "bg-white"
        }`}
      >
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
          className="w-8 absolute top-48 right-26 opacity-35 -z-0"
        />
        <Image
          width={100}
          height={100}
          alt=""
          src="/images/Star-1.svg"
          className="w-4 absolute top-36 right-[500px] opacity-35 -z-0"
        />
        <Image
          width={100}
          height={100}
          alt=""
          src="/images/Star-1.svg"
          className="w-4 absolute top-[750px] left-56 opacity-35 -z-0"
        />
        <Image
          width={100}
          height={100}
          alt=""
          src="/images/Star-1.svg"
          className="w-4 absolute top-[700px] right-[300px] opacity-35 -z-0"
        />
        {loading ? (
          <div className="text-center text-blue-400">
            <p>Loading ....</p>
          </div>
        ) : (
          <div className="lg:p-20 max-lg:px-6 max-lg:py-14 lg:mt-4 max-lg:mt-10 w-full">
            <div
              className={`lg:p-10 p-7 border_section rounded-2xl ${
                theme === "dark" ? "bg-white/20" : "bg-black/5"
              }`}
            >
              <div className="lg:flex lg:gap-2 relative max-lg:space-y-6 items-center h-auto">
                <div className="lg:w-1/3 max-lg:w-full">
                  <Image
                    src={
                      transaction?.image &&
                      Array.isArray(transaction?.image) &&
                      transaction?.image.length > 0 &&
                      typeof transaction?.image[0] === "string" &&
                      transaction?.image[0].startsWith("/")
                        ? `https://backend-leftoverz-production.up.railway.app${transaction?.image[0]}`
                        : "/images/default-product.png"
                    }
                    alt=""
                    width={100}
                    height={100}
                    className="lg:w-60 h-60 max-lg:w-full object-cover rounded-lg"
                  />
                </div>
                <div className="w-full">
                  <p
                    className={`text-xl ${
                      theme === "dark" ? "text-white" : "text-[#080B2A]"
                    }`}
                  >
                    {transaction?.item_name}
                  </p>
                  <p className="text-blue-400 mb-1 text-base">Buyer :</p>
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-10 h-10 text-lg rounded-full flex items-center justify-center ${
                        theme === "dark"
                          ? "text-white bg-blue-400"
                          : "text-white bg-blue-400"
                      }`}
                    >
                      {user?.name
                        ? user?.name
                            .split(" ")
                            .map((word) => word.charAt(0))
                            .join("")
                            .toUpperCase()
                        : "?"}
                    </span>
                    <p
                      className={`font-semibold text-lg ${
                        theme === "dark" ? "text-blue-400" : "text-blue-400"
                      }`}
                    >
                      {user?.name}
                    </p>
                  </div>

                  <p
                    className={`text-base mb-1 ps-12 ${
                      theme === "dark" ? "text-white" : "text-[#080B2A]"
                    }`}
                  >
                    {user?.address
                      ?.toLowerCase()
                      .replace(/\b\w/g, (c) => c.toUpperCase())}
                    ,
                    {user?.ward
                      ?.toLowerCase()
                      .replace(/\b\w/g, (c) => c.toUpperCase())}
                    ,{" "}
                    {user?.subdistrict
                      ?.toLowerCase()
                      .replace(/\b\w/g, (c) => c.toUpperCase())}
                    ,{" "}
                    {user?.regency
                      ?.toLowerCase()
                      .replace(/\b\w/g, (c) => c.toUpperCase())}
                    ,{" "}
                    {user?.province
                      ?.toLowerCase()
                      .replace(/\b\w/g, (c) => c.toUpperCase())}
                    , {user?.postal_code}
                  </p>
                  {!loading && transaction && (
                    <div>
                      <p className="text-blue-400 mt-3 text-base">Seller :</p>

                      <div className="mt-1 flex items-center gap-2">
                        <span
                          className={`w-10 h-10 text-lg rounded-full flex items-center justify-center ${
                            theme === "dark"
                              ? "text-white bg-blue-400"
                              : "text-white bg-blue-400"
                          }`}
                        >
                          {transaction.seller_name
                            ? transaction.seller_name
                                .split(" ")
                                .map((word) => word.charAt(0))
                                .join("")
                                .toUpperCase()
                            : "?"}
                        </span>
                        <p
                          className={`font-semibold text-lg ${
                            theme === "dark" ? "text-blue-400" : "text-blue-400"
                          }`}
                        >
                          {transaction.seller_name}
                        </p>
                      </div>
                      <p
                        className={`text-base mb-2 ps-12 ${
                          theme === "dark" ? "text-white" : "text-[#080B2A]"
                        }`}
                      >
                        {transaction.seller?.address
                          ?.toLowerCase()
                          .replace(/\b\w/g, (c) => c.toUpperCase())}
                        ,
                        {transaction.seller?.ward
                          ?.toLowerCase()
                          .replace(/\b\w/g, (c) => c.toUpperCase())}
                        ,{" "}
                        {transaction.seller?.subdistrict
                          ?.toLowerCase()
                          .replace(/\b\w/g, (c) => c.toUpperCase())}
                        ,{" "}
                        {transaction.seller?.regency
                          ?.toLowerCase()
                          .replace(/\b\w/g, (c) => c.toUpperCase())}
                        ,{" "}
                        {transaction.seller?.province
                          ?.toLowerCase()
                          .replace(/\b\w/g, (c) => c.toUpperCase())}
                        ,{""} {transaction?.seller?.postal_code}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleTrackPackage}
                  className="bg-blue-400 px-4 py-2 z-30 rounded-full text-white hover:bg-blue-500"
                >
                  Tracking Package
                </button>
                {showTrackingModal && trackingData && (
                  <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center text-left">
                    <div
                      className={`w-full max-w-3xl p-6 rounded-xl shadow-xl overflow-y-auto max-h-[90vh] relative scrollbar-hidden border-2 border-blue-400 ${
                        theme === "dark" ? "bg-[#080B2A]" : "bg-white"
                      }`}
                    >
                      <button
                        className="absolute top-4 right-4 text-red-500 font-bold text-xl"
                        onClick={() => setShowTrackingModal(false)}
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
                            d="M6 18 18 6M6 6l12 12"
                          />
                        </svg>
                      </button>

                      <h2 className="text-xl font-bold mb-4 text-blue-500">
                        Tracking Information
                      </h2>

                      <div
                        className={`mb-4 ${
                          theme === "dark" ? "text-white" : "text-blue-400"
                        }`}
                      >
                        <p>
                          <strong className="tracking-wider">AWB:</strong>{" "}
                          {trackingData.summary.awb || "-"}
                        </p>
                        <p>
                          <strong className="tracking-wider">Courier:</strong>{" "}
                          {trackingData.summary.courier || "-"}
                        </p>
                        <p>
                          <strong className="tracking-wider">Status:</strong>{" "}
                          {trackingData.summary.status || "-"}
                        </p>
                        <p>
                          <strong className="tracking-wider">Date:</strong>{" "}
                          {trackingData.summary.date || "-"}
                        </p>
                        <p>
                          <strong className="tracking-wider">Weight:</strong>{" "}
                          {trackingData.summary.weight || "-"}
                        </p>
                        <p>
                          <strong className="tracking-wider">Cost:</strong> Rp{" "}
                          {trackingData.summary.amount || "-"}
                        </p>
                      </div>

                      <div
                        className={`mb-4 ${
                          theme === "dark" ? "text-white" : "text-blue-400"
                        }`}
                      >
                        <p>
                          <strong className="tracking-wider">From:</strong>{" "}
                          {trackingData.detail.origin || "-"}
                        </p>
                        <p>
                          <strong className="tracking-wider">To:</strong>{" "}
                          {trackingData.detail.destination || "-"}
                        </p>
                        <p>
                          <strong className="tracking-wider">Shipper:</strong>{" "}
                          {trackingData.detail.shipper || "-"}
                        </p>
                        <p>
                          <strong className="tracking-wider">Receiver:</strong>{" "}
                          {trackingData.detail.receiver || "-"}
                        </p>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-blue-500 mb-2">
                          Tracking History
                        </h3>
                        <div className="mt-6 grow sm:mt-8 lg:mt-0">
                          <div
                            className={`space-y-6 rounded-lg border border-blue-400 p-6 shadow-sm ${
                              theme === "dark" ? "bg-white/10" : "bg-white"
                            }`}
                          >
                            <h3
                              className={`text-xl font-semibold ${
                                theme === "dark"
                                  ? "text-white"
                                  : "text-gray-900"
                              }`}
                            >
                              Tracking History
                            </h3>

                            <ol className="relative ms-3 border-s border-gray-500">
                              {trackingData?.history?.map((item, index) => (
                                <li
                                  key={index}
                                  className={`mb-10 ms-6 ${
                                    index === 0
                                      ? theme === "dark"
                                        ? "text-primary-500"
                                        : "text-primary-700"
                                      : ""
                                  }`}
                                >
                                  <span
                                    className={`absolute -start-3 flex h-6 w-6 items-center justify-center rounded-full ${
                                      index === 0
                                        ? "bg-blue-400"
                                        : "bg-gray-500"
                                    } text-white`}
                                  >
                                    <svg
                                      className="h-4 w-4"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 11.917 9.724 16.5 19 7.5"
                                      />
                                    </svg>
                                  </span>
                                  <h4
                                    className={`mb-0.5 text-base font-semibold ${
                                      theme === "dark"
                                        ? "text-white"
                                        : "text-gray-900"
                                    }`}
                                  >
                                    {item.date}
                                  </h4>
                                  <p className="text-sm text-blue-400">
                                    {item.desc}
                                  </p>
                                </li>
                              ))}
                            </ol>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div
              className={`p-10 border_section my-5 rounded-2xl ${
                theme === "dark" ? "bg-white/20" : "bg-black/5"
              }`}
            >
              <h3 className="text-3xl font-bold text-blue-400 mb-1">
                Payment Detail
              </h3>
              <p className="text-blue-400 text-base mb-2">
                {transaction?.order_id}
              </p>
              <div
                className={`block items-center py-4 space-y-2 mb-4 border-b ${
                  theme === "dark" ? "border-b-white" : "border-b-blue-400"
                }`}
              >
                <div className="flex justify-between items-center">
                  <p
                    className={`text-base ${
                      theme === "dark" ? "text-white" : "text-[#080B2A]"
                    }`}
                  >
                    {transaction?.item?.name}
                  </p>
                  <p
                    className={`text-base ${
                      theme === "dark" ? "text-white" : "text-[#080B2A]"
                    }`}
                  >
                    Rp {transaction?.item?.price.toLocaleString("id-ID")}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p
                    className={`text-base ${
                      theme === "dark" ? "text-white" : "text-[#080B2A]"
                    }`}
                  >
                    Biaya Admin
                  </p>
                  <p
                    className={`text-base ${
                      theme === "dark" ? "text-white" : "text-[#080B2A]"
                    }`}
                  >
                    Rp 5.000
                  </p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <p
                  className={`text-base font-bold tracking-wide ${
                    theme === "dark" ? "text-white" : "text-[#080B2A]"
                  }`}
                >
                  Total
                </p>
                <p
                  className={`text-base ${
                    theme === "dark" ? "text-white" : "text-[#080B2A]"
                  }`}
                >
                  Rp {transaction?.total.toLocaleString("id-ID")}
                </p>
              </div>
            </div>
            <button
              className={`px-4 py-3 text-lg tracking-wide w-full capitalize font-semibold rounded-full ${
                transaction?.status == "success"
                  ? "bg-green-700 text-white"
                  : "bg-red-700 text-white"
              }`}
            >
              Payment {transaction?.status}
            </button>
          </div>
        )}
        <div className="fixed bottom-6 lg:right-[140px] max-lg:right-24 z-50">
          <button
            onClick={openChat}
            className="relative bg-blue-400 hover:bg-blue-400 text-white p-2.5 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            <svg
              width="800px"
              height="800px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8"
            >
              <path
                d="M17 3.33782C15.5291 2.48697 13.8214 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22C17.5228 22 22 17.5228 22 12C22 10.1786 21.513 8.47087 20.6622 7"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M8 12H8.009M11.991 12H12M15.991 12H16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {!isChatOpen && hasUnreadMessages && (
              <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-white border border-white rounded-full animate-ping"></span>
            )}
          </button>
          {isChatOpen && (
            <div className="mt-4 w-80 bg-white border border-blue-400 rounded-2xl shadow-xl overflow-hidden animate-fade-in">
              <div className="bg-blue-400 text-white px-4 py-3 font-semibold flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-8 h-8 text-xs rounded-full flex items-center justify-center ${
                      theme === "dark"
                        ? "text-blue-400 bg-white"
                        : "text-white bg-blue-400"
                    }`}
                  >
                    {product?.seller?.name
                      ? product?.seller.name
                          .split(" ")
                          .map((word) => word.charAt(0))
                          .join("")
                          .toUpperCase()
                      : "?"}
                  </span>
                  <p className="text-white font-semibold">
                    {product?.seller?.name}
                  </p>
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
              <div className="p-4 space-y-3 text-sm">
                <div className="items-center gap-3 mb-2 border-[1.5px] p-2 flex border-blue-400 rounded-2xl">
                  <Image
                    src={
                      product?.image?.[0]
                        ? product.image[0]
                        : "/images/default-product.png"
                    }
                    alt="product?.id"
                    width={100}
                    height={100}
                    className="h-16 w-16 object-cover rounded-2xl"
                  />
                  <div className="">
                    <p className="text-blue-400 text-base font-semibold">
                      {product?.name}
                    </p>
                    <p className="text-blue-400 text-sm">
                      Rp {product?.price.toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded-lg w-fit ${
                        msg.sender_id === userId
                          ? "text-white bg-blue-400 self-end ml-auto text-right"
                          : "text-gray-700 bg-gray-300"
                      }`}
                    >
                      {msg.message}
                    </div>
                  ))}
                </div>
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
                    className="grow px-3 py-2 text-sm text-blue-400 border rounded-lg focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="text-white bg-blue-400 px-3 py-2 rounded-lg text-sm hover:bg-blue-400"
                  >
                    Kirim
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
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
    </>
  );
}
