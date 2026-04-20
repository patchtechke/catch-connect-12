import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { BuyerLayout } from "@/components/buyer/BuyerLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import {
  Fish,
  Package,
  TrendingUp,
  CheckCircle,
  Clock,
  ArrowUpRight,
  DollarSign,
  ShoppingCart,
  Store,
  Heart,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const mockPurchaseData = [
  { name: "Mon", amount: 1200 },
  { name: "Tue", amount: 900 },
  { name: "Wed", amount: 1500 },
  { name: "Thu", amount: 800 },
  { name: "Fri", amount: 2100 },
  { name: "Sat", amount: 1800 },
  { name: "Sun", amount: 1400 },
];

const mockCategoryData = [
  { name: "Tilapia", value: 35 },
  { name: "Nile Perch", value: 25 },
  { name: "Catfish", value: 20 },
  { name: "Sardines", value: 15 },
  { name: "Other", value: 5 },
];

const COLORS = ["hsl(var(--primary))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

function getTimeBasedGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

export default function BuyerOverview() {
  const { session, user } = useAuth();

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
    queryKey: ["/api/buyer/marketplace"],
    enabled: !!session?.accessToken,
    queryFn: async () => {
      const res = await fetch("/api/buyer/marketplace", {
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

  const stats = statsData?.stats;

  return (
    <BuyerLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-page-title">Dashboard Overview</h1>
            <p className="text-muted-foreground" data-testid="text-greeting">
              {getTimeBasedGreeting()}{user?.firstName ? `, ${user.firstName}` : ""}! Here's your purchasing activity.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {stats?.isVerified && (
              <Badge variant="secondary" className="gap-1">
                <CheckCircle className="h-3 w-3" />
                Verified Buyer
              </Badge>
            )}
            <Button asChild data-testid="button-browse-marketplace">
              <Link href="/buyer/marketplace">
                <Store className="h-4 w-4 mr-2" />
                Browse Marketplace
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold" data-testid="text-total-orders">
                    {stats?.totalOrders || 0}
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground mt-1 gap-1">
                    <ArrowUpRight className="h-3 w-3 text-green-500" />
                    <span className="text-green-500">+8%</span>
                    <span>from last month</span>
                  </div>
                </>
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
                <>
                  <div className="text-2xl font-bold" data-testid="text-active-orders">
                    {stats?.activeOrders || 0}
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground mt-1 gap-1">
                    <Clock className="h-3 w-3 text-yellow-500" />
                    <span>Currently processing</span>
                  </div>
                </>
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
                <>
                  <div className="text-2xl font-bold" data-testid="text-completed-orders">
                    {stats?.completedOrders || 0}
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground mt-1 gap-1">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>Successfully delivered</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium">Favorites</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold" data-testid="text-favorites">
                    {stats?.favoritesCount || 0}
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground mt-1 gap-1">
                    <Heart className="h-3 w-3" />
                    <span>Saved items</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Weekly Purchases</CardTitle>
              <CardDescription>Your purchase activity for the past week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockPurchaseData}>
                    <defs>
                      <linearGradient id="purchaseGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="name" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="amount"
                      stroke="hsl(var(--primary))"
                      fillOpacity={1}
                      fill="url(#purchaseGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Purchase Categories</CardTitle>
              <CardDescription>Fish types you buy most</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={mockCategoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {mockCategoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-2 mt-4 justify-center">
                {mockCategoryData.map((entry, index) => (
                  <div key={entry.name} className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="text-xs text-muted-foreground">{entry.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2">
              <div>
                <CardTitle>Available Catches</CardTitle>
                <CardDescription>Fresh listings from fishers</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/buyer/marketplace" data-testid="link-view-marketplace">
                  View All
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {marketplaceLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : marketplaceData?.catches?.length > 0 ? (
                <div className="space-y-3">
                  {marketplaceData.catches.slice(0, 5).map((catchItem: any) => (
                    <div
                      key={catchItem.id}
                      className="flex items-center justify-between p-3 rounded-lg border hover-elevate cursor-pointer"
                      data-testid={`marketplace-item-${catchItem.id}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
                          <Fish className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{catchItem.species}</p>
                          <p className="text-sm text-muted-foreground">
                            {catchItem.quantity} {catchItem.unit}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {catchItem.currency} {catchItem.price_per_unit}/{catchItem.unit}
                        </p>
                        <Badge variant="secondary" className="text-xs">
                          {catchItem.quality}
                        </Badge>
                      </div>
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
            <CardHeader className="flex flex-row items-center justify-between gap-2">
              <div>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Your latest purchases</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/buyer/orders" data-testid="link-view-all-orders">
                  View All
                </Link>
              </Button>
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
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
                          <ShoppingCart className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {order.catches?.species || "Unknown"} - {order.quantity} units
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {order.fisher?.boat_name || "Unknown Fisher"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {order.currency} {order.total_price}
                        </p>
                        <Badge
                          variant={
                            order.status === "delivered"
                              ? "default"
                              : order.status === "cancelled"
                              ? "destructive"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          {order.status}
                        </Badge>
                      </div>
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

        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
            <CardDescription>Your purchasing metrics at a glance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Order Success Rate</span>
                  <span className="font-medium">95%</span>
                </div>
                <Progress value={95} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Repeat Purchase Rate</span>
                  <span className="font-medium">78%</span>
                </div>
                <Progress value={78} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Average Rating Given</span>
                  <span className="font-medium">4.5/5</span>
                </div>
                <Progress value={90} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </BuyerLayout>
  );
}
