import { useCart } from "@/app/context/CartContext";
import { ShoppingBag } from "lucide-react";
import Image from "next/image";
import React from "react";

const MenuItem = ({ item }) => {
  const { addItem } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addItem({
      id: item.id,
      menu_item_id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: 1,
      restaurant_id: item.restaurant_id,
    });
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden border border-zinc-100 shadow-sm hover:shadow-md transition-all duration-300 flex">
      <div className="relative w-28 h-28 sm:w-36 sm:h-36 bg-zinc-200 flex-shrink-0">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gradient-to-br from-orange-50 to-orange-100">
            <span className="text-orange-300 text-sm font-medium">
              {item.name}
            </span>
          </div>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between min-w-0">
        <div>
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-semibold text-zinc-900 truncate">{item.name}</h3>
            <span className="text-sm font-semibold text-orange-500 whitespace-nowrap">
              ${item.price}
            </span>
          </div>
          {item.restaurant?.name && (
            <p className="text-xs text-zinc-400 mt-0.5">
              {item.restaurant.name}
            </p>
          )}
          <p className="text-zinc-500 text-sm mt-1.5 line-clamp-2">
            {item.description}
          </p>
        </div>
        <div className="mt-3">
          <button
            className="flex items-center gap-1.5 bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors"
            onClick={handleAddToCart}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuItem;
