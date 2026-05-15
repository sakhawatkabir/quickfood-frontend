"use client";
import { MapPin } from "lucide-react";
import Link from "next/link";
import React from "react";

const RestaurantList = ({ item }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="h-48 bg-gray-200 relative">
        {item.image ? (
          <img
            src={`${item.image}`}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-100">
            <span className="text-gray-400">No image available</span>
          </div>
        )}
      </div>
      <div className="p-5">
        <h2 className="text-xl font-bold mb-2">{item.name}</h2>
        <p className="text-gray-600 mb-4 line-clamp-2">
          {item.description || "No description available"}
        </p>

        <div className="flex items-center text-gray-500 mb-4">
          <MapPin className="h-5 w-5 mr-1" />
          <span>{item.location || "Location not specified"}</span>
        </div>

        <Link
          href={`/restaurants/${item.id}`}
          className="block w-full text-center bg-black text-white py-2 rounded-md hover:bg-gray-800 transition-colors"
        >
          View Restaurant
        </Link>
      </div>
    </div>
  );
};

export default RestaurantList;
