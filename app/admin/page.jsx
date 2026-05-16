"use client";
import { fetchAdminStats } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import {
  Users,
  ShoppingBag,
  Store,
  UtensilsCrossed,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AdminDashboard = () => {
  const {
    data: stats,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: fetchAdminStats,
  });

  if (isLoading) {
    return (
      <div>
        <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
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

  const statCards = [
    {
      title: "Total Users",
      value: stats?.total_users ?? 0,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Total Orders",
      value: stats?.total_orders ?? 0,
      icon: ShoppingBag,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: "Restaurants",
      value: stats?.total_restaurants ?? 0,
      icon: Store,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      title: "Menu Items",
      value: stats?.total_menu_items ?? 0,
      icon: UtensilsCrossed,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      title: "Revenue",
      value: `$${parseFloat(stats?.total_revenue ?? 0).toFixed(2)}`,
      icon: DollarSign,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: "Pending Orders",
      value: stats?.pending_orders ?? 0,
      icon: TrendingUp,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`${stat.bg} p-2 rounded-lg`}>
                <stat.icon className={`size-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
