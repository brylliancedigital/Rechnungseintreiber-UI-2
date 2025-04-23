"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const from = searchParams.get("from") || "/"

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simuliere eine Anmeldung (in einer echten Anwendung würde hier ein API-Aufruf stehen)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In einer echten Anwendung würde hier die Authentifizierung mit Supabase stattfinden
      // const { data, error } = await supabase.auth.signInWithPassword({
      //   email,
      //   password,
      // })

      // if (error) throw error

      toast({
        title: "Erfolgreich angemeldet",
        description: "Sie wurden erfolgreich angemeldet.",
        variant: "success",
      })

      // Weiterleitung zur ursprünglichen Seite oder zur Startseite
      router.push(from)
    } catch (error) {
      toast({
        title: "Anmeldung fehlgeschlagen",
        description: "Bitte überprüfen Sie Ihre Anmeldedaten und versuchen Sie es erneut.",
        variant: "destructive",
      })
      console.error("Login failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Anmelden</CardTitle>
          <CardDescription className="text-center">
            Geben Sie Ihre Anmeldedaten ein, um auf das Dashboard zuzugreifen
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-Mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@firma.de"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Passwort</Label>
                <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
                  Passwort vergessen?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></span>
                  Anmelden...
                </>
              ) : (
                "Anmelden"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
