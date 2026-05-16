"use client";

import { useCart } from "@/app/context/CartContext";
import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import React from "react";

const Cart = ({ item }) => {
  const { updateItemQuantity, removeItem } = useCart();

  const handleQuantityChange = (id, quantity) => {
    if (quantity >= 1) {
      updateItemQuantity(id, quantity);
    }
  };

  const handleRemoveItem = (id) => {
    removeItem(id);
  };

  return (
    <div className="flex items-center gap-4">
      {/* Image */}
      <div className="relative size-20 bg-zinc-100 rounded-lg overflow-hidden flex-shrink-0">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gradient-to-br from-orange-50 to-orange-100">
            <span className="text-orange-300 text-xs font-medium">
              {item.name}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-zinc-900 truncate">{item.name}</h3>
        <p className="text-sm text-orange-500 font-medium">${item.price}</p>
      </div>

      {/* Quantity */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
          className="size-8 flex items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 hover:border-orange-300 hover:text-orange-500 transition-colors"
        >
          <Minus size={14} />
        </button>
        <span className="w-8 text-center font-medium text-zinc-900">
          {item.quantity}
        </span>
        <button
          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
          className="size-8 flex items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 hover:border-orange-300 hover:text-orange-500 transition-colors"
        >
          <Plus size={14} />
        </button>
      </div>

      {/* Subtotal */}
      <div className="flex items-center gap-3">
        <span className="font-semibold text-zinc-900 w-16 text-right">
          ${(item.price * item.quantity).toFixed(2)}
        </span>
        <button
          onClick={() => handleRemoveItem(item.id)}
          className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default Cart;
