import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Register from '@/lib/models/Register'

export async function POST(req: Request) {
  try {
    await connectDB()

    const { name, mobile } = await req.json()

    // Validation
    if (!name || !mobile) {
      return NextResponse.json(
        {
          success: false,
          message: 'Name and mobile are required',
        },
        { status: 400 },
      )
    }

    // Check if mobile already exists
    const exists = await Register.findOne({ mobile })

    if (exists) {
      return NextResponse.json(
        {
          success: false,
          message: 'Mobile already registered',
        },
        { status: 409 },
      )
    }

    // Generate registration number
    const last = await Register.findOne().sort({ createdAt: -1 })

    let next = 1001

    if (last?.regNum) {
      const lastNumber = Number(last.regNum.split('-')[1])

      if (!isNaN(lastNumber)) {
        next = lastNumber + 1
      }
    }

    const regNum = `YASH-${next}`

    const register = await Register.create({
      name,
      mobile,
      regNum,
      generateQR: true,
    })

    return NextResponse.json({
      success: true,
      data: register,
    })
  } catch (error) {
    console.error('REGISTER ERROR:', error)

    return NextResponse.json(
      {
        success: false,
        message: 'Server error',
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    await connectDB()

    const data = await Register.find().sort({ createdAt: -1 })

    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error) {
    console.error('GET REGISTER ERROR:', error)

    return NextResponse.json(
      {
        success: false,
        message: 'Server error',
      },
      { status: 500 },
    )
  }
}
