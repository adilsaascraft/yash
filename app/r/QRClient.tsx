"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { QRCodeCanvas } from "qrcode.react";
import * as htmlToImage from "html-to-image";
import Image from "next/image";
import { Download, Loader2 } from "lucide-react";

export default function QRClient() {
  const searchParams = useSearchParams();
  const regNum = searchParams.get("regNum");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const downloadQrCard = async () => {
    const node = document.getElementById("qr-card");
    if (!node || !regNum) return;

    const dataUrl = await htmlToImage.toPng(node, {
      backgroundColor: "#ffffff",
      pixelRatio: 3,
    });

    const link = document.createElement("a");
    link.download = `${regNum}-qr.png`;
    link.href = dataUrl;
    link.click();
  };

  if (!regNum) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Invalid QR Link</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-green-700" />
        <p>Your QR Code is being loaded...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-green-50 to-green-100 px-4">
      <div className="space-y-6 text-center">

        <h1 className="text-2xl font-bold text-green-800">
          Your Entry Pass
        </h1>

        <div
          id="qr-card"
          className="relative mx-auto w-[320px] rounded-2xl overflow-hidden shadow-xl border bg-white"
        >
          <div className="bg-gradient-to-r from-green-700 to-green-600 text-white py-3 text-center">
            <p className="text-sm font-semibold">
              6th Edition of Times Property Expo
            </p>
          </div>

          <div className="p-6 flex flex-col items-center space-y-4">

            <Image
              src="/logo.png"
              alt="logo"
              width={120}
              height={120}
              className="absolute opacity-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            />

            <div className="bg-white p-4 rounded-xl border shadow-sm">
              <QRCodeCanvas value={regNum} size={160} />
            </div>

            <p className="text-sm font-semibold text-green-800">
              {regNum}
            </p>

            <p className="text-xs text-gray-500">
              Scan at entry gate
            </p>
          </div>
        </div>

        <button
          onClick={downloadQrCard}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-green-700 text-white rounded w-full"
        >
          <Download className="h-4 w-4" />
          Download QR
        </button>
      </div>
    </div>
  );
}