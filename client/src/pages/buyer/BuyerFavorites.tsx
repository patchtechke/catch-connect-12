import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { BuyerLayout } from "@/components/buyer/BuyerLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  Fish,
  Search,
  Heart,
  ShoppingCart,
  MapPin,
  Star,
  CheckCircle,
  Trash2,
  HeartOff,
} from "lucide-react";

export default function BuyerFavorites() {
  const { session } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: favoritesData, isLoading } = useQuery({
    queryKey: ["/api/buyer/favorites"],
    enabled: !!session?.accessToken,
    queryFn: async () => {
      const res = await fetch("/api/buyer/favorites", {
        headers: { Authorization: `Bearer ${session?.accessToken}` },
      });
      if (!res.ok) {
        return { favorites: [] };
      }
      return res.json();
    },
  });

  const favorites = favoritesData?.favorites || [];

  const filteredFavorites = favorites.filter((item: any) => {
    return !searchQuery ||
      item.catches?.species?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.fisher?.boat_name?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <BuyerLayout breadcrumbs={[{ label: "Favorites" }]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-page-title">Favorites</h1>
            <p className="text-muted-foreground">Your saved catches and preferred fishers</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  Saved Items
                </CardTitle>
                <CardDescription>
                  {favorites.length} item{favorites.length !== 1 ? "s" : ""} saved
                </CardDescription>
              </div>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search favorites..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  data-testid="input-search-favorites"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-6 w-32" />
                      <Skeleton className="h-4 w-24" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-32 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredFavorites.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFavorites.map((item: any) => (
                  <Card key={item.id} className="hover-elevate" data-testid={`card-favorite-${item.id}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
                            <Fish className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{item.catches?.species || "Unknown"}</CardTitle>
                            <CardDescription>{item.fisher?.boat_name || "Unknown Fisher"}</CardDescription>
                          </div>
                        </div>
                        <Badge variant={item.catches?.quality === "premium" ? "default" : "secondary"}>
                          {item.catches?.quality || "N/A"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Available</p>
                          <p className="font-medium">{item.catches?.quantity || 0} {item.catches?.unit || "units"}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Price</p>
                          <p className="font-medium text-primary">
                            {item.catches?.currency || "KES"} {item.catches?.price_per_unit || 0}/{item.catches?.unit || "unit"}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        {item.fisher?.port && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>{item.fisher.port}, {item.fisher.country}</span>
                          </div>
                        )}
                        {item.fisher?.is_verified && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>Verified Fisher</span>
                          </div>
                        )}
                        {item.fisher?.rating && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span>{item.fisher.rating.toFixed(1)} rating</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="gap-2">
                      <Button
                        className="flex-1"
                        disabled={!item.catches?.is_available}
                        data-testid={`button-order-${item.id}`}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        {item.catches?.is_available ? "Order Now" : "Unavailable"}
                      </Button>
                      <Button variant="outline" size="icon" data-testid={`button-remove-${item.id}`}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <HeartOff className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No favorites yet</h3>
                <p className="mb-4">Save catches you like to quickly find them later.</p>
                <Button variant="outline" asChild>
                  <a href="/buyer/marketplace">Browse Marketplace</a>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </BuyerLayout>
  );
}
