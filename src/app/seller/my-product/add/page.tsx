"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

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
  });

  const [displayPrice, setDisplayPrice] = useState(""); // untuk ditampilkan
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const formatPrice = (value: string) => {
    const numberString = value.replace(/\D/g, "");
    return numberString.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleChange = (
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

      setFormData((prev) => ({
        ...prev,
        image: [...prev.image, ...selectedFiles],
      }));

      const newPreviews = selectedFiles.map((file) =>
        URL.createObjectURL(file)
      );
      setImagePreviews((prev) => [...prev, ...newPreviews]);
    } else if (name === "price") {
      const raw = value.replace(/\D/g, "");
      setDisplayPrice(formatPrice(value));
      setFormData((prev) => ({
        ...prev,
        price: raw,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
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

    // Mengirimkan gambar
    formData.image.forEach((file) => form.append("image", file));

    if (!formData.name || !formData.price || !formData.description) {
      alert("Please fill out all required fields.");
      return;
    }

    try {
      const user_id = localStorage.getItem("id");
      const response = await fetch(
        `http://127.0.0.1:1031/api/v1/products/add/user/${user_id}`,
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
        setSuccessMessage("Product successfully created!"); // Menambahkan pesan sukses
      } else {
        setShowErrorPopup(true); // Menampilkan popup error
        setErrorMessage(data.message || "An error occurred. Please try again.");
      }
    } catch (error) {
      console.error("Error creating product:", error);
      setShowErrorPopup(true); // Menampilkan popup error
      setErrorMessage("Error creating product, please try again.");
    }
  };

  const handleClosePopup = () => {
    setShowSuccessPopup(false);
    router.push("/seller/my-product/");
  };

  const handleCloseErrorPopup = () => {
    setShowErrorPopup(false);
  };
  return (
    <div className="bg-[#080B2A] items-center min-h-screen">
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

            <h2 className="text-2xl font-bold mb-1 text-blue-400">
              Login Successful!
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
      <main className="">
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
              Add Product
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
                  onChange={handleChange}
                  value={formData.name}
                />
              </div>

              {/* Price */}
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
                  onChange={handleChange}
                  value={displayPrice}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="status" className="text-white block">
                  Status
                </label>
                <select
                  name="status"
                  id="status"
                  className="w-full border bg-white/30 text-white placeholder-white border-blue-400 p-2 rounded-lg"
                  onChange={handleChange}
                  value={formData.status}
                >
                  <option value="available">Available</option>
                  <option value="sold">Sold</option>
                </select>
              </div>

              {/* Description */}
              <div className="mb-6">
                <label htmlFor="description" className="text-white block">
                  Description
                </label>
                <textarea
                  name="description"
                  id="description"
                  rows={4}
                  className="w-full border bg-white/30 text-white placeholder-white border-blue-400 p-2 rounded-lg"
                  placeholder="Enter product description"
                  onChange={handleChange}
                  value={formData.description}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-blue-400 text-white py-2 rounded-lg hover:bg-blue-500"
              >
                Submit Product
              </button>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}
