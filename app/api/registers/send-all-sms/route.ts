import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Register from '@/lib/models/Register'
import { sendRegisterSMS } from '@/lib/utils/sendSMS'

export async function POST() {
  try {
    await connectDB()

    const users = await Register.find()

    if (!users.length) {
      return NextResponse.json({
        success: false,
        message: 'No users found',
      })
    }

    let successCount = 0
    let failedCount = 0

    for (const user of users) {
      try {
        const qrLink = `expo.registrationteam.in/r?regNum=${user.regNum}`

        await sendRegisterSMS({
          mobile: user.mobile,
          name: user.name,
          regNum: user.regNum,
          safeQrLink: qrLink,
        })

        successCount++

        // ⏳ small delay (VERY IMPORTANT)
        await new Promise((resolve) => setTimeout(resolve, 300))
      } catch (err) {
        console.error(`❌ Failed for ${user.mobile}`)
        failedCount++
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Bulk SMS completed',
      total: users.length,
      sent: successCount,
      failed: failedCount,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 },
    )
  }
}
