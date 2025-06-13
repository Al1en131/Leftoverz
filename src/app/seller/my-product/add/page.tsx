"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

export default function AddProduct() {
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState(
    "Product successfully created!"
  );
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    image: [] as File[],
    status: "available",
    used_duration: "",
    original_price: "",
  });

  const [displayPrice, setDisplayPrice] = useState("");
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [displayOriginalPrice, setDisplayOriginalPrice] = useState("");

  const formatPrice = (value: string) => {
    const numberString = value.replace(/\D/g, "");
    return numberString.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };
  const getEmbeddingFromImage = async (
    file: File
  ): Promise<number[] | null> => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(
        "https://backend-leftoverz-production.up.railway.app/api/v1/embed-local/create",
        {
          method: "POST",
          body: formData,
        }
      );

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

  const handleChange = async (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;

    if (type === "file" && target.files) {
      const selectedFiles = Array.from(target.files);
      const totalFiles = formData.image.length + selectedFiles.length;

      if (totalFiles > 5) {
        alert("You can only upload up to 5 images.");
        return;
      }

      // Update gambar
      setFormData((prev) => ({
        ...prev,
        image: [...prev.image, ...selectedFiles],
      }));

      // Tampilkan preview
      const newPreviews = selectedFiles.map((file) =>
        URL.createObjectURL(file)
      );
      setImagePreviews((prev) => [...prev, ...newPreviews]);

      // Ambil embedding hanya dari file pertama (atau pertama kali upload)
      if (formData.image.length === 0 && selectedFiles.length > 0) {
        const embeddingResult = await getEmbeddingFromImage(selectedFiles[0]);
        if (embeddingResult) {
          setEmbedding(embeddingResult);
        }
      }
    } else if (name === "price") {
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
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // ... (sisa handleChange tidak berubah)
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to create a product.");
      return;
    }

    const form = new FormData();
    form.append("name", formData.name);
    form.append("price", formData.price);
    form.append("description", formData.description);
    form.append("status", formData.status);
    form.append("used_duration", formData.used_duration);
    form.append("original_price", formData.original_price);

    // Mengirimkan gambar
    formData.image.forEach((file) => form.append("image", file));
    if (embedding) {
      form.append("embedding", JSON.stringify(embedding));
    }

    if (!formData.name || !formData.price || !formData.description) {
      alert("Please fill out all required fields.");
      return;
    }

    try {
      const user_id = localStorage.getItem("id");
      const response = await fetch(
        `https://backend-leftoverz-production.up.railway.app/api/v1/products/add/user/${user_id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: form,
        }
      );

      const data = await response.json();
      if (response.ok) {
        setShowSuccessPopup(true); // Menampilkan popup sukses
        setSuccessMessage("Produk berhasil ditambahkan!"); // Menambahkan pesan sukses
      } else {
        setShowErrorPopup(true); // Menampilkan popup error
        setErrorMessage(data.message || "An error occurred. Please try again.");
      }
    } catch (error) {
      console.error("Error creating product:", error);
      setShowErrorPopup(true); // Menampilkan popup error
      setErrorMessage("Gagal menambahkan produk!");
    }
  };

  const handleClosePopup = () => {
    setShowSuccessPopup(false);
    router.push("/seller/my-product/");
  };

  const handleCloseErrorPopup = () => {
    setShowErrorPopup(false);
  };

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

            <h2 className="text-2xl font-bold mb-1 text-red-400">
              Terjadi Kesalahan!
            </h2>
            <p className="mb-6 text-red-400">{errorMessage}</p>

            <button
              onClick={handleCloseErrorPopup}
              className="bg-red-400 hover:bg-red-500 text-white font-semibold py-2 px-6 rounded-full"
            >
              Oke
            </button>
          </div>
        </div>
      )}
      <main className="">
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
          className="w-4 absolute top-[400px] right-32 max-lg:hidden -z-0"
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
          className="w-4 absolute top-36 max-lg:hidden left-[550px] -z-0"
        />
        <div
          className={`pt-28 pb-20 w-full lg:px-20 max-lg:px-6 flex flex-col items-center gap-6 relative ${
            theme === "dark"
              ? "bg-white/5 text-white"
              : "bg-black/5 text-[#080B2A]"
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
                  : "bg-white/15 text-[#080B2A]"
              } backdrop-blur-md rounded-2xl flex flex-col justify-center max-lg:p-6 lg:ps-20 gap-2 z-40`}
            ></div>
            <h1 className="text-5xl lg:text-7xl tracking-wide font-bold text-center absolute inset-0 flex justify-center items-center z-50">
              Tambah Produk
            </h1>
          </div>
        </div>

        <div className="flex justify-center py-10 lg:px-20 max-lg:px-6 w-full">
          <section
            className={`lg:p-10 max-lg:p-6 rounded-2xl w-full border border-blue-400 ${
              theme === "dark" ? "bg-white/10" : "bg-black/5"
            }`}
          >
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="flex flex-col items-center mb-6">
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-blue-400 border-dashed rounded-lg cursor-pointer bg-white/30">
                  <div
                    className={`flex flex-col items-center justify-center pt-5 pb-6 ${
                      theme === "dark" ? "text-white" : "text-blue-400"
                    }`}
                  >
                    <svg
                      className="w-8 h-8 mb-4"
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
                    <p className="mb-2 text-sm">
                      <span className="font-semibold">Klik untuk unggah</span>{" "}
                      atau geser dan letakkan
                    </p>
                    <p className="text-xs">SVG, PNG, JPG atau GIF</p>
                  </div>
                  <input
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                    onChange={handleChange}
                    name="image"
                    accept="image/*"
                    multiple
                  />
                </label>
                {imagePreviews.length > 0 && (
                  <div className="flex flex-wrap gap-4 mt-4">
                    {imagePreviews.map((src, index) => (
                      <div key={index} className="w-24 h-24 relative">
                        <Image
                          src={src}
                          alt={`Preview ${index + 1}`}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Name */}
              <div
                className={`mb-6 ${
                  theme === "dark" ? "text-white" : "text-blue-400"
                }`}
              >
                <label htmlFor="name" className=" block">
                  Nama Produk
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className={`w-full border border-blue-400 p-2 rounded-lg ${
                    theme === "dark"
                      ? "bg-white/10 placeholder-white"
                      : "bg-white/30 placeholder-gray-400"
                  }`}
                  placeholder="Masukkan nama produk..."
                  onChange={handleChange}
                  value={formData.name}
                />
              </div>

              {/* Price */}
              <div
                className={`mb-6 ${
                  theme === "dark" ? "text-white" : "text-blue-400"
                }`}
              >
                <label htmlFor="price" className="block">
                  Harga Jual
                </label>
                <input
                  type="text"
                  name="price"
                  id="price"
                  className={`w-full border border-blue-400 p-2 rounded-lg ${
                    theme === "dark"
                      ? "bg-white/10 placeholder-white"
                      : "bg-white/30 placeholder-gray-400"
                  }`}
                  placeholder="Masukkan harga jual..."
                  onChange={handleChange}
                  value={displayPrice}
                />
              </div>
              <div
                className={`mb-6 ${
                  theme === "dark" ? "text-white" : "text-blue-400"
                }`}
              >
                <label htmlFor="original_price" className="block">
                  Harga Asli
                </label>
                <input
                  type="text"
                  name="original_price"
                  id="original_price"
                  className={`w-full border border-blue-400 p-2 rounded-lg ${
                    theme === "dark"
                      ? "bg-white/10 placeholder-white"
                      : "bg-white/30 placeholder-gray-400"
                  }`}
                  placeholder="Masukkan harga asli..."
                  onChange={handleChange}
                  value={displayOriginalPrice}
                />
              </div>
              <div
                className={`mb-6 ${
                  theme === "dark" ? "text-white" : "text-blue-400"
                }`}
              >
                <label htmlFor="used_duration" className="block">
                  Lama Penggunaan
                </label>
                <select
                  name="used_duration"
                  id="used_duration"
                  className={`w-full border border-blue-400 p-2 rounded-lg ${
                    theme === "dark"
                      ? "bg-white/10 placeholder-white"
                      : "bg-white/30 placeholder-gray-400"
                  }`}
                  onChange={handleChange}
                  value={formData.used_duration}
                >
                  <option value="" disabled>
                    Pilih Berapa Lama Penggunaan
                  </option>
                  <option className="text-blue-400" value="New">
                    Baru
                  </option>
                  <option className="text-blue-400" value="1-3 months">
                    1–3 Bulan
                  </option>
                  <option className="text-blue-400" value="4-6 months">
                    4–6 Bulan
                  </option>
                  <option className="text-blue-400" value="7-12 months">
                    7–12 Bulan
                  </option>
                  <option className="text-blue-400" value="1-2 years">
                    1–2 Tahun
                  </option>
                  <option className="text-blue-400" value="3-4 years">
                    3–4 Tahun
                  </option>
                  <option className="text-blue-400" value="5+ years">
                    Lebih dari 5 tahun
                  </option>
                </select>
              </div>

              <div
                className={`mb-6 ${
                  theme === "dark" ? "text-white" : "text-blue-400"
                }`}
              >
                <label htmlFor="status" className="block">
                  Status
                </label>
                <select
                  name="status"
                  id="status"
                  className={`w-full border border-blue-400 p-2 rounded-lg ${
                    theme === "dark"
                      ? "bg-white/10 placeholder-white"
                      : "bg-white/30 placeholder-gray-400"
                  }`}
                  onChange={handleChange}
                  value={formData.status}
                >
                  <option className="text-blue-400" value="available">
                    Tersedia
                  </option>
                  <option className="text-blue-400" value="sold">
                    Terjual
                  </option>
                </select>
              </div>

              {/* Description */}
              <div
                className={`mb-6 ${
                  theme === "dark" ? "text-white" : "text-blue-400"
                }`}
              >
                <label htmlFor="description" className="block">
                  Deskripsi
                </label>
                <textarea
                  name="description"
                  id="description"
                  rows={4}
                  className={`w-full border border-blue-400 p-2 rounded-lg ${
                    theme === "dark"
                      ? "bg-white/10 placeholder-white"
                      : "bg-white/30 placeholder-gray-400"
                  }`}
                  placeholder="Masukkan deskripsi produk..."
                  onChange={handleChange}
                  value={formData.description}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-blue-400 text-white py-2 rounded-lg hover:bg-blue-500"
              >
                Tambah
              </button>
            </form>
          </section>
        </div>
      </main>
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
