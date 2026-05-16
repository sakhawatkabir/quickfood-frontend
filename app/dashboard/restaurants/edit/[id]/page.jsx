"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { fetchRestaurant, updateRestaurant } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const EditRestaurantPage = ({ params }) => {
  const { id } = params;
  const router = useRouter();
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const { data: restaurant, isLoading } = useQuery({
    queryKey: ["restaurant", id],
    queryFn: () => fetchRestaurant(id),
    enabled: !!id,
  });

  useEffect(() => {
    if (restaurant) {
      setName(restaurant.name ?? "");
      setDescription(restaurant.description ?? "");
      setLocation(restaurant.location ?? "");
    }
  }, [restaurant]);

  const { mutate, isPending, error, isSuccess } = useMutation({
    mutationFn: updateRestaurant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owner-restaurants"] });
      queryClient.invalidateQueries({ queryKey: ["restaurant", id] });
      router.push("/dashboard/restaurants");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("id", id);
    formData.append("name", name);
    formData.append("description", description);
    formData.append("location", location);
    if (imageFile) formData.append("image", imageFile);
    mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl space-y-4">
        <div className="h-9 w-20 bg-muted rounded animate-pulse" />
        <div className="h-96 bg-muted rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <Link
        href="/dashboard/restaurants"
        className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "mb-4")}
      >
        <ArrowLeft className="h-4 w-4 mr-1.5" />
        Back
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Edit Restaurant</CardTitle>
          <CardDescription>Update your restaurant details</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm px-4 py-3 rounded-lg mb-4">
              {error.message}
            </div>
          )}
          {isSuccess && (
            <div className="bg-green-50 text-green-600 text-sm px-4 py-3 rounded-lg mb-4">
              Restaurant updated! Redirecting...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Restaurant Name
              </label>
              <Input
                id="name"
                value={name}
                required
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                rows={3}
                required
                onChange={(e) => setDescription(e.target.value)}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="location" className="text-sm font-medium">
                Location
              </label>
              <Input
                id="location"
                value={location}
                required
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="image" className="text-sm font-medium">
                Restaurant Image
              </label>
              {restaurant?.image && (
                <Image
                  src={restaurant.image}
                  alt={name}
                  width={128}
                  height={128}
                  className="object-cover rounded-lg mb-2 border"
                />
              )}
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                className="file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-muted file:text-foreground hover:file:bg-muted/80"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Link
                href="/dashboard/restaurants"
                className={cn(buttonVariants({ variant: "outline" }))}
              >
                Cancel
              </Link>
              <Button type="submit" disabled={isPending}>
                <Save className="h-4 w-4 mr-1.5" />
                {isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditRestaurantPage;
