import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminCatches() {
  const { session } = useAuth();

  const { data: catchesData, isLoading } = useQuery({
    queryKey: ["/api/admin/catches"],
    enabled: !!session?.accessToken,
    queryFn: async () => {
      const res = await fetch("/api/admin/catches?limit=50", {
        headers: { Authorization: `Bearer ${session?.accessToken}` },
      });
      if (!res.ok) throw new Error("Failed to fetch catches");
      return res.json();
    },
  });

  return (
    <AdminLayout breadcrumbs={[{ label: "Catches" }]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-page-title">All Catches</h1>
          <p className="text-muted-foreground">
            View all catches listed on the platform
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Catches ({catchesData?.total || 0})</CardTitle>
            <CardDescription>All fish catches on the marketplace</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            ) : catchesData?.catches?.length > 0 ? (
              <div className="space-y-3">
                {catchesData.catches.map((catchItem: any) => (
                  <div
                    key={catchItem.id}
                    className="flex items-start justify-between p-4 rounded-lg border gap-4 flex-wrap"
                    data-testid={`catch-item-${catchItem.id}`}
                  >
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium">{catchItem.species}</p>
                        <Badge variant={catchItem.is_available ? "default" : "secondary"}>
                          {catchItem.is_available ? "Available" : "Sold"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {catchItem.quantity} {catchItem.unit} | {catchItem.currency} {catchItem.price_per_unit}/{catchItem.unit}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Quality: {catchItem.quality_grade} | Location: {catchItem.catch_location}
                      </p>
                      {catchItem.fishing_method && (
                        <p className="text-xs text-muted-foreground">
                          Method: {catchItem.fishing_method}
                        </p>
                      )}
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <p>Caught: {new Date(catchItem.catch_date).toLocaleDateString()}</p>
                      <p>Listed: {new Date(catchItem.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-8 text-muted-foreground">No catches found</p>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
