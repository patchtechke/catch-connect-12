import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { BuyerLayout } from "@/components/buyer/BuyerLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Eye,
  Fish,
  MapPin,
  Calendar,
  Star,
  Loader2,
} from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type OrderStatus = "all" | "pending" | "processing" | "delivered" | "cancelled";

export default function BuyerOrders() {
  const { session } = useAuth();
  const { toast } = useToast();
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isRatingDialogOpen, setIsRatingDialogOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [ratingComment, setRatingComment] = useState("");

  const getInitialTab = (): OrderStatus => {
    if (location.includes("/pending")) return "pending";
    if (location.includes("/processing")) return "processing";
    if (location.includes("/completed")) return "delivered";
    if (location.includes("/cancelled")) return "cancelled";
    return "all";
  };

  const [activeTab, setActiveTab] = useState<OrderStatus>(getInitialTab());

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

  const submitRatingMutation = useMutation({
    mutationFn: async ({ orderId, rating, comment }: { orderId: string; rating: number; comment?: string }) => {
      return apiRequest("/api/buyer/ratings", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId, rating, comment }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/buyer/orders"] });
      setIsRatingDialogOpen(false);
      setRating(0);
      setRatingComment("");
      toast({
        title: "Rating submitted",
        description: "Thank you for rating this fisher!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to submit rating. Please try again.",
        variant: "destructive",
      });
    },
  });

  const orders = ordersData?.orders || [];

  const filteredOrders = orders.filter((order: any) => {
    const matchesSearch =
      !searchQuery ||
      order.catches?.species?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.fisher?.boat_name?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = activeTab === "all" || order.status === activeTab;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case "processing":
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"><Truck className="h-3 w-3 mr-1" />Processing</Badge>;
      case "delivered":
        return <Badge variant="default"><CheckCircle className="h-3 w-3 mr-1" />Delivered</Badge>;
      case "cancelled":
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStatusCount = (status: string) => {
    if (status === "all") return orders.length;
    return orders.filter((o: any) => o.status === status).length;
  };

  const openOrderDetail = (order: any) => {
    setSelectedOrder(order);
    setIsDetailDialogOpen(true);
  };

  const openRatingDialog = (order: any) => {
    setSelectedOrder(order);
    setRating(0);
    setHoverRating(0);
    setRatingComment("");
    setIsRatingDialogOpen(true);
  };

  const handleSubmitRating = () => {
    if (!selectedOrder || rating === 0) return;
    submitRatingMutation.mutate({
      orderId: selectedOrder.id,
      rating,
      comment: ratingComment || undefined,
    });
  };

  const breadcrumbs = [{ label: "Orders" }];
  if (activeTab !== "all") {
    breadcrumbs.push({ label: activeTab.charAt(0).toUpperCase() + activeTab.slice(1) });
  }

  const StarRating = ({ value, hoverValue, onChange, onHover }: { 
    value: number; 
    hoverValue: number;
    onChange: (v: number) => void;
    onHover: (v: number) => void;
  }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => onHover(star)}
          onMouseLeave={() => onHover(0)}
          className="p-1 transition-transform hover:scale-110"
          data-testid={`button-star-${star}`}
        >
          <Star
            className={`h-8 w-8 ${
              star <= (hoverValue || value)
                ? "text-yellow-400 fill-yellow-400"
                : "text-muted-foreground"
            }`}
          />
        </button>
      ))}
    </div>
  );

  return (
    <BuyerLayout breadcrumbs={breadcrumbs}>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-page-title">My Orders</h1>
            <p className="text-muted-foreground">Track and manage your purchases</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-total-orders">
                {orders.length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-pending-orders">
                {getStatusCount("pending")}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium">Processing</CardTitle>
              <Truck className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-processing-orders">
                {getStatusCount("processing")}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium">Delivered</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-delivered-orders">
                {getStatusCount("delivered")}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <CardTitle>Order History</CardTitle>
                <CardDescription>View and track all your orders</CardDescription>
              </div>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  data-testid="input-search-orders"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as OrderStatus)}>
              <TabsList className="mb-4">
                <TabsTrigger value="all" data-testid="tab-all">
                  All ({getStatusCount("all")})
                </TabsTrigger>
                <TabsTrigger value="pending" data-testid="tab-pending">
                  Pending ({getStatusCount("pending")})
                </TabsTrigger>
                <TabsTrigger value="processing" data-testid="tab-processing">
                  Processing ({getStatusCount("processing")})
                </TabsTrigger>
                <TabsTrigger value="delivered" data-testid="tab-delivered">
                  Delivered ({getStatusCount("delivered")})
                </TabsTrigger>
                <TabsTrigger value="cancelled" data-testid="tab-cancelled">
                  Cancelled ({getStatusCount("cancelled")})
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab}>
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
                          <TableHead>Order ID</TableHead>
                          <TableHead>Species</TableHead>
                          <TableHead>Fisher</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredOrders.map((order: any) => (
                          <TableRow key={order.id} data-testid={`row-order-${order.id}`}>
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
                            <TableCell>{order.quantity} {order.catches?.unit || "units"}</TableCell>
                            <TableCell className="font-medium">
                              {order.currency} {order.total_price}
                            </TableCell>
                            <TableCell>{getStatusBadge(order.status)}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openOrderDetail(order)}
                                  data-testid={`button-view-order-${order.id}`}
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  View
                                </Button>
                                {order.status === "delivered" && !order.is_rated && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => openRatingDialog(order)}
                                    data-testid={`button-rate-order-${order.id}`}
                                  >
                                    <Star className="h-4 w-4 mr-1" />
                                    Rate
                                  </Button>
                                )}
                                {order.is_rated && (
                                  <Badge variant="secondary" className="ml-1">
                                    <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                                    Rated
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Package className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">No orders found</h3>
                    <p>
                      {activeTab === "all"
                        ? "You haven't placed any orders yet."
                        : `No ${activeTab} orders.`}
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Order Details</DialogTitle>
              <DialogDescription>
                Order #{selectedOrder?.id?.slice(0, 8)}
              </DialogDescription>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Status</span>
                  {getStatusBadge(selectedOrder.status)}
                </div>

                <div className="p-4 rounded-lg bg-muted space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-md bg-primary/10 flex items-center justify-center">
                      <Fish className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{selectedOrder.catches?.species}</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedOrder.quantity} {selectedOrder.catches?.unit}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Fisher</span>
                    <span className="font-medium">{selectedOrder.fisher?.boat_name || "Unknown"}</span>
                  </div>
                  {selectedOrder.fisher?.port && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Location</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {selectedOrder.fisher.port}, {selectedOrder.fisher.country}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Price per unit</span>
                    <span>{selectedOrder.catches?.currency} {selectedOrder.catches?.price_per_unit}</span>
                  </div>
                  {selectedOrder.created_at && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Order Date</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(selectedOrder.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Total Amount</span>
                    <span className="text-xl font-bold text-primary">
                      {selectedOrder.currency} {selectedOrder.total_price}
                    </span>
                  </div>
                </div>

                {selectedOrder.status === "delivered" && !selectedOrder.is_rated && (
                  <Button 
                    className="w-full" 
                    onClick={() => {
                      setIsDetailDialogOpen(false);
                      openRatingDialog(selectedOrder);
                    }}
                  >
                    <Star className="h-4 w-4 mr-2" />
                    Rate this Fisher
                  </Button>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={isRatingDialogOpen} onOpenChange={setIsRatingDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Rate Your Experience
              </DialogTitle>
              <DialogDescription>
                How was your experience with {selectedOrder?.fisher?.boat_name || "this fisher"}?
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="flex flex-col items-center gap-2">
                <Label className="text-center">Select a rating</Label>
                <StarRating
                  value={rating}
                  hoverValue={hoverRating}
                  onChange={setRating}
                  onHover={setHoverRating}
                />
                <p className="text-sm text-muted-foreground">
                  {rating === 0 && "Click to rate"}
                  {rating === 1 && "Poor"}
                  {rating === 2 && "Fair"}
                  {rating === 3 && "Good"}
                  {rating === 4 && "Very Good"}
                  {rating === 5 && "Excellent"}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="comment">Comment (optional)</Label>
                <Textarea
                  id="comment"
                  placeholder="Share your experience with this fisher..."
                  value={ratingComment}
                  onChange={(e) => setRatingComment(e.target.value)}
                  className="resize-none"
                  rows={4}
                  data-testid="input-rating-comment"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsRatingDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmitRating}
                disabled={rating === 0 || submitRatingMutation.isPending}
              >
                {submitRatingMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Star className="h-4 w-4 mr-2" />
                    Submit Rating
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </BuyerLayout>
  );
}
