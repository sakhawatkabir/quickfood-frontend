"use client";
import MenuItem from "@/components/MenuItem";
import { fetchMenuItems } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Search, UtensilsCrossed } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";

const ITEMS_PER_PAGE = 4;

const MenuPage = () => {
  const [search, setSearch] = useState("");
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const {
    data: menuItems = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["menu-items"],
    queryFn: fetchMenuItems,
    staleTime: 0,
  });

  const filtered = menuItems.filter((item) => {
    const q = search.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      item.description?.toLowerCase().includes(q) ||
      item.restaurant?.name?.toLowerCase().includes(q)
    );
  });

  const displayed = filtered.slice(0, displayCount);
  const hasMore = displayCount < filtered.length;

  useEffect(() => {
    setDisplayCount(ITEMS_PER_PAGE);
  }, [search]);

  useEffect(() => {
    if (!hasMore) return;

    let timeoutId = null;
    const handleScroll = () => {
      if (isLoadingMore) return;

      const scrollBottom =
        window.innerHeight + document.documentElement.scrollTop;
      const docHeight = document.documentElement.offsetHeight;

      if (scrollBottom >= docHeight - 300) {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          setIsLoadingMore(true);
          setTimeout(() => {
            setDisplayCount((prev) => prev + ITEMS_PER_PAGE);
            setIsLoadingMore(false);
          }, 500);
        }, 100);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [hasMore, isLoadingMore]);

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 py-14">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 text-orange-400 mb-3">
            <UtensilsCrossed className="size-5" />
            <span className="text-sm font-semibold uppercase tracking-wider">
              Our Menu
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold text-white mb-3">
            All Menu Items
          </h1>
          <p className="text-zinc-400 mb-8 max-w-md mx-auto">
            Browse dishes from all your favorite restaurants
          </p>

          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by name, description or restaurant..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-10">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-zinc-100 rounded-xl h-40 animate-pulse"
              />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 text-lg">{error.message}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-zinc-400 text-lg">
              {search
                ? "No menu items match your search"
                : "No menu items available"}
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-zinc-500 mb-6">
              Showing {displayed.length} of {filtered.length} item
              {filtered.length !== 1 && "s"}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {displayed.map((item) => (
                <MenuItem item={item} key={item.id} />
              ))}
            </div>

            {/* Loading  */}
            {isLoadingMore && (
              <div className="flex justify-center py-8">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" />
                </div>
              </div>
            )}

            {!hasMore && displayed.length > ITEMS_PER_PAGE && (
              <p className="text-center text-sm text-zinc-400 py-6">
                You&apos;ve seen all {filtered.length} items
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MenuPage;
