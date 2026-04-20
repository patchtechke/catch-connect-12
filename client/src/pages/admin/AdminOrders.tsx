import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminOrders() {
  const { session } = useAuth();
  const [location] = useLocation();

  const getFilterParams = () => {
    if (location.includes("/pending")) return { status: "pending" };
    if (location.includes("/completed")) return { status: "delivered" };
    if (location.includes("/cancelled")) return { status: "cancelled" };
    return {};
  };

  const filterParams = getFilterParams();
  const queryString = new URLSearchParams({
    limit: "50",
    ...filterParams,
  }).toString();

  const { data: ordersData, isLoading } = useQuery({
    queryKey: ["/api/admin/orders", filterParams],
    enabled: !!session?.accessToken,
    queryFn: async () => {
      const res = await fetch(`/api/admin/orders?${queryString}`, {
        headers: { Authorization: `Bearer ${session?.accessToken}` },
      });
      if (!res.ok) throw new Error("Failed to fetch orders");
      return res.json();
    },
  });

  const getPageTitle = () => {
    if (location.includes("/pending")) return "Pending Orders";
    if (location.includes("/completed")) return "Completed Orders";
    if (location.includes("/cancelled")) return "Cancelled Orders";
    return "All Orders";
  };

  const getBreadcrumbs = (): Array<{ label: string; href?: string }> => {
    const crumbs: Array<{ label: string; href?: string }> = [{ label: "Orders", href: "/admin/orders" }];
    if (location.includes("/pending")) crumbs.push({ label: "Pending" });
    if (location.includes("/completed")) crumbs.push({ label: "Completed" });
    if (location.includes("/cancelled")) crumbs.push({ label: "Cancelled" });
    return crumbs;
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "delivered":
        return "default";
      case "cancelled":
        return "destructive";
      case "pending":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <AdminLayout breadcrumbs={getBreadcrumbs()}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-page-title">{getPageTitle()}</h1>
          <p className="text-muted-foreground">
            Monitor and manage platform orders
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Orders ({ordersData?.total || 0})</CardTitle>
            <CardDescription>All platform transactions</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            ) : ordersData?.orders?.length > 0 ? (
              <div className="space-y-3">
                {ordersData.orders.map((order: any) => (
                  <div
                    key={order.id}
                    className="flex items-start justify-between p-4 rounded-lg border gap-4 flex-wrap"
                    data-testid={`order-item-${order.id}`}
                  >
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium">
                          {order.catches?.species || "Unknown Species"}
                        </p>
                        <Badge variant={getStatusBadgeVariant(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {order.quantity} units | {order.currency} {order.total_price}
                      </p>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <p>
                          Fisher: {order.fisher?.user?.first_name} {order.fisher?.user?.last_name}
                          {order.fisher?.boat_name && ` (${order.fisher.boat_name})`}
                        </p>
                        <p>
                          Buyer: {order.buyer?.user?.first_name} {order.buyer?.user?.last_name}
                          {order.buyer?.company_name && ` - ${order.buyer.company_name}`}
                        </p>
                      </div>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <p>Order ID: {order.id.slice(0, 8)}...</p>
                      <p>{new Date(order.created_at).toLocaleDateString()}</p>
                      <p>{new Date(order.created_at).toLocaleTimeString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-8 text-muted-foreground">No orders found</p>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
