"use client";
import React from "react";
import Link from "next/link";
import { fetchOwnerRestaurants, deleteRestaurant } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit, Trash2, PlusCircle } from "lucide-react";

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

  const handleDelete = (id) => {
    if (!confirm("Are you sure you want to delete this restaurant?")) return;
    remove(id);
  };

  if (isLoading) return <div className="text-center py-10">Loading...</div>;
  if (error)
    return (
      <div className="text-red-500 text-center py-10">{error.message}</div>
    );

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Restaurants</h1>
        <Link
          href="/dashboard/restaurants/add"
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
        >
          <PlusCircle size={18} />
          <span>Add Restaurant</span>
        </Link>
      </div>

      {restaurants.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-500">No restaurants found</p>
        </div>
      ) : (
        <div className="w-full space-y-5">
          {restaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100"
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">
                  {restaurant.name}
                </h2>
                <p className="text-gray-600 mb-3">{restaurant.description}</p>
                <p className="text-gray-500 text-sm mb-4">
                  <span className="font-medium">Location:</span>{" "}
                  {restaurant.location}
                </p>
                <div className="flex flex-wrap justify-end mt-4 gap-4">
                  <Link
                    href={`/dashboard/restaurants/edit/${restaurant.id}`}
                    className="flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <Edit size={16} className="mr-1" />
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(restaurant.id)}
                    className="flex items-center text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={16} className="mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantsPage;
