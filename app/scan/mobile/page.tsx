'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import useSWR from 'swr'
import { Html5Qrcode } from 'html5-qrcode'
import { Button } from '@/components/ui/button'
import { ArrowLeft, CheckCircle2, X, XCircle } from 'lucide-react'
import { toast } from 'sonner'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

type ScanResult = {
  type: 'success' | 'error'
  message: string
  name: string
  mobile_number: string
  regNum: string
} | null


export default function QrScanner() {
  const router = useRouter()
  const scannerRef = useRef<Html5Qrcode | null>(null)

  const [isScanning, setIsScanning] = useState(false)
  const [result, setResult] = useState<ScanResult>(null)

  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/registers/day1`

  // Live Count
  const { data, mutate } = useSWR(apiUrl, fetcher)
  const count = data?.count ?? 0

  const playBeep = (type: 'success' | 'error') => {
    const ctx = new AudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.frequency.value = type === 'success' ? 880 : 220
    gain.gain.value = 0.15

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start()
    osc.stop(ctx.currentTime + 0.15)
  }

  const stopScanner = async () => {
    if (!scannerRef.current) return

    try {
      await scannerRef.current.stop()
      await scannerRef.current.clear()
    } catch {
      // ignore
    } finally {
      scannerRef.current = null
      setIsScanning(false)
    }
  }


const markDelivered = async (regNum: string) => {
  try {
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ regNum }),
    })

    const data = await res.json()
    const attendee = data.data || {}

    if (!data.success) {
      playBeep('error')
      navigator.vibrate?.([80, 40, 80])

      setResult({
        type: 'error',
        message: data.message || 'Scan failed',
        regNum: attendee.regNum || regNum,
        name: attendee.name || '-',
        mobile_number: attendee.mobile_number || '-',
      })

      return
    }

    playBeep('success')
    navigator.vibrate?.(120)

    setResult({
      type: 'success',
      message: data.message,
      regNum: attendee.regNum || regNum,
      name: attendee.name || '-',
      mobile_number: attendee.mobile_number || '-',
    })

    mutate()
  } catch (err: any) {
    playBeep('error')
    navigator.vibrate?.([80, 40, 80])

    setResult({
      type: 'error',
      message: err.message || 'Scan failed',
      regNum,
      name: '-',
      mobile_number: '-',
    })
  }
}


  const startScan = async () => {
    if (isScanning) return

    setResult(null)

    const scanner = new Html5Qrcode('qr-reader')
    scannerRef.current = scanner

    try {
      await scanner.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: {
            width: 260,
            height: 260,
          },
        },
        async (decodedText) => {
          await stopScanner()
          await markDelivered(decodedText)
        },
        () => {},
      )

      setIsScanning(true)
    } catch {
      toast.error('Camera permission denied')
    }
  }

  useEffect(() => {
    return () => {
      stopScanner()
    }
  }, [])

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="relative w-full overflow-hidden">
        <Image
          src="/banner.png"
          alt="Banner"
          width={1536}
          height={453}
          priority
          className="h-auto w-full object-contain"
        />

        <div className="absolute inset-0 bg-orange-900/30" />

        <Button
          size="icon"
          onClick={() => router.back()}
          className="absolute left-4 top-4 bg-white/90 text-black shadow-md hover:bg-white"
        >
          <ArrowLeft />
        </Button>
      </div>

      {/* Result */}
      {result && (
        <div
          className={`relative mx-auto max-w-sm rounded-xl p-4 text-white ${
            result.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          }`}
        >
          <button
            onClick={() => setResult(null)}
            className="absolute right-3 top-3"
            aria-label="Close result"
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

      {/* Scanner */}
      <div className="mx-auto w-full max-w-sm">
        <div id="qr-reader" className="overflow-hidden rounded-xl border" />
      </div>

      {/* Count + Button */}
      <div className="mx-auto max-w-sm space-y-3">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Total Scanned</p>
          <h2 className="text-3xl font-bold text-orange-800">{count}</h2>
        </div>

        <Button
          onClick={startScan}
          disabled={isScanning}
          className="w-full bg-orange-800 hover:bg-orange-900"
        >
          {isScanning ? 'Scanning…' : 'Start Scan'}
        </Button>
      </div>
    </div>
  )
}
