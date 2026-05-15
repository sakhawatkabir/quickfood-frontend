"use client";

import React from "react";
import Link from "next/link";
import { fetchRestaurant } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, MapPin } from "lucide-react";

const RestaurantDetailPage = () => {
  const params = useParams();
  const router = useRouter();

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
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <p className="text-xl">Loading restaurant details...</p>
        </div>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col justify-center items-center h-64">
          <p className="text-xl text-gray-600 mb-4">
            {error?.message || "Restaurant not found"}
          </p>
          <button
            onClick={() => router.push("/restaurants")}
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
          >
            Back to Restaurants
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href="/restaurants"
          className="inline-flex items-center text-gray-600 hover:text-black"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          Back to Restaurants
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="h-64 bg-gray-200 relative">
          {restaurant.image ? (
            <img
              src={`${process.env.NEXT_PUBLIC_URL}${restaurant.image}`}
              alt={restaurant.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-100">
              <span className="text-gray-400">No image available</span>
            </div>
          )}
        </div>

        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">{restaurant.name}</h1>

          <div className="flex items-center gap-1 text-gray-500 mb-6">
            <MapPin className="h-5 w-5" />
            <span>{restaurant.location}</span>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">About</h2>
            <p className="text-gray-600">{restaurant.description}</p>
          </div>

          {restaurant.hours && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-2">Opening Hours</h2>
              <p className="text-gray-600">{restaurant.hours}</p>
            </div>
          )}

          {restaurant.contact && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-2">Contact</h2>
              <p className="text-gray-600">{restaurant.contact}</p>
            </div>
          )}

          <div className="mt-8 flex justify-center">
            <Link
              href={`/restaurants/${params.id}/menu-items`}
              className="inline-block bg-black text-white py-2 px-6 rounded-md hover:bg-gray-800"
            >
              View Menu Items
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetailPage;
