import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { 
  CheckCircle, 
  XCircle, 
  Loader2,
  ShieldCheck,
  ShieldX
} from "lucide-react";

export default function AdminFishers() {
  const { session } = useAuth();
  const [location] = useLocation();
  const { toast } = useToast();

  const getFilterParams = () => {
    if (location.includes("/verified")) return { isVerified: "true" };
    if (location.includes("/pending")) return { isVerified: "false" };
    return {};
  };

  const filterParams = getFilterParams();
  const queryString = new URLSearchParams({
    limit: "50",
    ...filterParams,
  }).toString();

  const { data: fishersData, isLoading } = useQuery({
    queryKey: ["/api/admin/fishers", filterParams],
    enabled: !!session?.accessToken,
    queryFn: async () => {
      const res = await fetch(`/api/admin/fishers?${queryString}`, {
        headers: { Authorization: `Bearer ${session?.accessToken}` },
      });
      if (!res.ok) throw new Error("Failed to fetch fishers");
      return res.json();
    },
  });

  const verifyMutation = useMutation({
    mutationFn: async ({ fisherId, isVerified }: { fisherId: string; isVerified: boolean }) => {
      const res = await fetch(`/api/admin/fishers/${fisherId}/verify`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isVerified }),
      });
      if (!res.ok) throw new Error("Failed to update verification status");
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: data.message,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/fishers"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update verification status",
        variant: "destructive",
      });
    },
  });

  const getPageTitle = () => {
    if (location.includes("/verified")) return "Verified Fishers";
    if (location.includes("/pending")) return "Pending Verification";
    return "All Fishers";
  };

  const getBreadcrumbs = (): Array<{ label: string; href?: string }> => {
    const crumbs: Array<{ label: string; href?: string }> = [{ label: "Fishers", href: "/admin/fishers" }];
    if (location.includes("/verified")) crumbs.push({ label: "Verified" });
    if (location.includes("/pending")) crumbs.push({ label: "Pending" });
    return crumbs;
  };

  return (
    <AdminLayout breadcrumbs={getBreadcrumbs()}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-page-title">{getPageTitle()}</h1>
          <p className="text-muted-foreground">
            Manage and verify fisher profiles
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Fishers ({fishersData?.total || 0})</CardTitle>
            <CardDescription>Fisher profiles and verification status</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : fishersData?.fishers?.length > 0 ? (
              <div className="space-y-3">
                {fishersData.fishers.map((fisher: any) => (
                  <div
                    key={fisher.id}
                    className="flex items-center justify-between p-4 rounded-lg border gap-4 flex-wrap"
                    data-testid={`fisher-item-${fisher.id}`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">
                        {fisher.user?.first_name} {fisher.user?.last_name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {fisher.user?.email}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {fisher.boat_name || "No boat"} | {fisher.country}
                      </p>
                      {fisher.license_number && (
                        <p className="text-xs text-muted-foreground">
                          License: {fisher.license_number}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {fisher.user?.is_active ? (
                        <Badge variant="outline" className="gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="gap-1">
                          <XCircle className="h-3 w-3" />
                          Inactive
                        </Badge>
                      )}
                      {fisher.is_verified ? (
                        <Badge variant="default" className="gap-1">
                          <ShieldCheck className="h-3 w-3" />
                          Verified
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Pending</Badge>
                      )}
                      <Button
                        variant={fisher.is_verified ? "outline" : "default"}
                        size="sm"
                        onClick={() => verifyMutation.mutate({
                          fisherId: fisher.id,
                          isVerified: !fisher.is_verified,
                        })}
                        disabled={verifyMutation.isPending}
                        data-testid={`button-toggle-verify-${fisher.id}`}
                      >
                        {verifyMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : fisher.is_verified ? (
                          <>
                            <ShieldX className="h-4 w-4 mr-1" />
                            Revoke
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="h-4 w-4 mr-1" />
                            Verify
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-8 text-muted-foreground">No fishers found</p>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
