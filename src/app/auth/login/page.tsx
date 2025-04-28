"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [userRole, setUserRole] = useState("");

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch("http://127.0.0.1:1031/api/v1/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        if (data.role === "penjual") {
          router.push("/seller");
        } else if (data.role === "pembeli") {
          router.push("/buyer");
        } else if (data.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/");
        }
        setUserRole(data.role);
        setShowSuccessPopup(true);
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");
      setShowErrorPopup(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseErrorPopup = () => {
    setShowErrorPopup(false);
  };

  const handleCloseSuccessPopup = () => {
    setShowSuccessPopup(false);
    if (userRole === "penjual") {
      router.push("/seller");
    } else if (userRole === "pembeli") {
      router.push("/buyer");
    } else if (userRole === "admin") {
      router.push("/admin");
    } else {
      router.push("/");
    }
  };

  return (
    <div className="bg-[#080B2A] min-h-screen flex items-center justify-center px-6">
      {showErrorPopup && (
        <div className="absolute inset-0 bg-black/55 flex items-center justify-center z-50">
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
              Login Failed!
            </h2>
            <p className="mb-6 text-red-400">{errorMessage}</p>

            <button
              onClick={handleCloseErrorPopup}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-full"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="absolute inset-0 bg-black/55 flex items-center justify-center z-50">
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
              onClick={handleCloseSuccessPopup}
              className="bg-blue-400 hover:bg-blue-500 text-white font-semibold py-2 px-6 rounded-full"
            >
              OK
            </button>
          </div>
        </div>
      )}

      <Image
        width={356}
        height={356}
        alt=""
        src="/images/bubble.svg"
        className="absolute top-0 left-0"
      />
      <Image
        width={356}
        height={356}
        alt=""
        src="/images/bubble-2.svg"
        className="absolute top-0 right-0"
      />
      <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-10 lg:bg-white/10 rounded-2xl max-lg:p-6 lg:p-14">
        <div className="w-full lg:w-1/2 bg-blue-950/10 border-2 border-blue-400 rounded-lg shadow-lg max-lg:p-6 lg:p-12">
          <h1 className="text-xl font-bold mb-6 tracking-wide text-white lg:text-2xl">
            Sign in to your account
          </h1>
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block mb-2 text-sm text-white">
                Your email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-white/20 border border-gray-300 text-white"
                placeholder="name@company.com"
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm text-white"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-white/20 border border-gray-300 text-white"
                placeholder="••••••••"
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center text-white">
                <input type="checkbox" className="w-4 h-4 mr-2" />
                Remember me
              </label>
              <a href="#" className="text-blue-400 text-sm hover:underline">
                Forgot password?
              </a>
            </div>
            <button
              type="submit"
              className="w-full text-white border-2 border-blue-400 rounded-lg py-2.5 hover:bg-blue-500 transition"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
            <p className="text-sm text-gray-400">
              Don’t have an account?{" "}
              <Link
                href="/auth/register"
                className="text-blue-400 hover:underline"
              >
                Register
              </Link>
            </p>
          </form>
        </div>
        <div className="w-full lg:w-1/2 hidden lg:flex justify-center">
          <Image width={600} height={600} src="/images/login.svg" alt="" />
        </div>
      </div>
    </div>
  );
}
