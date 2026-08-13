'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import useSWR from 'swr'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { ArrowLeft, CheckCircle2, X, XCircle } from 'lucide-react'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

type ScanResult = {
  type: 'success' | 'error'
  message: string
  name: string
  mobile_number: string
  regNum: string
} | null

export default function ZebraGateScanner() {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  const [scanValue, setScanValue] = useState('')
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState<ScanResult>(null)

  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/registers/day1`

  const { data, mutate } = useSWR(apiUrl, fetcher)
  const count = data?.count ?? 0

  useEffect(() => {
    inputRef.current?.focus()
  }, [result])

  const markAttendance = async (regNum: string) => {
    if (!regNum || processing) return

    setProcessing(true)
    setResult(null)

    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ regNum }),
      })

      const json = await res.json()
      const attendee = json.data || {}

      setResult({
        type: json.success ? 'success' : 'error',
        message: json.message,
        name: attendee.name || '-',
        mobile_number: attendee.mobile_number || '-',
        regNum: attendee.regNum || regNum,
      })

      if (json.success) {
        mutate()
      }

      setScanValue('')
    } catch (err: any) {
      toast.error(err.message || 'Scan failed')
      setScanValue('')
    } finally {
      setProcessing(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      await markAttendance(scanValue.trim())
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="relative">
        <Image
          src="/banner.png"
          alt="Banner"
          width={1536}
          height={380}
          priority
          className="h-auto w-full object-contain"
        />

        <Button
          size="icon"
          onClick={() => router.back()}
          className="absolute left-4 top-4 bg-white/90 text-black shadow-md hover:bg-white"
        >
          <ArrowLeft />
        </Button>
      </div>

      <div className="mx-auto max-w-xl space-y-6 p-4">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Total Attendance</p>
          <h2 className="text-4xl font-bold text-orange-800">{count}</h2>
        </div>

        {result && (
          <div
            className={`relative rounded-xl p-4 text-white ${
              result.type === 'success' ? 'bg-green-600' : 'bg-red-600'
            }`}
          >
            <button
              onClick={() => setResult(null)}
              className="absolute right-3 top-3"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2">
              {result.type === 'success' ? <CheckCircle2 /> : <XCircle />}

              <span className="font-bold">{result.message}</span>
            </div>

            <div className="mt-4 space-y-2 rounded-lg bg-white/20 p-4">
              <p>
                <strong>Reg No:</strong> {result.regNum}
              </p>
              <p>
                <strong>Name:</strong> {result.name}
              </p>
              <p>
                <strong>Mobile:</strong> {result.mobile_number}
              </p>
            </div>
          </div>
        )}

        <input
          ref={inputRef}
          value={scanValue}
          onChange={(e) => setScanValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Scan QR / Barcode..."
          autoFocus
          className="h-20 w-full rounded-2xl border px-6 text-2xl shadow-lg outline-none focus:ring-2 focus:ring-primary"
        />

        <Button
          onClick={() => markAttendance(scanValue.trim())}
          disabled={processing}
          className="h-14 w-full bg-orange-800 text-lg hover:bg-orange-900"
        >
          {processing ? 'Submitting...' : 'Submit'}
        </Button>
      </div>
    </div>
  )
}
