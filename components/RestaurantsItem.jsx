import { MapPin, Star } from "lucide-react";
import Link from "next/link";
import React from "react";

const RestaurantsItem = ({ item }) => {
  return (
    <Link
      href={`/restaurants/${item.id}`}
      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
    >
      <div className="h-52 bg-gray-200 relative overflow-hidden">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gradient-to-br from-orange-50 to-orange-100">
            <span className="text-orange-300 text-lg font-medium">
              {item.name}
            </span>
          </div>
        )}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1 text-sm font-medium shadow-sm">
          <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
          <span className="text-gray-700">4.8</span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold mb-1.5 group-hover:text-orange-500 transition-colors">
          {item.name}
        </h3>
        <p className="text-gray-500 text-sm mb-3 line-clamp-2">
          {item.description}
        </p>
        <div className="flex items-center text-gray-400 text-sm">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{item.location}</span>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantsItem;
