import { useQuery } from "@tanstack/react-query";
import { useAuth, useRequireAuth } from "@/lib/auth";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { 
  ShoppingBag, 
  Package, 
  TrendingUp, 
  Search, 
  LogOut, 
  Home,
  CheckCircle,
  Clock,
  Fish
} from "lucide-react";
import { useState } from "react";

export default function BuyerDashboard() {
  const [, setLocation] = useLocation();
  const { user, logout, session } = useAuth();
  const { hasAccess, isLoading: authLoading } = useRequireAuth(["buyer", "admin"]);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/buyer/stats"],
    enabled: !!session?.accessToken,
    queryFn: async () => {
      const res = await fetch("/api/buyer/stats", {
        headers: { Authorization: `Bearer ${session?.accessToken}` },
      });
      if (!res.ok) throw new Error("Failed to fetch stats");
      return res.json();
    },
  });

  const { data: marketplaceData, isLoading: marketplaceLoading } = useQuery({
    queryKey: ["/api/buyer/marketplace", searchQuery],
    enabled: !!session?.accessToken,
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery) params.append("species", searchQuery);
      const res = await fetch(`/api/buyer/marketplace?${params}`, {
        headers: { Authorization: `Bearer ${session?.accessToken}` },
      });
      if (!res.ok) throw new Error("Failed to fetch marketplace");
      return res.json();
    },
  });

  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ["/api/buyer/orders"],
    enabled: !!session?.accessToken,
    queryFn: async () => {
      const res = await fetch("/api/buyer/orders", {
        headers: { Authorization: `Bearer ${session?.accessToken}` },
      });
      if (!res.ok) throw new Error("Failed to fetch orders");
      return res.json();
    },
  });

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!hasAccess) {
    setLocation("/login");
    return null;
  }

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  const stats = statsData?.stats;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <ShoppingBag className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold" data-testid="text-dashboard-title">Buyer Dashboard</h1>
              <p className="text-sm text-muted-foreground" data-testid="text-user-name">
                Welcome, {user?.firstName} {user?.lastName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {stats?.isVerified && (
              <Badge variant="secondary" className="gap-1">
                <CheckCircle className="h-3 w-3" />
                Verified
              </Badge>
            )}
            <Link href="/">
              <Button variant="outline" size="sm" data-testid="link-home">
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={handleLogout} data-testid="button-logout">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold" data-testid="text-total-orders">
                  {stats?.totalOrders || 0}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold" data-testid="text-active-orders">
                  {stats?.activeOrders || 0}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold" data-testid="text-completed-orders">
                  {stats?.completedOrders || 0}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Marketplace</CardTitle>
              <CardDescription>Browse available catches from fishers</CardDescription>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by species..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  data-testid="input-search-marketplace"
                />
              </div>
            </CardHeader>
            <CardContent>
              {marketplaceLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              ) : marketplaceData?.catches?.length > 0 ? (
                <div className="space-y-3">
                  {marketplaceData.catches.slice(0, 5).map((catchItem: any) => (
                    <div
                      key={catchItem.id}
                      className="p-3 rounded-lg border hover-elevate cursor-pointer"
                      data-testid={`marketplace-item-${catchItem.id}`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <p className="font-medium">{catchItem.species}</p>
                        <Badge>{catchItem.quality}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {catchItem.quantity} {catchItem.unit} @ {catchItem.currency} {catchItem.price_per_unit}/{catchItem.unit}
                      </p>
                      {catchItem.fisher && (
                        <p className="text-xs text-muted-foreground mt-1">
                          From: {catchItem.fisher.boat_name || "Unknown"} - {catchItem.fisher.port || catchItem.fisher.country}
                          {catchItem.fisher.is_verified && " (Verified)"}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Fish className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No catches available</p>
                  <p className="text-sm">Check back later for new listings</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>My Orders</CardTitle>
              <CardDescription>Track your purchases</CardDescription>
            </CardHeader>
            <CardContent>
              {ordersLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : ordersData?.orders?.length > 0 ? (
                <div className="space-y-3">
                  {ordersData.orders.slice(0, 5).map((order: any) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-3 rounded-lg border"
                      data-testid={`order-item-${order.id}`}
                    >
                      <div>
                        <p className="font-medium">
                          {order.catches?.species || "Unknown"} - {order.quantity} units
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {order.currency} {order.total_price}
                        </p>
                      </div>
                      <Badge
                        variant={
                          order.status === "delivered" ? "default" :
                          order.status === "cancelled" ? "destructive" :
                          "secondary"
                        }
                      >
                        {order.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No orders yet</p>
                  <p className="text-sm">Browse the marketplace to place your first order</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
