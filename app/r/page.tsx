import { Suspense } from "react";
import QRClient from "./QRClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading QR...</div>}>
      <QRClient />
    </Suspense>
  );
}