"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

type User = {
  id: number;
  name: string;
  price: number;
  original_price: number;
  used_duration: string;
  description: string;
  user_id: string;
  status: string;
  image: string[];
  role: string;
};

export default function EditProduct() {
  const router = useRouter();
  const params = useParams();
  const productId = params?.id;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    user_id: "",
    status: "",
    image: [] as File[],
    used_duration: "",
    original_price: "",
  });

  const [users, setUsers] = useState<User[]>([]);
  const [displayPrice, setDisplayPrice] = useState("");
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [initialImageUrls, setInitialImageUrls] = useState<string[]>([]);
  const [keptInitialImages, setKeptInitialImages] = useState<string[]>([]);
  const [removedImages, setRemovedImages] = useState<string[]>([]);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [displayOriginalPrice, setDisplayOriginalPrice] = useState("");

  const formatPrice = (value: string) => {
    const numberString = value.replace(/\D/g, "");
    return numberString.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://127.0.0.1:1031/api/v1/users", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (Array.isArray(data.users)) setUsers(data.users);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `http://127.0.0.1:1031/api/v1/product/${productId}`
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        setRemovedImages([]);
        setKeptInitialImages([]);

        setFormData({
          name: data.product.name || "",
          price: data.product.price || "",
          original_price: data.product.original_price || "",
          used_duration: data.product.used_duration || "",
          description: data.product.description || "",
          user_id: data.product.user_id || "",
          status: data.product.status || "",
          image: [],
        });
        setDisplayPrice(formatPrice(data.product.price?.toString() || ""));
        setDisplayOriginalPrice(
          formatPrice(data.product.original_price?.toString() || "")
        );

        let parsedImage = data.product.image;
        try {
          parsedImage = JSON.parse(parsedImage);
        } catch {}

        if (Array.isArray(parsedImage)) {
          setInitialImageUrls(
            parsedImage.map((url: string) => `http://127.0.0.1:1031${url}`)
          );
          setKeptInitialImages(parsedImage);
        }
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Unknown error occurred";
        setErrorMessage(msg);
        setShowErrorPopup(true);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "price") {
      const raw = value.replace(/\D/g, "");
      setDisplayPrice(formatPrice(value));
      setFormData((prev) => ({
        ...prev,
        price: raw,
      }));
    } else if (name === "original_price") {
      const raw = value.replace(/\D/g, "");
      setDisplayOriginalPrice(formatPrice(value));
      setFormData((prev) => ({
        ...prev,
        original_price: raw,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const getEmbeddingFromImage = async (
    file: File
  ): Promise<number[] | null> => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("http://127.0.0.1:1031/api/v1/embed-local/create", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to embed image: ${text}`);
      }

      const data = await response.json();
      return data.embedding;
    } catch (error) {
      console.error("Error generating embedding:", error);
      return null;
    }
  };

  const [embedding, setEmbedding] = useState<number[] | null>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);

    const totalImages =
      keptInitialImages.length + formData.image.length + newFiles.length;

    if (totalImages > 5) {
      setShowErrorPopup(true);
      setErrorMessage("Maximum 5 images allowed including existing ones.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const updatedFiles = [...formData.image, ...newFiles];
    const updatedPreviews = [
      ...imagePreviews,
      ...newFiles.map((file) => URL.createObjectURL(file)),
    ];

    setFormData((prev) => ({ ...prev, image: updatedFiles }));
    setImagePreviews(updatedPreviews);

    if (newFiles.length > 0) {
      // Ambil embedding dari gambar pertama yang baru diupload
      const embeddingResult = await getEmbeddingFromImage(newFiles[0]);
      if (embeddingResult) {
        setEmbedding(embeddingResult);
      }
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...formData.image];
    newImages.splice(index, 1);
    setFormData((prev) => ({ ...prev, image: newImages }));

    const newPreviews = [...imagePreviews];
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
  };

  const handleRemoveInitialImage = (index: number) => {
    const removed = initialImageUrls[index];
    setRemovedImages((prev) => [...prev, removed]);
    setInitialImageUrls((prev) => prev.filter((_, i) => i !== index));
    setKeptInitialImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      setShowErrorPopup(true);
      setErrorMessage("Please login.");
      return;
    }

    if (!formData.name || !formData.price || !formData.user_id) {
      setShowErrorPopup(true);
      setErrorMessage("Please fill out all required fields.");
      return;
    }

    const form = new FormData();
    form.append("name", formData.name);
    form.append("price", formData.price);
    form.append("original_price", formData.original_price);
    form.append("used_duration", formData.used_duration);
    form.append("description", formData.description);
    form.append("user_id", formData.user_id);
    form.append("status", formData.status);

    formData.image.forEach((file) => form.append("image", file));
    form.append("removedImages", JSON.stringify(removedImages));
    form.append("keptImages", JSON.stringify(keptInitialImages));

    // Kirim embedding hanya kalau ada
    if (embedding) {
      form.append("embedding", JSON.stringify(embedding));
    }

    try {
      const res = await fetch(
        `http://127.0.0.1:1031/api/v1/product/edit/${productId}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: form,
        }
      );

      const data = await res.json();
      if (res.ok) {
        setSuccessMessage("Product successfully updated!");
        setShowSuccessPopup(true);
      } else {
        setErrorMessage(data.message || "An error occurred.");
        setShowErrorPopup(true);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Server error, please try again.");
      setShowErrorPopup(true);
    }
  };

  const handleClosePopup = () => {
    setShowSuccessPopup(false);
    router.push("/admin/products");
  };

  const handleCloseErrorPopup = () => setShowErrorPopup(false);

  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

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

    const day = now.toLocaleDateString("en-US", optionsDay);
    const fullDate = now.toLocaleDateString("en-GB", optionsDate);

    setDateString({ day, fullDate });
  }, []);

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
        <h1 className="text-3xl font-bold whitespace-nowrap">Edit Product</h1>
        <div className="relative flex justify-end gap-4 w-full">
          <div className="block">
            <p>{dateString.day}</p>
            <p>{dateString.fullDate}</p>
          </div>
        </div>
      </div>
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black/55 flex items-center justify-center z-50">
          <div className="bg-[#080B2A] border-blue-400 border rounded-lg py-8 px-14 shadow-lg text-center">
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

            <h2 className="text-2xl font-bold mb-1 text-red-400">
              Something went wrong!
            </h2>
            <p className="mb-6 text-red-400">{errorMessage}</p>

            <button
              onClick={handleCloseErrorPopup}
              className="bg-red-400 hover:bg-red-500 text-white font-semibold py-2 px-6 rounded-full"
            >
              OK
            </button>
          </div>
        </div>
      )}
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
            <h2 className="text-xl font-semibold mb-1">Superadmin Leftoverz</h2>
            <p className="text-sm text-gray-300">
              Glad to see you again! Ask me anything.
            </p>
            <Link
              href="/admin/products/"
              className="mt-4 text-white text-sm flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-full p-2 bg-blue-400 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18"
                  />
                </svg>
              </div>
              Back to Data Products
            </Link>
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
        <form
          onSubmit={handleSubmit}
          className="p-6"
          encType="multipart/form-data"
        >
          <div className="flex flex-col items-center mb-6">
            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-white/40">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className="w-8 h-8 mb-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="mb-2 text-sm text-white">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-white">
                  SVG, PNG, JPG or GIF (MAX. 800x400px)
                </p>
              </div>
              <input
                id="dropzone-file"
                type="file"
                className="hidden"
                name="image"
                accept="image/png, image/jpeg, image/jpg, image/gif"
                multiple
                onChange={handleImageChange}
              />
            </label>

            <div className="mt-4 flex justify-center items-center gap-4">
              {/* Gambar lama */}
              {initialImageUrls.length > 0 && (
                <div className="flex gap-4 flex-wrap mb-4">
                  {initialImageUrls.map((url, index) => (
                    <div key={index} className="relative w-32 h-32">
                      <Image
                        src={url}
                        alt={`Initial Preview ${index}`}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-lg border object-cover border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveInitialImage(index)}
                        className="absolute top-[-6px] right-[-6px] bg-red-600 p-1 text-white rounded-full w-6 h-6 text-3xl flex items-center justify-center shadow-md hover:bg-red-700"
                      >
                        <svg
                          className="w-4 h-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Gambar baru */}
              {imagePreviews.length > 0 && (
                <div className="flex gap-4 flex-wrap mb-4">
                  {imagePreviews.map((url, index) => (
                    <div key={index} className="relative w-32 h-32">
                      <Image
                        src={url}
                        alt={`New Preview ${index}`}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-lg border object-cover border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-[-6px] right-[-6px] bg-red-600 p-1 text-white rounded-full w-6 h-6 text-3xl flex items-center justify-center shadow-md hover:bg-red-700"
                      >
                        <svg
                          className="w-4 h-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="name" className="text-white block">
              Product Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              className="w-full border bg-white/30 text-white placeholder-white border-blue-400 p-2 rounded-lg"
              placeholder="Enter product name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="price" className="text-white block">
              Price (Rp.)
            </label>
            <input
              type="text"
              name="price"
              id="price"
              className="w-full border bg-white/30 text-white placeholder-white border-blue-400 p-2 rounded-lg"
              placeholder="Enter product price"
              value={displayPrice}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="original_price" className="text-white block">
              Original Price (Rp.)
            </label>
            <input
              type="text"
              name="original_price"
              id="original_price"
              className="w-full border bg-white/30 text-white placeholder-white border-blue-400 p-2 rounded-lg"
              placeholder="Enter product original price"
              onChange={handleInputChange}
              value={displayOriginalPrice}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="used_duration" className="text-white block">
              Used Duration
            </label>
            <select
              name="used_duration"
              id="used_duration"
              className="w-full border bg-white/30 text-white placeholder-white border-blue-400 p-2 rounded-lg"
              onChange={handleInputChange}
              value={formData.used_duration}
            >
              <option value="" disabled>
                Select Used Duration
              </option>
              <option className="text-blue-400" value="New">
                New
              </option>
              <option className="text-blue-400" value="1-3 months">
                1–3 months
              </option>
              <option className="text-blue-400" value="4-6 months">
                4–6 months
              </option>
              <option className="text-blue-400" value="7-12 months">
                7–12 months
              </option>
              <option className="text-blue-400" value="1-2 years">
                1–2 years
              </option>
              <option className="text-blue-400" value="3-4 years">
                3–4 years
              </option>
              <option className="text-blue-400" value="5+ years">
                Over 5 years
              </option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="user_id" className="text-white block">
              Seller
            </label>
            <select
              name="user_id"
              id="user_id"
              className="w-full border bg-white/30 text-white placeholder-white border-blue-400 p-2 rounded-lg"
              value={formData.user_id}
              onChange={handleInputChange}
            >
              <option value="" disabled>
                Select Seller
              </option>
              {(users || [])
                .filter((user) => user.role === "penjual")
                .map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="status" className="text-white block">
              Status
            </label>
            <select
              name="status"
              id="status"
              className="w-full border bg-white/30 text-white placeholder-white border-blue-400 p-2 rounded-lg"
              value={formData.status}
              onChange={handleInputChange}
            >
              <option value="available">Available</option>
              <option value="sold">Sold</option>
            </select>
          </div>

          <div className="mb-6">
            <label htmlFor="description" className="text-white block">
              Product Description
            </label>
            <textarea
              name="description"
              id="description"
              rows={5}
              className="w-full border bg-white/30 text-white placeholder-white border-blue-400 p-2 rounded-lg"
              placeholder="Enter product description"
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>

          <button
            type="submit"
            className="bg-blue-400 text-white py-3 px-6 rounded-xl w-full"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
