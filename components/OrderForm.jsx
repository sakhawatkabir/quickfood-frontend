"use client";
import { useAuth } from "@/app/context/AuthContext";
import { useCart } from "@/app/context/CartContext";
import { createOrder } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const OrderForm = () => {
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { cartItems, clearCart } = useCart();
  const queryClient = useQueryClient();

  const { mutate, isPending, error, isSuccess } = useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      clearCart();
      queryClient.invalidateQueries({ queryKey: ["my-orders"] });
      router.push("/profile");
    },
  });

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    mutate({
      restaurant_id: cartItems[0].restaurant_id,
      items: cartItems.map((item) => ({
        menu_item_id: item.menu_item_id,
        quantity: item.quantity,
      })),
      delivery_address: deliveryAddress,
    });
  };

  return (
    <form className="space-y-3 mt-3" onSubmit={handlePlaceOrder}>
      <label
        htmlFor="delivery-address"
        className="block text-sm font-medium text-gray-700"
      >
        Delivery Address
      </label>
      <textarea
        id="delivery-address"
        value={deliveryAddress}
        onChange={(e) => setDeliveryAddress(e.target.value)}
        className="outline-none w-full px-3 py-2 border border-gray-300 rounded-md sm:text-sm"
        placeholder="Enter your delivery address"
        rows={3}
        required
      />

      {error && <p className="text-red-500 text-sm">{error.message}</p>}
      {isSuccess && (
        <p className="text-green-500 text-sm">Order placed! Redirecting...</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black disabled:opacity-60"
      >
        {isPending ? "Placing order..." : "Place Order"}
      </button>
    </form>
  );
};

export default OrderForm;
