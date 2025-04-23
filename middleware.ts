import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Diese Middleware würde in einer echten Anwendung für Authentifizierung verwendet werden
export function middleware(request: NextRequest) {
  // Beispiel für eine einfache Auth-Prüfung
  const isAuthenticated = true // In einer echten Anwendung würde dies aus einem Cookie oder Token kommen

  // Geschützte Routen
  const protectedPaths = ["/prozesse", "/kommunikation", "/konfiguration"]

  // Prüfen, ob der aktuelle Pfad geschützt ist
  const isProtectedPath = protectedPaths.some(
    (path) => request.nextUrl.pathname === path || request.nextUrl.pathname.startsWith(`${path}/`),
  )

  // Wenn der Pfad geschützt ist und der Benutzer nicht authentifiziert ist, zur Login-Seite umleiten
  if (isProtectedPath && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("from", request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

// Konfigurieren, für welche Pfade die Middleware ausgeführt werden soll
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|login).*)"],
}
