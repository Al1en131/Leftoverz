"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type User = {
  id: string;
  name: string;
  role: string;
};

export default function AddProduct() {
  const router = useRouter();
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [displayOriginalPrice, setDisplayOriginalPrice] = useState("");
  const [successMessage, setSuccessMessage] = useState(
    "Product successfully created!"
  );
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
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

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    image: [] as File[],
    user_id: "",
    status: "",
    used_duration: "",
    original_price: "",
  });

  const [displayPrice, setDisplayPrice] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://127.0.0.1:1031/api/v1/users", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data && Array.isArray(data.users)) {
          setUsers(data.users);
        } else {
          console.error("Unexpected data format:", data);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

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
    form.append("user_id", formData.user_id);
    form.append("status", formData.status);
    form.append("used_duration", formData.used_duration);
    form.append("original_price", formData.original_price);

    formData.image.forEach((file) => form.append("image", file));

    if (
      !formData.name ||
      !formData.price ||
      !formData.description ||
      !formData.user_id
    ) {
      alert("Please fill out all required fields.");
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:1031/api/v1/product/create",
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
        setShowSuccessPopup(true);
        setSuccessMessage("Product successfully created!");
      } else {
        setShowErrorPopup(true);
        setErrorMessage(data.message || "An error occurred. Please try again.");
      }
    } catch (error) {
      console.error("Error creating product:", error);
      setShowErrorPopup(true);
      setErrorMessage("Error creating product, please try again.");
    }
  };

  const handleClosePopup = () => {
    setShowSuccessPopup(false);
    router.push("/admin/products");
  };

  const handleCloseErrorPopup = () => {
    setShowErrorPopup(false);
  };
  return (
    <div className="min-h-screen bg-[#060B26] text-white px-6 py-6 relative">
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black/55 flex items-center justify-center z-50">
          <div className={`border-blue-400 border rounded-lg py-8 px-14 shadow-lg text-center ${
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

            <h2 className="text-2xl font-bold mb-1 text-blue-400">
              Login Successful!
            </h2>
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
          <div className={`border-red-400 border rounded-lg py-8 px-14 shadow-lg text-center ${
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

      <Image
        width={100}
        height={100}
        alt=""
        src="/images/admin.png"
        className="w-full absolute right-0 top-0 h-full mb-0"
      />
      <div className="flex justify-between items-center mb-7 relative z-20">
        <h1 className="text-3xl font-bold whitespace-nowrap">Add Product</h1>
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
            <label htmlFor="original_price" className="text-white block">
              Original Price (Rp.)
            </label>
            <input
              type="text"
              name="original_price"
              id="original_price"
              className="w-full border bg-white/30 text-white placeholder-white border-blue-400 p-2 rounded-lg"
              placeholder="Enter product original price"
              onChange={handleChange}
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
              onChange={handleChange}
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
              onChange={handleChange}
              value={formData.user_id}
            >
              <option value="" disabled>
                Select Seller
              </option>
              {users
                .filter((user) => user.role === "penjual")
                .map((user) => (
                  <option
                    className="text-blue-400"
                    key={user.id}
                    value={user.id}
                  >
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
              onChange={handleChange}
              value={formData.status}
            >
              <option value="" disabled>
                Select Status
              </option>
              <option className="text-blue-400" value="available">
                Available
              </option>
              <option className="text-blue-400" value="sold">
                Sold
              </option>
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
              className="w-full border bg-white/30 text-white placeholder-white border-blue-400 p-2 rounded-lg"
              placeholder="Enter product description"
              onChange={handleChange}
              value={formData.description}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-400 text-white py-2 rounded-lg hover:bg-blue-500"
          >
            Submit Product
          </button>
        </form>
      </div>
    </div>
  );
}
