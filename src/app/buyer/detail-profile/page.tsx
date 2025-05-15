"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

type User = {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  role: string;
  address: string;
  subdistrict: string;
  province: string;
  ward: string;
  regency: string;
};

type Province = {
  id: string;
  name: string;
};

type Regency = {
  id: string;
  name: string;
};

type Subdistrict = {
  id: string;
  name: string;
};

type Ward = {
  id: string;
  name: string;
};

export default function DetailProfile() {
  const [name, setName] = useState<string | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    const storedUserName = localStorage.getItem("name");
    if (storedUserName) setName(storedUserName);
  }, []);
  const [formData, setFormData] = useState<User>({
    id: 0,
    name: "",
    email: "",
    phone_number: "",
    role: "",
    address: "",
    subdistrict: "",
    province: "",
    ward: "",
    regency: "",
  });
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [regency, setRegency] = useState<Regency[]>([]);
  const [subdistricts, setSubdistricts] = useState<Subdistrict[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const handleChangeRegency = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("id");
    if (storedUserId) {
      const id = Number(storedUserId);
      setUserId(id);

      const fetchUser = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await fetch(
            `http://127.0.0.1:1031/api/v1/user/${id}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const data = await response.json();

          if (data?.user) {
            setFormData(data.user);
          }
        } catch (error) {
          console.error("Failed to fetch user:", error);
        }
      };

      fetchUser();
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userId) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://127.0.0.1:1031/api/v1/user/update/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Profil berhasil diperbarui.");
        setShowSuccessPopup(true);
      } else {
        setErrorMessage(`Gagal memperbarui profil: ${data.message}`);
        setShowErrorPopup(true);
      }
    } catch (error) {
      console.error("Update error:", error);
      setErrorMessage("Something went wrong, please try again.");
      setShowErrorPopup(true);
    }
  };
  const apiKey =
    "23ef9d28f62d15ac694e6d87d2c384549e7ba507f87f85ae933cbe93ada1fe3d";

  // 1. Get provinces
  useEffect(() => {
    fetch(`https://api.binderbyte.com/wilayah/provinsi?api_key=${apiKey}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.code === "200") {
          setProvinces(data.value);
        }
      });
  }, []);

  useEffect(() => {
    const selectedProvince = provinces.find(
      (p) => p.name.toLowerCase() === formData.province.toLowerCase()
    );
    if (!selectedProvince) return;

    const fetchRegency = async () => {
      const res = await fetch(
        `https://api.binderbyte.com/wilayah/kabupaten?api_key=${apiKey}&id_provinsi=${selectedProvince.id}`
      );
      const data = await res.json();
      if (data.code === "200") {
        setRegency(data.value);
      }

      if (!isInitialLoad) {
        setFormData((prev) => ({
          ...prev,
          regency: "",
          subdistrict: "",
          ward: "",
        }));
        setSubdistricts([]);
        setWards([]);
      }
    };

    fetchRegency();
  }, [formData.province, provinces]);

  useEffect(() => {
    const selectedRegency = regency.find(
      (r) => r.name.toLowerCase() === formData.regency.toLowerCase()
    );
    if (!selectedRegency) return;

    const fetchSubdistrict = async () => {
      const res = await fetch(
        `https://api.binderbyte.com/wilayah/kecamatan?api_key=${apiKey}&id_kabupaten=${selectedRegency.id}`
      );
      const data = await res.json();
      if (data.code === "200") {
        setSubdistricts(data.value);
      }

      if (!isInitialLoad) {
        setFormData((prev) => ({
          ...prev,
          subdistrict: "",
          ward: "",
        }));
        setWards([]);
      }
    };

    fetchSubdistrict();
  }, [formData.regency, regency]);

  useEffect(() => {
    const selectedSubdistrict = subdistricts.find(
      (s) => s.name.toLowerCase() === formData.subdistrict.toLowerCase()
    );
    if (!selectedSubdistrict) return;

    const fetchWard = async () => {
      const res = await fetch(
        `https://api.binderbyte.com/wilayah/kelurahan?api_key=${apiKey}&id_kecamatan=${selectedSubdistrict.id}`
      );
      const data = await res.json();
      if (data.code === "200") {
        setWards(data.value);
      }

      if (!isInitialLoad) {
        setFormData((prev) => ({
          ...prev,
          ward: "",
        }));
      }
    };

    fetchWard();
  }, [formData.subdistrict, subdistricts]);

  useEffect(() => {
    if (
      formData.province &&
      formData.regency &&
      formData.subdistrict &&
      formData.ward &&
      regency.length > 0 &&
      subdistricts.length > 0 &&
      wards.length > 0
    ) {
      setIsInitialLoad(false); 
    }
  }, [formData, regency, subdistricts, wards]);
  const handleClosePopup = () => setShowSuccessPopup(false);
  const handleCloseErrorPopup = () => setShowErrorPopup(false);
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

      {/* Error Popup */}
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
      <main>
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
          className="w-8 absolute top-28 right-26 -z-0 max-lg:hidden"
        />
        <Image
          width={100}
          height={100}
          alt=""
          src="/images/Star-1.svg"
          className="w-4 absolute top-28 right-96 -z-0 max-lg:hidden"
        />
        <Image
          width={100}
          height={100}
          alt=""
          src="/images/Star-1.svg"
          className="w-4 absolute top-44 left-56 -z-0 max-lg:hidden"
        />
        <Image
          width={100}
          height={100}
          alt=""
          src="/images/Star-1.svg"
          className="w-4 absolute top-36 left-[550px] max-lg:hidden -z-0"
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
            <div className="absolute top-0 left-0 w-full h-full bg-black opacity-40 rounded-2xl"></div>
            <h1 className="text-5xl md:text-8xl tracking-wide text-white font-bold text-center absolute inset-0 flex justify-center items-center z-30">
              Detail Profile
            </h1>
          </div>
        </div>

        <div className="flex justify-between py-10 lg:px-20 max-lg:px-6 w-full items-center">
          <section className="lg:p-10 max-lg:p-6 w-full my-auto bg-white/10 rounded-2xl border border-blue-400">
            <div className="w-full flex gap-4 ">
              <div className="w-full h-fit self-center">
                <div className="flex justify-center">
                  <span className="w-20 h-20 shrink-0 mb-3 text-3xl bg-blue-400 rounded-full flex items-center justify-center text-white font-bold">
                    {name
                      ? name
                          .split(" ")
                          .map((word) => word.charAt(0))
                          .join("")
                          .toUpperCase()
                      : "?"}
                  </span>
                </div>
                <p className="capitalize text-center mb-7">{name}</p>
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-white">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full border bg-white/30 text-white placeholder-white border-blue-400 p-2 rounded-lg"
                        placeholder="Nama"
                      />
                    </div>
                    <div>
                      <label className="text-white">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border bg-white/30 text-white placeholder-white border-blue-400 p-2 rounded-lg"
                        placeholder="Email"
                      />
                    </div>
                    <div>
                      <label className="text-white">Phone Number</label>
                      <input
                        type="tel"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleChange}
                        className="w-full border bg-white/30 text-white placeholder-white border-blue-400 p-2 rounded-lg"
                        placeholder="No HP"
                      />
                    </div>
                    <div>
                      <label className="text-white">Role</label>
                      <input
                        type="role"
                        name="role"
                        onChange={handleChange}
                        value={formData.role}
                        className="w-full border bg-white/30 text-white placeholder-white border-blue-400 p-2 rounded-lg"
                        placeholder="Isi jika ingin mengganti"
                        disabled
                      />
                    </div>
                    <div>
                      <label className="text-white">Province</label>
                      <select
                        name="province"
                        value={formData.province}
                        onChange={handleChangeRegency}
                        className="w-full border bg-white/30 text-white border-blue-400 p-2 rounded-lg"
                      >
                        <option value="">Pilih Provinsi</option>
                        {provinces.map((prov) => (
                          <option
                            className="text-blue-400"
                            key={prov.id}
                            value={prov.name}
                          >
                            {prov.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-white">Regency</label>
                      <select
                        name="regency"
                        value={formData.regency}
                        onChange={handleChangeRegency}
                        className="w-full border bg-white/30 text-white border-blue-400 p-2 rounded-lg"
                        disabled={!regency.length}
                      >
                        <option value="">Pilih Kabupaten/Kota</option>
                        {regency.map((reg) => (
                          <option
                            className="text-blue-400"
                            key={reg.id}
                            value={reg.name}
                          >
                            {reg.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-white">Subdistrict</label>
                      <select
                        name="subdistrict"
                        value={formData.subdistrict}
                        onChange={handleChangeRegency}
                        className="w-full border bg-white/30 text-white border-blue-400 p-2 rounded-lg"
                        disabled={!subdistricts.length}
                      >
                        <option value="">Pilih Kecamatan</option>
                        {subdistricts.map((sub) => (
                          <option
                            className="text-blue-400"
                            key={sub.id}
                            value={sub.name}
                          >
                            {sub.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-white">Ward</label>
                      <select
                        name="ward"
                        value={formData.ward}
                        onChange={handleChangeRegency}
                        className="w-full border bg-white/30 text-white border-blue-400 p-2 rounded-lg"
                        disabled={!wards.length}
                      >
                        <option value="">Pilih Kelurahan</option>
                        {wards.map((w) => (
                          <option
                            className="text-blue-400"
                            key={w.id}
                            value={w.name}
                          >
                            {w.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="text-white">Address</label>
                    <textarea
                      name="address"
                      rows={3}
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full border bg-white/30 text-white placeholder-white border-blue-400 p-2 rounded-lg"
                      placeholder="Alamat"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-6 bg-blue-400 text-white py-2 rounded-lg"
                  >
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
