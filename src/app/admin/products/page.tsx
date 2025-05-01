"use client";

import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type Product = {
  id: number;
  name: string;
  email: string;
  no_hp: string;
  role: string;
  image: string[];
  description: string;
  location: string;
  price: number;
  status: string;
  user_id: number;
  seller?: { name: string };
};

export default function Products() {
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateString, setDateString] = useState({ day: "", fullDate: "" });

  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleClosePopup = () => {
    setShowSuccessPopup(false);
    setShowErrorPopup(false);
    setShowConfirmPopup(false);
  };

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

  const handleConfirmDelete = async () => {
    if (!selectedProductId) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://127.0.0.1:1031/api/v1/products/${selectedProductId}`,
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
      setSuccessMessage("Product deleted successfully.");
      setShowSuccessPopup(true);
    } catch (error: any) {
      setErrorMessage(error.message || "Failed to delete product.");
      setShowErrorPopup(true);
    } finally {
      setShowConfirmPopup(false);
      setSelectedProductId(null);
    }
  };

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:1031/api/v1/products", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

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

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="min-h-screen bg-[#060B26] text-white px-6 pt-6 relative">
      {showConfirmPopup && (
        <div className="fixed inset-0 bg-black/55 flex items-center justify-center z-50">
          <div className="bg-[#2c2f48] border-blue-400 border rounded-lg py-8 px-14 shadow-lg text-center">
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
              Are you sure?
            </h2>
            <p className="mb-6 text-blue-400">
              Do you want to delete this product?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleClosePopup}
                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-full"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-full"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black/55 flex items-center justify-center z-50">
          <div className="bg-[#2c2f48] border-blue-400 border rounded-lg py-8 px-14 shadow-lg text-center">
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
              onClick={handleClosePopup}
              className="bg-blue-400 hover:bg-blue-500 text-white font-semibold py-2 px-6 rounded-full"
            >
              OK
            </button>
          </div>
        </div>
      )}
      {showErrorPopup && (
        <div className="fixed inset-0 bg-black/55 flex items-center justify-center z-50">
          <div className="bg-[#2c2f48] border-red-400 border rounded-lg py-8 px-14 shadow-lg text-center">
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
        src="/images/admin.png"
        className="w-full absolute right-0 top-0 h-full mb-0"
      />
      <div className="flex justify-between items-center mb-7 relative z-20">
        <h1 className="text-3xl font-bold">Products</h1>
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
          <div className="relative z-10 text-white  p-6">
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
              src="/images/transaction.png"
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
            <div className="relative w-3/5">
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
            <Link
              href="/admin/products/add"
              className="bg-blue-400 text-white font-medium rounded-lg p-2 w-full flex items-center justify-center gap-2 shadow-md hover:bg-blue-500 transition-all"
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
              Add Product
            </Link>
          </div>
        </div>
        <table className="w-full rounded-lg my-4 max-lg:px-6 overflow-hidden">
          <thead className=" text-white text-md">
            <tr className="border-b-2 border-[#56577A]">
              <th className="px-6 py-3 text-center">No.</th>
              <th className="px-6 py-3 text-center">Image</th>
              <th className="px-6 py-3 text-center">Product Name</th>
              <th className="px-6 py-3 text-center">Description</th>
              <th className="px-6 py-3 text-center">Location</th>
              <th className="px-6 py-3 text-center">Price</th>
              <th className="px-6 py-3 text-center">Status</th>
              <th className="px-6 py-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {currentProducts.map((product, index) => (
              <tr
                key={product.id}
                className="transition border-b border-[#56577A]"
              >
                <td className="px-6 py-4 text-white text-center">
                  {index + 1 + (currentPage - 1) * itemsPerPage}
                </td>
                <td className="px-6 py-4 text-white text-center">
                  <Image
                    src={
                      product.image &&
                      Array.isArray(product.image) &&
                      product.image.length > 0 &&
                      typeof product.image[0] === "string" &&
                      product.image[0].startsWith("/")
                        ? `http://127.0.0.1:1031${product.image[0]}`
                        : "/images/default-product.png"
                    }
                    alt={product.name}
                    width={50}
                    height={50}
                    className="w-12 h-12 object-cover rounded-2xl"
                  />
                </td>
                <td className="px-6 py-4 text-white text-center">
                  {product.name}
                </td>
                <td className="px-6 py-4 text-white text-center">
                  {product.description}
                </td>
                <td className="px-6 py-4 text-white text-center">
                  {product.location}
                </td>
                <td className="px-6 py-4 text-white text-center">
                  Rp {product.price.toLocaleString("id-ID")}
                </td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`px-4 py-2 text-sm capitalize tracking-wide font-semibold rounded-full ${
                      product.status === "available"
                        ? "bg-green-700 text-white"
                        : "bg-red-700 text-white"
                    }`}
                  >
                    {product.status}
                  </span>
                </td>
                <td className="px-6 py-4 flex justify-center space-x-2 text-center">
                  <Link
                    href={`/admin/products/edit/${product.id}`}
                    className="px-4 py-2 text-sm font-bold text-white bg-blue-500 rounded-md shadow hover:bg-blue-600 transition"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => {
                      setSelectedProductId(product.id);
                      setShowConfirmPopup(true);
                    }}
                    className="px-4 py-2 text-sm font-bold text-white bg-red-500 rounded-md shadow hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-center gap-4 my-4 items-center">
          <button
            onClick={handlePreviousPage}
            className="px-4 py-2 text-sm font-bold text-white bg-blue-500 rounded-md shadow hover:bg-blue-600 transition"
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="text-white font-semibold">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            className="px-4 py-2 text-sm font-bold text-white bg-blue-500 rounded-md shadow hover:bg-blue-600 transition"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
