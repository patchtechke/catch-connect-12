import { useQuery } from "@tanstack/react-query";
import { useAuth, useRequireAuth } from "@/lib/auth";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  Users, 
  Fish, 
  ShoppingBag, 
  Package, 
  TrendingUp,
  LogOut, 
  Home,
  CheckCircle,
  XCircle,
  Clock,
  KeyRound,
  Loader2
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

function getTimeBasedGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { user, logout, session } = useAuth();
  const { hasAccess, isLoading: authLoading } = useRequireAuth(["admin"]);
  const { toast } = useToast();
  const [sendingResetFor, setSendingResetFor] = useState<string | null>(null);

  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/admin/stats"],
    enabled: !!session?.accessToken,
    queryFn: async () => {
      const res = await fetch("/api/admin/stats", {
        headers: { Authorization: `Bearer ${session?.accessToken}` },
      });
      if (!res.ok) throw new Error("Failed to fetch stats");
      return res.json();
    },
  });

  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ["/api/admin/users"],
    enabled: !!session?.accessToken,
    queryFn: async () => {
      const res = await fetch("/api/admin/users?limit=10", {
        headers: { Authorization: `Bearer ${session?.accessToken}` },
      });
      if (!res.ok) throw new Error("Failed to fetch users");
      return res.json();
    },
  });

  const { data: fishersData, isLoading: fishersLoading } = useQuery({
    queryKey: ["/api/admin/fishers"],
    enabled: !!session?.accessToken,
    queryFn: async () => {
      const res = await fetch("/api/admin/fishers?limit=10", {
        headers: { Authorization: `Bearer ${session?.accessToken}` },
      });
      if (!res.ok) throw new Error("Failed to fetch fishers");
      return res.json();
    },
  });

  const { data: buyersData, isLoading: buyersLoading } = useQuery({
    queryKey: ["/api/admin/buyers"],
    enabled: !!session?.accessToken,
    queryFn: async () => {
      const res = await fetch("/api/admin/buyers?limit=10", {
        headers: { Authorization: `Bearer ${session?.accessToken}` },
      });
      if (!res.ok) throw new Error("Failed to fetch buyers");
      return res.json();
    },
  });

  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ["/api/admin/orders"],
    enabled: !!session?.accessToken,
    queryFn: async () => {
      const res = await fetch("/api/admin/orders?limit=10", {
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

  const handleSendPasswordReset = async (userId: string, userEmail: string) => {
    if (!session?.accessToken) return;
    
    setSendingResetFor(userId);
    try {
      const response = await fetch(`/api/admin/users/${userId}/send-password-reset`, {
        method: "POST",
        headers: { 
          Authorization: `Bearer ${session.accessToken}`,
          "Content-Type": "application/json"
        },
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast({
          title: "Password Reset Email Sent",
          description: `A password reset link has been sent to ${userEmail}`,
        });
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to send password reset email",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSendingResetFor(null);
    }
  };

  const stats = statsData?.stats;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold" data-testid="text-dashboard-title">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground" data-testid="text-greeting">
                {getTimeBasedGreeting()}{user?.firstName ? `, ${user.firstName}` : ""}!
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="default" className="gap-1">
              <Shield className="h-3 w-3" />
              Super Admin
            </Badge>
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
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">Total Users</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              {statsLoading ? (
                <Skeleton className="h-6 w-12" />
              ) : (
                <div className="text-xl font-bold" data-testid="text-total-users">
                  {stats?.users?.total || 0}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">Fishers</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              {statsLoading ? (
                <Skeleton className="h-6 w-12" />
              ) : (
                <div className="text-xl font-bold" data-testid="text-total-fishers">
                  {stats?.users?.fishers || 0}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">Buyers</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              {statsLoading ? (
                <Skeleton className="h-6 w-12" />
              ) : (
                <div className="text-xl font-bold" data-testid="text-total-buyers">
                  {stats?.users?.buyers || 0}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">Catches</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              {statsLoading ? (
                <Skeleton className="h-6 w-12" />
              ) : (
                <div className="text-xl font-bold" data-testid="text-total-catches">
                  {stats?.catches?.total || 0}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">Orders</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              {statsLoading ? (
                <Skeleton className="h-6 w-12" />
              ) : (
                <div className="text-xl font-bold" data-testid="text-total-orders">
                  {stats?.orders?.total || 0}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">Pending</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              {statsLoading ? (
                <Skeleton className="h-6 w-12" />
              ) : (
                <div className="text-xl font-bold text-orange-500" data-testid="text-pending-orders">
                  {stats?.orders?.pending || 0}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="space-y-4">
          <TabsList>
            <TabsTrigger value="users" className="gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="fishers" className="gap-2">
              <Fish className="h-4 w-4" />
              Fishers
            </TabsTrigger>
            <TabsTrigger value="buyers" className="gap-2">
              <ShoppingBag className="h-4 w-4" />
              Buyers
            </TabsTrigger>
            <TabsTrigger value="orders" className="gap-2">
              <Package className="h-4 w-4" />
              Orders
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>All Users</CardTitle>
                <CardDescription>Manage platform users</CardDescription>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : usersData?.users?.length > 0 ? (
                  <div className="space-y-2">
                    {usersData.users.map((userItem: any) => (
                      <div
                        key={userItem.id}
                        className="flex items-center justify-between p-3 rounded-lg border gap-2 flex-wrap"
                        data-testid={`user-item-${userItem.id}`}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium">{userItem.first_name} {userItem.last_name}</p>
                          <p className="text-sm text-muted-foreground truncate">{userItem.email}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline">{userItem.role}</Badge>
                          {userItem.is_active ? (
                            <Badge variant="default" className="gap-1">
                              <CheckCircle className="h-3 w-3" />
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="destructive" className="gap-1">
                              <XCircle className="h-3 w-3" />
                              Inactive
                            </Badge>
                          )}
                          {userItem.is_active && userItem.id !== user?.id && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSendPasswordReset(userItem.id, userItem.email)}
                              disabled={sendingResetFor === userItem.id}
                              data-testid={`button-reset-password-${userItem.id}`}
                            >
                              {sendingResetFor === userItem.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <>
                                  <KeyRound className="h-4 w-4 mr-1" />
                                  Reset Password
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-8 text-muted-foreground">No users found</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fishers">
            <Card>
              <CardHeader>
                <CardTitle>Fisher Profiles</CardTitle>
                <CardDescription>Manage and verify fishers</CardDescription>
              </CardHeader>
              <CardContent>
                {fishersLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : fishersData?.fishers?.length > 0 ? (
                  <div className="space-y-2">
                    {fishersData.fishers.map((fisher: any) => (
                      <div
                        key={fisher.id}
                        className="flex items-center justify-between p-3 rounded-lg border"
                        data-testid={`fisher-item-${fisher.id}`}
                      >
                        <div>
                          <p className="font-medium">
                            {fisher.user?.first_name} {fisher.user?.last_name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {fisher.boat_name || "No boat"} - {fisher.country}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {fisher.is_verified ? (
                            <Badge variant="default" className="gap-1">
                              <CheckCircle className="h-3 w-3" />
                              Verified
                            </Badge>
                          ) : (
                            <Badge variant="secondary">Pending</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-8 text-muted-foreground">No fishers found</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="buyers">
            <Card>
              <CardHeader>
                <CardTitle>Buyer Profiles</CardTitle>
                <CardDescription>Manage and verify buyers</CardDescription>
              </CardHeader>
              <CardContent>
                {buyersLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : buyersData?.buyers?.length > 0 ? (
                  <div className="space-y-2">
                    {buyersData.buyers.map((buyer: any) => (
                      <div
                        key={buyer.id}
                        className="flex items-center justify-between p-3 rounded-lg border"
                        data-testid={`buyer-item-${buyer.id}`}
                      >
                        <div>
                          <p className="font-medium">
                            {buyer.user?.first_name} {buyer.user?.last_name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {buyer.company_name || buyer.business_type} - {buyer.country}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {buyer.is_verified ? (
                            <Badge variant="default" className="gap-1">
                              <CheckCircle className="h-3 w-3" />
                              Verified
                            </Badge>
                          ) : (
                            <Badge variant="secondary">Pending</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-8 text-muted-foreground">No buyers found</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>All Orders</CardTitle>
                <CardDescription>Monitor platform transactions</CardDescription>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : ordersData?.orders?.length > 0 ? (
                  <div className="space-y-2">
                    {ordersData.orders.map((order: any) => (
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
                            {order.currency} {order.total_price} | {new Date(order.created_at).toLocaleDateString()}
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
                  <p className="text-center py-8 text-muted-foreground">No orders found</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
