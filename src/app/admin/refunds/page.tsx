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

export default function Products() {
  const router = useRouter();
  const [refunds, setRefunds] = useState<RefundDisplay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRefund, setSelectedRefund] = useState<RefundDisplay | null>(
    null
  );
  const [newStatus, setNewStatus] = useState("");
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
      item.seller_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
    switch (status?.toLowerCase()) {
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

  useEffect(() => {
    if (isModalOpen && selectedRefund) {
      setNewStatus(selectedRefund.status); // ← ini isi dari backend, bukan "pending" sembarang
    }
  }, [isModalOpen, selectedRefund]);

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
              <th className="px-3 py-3 text-center">Image</th>
              <th className="px-3 py-3 text-left">Product Name</th>
              <th className="px-3 py-3 text-left">Buyer</th>
              <th className="px-3 py-3 text-left">Seller</th>
              <th className="px-3 py-3 text-center">Status Refund</th>
              <th className="px-3 py-3 text-center">Courier</th>
              <th className="px-3 py-3 text-center">No.Resi</th>
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

                <td className="px-3 py-4 text-white text-center">
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
                    {item.status || "-"}
                  </span>
                </td>

                <td className="px-3 py-4 text-white text-center capitalize">
                  {item.courir || "-"}
                </td>

                <td className="px-3 py-4 text-white text-center">
                  {item.tracking_number || "-"}
                </td>

                <td className="px-3 py-4 text-center">
                  <span
                    className={`px-4 py-2 text-sm tracking-wide capitalize rounded-full ${getStatusColor(
                      item.status_package
                    )} text-white`}
                  >
                    {item.status_package || "-"}
                  </span>
                </td>

                <td className="px-3 py-4 text-white text-center">
                  <button
                    onClick={() => {
                      setSelectedRefund(item);
                      setNewStatus(item.status);
                      setIsModalOpen(true);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-md text-sm"
                  >
                    Update
                  </button>
                </td>
                {isModalOpen && selectedRefund && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                    <div className="bg-[#060B26] rounded-lg shadow-lg p-6 w-full max-w-md">
                      <h2 className="text-lg font-semibold mb-4 text-gray-800">
                        Update Refund Status
                      </h2>

                      <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                        className="w-full border rounded p-2 mb-4"
                      >
                        <option value="requested">Requested</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="shipping">Shipping</option>
                        <option value="refunded">Refunded</option>
                      </select>

                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => setIsModalOpen(false)}
                          className="px-4 py-2 rounded bg-gray-300 text-gray-800 hover:bg-gray-400"
                        >
                          Cancel
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
                                  body: JSON.stringify({ status: newStatus }),
                                }
                              );

                              if (!res.ok) throw new Error("Failed to update");

                              // Sukses: Tutup modal & refresh data
                              setIsModalOpen(false);
                              fetchRefunds(); // pastikan ini fungsi yang me-refresh data refund
                            } catch (error) {
                              console.error("Failed to update refund:", error);
                              alert("Update gagal. Coba lagi.");
                            }
                          }}
                          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                )}
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
