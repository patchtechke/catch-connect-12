import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { BuyerLayout } from "@/components/buyer/BuyerLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import {
  Fish,
  Search,
  Filter,
  Heart,
  ShoppingCart,
  MapPin,
  Star,
  CheckCircle,
  Clock,
  Anchor,
} from "lucide-react";

export default function BuyerMarketplace() {
  const { session } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [qualityFilter, setQualityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedCatch, setSelectedCatch] = useState<any>(null);
  const [orderQuantity, setOrderQuantity] = useState("");
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);

  const { data: marketplaceData, isLoading } = useQuery({
    queryKey: ["/api/buyer/marketplace", searchQuery, qualityFilter],
    enabled: !!session?.accessToken,
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery) params.append("species", searchQuery);
      if (qualityFilter !== "all") params.append("quality", qualityFilter);
      const res = await fetch(`/api/buyer/marketplace?${params}`, {
        headers: { Authorization: `Bearer ${session?.accessToken}` },
      });
      if (!res.ok) throw new Error("Failed to fetch marketplace");
      return res.json();
    },
  });

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: { catchId: string; quantity: number }) => {
      const res = await fetch("/api/buyer/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify(orderData),
      });
      if (!res.ok) throw new Error("Failed to create order");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/buyer/orders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/buyer/marketplace"] });
      queryClient.invalidateQueries({ queryKey: ["/api/buyer/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/fisher/orders"] });
      toast({
        title: "Order placed successfully",
        description: "The fisher will be notified of your order.",
      });
      setIsOrderDialogOpen(false);
      setSelectedCatch(null);
      setOrderQuantity("");
    },
    onError: () => {
      toast({
        title: "Failed to place order",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handlePlaceOrder = () => {
    if (!selectedCatch || !orderQuantity) return;
    createOrderMutation.mutate({
      catchId: selectedCatch.id,
      quantity: parseFloat(orderQuantity),
    });
  };

  const openOrderDialog = (catchItem: any) => {
    setSelectedCatch(catchItem);
    setOrderQuantity("");
    setIsOrderDialogOpen(true);
  };

  const catches = marketplaceData?.catches || [];

  const sortedCatches = [...catches].sort((a: any, b: any) => {
    switch (sortBy) {
      case "price_low":
        return a.price_per_unit - b.price_per_unit;
      case "price_high":
        return b.price_per_unit - a.price_per_unit;
      case "quantity":
        return b.quantity - a.quantity;
      default:
        return 0;
    }
  });

  return (
    <BuyerLayout breadcrumbs={[{ label: "Marketplace" }]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-page-title">Marketplace</h1>
            <p className="text-muted-foreground">Browse fresh catches from verified fishers</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search by species..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    data-testid="input-search"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Quality</Label>
                <Select value={qualityFilter} onValueChange={setQualityFilter}>
                  <SelectTrigger data-testid="select-quality">
                    <SelectValue placeholder="All qualities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Qualities</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="economy">Economy</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Sort By</Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger data-testid="select-sort">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="price_low">Price: Low to High</SelectItem>
                    <SelectItem value="price_high">Price: High to Low</SelectItem>
                    <SelectItem value="quantity">Quantity Available</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setSearchQuery("");
                    setQualityFilter("all");
                    setSortBy("newest");
                  }}
                  data-testid="button-clear-filters"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <Card>
            <CardContent className="py-8">
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-md" />
                    <Skeleton className="h-6 flex-1" />
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : sortedCatches.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Fish className="h-5 w-5" />
                Available Catches ({sortedCatches.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Species</TableHead>
                    <TableHead>Fisher</TableHead>
                    <TableHead>Quality</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedCatches.map((catchItem: any) => (
                    <TableRow key={catchItem.id} data-testid={`row-catch-${catchItem.id}`}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center">
                            <Fish className="h-4 w-4 text-primary" />
                          </div>
                          <span className="font-medium">{catchItem.species}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{catchItem.fisher?.boat_name || "Unknown"}</span>
                          {catchItem.fisher?.rating && (
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                              <Star className="h-3 w-3 text-yellow-500" />
                              {catchItem.fisher.rating.toFixed(1)}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={catchItem.quality === "premium" ? "default" : "secondary"} className="text-xs">
                          {catchItem.quality}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {catchItem.quantity} {catchItem.unit}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="font-medium text-primary">
                          {catchItem.currency} {catchItem.price_per_unit}
                        </span>
                        <span className="text-muted-foreground text-sm">/{catchItem.unit}</span>
                      </TableCell>
                      <TableCell>
                        {catchItem.fisher?.port ? (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span>{catchItem.fisher.port}, {catchItem.fisher.country}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {catchItem.fisher?.is_verified ? (
                          <div className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                            <CheckCircle className="h-3 w-3" />
                            <span>Verified</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">Pending</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            size="sm"
                            onClick={() => openOrderDialog(catchItem)}
                            data-testid={`button-order-${catchItem.id}`}
                          >
                            <ShoppingCart className="h-4 w-4 mr-1" />
                            Order
                          </Button>
                          <Button variant="ghost" size="icon" data-testid={`button-favorite-${catchItem.id}`}>
                            <Heart className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-12">
              <div className="text-center text-muted-foreground">
                <Anchor className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No catches available</h3>
                <p>Check back later for new listings from fishers.</p>
              </div>
            </CardContent>
          </Card>
        )}

        <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Place Order</DialogTitle>
              <DialogDescription>
                Order {selectedCatch?.species} from {selectedCatch?.fisher?.boat_name || "Fisher"}
              </DialogDescription>
            </DialogHeader>
            {selectedCatch && (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-muted">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Available</p>
                      <p className="font-medium">{selectedCatch.quantity} {selectedCatch.unit}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Price per {selectedCatch.unit}</p>
                      <p className="font-medium">{selectedCatch.currency} {selectedCatch.price_per_unit}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity">Order Quantity ({selectedCatch.unit})</Label>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder={`Max: ${selectedCatch.quantity}`}
                    value={orderQuantity}
                    onChange={(e) => setOrderQuantity(e.target.value)}
                    max={selectedCatch.quantity}
                    min={1}
                    data-testid="input-order-quantity"
                  />
                </div>

                {orderQuantity && (
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Total Price</span>
                      <span className="text-lg font-bold text-primary">
                        {selectedCatch.currency} {(parseFloat(orderQuantity) * selectedCatch.price_per_unit).toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOrderDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handlePlaceOrder}
                disabled={!orderQuantity || parseFloat(orderQuantity) <= 0 || createOrderMutation.isPending}
                data-testid="button-confirm-order"
              >
                {createOrderMutation.isPending ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Placing...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Place Order
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
