import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Register from '@/lib/models/Register'

/* ==========================
   POST → Mark Day 1 Delivered
========================== */
export async function POST(req: Request) {
  try {
    await connectDB()

    const { regNum } = await req.json()

    if (!regNum) {
      return NextResponse.json(
        { success: false, message: 'Registration Number is required' },
        { status: 400 },
      )
    }

    const register = await Register.findOne({ regNum })

    if (!register) {
      return NextResponse.json(
        { success: false, message: 'Registration not found' },
        { status: 404 },
      )
    }

    if (register.dayOne === 'Delivered') {
      return NextResponse.json(
        {
          success: false,
          message: 'Day 1 already scanned',
          data: register,
        },
        { status: 404 },
      )
    }

    register.dayOne = 'Delivered'
    await register.save()

    return NextResponse.json({
      success: true,
      message: 'Day 1 scanned successfully',
      data: register,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 },
    )
  }
}

/* ==========================
   GET → Day 1 Delivered List
========================== */
export async function GET() {
  try {
    await connectDB()

    const data = await Register.find({ dayOne: 'Delivered' })

    return NextResponse.json({
      success: true,
      count: data.length,
      data,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 },
    )
  }
}
