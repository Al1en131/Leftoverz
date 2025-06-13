"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
export default function MyProduct() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );
  const { theme, setTheme } = useTheme();
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

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredProducts = products.filter(
    (product) =>
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.status?.toLocaleLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const handleConfirmDelete = async () => {
    if (!selectedProductId) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://backend-leftoverz-production.up.railway.app/api/v1/products/${selectedProductId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete product");
      }

      setProducts((prev) =>
        prev.filter((product) => product.id !== selectedProductId)
      );
      setSuccessMessage("Produk berhasil dihapus.");
      setShowSuccessPopup(true);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(error.message || "Failed to delete product.");
      } else {
        setErrorMessage("Gagal menghapus produk.");
      }
      setShowErrorPopup(true);
    } finally {
      setShowConfirmPopup(false);
      setSelectedProductId(null);
    }
  };

  const handleClosePopup = () => {
    setShowSuccessPopup(false);
    setShowErrorPopup(false);
    setShowConfirmPopup(false);
  };
  const fetchProducts = async () => {
    const user_id = localStorage.getItem("id");
    try {
      const response = await fetch(
        `https://backend-leftoverz-production.up.railway.app/api/v1/products/user/${user_id}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch products");
      }

      const data = await response.json();
      const parsedProducts = data.products.map((product: Product) => {
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
          seller_name: product.seller?.name || "Unknown",
          subdistrict: product.user?.subdistrict || "Unknown",
          ward: product.user?.ward,
          regency: product.user?.regency,
          province: product.user?.province,
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
  useEffect(() => {
    fetchProducts();
  }, []);

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
          className="w-4 absolute top-28 right-8 max-lg:hidden -z-0"
        />
        <Image
          width={100}
          height={100}
          alt=""
          src="/images/Star-1.svg"
          className="w-4 absolute top-[400px] max-lg:hidden right-32 -z-0"
        />
        <Image
          width={100}
          height={100}
          alt=""
          src="/images/Star-1.svg"
          className="w-4 absolute top-44 left-10 max-lg:hidden -z-0"
        />
        <Image
          width={100}
          height={100}
          alt=""
          src="/images/Star-1.svg"
          className="w-4 absolute top-36 left-[550px] max-lg:hidden -z-0"
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
              } backdrop-blur-md rounded-2xl flex flex-col justify-center max-lg:p-6 lg:ps-20 gap-2 z-40`}
            >
              <h1 className="lg:text-6xl max-lg:text-4xl font-bold">
                Produk Saya
              </h1>
              <p className="max-lg:text-base lg:text-lg max-w-3xl">
                Ini adalah produk-produk yang kamu miliki. Kelola produkmu
                dengan mudah di sini, mulai dari mengubah informasi hingga
                menghapus produk yang sudah tidak ingin dijual.
              </p>
            </div>
          </div>
        </div>

        <div className="py-10 lg:px-20 max-lg:px-6 lg:flex lg:justify-between max-lg:space-y-4 items-center gap-4">
          <form className="lg:w-10/12 max-lg:w-full">
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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`block w-full p-3 ps-10 text-sm border border-blue-400 rounded-lg ${
                  theme === "dark"
                    ? "text-white bg-white/10"
                    : "text-blue-400 bg-black/5"
                }`}
                placeholder="Cari Produk Kamu ..."
              />
            </div>
          </form>

          <div className="lg:w-2/12 max-lg:w-full lg:flex lg:justify-end">
            <Link
              href="/seller/my-product/add"
              className="bg-blue-400 text-white font-medium rounded-lg p-2.5 w-full flex items-center justify-center gap-2 shadow-md hover:bg-blue-500 transition-all"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              Tambah Produk
            </Link>
          </div>
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
                  <th className="px-2 py-3 text-left">Nama Produk</th>
                  <th className="px-2 py-3 text-left">Deskripsi</th>
                  <th className="px-6 py-3 text-left">Harga Jual</th>
                  <th className="px-6 py-3 text-left">Harga Asli</th>
                  <th className="px-6 py-3 text-left">Lama Penggunaan</th>
                  <th className="px-6 py-3 text-center">Status</th>
                  <th className="px-6 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              {loading ? (
                <div className="flex justify-center w-full py-10">
                  <p className="text-blue-400 text-lg">Loading...</p>
                </div>
              ) : (
                <tbody>
                  {currentProducts.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="text-center py-8 text-lg font-semibold text-gray-500 dark:text-white"
                      >
                        Belum ada produk yang ditambahkan.
                      </td>
                    </tr>
                  ) : (
                    currentProducts.map((item) => (
                      <tr
                        key={item.id}
                        className={`border-b transition ${
                          theme === "dark"
                            ? "bg-white/10 text-white"
                            : "bg-black/5 text-blue-400"
                        }`}
                      >
                        <td className="px-6 py-4 justify-center flex text-center">
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
                            alt={item.name}
                            width={100}
                            height={100}
                            className="w-16 h-16 object-cover rounded-2xl"
                          />
                        </td>
                        <td
                          className={`px-2 py-4 text-left ${
                            theme === "dark" ? "text-white" : "text-blue-400"
                          }`}
                        >
                          {item.name && item.name.length > 20
                            ? item.name.slice(0, 20) + "..."
                            : item.name}
                        </td>
                        <td
                          className={`px-2 py-4 text-left ${
                            theme === "dark" ? "text-white" : "text-blue-400"
                          }`}
                        >
                          {item.description && item.description.length > 35
                            ? item.description.slice(0, 35) + "..."
                            : item.description}
                        </td>
                        <td
                          className={`px-6 py-4 text-left ${
                            theme === "dark" ? "text-white" : "text-blue-400"
                          }`}
                        >
                          Rp {item.price.toLocaleString("id-ID")}
                        </td>
                        <td
                          className={`px-6 py-4 text-left ${
                            theme === "dark" ? "text-white" : "text-blue-400"
                          }`}
                        >
                          Rp {item.original_price.toLocaleString("id-ID")}
                        </td>
                        <td
                          className={`px-6 py-4 text-left ${
                            theme === "dark" ? "text-white" : "text-blue-400"
                          }`}
                        >
                          {item.used_duration}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`px-4 py-2 text-sm tracking-wide capitalize font-semibold rounded-full ${
                              item.status === "available"
                                ? "bg-green-700 text-white"
                                : "bg-red-700 text-white"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-center space-x-1">
                          {/* Tombol Edit */}
                          <Link
                            href={`/seller/my-product/edit/${item.id}`}
                            className="inline-flex items-center justify-center px-1 py-1 text-sm font-bold text-white bg-blue-500 rounded-md shadow hover:bg-blue-600 transition"
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
                          </Link>

                          {/* Tombol Hapus */}
                          <button
                            onClick={() => {
                              setSelectedProductId(item.id);
                              setShowConfirmPopup(true);
                            }}
                            className="inline-flex items-center justify-center p-1 text-sm font-bold text-white bg-red-500 rounded-md shadow hover:bg-red-600 transition"
                          >
                            <svg
                              className="w-4 h-4"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={1.5}
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                              />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              )}
            </table>
          </div>
          <div className="flex justify-center gap-4 my-4 pt-4 items-center">
            <button
              onClick={handlePreviousPage}
              className="px-4 py-2 text-sm font-bold text-white bg-blue-400 rounded-md shadow hover:bg-blue-600 transition"
              disabled={currentPage === 1}
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
            <span
              className={`font-semibold ${
                theme === "dark" ? "text-white" : "text-blue-400"
              }`}
            >
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              className="px-4 py-2 text-sm font-bold text-white bg-blue-400 rounded-md shadow hover:bg-blue-600 transition"
              disabled={currentPage === totalPages}
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
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black/55 flex items-center justify-center z-50">
          <div
            className={`border-blue-400 border rounded-lg py-8 px-14 shadow-lg text-center ${
              theme === "dark" ? "bg-[#080B2A]" : "bg-white"
            }`}
          >
            <div className="flex justify-center mb-4">
              <Image
                src="/images/succes.svg"
                width={80}
                height={80}
                alt="Success"
                className="w-20 h-20"
              />
            </div>
            <h2 className="text-2xl font-bold mb-1 text-blue-400">Sukses!</h2>
            <p className="mb-6 text-blue-400">{successMessage}</p>
           <button
              onClick={handleClosePopup}
              className="bg-blue-400 hover:bg-blue-500 text-white font-semibold py-2 px-6 rounded-full"
            >
              Oke
            </button>
          </div>
        </div>
      )}
      {showErrorPopup && (
        <div className="fixed inset-0 bg-black/55 flex items-center justify-center z-50">
          <div
            className={`border-red-400 border rounded-lg py-8 px-14 shadow-lg text-center ${
              theme === "dark" ? "bg-[#080B2A]" : "bg-white"
            }`}
          >
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
              Ya
            </button>
          </div>
        </div>
      )}
      {showConfirmPopup && (
        <div className="fixed inset-0 bg-black/55 flex items-center justify-center z-50">
          <div
            className={`border-blue-400 border rounded-lg py-8 px-14 shadow-lg text-center ${
              theme === "dark" ? "bg-[#080B2A]" : "bg-white"
            }`}
          >
            <div className="flex justify-center mb-4">
              <Image
                src="/images/warning.svg"
                width={80}
                height={80}
                alt="Confirm Delete"
                className="w-20 h-20"
              />
            </div>
            <h2 className="text-2xl font-bold mb-1 text-blue-400">
              Apakah kamu yakin?
            </h2>
            <p className="mb-6 text-blue-400">
              Apakah Kamu ingin menghapus produk ini?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleClosePopup}
                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-full"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmDelete}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-full"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
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
  );
}
