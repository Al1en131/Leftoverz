"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

type RawTransaction = {
  id: number;
  buyer_id: number;
  seller_id: number;
  item_id: number;
  payment_method: "COD" | "e-wallet" | "bank transfer";
  status: "pending" | "paid" | "cancelled" | null;
  item?: {
    name: string;
    image: string[];
    price: number;
  };
  buyer?: { name: string };
  seller?: { name: string };
  created_at: string;
};

type Transaction = RawTransaction & {
  item_name: string;
  buyer_name: string;
  seller_name: string;
  image: string[];
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
  seller?: { name: string };
  created_at: string;
};

export default function Dashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [penjualCount, setPenjualCount] = useState(0);
  const [pembeliCount, setPembeliCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [productCount, setProductCount] = useState(0);
  const [transactionCount, setTransactionCount] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [currentDate, setCurrentDate] = useState<string>("");
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

    const day = now.toLocaleDateString("id-ID", optionsDay);
    const fullDate = now.toLocaleDateString("id-ID", optionsDate);

    setDateString({ day, fullDate });
  }, []);

  useEffect(() => {
    const today = new Date();
    setCurrentDate(today.toLocaleDateString());
  }, [currentDate]);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/auth/login");
    } else {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token tidak ditemukan");
        setLoading(false);
        return;
      }

      try {
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        const [penjualRes, pembeliRes] = await Promise.all([
          fetch(
            "https://backend-leftoverz-production.up.railway.app/api/v1/count/seller",
            { headers }
          ),
          fetch(
            "https://backend-leftoverz-production.up.railway.app/api/v1/count/buyer",
            { headers }
          ),
        ]);

        if (penjualRes.ok && pembeliRes.ok) {
          const penjualData = await penjualRes.json();
          const pembeliData = await pembeliRes.json();

          setPenjualCount(penjualData.count);
          setPembeliCount(pembeliData.count);
        } else {
          throw new Error("Gagal mengambil data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    const fetchDataProduct = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token tidak ditemukan");
        setLoading(false);
        return;
      }

      try {
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        const [productRes] = await Promise.all([
          fetch(
            "https://backend-leftoverz-production.up.railway.app/api/v1/count/product",
            { headers }
          ),
        ]);

        if (productRes.ok) {
          const productData = await productRes.json();

          setProductCount(productData.count);
        } else {
          throw new Error("Gagal mengambil data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    const fetchDataTransaction = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token tidak ditemukan");
        setLoading(false);
        return;
      }

      try {
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        const [transactionRes] = await Promise.all([
          fetch(
            "https://backend-leftoverz-production.up.railway.app/api/v1/count/transaction",
            { headers }
          ),
        ]);

        if (transactionRes.ok) {
          const transactionData = await transactionRes.json();

          setTransactionCount(transactionData.count);
        } else {
          throw new Error("Gagal mengambil data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
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

        const mappedTransactions: Transaction[] = data.transactions
          .slice(0, 6)
          .map((transaction) => ({
            ...transaction,
            item_name: transaction.item?.name || "Unknown",
            buyer_name: transaction.buyer?.name || "Unknown",
            seller_name: transaction.seller?.name || "Unknown",
            image: transaction.item?.image || [],
          }));

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
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "https://backend-leftoverz-production.up.railway.app/api/v1/products",
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
          throw new Error(errorData.message || "Failed to fetch products");
        }

        const data = await response.json();

        const parsedProducts = data.products
          .sort(
            (a: Product, b: Product) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          )
          .slice(0, 4)
          .map((product: Product) => {
            let parsedImage: string[] = [];

            if (typeof product.image === "string") {
              try {
                const parsed = JSON.parse(product.image);
                if (Array.isArray(parsed)) {
                  parsedImage = parsed;
                }
              } catch {
                parsedImage = [];
              }
            } else if (Array.isArray(product.image)) {
              parsedImage = product.image;
            }

            return {
              ...product,
              image: parsedImage,
            };
          });

        setProducts(parsedProducts);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Error fetching products:", error.message);
        } else {
          console.error("An unknown error occurred:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    fetchDataProduct();
    fetchDataTransaction();
    fetchTransactions();
    fetchProducts();
  }, []);

  if (loading || isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#060B26] text-white px-6 py-6 relative">
      <Image
        width={100}
        height={100}
        alt=""
        src="/images/admin.png"
        className="w-full absolute right-0 top-0 h-full mb-0"
      />
      <div className="flex justify-between items-center mb-7 relative z-20">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="relative flex justify-end gap-4 w-full">
          <div className="block">
            <p>{dateString.day}</p>
            <p>{dateString.fullDate}</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-6 mb-6 z-20">
        {[
          {
            label: "Pembeli",
            value: pembeliCount.toLocaleString(),
            color: "text-green-400",
          },
          {
            label: "Penjual",
            value: penjualCount.toLocaleString(),
            color: "text-green-400",
          },
          {
            label: "Total Produk",
            value: productCount.toLocaleString(),
            color: "text-red-400",
          },
          {
            label: "Total Pembelian",
            value: transactionCount.toLocaleString(),
            color: "text-green-400",
          },
        ].map((item, i) => (
          <div
            key={i}
            className=" p-4 z-20 rounded-lg shadow"
            style={{
              background:
                "linear-gradient(to bottom right, rgba(6, 11, 38, 0.74), rgba(26, 31, 55, 0.5))",
            }}
          >
            <p className="text-sm text-gray-300">{item.label}</p>
            <h2 className="text-xl font-semibold">{item.value} </h2>
          </div>
        ))}
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
          <div className="relative z-10 text-white  p-6">
            <span className="text-sm font-normal">Selamat Datang,</span>
            <h2 className="text-xl font-semibold mb-1">Admin Leftoverz</h2>
            <p className="text-sm text-gray-300">
              {" "}
              Selamat datang kembali! Kelola dashboard dengan mudah di sini.
            </p>
            <button className="mt-4 text-white text-sm flex items-center gap-2">
              Jelajahi Fitur Admin →
            </button>
          </div>
          <div className="relative z-10">
            <Image
              src="/images/dashboard.png"
              alt="Welcome"
              width={300}
              height={300}
              className="rounded-lg w-full h-full"
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div
          className="shadow rounded-lg p-4 sm:p-6 xl:p-8  z-50"
          style={{
            background:
              "linear-gradient(to bottom right, rgba(6, 11, 38, 0.74), rgba(26, 31, 55, 0.5))",
          }}
        >
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold white mb-2">
                Transaksi Terbaru
              </h3>
              <span className="text-base font-normal text-white">
                Ini Data Transaksi yang Terbaru
              </span>
            </div>
            <div className="shrink-0">
              <Link
                href="/admin/transactions"
                className="text-sm font-medium text-cyan-600 hover:bg-blue-400 hover:text-white rounded-lg p-2"
              >
                Lihat Semua
              </Link>
            </div>
          </div>
          <div className="flex flex-col mt-8">
            <div className="overflow-x-auto rounded-lg">
              <div className="align-middle inline-block min-w-full">
                <div className="shadow overflow-hidden sm:rounded-lg">
                  <table className="min-w-full ">
                    <thead className="border-b-2 border-[#56577A]">
                      <tr>
                        <th
                          scope="col"
                          className="p-4 text-left text-xs font-medium text-white uppercase tracking-wider"
                        >
                          Nama Produk
                        </th>
                        <th
                          scope="col"
                          className="p-4 text-left text-xs font-medium text-white uppercase tracking-wider"
                        >
                          Pembeli
                        </th>
                        <th
                          scope="col"
                          className="p-4 text-left text-xs font-medium text-white uppercase tracking-wider"
                        >
                          Harga
                        </th>
                      </tr>
                    </thead>
                    <tbody className="">
                      {transactions.map((tx) => (
                        <tr key={tx.id} className="border-b border-[#56577A]">
                          <td className="p-4 whitespace-nowrap text-sm font-normal text-white">
                            {tx.item_name}
                          </td>
                          <td className="p-4 whitespace-nowrap text-sm font-normal text-white">
                            {tx.buyer_name}
                          </td>
                          <td className="p-4 whitespace-nowrap text-sm font-semibold text-white">
                            Rp {tx.item?.price.toLocaleString("id-ID")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="shadow rounded-lg p-4 sm:p-6 xl:p-8  z-50"
          style={{
            background:
              "linear-gradient(to bottom right, rgba(6, 11, 38, 0.74), rgba(26, 31, 55, 0.5))",
          }}
        >
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold white mb-2">Produk Terbaru</h3>
              <span className="text-base font-normal text-white">
                Ini Data Produk yang terbaru
              </span>
            </div>
            <div className="shrink-0">
              <Link
                href="/admin/products"
                className="text-sm font-medium text-cyan-600 hover:bg-blue-400 hover:text-white rounded-lg p-2"
              >
                Lihat semua
              </Link>
            </div>
          </div>
          <div className="flex flex-col mt-8">
            <div className="overflow-x-auto rounded-lg">
              <div className="align-middle inline-block min-w-full">
                <div className="shadow overflow-hidden sm:rounded-lg">
                  <table className="min-w-full ">
                    <thead className="border-b-2 border-[#56577A]">
                      <tr>
                        <th
                          scope="col"
                          className="p-4 text-left text-xs font-medium text-white uppercase tracking-wider"
                        >
                          Gambar
                        </th>
                        <th
                          scope="col"
                          className="p-4 text-left text-xs font-medium text-white uppercase tracking-wider"
                        >
                          Nama Produk
                        </th>
                        <th
                          scope="col"
                          className="p-4 text-left text-xs font-medium text-white uppercase tracking-wider"
                        >
                          Harga
                        </th>
                      </tr>
                    </thead>
                    <tbody className="">
                      {products.map((product) => (
                        <tr
                          key={product.id}
                          className="transition border-b border-[#56577A]"
                        >
                          <td className="px-4 py-4 text-white text-left">
                            <Image
                              src={
                                product.image &&
                                Array.isArray(product.image) &&
                                product.image.length > 0 &&
                                typeof product.image[0] === "string" &&
                                product.image[0].startsWith("/")
                                  ? `https://backend-leftoverz-production.up.railway.app${product.image[0]}`
                                  : "/images/default-product.png"
                              }
                              alt={product.name}
                              width={100}
                              height={100}
                              className="w-12 h-12 object-cover rounded-2xl"
                            />
                          </td>
                          <td className="px-4 py-4 text-white text-left">
                            {product.name}
                          </td>
                          <td className="px-4 py-4 text-white text-left">
                            Rp {product.price.toLocaleString("id-ID")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
