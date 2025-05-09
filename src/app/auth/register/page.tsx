"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface FormData {
  name: string;
  email: string;
  phone_number: string;
  password: string;
  role: string;
}

export default function Register() {
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone_number: "",
    password: "",
    role: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:1031/api/v1/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          no_hp: formData.phone_number,
          role: formData.role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }
      localStorage.setItem("role", formData.role);
      setShowSuccessPopup(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Something went wrong");
      } else {
        setError("Something went wrong");
      }
      setShowErrorPopup(true);
    } finally {
      setLoading(false);
    }
  };

  const handleClosePopup = () => {
    setShowSuccessPopup(false);
    router.push("/auth/login");
  };

  const handleCloseErrorPopup = () => {
    setShowErrorPopup(false);
  };

  return (
    <div className="bg-[#080B2A] min-h-screen flex items-center justify-center p-6 relative">
      <div className="w-full max-w-7xl flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-10 lg:bg-white/10 rounded-2xl max-lg:p-6 lg:p-12">
        <div className="w-full lg:w-1/2 bg-blue-950/10 border-2 border-blue-400 rounded-lg shadow-lg max-lg:p-6 lg:p-8">
          <h1 className="text-xl font-bold mb-6 tracking-wide text-white lg:text-2xl">
            Register your account
          </h1>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="name"
                className="block mb-2 text-sm font-medium text-white"
              >
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                className="bg-white/20 text-white rounded-lg block w-full p-2.5"
                placeholder="username"
                required
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-white"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                className="bg-white/20 text-white rounded-lg block w-full p-2.5"
                placeholder="name@company.com"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label
                htmlFor="phone_number"
                className="block mb-2 text-sm font-medium text-white"
              >
                Phone Number
              </label>
              <input
                type="tel"
                name="phone_number"
                id="phone_number"
                className="bg-white/20 text-white rounded-lg block w-full p-2.5"
                placeholder="0851"
                required
                pattern="[\+]?[0-9]{1,4}[0-9]{7,15}"
                value={formData.phone_number}
                onChange={handleChange}
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-white"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                className="bg-white/20 text-white rounded-lg block w-full p-2.5"
                placeholder="••••••••"
                required
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-white">
                Role
              </label>
              <div className="flex gap-8 items-center">
                <div>
                  <input
                    type="radio"
                    id="penjual"
                    name="role"
                    value="penjual"
                    checked={formData.role === "penjual"}
                    onChange={handleChange}
                  />
                  <label htmlFor="penjual" className="ps-2 text-white">
                    Penjual
                  </label>
                </div>
                <div>
                  <input
                    type="radio"
                    id="pembeli"
                    name="role"
                    value="pembeli"
                    checked={formData.role === "pembeli"}
                    onChange={handleChange}
                  />
                  <label htmlFor="pembeli" className="ps-2 text-white">
                    Pembeli
                  </label>
                </div>
              </div>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full text-white bg-transparent font-medium rounded-lg text-sm px-5 py-2.5 text-center border-blue-400 border-2"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </button>
            <p className="text-sm font-light text-gray-400">
              Have an account?{" "}
              <Link
                href="/auth/login"
                className="font-medium text-blue-400 hover:underline"
              >
                Log in here
              </Link>
            </p>
          </form>
        </div>

        {/* Image Section */}
        <div className="w-full lg:w-1/2 hidden lg:flex justify-center">
          <Image
            width={600}
            height={600}
            src="/images/login.svg"
            alt="Login Image"
          />
        </div>
      </div>
      {showSuccessPopup && (
        <div className="absolute inset-0 bg-black/55 flex items-center justify-center z-50">
          <div className="bg-[#080B2A] border-blue-400 border rounded-lg py-8 px-14 shadow-lg text-center">
            <div className="flex justify-center mb-4">
              <Image
                src="/images/succes.svg"
                width={100}
                height={100}
                alt="Success"
                className="w-20 h-20"
              />
            </div>

            <h2 className="text-2xl font-bold mb-1 text-blue-400">
              Register Berhasil!
            </h2>
            <p className="mb-6 text-blue-400">Akun kamu berhasil dibuat.</p>

            <button
              onClick={handleClosePopup}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-full"
            >
              OK
            </button>
          </div>
        </div>
      )}
      {showErrorPopup && (
        <div className="absolute inset-0 bg-black/55 flex items-center justify-center z-50">
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
              Register Gagal!
            </h2>
            <p className="mb-6 text-red-400">{error}</p>

            <button
              onClick={handleCloseErrorPopup}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-full"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
