"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

type RawTransaction = {
  id: number;
  buyer_id: number;
  seller_id: number;
  item_id: number;
  payment_method: string;
  status_package: "delivered" | "processed" | "refund";
  status: "success" | null;
  created_at: string;
  total: number;
  awb: string;
  courir: string;
  item?: {
    name: string;
    image: string[];
    price: number;
  };
  buyer?: {
    name: string;
    ward: string;
    regency: string;
    subdistrict: string;
    province: string;
    address: string;
    postal_code: number;
    phone_number: number;
  };
  seller?: { name: string };
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

export default function Transaction() {
  const [searchQuery, setSearchQuery] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const { theme, setTheme } = useTheme();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [trackingData, setTrackingData] = useState<TrackingDataType | null>(
    null
  );
  const [showTrackingModal, setShowTrackingModal] = useState(false);

  const handleTrackPackage = async () => {
    if (!selectedTransaction) return;

    try {
      const courierRaw = selectedTransaction.courir;
      const awb = selectedTransaction.awb;

      if (!courierRaw || !awb) {
        alert("Data ekspedisi tidak lengkap.");
        return;
      }

      const courier = courierRaw.toLowerCase();

      let apiKey = "";
      let courierParam = courier;

      switch (courier) {
        case "jne":
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

  useEffect(() => {
    const storedUserId = localStorage.getItem("id");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const filteredTransactions = transactions.filter(
    (item) =>
      item.item_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.buyer_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const fetchTransactions = useCallback(async () => {
    try {
      if (!userId) return;

      const res = await fetch(
        `https://backend-leftoverz-production.up.railway.app/api/v1/transactions/user/${userId}`
      );
      const response: { transactions: RawTransaction[]; message: string } =
        await res.json();

      if (res.ok) {
        const mappedTransactions: Transaction[] = response.transactions.map(
          (transaction) => {
            const imageData = transaction.item?.image;
            let imageArray: string[] = [];

            if (typeof imageData === "string") {
              try {
                imageArray = JSON.parse(imageData);
              } catch {
                imageArray = [imageData];
              }
            } else if (Array.isArray(imageData)) {
              imageArray = imageData;
            }

            return {
              ...transaction,
              item_name: transaction.item?.name || "Unknown",
              price: transaction.item?.price || 0,
              buyer_name: transaction.buyer?.name || "Unknown",
              seller_name: transaction.seller?.name || "Unknown",
              image: imageArray,
            };
          }
        );

        setTransactions(mappedTransactions);
      } else {
        console.error("Fetch error:", response.message);
      }
    } catch (error) {
      console.error("Network error:", error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState<{
    id: number | null;
    awb: string;
    courir: string;
  }>({
    id: null,
    awb: "",
    courir: "",
  });

  const handleEditClick = (item: Transaction) => {
    setEditData({
      id: item.id,
      awb: item.awb || "",
      courir: item.courir || "",
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    try {
      const response = await fetch(
        `https://backend-leftoverz-production.up.railway.app/api/v1/transactions/${editData.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            awb: editData.awb,
            courir: editData.courir,
          }),
        }
      );

      if (!response.ok) throw new Error("Gagal update");

      setShowEditModal(false);
      fetchTransactions();
    } catch (error) {
      console.error("Update error:", error);
    }
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
          className="w-4 absolute top-28 right-8 -z-0"
        />
        <Image
          width={100}
          height={100}
          alt=""
          src="/images/Star-1.svg"
          className="w-4 absolute top-[400px] right-32 -z-0 max-lg:hidden"
        />
        <Image
          width={100}
          height={100}
          alt=""
          src="/images/Star-1.svg"
          className="w-4 absolute top-44 left-10 -z-0 max-lg:hidden"
        />
        <Image
          width={100}
          height={100}
          alt=""
          src="/images/Star-1.svg"
          className="w-4 absolute top-36 left-[550px] -z-0 max-lg:hidden"
        />
        <div
          className={`pt-28 pb-20 w-full lg:px-20 max-lg:px-6 flex flex-col items-center gap-6 relative ${
            theme === "dark" ? "bg-white/5" : "bg-black/5"
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
              } backdrop-blur-md rounded-2xl flex flex-col justify-center max-lg:p-6 lg:ps-20 gap-2 z-20`}
            >
              <h1 className="lg:text-6xl max-lg:text-4xl font-bold">
                Transaksi
              </h1>
              <p className="max-lg:text-base lg:text-lg max-w-3xl">
                Kelola dan pantau semua transaksi Anda dengan mudah di satu
                tempat. Dapatkan informasi terkini dan detail tentang setiap
                pembelian dan penjualan yang Anda lakukan melalui platform ini.
              </p>
            </div>
          </div>
        </div>

        <div className="py-10 lg:px-20 max-lg:px-6 flex justify-between items-center gap-4">
          <form className="w-full">
            <label className="mb-2 text-sm font-medium text-white sr-only">
              Cari
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3">
                <svg
                  className={`w-4 h-4 ${
                    theme === "dark" ? "text-white" : "text-blue-400"
                  }`}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="search"
                id="default-search"
                className={`block w-full p-4 ps-10 text-sm border border-blue-400 rounded-lg ${
                  theme === "dark"
                    ? "text-white bg-white/10"
                    : "text-blue-400 bg-black/5"
                }`}
                placeholder="Cari Data Transaksi"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </form>
        </div>

        <div className="relative w-full lg:px-20 max-lg:px-6 pb-10 rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-max w-full border border-blue-400 rounded-lg overflow-hidden">
              <thead
                className={`text-md ${
                  theme === "dark"
                    ? "bg-white/10 text-white"
                    : "bg-black/5 text-blue-400"
                }`}
              >
                <tr className="border-b">
                  <th className="px-6 py-3 text-center">Gambar</th>
                  <th className="px-6 py-3 text-left">Nama Produk</th>
                  <th className="px-6 py-3 text-left">Pembeli</th>
                  <th className="px-6 py-3 text-left">Alamat</th>
                  <th className="px-6 py-3 center">No. Hp</th>
                  <th className="px-6 py-3 text-center">Metode Pembayaran</th>
                  <th className="px-6 py-3 text-center">Harga</th>
                  <th className="px-6 py-3 text-center">Status Pembayaran</th>
                  <th className="px-6 py-3 text-center">Kurir</th>
                  <th className="px-6 py-3 text-center">No. Resi</th>
                  <th className="px-6 py-3 text-center">Status Paket</th>
                  <th className="px-6 py-3 text-center">Aksi</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center text-white py-8">
                      Loading...
                    </td>
                  </tr>
                ) : paginatedTransactions.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className={`text-center items-center justify-center lg:ps-64 py-8 ${
                        theme === "dark" ? "text-white" : "text-black"
                      }`}
                    >
                      Tidak ada data transaksi
                    </td>
                  </tr>
                ) : (
                  paginatedTransactions.map((item) => (
                    <tr
                      key={item.id}
                      className={`border-b transition ${
                        theme === "dark"
                          ? "bg-white/10 text-white"
                          : "bg-black/5 text-blue-400"
                      }`}
                    >
                      <td className="px-6 py-4 text-center flex justify-center">
                        <Image
                          src={
                            item.image &&
                            Array.isArray(item.image) &&
                            item.image.length > 0 &&
                            typeof item.image[0] === "string" &&
                            item.image[0].startsWith("/")
                              ? `https://backend-leftoverz-production.up.railway.app${item.image[0]}`
                              : "/images/default-item.png"
                          }
                          alt={item.item_name}
                          width={100}
                          height={100}
                          className="w-16 h-16 object-cover rounded-2xl"
                        />
                      </td>
                      <td
                        className={`px-6 py-4 text-left ${
                          theme === "dark" ? "text-white" : "text-blue-400"
                        }`}
                      >
                        {item.item?.name}
                      </td>
                      <td
                        className={`px-6 py-4 text-left ${
                          theme === "dark" ? "text-white" : "text-blue-400"
                        }`}
                      >
                        {item.buyer?.name}
                      </td>
                      <td
                        className={`px-6 py-4 text-left ${
                          theme === "dark" ? "text-white" : "text-blue-400"
                        }`}
                      >
                        {item.buyer?.address
                          ?.toLowerCase()
                          .replace(/\b\w/g, (c) => c.toUpperCase())}
                        ,{" "}
                        {item.buyer?.ward
                          ?.toLowerCase()
                          .replace(/\b\w/g, (c) => c.toUpperCase())}
                        ,{" "}
                        {item.buyer?.subdistrict
                          ?.toLowerCase()
                          .replace(/\b\w/g, (c) => c.toUpperCase())}
                        ,{" "}
                        {item.buyer?.regency
                          ?.toLowerCase()
                          .replace(/\b\w/g, (c) => c.toUpperCase())}
                        ,{" "}
                        {item.buyer?.province
                          ?.toLowerCase()
                          .replace(/\b\w/g, (c) => c.toUpperCase())}
                        ,{item.buyer?.postal_code}
                      </td>
                      <td
                        className={`px-6 py-4 text-center ${
                          theme === "dark" ? "text-white" : "text-blue-400"
                        }`}
                      >
                        {item.buyer?.phone_number}
                      </td>
                      <td
                        className={`px-6 py-4 text-center capitalize ${
                          theme === "dark" ? "text-white" : "text-blue-400"
                        }`}
                      >
                        {item.payment_method
                          ? item.payment_method
                              .split("_")
                              .map(
                                (word) =>
                                  word.charAt(0).toUpperCase() + word.slice(1)
                              )
                              .join(" ")
                          : "-"}
                      </td>

                      <td
                        className={`px-6 py-4 text-center ${
                          theme === "dark" ? "text-white" : "text-blue-400"
                        }`}
                      >
                        Rp. {item.total.toLocaleString("id-ID")}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`px-4 py-2 text-sm tracking-wide capitalize font-semibold rounded-full ${
                            item.status === "success"
                              ? "bg-green-700 text-white"
                              : "bg-red-700 text-white"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td
                        className={`px-6 py-4 text-center capitalize ${
                          theme === "dark" ? "text-white" : "text-blue-400"
                        }`}
                      >
                        {item.courir || "-"}
                      </td>
                      <td
                        className={`px-6 py-4 text-center ${
                          theme === "dark" ? "text-white" : "text-blue-400"
                        }`}
                      >
                        {item.awb || "-"}
                      </td>
                      <td
                        className={`px-6 py-4 text-center ${
                          theme === "dark" ? "text-white" : "text-blue-400"
                        }`}
                      >
                        <span
                          className={`px-4 py-2 text-sm tracking-wide capitalize font-semibold rounded-full ${
                            item.status_package === "delivered"
                              ? "bg-green-700 text-white"
                              : item.status_package === "processed"
                              ? "bg-blue-400 text-white"
                              : "bg-red-700 text-white"
                          }`}
                        >
                          {item.status_package}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center space-x-2">
                        <button
                          onClick={() => handleEditClick(item)}
                          className="inline-flex items-center justify-center px-1 py-1 text-sm font-bold text-white bg-blue-500 rounded-md shadow hover:bg-blue-600 transition"
                        >
                          <svg
                            className="w-4 h-4"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M18 5V4a1 1 0 0 0-1-1H8.914a1 1 0 0 0-.707.293L4.293 7.207A1 1 0 0 0 4 7.914V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5M9 3v4a1 1 0 0 1-1 1H4m11.383.772 2.745 2.746m1.215-3.906a2.089 2.089 0 0 1 0 2.953l-6.65 6.646L9 17.95l.739-3.692 6.646-6.646a2.087 2.087 0 0 1 2.958 0Z"
                            />
                          </svg>
                        </button>
                        {showEditModal && (
                          <div className="fixed inset-0 z-50 bg-black/20 flex items-center justify-center text-left">
                            <div
                              className={`w-full max-w-md rounded-xl shadow-xl relative border-2 p-6 ${
                                theme === "dark"
                                  ? "bg-[#080B2A] border-blue-400 text-white"
                                  : "bg-white border-blue-400 text-blue-400"
                              }`}
                            >
                              <button
                                className="absolute top-4 right-4 text-red-500 font-bold text-xl"
                                onClick={() => setShowEditModal(false)}
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

                              <h2 className="text-xl font-bold mb-4 text-blue-400">
                                Edit Transaksi
                              </h2>

                              <div className="space-y-4">
                                <div>
                                  <label className="block text-sm font-medium text-blue-400">
                                    Kurir
                                  </label>
                                  <select
                                    value={editData.courir}
                                    onChange={(e) =>
                                      setEditData({
                                        ...editData,
                                        courir: e.target.value,
                                      })
                                    }
                                    className="w-full mt-1 p-2 border text-blue-400 border-blue-400 bg-transparent rounded-md"
                                  >
                                    <option value="">Pilih Kurir</option>
                                    <option value="jnt">JNT</option>
                                    <option value="jne">JNE</option>
                                    <option value="si cepat">SiCepat</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-blue-400">
                                    No.resi
                                  </label>
                                  <input
                                    type="text"
                                    value={editData.awb}
                                    onChange={(e) =>
                                      setEditData({
                                        ...editData,
                                        awb: e.target.value,
                                      })
                                    }
                                    className="w-full mt-1 p-2 border bg-transparent border-blue-400 rounded-md"
                                  />
                                </div>
                                <div className="flex justify-end gap-2">
                                  <button
                                    onClick={() => setShowEditModal(false)}
                                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                                  >
                                    Batal
                                  </button>
                                  <button
                                    onClick={handleSaveEdit}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                  >
                                    Simpan
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        <button
                          onClick={() => {
                            setSelectedTransaction(item);
                            handleTrackPackage();
                          }}
                          className="inline-flex items-center justify-center px-1 py-1 text-sm font-bold text-white bg-blue-500 rounded-md shadow hover:bg-blue-600 transition"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-4 h-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                            />
                          </svg>
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
                                Informasi Pengiriman Barang
                              </h2>

                              <div
                                className={`mb-4 ${
                                  theme === "dark"
                                    ? "text-white"
                                    : "text-blue-400"
                                }`}
                              >
                                <p>
                                  <strong className="tracking-wider">
                                    No. Resi:
                                  </strong>{" "}
                                  {trackingData.summary.awb || "-"}
                                </p>
                                <p>
                                  <strong className="tracking-wider">
                                    Kurir:
                                  </strong>{" "}
                                  {trackingData.summary.courier || "-"}
                                </p>
                                <p>
                                  <strong className="tracking-wider">
                                    Status:
                                  </strong>{" "}
                                  {trackingData.summary.status || "-"}
                                </p>
                                <p>
                                  <strong className="tracking-wider">
                                    Tanggal
                                  </strong>{" "}
                                  {trackingData.summary.date || "-"}
                                </p>
                                <p>
                                  <strong className="tracking-wider">
                                    Berat:
                                  </strong>{" "}
                                  {trackingData.summary.weight || "-"}
                                </p>
                                <p>
                                  <strong className="tracking-wider">
                                    Biaya:
                                  </strong>{" "}
                                  Rp {trackingData.summary.amount || "-"}
                                </p>
                              </div>

                              <div
                                className={`mb-4 ${
                                  theme === "dark"
                                    ? "text-white"
                                    : "text-blue-400"
                                }`}
                              >
                                <p>
                                  <strong className="tracking-wider">
                                    Dari:
                                  </strong>{" "}
                                  {trackingData.detail.origin || "-"}
                                </p>
                                <p>
                                  <strong className="tracking-wider">
                                    Untuk:
                                  </strong>{" "}
                                  {trackingData.detail.destination || "-"}
                                </p>
                                <p>
                                  <strong className="tracking-wider">
                                    Pengirim:
                                  </strong>{" "}
                                  {trackingData.detail.shipper || "-"}
                                </p>
                                <p>
                                  <strong className="tracking-wider">
                                    Penerima:
                                  </strong>{" "}
                                  {trackingData.detail.receiver || "-"}
                                </p>
                              </div>

                              <div>
                                <h3 className="text-lg font-semibold text-blue-500 mb-2">
                                  Riwayat Pengiriman
                                </h3>
                                <div className="mt-6 grow sm:mt-8 lg:mt-0">
                                  <div
                                    className={`space-y-6 rounded-lg border border-blue-400 p-6 shadow-sm ${
                                      theme === "dark"
                                        ? "bg-white/10"
                                        : "bg-white"
                                    }`}
                                  >
                                    <h3
                                      className={`text-xl font-semibold ${
                                        theme === "dark"
                                          ? "text-white"
                                          : "text-gray-900"
                                      }`}
                                    >
                                      Riwayat Pengiriman
                                    </h3>

                                    <ol className="relative ms-3 border-s border-gray-500">
                                      {trackingData?.history?.map(
                                        (item, index) => (
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
                                                  : "bg-gray-600"
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
                                        )
                                      )}
                                    </ol>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="flex justify-center pt-4 my-4 gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded ${
                currentPage === 1
                  ? "bg-blue-400 text-gray-300 cursor-not-allowed"
                  : "bg-blue-400 hover:bg-blue-800"
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
                    : "bg-gray-700 text-gray-300 hover:bg-blue-400"
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
                  : "bg-blue-400 hover:bg-blue-500"
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
                  d="m8.25 4.5 7.5 7.5-7.5 7.5"
                />
              </svg>
            </button>
          </div>
        </div>
      </main>
      <button
        onClick={toggleTheme}
        aria-label="Toggle theme"
        title="Toggle theme"
        className={`fixed bottom-6 lg:right-20 max-md:right-8 z-30 p-3 rounded-full bg-blue-400 ${
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
