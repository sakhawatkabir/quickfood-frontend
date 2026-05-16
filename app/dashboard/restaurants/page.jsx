"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { fetchOwnerRestaurants, deleteRestaurant } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit, Trash2, Plus, MapPin, Store, Star } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const RestaurantsPage = () => {
  const queryClient = useQueryClient();

  const {
    data: restaurants = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["owner-restaurants"],
    queryFn: fetchOwnerRestaurants,
  });

  const { mutate: remove } = useMutation({
    mutationFn: deleteRestaurant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owner-restaurants"] });
    },
  });

  const handleDelete = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this restaurant?")) return;
    remove(id);
  };

  if (isLoading) {
    return (
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="h-8 w-48 bg-zinc-200 rounded-lg animate-pulse" />
            <div className="h-4 w-64 bg-zinc-100 rounded mt-2 animate-pulse" />
          </div>
          <div className="h-10 w-40 bg-zinc-200 rounded-xl animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-zinc-100 rounded-xl h-80 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 text-lg">{error.message}</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-orange-500 mb-2">
            <Store className="size-5" />
            <span className="text-sm font-semibold uppercase tracking-wider">
              Your Listings
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold text-zinc-900">
            My Restaurants
          </h1>
          <p className="text-zinc-500 mt-1">Manage your restaurant listings</p>
        </div>
        <Link
          href="/dashboard/restaurants/add"
          className={cn(
            buttonVariants(),
            "bg-orange-500 hover:bg-orange-600 text-white rounded-xl px-5",
          )}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Restaurant
        </Link>
      </div>

      {restaurants.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-zinc-100">
          <Store className="w-14 h-14 text-zinc-300 mx-auto mb-4" />
          <p className="text-zinc-500 text-lg mb-1">No restaurants yet</p>
          <p className="text-sm text-zinc-400 mb-6">
            Create your first restaurant to get started
          </p>
          <Link
            href="/dashboard/restaurants/add"
            className={cn(
              buttonVariants(),
              "bg-orange-500 hover:bg-orange-600 text-white rounded-xl",
            )}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Restaurant
          </Link>
        </div>
      ) : (
        <>
          <p className="text-sm text-zinc-500 mb-6">
            {restaurants.length} restaurant{restaurants.length !== 1 && "s"}{" "}
            found
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <Link
                key={restaurant.id}
                href={`/dashboard/restaurants/edit/${restaurant.id}`}
                className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-zinc-100"
              >
                <div className="relative h-52 bg-zinc-200 overflow-hidden">
                  {restaurant.image ? (
                    <Image
                      src={restaurant.image}
                      alt={restaurant.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-gradient-to-br from-orange-50 to-orange-100">
                      <span className="text-orange-300 text-lg font-medium">
                        {restaurant.name}
                      </span>
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1 text-sm font-medium shadow-sm">
                    <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                    <span className="text-zinc-700">4.8</span>
                  </div>
                  {/* Action buttons overlay */}
                  <div className="absolute bottom-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={(e) => handleDelete(e, restaurant.id)}
                      className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-sm hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="size-4 text-red-500" />
                    </button>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold mb-1.5 group-hover:text-orange-500 transition-colors">
                    {restaurant.name}
                  </h3>
                  <p className="text-zinc-500 text-sm mb-3 line-clamp-2">
                    {restaurant.description || "No description available"}
                  </p>
                  <div className="flex items-center text-zinc-400 text-sm">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>
                      {restaurant.location || "Location not specified"}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default RestaurantsPage;
