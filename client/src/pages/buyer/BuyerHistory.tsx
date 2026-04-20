import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { BuyerLayout } from "@/components/buyer/BuyerLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  History,
  Fish,
  Calendar,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  RefreshCcw,
  Download,
} from "lucide-react";

export default function BuyerHistory() {
  const { session } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [timeFilter, setTimeFilter] = useState("all");

  const { data: ordersData, isLoading } = useQuery({
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

  const orders = ordersData?.orders || [];

  const completedOrders = orders.filter((order: any) => order.status === "delivered");

  const filteredOrders = completedOrders.filter((order: any) => {
    const matchesSearch =
      !searchQuery ||
      order.catches?.species?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.fisher?.boat_name?.toLowerCase().includes(searchQuery.toLowerCase());

    if (timeFilter === "all") return matchesSearch;

    const orderDate = new Date(order.created_at);
    const now = new Date();
    const daysDiff = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));

    switch (timeFilter) {
      case "week":
        return matchesSearch && daysDiff <= 7;
      case "month":
        return matchesSearch && daysDiff <= 30;
      case "quarter":
        return matchesSearch && daysDiff <= 90;
      case "year":
        return matchesSearch && daysDiff <= 365;
      default:
        return matchesSearch;
    }
  });

  const totalSpent = completedOrders.reduce(
    (sum: number, order: any) => sum + (parseFloat(order.total_price) || 0),
    0
  );

  const avgOrderValue = completedOrders.length > 0 ? totalSpent / completedOrders.length : 0;

  const speciesCount: Record<string, number> = {};
  completedOrders.forEach((order: any) => {
    const species = order.catches?.species || "Unknown";
    speciesCount[species] = (speciesCount[species] || 0) + 1;
  });
  const mostPurchased = Object.entries(speciesCount).sort((a, b) => b[1] - a[1])[0];

  return (
    <BuyerLayout breadcrumbs={[{ label: "Purchase History" }]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-page-title">Purchase History</h1>
            <p className="text-muted-foreground">Review your past purchases and transactions</p>
          </div>
          <Button variant="outline" data-testid="button-export">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium">Total Purchases</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-total-purchases">
                {completedOrders.length}
              </div>
              <p className="text-xs text-muted-foreground">Completed orders</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-total-spent">
                KES {totalSpent.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Lifetime value</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-avg-order">
                KES {avgOrderValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
              <p className="text-xs text-muted-foreground">Per order</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium">Most Purchased</CardTitle>
              <Fish className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-most-purchased">
                {mostPurchased?.[0] || "N/A"}
              </div>
              <p className="text-xs text-muted-foreground">
                {mostPurchased ? `${mostPurchased[1]} orders` : "No orders yet"}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Transaction History
                </CardTitle>
                <CardDescription>All your completed purchases</CardDescription>
              </div>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search history..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    data-testid="input-search-history"
                  />
                </div>
                <Select value={timeFilter} onValueChange={setTimeFilter}>
                  <SelectTrigger className="w-40" data-testid="select-time-filter">
                    <SelectValue placeholder="Time period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="week">Last 7 Days</SelectItem>
                    <SelectItem value="month">Last 30 Days</SelectItem>
                    <SelectItem value="quarter">Last 90 Days</SelectItem>
                    <SelectItem value="year">Last Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : filteredOrders.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Species</TableHead>
                      <TableHead>Fisher</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order: any) => (
                      <TableRow key={order.id} data-testid={`row-history-${order.id}`}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {order.created_at
                              ? new Date(order.created_at).toLocaleDateString()
                              : "N/A"}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          #{order.id.slice(0, 8)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Fish className="h-4 w-4 text-muted-foreground" />
                            {order.catches?.species || "Unknown"}
                          </div>
                        </TableCell>
                        <TableCell>{order.fisher?.boat_name || "Unknown"}</TableCell>
                        <TableCell>
                          {order.quantity} {order.catches?.unit || "units"}
                        </TableCell>
                        <TableCell className="font-medium">
                          {order.currency} {order.total_price}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            data-testid={`button-reorder-${order.id}`}
                          >
                            <RefreshCcw className="h-4 w-4 mr-1" />
                            Reorder
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <History className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No purchase history</h3>
                <p>Your completed orders will appear here.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </BuyerLayout>
  );
}
