"use client";

import RestaurantList from "@/components/RestaurantList";
import { fetchRestaurants } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Search, Utensils } from "lucide-react";
import React, { useState } from "react";

const RestaurantPage = () => {
  const [search, setSearch] = useState("");
  const {
    data: restaurants = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["restaurants"],
    queryFn: fetchRestaurants,
    staleTime: 0,
  });

  const filtered = restaurants.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.location?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 py-14">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 text-orange-400 mb-3">
            <Utensils className="size-5" />
            <span className="text-sm font-semibold uppercase tracking-wider">
              Explore
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold text-white mb-3">
            All Restaurants
          </h1>
          <p className="text-zinc-400 mb-8 max-w-md mx-auto">
            Discover the best restaurants near you
          </p>

          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by name or location..."
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-zinc-100 rounded-xl h-80 animate-pulse"
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
                ? "No restaurants match your search"
                : "No restaurants available"}
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-zinc-500 mb-6">
              {filtered.length} restaurant{filtered.length !== 1 && "s"} found
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((item) => (
                <RestaurantList item={item} key={item.id} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RestaurantPage;
