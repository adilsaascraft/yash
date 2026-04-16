import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Register from "@/lib/models/Register";
import { sendRegisterSMS } from "@/lib/utils/sendSMS";

export async function POST(req: Request) {
 try {
  await connectDB();

  const body = await req.json();

  const {
   name,
   age,
   address,
   city,
   mobile,
   gender,
   profession,
   visitingDay,
  } = body;

  // validation
  if (
   !name ||
   !age ||
   !address ||
   !city ||
   !mobile ||
   !gender ||
   !profession ||
   !visitingDay
  ) {
   return NextResponse.json(
    { success: false, message: "All fields required" },
    { status: 400 }
   );
  }

  // mobile exists
  const exists = await Register.findOne({ mobile });
  if (exists) {
   return NextResponse.json(
    { success: false, message: "Mobile already registered" },
    { status: 409 }
   );
  }

  // generate reg number
  const last = await Register.findOne().sort({ createdAt: -1 });

  let next = 1001;
  if (last?.regNum) {
   next = parseInt(last.regNum.split("-")[1]) + 1;
  }

  const regNum = `REG-${next}`;

  const register = await Register.create({
   ...body,
   regNum,
   generateQR: true,
  });

  // send SMS (non-blocking)
  try {
   
   const qrLink = `${process.env.NEXT_PUBLIC_API_URL}/r?regNum=${regNum}`;
   const safeQrLink = qrLink.trim();
   await sendRegisterSMS({
    mobile: register.mobile,
    name: register.name,
    regNum: register.regNum,
    safeQrLink,
   });
  } catch (e) {
   const error = e as Error & { response?: { data: unknown } };
   console.error("❌ SMS ERROR:", error.response?.data || error.message)
  }

  return NextResponse.json({
   success: true,
   data: register,
  });
 } catch (error) {
  return NextResponse.json(
   { success: false, message: "Server error" },
   { status: 500 }
  );
 }
}

export async function GET() {
 await connectDB();

 const data = await Register.find().sort({ createdAt: -1 });

 return NextResponse.json({
  success: true,
  data,
 });
}