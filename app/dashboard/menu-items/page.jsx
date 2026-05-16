"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Plus,
  Edit,
  Trash2,
  UtensilsCrossed,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { fetchOwnerMenuItems, deleteMenuItem } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ITEMS_PER_PAGE = 10;

const MenuPage = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);

  const {
    data: menuItems = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["owner-menu-items"],
    queryFn: fetchOwnerMenuItems,
  });

  const { mutate: remove } = useMutation({
    mutationFn: deleteMenuItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owner-menu-items"] });
      queryClient.invalidateQueries({ queryKey: ["menu-items"] });
    },
  });

  const handleDelete = (id) => {
    if (!confirm("Are you sure you want to delete this menu item?")) return;
    remove(id);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-8 w-40 bg-muted rounded-lg animate-pulse" />
          <div className="h-10 w-36 bg-muted rounded-lg animate-pulse" />
        </div>
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Menu Items</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your restaurant menu items
          </p>
        </div>
        <Link href="/dashboard/menu-items/add" className={cn(buttonVariants())}>
          <Plus className="h-4 w-4 mr-2" />
          Add Menu Item
        </Link>
      </div>

      {menuItems.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <UtensilsCrossed className="size-12 text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground mb-1">No menu items yet</p>
            <p className="text-sm text-muted-foreground/70 mb-4">
              Add your first menu item to get started
            </p>
            <Link
              href="/dashboard/menu-items/add"
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Menu Item
            </Link>
          </CardContent>
        </Card>
      ) : (
        (() => {
          const totalPages = Math.ceil(menuItems.length / ITEMS_PER_PAGE);
          const paginatedItems = menuItems.slice(
            (page - 1) * ITEMS_PER_PAGE,
            page * ITEMS_PER_PAGE,
          );
          return (
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20">Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Restaurant</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Description
                    </TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={64}
                            height={48}
                            className="object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-16 h-12 bg-muted rounded-lg flex items-center justify-center">
                            <UtensilsCrossed className="size-4 text-muted-foreground/50" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {item.restaurant?.name ?? "—"}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell max-w-xs">
                        <span className="text-sm text-muted-foreground line-clamp-1">
                          {item.description}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium">
                        ${parseFloat(item.price).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Link
                            href={`/dashboard/menu-items/edit/${item.id}`}
                            className={cn(
                              buttonVariants({
                                variant: "ghost",
                                size: "icon",
                              }),
                            )}
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDelete(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t">
                  <p className="text-sm text-muted-foreground">
                    Showing {(page - 1) * ITEMS_PER_PAGE + 1}–
                    {Math.min(page * ITEMS_PER_PAGE, menuItems.length)} of{" "}
                    {menuItems.length}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      disabled={page === 1}
                      onClick={() => setPage((p) => p - 1)}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm font-medium px-2">
                      {page} / {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      disabled={page === totalPages}
                      onClick={() => setPage((p) => p + 1)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          );
        })()
      )}
    </div>
  );
};

export default MenuPage;
