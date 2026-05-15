"use client";

import React from "react";
import Link from "next/link";
import { fetchRestaurant } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import MenuItem from "@/components/MenuItem";
import { ArrowLeft } from "lucide-react";

const RestaurantMenuItemsPage = () => {
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

  const menuItems = restaurant?.menus ?? [];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <p className="text-xl">Loading menu...</p>
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
          href={`/restaurants/${params.id}`}
          className="inline-flex items-center text-gray-600 hover:text-black"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          Back to Restaurant
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">{restaurant.name} — Menu</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {menuItems.length > 0 ? (
          menuItems.map((item) => <MenuItem key={item.id} item={item} />)
        ) : (
          <div className="col-span-2 text-center py-12">
            <p className="text-xl text-gray-500">
              No menu items available for this restaurant.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantMenuItemsPage;
