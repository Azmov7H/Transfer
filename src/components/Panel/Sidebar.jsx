"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import Logo from "../Logo/Logo"
import {
  LayoutDashboard,
  Plus,
  History,
  User,
  Settings,
  LogOut,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { Button } from "../ui/button"

export default function AppSidebar() {
  const pathname = usePathname()


  // ✅ تحديد الدور (مستخدم / أدمن)

  // ✅ روابط المستخدم العادي
  const userLinks = [
    { href: "/panel", label: "Dashboard", icon: LayoutDashboard },
    { href: "/panel/add-product", label: "Add Product", icon: Plus },
    { href: "/panel/history", label: "Orders History", icon: History  },
    { href: "/panel/profile", label: "Profile", icon: User },
    { href: "/panel/settings", label: "Settings", icon: Settings },
  ]


  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2 font-semibold text-lg tracking-tight px-2 py-4">
            <Logo />
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="space-y-2 mt-8">
              {userLinks.map(({ href, label, icon: Icon }) => {
                const active = pathname.startsWith(href)
                return (
                  <SidebarMenuItem key={href}>
                    <SidebarMenuButton asChild isActive={active}>
                      <Link
                        href={href}
                        className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-colors ${active
                            ? "bg-primary text-white shadow-md"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="text-sm font-medium">{label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-3">
        <Button
         
          variant="ghost"
          className="flex items-center gap-2 w-full justify-start text-sm text-red-600 hover:text-red-700"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
