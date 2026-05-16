"use client";
import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  fetchOwnerRestaurants,
  fetchOwnerMenuItems,
  fetchUserOrders,
} from "@/lib/api";
import {
  Store,
  UtensilsCrossed,
  ShoppingBag,
  ArrowRight,
  Clock,
  DollarSign,
  TrendingUp,
  CheckCircle,
  XCircle,
  TruckIcon,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const statusConfig = {
  pending: {
    className: "border-yellow-300 text-yellow-700 bg-yellow-50",
    color: "#eab308",
    icon: Clock,
  },
  preparing: {
    className: "border-blue-300 text-blue-700 bg-blue-50",
    color: "#3b82f6",
    icon: RefreshCw,
  },
  out_for_delivery: {
    className: "border-purple-300 text-purple-700 bg-purple-50",
    color: "#a855f7",
    icon: TruckIcon,
  },
  delivered: {
    className: "border-green-300 text-green-700 bg-green-50",
    color: "#22c55e",
    icon: CheckCircle,
  },
  cancelled: {
    className: "border-red-300 text-red-700 bg-red-50",
    color: "#ef4444",
    icon: XCircle,
  },
};

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border rounded-lg shadow-lg px-3 py-2 text-sm">
      <p className="font-medium mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} style={{ color: entry.color }} className="text-xs">
          {entry.name}:{" "}
          {entry.name === "revenue" ? `$${entry.value}` : entry.value}
        </p>
      ))}
    </div>
  );
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
  const totalRevenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + (parseFloat(o.total_cost) || 0), 0);

  // Chart data: last 7 days
  const chartData = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dayStr = date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    const dayOrders = orders.filter(
      (o) =>
        new Date(o.created_at) >= dayStart && new Date(o.created_at) <= dayEnd,
    );

    chartData.push({
      date: dayStr,
      orders: dayOrders.length,
      revenue: parseFloat(
        dayOrders
          .filter((o) => o.status !== "cancelled")
          .reduce((sum, o) => sum + (parseFloat(o.total_cost) || 0), 0)
          .toFixed(2),
      ),
    });
  }

  // Status breakdown
  const statusCounts = {};
  orders.forEach((o) => {
    statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
  });
  const statusBreakdown = Object.entries(statusCounts).map(
    ([status, count]) => ({
      status,
      name: status.replace(/_/g, " "),
      count,
      color: statusConfig[status]?.color || "#94a3b8",
    }),
  );

  const stats = [
    {
      label: "Restaurants",
      value: restaurants.length,
      icon: Store,
      href: "/dashboard/restaurants",
    },
    {
      label: "Menu Items",
      value: menuItems.length,
      icon: UtensilsCrossed,
      href: "/dashboard/menu-items",
    },
    {
      label: "Total Orders",
      value: orders.length,
      icon: ShoppingBag,
      href: "/dashboard/orders",
    },
    {
      label: "Revenue",
      value: `$${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      href: "/dashboard/orders",
    },
    {
      label: "Pending",
      value: pendingOrders.length,
      icon: TrendingUp,
      href: "/dashboard/orders",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Overview of your restaurant business
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-semibold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">
                      {stat.label}
                    </p>
                  </div>
                  <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Orders Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Orders (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11 }}
                    className="text-muted-foreground"
                  />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    className="text-muted-foreground"
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar
                    dataKey="orders"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                    name="orders"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Status Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Order Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {statusBreakdown.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="count"
                    >
                      {statusBreakdown.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name) => [value, name]}
                      contentStyle={{ fontSize: 12 }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      formatter={(value) => (
                        <span className="text-xs">{value}</span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                  No order data
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Revenue (Last 7 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11 }}
                  className="text-muted-foreground"
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `$${v}`}
                  className="text-muted-foreground"
                />
                <Tooltip content={<ChartTooltip />} />
                <Bar
                  dataKey="revenue"
                  fill="#22c55e"
                  radius={[4, 4, 0, 0]}
                  name="revenue"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Pending Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-lg">Pending Orders</CardTitle>
          <Link
            href="/dashboard/orders"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "text-muted-foreground",
            )}
          >
            View all
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </CardHeader>
        <CardContent>
          {pendingOrders.length === 0 ? (
            <div className="text-center py-6">
              <Clock className="size-10 text-muted-foreground/50 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No pending orders</p>
            </div>
          ) : (
            <div className="divide-y">
              {pendingOrders.slice(0, 5).map((order) => (
                <div
                  key={order.id}
                  className="py-3 flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium text-sm">Order #{order.id}</p>
                    <p className="text-xs text-muted-foreground">
                      {order.restaurant?.name} &mdash; {order.delivery_address}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-sm">
                      ${parseFloat(order.total_cost).toFixed(2)}
                    </span>
                    <Badge
                      variant="outline"
                      className={statusConfig[order.status]?.className}
                    >
                      {order.status.replace(/_/g, " ")}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
