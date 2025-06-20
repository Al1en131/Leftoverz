"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

type Product = {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  role: string;
  image: string[];
  description: string;
  price: number;
  status: string;
  user_id: number;
  seller?: { name: string };
  user?: { subdistrict: string };
  created_at: string;
};
export default function SellerHome() {
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const { theme, setTheme } = useTheme();
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme && storedTheme !== theme) {
      setTheme(storedTheme);
    }
  }, [theme, setTheme]);

  // Fungsi untuk toggle tema
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) setEmail(storedEmail);
  }, [email]);
  const handleLogout = async () => {
    try {
      await fetch(
        "https://backend-leftoverz-production.up.railway.app/api/v1/logout",
        { method: "POST" }
      );
      localStorage.removeItem("token");
      localStorage.removeItem("email");
      localStorage.removeItem("role");
      localStorage.removeItem("name");
      localStorage.removeItem("id");
      router.push("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        const user_id = localStorage.getItem("id");
        const response = await fetch(
          `https://backend-leftoverz-production.up.railway.app/api/v1/products/user/${user_id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch products");
        }

        const data = await response.json();

        const parsedProducts = data.products
          .sort(
            (a: Product, b: Product) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          )
          .slice(0, 3)
          .map((product: Product) => {
            let parsedImage: string[] = [];

            if (typeof product.image === "string") {
              try {
                const parsed = JSON.parse(product.image);
                if (Array.isArray(parsed)) {
                  parsedImage = parsed;
                }
              } catch {
                parsedImage = [];
              }
            } else if (Array.isArray(product.image)) {
              parsedImage = product.image;
            }

            return {
              ...product,
              image: parsedImage,
              seller_name: product.seller?.name || "Unknown",
              subdistrict: product.user?.subdistrict || "Unknown",
            };
          });

        setProducts(parsedProducts);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Error fetching products:", error.message);
        } else {
          console.error("An unknown error occurred:", error);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

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
      className={` ${
        theme === "dark" ? "dark:bg-[#080B2A]" : "bg-white"
      }  items-center justify-items-center min-h-screen `}
    >
      {showLogoutPopup && (
        <div className="fixed inset-0 bg-black/55 flex items-center justify-center z-100">
          <div
            className={`border-blue-400 border rounded-lg py-8 px-14 shadow-lg text-center ${
              theme === "dark" ? "bg-[#080B2A]" : "bg-white"
            }`}
          >
            <div className="flex justify-center mb-4">
              <Image
                src="/images/warning.svg"
                width={80}
                height={80}
                alt="Confirm"
                className="w-20 h-20"
              />
            </div>
            <h2 className="text-2xl font-bold mb-1 text-blue-400">Logout</h2>
            <p className="mb-6 text-blue-400">
              Apakah Anda yakin ingin logout?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleLogout}
                className="bg-blue-400 hover:bg-blue-500 text-white font-semibold py-2 px-6 rounded-full"
              >
                Ya
              </button>
              <button
                onClick={() => setShowLogoutPopup(false)}
                className="bg-gray-400 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-full"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
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
          src="/images/Vector.svg"
          className="lg:h-[678px] lg:w-[514.09px] max-lg:h-44 max-lg:w-52 max-lg:hidden absolute top-28 right-0 -z-0"
        />
        <Image
          width={100}
          height={100}
          alt=""
          src="/images/Star-1.svg"
          className="w-8 absolute top-28 max-lg:right-10 right-26 -z-0"
        />
        <Image
          width={100}
          height={100}
          alt=""
          src="/images/Star-1.svg"
          className="w-4 absolute lg:top-28 max-lg:top-30 lg:right-96 max-lg:left-10 -z-0"
        />

        <Image
          width={100}
          height={100}
          alt=""
          src="/images/Star-1.svg"
          className="w-4 absolute lg:top-44 lg:left-56 max-lg:right-5 max-lg:top-72 -z-0"
        />
        <Image
          width={100}
          height={100}
          alt=""
          src="/images/Star-1.svg"
          className="w-4 absolute top-36 lg:left-[550px] max-lg:hidden -z-0"
        />
        <div className="lg:flex lg:justify-between max-lg:justify-center max-lg:w-full z-20 items-center lg:pt-36 max-lg:pt-36 lg:pb-16 max-lg:pb-14 lg:px-20 max-lg:px-6 max-lg:text-center text-left">
          <div className="lg:w-1/2 max-lg:w-full block lg:space-y-4 max-lg:space-y-1 z-20">
            <h1 className="lg:text-8xl max-lg:text-5xl leading-14 lg:mb-6 max-md:mb-2 font-bold text-blue-400">
              Left
              <span
                className={`${
                  theme === "dark" ? "text-white" : "text-[#080B2A]"
                }`}
              >
                overz
              </span>
            </h1>
            <p
              className={`lg:text-4xl max-lg:text-2xl tracking-wide font-bold z-20 ${
                theme === "dark" ? "text-white" : "text-[#080B2A]"
              }`}
            >
              Barang Bekas Kos dengan Harga Terjangkau dan Kualitas Terjamin
            </p>
            <p
              className={`text-lg max-lg:text-lg leading-6 max-lg:mt-3 z-20 ${
                theme === "dark" ? "text-white" : "text-[#080B2A]"
              }`}
            >
              Jual beli barang bekas kos yang masih layak pakai dan berkualitas.
              Hemat uang, dapatkan barang yang kamu butuhkan, dan bantu kurangi
              sampah.
            </p>
            <div className="flex gap-4 pt-4 max-lg:justify-center">
              <button
                onClick={() => setShowLogoutPopup(true)}
                className="bg-blue-400 px-4 py-3 max-lg:py-2 text-center text-white lg:w-36 rounded-full hover:bg-transparent hover:text-blue-400 hover:border-2 hover:border-blue-400"
              >
                Logout
              </button>
            </div>
          </div>
          <div className="z-50 w-1/2 max-lg:hidden">
            <Image
              width={100}
              height={10}
              alt="Hero"
              src="/images/hero-dark.svg"
              className={`z-40 w-full block max-lg:hidden ${
                theme === "dark" ? "hidden" : "block"
              }`}
            />
            <Image
              width={100}
              height={10}
              alt="Hero Dark"
              src="/images/hero.svg"
              className={`z-40 w-full block max-lg:hidden ${
                theme === "dark" ? "block" : "hidden"
              }`}
            />
          </div>
        </div>
        <div className="lg:justify-between max-lg:justify-center lg:px-20 max-lg:px-6 max-lg:py-6 max-lg:space-y-4 lg:flex max-lg:block items-center relative lg:mb-10 max-lg:mb-0 w-full">
          <Image
            width={100}
            height={100}
            alt=""
            src="/images/bubble-3.svg"
            className={`absolute left-0 -z-0 max-lg:h-72 max-lg:w-72 max-lg:bottom-0 lg:h-[456px] lg:w-[456px] lg:top-60 ${
              theme === "dark" ? "block" : "hidden"
            }`}
          />
          <Image
            width={100}
            height={100}
            alt=""
            src="/images/bubble-4.svg"
            className={`absolute -top-28 -z-0 right-0 max-lg:w-72 max-lg:h-72 lg:h-[356px] lg:w-[356px] ${
              theme === "dark" ? "block" : "hidden"
            }`}
          />
          <Image
            width={100}
            height={100}
            alt=""
            src="/images/Star-1.svg"
            className="w-4 absolute -top-10 lg:right-96 max-lg:right-24 -z-0"
          />
          <Image
            width={100}
            height={100}
            alt=""
            src="/images/Star-1.svg"
            className="w-5 absolute top-28 right-48 max-lg:hidden opacity-20 -z-0"
          />
          <Image
            width={100}
            height={100}
            alt=""
            src="/images/Star-1.svg"
            className="w-5 absolute top-20 right-20 opacity-20 max-lg:hidden -z-0"
          />
          <Image
            width={100}
            height={100}
            alt=""
            src="/images/Star-1.svg"
            className="w-4 absolute top-10 opacity-20 left-56 max-lg:hidden -z-0"
          />
          <Image
            width={100}
            height={100}
            alt=""
            src="/images/Star-1.svg"
            className="w-4 absolute top-56 opacity-20 left-[850px] max-lg:hidden -z-0"
          />
          <div
            className={`absolute inset-0 z-0 ${
              theme === "dark" ? "bg-white/5" : "bg-blue-400"
            }`}
          ></div>

          <div className="relative z-50 lg:flex lg:justify-between max-lg:block max-lg:py-4 max-lg:text-center max-lg:space-y-4 items-center w-full">
            <div
              className={`lg:w-2/4 max-lg:w-full ${
                theme === "dark" ? "text-white" : "text-[#080B2A]"
              }`}
            >
              <h4 className="lg:text-5xl max-lg:text-4xl font-bold pb-4">
                Tentang Kami
              </h4>
              <p className="text-lg max-lg:text-justify mb-6">
                Leftoverz hadir untuk memberikan solusi praktis dan terpercaya
                bagi para anak kost dan perantau yang ingin menjual atau membeli
                barang bekas berkualitas dengan mudah. Kami menawarkan fitur
                pengiriman yang handal, pencarian visual yang memudahkan
                menemukan barang impian, serta sistem pembayaran otomatis yang
                aman dan cepat. Dengan Leftoverz, proses pindah kost jadi lebih
                ringan, dan kebutuhan peralatan kost baru pun bisa terpenuhi
                tanpa harus merogoh kocek dalam.
              </p>

              <Link
                href="/about"
                className={`px-4 mt-4 py-3 text-center w-36 rounded-full hover:bg-transparent ${
                  theme === "dark"
                    ? "bg-blue-400 text-white hover:text-blue-400 hover:border-2 hover:border-blue-400"
                    : "bg-white text-[#080B2A] hover:text-white hover:border-2 hover:border-white"
                }`}
              >
                Baca Selengkapnya
              </Link>
            </div>
            <div className="lg:w-2/4 max-lg:w-full max-lg:pt-8 lg:flex lg:justify-end">
              <Image
                width={100}
                height={100}
                alt="Gambar Hero"
                src="/images/hero-2.svg"
                className="lg:h-[456px] max-lg:h-60 w-full"
              />
            </div>
          </div>
        </div>
        <div className="lg:p-20 max-lg:px-6 max-lg:py-12 w-full relative">
          <Image
            width={100}
            height={100}
            alt=""
            src="/images/bubble-5.svg"
            className={`absolute z-0 -bottom-20 left-0 lg:h-[456px] lg:w-[456px] max-lg:h-72 max-lg:w-72 ${
              theme === "dark" ? "lg:block" : "lg:hidden"
            } max-lg:hidden`}
          />
          <Image
            width={100}
            height={100}
            alt=""
            src="/images/Star-1.svg"
            className="w-8 absolute top-40 right-10 -z-0"
          />
          <Image
            width={100}
            height={100}
            alt=""
            src="/images/Star-1.svg"
            className="w-4 absolute lg:bottom-6 lg:right-96 max-lg:right-10 max-lg:bottom-0 -z-0"
          />
          <Image
            width={100}
            height={100}
            alt=""
            src="/images/Star-1.svg"
            className="w-4 absolute lg:top-20 max-lg:top-0 lg:left-56 max-lg:left-28 -z-0"
          />
          <div
            className={`text-center justify-center z-50 ${
              theme === "dark" ? "text-white" : "text-[#080B2A]"
            }`}
          >
            <h3 className="text-3xl font-bold ">Fitur</h3>
            <p className="">
              Fitur-fitur canggih yang memudahkan jual beli barang bekas dengan
              cepat dan aman.
            </p>

            <div className="lg:pt-14 max-lg:pt-8 lg:flex lg:justify-between max-lg:justify-center max-lg:w-full max-lg:block max-lg:space-y-4 items-center">
              <div className="border_section bg-transparent h-[350px]  rounded-xl p-5 lg:w-80 max-lg:w-full shadow-lg relative">
                <Image
                  width={100}
                  height={10}
                  alt=""
                  src="/images/camera.svg"
                  className="z-50 w-full h-3/4"
                />
                <div className="mt-4 h-1/4">
                  <p className="text-lg font-semibold ">Pencarian Visual</p>
                </div>
              </div>
              <div className="border_section bg-transparent h-[350px]  rounded-xl p-5 lg:w-80 max-lg:w-full shadow-lg relative">
                <Image
                  width={100}
                  height={10}
                  alt=""
                  src="/images/Bag.svg"
                  className="z-50 w-full h-3/4"
                />
                <div className="mt-4 h-1/4">
                  <p className="text-lg font-semibold ">
                    Pembayaran Auto Verfication
                  </p>
                </div>
              </div>
              <div className="border_section bg-transparent h-[350px]  rounded-xl p-5 lg:w-80 max-lg:w-full shadow-lg relative">
                <Image
                  width={100}
                  height={10}
                  alt=""
                  src="/images/Home.svg"
                  className="z-50 w-full h-3/4"
                />
                <div className="mt-4 h-1/4">
                  <p className="text-lg font-semibold ">
                    Terintegrasi pelacakan paket pengiriman
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:px-20 lg:pb-20 max-lg:px-6 max-lg:pb-12 w-full">
          <div className="flex flex-col items-center justify-center relative">
            <Image
              width={100}
              height={100}
              alt=""
              src="/images/Star-1.svg"
              className="w-4 absolute -bottom-8 lg:right-96 max-lg:right-5 -z-0"
            />
            <Image
              width={100}
              height={100}
              alt=""
              src="/images/Star-1.svg"
              className="w-4 absolute top-20 lg:left-56 max-lg:left-8 -z-0"
            />
            <Image
              width={100}
              height={100}
              alt=""
              src="/images/Star-1.svg"
              className="w-4 absolute lg:top-6 lg:right-20 max-lg:left-0 max-lg:-top-2 -z-0"
            />
            <Image
              width={100}
              height={100}
              alt=""
              src="/images/Star-1.svg"
              className="w-8 absolute lg:top-10 max-lg:top-16 right-5 -z-0"
            />
            <div
              className={`lg:pb-12 max-lg:pb-10 text-center ${
                theme === "dark" ? "text-white" : "text-[#080B2A]"
              }`}
            >
              <h3 className="text-3xl font-bold ">Bagaimana Cara Kerjanya?</h3>
              <p className="">
                Ikuti langkah mudah untuk jual atau beli barang bekas dengan
                cepat dan nyaman di Leftoverz.
              </p>
            </div>
            <div className="relative w-full">
              <div className="lg:px-20 max-lg:px-6 space-y-10">
                <div className="relative lg:flex max-lg:justify-center max-lg:w-full lg:justify-end">
                  <div className="relative lg:w-[580px] max-lg:-w-full p-5 text-[#080B2A] rounded-2xl border_style shadow-md bg-white/5">
                    <p className="text-xl font-bold mb-1 text-blue-400">
                      1. Login atau Registrasi
                    </p>
                    <p
                      className={`text-lg ${
                        theme === "dark" ? "text-white" : "text-[#080B2A]"
                      }`}
                    >
                      Pengguna dapat login jika sudah memiliki akun atau
                      melakukan registrasi dengan mengisi data seperti nama,
                      email, dan password.
                    </p>
                  </div>
                </div>
                <div className="relative lg:flex max-lg:block max-lg:justify-center lg:justify-start">
                  <div className="relative lg:w-[580px] max-lg:-w-full p-5 text-[#080B2A] rounded-2xl border_style shadow-md bg-white/5">
                    <p className="text-xl font-bold mb-1 text-blue-400">
                      2. Mencari Barang
                    </p>
                    <p
                      className={`text-lg ${
                        theme === "dark" ? "text-white" : "text-[#080B2A]"
                      }`}
                    >
                      Gunakan fitur pencarian dan filter untuk menemukan barang
                      yang diinginkan, lalu klik tombol detail untuk melihat
                      detailnya.
                    </p>
                  </div>
                </div>
                <div className="relative lg:flex max-lg:block max-lg:justify-center lg:justify-end">
                  <div className="relative lg:w-[580px] max-lg:-w-full p-5 text-[#080B2A] rounded-2xl border_style shadow-md bg-white/5">
                    <p className="text-xl font-bold mb-1 text-blue-400">
                      3. Memesan Barang
                    </p>
                    <p
                      className={`text-lg ${
                        theme === "dark" ? "text-white" : "text-[#080B2A]"
                      }`}
                    >
                      Klik &apos;Beli&apos; untuk melanjutkan ke proses
                      checkout, atau tambahkan ke favorit jika ingin
                      menyimpannya untuk nanti.
                    </p>
                  </div>
                </div>
                <div className="relative lg:flex max-lg:block max-lg:justify-center lg:justify-start">
                  <div className="relative lg:w-[580px] max-lg:-w-full p-5 text-[#080B2A] rounded-2xl border_style shadow-md bg-white/5">
                    <p className="text-xl font-bold mb-1 text-blue-400">
                      4. Mengisi Detail Pemesanan
                    </p>
                    <p
                      className={`text-lg ${
                        theme === "dark" ? "text-white" : "text-[#080B2A]"
                      }`}
                    >
                      Periksa pesanan, lalu klik tombol &apos;Beli
                      Sekarang&apos; pilih metode pembayaran yang akan
                      digunakan.
                    </p>
                  </div>
                </div>
                <div className="relative lg:flex max-lg:block max-lg:justify-center lg:justify-end">
                  <div className="relative lg:w-[580px] max-lg:-w-full p-5 text-[#080B2A] rounded-2xl border_style shadow-md bg-white/5">
                    <p className="text-xl font-bold mb-1 text-blue-400">
                      5. Pembayaran & Verifikasi Otomatis
                    </p>
                    <p
                      className={`text-lg ${
                        theme === "dark" ? "text-white" : "text-[#080B2A]"
                      }`}
                    >
                      Lakukan pembayaran sesuai instruksi. Sistem akan otomatis
                      memverifikasi tanpa perlu unggah bukti.
                    </p>
                  </div>
                </div>
                <div className="relative lg:flex max-lg:block max-lg:justify-center lg:justify-start">
                  <div className="relative lg:w-[580px] max-lg:-w-full p-5 text-[#080B2A] rounded-2xl border_style shadow-md bg-white/5">
                    <p className="text-xl font-bold mb-1 text-blue-400">
                      6. Mengambil atau Menerima Barang
                    </p>
                    <p
                      className={`text-lg ${
                        theme === "dark" ? "text-white" : "text-[#080B2A]"
                      }`}
                    >
                      Tunggu barang dikirim sesuai estimasi waktu, lalu
                      konfirmasi penerimaan dengan klik tombol &apos;Pesanan
                      Selesai&apos; di halaman detail pesanan.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:px-20 lg:pb-20 max-lg:px-6 max-lg:pb-12 w-full justify-center relative">
          <Image
            width={100}
            height={100}
            alt=""
            src="/images/bubble-6.svg"
            className={`lg:w-[456px] max-lg:w-72 absolute -top-44 left-0 -z-0 ${
              theme === "dark" ? "block" : "hidden"
            }`}
          />
          <Image
            width={100}
            height={100}
            alt=""
            src="/images/bubble-7.svg"
            className={`lg:w-[456px] max-lg:w-72 absolute -bottom-10 right-0 -z-0 ${
              theme === "dark" ? "block" : "hidden"
            }`}
          />
          <Image
            width={100}
            height={100}
            alt=""
            src="/images/Star-1.svg"
            className="w-8 absolute top-44 right-20 max-lg:hidden -z-0"
          />
          <div
            className={`pb-12 text-center ${
              theme === "dark" ? "text-white" : "text-[#080B2A]"
            }`}
          >
            <h3 className="text-3xl font-bold ">
              Produk Baru
            </h3>
            <p className="">
              Temukan produk-produk terbaru yang baru saja ditambahkan dan siap
              untuk kamu miliki.
            </p>
          </div>
          {loading ? (
            <div className="flex justify-center w-full py-10">
              <p className="text-blue-400 text-lg">Loading...</p>
            </div>
          ) : (
            <div className="lg:flex justify-center w-full max-lg:space-y-4 gap-10 z-50 items-center">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="lg:w-80 max-lg:w-full p-6 rounded-xl border_section shadow-lg bg-white/5 relative"
                >
                  <div className="mb-5">
                    <Image
                      src={
                        product.image &&
                        Array.isArray(product.image) &&
                        product.image.length > 0 &&
                        typeof product.image[0] === "string" &&
                        product.image[0].startsWith("/")
                          ? `https://backend-leftoverz-production.up.railway.app${product.image[0]}`
                          : "/images/default-product.png"
                      }
                      alt={product.name}
                      width={100}
                      height={100}
                      className={`w-full h-64 object-cover rounded-2xl ${
                        theme === "dark" ? "" : "border-[1.9px] border-blue-400"
                      }`}
                    />
                  </div>
                  <div className="mt-4">
                    <h3
                      className={`text-lg mb-1 font-bold tracking-wide ${
                        theme === "dark" ? "text-white" : "text-blue-400"
                      }`}
                    >
                      {product.name}
                    </h3>

                    <p className="text-blue-400 text-base">
                      {product.user?.subdistrict}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="flex justify-center mt-10">
            <Link
              href="/seller/product"
              className="bg-blue-400 px-4 py-3 text-center dark:text-white text-[#080B2A] w-36 rounded-full hover:bg-transparent hover:text-blue-400 hover:border-2 hover:border-blue-text-blue-400"
            >
              Selanjutnya
            </Link>
          </div>
        </div>
        <div className="relative w-full text-[#080B2A] dark:text-white shadow-md">
          <div className="lg:py-12 max-lg:pb-12 max-lg:px-6 lg:px-20">
            <div
              className={`lg:pb-12 max-lg:pb-10 text-center ${
                theme === "dark" ? "text-white" : "text-[#080B2A]"
              }`}
            >
              <h3 className="text-3xl font-bold">Profil Developer</h3>
              <p>
                Hubungi developer jika ada kendala atau masukan terkait website
                ini.
              </p>
            </div>
            <div className="bg-white/5 border-2 rounded-3xl p-8 border-blue-400">
              <div className="flex flex-col md:flex-row justify-center items-center gap-16">
                <Image
                  width={150}
                  height={200}
                  src="/images/alif.png"
                  alt="Alif Essa Nurcahyani"
                  className="rounded-2xl object-cover shadow-lg"
                />

                <div className="text-left">
                  <h2
                    className={` text-2xl font-semibold${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Alif Essa Nurcahyani
                  </h2>
                  <p
                    className={`mb-3 ${
                      theme === "dark" ? "text-blue-400" : "text-blue-400"
                    }`}
                  >
                    Web Developer | Frontend Developer
                  </p>
                  <p
                    className={`mb-2 max-lg:text-justify ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Saya adalah mahasiswa semester 8 di Universitas Muhammadiyah
                    PKU Surakarta dengan fokus pada Web Developer. Saya memiliki
                    pengalaman dalam menangani proyek mulai dari perancangan
                    hingga pengembangan front-end dan back-end, menggunakan
                    teknologi seperti Laravel, React JS, Vue.js, Express JS,
                    Next JS, Bootstrap, dan TailwindCSS.
                  </p>

                  <div className="flex flex-wrap gap-3 mt-3">
                    <a
                      href="https://wa.me/6285172041077"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-2 bg-green-500 flex items-center gap-2 text-white rounded-full hover:bg-green-600 transition"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 448 512"
                        className="w-6 h-6"
                        fill="currentColor"
                      >
                        <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
                      </svg>{" "}
                      WhatsApp
                    </a>
                    <a
                      href="https://www.linkedin.com/in/alif-essa-nurcahyani-4a0b85280/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-2 bg-blue-600 flex items-center gap-2 text-white rounded-full hover:bg-blue-700 transition"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 448 512"
                        className="w-5 h-5"
                        fill="currentColor"
                      >
                        <path d="M100.3 448H7.4V148.9h92.9zM53.8 108.1C24.1 108.1 0 83.5 0 53.8a53.8 53.8 0 0 1 107.6 0c0 29.7-24.1 54.3-53.8 54.3zM447.9 448h-92.7V302.4c0-34.7-.7-79.2-48.3-79.2-48.3 0-55.7 37.7-55.7 76.7V448h-92.8V148.9h89.1v40.8h1.3c12.4-23.5 42.7-48.3 87.9-48.3 94 0 111.3 61.9 111.3 142.3V448z" />
                      </svg>
                      LinkedIn
                    </a>
                    <a
                      href="https://www.instagram.com/alif_essa_nurcahyani"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-2 bg-pink-500 text-white flex items-center gap-2 rounded-full hover:bg-pink-600 transition"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 448 512"
                        className="w-6 h-6"
                        fill="currentColor"
                      >
                        <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
                      </svg>{" "}
                      Instagram
                    </a>
                    <a
                      href="https://github.com/Al1en131"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-2 bg-gray-600 text-white flex items-center gap-2 rounded-full hover:bg-gray-700 transition"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="w-6 h-6"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12 0C5.37 0 0 5.373 0 12a12 12 0 008.21 11.44c.6.11.82-.26.82-.58v-2.23c-3.34.73-4.04-1.61-4.04-1.61-.55-1.4-1.34-1.77-1.34-1.77-1.1-.76.09-.75.09-.75 1.22.09 1.86 1.25 1.86 1.25 1.08 1.85 2.83 1.31 3.52 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.34-5.47-5.97 0-1.32.47-2.4 1.24-3.25-.12-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.45 11.45 0 016 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.87.12 3.17.77.85 1.23 1.93 1.23 3.25 0 4.64-2.81 5.67-5.49 5.97.43.37.81 1.1.81 2.22v3.29c0 .32.21.7.82.58A12.01 12.01 0 0024 12c0-6.627-5.373-12-12-12z"
                          clipRule="evenodd"
                        />
                      </svg>
                      GitHub
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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
      </main>
    </div>
  );
}
