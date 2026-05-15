"use client";

import React from "react";
import Link from "next/link";
import { fetchMyOrders } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { MapPin } from "lucide-react";

const formatCurrency = (amount) => `$${parseFloat(amount).toFixed(2)}`;

const statusStyles = {
  pending: "bg-gray-200 text-gray-800",
  preparing: "bg-yellow-200 text-yellow-800",
  out_for_delivery: "bg-blue-200 text-blue-800",
  delivered: "bg-green-200 text-green-800",
  cancelled: "bg-red-200 text-red-800",
};

const OrderHistory = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["my-orders"],
    queryFn: fetchMyOrders,
  });

  const orders = data?.orders ?? [];

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error.message}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="border-b border-gray-400 py-3">
        <h2 className="text-xl font-semibold text-black text-center">
          Order History
        </h2>
      </div>

      {orders.length > 0 ? (
        <div className="px-4 py-4">
          <div className="grid gap-4">
            {orders.map((order) => (
              <div key={order.id} className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 flex justify-between items-center">
                  <div>
                    <span className="text-gray-500 text-sm">Order ID:</span>
                    <span className="font-medium ml-1">#{order.id}</span>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      statusStyles[order.status] ?? "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {order.status.replace(/_/g, " ")}
                  </span>
                </div>

                <div className="p-4">
                  <div className="flex items-start mb-4">
                    <MapPin className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <p className="ml-2 text-sm text-gray-600">
                      {order.delivery_address || "No delivery address provided"}
                    </p>
                  </div>

                  <div className="border-t border-gray-100 pt-3 mt-3">
                    <h4 className="font-medium text-sm mb-2">Order Items</h4>
                    <ul className="space-y-2">
                      {order.items.map((item, index) => (
                        <li
                          key={index}
                          className="flex justify-between text-sm"
                        >
                          <span className="text-gray-700">
                            {item.quantity}x {item.name}
                          </span>
                          <span className="font-medium">
                            {formatCurrency(item.price * item.quantity)}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex justify-between mt-4 pt-3 border-t border-gray-100">
                      <span className="font-medium">Total:</span>
                      <span className="font-bold">
                        {formatCurrency(order.total_cost)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">
            You haven&apos;t placed any orders yet.
          </p>
          <Link
            href="/menu"
            className="mt-4 inline-block px-4 py-2 bg-black text-white rounded"
          >
            Browse Menu
          </Link>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
