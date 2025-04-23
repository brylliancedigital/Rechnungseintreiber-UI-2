"use client"

import type React from "react"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { LayoutDashboard, ListTodo, MessageSquare, Settings, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
} from "@/components/ui/sidebar"

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const navItems = [
    { name: "Übersicht", href: "/", icon: LayoutDashboard, active: pathname === "/" },
    { name: "Prozesse", href: "/prozesse", icon: ListTodo, active: pathname === "/prozesse" },
    { name: "Kommunikation", href: "/kommunikation", icon: MessageSquare, active: pathname === "/kommunikation" },
    { name: "Konfiguration", href: "/konfiguration", icon: Settings, active: pathname === "/konfiguration" },
  ]

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-50">
        {/* Desktop Sidebar */}
        <Sidebar className="hidden md:flex">
          <SidebarHeader className="p-4">
            <h1 className="text-xl font-bold text-blue-600">KI-Dashboard</h1>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild isActive={item.active}>
                    <Link href={item.href} className="flex items-center">
                      <item.icon className="mr-2 h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        {/* Mobile Menu Button */}
        <div className="fixed top-0 left-0 z-40 md:hidden">
          <button type="button" className="p-4 text-gray-600" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            "fixed inset-0 z-30 bg-white transform transition-transform duration-300 ease-in-out md:hidden",
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="p-4 border-b">
            <h1 className="text-xl font-bold text-blue-600">KI-Dashboard</h1>
          </div>
          <nav className="p-4">
            <ul className="space-y-4">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center p-2 rounded-md",
                      item.active ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-100",
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 md:ml-0">
          <main className="min-h-screen pt-16 md:pt-0">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
