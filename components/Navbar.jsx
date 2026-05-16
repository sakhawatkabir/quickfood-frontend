"use client";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/app/context/AuthContext";
import { useCart } from "@/app/context/CartContext";
import { fetchMenuItems, fetchRestaurants } from "@/lib/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ShoppingCart,
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  Search,
  MapPin,
  UtensilsCrossed,
  ChevronDown,
} from "lucide-react";

const Navbar = () => {
  const router = useRouter();
  const { isAuthenticated, setIsAuthenticated, userRole } = useAuth();
  const { cartItems } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const mobileSearchInputRef = useRef(null);

  const { data: menuItems = [] } = useQuery({
    queryKey: ["menu-items"],
    queryFn: fetchMenuItems,
    staleTime: 5 * 60 * 1000,
  });

  const { data: restaurants = [] } = useQuery({
    queryKey: ["restaurants"],
    queryFn: fetchRestaurants,
    staleTime: 5 * 60 * 1000,
  });

  const countItem = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredMenuItems = debouncedQuery
    ? menuItems
        .filter(
          (item) =>
            item.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
            item.description
              ?.toLowerCase()
              .includes(debouncedQuery.toLowerCase()),
        )
        .slice(0, 4)
    : [];

  const filteredRestaurants = debouncedQuery
    ? restaurants
        .filter(
          (r) =>
            r.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
            r.location?.toLowerCase().includes(debouncedQuery.toLowerCase()),
        )
        .slice(0, 3)
    : [];

  const hasResults =
    filteredMenuItems.length > 0 || filteredRestaurants.length > 0;

  useEffect(() => {
    if (mobileSearchOpen && mobileSearchInputRef.current) {
      mobileSearchInputRef.current.focus();
    }
  }, [mobileSearchOpen]);

  const handleSearchSelect = (href) => {
    setSearchQuery("");
    setShowResults(false);
    setMobileOpen(false);
    setMobileSearchOpen(false);
    router.push(href);
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    Cookies.remove("token");
    setIsAuthenticated(false);
    setMobileOpen(false);
    router.push("/login");
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/restaurants", label: "Restaurants" },
    { href: "/menu", label: "Menu" },
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-zinc-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="font-semibold text-xl text-orange-500">
            QuickFood
          </Link>

          {/* Search bar - desktop */}
          <div
            className="hidden md:block flex-1 max-w-md mx-6 relative"
            ref={searchRef}
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search dishes or restaurants..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowResults(true);
              }}
              onFocus={() => searchQuery && setShowResults(true)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-zinc-100 border border-transparent rounded-lg focus:bg-white focus:border-orange-300 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
            />
            {showResults && debouncedQuery && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-zinc-100 overflow-hidden z-50">
                {filteredRestaurants.length > 0 && (
                  <div>
                    <p className="px-4 pt-3 pb-1.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                      Restaurants
                    </p>
                    {filteredRestaurants.map((r) => (
                      <a
                        key={r.id}
                        href={`/restaurants/${r.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleSearchSelect(`/restaurants/${r.id}`);
                        }}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-orange-50 transition-colors"
                      >
                        <MapPin className="size-4 text-orange-500 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-zinc-800 truncate">
                            {r.name}
                          </p>
                          <p className="text-xs text-zinc-400 truncate">
                            {r.location || "No location"}
                          </p>
                        </div>
                      </a>
                    ))}
                  </div>
                )}
                {filteredMenuItems.length > 0 && (
                  <div>
                    <p className="px-4 pt-3 pb-1.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                      Dishes
                    </p>
                    {filteredMenuItems.map((item) => (
                      <a
                        key={item.id}
                        href={`/restaurants/${item.restaurant_id}/menu-items`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleSearchSelect(
                            `/restaurants/${item.restaurant_id}/menu-items`,
                          );
                        }}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-orange-50 transition-colors"
                      >
                        <UtensilsCrossed className="size-4 text-orange-500 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-zinc-800 truncate">
                            {item.name}
                          </p>
                          <p className="text-xs text-zinc-400 truncate">
                            {item.restaurant?.name || "QuickFood"}
                          </p>
                        </div>
                        <span className="text-sm font-semibold text-orange-500">
                          ${item.price}
                        </span>
                      </a>
                    ))}
                  </div>
                )}
                {!hasResults && (
                  <div className="px-4 py-6 text-center">
                    <p className="text-sm text-zinc-400">
                      No results for &quot;{debouncedQuery}&quot;
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="px-3 py-2 text-sm font-medium text-zinc-600 hover:text-orange-500 rounded-md transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/cart"
              className="relative p-2 text-zinc-600 hover:text-orange-500 transition-colors"
            >
              <ShoppingCart className="h-5 w-5" />
              {countItem > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-orange-500 text-white text-[10px] font-semibold rounded-full h-4.5 w-4.5 flex items-center justify-center min-w-[18px] h-[18px]">
                  {countItem}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1.5 text-sm text-zinc-600 hover:text-orange-500 transition-colors px-3 py-2 rounded-lg hover:bg-zinc-50">
                    <User className="size-4" />
                    <ChevronDown className="size-3" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {userRole === "restaurant_owner" && (
                    <DropdownMenuItem asChild>
                      <Link
                        href="/dashboard/restaurants"
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <LayoutDashboard className="size-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {userRole === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link
                        href="/admin"
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <LayoutDashboard className="size-4" />
                        Admin
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <User className="size-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-red-600 focus:text-red-600 cursor-pointer"
                  >
                    <LogOut className="size-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                href="/login"
                className="text-sm px-5 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile actions */}
          <div className="flex md:hidden items-center gap-1">
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="p-2 text-zinc-600 hover:text-orange-500 transition-colors"
            >
              <Search className="size-5" />
            </button>
            <Link
              href="/cart"
              className="relative p-2 text-zinc-600 hover:text-orange-500 transition-colors"
            >
              <ShoppingCart className="h-5 w-5" />
              {countItem > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-orange-500 text-white text-[10px] font-semibold rounded-full min-w-[18px] h-[18px] flex items-center justify-center">
                  {countItem}
                </span>
              )}
            </Link>
            {!isAuthenticated && (
              <Link
                href="/login"
                className="text-sm px-4 py-1.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
              >
                Sign In
              </Link>
            )}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 text-zinc-600"
            >
              {mobileOpen ? (
                <X className="size-5" />
              ) : (
                <Menu className="size-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile search overlay */}
      {mobileSearchOpen && (
        <div
          className="md:hidden bg-white border-t border-zinc-100 shadow-lg"
          ref={searchRef}
        >
          <div className="container mx-auto px-4 py-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
              <input
                ref={mobileSearchInputRef}
                type="text"
                placeholder="Search dishes or restaurants..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowResults(true);
                }}
                onFocus={() => searchQuery && setShowResults(true)}
                className="w-full pl-10 pr-10 py-2.5 text-sm bg-zinc-100 border border-transparent rounded-lg focus:bg-white focus:border-orange-300 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
              />
              <button
                onClick={() => {
                  setMobileSearchOpen(false);
                  setSearchQuery("");
                  setShowResults(false);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
              >
                <X className="size-4" />
              </button>
            </div>
            {showResults && debouncedQuery && (
              <div className="mt-2 bg-zinc-50 rounded-xl overflow-hidden">
                {filteredRestaurants.length > 0 && (
                  <div>
                    <p className="px-4 pt-3 pb-1.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                      Restaurants
                    </p>
                    {filteredRestaurants.map((r) => (
                      <a
                        key={r.id}
                        href={`/restaurants/${r.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleSearchSelect(`/restaurants/${r.id}`);
                        }}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-orange-50 transition-colors"
                      >
                        <MapPin className="size-4 text-orange-500 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-zinc-800 truncate">
                            {r.name}
                          </p>
                          <p className="text-xs text-zinc-400 truncate">
                            {r.location || "No location"}
                          </p>
                        </div>
                      </a>
                    ))}
                  </div>
                )}
                {filteredMenuItems.length > 0 && (
                  <div>
                    <p className="px-4 pt-3 pb-1.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                      Dishes
                    </p>
                    {filteredMenuItems.map((item) => (
                      <a
                        key={item.id}
                        href={`/restaurants/${item.restaurant_id}/menu-items`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleSearchSelect(
                            `/restaurants/${item.restaurant_id}/menu-items`,
                          );
                        }}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-orange-50 transition-colors"
                      >
                        <UtensilsCrossed className="size-4 text-orange-500 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-zinc-800 truncate">
                            {item.name}
                          </p>
                          <p className="text-xs text-zinc-400 truncate">
                            {item.restaurant?.name || "QuickFood"}
                          </p>
                        </div>
                        <span className="text-sm font-semibold text-orange-500">
                          ${item.price}
                        </span>
                      </a>
                    ))}
                  </div>
                )}
                {!hasResults && (
                  <div className="px-4 py-6 text-center">
                    <p className="text-sm text-zinc-400">
                      No results for &quot;{debouncedQuery}&quot;
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-zinc-100 shadow-lg">
          <div className="container mx-auto px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block py-2 text-zinc-700 hover:text-orange-500 font-medium"
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-zinc-100 pt-3">
              {isAuthenticated ? (
                <>
                  {userRole === "restaurant_owner" && (
                    <Link
                      href="/dashboard/restaurants"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 py-2 text-zinc-700 hover:text-orange-500 font-medium"
                    >
                      <LayoutDashboard className="size-4" />
                      Dashboard
                    </Link>
                  )}
                  {userRole === "admin" && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 py-2 text-zinc-700 hover:text-orange-500 font-medium"
                    >
                      <LayoutDashboard className="size-4" />
                      Admin
                    </Link>
                  )}
                  <Link
                    href="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 py-2 text-zinc-700 hover:text-orange-500 font-medium"
                  >
                    <User className="size-4" />
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 py-2 text-red-500 font-medium w-full"
                  >
                    <LogOut className="size-4" />
                    Logout
                  </button>
                </>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
