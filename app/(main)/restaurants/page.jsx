"use client";

import RestaurantList from "@/components/RestaurantList";
import { fetchRestaurants } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const RestaurantPage = () => {
  const { data: restaurants = [], isLoading, error } = useQuery({
    queryKey: ["restaurants"],
    queryFn: fetchRestaurants,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <p className="text-xl">Loading restaurants...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <p className="text-xl text-red-500">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">All Restaurants</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.map((item) => (
          <RestaurantList item={item} key={item.id} />
        ))}
      </div>
    </div>
  );
};

export default RestaurantPage;
