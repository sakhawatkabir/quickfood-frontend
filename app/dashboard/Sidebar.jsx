"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import {
  LayoutDashboard,
  ShoppingBag,
  Menu as MenuIcon,
  PlusCircle,
  Store,
  Home,
  LogOut,
  X,
  UtensilsCrossed,
} from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { Separator } from "@/components/ui/separator";

export default function Sidebar({ onClose }) {
  const router = useRouter();
  const pathname = usePathname();
  const { setIsAuthenticated } = useAuth();

  const isActive = (path) => pathname === path;

  const navigation = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Restaurants", href: "/dashboard/restaurants", icon: Store },
    { name: "Menu Items", href: "/dashboard/menu-items", icon: MenuIcon },
    {
      name: "Add Menu Item",
      href: "/dashboard/menu-items/add",
      icon: PlusCircle,
    },
    { name: "Orders", href: "/dashboard/orders", icon: ShoppingBag },
  ];

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
          href="/"
          className="flex items-center gap-2 font-semibold text-lg"
        >
          <UtensilsCrossed className="size-5 text-primary" />
          <span>QuickFood</span>
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
        <p className="px-3 mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Menu
        </p>
        <nav className="space-y-1">
          {navigation.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <Separator />
      <div className="p-3 space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <Home className="h-4 w-4" />
          <span>Visit Homepage</span>
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium rounded-lg text-muted-foreground hover:text-destructive hover:bg-muted transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
