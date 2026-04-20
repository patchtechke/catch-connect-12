import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  User,
  Bell,
  Shield,
  Save
} from "lucide-react";

export default function AdminSettings() {
  const [location] = useLocation();
  const { user } = useAuth();

  const getPageTitle = () => {
    if (location.includes("/profile")) return "Profile Settings";
    if (location.includes("/notifications")) return "Notification Settings";
    if (location.includes("/security")) return "Security Settings";
    return "Settings";
  };

  const getBreadcrumbs = (): Array<{ label: string; href?: string }> => {
    const crumbs: Array<{ label: string; href?: string }> = [{ label: "Settings", href: "/admin/settings" }];
    if (location.includes("/profile")) crumbs.push({ label: "Profile" });
    if (location.includes("/notifications")) crumbs.push({ label: "Notifications" });
    if (location.includes("/security")) crumbs.push({ label: "Security" });
    return crumbs;
  };

  const renderContent = () => {
    if (location.includes("/profile")) {
      return (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <CardTitle>Profile Information</CardTitle>
            </div>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" defaultValue={user?.firstName} data-testid="input-first-name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" defaultValue={user?.lastName} data-testid="input-last-name" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue={user?.email} disabled data-testid="input-email" />
              <p className="text-xs text-muted-foreground">Email cannot be changed</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" defaultValue={user?.phoneNumber || ""} data-testid="input-phone" />
            </div>
            <Button data-testid="button-save-profile">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </CardContent>
        </Card>
      );
    }

    if (location.includes("/notifications")) {
      return (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              <CardTitle>Notification Preferences</CardTitle>
            </div>
            <CardDescription>Manage how you receive notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications via email</p>
              </div>
              <Switch defaultChecked data-testid="switch-email-notifications" />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>New User Alerts</Label>
                <p className="text-sm text-muted-foreground">Get notified when new users register</p>
              </div>
              <Switch defaultChecked data-testid="switch-new-user-alerts" />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Order Updates</Label>
                <p className="text-sm text-muted-foreground">Receive updates on order status changes</p>
              </div>
              <Switch defaultChecked data-testid="switch-order-updates" />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Verification Requests</Label>
                <p className="text-sm text-muted-foreground">Get notified for pending verifications</p>
              </div>
              <Switch defaultChecked data-testid="switch-verification-requests" />
            </div>
            <Button data-testid="button-save-notifications">
              <Save className="h-4 w-4 mr-2" />
              Save Preferences
            </Button>
          </CardContent>
        </Card>
      );
    }

    if (location.includes("/security")) {
      return (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle>Security Settings</CardTitle>
            </div>
            <CardDescription>Manage your account security</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-medium">Change Password</h3>
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" data-testid="input-current-password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" data-testid="input-new-password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" data-testid="input-confirm-password" />
              </div>
              <Button data-testid="button-change-password">
                <Shield className="h-4 w-4 mr-2" />
                Update Password
              </Button>
            </div>
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                </div>
                <Switch data-testid="switch-2fa" />
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover-elevate cursor-pointer" onClick={() => window.location.href = "/admin/settings/profile"}>
          <CardHeader>
            <User className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Profile</CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
        </Card>
        <Card className="hover-elevate cursor-pointer" onClick={() => window.location.href = "/admin/settings/notifications"}>
          <CardHeader>
            <Bell className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Manage notification preferences</CardDescription>
          </CardHeader>
        </Card>
        <Card className="hover-elevate cursor-pointer" onClick={() => window.location.href = "/admin/settings/security"}>
          <CardHeader>
            <Shield className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Security</CardTitle>
            <CardDescription>Update password and security settings</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  };

  return (
    <AdminLayout breadcrumbs={getBreadcrumbs()}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-page-title">{getPageTitle()}</h1>
          <p className="text-muted-foreground">
            Manage your account settings
          </p>
        </div>
        {renderContent()}
      </div>
    </AdminLayout>
  );
}
