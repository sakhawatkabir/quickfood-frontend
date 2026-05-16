"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { fetchRestaurant } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { ArrowLeft, MapPin, Star, Clock, Phone } from "lucide-react";

const RestaurantDetailPage = () => {
  const params = useParams();

  const {
    data: restaurant,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["restaurant", params.id],
    queryFn: () => fetchRestaurant(params.id),
    enabled: !!params.id,
  });

  if (isLoading) {
    return (
      <div className="bg-white min-h-screen">
        <div className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 py-14">
          <div className="container mx-auto px-4">
            <div className="h-5 w-32 bg-zinc-700 rounded animate-pulse mb-6" />
            <div className="h-8 w-64 bg-zinc-700 rounded animate-pulse mb-3" />
            <div className="h-4 w-48 bg-zinc-700 rounded animate-pulse" />
          </div>
        </div>
        <div className="container mx-auto px-4 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="h-72 bg-zinc-100 rounded-xl animate-pulse mb-8" />
              <div className="h-6 w-40 bg-zinc-100 rounded animate-pulse mb-4" />
              <div className="h-4 w-full bg-zinc-100 rounded animate-pulse mb-2" />
              <div className="h-4 w-3/4 bg-zinc-100 rounded animate-pulse" />
            </div>
            <div className="h-48 bg-zinc-100 rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="bg-white min-h-screen">
        <div className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 py-14">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl font-semibold text-white">Restaurant</h1>
          </div>
        </div>
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-zinc-500 text-lg mb-6">
            {error?.message || "Restaurant not found"}
          </p>
          <Link
            href="/restaurants"
            className="inline-flex items-center gap-2 bg-orange-500 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-orange-600 transition-colors"
          >
            <ArrowLeft className="size-4" />
            Back to Restaurants
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 py-14">
        <div className="container mx-auto px-4">
          <Link
            href="/restaurants"
            className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-orange-400 text-sm mb-6 transition-colors"
          >
            <ArrowLeft className="size-4" />
            Back to Restaurants
          </Link>
          <h1 className="text-3xl md:text-4xl font-semibold text-white mb-3">
            {restaurant.name}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-zinc-400 text-sm">
            <div className="flex items-center gap-1.5">
              <MapPin className="size-4" />
              <span>{restaurant.location || "Location not specified"}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Star className="size-4 text-yellow-500 fill-yellow-500" />
              <span className="text-white">4.8</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            <div className="relative h-72 bg-zinc-200 rounded-xl overflow-hidden mb-8">
              {restaurant.image ? (
                <Image
                  src={restaurant.image}
                  alt={restaurant.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-gradient-to-br from-orange-50 to-orange-100">
                  <span className="text-orange-300 text-2xl font-medium">
                    {restaurant.name}
                  </span>
                </div>
              )}
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-zinc-900 mb-3">About</h2>
              <p className="text-zinc-600 leading-relaxed">
                {restaurant.description || "No description available."}
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-zinc-50 rounded-xl p-6 text-center">
              <h3 className="font-semibold text-zinc-900 mb-2">Hungry?</h3>
              <p className="text-zinc-500 text-sm mb-4">
                Browse the full menu and order now
              </p>
              <Link
                href={`/restaurants/${params.id}/menu-items`}
                className="inline-block w-full bg-orange-500 text-white py-3 px-6 rounded-xl font-medium hover:bg-orange-600 transition-colors"
              >
                View Menu Items
              </Link>
            </div>

            {restaurant.hours && (
              <div className="bg-zinc-50 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="size-5 text-orange-500" />
                  <h3 className="font-semibold text-zinc-900">Opening Hours</h3>
                </div>
                <p className="text-zinc-600 text-sm">{restaurant.hours}</p>
              </div>
            )}

            {restaurant.contact && (
              <div className="bg-zinc-50 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Phone className="size-5 text-orange-500" />
                  <h3 className="font-semibold text-zinc-900">Contact</h3>
                </div>
                <p className="text-zinc-600 text-sm">{restaurant.contact}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetailPage;
