import { MapPin } from "lucide-react";
import Link from "next/link";
import React from "react";

const RestaurantsItem = ({ item }) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden">
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
      <div className="py-2 px-4">
        <h3 className="text-xl font-bold mb-2">{item.name}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{item.description}</p>
        <div className="flex items-center text-gray-500 mb-4">
          <MapPin className="h-5 w-5 mr-1" />
          <span>{item.location}</span>
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

export default RestaurantsItem;
