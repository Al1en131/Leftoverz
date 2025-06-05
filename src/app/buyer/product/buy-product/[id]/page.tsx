"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

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
  used_duration: string;
  original_price: number;
  seller?: { id: number; name: string };
  user?: {
    subdistrict: string;
    ward: string;
    regency: string;
    province: string;
    name: string;
  };
};

type User = {
  name: string;
  email: string;
  phone: string;
  id: string;
  role: string;
  address: string;
  subdistrict: string;
  province: string;
  ward: string;
  regency: string;
  postal_code: string;
  payment_account_number: string;
  account_holder_name: string;
  payment_type: string;
};
declare global {
  interface Window {
    snap: {
      pay: (
        token: string,
        callbacks: {
          onSuccess?: (result: unknown) => void;
          onPending?: (result: unknown) => void;
          onError?: (result: unknown) => void;
          onClose?: () => void;
        }
      ) => void;
    };
  }
}
type MidtransResult = {
  payment_type: string;
  transaction_status: string;
};

export default function BuyProduct() {
  const [user, setUser] = useState<User | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const router = useRouter();
  const params = useParams();
  const productId = params?.id;
  const [userId, setUserId] = useState<number | null>(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const { theme, setTheme } = useTheme();

  const handleCloseSuccessPopup = () => {
    setShowSuccessPopup(false);
    router.push("/buyer/my-order");
  };

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme && storedTheme !== theme) {
      setTheme(storedTheme);
    }
  }, [theme, setTheme]);

  useEffect(() => {
    const storedUserId = localStorage.getItem("id");
    const token = localStorage.getItem("token");

    if (storedUserId && token) {
      const id = Number(storedUserId);
      setUserId(id);

      const fetchUser = async () => {
        try {
          const response = await fetch(
            `https://backend-leftoverz-production.up.railway.app/api/v1/user/${id}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const data = await response.json();
          if (data?.user) {
            setUser({
              ...data.user,
              id: String(data.user.id),
            });
          }
        } catch (error) {
          console.error("Failed to fetch user:", error);
        }
      };

      fetchUser();
    }
  }, [userId]);

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `https://backend-leftoverz-production.up.railway.app/api/v1/product/detail/${productId}`
        );
        const data = await res.json();

        if (!res.ok) throw new Error(data.message);

        const p = data.product;
        let imageArray: string[] = [];

        if (typeof p.image === "string") {
          try {
            imageArray = JSON.parse(p.image);
          } catch {
            imageArray = [p.image];
          }
        } else if (Array.isArray(p.image)) {
          imageArray = p.image;
        }

        const formattedImages = imageArray.map(
          (imgUrl: string) =>
            `https://backend-leftoverz-production.up.railway.app${imgUrl}`
        );

        setProduct({
          ...p,
          image: formattedImages,
        });
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error(err.message);
        } else {
          console.error("An unknown error occurred");
        }
      }
    };

    fetchProduct();
  }, [productId]);

  const handlePayment = async () => {
    if (!user || !product) {
      alert("User atau Produk belum siap.");
      return;
    }

    const token = localStorage.getItem("token");
    const nameParts = user.name.trim().split(" ");
    const first_name = nameParts[0];
    const last_name = nameParts.slice(1).join(" ");
    const order_id = "ORDER-ID-" + Date.now();

    try {
      const res = await fetch(
        "https://backend-leftoverz-production.up.railway.app/api/v1/create-midtrans-token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            order_id,
            gross_amount: product.price + 5000,
            customer: {
              first_name,
              last_name,
              email: user.email,
              phone: user.phone,
            },
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Gagal mendapatkan token dari Midtrans");
      }

      const data = await res.json();

      if (!data.token) {
        alert("Token pembayaran tidak tersedia.");
        return;
      }

      const saveTransaction = async (result: unknown) => {
        const { payment_type, transaction_status } = result as MidtransResult;

        // Validasi status yang benar-benar sukses (biasanya "settlement" atau "capture")
        const isSuccess =
          transaction_status === "settlement" ||
          transaction_status === "capture";

        if (!isSuccess) {
          alert("Transaksi belum selesai. Silakan selesaikan pembayaran.");
          return;
        }

        const total = product.price + 5000;
        try {
          const saveRes = await fetch(
            "https://backend-leftoverz-production.up.railway.app/api/v1/create/transaction",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                order_id,
                buyer_id: user.id,
                seller_id: product.user_id,
                item_id: product.id,
                payment_method: payment_type || "unknown",
                status: transaction_status || "unknown",
                total,
              }),
            }
          );
          const saveData = await saveRes.json();
          console.log("✅ Transaksi berhasil disimpan:", saveData);

          setSuccessMessage(
            "Pembayaran berhasil! Terima kasih telah bertransaksi."
          );
          setShowSuccessPopup(true);
        } catch (err) {
          console.error("❌ Gagal menyimpan transaksi:", err);
        }
      };

      window.snap.pay(data.token, {
        onSuccess: (result) => saveTransaction(result as MidtransResult),
        onPending: (result) => saveTransaction(result as MidtransResult),
        onError: (result) => {
          alert("❌ Pembayaran gagal.");
          console.error(result);
        },
        onClose: () => {
          alert("Pembayaran dibatalkan.");
        },
      });
    } catch (error) {
      console.error("❌ Error saat handlePayment:", error);
    }
  };

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme && storedTheme !== theme) {
      setTheme(storedTheme);
    }
  }, [theme, setTheme]);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };
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
    <>
      <Script
        src="https://app.midtrans.com/snap/snap.js"
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="afterInteractive"
      />

      <div className={`min-h-screen flex flex-col items-center bg-[#080B2A]`}>
        {showSuccessPopup && (
          <div className="fixed inset-0 bg-black/55 flex items-center justify-center z-50">
            <div className="bg-[#080B2A] border-blue-400 border z-50 rounded-lg py-8 px-14 shadow-lg text-center">
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
                onClick={handleCloseSuccessPopup}
                className="bg-blue-400 hover:bg-blue-500 text-white font-semibold py-2 px-6 rounded-full"
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
          src="/images/Star-1.svg"
          className="w-8 absolute top-48 right-26 opacity-35 -z-0"
        />
        <Image
          width={100}
          height={100}
          alt=""
          src="/images/Star-1.svg"
          className="w-4 absolute top-36 right-[500px] opacity-35 -z-0"
        />
        <Image
          width={100}
          height={100}
          alt=""
          src="/images/Star-1.svg"
          className="w-4 absolute top-[750px] left-56 opacity-35 -z-0"
        />
        <Image
          width={100}
          height={100}
          alt=""
          src="/images/Star-1.svg"
          className="w-4 absolute top-[700px] right-[300px] opacity-35 -z-0"
        />
        <div className="lg:p-20 max-lg:px-6 max-lg:py-14 mt-10 w-full">
          <div className={`lg:p-10 p-7 border_section rounded-2xl bg-white/20`}>
            <div className="lg:flex lg:gap-2 relative max-lg:space-y-6 items-center h-auto">
              <div className="lg:w-1/3 max-lg:w-full">
                <div className="max-lg:flex items-center mb-4 gap-2 lg:hidden">
                  <span
                    className={`w-10 h-10 text-sm rounded-full flex items-center justify-center ${
                      theme === "dark"
                        ? "text-blue-400 bg-white"
                        : "text-white bg-blue-400"
                    }`}
                  >
                    {user?.name
                      ? user?.name
                          .split(" ")
                          .map((word) => word.charAt(0))
                          .join("")
                          .toUpperCase()
                      : "?"}
                  </span>
                  <p className={`font-semibold text-lg text-white`}>
                    {user?.name}
                  </p>
                </div>
                <Image
                  src={
                    product?.image &&
                    Array.isArray(product.image) &&
                    product.image.length > 0
                      ? product.image[0]
                      : "/images/default-product.png"
                  }
                  alt="Product Image"
                  width={100}
                  height={100}
                  className="lg:w-60 h-60 max-lg:w-full object-cover rounded-lg"
                />
              </div>
              <div className="w-full">
                <div className="flex items-center gap-2 max-lg:hidden">
                  <span
                    className={`w-10 h-10 text-sm rounded-full flex items-center justify-center ${
                      theme === "dark"
                        ? "text-white bg-blue-400"
                        : "text-white bg-blue-400"
                    }`}
                  >
                    {user?.name
                      ? user?.name
                          .split(" ")
                          .map((word) => word.charAt(0))
                          .join("")
                          .toUpperCase()
                      : "?"}
                  </span>
                  <p className={`font-semibold text-lg text-white`}>
                    {user?.name}
                  </p>
                </div>

                <p className={`text-base mb-2 lg:ps-12 text-white`}>
                  {user?.address
                    ?.toLowerCase()
                    .replace(/\b\w/g, (c) => c.toUpperCase())}
                  , {user?.postal_code},{" "}
                  {user?.ward
                    ?.toLowerCase()
                    .replace(/\b\w/g, (c) => c.toUpperCase())}
                  ,{" "}
                  {user?.subdistrict
                    ?.toLowerCase()
                    .replace(/\b\w/g, (c) => c.toUpperCase())}
                  ,{" "}
                  {user?.regency
                    ?.toLowerCase()
                    .replace(/\b\w/g, (c) => c.toUpperCase())}
                  ,{" "}
                  {user?.province
                    ?.toLowerCase()
                    .replace(/\b\w/g, (c) => c.toUpperCase())}
                </p>
                <h3 className="text-blue-400 lg:ps-12 text-xl lg:mb-4 mb-2 font-bold tracking-wide">
                  {product?.name}
                </h3>

                <p className={`text-base lg:ps-12 text-white`}>
                  Rp {product?.price.toLocaleString("id-ID")}
                </p>
              </div>
            </div>
          </div>
          <div className={`p-10 border_section my-5 rounded-2xl bg-white/20`}>
            <h3 className="text-3xl font-bold text-blue-400">Payment Detail</h3>
            <div
              className={`block items-center py-4 space-y-2 mb-4 border-b border-b-white`}
            >
              <div className="flex justify-between items-center">
                <p className={`text-base text-white`}>{product?.name}</p>
                <p
                  className={`text-base text-white
                  `}
                >
                  Rp {product?.price.toLocaleString("id-ID")}
                </p>
              </div>
              <div className="flex justify-between items-center">
                <p className={`text-base text-white`}>Biaya Admin</p>
                <p className={`text-base text-white`}>Rp.5.000</p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <p className={`text-base font-bold tracking-wide text-white`}>
                Total
              </p>
              <p className={`text-base text-white`}>
                Rp{" "}
                {(product?.price ? product.price + 5000 : 0).toLocaleString(
                  "id-ID"
                )}
              </p>
            </div>
          </div>
          <button
            onClick={handlePayment}
            className={`px-6 py-3 text-center border w-full flex justify-center rounded-full z-50 border-blue-400 hover:bg-transparent hover:text-blue-400 hover:border-2 hover:border-blue-400 bg-white/20 text-white"
               `}
          >
            Beli Sekarang
          </button>
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
      </div>
    </>
  );
}
