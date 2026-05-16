"use client";
import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import Cookies from "js-cookie";
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Store,
  UtensilsCrossed,
  Home,
  LogOut,
  X,
  Shield,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

const navigation = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { name: "Restaurants", href: "/admin/restaurants", icon: Store },
  { name: "Menu Items", href: "/admin/menu-items", icon: UtensilsCrossed },
];

export default function AdminSidebar({ onClose }) {
  const pathname = usePathname();
  const router = useRouter();
  const { setIsAuthenticated } = useAuth();

  const isActive = (path) => pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    Cookies.remove("token");
    setIsAuthenticated(false);
    router.push("/login");
  };

  return (
    <div className="w-full h-full flex flex-col bg-card border-r">
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-5 border-b">
        <Link
          href="/admin"
          className="flex items-center gap-2 font-semibold text-lg"
        >
          <Shield className="size-5 text-primary" />
          <span>Admin</span>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-md hover:bg-muted transition-colors"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4 px-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
          Management
        </p>
        <nav className="space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive(item.href)
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <item.icon className="size-4" />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-3 border-t">
        <Separator className="mb-3" />
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <Home className="size-4" />
          Visit Homepage
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="size-4" />
          Logout
        </button>
      </div>
    </div>
  );
}
