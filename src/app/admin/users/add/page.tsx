"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Region {
  id: string;
  name: string;
}

export default function User() {
  const router = useRouter();
  const [provinces, setProvinces] = useState<Region[]>([]);
  const [regency, setRegency] = useState<Region[]>([]);
  const [subdistricts, setSubdistricts] = useState<Region[]>([]);
  const [wards, setWards] = useState<Region[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    no_hp: "",
    address: "",
    province: "",
    regency: "",
    subdistrict: "",
    ward: "",
  });

  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleClosePopup = () => {
    setShowSuccessPopup(false);
    router.push("/admin/users");
  };

  const handleCloseErrorPopup = () => {
    setShowErrorPopup(false);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    fetch(
      "https://api.binderbyte.com/wilayah/provinsi?api_key=23ef9d28f62d15ac694e6d87d2c384549e7ba507f87f85ae933cbe93ada1fe3d"
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.code === "200" && Array.isArray(data.value)) {
          setProvinces(data.value);
        } else {
          console.error("Gagal mengambil data:", data);
        }
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  const handleChangeRegency = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "province") {
      // Cari ID dari provinsi yang dipilih
      const selectedProvince = provinces.find((p) => p.name === value);
      if (selectedProvince) {
        try {
          const res = await fetch(
            `https://api.binderbyte.com/wilayah/kabupaten?api_key=23ef9d28f62d15ac694e6d87d2c384549e7ba507f87f85ae933cbe93ada1fe3d&id_provinsi=${selectedProvince.id}`
          );
          const data = await res.json();
          if (data.code === "200") {
            setRegency(data.value);
          } else {
            setRegency([]);
          }
        } catch (err) {
          console.error("Error loading kabupaten", err);
          setRegency([]);
        }
      }
    }
    if (name === "regency") {
      const selectedRegency = regency.find((p) => p.name === value);
      if (selectedRegency) {
        try {
          const res = await fetch(
            `https://api.binderbyte.com/wilayah/kecamatan?api_key=23ef9d28f62d15ac694e6d87d2c384549e7ba507f87f85ae933cbe93ada1fe3d&id_kabupaten=${selectedRegency.id}`
          );
          const data = await res.json();
          if (data.code === "200") {
            setSubdistricts(data.value);
          } else {
            setSubdistricts([]);
          }
        } catch (err) {
          console.error("Error loading kecamatan", err);
          setSubdistricts([]);
        }
      }
    }
    if (name === "subdistrict") {
      const selectedDistrict = subdistricts.find((p) => p.name === value);
      if (selectedDistrict) {
        try {
          const res = await fetch(
            `https://api.binderbyte.com/wilayah/kelurahan?api_key=23ef9d28f62d15ac694e6d87d2c384549e7ba507f87f85ae933cbe93ada1fe3d&id_kecamatan=${selectedDistrict.id}`
          );
          const data = await res.json();
          if (data.code === "200") {
            setWards(data.value);
          } else {
            setWards([]);
          }
        } catch (err) {
          console.error("Error loading kelurahan", err);
          setWards([]);
        }
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:1031/api/v1/user/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to add user");
      }

      setSuccessMessage("User created successfully!");
      setShowSuccessPopup(true);
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "",
        no_hp: "",
        address: "",
        province: "",
        regency: "",
        subdistrict: "",
        ward: "",
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else if (typeof error === "string") {
        setErrorMessage(error);
      } else {
        setErrorMessage("Something went wrong!");
      }
      setShowErrorPopup(true);
    }
  };
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
        <h1 className="text-3xl font-bold whitespace-nowrap">Add User</h1>
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
          <div className="relative z-10 text-white p-6">
            <span className="text-sm font-normal">Welcome back,</span>
            <h2 className="text-xl font-semibold mb-1">Superadmin Leftoverz</h2>
            <p className="text-sm text-gray-300">
              Glad to see you again! Ask me anything.
            </p>
            <Link
              href="/admin/users/"
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
              Back to Data Users
            </Link>
          </div>
          <div className="z-10">
            <Image
              src="/images/userss.png"
              alt="Welcome"
              width={300}
              height={300}
              className="rounded-lg absolute right-0 h-56 w-56 -top-10"
            />
          </div>
        </div>
      </div>
      <div className=" text-white z-20 relative">
        <form
          onSubmit={handleSubmit}
          className="space-y-4 p-6 rounded-lg shadow-lg"
          style={{
            background:
              "linear-gradient(to bottom right, rgba(6, 11, 38, 0.74), rgba(26, 31, 55, 0.5))",
          }}
        >
          <div>
            <label htmlFor="name" className="block mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              className="w-full p-2 bg-white/20 text-white rounded"
              placeholder="Enter name"
              onChange={handleChange}
              value={formData.name}
            />
          </div>
          <div>
            <label htmlFor="email" className="block mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className="w-full p-2 bg-white/20 text-white rounded"
              placeholder="Enter email"
              onChange={handleChange}
              value={formData.email}
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              className="w-full p-2 bg-white/20 text-white rounded"
              placeholder="Enter password"
              onChange={handleChange}
              value={formData.password}
            />
          </div>
          <div>
            <label htmlFor="role" className="block mb-1">
              Role
            </label>
            <select
              name="role"
              id="role"
              className="w-full p-2 bg-white/20 text-white rounded"
              onChange={handleChange}
              value={formData.role}
            >
              <option value="" disabled>
                Select role
              </option>
              <option className="text-blue-400" value="admin">
                Admin
              </option>
              <option className="text-blue-400" value="penjual">
                Seller
              </option>
              <option className="text-blue-400" value="pembeli">
                Buyer
              </option>
            </select>
          </div>
          <div>
            <label htmlFor="no_hp" className="block mb-1">
              No HP
            </label>
            <input
              type="text"
              name="no_hp"
              id="no_hp"
              className="w-full p-2 bg-white/20 text-white rounded"
              placeholder="Enter phone number"
              onChange={handleChange}
              value={formData.no_hp}
            />
          </div>
          <div>
            {" "}
            <label htmlFor="no_hp" className="block mb-1">
              Provinsi
            </label>
            <select
              name="province"
              id="province"
              className="w-full p-2 bg-white/20 text-white rounded"
              onChange={handleChangeRegency}
              value={formData.province}
            >
              <option value="" disabled>
                Select province
              </option>
              {provinces.map((data: { id: string; name: string }) => (
                <option
                  key={data.id}
                  value={data.name}
                  className="text-blue-400"
                >
                  {data.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="kabupaten" className="block mb-1">
              Kabupaten
            </label>
            <select
              name="regency"
              id="regency"
              className="w-full p-2 bg-white/20 text-white rounded"
              onChange={handleChangeRegency}
              value={formData.regency}
            >
              <option value="" disabled>
                Select kabupaten
              </option>
              {regency.map((data: { id: string; name: string }) => (
                <option
                  key={data.id}
                  value={data.name}
                  className="text-blue-400"
                >
                  {data.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="district" className="block mb-1">
              Kecamatan
            </label>
            <select
              name="subdistrict"
              id="subdistrict"
              className="w-full p-2 bg-white/20 text-white rounded"
              onChange={handleChangeRegency}
              value={formData.subdistrict}
            >
              <option value="" disabled>
                Select kecamatan
              </option>
              {subdistricts.map((data: { id: string; name: string }) => (
                <option
                  key={data.id}
                  value={data.name}
                  className="text-blue-400"
                >
                  {data.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="village" className="block mb-1">
              Kelurahan
            </label>
            <select
              name="ward"
              id="ward"
              className="w-full p-2 bg-white/20 text-white rounded"
              onChange={handleChange}
              value={formData.ward}
            >
              <option value="" disabled>
                Select kelurahan
              </option>
              {wards.map((data: { id: string; name: string }) => (
                <option
                  key={data.id}
                  value={data.name}
                  className="text-blue-400"
                >
                  {data.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="address" className="block mb-1">
              Address
            </label>
            <textarea
              name="address"
              id="address"
              className="w-full p-2 bg-white/20 text-white rounded"
              placeholder="Enter address"
              onChange={handleChange}
              value={formData.address}
              rows={3}
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-400 hover:bg-blue-500 rounded text-white"
          >
            Submit User
          </button>
        </form>
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
                Success!
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
      </div>
    </div>
  );
}
