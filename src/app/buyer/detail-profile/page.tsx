"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

type User = {
  id: number;
  name: string;
  email: string;
  no_hp: string;
  role: string;
  address: string;
  subdistrict: string;
  province: string;
  ward: string;
  regency: string;
};

export default function DetailProfile() {
  const [role, setRole] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  useEffect(() => {
    const storedUserRole = localStorage.getItem("role");
    const storedUserName = localStorage.getItem("name");

    if (storedUserRole) setRole(storedUserRole);
    if (storedUserName) setName(storedUserName);
  }, []);
  const [formData, setFormData] = useState<User>({
    id: 0,
    name: "",
    email: "",
    no_hp: "",
    role: "",
    address: "",
    subdistrict: "",
    province: "",
    ward: "",
    regency: "",
  });
  const [provinces, setProvinces] = useState<any[]>([]);
  const [regency, setRegency] = useState<any[]>([]);
  const [subdistricts, setSubdistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);
  useEffect(() => {
    fetch(
      "https://api.binderbyte.com/wilayah/provinsi?api_key=23ef9d28f62d15ac694e6d87d2c384549e7ba507f87f85ae933cbe93ada1fe3d"
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.code === "200" && Array.isArray(data.value)) {
          setProvinces(data.value);
        } else {
          console.error("Gagal mengambil data provinsi:", data);
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

    // Ambil data kabupaten ketika provinsi dipilih
    if (name === "province") {
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

    // Ambil data kecamatan ketika kabupaten dipilih
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

    // Ambil data kelurahan ketika kecamatan dipilih
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
        alert("Profil berhasil diperbarui.");
      } else {
        alert(`Gagal memperbarui profil: ${data.message}`);
      }
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  return (
    <div className="bg-[#080B2A] items-center min-h-screen">
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
                <h2 className="text-white text-xl mb-3 font-semibold text-center">
                  Edit Profile
                </h2>
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
                <p className="capitalize text-center mb-7">{role}</p>
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
                        name="no_hp"
                        value={formData.no_hp}
                        onChange={handleChange}
                        className="w-full border bg-white/30 text-white placeholder-white border-blue-400 p-2 rounded-lg"
                        placeholder="No HP"
                      />
                    </div>
                    <div>
                      <label className="text-white">Password</label>
                      <input
                        type="password"
                        name="password"
                        onChange={handleChange}
                        className="w-full border bg-white/30 text-white placeholder-white border-blue-400 p-2 rounded-lg"
                        placeholder="Isi jika ingin mengganti"
                      />
                    </div>
                    {/* <div>
                      <label className="text-white">Role</label>
                      <input
                        type="role"
                        name="role"
                        onChange={handleChange}
                        value={formData.role}
                        className="w-full border bg-white/30 text-white placeholder-white border-blue-400 p-2 rounded-lg"
                        placeholder="Isi jika ingin mengganti"
                      />
                    </div> */}
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
