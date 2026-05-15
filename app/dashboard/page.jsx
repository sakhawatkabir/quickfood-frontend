"use client";
import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  fetchOwnerRestaurants,
  fetchOwnerMenuItems,
  fetchUserOrders,
} from "@/lib/api";
import { Store, UtensilsCrossed, ShoppingBag } from "lucide-react";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  preparing: "bg-blue-100 text-blue-800",
  out_for_delivery: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const DashboardPage = () => {
  const { data: restaurants = [] } = useQuery({
    queryKey: ["owner-restaurants"],
    queryFn: fetchOwnerRestaurants,
  });

  const { data: menuItems = [] } = useQuery({
    queryKey: ["owner-menu-items"],
    queryFn: fetchOwnerMenuItems,
  });

  const { data: orders = [] } = useQuery({
    queryKey: ["user-orders"],
    queryFn: fetchUserOrders,
  });

  const pendingOrders = orders.filter((o) => o.status === "pending");

  const stats = [
    {
      label: "Restaurants",
      value: restaurants.length,
      icon: <Store className="h-6 w-6 text-white" />,
      bg: "bg-black",
      href: "/dashboard/restaurants",
    },
    {
      label: "Menu Items",
      value: menuItems.length,
      icon: <UtensilsCrossed className="h-6 w-6 text-white" />,
      bg: "bg-gray-700",
      href: "/dashboard/menu-items",
    },
    {
      label: "Total Orders",
      value: orders.length,
      icon: <ShoppingBag className="h-6 w-6 text-white" />,
      bg: "bg-gray-500",
      href: "/dashboard/orders",
    },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="flex items-center gap-4 bg-white rounded-lg shadow p-5 hover:shadow-md transition-shadow"
          >
            <div className={`${stat.bg} p-3 rounded-lg`}>{stat.icon}</div>
            <div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Pending Orders</h2>
          <Link
            href="/dashboard/orders"
            className="text-sm text-gray-500 hover:text-black"
          >
            View all
          </Link>
        </div>

        {pendingOrders.length === 0 ? (
          <p className="text-gray-500 text-sm">No pending orders.</p>
        ) : (
          <div className="divide-y">
            {pendingOrders.slice(0, 5).map((order) => (
              <div
                key={order.id}
                className="py-3 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium text-sm">Order #{order.id}</p>
                  <p className="text-xs text-gray-500">
                    {order.restaurant?.name} &mdash; {order.delivery_address}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-sm">
                    ${parseFloat(order.total_cost).toFixed(2)}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status] ?? "bg-gray-100 text-gray-800"}`}
                  >
                    {order.status.replace(/_/g, " ")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
