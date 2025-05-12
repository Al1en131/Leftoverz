"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

export default function EditProduct() {
  const router = useRouter();
  const params = useParams();
  const productId = params?.id;
  const [userId, setUserId] = useState<string | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [initialImageUrls, setInitialImageUrls] = useState<string[]>([]);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [keptInitialImages, setKeptInitialImages] = useState<string[]>([]);
  const [removedImages, setRemovedImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleClosePopup = () => {
    setShowSuccessPopup(false);
    router.push("/seller/my-product/");
  };
  const handleCloseErrorPopup = () => setShowErrorPopup(false);
  useEffect(() => {
    const storedUserId = localStorage.getItem("id");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    status: "",
    image: [] as File[],
  });

  useEffect(() => {
    if (!userId || !productId) return;

    const fetchProductData = async () => {
      try {
        const res = await fetch(
          `http://127.0.0.1:1031/api/v1/products/get/${userId}/${productId}`
        );
        const data = await res.json();

        if (!res.ok) throw new Error(data.message);

        setFormData({
          name: data.product.name || "",
          price: data.product.price || "",
          status: data.product.status || "",
          description: data.product.description || "",
          image: [] as File[], // Reset image array
        });

        const image = data.product.image;

         let parsedImage = data.product.image;
        try {
          parsedImage = JSON.parse(parsedImage);
        } catch {}

        if (Array.isArray(parsedImage)) {
          setInitialImageUrls(
            parsedImage.map((url: string) => `http://127.0.0.1:1031${url}`)
          );
          setKeptInitialImages(parsedImage); // ✅ ini yang benar
        }
        try {
          // Coba parse string JSON jika perlu
          parsedImage = JSON.parse(image);
        } catch {
          console.log("Image is not in valid JSON format, skipping parsing.");
        }

        console.log("Parsed image data:", parsedImage);

        if (Array.isArray(parsedImage) && parsedImage.length > 0) {
          // Jika image adalah array dan memiliki gambar
          setInitialImageUrls(
            parsedImage.map(
              (imgUrl: string) => `http://127.0.0.1:1031${imgUrl}`
            )
          );
        } else if (parsedImage && parsedImage.url) {
          // Jika image adalah objek dan memiliki properti url
          setInitialImageUrls([`http://127.0.0.1:1031${parsedImage.url}`]);
        } else {
          console.log("No valid image data found");
        }

        console.log("image:", parsedImage); // Periksa isi data yang diparsing
      } catch (error) {
        console.error("Error:", error);
        setShowErrorPopup(true);
        setErrorMessage("Unknown error occurred");
      }
    };

    fetchProductData();
  }, [userId, productId]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type, files } = e.target as HTMLInputElement;
    const newValue = type === "file" ? files : value;

    if (name === "image" && files?.length) {
      setFormData((prev) => ({
        ...prev,
        [name]: Array.from(files), // Menyimpan file yang diupload dalam array
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: newValue,
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);

    // Hitung total gambar: yang lama masih disimpan + yang baru diunggah
    const totalImages =
      keptInitialImages.length + formData.image.length + newFiles.length;

    if (totalImages > 5) {
      setShowErrorPopup(true);
      setErrorMessage("Maximum 5 images allowed including existing ones.");
      if (fileInputRef.current) fileInputRef.current.value = ""; // reset input
      return;
    }

    // Gabungkan file lama dengan file baru
    const updatedFiles = [...formData.image, ...newFiles];
    const updatedPreviews = [
      ...imagePreviews,
      ...newFiles.map((file) => URL.createObjectURL(file)),
    ];

    setFormData((prev) => ({ ...prev, image: updatedFiles }));
    setImagePreviews(updatedPreviews);

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
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!userId || !productId)
      return alert("ID user atau produk tidak ditemukan");
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login.");
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("price", formData.price);
    data.append("status", formData.status);
    data.append("description", formData.description);
    formData.image.forEach((file) => data.append("image", file));
    data.append("removedImages", JSON.stringify(removedImages));
    data.append("keptImages", JSON.stringify(keptInitialImages));

    try {
      const res = await fetch(
        `http://127.0.0.1:1031/api/v1/products/edit/user/${userId}/${productId}`,
        {
          method: "PUT",
          body: data,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await res.json();
      if (res.ok) {
        setShowSuccessPopup(true);
        setSuccessMessage("Product successfully updated!");
      } else {
        setShowErrorPopup(true);
        setErrorMessage(result.message || "An error occurred.");
      }
    } catch (error) {
      console.error("Error:", error);
      setShowErrorPopup(true);
      setErrorMessage("Server error, please try again.");
    }
  };

  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);
  return (
    <div className="bg-[#080B2A] items-center min-h-screen">
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

            <h2 className="text-2xl font-bold mb-1 text-blue-400">
              Product Successfully Updated!
            </h2>
            <p className="mb-6 text-blue-400">{successMessage}</p>

            <button
              onClick={handleClosePopup} // Menutup popup
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
              onClick={handleCloseErrorPopup} // Menutup popup error
              className="bg-red-400 hover:bg-red-500 text-white font-semibold py-2 px-6 rounded-full"
            >
              OK
            </button>
          </div>
        </div>
      )}
      <main>
        <div className="bg-white/5 pt-28 pb-20 w-full lg:px-20 max-lg:px-6 flex flex-col items-center gap-6 relative">
          <div className="relative w-full">
            <Image
              width={600}
              height={400}
              alt="Hero About"
              src="/images/hero-product.jpg"
              className="rounded-2xl w-full h-64"
            />
            <div className="absolute top-0 left-0 w-full h-full bg-black opacity-40 rounded-2xl z-40"></div>
            <h1 className="text-5xl md:text-8xl tracking-wide text-white font-bold text-center absolute inset-0 flex justify-center items-center z-50">
              Edit Product
            </h1>
          </div>
        </div>

        <div className="flex justify-center py-10 lg:px-20 max-lg:px-6 w-full">
          <section className="lg:p-10 max-lg:p-6 bg-white/10 rounded-2xl w-full border border-blue-400">
            <h2 className="text-white text-2xl font-semibold text-center mb-6">
              Product Details
            </h2>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
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
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
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
                  className="w-full border bg-white/30 text-white border-blue-400 p-2 rounded-lg"
                  placeholder="Enter product name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="price" className="text-white block">
                  Price (Rp. )
                </label>
                <input
                  type="number"
                  name="price"
                  id="price"
                  className="w-full border bg-white/30 text-white border-blue-400 p-2 rounded-lg"
                  placeholder="Enter product price"
                  value={formData.price}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="status" className="text-white block">
                  Status
                </label>
                <select
                  name="status"
                  id="status"
                  className="w-full border bg-white/30 text-white border-blue-400 p-2 rounded-lg"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="" disabled>
                    Select Status
                  </option>
                  <option value="available">Available</option>
                  <option value="sold">Sold</option>
                </select>
              </div>
              <div className="mb-6">
                <label htmlFor="description" className="text-white block">
                  Description
                </label>
                <textarea
                  name="description"
                  id="description"
                  rows={4}
                  className="w-full border bg-white/30 text-white border-blue-400 p-2 rounded-lg"
                  placeholder="Enter product description"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-400 text-white py-2 rounded-lg hover:bg-blue-500"
              >
                Update Product
              </button>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}
