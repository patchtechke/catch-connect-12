import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign,
  Users,
  Package,
  ShoppingCart
} from "lucide-react";

export default function AdminReports() {
  const { session } = useAuth();
  const [location] = useLocation();

  const { data: statsData, isLoading } = useQuery({
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

  const getPageTitle = () => {
    if (location.includes("/revenue")) return "Revenue Reports";
    if (location.includes("/trends")) return "Platform Trends";
    return "Reports Overview";
  };

  const getBreadcrumbs = (): Array<{ label: string; href?: string }> => {
    const crumbs: Array<{ label: string; href?: string }> = [{ label: "Reports", href: "/admin/reports" }];
    if (location.includes("/revenue")) crumbs.push({ label: "Revenue" });
    if (location.includes("/trends")) crumbs.push({ label: "Trends" });
    return crumbs;
  };

  const stats = statsData?.stats;

  return (
    <AdminLayout breadcrumbs={getBreadcrumbs()}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-page-title">{getPageTitle()}</h1>
          <p className="text-muted-foreground">
            Analytics and reporting dashboard
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats?.users?.total || 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stats?.users?.fishers || 0} fishers, {stats?.users?.buyers || 0} buyers
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium">Total Catches</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats?.catches?.total || 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stats?.catches?.available || 0} available
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats?.orders?.total || 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stats?.orders?.delivered || 0} delivered
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <CardTitle>User Distribution</CardTitle>
              </div>
              <CardDescription>Breakdown by user role</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Fishers</span>
                {isLoading ? (
                  <Skeleton className="h-5 w-16" />
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full" 
                        style={{ 
                          width: `${stats?.users?.total ? (stats.users.fishers / stats.users.total) * 100 : 0}%` 
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium">{stats?.users?.fishers || 0}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Buyers</span>
                {isLoading ? (
                  <Skeleton className="h-5 w-16" />
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-secondary rounded-full" 
                        style={{ 
                          width: `${stats?.users?.total ? (stats.users.buyers / stats.users.total) * 100 : 0}%` 
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium">{stats?.users?.buyers || 0}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Admins</span>
                {isLoading ? (
                  <Skeleton className="h-5 w-16" />
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-accent rounded-full" 
                        style={{ 
                          width: `${stats?.users?.total ? (stats.users.admins / stats.users.total) * 100 : 0}%` 
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium">{stats?.users?.admins || 0}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <CardTitle>Order Status</CardTitle>
              </div>
              <CardDescription>Current order breakdown</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Pending</span>
                {isLoading ? (
                  <Skeleton className="h-5 w-16" />
                ) : (
                  <span className="text-sm font-medium text-orange-500">{stats?.orders?.pending || 0}</span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Confirmed</span>
                {isLoading ? (
                  <Skeleton className="h-5 w-16" />
                ) : (
                  <span className="text-sm font-medium text-blue-500">{stats?.orders?.confirmed || 0}</span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Delivered</span>
                {isLoading ? (
                  <Skeleton className="h-5 w-16" />
                ) : (
                  <span className="text-sm font-medium text-green-500">{stats?.orders?.delivered || 0}</span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Cancelled</span>
                {isLoading ? (
                  <Skeleton className="h-5 w-16" />
                ) : (
                  <span className="text-sm font-medium text-red-500">{stats?.orders?.cancelled || 0}</span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              <CardTitle>Platform Metrics</CardTitle>
            </div>
            <CardDescription>Key performance indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                {isLoading ? (
                  <Skeleton className="h-10 w-16 mx-auto" />
                ) : (
                  <div className="text-3xl font-bold text-primary">{stats?.users?.total || 0}</div>
                )}
                <p className="text-sm text-muted-foreground mt-1">Total Users</p>
              </div>
              <div className="text-center">
                {isLoading ? (
                  <Skeleton className="h-10 w-16 mx-auto" />
                ) : (
                  <div className="text-3xl font-bold text-primary">{stats?.catches?.total || 0}</div>
                )}
                <p className="text-sm text-muted-foreground mt-1">Total Catches</p>
              </div>
              <div className="text-center">
                {isLoading ? (
                  <Skeleton className="h-10 w-16 mx-auto" />
                ) : (
                  <div className="text-3xl font-bold text-primary">{stats?.orders?.total || 0}</div>
                )}
                <p className="text-sm text-muted-foreground mt-1">Total Orders</p>
              </div>
              <div className="text-center">
                {isLoading ? (
                  <Skeleton className="h-10 w-16 mx-auto" />
                ) : (
                  <div className="text-3xl font-bold text-green-500">{stats?.orders?.delivered || 0}</div>
                )}
                <p className="text-sm text-muted-foreground mt-1">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
