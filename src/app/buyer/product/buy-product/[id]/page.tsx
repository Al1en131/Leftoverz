"use client";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import { useState, useEffect } from "react";

declare global {
  interface Window {
    snap: {
      pay: (
        token: string,
        callbacks: {
          onSuccess?: (result: any) => void;
          onPending?: (result: any) => void;
          onError?: (result: any) => void;
          onClose?: () => void;
        }
      ) => void;
    };
  }
}

export default function BuyProduct() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const name = localStorage.getItem("name");
    const email = localStorage.getItem("email");
    const phone = localStorage.getItem("no_hp") || "08123456789"; 
    const id = localStorage.getItem("id");

    if (name && email && id) {
      setUser({
        name,
        email,
        phone,
        id,
      });
    }
  }, []);

  const handlePayment = async () => {
    if (!user) {
      alert("User belum login!");
      return;
    }

    const fullName = user.name || "User Tanpa Nama";
    const nameParts = fullName.trim().split(" ");
    const first_name = nameParts[0];
    const last_name = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";
    const token = localStorage.getItem("token");

    const res = await fetch(
      "http://127.0.0.1:1031/api/v1/create-midtrans-token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, 
        },
        body: JSON.stringify({
          order_id: "ORDER-ID-" + Date.now(),
          gross_amount: 60000,
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
      alert("Gagal mengambil token pembayaran.");
      return;
    }

    const data = await res.json();

    if (data.token) {
      window.snap.pay(data.token, {
        onSuccess: (result) => {
          alert("Pembayaran berhasil");
          console.log(result);
        },
        onPending: (result) => {
          alert("Menunggu pembayaran");
          console.log(result);
        },
        onError: (result) => {
          alert("Pembayaran gagal");
          console.error(result);
        },
        onClose: () => {
          alert("Popup pembayaran ditutup");
        },
      });
    } else {
      alert("Token pembayaran tidak diterima.");
    }
  };
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute("data-client-key", "YOUR_CLIENT_KEY"); 
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <>
      <Head>
        <script
          type="text/javascript"
          src="https://app.sandbox.midtrans.com/snap/snap.js"
          data-client-key=""
        ></script>
      </Head>

      <div className="bg-[#080B2A] min-h-screen flex flex-col items-center">
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
          <div className="bg-white/20 lg:p-10 p-7 border_section rounded-2xl">
            <div className="lg:flex lg:gap-2 relative max-lg:space-y-6 items-center h-auto">
              <div className="lg:w-1/3 max-lg:w-full">
                <div className="max-lg:flex items-center mb-4 gap-2 lg:hidden">
                  <span className="w-8 h-8 bg-gray-300 rounded-full"></span>
                  <p className="text-blue-400 text-xl tracking-wide font-semibold">
                    Alien
                  </p>
                </div>
                <Image
                  src="/images/hero-1.jpg"
                  alt=""
                  width={100}
                  height={100}
                  className="lg:w-60 h-60 max-lg:w-full object-cover rounded-lg"
                />
              </div>
              <div className="w-full">
                <div className="max-lg:hidden items-center mb-4 gap-2 lg:block">
                  <span className="w-8 h-8 bg-gray-300 rounded-full"></span>
                  <p className="text-blue-400 text-xl tracking-wide font-semibold">
                    Alien
                  </p>
                </div>
                <h3 className="text-blue-400 text-xl lg:mb-4 mb-2 font-bold tracking-wide">
                  Product Name
                </h3>
                <p className="text-base">Rp. 20.000</p>
                <div className="flex items-center gap-4 lg:absolute lg:bottom-0 lg:right-0 mt-4">
                  <button
                    onClick={handlePayment}
                    className="bg-[#15BFFD] px-6 py-3 text-center w-full text-white rounded-full hover:bg-transparent z-50 hover:text-[#15BFFD] hover:border-2 hover:border-[#15BFFD]"
                  >
                    Payment Gateway
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white/20 p-10 border_section  my-10  rounded-2xl">
            <h3 className="text-3xl font-bold text-blue-400">Payment Detail</h3>
            <div className="block items-center py-4 space-y-2 border-b mb-4 border-b-white">
              <div className="flex justify-between items-center">
                <p className="text-base text-white">Barang</p>
                <p className="text-base text-white">Rp.30.000</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-base text-white">Barang</p>
                <p className="text-base text-white">Rp.30.000</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-base text-white">Barang</p>
                <p className="text-base text-white">Rp.30.000</p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-base text-white font-bold tracking-wide">
                Total
              </p>
              <p className="text-base text-white">Rp.30.000</p>
            </div>
          </div>
          <Link
            href=""
            className="bg-white/20 px-6 py-3 text-center border border-blue-400 w-full flex justify-center text-white rounded-full hover:bg-transparent z-50 hover:text-[#15BFFD] hover:border-2 hover:border-[#15BFFD]"
          >
            Beli
          </Link>
        </div>
      </div>
    </>
  );
}
