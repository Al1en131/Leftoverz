"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type RawTransaction = {
  id: number;
  buyer_id: number;
  seller_id: number;
  item_id: number;
  payment_method: "COD" | "e-wallet" | "bank transfer";
  status: "pending" | "paid" | "cancelled" | null;
  created_at: string;
  item?: {
    name: string;
    image: string[]; // Tambahkan ini
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
export default function Transaction() {
  const [userId, setUserId] = useState<string | null>(null);
  useEffect(() => {
    const storedUserId = localStorage.getItem("id");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        if (!userId) return;

        const res = await fetch(
          `http://127.0.0.1:1031/api/v1/transactions/user/${userId}`
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
                price : transaction.item?.price || 0,
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
    };

    fetchTransactions();
  }, [userId]);

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
          className="w-4 absolute top-28 right-8 -z-0"
        />
        <Image
          width={100}
          height={100}
          alt=""
          src="/images/Star-1.svg"
          className="w-4 absolute top-[400px] right-32 -z-0"
        />
        <Image
          width={100}
          height={100}
          alt=""
          src="/images/Star-1.svg"
          className="w-4 absolute top-44 left-10 -z-0"
        />
        <Image
          width={100}
          height={100}
          alt=""
          src="/images/Star-1.svg"
          className="w-4 absolute top-36 left-[550px] -z-0"
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
              <h1 className="lg:text-6xl max-lg:text-4xl font-bold">
                Transaction
              </h1>
              <p className="max-lg:text-base md:text-lg max-w-3xl">
                Contrary to popular belief, Lorem Ipsum is not simply random
                text. It has roots in a piece of classical Latin literature from
                45 BC, making it over 2000 years old.
              </p>
            </div>
          </div>
        </div>

        <div className="py-10 lg:px-20 max-lg:px-6 flex justify-between items-center gap-4">
          <form className="w-full">
            <label className="mb-2 text-sm font-medium text-white sr-only">
              Search
            </label>
            <div className="relative">
              {/* Search Icon */}
              <div className="absolute inset-y-0 start-0 flex items-center ps-3">
                <svg
                  className="w-4 h-4 text-white"
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
              {/* Search Input */}
              <input
                type="search"
                id="default-search"
                className="block w-full p-4 ps-10 text-sm text-white border border-blue-400 rounded-lg bg-white/10"
                placeholder="Search Mockups, Logos..."
                required
              />
            </div>
          </form>
        </div>

        <div className="relative overflow-x-auto lg:px-20 max-lg:px-6 pb-10 shadow-lg rounded-lg">
          <table className="w-full border border-blue-400 rounded-lg overflow-hidden">
            <thead className="bg-white/10 text-white text-md">
              <tr className="border-b">
                <th className="px-6 py-3 text-center">Image</th>
                <th className="px-6 py-3 text-center">Product Name</th>
                <th className="px-6 py-3 text-center">Buyer</th>
                <th className="px-6 py-3 text-center">Payment Method</th>
                <th className="px-6 py-3 text-center">Price</th>
                <th className="px-6 py-3 text-center">Status</th>
                <th className="px-6 py-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center text-white py-8">
                    Loading...
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center text-white py-8">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                transactions.map((item) => (
                  <tr key={item.id} className="border-b bg-white/10 transition">
                    <td className="px-6 py-4 text-center flex justify-center">
                      <Image
                        src={
                          item.image &&
                          Array.isArray(item.image) &&
                          item.image.length > 0 &&
                          typeof item.image[0] === "string" &&
                          item.image[0].startsWith("/")
                            ? `http://127.0.0.1:1031${item.image[0]}`
                            : "/images/default-item.png"
                        }
                        alt={item.item_name}
                        width={100}
                        height={100}
                        className="w-16 h-16 object-cover rounded-2xl"
                      />
                    </td>
                    <td className="px-6 py-4 text-white text-center">
                      {item.item?.name}
                    </td>
                    <td className="px-6 py-4 text-white text-center">
                      {item.buyer?.name}
                    </td>
                    <td className="px-6 py-4 text-white text-center">
                      {item.payment_method || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-white text-center">
                      Rp. {item.item?.price.toLocaleString("id-ID")}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-4 py-2 text-sm tracking-wide capitalize font-semibold rounded-full ${
                          item.status == "paid"
                            ? "bg-green-700 text-white"
                            : "bg-red-700 text-white"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center space-x-2">
                      <Link
                        href={`/transaction/edit/${item.id}`}
                        className="px-4 py-2 text-sm font-bold text-white bg-blue-500 rounded-md shadow hover:bg-blue-600 transition"
                      >
                        Edit
                      </Link>
                      <button className="px-4 py-2 text-sm font-bold text-white bg-red-500 rounded-md shadow hover:bg-red-600 transition">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
