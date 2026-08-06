"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { ArrowLeft, Smartphone, ScanLine } from "lucide-react"

export default function ScanPage() {
  const router = useRouter()

  const cards = [
    {
      title: "Mobile Scan",
      icon: Smartphone,
      route: "/scan/mobile",
    },
    {
      title: "Zebra Scan",
      icon: ScanLine,
      route: "/scan/zebra",
    },
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col items-center">

      {/* 🔥 Banner with Back Button */}
      <div className="relative w-full">
        <Image
          src="/banner.png"
          alt="Banner"
          width={1536}
          height={380}
          priority
          className="w-full h-auto object-contain"
        />
      </div>

      {/* Heading */}
      <div className="text-center mt-6 mb-8 px-4">
        <h1 className="text-3xl font-bold text-zinc-900">
          Select Scan Type
        </h1>
        <p className="text-gray-500 mt-1">
          Choose how you want to scan participants
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl px-4 pb-4">

        {cards.map((card, i) => {
          const Icon = card.icon

          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <Card
                onClick={() => router.push(card.route)}
                className="cursor-pointer rounded-2xl shadow-md hover:shadow-xl transition border"
              >
                <CardContent className="flex flex-col items-center justify-center h-36 gap-3">

                  {/* Icon */}
                  <div className="p-3 rounded-full bg-gray-100">
                    <Icon className="h-7 w-7 text-gray-700" />
                  </div>

                  {/* Title */}
                  <h2 className="text-lg font-semibold text-zinc-800">
                    {card.title}
                  </h2>

                </CardContent>

                {/* 🔥 Bottom CTA bar (same as your buttons) */}
                <div className="px-4 pb-4">
                  <Button
                    className="w-full bg-orange-800 hover:bg-orange-900 text-white"
                  >
                    Start
                  </Button>
                </div>
              </Card>
            </motion.div>
          )
        })}

      </div>
    </div>
  )
}