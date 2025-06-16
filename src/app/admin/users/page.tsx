"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

type User = {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  role: string;
  payment_type: string;
  payment_account_number: string;
};

export default function User() {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [currentDate, setCurrentDate] = useState<string>("");
  const [dateString, setDateString] = useState({
    day: "",
    fullDate: "",
  });
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);

  const handleClosePopup = () => {
    setShowSuccessPopup(false);
    setShowErrorPopup(false);
    setShowConfirmPopup(false);
  };
  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const now = new Date();
    const optionsDay: Intl.DateTimeFormatOptions = { weekday: "long" };
    const optionsDate: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "short",
      year: "numeric",
    };

    const day = now.toLocaleDateString("id-ID", optionsDay);
    const fullDate = now.toLocaleDateString("id-ID", optionsDate);

    setDateString({ day, fullDate });
  }, []);

  useEffect(() => {
    const today = new Date();
    setCurrentDate(today.toLocaleDateString());
  }, [currentDate]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "https://backend-leftoverz-production.up.railway.app/api/v1/users",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (data?.users) {
          setUsers(data.users);
        } else {
          console.error("Data users tidak ditemukan dalam response.");
        }

        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch users:", error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const offset = (currentPage - 1) * itemsPerPage;

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleDelete = async () => {
    if (userToDelete === null) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://backend-leftoverz-production.up.railway.app/api/v1/user/delete/${userToDelete}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data?.message === "User deleted successfully") {
        setUsers(users.filter((user) => user.id !== userToDelete));
        setShowSuccessPopup(true);
        setSuccessMessage("User deleted successfully");
      } else {
        setShowErrorPopup(true);
        setErrorMessage("Failed to delete user");
      }
    } catch (error) {
      console.error("Failed to delete user:", error);
      setShowErrorPopup(true);
      setErrorMessage("An error occurred while deleting the user");
    }
    setShowConfirmPopup(false);
    setUserToDelete(null);
  };

  const confirmDelete = (id: number) => {
    setUserToDelete(id);
    setShowConfirmPopup(true);
  };

  const router = useRouter();
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
    <div className=" bg-[#060B26] text-white px-6 py-6 relative">
      {showConfirmPopup && (
        <div className="fixed inset-0 bg-black/55 flex items-center justify-center z-50">
          <div className="bg-[#080B2A] border-blue-400 border rounded-lg py-8 px-14 shadow-lg text-center">
            <div className="flex justify-center mb-4">
              <Image
                src="/images/warning.svg"
                width={80}
                height={80}
                alt="Confirm Delete"
                className="w-20 h-20"
              />
            </div>
            <h2 className="text-2xl font-bold mb-1 text-blue-400">
              Apakah kamu yakin?
            </h2>
            <p className="mb-6 text-blue-400">
              Apakah kamu ingin menghapus pengguna ini?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleClosePopup}
                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-full"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-full"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
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
            <h2 className="text-2xl font-bold mb-1 text-red-400">Error!</h2>
            <p className="mb-6 text-red-400">{errorMessage}</p>
            <button
              onClick={handleClosePopup}
              className="bg-red-400 hover:bg-red-500 text-white font-semibold py-2 px-6 rounded-full"
            >
              Ya
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
        <h1 className="text-3xl font-bold">User</h1>
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
            <span className="text-sm font-normal">Selamat Datang,</span>
            <h2 className="text-xl font-semibold mb-1">Admin Leftoverz</h2>
            <p className="text-sm text-gray-300">
              Selamat datang kembali! Kelola dashboard dengan mudah di sini
            </p>
            <Link
              href="/admin/"
              className="mt-4 text-white text-sm flex items-center gap-2"
            >
              Ketuk untuk ke dashboard →
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

      <div
        className="relative w-full rounded-lg"
        style={{
          background:
            "linear-gradient(to bottom right, rgba(6, 11, 38, 0.74), rgba(26, 31, 55, 0.5))",
        }}
      >
        <div className="px-6 pt-5 pb-8 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold">Daftar Pengguna</h3>
            <p>Daftar semua Pengguna</p>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <input
                type="text"
                placeholder="Cari..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pr-10 rounded text-white placeholder-gray-400 bg-transparent border border-gray-600 focus:outline-none"
              />
              <Search
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                size={18}
              />
            </div>
            <Link
              href="/admin/users/add"
              className="bg-blue-400 text-white font-medium rounded-lg px-4 py-2 flex items-center gap-2 shadow hover:bg-blue-500 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              Tambah
            </Link>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="min-w-max w-full rounded-lg my-4 overflow-hidden">
            <thead className="text-white text-md">
              <tr className="border-b-2 border-[#56577A]">
                <th className="px-4 py-3 text-center">No.</th>
                <th className="px-4 py-3 text-left">Nama</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-center">No. Hp</th>
                <th className="px-4 py-3 text-center">Tipe Pembayaran</th>
                <th className="px-4 py-3 text-center">No. Rek</th>
                <th className="px-4 py-3 text-center">Kategori</th>
                <th className="px-4 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-10">
                    Loading users...
                  </td>
                </tr>
              ) : (
                currentUsers.map((item, index) => (
                  <tr key={item.id} className="border-b border-[#56577A]">
                    <td className="px-4 py-4 text-center">
                      {index + offset + 1}
                    </td>
                    <td className="px-4 py-4 text-left">
                      {item.name.length > 25
                        ? item.name.slice(0, 25) + "..."
                        : item.name}
                    </td>
                    <td className="px-4 py-4 text-left">{item.email}</td>
                    <td className="px-4 py-4 text-center">
                      {item.phone_number}
                    </td>
                    <td className="px-4 py-4 capitalize text-center">
                      {item.payment_type || "-"}
                    </td>
                    <td className="px-4 py-4 text-center">
                      {item.payment_account_number || "-"}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span
                        className={`px-4 py-2 text-sm font-semibold capitalize rounded-full ${
                          item.role === "penjual"
                            ? "bg-blue-700 text-white"
                            : item.role === "pembeli"
                            ? "bg-blue-500 text-white"
                            : "bg-blue-400 text-white"
                        }`}
                      >
                        {item.role}
                      </span>
                    </td>
                    <td className="px-4 py-4 flex justify-center space-x-2">
                      <Link
                        href={`/admin/users/edit/${item.id}`}
                        className="inline-flex items-center justify-center px-1 py-1 text-sm font-bold text-white bg-blue-500 rounded-md shadow hover:bg-blue-600 transition"
                      >
                        <svg
                          className="w-4 h-4"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M18 5V4a1 1 0 0 0-1-1H8.914a1 1 0 0 0-.707.293L4.293 7.207A1 1 0 0 0 4 7.914V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5M9 3v4a1 1 0 0 1-1 1H4m11.383.772 2.745 2.746m1.215-3.906a2.089 2.089 0 0 1 0 2.953l-6.65 6.646L9 17.95l.739-3.692 6.646-6.646a2.087 2.087 0 0 1 2.958 0Z"
                          />
                        </svg>
                      </Link>
                      <button
                        onClick={() => confirmDelete(item.id)}
                        className="inline-flex items-center justify-center p-1 text-sm font-bold text-white bg-red-500 rounded-md shadow hover:bg-red-600 transition"
                      >
                        <svg
                          className="w-4 h-4"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center my-6">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 text-white bg-blue-400 rounded-md mx-2"
          >
            Prev
          </button>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage * itemsPerPage >= filteredUsers.length}
            className="px-4 py-2 text-white bg-blue-400 rounded-md mx-2"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
