"use client";

import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type RefundApiResponse = {
  result: Refund[];
};
type Refund = {
  id: number;
  transaction_id: number;
  reason: string;
  status: string;
  response: string | null;
  image: string[];
  refunded_at: string;
  tracking_number: string;
  status_package: string;
  courir: string;
  created_at: string;
  updated_at: string;
  Transaction?: {
    item?: { name: string };
    buyer?: { name: string };
    seller?: { name: string };
  };
  item?: { name: string };
  buyer?: { name: string };
  seller?: { name: string };
};

type RefundDisplay = Refund & {
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

export default function Products() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const [refunds, setRefunds] = useState<RefundDisplay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedRefund, setSelectedRefund] = useState<RefundDisplay | null>(
    null
  );
  const [newStatus, setNewStatus] = useState("");
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [trackingData, setTrackingData] = useState<TrackingDataType | null>(
    null
  );
  const [dateString, setDateString] = useState({
    day: "",
    fullDate: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const filteredTransactions = refunds.filter(
    (item) =>
      item.item_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.buyer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.seller_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.courir?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.status?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.status_package?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const handleTrackPackageRefund = async () => {
    if (!selectedRefund) return;

    try {
      const courir = selectedRefund.courir?.toLowerCase();
      const awb = selectedRefund.tracking_number;

      if (!courir || !awb) {
        alert("Data ekspedisi tidak lengkap.");
        return;
      }

      const courierMap: Record<string, string> = {
        jne: "jne",
        jnt: "jnt",
        sicepat: "sicepat",
        "si cepat": "sicepat",
      };

      const courierParam = courierMap[courir];
      if (!courierParam) {
        alert("Kurir tidak dikenali.");
        return;
      }

      const res = await fetch(
        `https://api.binderbyte.com/v1/track?api_key=23ef9d28f62d15ac694e6d87d2c384549e7ba507f87f85ae933cbe93ada1fe3d&courier=${courierParam}&awb=${awb}`
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
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/auth/login");
    } else {
      setIsLoading(false);
    }
  }, [router]);

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

  const fetchRefunds = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token not found");

      const response = await fetch(
        "https://backend-leftoverz-production.up.railway.app/api/v1/refunds",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data: RefundApiResponse = await response.json();
      console.log("Raw data dari backend:", data);

      const mappedRefunds: RefundDisplay[] = data.result.map((refund) => {
        let parsedImage: string[] = [];

        if (typeof refund.image === "string") {
          try {
            const parsed = JSON.parse(refund.image);
            if (Array.isArray(parsed)) {
              parsedImage = parsed;
            }
          } catch {
            parsedImage = [];
          }
        } else if (Array.isArray(refund.image)) {
          parsedImage = refund.image;
        }
        return {
          ...refund,
          item_name:
            refund.Transaction?.item?.name || refund.item?.name || "Unknown",
          buyer_name:
            refund.Transaction?.buyer?.name || refund.buyer?.name || "Unknown",
          seller_name:
            refund.Transaction?.seller?.name ||
            refund.seller?.name ||
            "Unknown",
          image: parsedImage,
        };
      });

      setRefunds(mappedRefunds);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error fetching refunds:", error.message);
      } else {
        console.error("Unknown error fetching refunds");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRefunds();
  }, []);

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-[#060B26] flex justify-center items-center text-white">
        <div className="spinner"></div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-[#060B26] text-white px-6 py-6 relative">
      <Image
        width={100}
        height={100}
        alt="Admin"
        src="/images/admin.png"
        className="w-full absolute right-0 top-0 h-full mb-0"
      />
      <div className="flex justify-between items-center mb-7 relative z-20">
        <h1 className="text-3xl font-bold">Pengembalian Barang</h1>
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
              Selamat datang kembali! Kelola dashboard dengan mudah di sini
            </p>
            <Link
              href="/admin/"
              className="mt-4 text-white text-sm flex items-center gap-2"
            >
              Ketuk untuk ke dashboard →
            </Link>
          </div>
          <div className="z-10">
            <Image
              src="/images/buy.png"
              alt="Welcome"
              width={300}
              height={300}
              className="rounded-lg absolute right-0 h-56 w-56 -top-10"
            />
          </div>
        </div>
      </div>

      <div
        className="relative w-full rounded-lg"
        style={{
          background:
            "linear-gradient(to bottom right, rgba(6, 11, 38, 0.74), rgba(26, 31, 55, 0.5))",
        }}
      >
        <div className="px-6 pt-5 pb-8 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold">Daftar Pengembalian Barang</h3>
            <p>Daftar semua Pengembalian Barang</p>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <input
                type="text"
                placeholder="Cari..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 rounded text-white placeholder-gray-400 bg-transparent focus:outline-none"
              />
              <Search
                className="absolute top-2.5 right-3 text-gray-400"
                size={18}
              />
            </div>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="min-w-max w-full rounded-lg my-4 overflow-hidden">
            <thead className="text-white text-md">
              <tr className="border-b-2 border-[#56577A]">
                <th className="px-3 py-3 text-center">No.</th>
                <th className="px-3 py-3 text-center">Gambar</th>
                <th className="px-3 py-3 text-left">Nama Produk</th>
                <th className="px-3 py-3 text-left">Pembeli</th>
                <th className="px-3 py-3 text-left">Penjual</th>
                <th className="px-3 py-3 text-center">Kurir</th>
                <th className="px-3 py-3 text-center">No.Resi</th>
                <th className="px-3 py-3 text-center">Status Refund</th>
                <th className="px-3 py-3 text-center">Status Pengiriman</th>
                <th className="px-3 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTransactions.map((item, index) => (
                <tr
                  key={item.id}
                  className="transition border-b border-[#56577A]"
                >
                  <td className="px-3 py-4 text-white text-center">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>

                  <td className="px-3 py-4 text-white text-center flex justify-center">
                    <Image
                      src={
                        item.image &&
                        Array.isArray(item.image) &&
                        item.image.length > 0 &&
                        typeof item.image[0] === "string"
                          ? item.image[0].startsWith("/")
                            ? `https://backend-leftoverz-production.up.railway.app${item.image[0]}`
                            : item.image[0]
                          : "/images/default-item.png"
                      }
                      alt={item.item_name}
                      width={100}
                      height={100}
                      className="w-16 h-16 object-cover rounded-2xl"
                    />
                  </td>

                  <td className="px-3 py-4 text-white text-left">
                    {item.item_name}
                  </td>

                  <td className="px-3 py-4 text-white text-left">
                    {item.buyer_name?.length > 25
                      ? item.buyer_name.slice(0, 25) + "..."
                      : item.buyer_name}
                  </td>

                  <td className="px-3 py-4 text-white text-left">
                    {item.seller_name}
                  </td>

                  <td className="px-3 py-4 text-white text-center capitalize">
                    {item.courir || "-"}
                  </td>

                  <td className="px-3 py-4 text-white text-center">
                    {item.tracking_number || "-"}
                  </td>
                  <td className="px-6 py-3 text-center capitalize">
                    <span
                      className={`px-3 py-2 rounded-full text-sm font-semibold ${
                        item.status === "requested"
                          ? "bg-yellow-100 text-yellow-600"
                          : item.status === "approved"
                          ? "bg-green-100 text-green-600"
                          : item.status === "rejected"
                          ? "bg-red-100 text-red-600"
                          : item.status === "refunded"
                          ? "bg-blue-100 text-blue-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {item.status === "requested"
                        ? "Pengajuan"
                        : item.status === "approved"
                        ? "Disetujui"
                        : item.status === "rejected"
                        ? "Ditolak"
                        : item.status === "refunded"
                        ? "Berhasil"
                        : item.status === "shipping"
                        ? "Pengiriman"
                        : item.status || "-"}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-center capitalize">
                    <span
                      className={`px-3 py-2 rounded-full text-sm font-semibold ${
                        item.status_package === "processed"
                          ? "bg-yellow-100 text-yellow-600"
                          : item.status_package === "delivered"
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {item.status_package === "processed"
                        ? "Dikirim"
                        : item.status_package === "delivered"
                        ? "Diterima"
                        : item.status_package || "Pending"}
                    </span>
                  </td>

                  <td className="px-3 py-4 text-white text-center align-middle">
                    <div className="flex items-center justify-center gap-2">
                      {item.status === "shipping" ||
                        (item.status === "refunded" && (
                          <button
                            onClick={() => {
                              setSelectedRefund(item);
                              handleTrackPackageRefund();
                            }}
                            className="px-1.5 py-1.5 bg-blue-400 text-white rounded hover:bg-blue-500"
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
                        ))}
                      {showTrackingModal && trackingData && (
                        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center text-left">
                          <div
                            className={`w-full max-w-3xl p-6 rounded-xl shadow-xl overflow-y-auto max-h-[90vh] relative scrollbar-hidden border-2 border-blue-400 bg-[#080B2A]`}
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
                              Informasi Pengiriman Paket
                            </h2>

                            <div className={`mb-4 text-white`}>
                              <p>
                                <strong className="tracking-wider">
                                  No.Resi:
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
                                  Tanggal:
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

                            <div className={`mb-4 text-white`}>
                              <p>
                                <strong className="tracking-wider">
                                  Dari:
                                </strong>{" "}
                                {trackingData.detail.origin || "-"}
                              </p>
                              <p>
                                <strong className="tracking-wider">
                                  Tujuan:
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
                                  className={`space-y-6 rounded-lg border border-blue-400 p-6 shadow-sm bg-white/10`}
                                >
                                  <h3
                                    className={`text-xl font-semibold text-white`}
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
                                              ? "text-primary-500"
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
                                            className={`mb-0.5 text-base font-semibold text-white`}
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
                      <button
                        onClick={() => {
                          setSelectedRefund(item);
                          setNewStatus(item.status);
                          setIsModalOpen(true);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 px-2 py-2 rounded-md text-sm"
                      >
                        <svg
                          className="w-4 h-4"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M18 5V4a1 1 0 0 0-1-1H8.914a1 1 0 0 0-.707.293L4.293 7.207A1 1 0 0 0 4 7.914V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5M9 3v4a1 1 0 0 1-1 1H4m11.383.772 2.745 2.746m1.215-3.906a2.089 2.089 0 0 1 0 2.953l-6.65 6.646L9 17.95l.739-3.692 6.646-6.646a2.087 2.087 0 0 1 2.958 0Z"
                          />
                        </svg>
                      </button>
                      {isModalOpen && selectedRefund && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                          <div className="bg-[#060B26] border border-blue-400 rounded-lg shadow-lg p-6 w-full max-w-md">
                            <h2 className="text-lg font-semibold mb-4 text-white">
                              Perbarui Status Pengembalian Barang
                            </h2>

                            <select
                              value={newStatus}
                              onChange={(e) => setNewStatus(e.target.value)}
                              className="w-full border rounded p-2 mb-4"
                            >
                              <option
                                className="text-blue-400"
                                value="refunded"
                              >
                                Dana Dikembalikan
                              </option>
                            </select>

                            <div className="flex justify-end gap-3">
                              <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 rounded bg-gray-300 text-gray-800 hover:bg-gray-400"
                              >
                                Batal
                              </button>
                              <button
                                onClick={async () => {
                                  try {
                                    const token = localStorage.getItem("token");
                                    const res = await fetch(
                                      `https://backend-leftoverz-production.up.railway.app/api/v1/refund/${selectedRefund.id}`,
                                      {
                                        method: "PUT",
                                        headers: {
                                          "Content-Type": "application/json",
                                          Authorization: `Bearer ${token}`,
                                        },
                                        body: JSON.stringify({
                                          status: newStatus,
                                        }),
                                      }
                                    );

                                    if (!res.ok)
                                      throw new Error("Failed to update");
                                    setIsModalOpen(false);
                                    fetchRefunds();
                                  } catch (error) {
                                    console.error(
                                      "Failed to update refund:",
                                      error
                                    );
                                    alert("Update gagal. Coba lagi.");
                                  }
                                }}
                                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                              >
                                Simpan
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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
