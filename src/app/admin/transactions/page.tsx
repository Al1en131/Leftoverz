"use client";

import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type RawTransaction = {
  id: number;
  buyer_id: number;
  seller_id: number;
  item_id: number;
  payment_method: "COD" | "e-wallet" | "bank transfer";
  status: "pending" | "paid" | "cancelled" | null;
  created_at: string;
  awb: string;
  courir: string;
  total: number;
  status_package: string;
  item?: {
    name: string;
    image: string[];
    price: number;
  };
  buyer?: { name: string };
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

export default function Products() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateString, setDateString] = useState({
    day: "",
    fullDate: "",
  });
  const [selectedRefund, setSelectedRefund] = useState<Transaction | null>(
    null
  );
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [trackingData, setTrackingData] = useState<TrackingDataType | null>(
    null
  );
  const handleTrackPackageRefund = async () => {
    if (!selectedRefund) return;

    try {
      const courir = selectedRefund.courir?.toLowerCase();
      const awb = selectedRefund.awb;

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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const filteredTransactions = transactions.filter(
    (item) =>
      item.item_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.buyer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.seller_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusPackageColor = (status_package: string | null) => {
    switch (status_package?.toLowerCase()) {
      case "pending":
        return "bg-yellow-500";
      case "approved":
        return "bg-green-500";
      case "rejected":
        return "bg-red-500";
      case "delivered":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
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

    const day = now.toLocaleDateString("en-US", optionsDay);
    const fullDate = now.toLocaleDateString("en-GB", optionsDate);

    setDateString({ day, fullDate });
  }, []);

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case "success":
        return "bg-green-700";
      case "capture":
        return "bg-yellow-500";
      case "failed":
        return "bg-red-700";
      default:
        return "bg-gray-500";
    }
  };

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token not found");

      const response = await fetch(
        "https://backend-leftoverz-production.up.railway.app/api/v1/transactions",
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
        throw new Error(errorData.message || "Failed to fetch transactions");
      }

      const data: { transactions: RawTransaction[] } = await response.json();

      const mappedTransactions: Transaction[] = data.transactions.map(
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
            price: transaction.item?.price,
            buyer_name: transaction.buyer?.name || "Unknown",
            seller_name: transaction.seller?.name || "Unknown",
            image: imageArray,
          };
        }
      );

      setTransactions(mappedTransactions);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error fetching transactions:", error.message);
      } else {
        console.error("An unknown error occurred:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
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
        <h1 className="text-3xl font-bold">Transactions</h1>
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
            <h2 className="text-xl font-semibold mb-1">Superadmin Leftoverz</h2>
            <p className="text-sm text-gray-300">
              Glad to see you again! Ask me anything.
            </p>
            <Link
              href="/admin/"
              className="mt-4 text-white text-sm flex items-center gap-2"
            >
              Tap to dashboard →
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
        className="relative overflow-x-auto rounded-lg"
        style={{
          background:
            "linear-gradient(to bottom right, rgba(6, 11, 38, 0.74), rgba(26, 31, 55, 0.5))",
        }}
      >
        <div className="px-6 pt-5 pb-8 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold">Transaction List</h3>
            <p>List of all transactions</p>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <input
                type="text"
                placeholder="Search..."
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

        <table className="w-full rounded-lg my-4 max-lg:px-6 overflow-hidden">
          <thead className="text-white text-md">
            <tr className="border-b-2 border-[#56577A]">
              <th className="px-3 py-3 text-center">No.</th>
              <th className="px-3 py-3 text-left">Product Name</th>
              <th className="px-3 py-3 text-left">Buyer</th>
              <th className="px-3 py-3 text-left">Seller</th>
              <th className="px-3 py-3 text-center">Payment Method</th>
              <th className="px-3 py-3 text-center">Price</th>
              <th className="px-3 py-3 text-center">Kurir</th>
              <th className="px-3 py-3 text-center">No. Resi</th>
              <th className="px-3 py-3 text-center">Status Payment</th>
              <th className="px-3 py-3 text-center">Status Package</th>
              <th className="px-3 py-3 text-center">Action</th>
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
                <td className="px-3 py-4 text-white text-left">
                  {item.item_name}
                </td>
                <td className="px-3 py-4 text-white text-left">
                  {item.buyer_name && item.buyer_name.length > 25
                    ? item.buyer_name.slice(0, 25) + "..."
                    : item.buyer_name}
                </td>
                <td className="px-3 py-4 text-white text-left">
                  {item.seller_name}
                </td>
                <td className="px-3 py-4 text-white capitalize text-center">
                  {item.payment_method
                    .split("_")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </td>
                <td className="px-3 py-4 text-white text-center">
                  Rp {item.total.toLocaleString("id-ID")}
                </td>
                <td className="px-3 py-4 capitalize text-white text-center">
                  {item.courir}
                </td>
                <td className="px-3 py-4 text-white text-center">
                  {item.awb || "-"}
                </td>
                <td className="px-3 py-4 text-center">
                  <span
                    className={`px-4 py-2 text-sm tracking-wide capitalize rounded-full ${getStatusColor(
                      item.status
                    )} text-white`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-3 py-4 text-center">
                  <span
                    className={`px-4 py-2 text-sm tracking-wide capitalize rounded-full ${getStatusPackageColor(
                      item.status_package
                    )} text-white`}
                  >
                    {item.status_package || "-"}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => {
                      setSelectedRefund(item);
                      handleTrackPackageRefund();
                    }}
                    className="mt-2 px-1.5 py-1.5 bg-blue-400 text-white rounded hover:bg-blue-500"
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
                          Tracking Information
                        </h2>

                        <div className={`mb-4 text-white`}>
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

                        <div className={`mb-4 text-white`}>
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
                            <strong className="tracking-wider">
                              Receiver:
                            </strong>{" "}
                            {trackingData.detail.receiver || "-"}
                          </p>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold text-blue-500 mb-2">
                            Tracking History
                          </h3>
                          <div className="mt-6 grow sm:mt-8 lg:mt-0">
                            <div
                              className={`space-y-6 rounded-lg border border-blue-400 p-6 shadow-sm bg-white/10`}
                            >
                              <h3
                                className={`text-xl font-semibold text-white`}
                              >
                                Tracking History
                              </h3>

                              <ol className="relative ms-3 border-s border-gray-500">
                                {trackingData?.history?.map((item, index) => (
                                  <li
                                    key={index}
                                    className={`mb-10 ms-6 ${
                                      index === 0 ? "text-primary-500" : ""
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
                                ))}
                              </ol>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ))}
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
            Prev
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
                : "bg-blue-700 hover:bg-blue-800"
            } text-white`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
