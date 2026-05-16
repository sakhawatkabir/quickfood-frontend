"use client";
import { useState } from "react";
import { fetchAdminUsers, deleteUser } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const roleColors = {
  admin: "bg-red-50 text-red-700 border-red-200",
  restaurant_owner: "bg-blue-50 text-blue-700 border-blue-200",
  user: "bg-zinc-50 text-zinc-700 border-zinc-200",
};

const AdminUsersPage = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

  const {
    data: users = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["admin-users"],
    queryFn: fetchAdminUsers,
  });

  const { mutate: remove } = useMutation({
    mutationFn: deleteUser,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin-users"] }),
  });

  const handleDelete = (id, username) => {
    if (!confirm(`Delete user "${username}"?`)) return;
    remove(id);
  };

  const filtered = users.filter(
    (u) =>
      u.username?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()),
  );

  if (isLoading) {
    return (
      <div>
        <h1 className="text-2xl font-semibold mb-6">Users</h1>
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
          <h1 className="text-2xl font-semibold">Users</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {users.length} registered users
          </p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 text-sm bg-muted border border-transparent rounded-lg focus:bg-background focus:border-ring focus:ring-2 focus:ring-ring/10 outline-none transition-all w-64"
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                    User
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                    Email
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                    Role
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b last:border-0 hover:bg-muted/50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-medium">
                          {user.username?.[0]?.toUpperCase() || "?"}
                        </div>
                        <span className="font-medium">{user.username}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {user.email || "—"}
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant="outline"
                        className={roleColors[user.role] || roleColors.user}
                      >
                        {user.role?.replace("_", " ") || "user"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {user.role !== "admin" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(user.id, user.username)}
                        >
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-10 text-center text-muted-foreground"
                    >
                      No users found
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

export default AdminUsersPage;
