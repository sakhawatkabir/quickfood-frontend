"use client";
import { useState } from "react";
import { fetchAdminRestaurants, deleteRestaurant } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2, Store, Search, MapPin, Star } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const AdminRestaurantsPage = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

  const {
    data: restaurants = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["admin-restaurants"],
    queryFn: fetchAdminRestaurants,
  });

  const { mutate: remove } = useMutation({
    mutationFn: deleteRestaurant,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin-restaurants"] }),
  });

  const handleDelete = (id, name) => {
    if (!confirm(`Delete restaurant "${name}"?`)) return;
    remove(id);
  };

  const filtered = restaurants.filter(
    (r) =>
      r.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.location?.toLowerCase().includes(search.toLowerCase()),
  );

  if (isLoading) {
    return (
      <div>
        <h1 className="text-2xl font-semibold mb-6">Restaurants</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-muted rounded-xl animate-pulse" />
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

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Restaurants</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {restaurants.length} total restaurants
          </p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search restaurants..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 text-sm bg-muted border border-transparent rounded-lg focus:bg-background focus:border-ring focus:ring-2 focus:ring-ring/10 outline-none transition-all w-64"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((restaurant) => (
          <Card key={restaurant.id} className="overflow-hidden">
            <div className="relative h-40 bg-muted">
              {restaurant.image ? (
                <Image
                  src={restaurant.image}
                  alt={restaurant.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-gradient-to-br from-orange-50 to-orange-100">
                  <Store className="size-10 text-orange-300" />
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="font-semibold truncate">{restaurant.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                    <MapPin className="size-3" />
                    <span className="truncate">
                      {restaurant.location || "No location"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-sm mt-1">
                    <Star className="size-3 text-yellow-500 fill-yellow-500" />
                    <span>4.8</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(restaurant.id, restaurant.name)}
                >
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-10 text-center text-muted-foreground">
            No restaurants found
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminRestaurantsPage;
