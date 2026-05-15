"use client";

import React from "react";
import Link from "next/link";
import { fetchMyOrders } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import {
  MapPin,
  Package,
  ArrowLeft,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  ChefHat,
} from "lucide-react";

const formatCurrency = (amount) => `$${parseFloat(amount).toFixed(2)}`;

const statusConfig = {
  pending: {
    icon: Clock,
    bg: "bg-gray-100",
    text: "text-gray-600",
    dot: "bg-gray-400",
  },
  preparing: {
    icon: ChefHat,
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    dot: "bg-yellow-400",
  },
  out_for_delivery: {
    icon: Truck,
    bg: "bg-blue-50",
    text: "text-blue-700",
    dot: "bg-blue-400",
  },
  delivered: {
    icon: CheckCircle2,
    bg: "bg-green-50",
    text: "text-green-700",
    dot: "bg-green-400",
  },
  cancelled: {
    icon: XCircle,
    bg: "bg-red-50",
    text: "text-red-700",
    dot: "bg-red-400",
  },
};

const OrderHistory = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["my-orders"],
    queryFn: fetchMyOrders,
  });

  const orders = data?.orders ?? [];

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Order History</h2>
        </div>
        <div className="p-5 space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-32 bg-gray-100 rounded-xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <p className="text-red-500 text-center">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-gray-100">
        <h2 className="font-semibold text-gray-900">
          Order History ({orders.length})
        </h2>
      </div>

      {orders.length === 0 ? (
        <div className="p-8 text-center">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 mb-1">No orders yet</p>
          <p className="text-sm text-gray-400 mb-4">
            Place your first order to see it here
          </p>
          <Link
            href="/menu"
            className="inline-flex items-center gap-1.5 text-sm text-orange-500 hover:text-orange-600 font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Browse Menu
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {orders.map((order) => {
            const status = statusConfig[order.status] || statusConfig.pending;
            const StatusIcon = status.icon;

            return (
              <div key={order.id} className="p-5">
                {/* Order header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">Order</span>
                    <span className="text-sm font-semibold text-gray-900">
                      #{order.id}
                    </span>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${status.dot}`}
                    />
                    {order.status.replace(/_/g, " ")}
                  </span>
                </div>

                {/* Delivery address */}
                <div className="flex items-start gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-500">
                    {order.delivery_address || "No delivery address provided"}
                  </p>
                </div>

                {/* Items */}
                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <ul className="space-y-1.5">
                    {order.items.map((item, index) => (
                      <li key={index} className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {item.quantity}x {item.name}
                        </span>
                        <span className="font-medium text-gray-900">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Total</span>
                  <span className="font-bold text-gray-900">
                    {formatCurrency(order.total_cost)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
