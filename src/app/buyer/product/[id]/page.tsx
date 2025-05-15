"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

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
  phone_number: string;
  role: string;
  image: string[];
  description: string;
  price: number;
  status: string;
  user_id: number;
  used_duration: string;
  original_price: number;
  seller?: { name: string };
  user?: {
    subdistrict: string;
    ward: string;
    regency: string;
    province: string;
  };
};

export default function ProductDetail() {
  const router = useRouter();
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
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
    if (!userId || !opponentId || !productId) return;

    try {
      const res = await fetch(
        `http://127.0.0.1:1031/api/v1/chats/product/${productId}/${userId}/${opponentId}`
      );
      const data = await res.json();

      if (res.ok) {
        const chatMessages = Array.isArray(data.chats) ? data.chats : []; // atau sesuaikan dengan struktur yang benar
        const unreadChat = chatMessages.find(
          (msg: Chat) => msg.receiver_id === userId && msg.read_status === "0"
        );

        console.log("Fetched chat messages:", chatMessages);

        if (unreadChat) {
          await fetch(
            `http://127.0.0.1:1031/api/v1/chats/${unreadChat.id}/read`,
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
        setSelectedChat(chatMessages[0] || null);
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
    if (!newMessage || !productId || !userId || !product?.user_id) return;

    const receiver_id = product.user_id;

    try {
      const response = await fetch(
        `http://127.0.0.1:1031/api/v1/send/${productId}/${userId}/${receiver_id}`,
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
        setNewMessage("");
        localStorage.setItem("messages", JSON.stringify(updatedMessages));
      } else {
        console.error("Failed to send message:", data.message);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const [favorites, setFavorites] = useState<number[]>([]);
  const [favoritesLoading, setFavoritesLoading] = useState(true);

  const fetchFavorites = async () => {
    const userId = localStorage.getItem("id");
    const token = localStorage.getItem("token");

    if (!userId || isNaN(Number(userId))) return;

    try {
      const response = await fetch(
        `http://127.0.0.1:1031/api/v1/favorite/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();

      if (response.ok && data && data.data) {
        console.log("Data favorit diterima:", data.data);

        // Ambil ID produk dari objek product di dalam masing-masing item
        const favoriteIds = data.data
          .map((item: any) => Number(item.product?.id)) // pastikan number
          .filter(Boolean);

        console.log("Favorite IDs:", favoriteIds);
        setFavorites(favoriteIds);
        localStorage.setItem("favorites", JSON.stringify(favoriteIds));
      } else {
        console.error("Gagal mengambil data favorit atau data tidak valid.");
        setFavorites([]);
      }
    } catch (error) {
      console.error("Fetch favorite error:", error);
      setFavorites([]);
    } finally {
      setFavoritesLoading(false);
    }
  };

  useEffect(() => {
    const savedFavorites = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    );
    const validFavorites = savedFavorites
      .filter(Boolean)
      .map((id: any) => Number(id)); // pastikan number
    setFavorites(validFavorites);
  }, []);

  const handleAddFavorite = async (productId: number) => {
    const userId = localStorage.getItem("id");
    const token = localStorage.getItem("token");

    if (!userId || isNaN(Number(userId)))
      return alert("User belum login atau ID tidak valid.");

    const userIdNumber = parseInt(userId, 10);
    const isFavorited = favorites.includes(productId);

    try {
      if (isFavorited) {
        const response = await fetch(
          "http://127.0.0.1:1031/api/v1/favorite/delete",
          {
            method: "DELETE", // ⚠️ gunakan POST bukan DELETE
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ user_id: userIdNumber, item_id: productId }),
          }
        );

        if (response.ok) {
          const updatedFavorites = favorites.filter((id) => id !== productId);
          setFavorites(updatedFavorites);
          localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
          setSuccessMessage("Produk berhasil dihapus dari favorit!");
          setShowSuccessPopup(true);
        } else {
          setErrorMessage("Gagal menghapus produk dari favorit.");
          setShowErrorPopup(true);
        }
      } else {
        const response = await fetch(
          "http://127.0.0.1:1031/api/v1/favorite/create",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ user_id: userIdNumber, item_id: productId }),
          }
        );

        if (response.ok) {
          const updatedFavorites = [...favorites, productId];
          setFavorites(updatedFavorites);
          localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
          setSuccessMessage("Produk berhasil ditambahkan ke favorit!");
          setShowSuccessPopup(true);
        } else {
          setErrorMessage("Gagal menambahkan produk ke favorit.");
          setShowErrorPopup(true);
        }
      }
    } catch (error) {
      console.error("Favorit error:", error);
      setErrorMessage("Terjadi kesalahan saat mengubah status favorit.");
      setShowErrorPopup(true);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);
  const handleClosePopup = () => {
    setShowErrorPopup(false);
  };
  const handleCloseSuccessPopup = async () => {
    setShowSuccessPopup(false);
    await fetchFavorites(); // Perbarui data favorit
    router.push("/buyer/favorite");
  };
  useEffect(() => {
    const refreshFavorites = () => {
      fetchFavorites();
    };

    window.addEventListener("focus", refreshFavorites); // <-- ini penting

    return () => {
      window.removeEventListener("focus", refreshFavorites);
    };
  }, []);

  useEffect(() => {
    console.log("Favorites updated:", favorites);
  }, [favorites]);
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="bg-[#080B2A] min-h-screen flex items-center justify-center md:px-20 max-lg:p-6">
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black/55 flex items-center justify-center z-50">
          <div className="bg-[#080B2A] border-blue-400 border z-50 rounded-lg py-8 px-14 shadow-lg text-center">
            <div className="flex justify-center mb-4">
              <Image
                src="/images/succes.svg"
                width={80}
                height={80}
                alt="Success"
                className="w-20 h-20"
              />
            </div>
            <h2 className="text-2xl font-bold mb-1 text-blue-400">Success!</h2>
            <p className="mb-6 text-blue-400">{successMessage}</p>
            <button
              onClick={handleCloseSuccessPopup}
              className="bg-blue-400 hover:bg-blue-500 text-white font-semibold py-2 px-6 rounded-full"
            >
              OK
            </button>
          </div>
        </div>
      )}
      {showErrorPopup && (
        <div className="fixed inset-0 bg-black/55 flex items-center justify-center z-50">
          <div className="bg-[#080B2A] border-red-400 border rounded-lg py-8 px-14 shadow-lg text-center">
            <div className="flex justify-center mb-4">
              <Image
                src="/images/error.svg"
                width={80}
                height={80}
                alt="Error"
                className="w-20 h-20"
              />
            </div>
            <h2 className="text-2xl font-bold mb-1 text-red-400">Error!</h2>
            <p className="mb-6 text-red-400">{errorMessage}</p>
            <button
              onClick={handleClosePopup}
              className="bg-red-400 hover:bg-red-500 text-white font-semibold py-2 px-6 rounded-full"
            >
              OK
            </button>
          </div>
        </div>
      )}
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
        className="w-4 absolute top-20 left-56 max-lg:hidden -z-0"
      />
      <Image
        width={100}
        height={100}
        alt=""
        src="/images/Star-1.svg"
        className="w-4 absolute top-10 max-lg:hidden left-80 -z-0"
      />
      <div className="md:flex md:gap-10 max-lg:gap-4">
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
          <div className="grid grid-cols-5 gap-4 md:mt-6 max-lg:mt-4">
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
          <div className="block relative h-full">
            <h3 className="text-white text-xl mb-2 font-bold tracking-wide">
              {product?.name}
            </h3>
            <p className="mb-2">
              {product?.user?.ward
                ?.toLowerCase()
                .replace(/\b\w/g, (c) => c.toUpperCase())}
              ,{" "}
              {product?.user?.subdistrict
                ?.toLowerCase()
                .replace(/\b\w/g, (c) => c.toUpperCase())}
              ,{" "}
              {product?.user?.regency
                ?.toLowerCase()
                .replace(/\b\w/g, (c) => c.toUpperCase())}
              ,{" "}
              {product?.user?.province
                ?.toLowerCase()
                .replace(/\b\w/g, (c) => c.toUpperCase())}
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
            <p className="text-base mb-5 max-lg:text-justify">
              {product?.description}
            </p>
            <div className="text-lg text-blue-400 max-lg:mb-4 md:absolute md:bottom-0 md:left-0">
              <p>Lama Penggunaan :</p>
              <p> {product?.used_duration}</p>
            </div>
            <div className="text-lg text-blue-400 md:absolute md:bottom-0 md:right-0">
              <p>Harga Asli :</p>
              <p> Rp {product?.original_price.toLocaleString("id-ID")}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="fixed bottom-24 right-6 z-50">
        <button
          onClick={openChat}
          className="relative bg-blue-400 hover:bg-blue-400 text-white p-4 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          <Image
            width={100}
            height={100}
            alt=""
            src="/images/chat.svg"
            className="w-8 h-8"
          />
          {messages.some(
            (msg) => msg.read_status === "0" && msg.receiver_id === userId
          ) && (
            <span className="absolute top-0 right-0 -mt-1 -mr-1 w-5 h-5 text-xs text-white bg-red-600 rounded-full flex items-center justify-center animate-ping">
              !
            </span>
          )}
        </button>

        {isChatOpen && (
          <div className="mt-4 w-80 bg-white border border-blue-400 rounded-2xl shadow-xl overflow-hidden animate-fade-in">
            <div className="bg-blue-400 text-white px-4 py-3 font-semibold flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 text-xs text-blue-400 bg-white rounded-full flex items-center justify-center">
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
              {/* Gambar produk (tidak ikut scroll) */}
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

              {/* Chat messages (scrollable) */}
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
                  className="flex-grow px-3 py-2 text-sm text-blue-400 border rounded-lg focus:outline-none"
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
      <div className="bg-blue-400 h-20 w-full fixed bottom-0 flex justify-between items-center md:px-20 py-4 max-lg:px-6">
        <p className="text-base font-bold">
          Rp {product?.price.toLocaleString("id-ID")}
        </p>
        <div className="flex items-center gap-4">
          <button
            className="z-50"
            onClick={() => {
              if (product?.id) {
                handleAddFavorite(product.id);
              } else {
                console.error("Product ID is missing");
              }
            }}
            aria-label={
              favorites.includes(Number(product?.id))
                ? "Hapus dari favorit"
                : "Tambahkan ke favorit"
            }
          >
            <Image
              src={
                favorites.includes(Number(product?.id))
                  ? "/images/heart-remove.svg"
                  : "/images/heart-add.svg"
              }
              width={32}
              height={32}
              alt={
                favorites.includes(Number(product?.id))
                  ? "Produk difavoritkan"
                  : "Produk belum difavoritkan"
              }
              className="w-8 h-8 hover:scale-110 transition"
            />
          </button>

          <Link
            href=""
            className="bg-blue-400 border-2 border-white rounded-full max-lg:px-8 md: px-14 max-lg:py-2 md:py-3 text-center text-white hover:bg-transparent z-50"
          >
            Beli
          </Link>
        </div>
      </div>
    </div>
  );
}
