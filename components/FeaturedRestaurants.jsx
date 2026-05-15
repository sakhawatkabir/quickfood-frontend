"use client";

import Link from "next/link";
import { fetchRestaurants } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Utensils } from "lucide-react";
import RestaurantsItem from "./RestaurantsItem";

const FeaturedRestaurants = () => {
  const { data: allRestaurants = [], isLoading } = useQuery({
    queryKey: ["restaurants"],
    queryFn: fetchRestaurants,
  });

  const restaurants = allRestaurants.slice(0, 6);

  if (isLoading) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-100 rounded-xl h-80 animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (restaurants.length === 0) return null;

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 text-orange-500 mb-3">
              <Utensils className="w-5 h-5" />
              <span className="text-sm font-semibold uppercase tracking-wider">
                Top Picks
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Featured Restaurants
            </h2>
            <p className="text-gray-500 mt-2 max-w-lg">
              Handpicked favorites loved by our community — fresh food, fast
              delivery, every time.
            </p>
          </div>
          <Link
            href="/restaurants"
            className="inline-flex items-center gap-2 mt-4 md:mt-0 text-orange-500 font-semibold hover:text-orange-600 transition-colors"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((item) => (
            <RestaurantsItem item={item} key={item.id} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedRestaurants;
