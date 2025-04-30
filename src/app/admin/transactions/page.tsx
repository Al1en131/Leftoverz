"use client";

import { Search } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

type RawTransaction = {
  id: number;
  buyer_id: number;
  seller_id: number;
  item_id: number;
  total_price: number;
  payment_method: "COD" | "e-wallet" | "bank transfer";
  status: "pending" | "paid" | "cancelled" | null;
  created_at: string;
  item?: { name: string };
  buyer?: { name: string };
  seller?: { name: string };
};

type Transaction = RawTransaction & {
  item_name: string;
  buyer_name: string;
  seller_name: string;
};

export default function Products() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
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

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case "paid":
        return "bg-green-700";
      case "pending":
        return "bg-yellow-500";
      case "cancelled":
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
        "http://127.0.0.1:1031/api/v1/transactions",
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
        (transaction) => ({
          ...transaction,
          item_name: transaction.item?.name || "Unknown",
          buyer_name: transaction.buyer?.name || "Unknown",
          seller_name: transaction.seller?.name || "Unknown",
        })
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060B26] flex justify-center items-center text-white">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060B26] text-white px-6 pt-6 relative">
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
            <h3 className="text-xl font-bold">Lorem Ipsum</h3>
            <p>Lorem Ipsum bla bla bla</p>
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
              <th className="px-6 py-3 text-center">Image</th>
              <th className="px-6 py-3 text-center">Product Name</th>
              <th className="px-6 py-3 text-center">Buyer</th>
              <th className="px-6 py-3 text-center">Seller</th>
              <th className="px-6 py-3 text-center">Payment Method</th>
              <th className="px-6 py-3 text-center">Price</th>
              <th className="px-6 py-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((item, index) => (
              <tr
                key={item.id}
                className="transition border-b border-[#56577A]"
              >
                <td className="px-6 py-4 text-white text-center">
                  {index + 1}
                </td>
                <td className="px-6 py-4 text-white text-center justify-center flex">
                  <Image
                    src={`/images/product_${item.item_id}.png`}
                    alt="product"
                    width={40}
                    height={40}
                  />
                </td>
                <td className="px-6 py-4 text-white text-center">
                  {item.item_name}
                </td>
                <td className="px-6 py-4 text-white text-center">
                  {item.buyer_name}
                </td>
                <td className="px-6 py-4 text-white text-center">
                  {item.seller_name}
                </td>
                <td className="px-6 py-4 text-white text-center">
                  {item.payment_method}
                </td>
                <td className="px-6 py-4 text-white text-center">
                  Rp {item.total_price.toLocaleString("id-ID")}
                </td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`px-4 py-2 text-sm tracking-wide font-semibold rounded-full ${getStatusColor(
                      item.status
                    )} text-white`}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
