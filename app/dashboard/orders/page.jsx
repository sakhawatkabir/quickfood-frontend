"use client";
import { useState } from "react";
import { fetchUserOrders, updateOrderStatus } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Clock,
  CheckCircle,
  TruckIcon,
  XCircle,
  RefreshCw,
} from "lucide-react";

const statusOptions = [
  { value: "all", label: "All Orders" },
  { value: "pending", label: "Pending" },
  { value: "preparing", label: "Preparing" },
  { value: "out_for_delivery", label: "Out for Delivery" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

const statusIcons = {
  pending: <Clock className="h-4 w-4 text-yellow-500" />,
  preparing: <RefreshCw className="h-4 w-4 text-blue-500" />,
  out_for_delivery: <TruckIcon className="h-4 w-4 text-purple-500" />,
  delivered: <CheckCircle className="h-4 w-4 text-green-500" />,
  cancelled: <XCircle className="h-4 w-4 text-red-500" />,
};

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  preparing: "bg-blue-100 text-blue-800",
  out_for_delivery: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const OrdersPage = () => {
  const [statusFilter, setStatusFilter] = useState("all");
  const queryClient = useQueryClient();

  const {
    data: orders = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user-orders"],
    queryFn: fetchUserOrders,
  });

  const { mutate: changeStatus } = useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-orders"] });
    },
  });

  const filteredOrders =
    statusFilter === "all"
      ? orders
      : orders.filter((o) => o.status === statusFilter);

  if (isLoading) return <div className="text-center py-10">Loading...</div>;
  if (error)
    return (
      <div className="text-red-500 text-center py-10">{error.message}</div>
    );

  return (
    <div className="container mx-auto px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Orders</h1>
        <div className="flex flex-wrap gap-2 mb-6">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setStatusFilter(option.value)}
              className={`px-4 py-2 rounded-md text-sm ${
                statusFilter === option.value
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-500">No orders found</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-lg font-semibold">Order #{order.id}</h2>
                    {order.customer && (
                      <p className="text-gray-500 text-sm mt-0.5">
                        Customer: {order.customer.username}
                      </p>
                    )}
                    <p className="text-gray-600 text-sm mt-1">
                      {order.delivery_address}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[order.status] ?? "bg-gray-100 text-gray-800"}`}
                  >
                    {statusIcons[order.status]}
                    <span className="capitalize">
                      {order.status.replace(/_/g, " ")}
                    </span>
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h3 className="font-medium text-gray-900 mb-2">
                    Order Items
                  </h3>
                  <div className="divide-y divide-gray-200">
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className="py-3 flex justify-between items-center"
                      >
                        <div>
                          <span className="font-medium">{item.name}</span>
                          <span className="text-gray-500 ml-2">
                            x{item.quantity}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-gray-900">
                            ${parseFloat(item.total_price).toFixed(2)}
                          </div>
                          <div className="text-xs text-gray-500">
                            ${parseFloat(item.price).toFixed(2)} each
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 mt-4 flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="font-semibold">
                    ${parseFloat(order.total_cost).toFixed(2)}
                  </span>
                </div>

                {order.status !== "delivered" &&
                  order.status !== "cancelled" && (
                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <h3 className="font-medium text-gray-900 mb-2">
                        Update Status
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {order.status === "pending" && (
                          <button
                            onClick={() =>
                              changeStatus({
                                id: order.id,
                                status: "preparing",
                              })
                            }
                            className="px-3 py-1.5 bg-blue-100 text-blue-700 text-sm rounded-md hover:bg-blue-200"
                          >
                            Mark as Preparing
                          </button>
                        )}
                        {order.status === "preparing" && (
                          <button
                            onClick={() =>
                              changeStatus({
                                id: order.id,
                                status: "out_for_delivery",
                              })
                            }
                            className="px-3 py-1.5 bg-purple-100 text-purple-700 text-sm rounded-md hover:bg-purple-200"
                          >
                            Mark as Out for Delivery
                          </button>
                        )}
                        {order.status === "out_for_delivery" && (
                          <button
                            onClick={() =>
                              changeStatus({
                                id: order.id,
                                status: "delivered",
                              })
                            }
                            className="px-3 py-1.5 bg-green-100 text-green-700 text-sm rounded-md hover:bg-green-200"
                          >
                            Mark as Delivered
                          </button>
                        )}
                        <button
                          onClick={() =>
                            changeStatus({ id: order.id, status: "cancelled" })
                          }
                          className="px-3 py-1.5 bg-red-100 text-red-700 text-sm rounded-md hover:bg-red-200"
                        >
                          Cancel Order
                        </button>
                      </div>
                    </div>
                  )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
