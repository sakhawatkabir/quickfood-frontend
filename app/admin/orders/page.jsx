"use client";
import { useState } from "react";
import { fetchAdminOrders, updateOrderStatus } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Clock,
  CheckCircle,
  TruckIcon,
  XCircle,
  RefreshCw,
  Package,
  MapPin,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const statusOptions = [
  { value: "all", label: "All Orders" },
  { value: "pending", label: "Pending" },
  { value: "preparing", label: "Preparing" },
  { value: "out_for_delivery", label: "Out for Delivery" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

const statusConfig = {
  pending: {
    icon: Clock,
    className: "border-yellow-300 text-yellow-700 bg-yellow-50",
  },
  preparing: {
    icon: RefreshCw,
    className: "border-blue-300 text-blue-700 bg-blue-50",
  },
  out_for_delivery: {
    icon: TruckIcon,
    className: "border-purple-300 text-purple-700 bg-purple-50",
  },
  delivered: {
    icon: CheckCircle,
    className: "border-green-300 text-green-700 bg-green-50",
  },
  cancelled: {
    icon: XCircle,
    className: "border-red-300 text-red-700 bg-red-50",
  },
};

const AdminOrdersPage = () => {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("all");

  const {
    data: orders = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: fetchAdminOrders,
  });

  const { mutate: changeStatus } = useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] }),
  });

  const filtered =
    statusFilter === "all"
      ? orders
      : orders.filter((o) => o.status === statusFilter);

  if (isLoading) {
    return (
      <div>
        <h1 className="text-2xl font-semibold mb-6">Orders</h1>
        <div className="h-96 bg-muted rounded-xl animate-pulse" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-destructive">{error.message}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Orders</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {orders.length} total orders
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {statusOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setStatusFilter(opt.value)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                statusFilter === opt.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                    Order
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                    Customer
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                    Restaurant
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                    Address
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                    Total
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                    Update
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => {
                  const config =
                    statusConfig[order.status] || statusConfig.pending;
                  const StatusIcon = config.icon;
                  return (
                    <tr
                      key={order.id}
                      className="border-b last:border-0 hover:bg-muted/50 transition-colors"
                    >
                      <td className="py-3 px-4 font-medium">#{order.id}</td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {order.user?.username || "—"}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {order.restaurant?.name || "—"}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground max-w-40 truncate">
                        {order.delivery_address || "—"}
                      </td>
                      <td className="py-3 px-4 font-medium">
                        ${parseFloat(order.total_cost || 0).toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className={config.className}>
                          <StatusIcon className="size-3 mr-1" />
                          {order.status?.replace("_", " ")}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            changeStatus({
                              id: order.id,
                              status: e.target.value,
                            })
                          }
                          className="text-xs border rounded-md px-2 py-1 bg-background"
                        >
                          {statusOptions
                            .filter((s) => s.value !== "all")
                            .map((s) => (
                              <option key={s.value} value={s.value}>
                                {s.label}
                              </option>
                            ))}
                        </select>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-10 text-center text-muted-foreground"
                    >
                      No orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOrdersPage;
