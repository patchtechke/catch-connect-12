import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  CheckCircle, 
  XCircle, 
  KeyRound,
  Loader2,
  Search
} from "lucide-react";

export default function AdminUsers() {
  const { user, session } = useAuth();
  const [location] = useLocation();
  const { toast } = useToast();
  const [sendingResetFor, setSendingResetFor] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const getFilterParams = () => {
    if (location.includes("/active")) return { isActive: "true" };
    if (location.includes("/inactive")) return { isActive: "false" };
    return {};
  };

  const filterParams = getFilterParams();
  const queryString = new URLSearchParams({
    limit: "50",
    ...filterParams,
    ...(searchQuery ? { search: searchQuery } : {}),
  }).toString();

  const { data: usersData, isLoading } = useQuery({
    queryKey: ["/api/admin/users", filterParams, searchQuery],
    enabled: !!session?.accessToken,
    queryFn: async () => {
      const res = await fetch(`/api/admin/users?${queryString}`, {
        headers: { Authorization: `Bearer ${session?.accessToken}` },
      });
      if (!res.ok) throw new Error("Failed to fetch users");
      return res.json();
    },
  });

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

  const getPageTitle = () => {
    if (location.includes("/active")) return "Active Users";
    if (location.includes("/inactive")) return "Inactive Users";
    return "All Users";
  };

  const getBreadcrumbs = (): Array<{ label: string; href?: string }> => {
    const crumbs: Array<{ label: string; href?: string }> = [{ label: "Users", href: "/admin/users" }];
    if (location.includes("/active")) crumbs.push({ label: "Active" });
    if (location.includes("/inactive")) crumbs.push({ label: "Inactive" });
    return crumbs;
  };

  return (
    <AdminLayout breadcrumbs={getBreadcrumbs()}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-page-title">{getPageTitle()}</h1>
            <p className="text-muted-foreground">
              Manage and monitor platform users
            </p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-search-users"
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Users ({usersData?.total || 0})</CardTitle>
            <CardDescription>Platform users and their status</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : usersData?.users?.length > 0 ? (
              <div className="space-y-3">
                {usersData.users.map((userItem: any) => (
                  <div
                    key={userItem.id}
                    className="flex items-center justify-between p-4 rounded-lg border gap-4 flex-wrap"
                    data-testid={`user-item-${userItem.id}`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{userItem.first_name} {userItem.last_name}</p>
                      <p className="text-sm text-muted-foreground truncate">{userItem.email}</p>
                      <p className="text-xs text-muted-foreground">
                        Joined: {new Date(userItem.created_at).toLocaleDateString()}
                      </p>
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
      </div>
    </AdminLayout>
  );
}
