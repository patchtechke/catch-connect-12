import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Shield,
  LayoutDashboard,
  Users,
  Fish,
  ShoppingBag,
  Package,
  ShoppingCart,
  BarChart3,
  Settings,
  LogOut,
  Home,
  ChevronDown,
  List,
  CheckCircle,
  XCircle,
  User,
  Bell,
  FileText,
  TrendingUp,
  DollarSign,
  Activity,
} from "lucide-react";

interface AdminSidebarProps {
  onLogout: () => void;
}

export function AdminSidebar({ onLogout }: AdminSidebarProps) {
  const [location] = useLocation();
  const { user } = useAuth();
  const [usersOpen, setUsersOpen] = useState(location.startsWith("/admin/users"));
  const [fishersOpen, setFishersOpen] = useState(location.startsWith("/admin/fishers"));
  const [buyersOpen, setBuyersOpen] = useState(location.startsWith("/admin/buyers"));
  const [ordersOpen, setOrdersOpen] = useState(location.startsWith("/admin/orders"));
  const [reportsOpen, setReportsOpen] = useState(location.startsWith("/admin/reports"));
  const [settingsOpen, setSettingsOpen] = useState(location.startsWith("/admin/settings"));

  const isActive = (path: string) => location === path;
  const isParentActive = (basePath: string) => location.startsWith(basePath);

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Shield className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold" data-testid="text-brand-name">MarineCatch</span>
            <span className="text-xs text-muted-foreground">Admin Portal</span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/admin")}>
                  <Link href="/admin" data-testid="link-admin-overview">
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <Collapsible open={usersOpen} onOpenChange={setUsersOpen} className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton isActive={isParentActive("/admin/users")} data-testid="button-users-menu">
                      <Users className="h-4 w-4" />
                      <span>Users</span>
                      <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild isActive={isActive("/admin/users")}>
                          <Link href="/admin/users" data-testid="link-all-users">
                            <List className="h-4 w-4" />
                            <span>All Users</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild isActive={isActive("/admin/users/active")}>
                          <Link href="/admin/users/active" data-testid="link-active-users">
                            <CheckCircle className="h-4 w-4" />
                            <span>Active</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild isActive={isActive("/admin/users/inactive")}>
                          <Link href="/admin/users/inactive" data-testid="link-inactive-users">
                            <XCircle className="h-4 w-4" />
                            <span>Inactive</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              <Collapsible open={fishersOpen} onOpenChange={setFishersOpen} className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton isActive={isParentActive("/admin/fishers")} data-testid="button-fishers-menu">
                      <Fish className="h-4 w-4" />
                      <span>Fishers</span>
                      <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild isActive={isActive("/admin/fishers")}>
                          <Link href="/admin/fishers" data-testid="link-all-fishers">
                            <List className="h-4 w-4" />
                            <span>All Fishers</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild isActive={isActive("/admin/fishers/verified")}>
                          <Link href="/admin/fishers/verified" data-testid="link-verified-fishers">
                            <CheckCircle className="h-4 w-4" />
                            <span>Verified</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild isActive={isActive("/admin/fishers/pending")}>
                          <Link href="/admin/fishers/pending" data-testid="link-pending-fishers">
                            <XCircle className="h-4 w-4" />
                            <span>Pending Verification</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              <Collapsible open={buyersOpen} onOpenChange={setBuyersOpen} className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton isActive={isParentActive("/admin/buyers")} data-testid="button-buyers-menu">
                      <ShoppingBag className="h-4 w-4" />
                      <span>Buyers</span>
                      <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild isActive={isActive("/admin/buyers")}>
                          <Link href="/admin/buyers" data-testid="link-all-buyers">
                            <List className="h-4 w-4" />
                            <span>All Buyers</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild isActive={isActive("/admin/buyers/verified")}>
                          <Link href="/admin/buyers/verified" data-testid="link-verified-buyers">
                            <CheckCircle className="h-4 w-4" />
                            <span>Verified</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild isActive={isActive("/admin/buyers/pending")}>
                          <Link href="/admin/buyers/pending" data-testid="link-pending-buyers">
                            <XCircle className="h-4 w-4" />
                            <span>Pending Verification</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Transactions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <Collapsible open={ordersOpen} onOpenChange={setOrdersOpen} className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton isActive={isParentActive("/admin/orders")} data-testid="button-orders-menu">
                      <ShoppingCart className="h-4 w-4" />
                      <span>Orders</span>
                      <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild isActive={isActive("/admin/orders")}>
                          <Link href="/admin/orders" data-testid="link-all-orders">
                            <List className="h-4 w-4" />
                            <span>All Orders</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild isActive={isActive("/admin/orders/pending")}>
                          <Link href="/admin/orders/pending" data-testid="link-pending-orders">
                            <Activity className="h-4 w-4" />
                            <span>Pending</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild isActive={isActive("/admin/orders/completed")}>
                          <Link href="/admin/orders/completed" data-testid="link-completed-orders">
                            <CheckCircle className="h-4 w-4" />
                            <span>Completed</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild isActive={isActive("/admin/orders/cancelled")}>
                          <Link href="/admin/orders/cancelled" data-testid="link-cancelled-orders">
                            <XCircle className="h-4 w-4" />
                            <span>Cancelled</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/admin/catches")}>
                  <Link href="/admin/catches" data-testid="link-catches">
                    <Package className="h-4 w-4" />
                    <span>Catches</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Analytics</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <Collapsible open={reportsOpen} onOpenChange={setReportsOpen} className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton isActive={isParentActive("/admin/reports")} data-testid="button-reports-menu">
                      <BarChart3 className="h-4 w-4" />
                      <span>Reports</span>
                      <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild isActive={isActive("/admin/reports")}>
                          <Link href="/admin/reports" data-testid="link-reports-overview">
                            <FileText className="h-4 w-4" />
                            <span>Overview</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild isActive={isActive("/admin/reports/revenue")}>
                          <Link href="/admin/reports/revenue" data-testid="link-revenue-reports">
                            <DollarSign className="h-4 w-4" />
                            <span>Revenue</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild isActive={isActive("/admin/reports/trends")}>
                          <Link href="/admin/reports/trends" data-testid="link-trends-reports">
                            <TrendingUp className="h-4 w-4" />
                            <span>Trends</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <Collapsible open={settingsOpen} onOpenChange={setSettingsOpen} className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton isActive={isParentActive("/admin/settings")} data-testid="button-settings-menu">
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                      <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild isActive={isActive("/admin/settings/profile")}>
                          <Link href="/admin/settings/profile" data-testid="link-settings-profile">
                            <User className="h-4 w-4" />
                            <span>Profile</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild isActive={isActive("/admin/settings/notifications")}>
                          <Link href="/admin/settings/notifications" data-testid="link-settings-notifications">
                            <Bell className="h-4 w-4" />
                            <span>Notifications</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild isActive={isActive("/admin/settings/security")}>
                          <Link href="/admin/settings/security" data-testid="link-settings-security">
                            <Shield className="h-4 w-4" />
                            <span>Security</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.avatarUrl} alt={user?.firstName} />
            <AvatarFallback>
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate" data-testid="text-user-name">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-muted-foreground truncate" data-testid="text-user-email">
              {user?.email}
            </p>
          </div>
          <Badge variant="default" className="text-xs">Admin</Badge>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1" asChild>
            <Link href="/" data-testid="link-home">
              <Home className="h-4 w-4 mr-2" />
              Home
            </Link>
          </Button>
          <Button variant="ghost" size="sm" onClick={onLogout} data-testid="button-logout">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
