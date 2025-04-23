import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "KI-Prozess Dashboard",
  description: "Steuerung und Echtzeitüberwachung von automatisierten KI-basierten Kommunikationsprozessen",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="de">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
