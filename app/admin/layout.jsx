"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { Menu } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = ({ children }) => {
  const router = useRouter();
  const { isAuthenticated, userRole, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    } else if (!loading && isAuthenticated && userRole !== "admin") {
      router.push("/profile");
    }
  }, [isAuthenticated, userRole, loading, router]);

  if (loading || !isAuthenticated || userRole !== "admin") {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full size-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-shrink-0">
        <AdminSidebar />
      </div>

      {/* Mobile sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Mobile header */}
          <div className="lg:hidden flex items-center h-14 px-4 border-b bg-card">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 -ml-2 text-muted-foreground hover:text-foreground"
            >
              <Menu className="size-5" />
            </button>
            <span className="ml-3 font-semibold">Admin Panel</span>
          </div>

          {/* Main content */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
        <SheetContent
          side="left"
          className="w-[280px] max-w-[85vw] p-0"
          showCloseButton={false}
        >
          <AdminSidebar onClose={() => setSidebarOpen(false)} />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AdminLayout;
