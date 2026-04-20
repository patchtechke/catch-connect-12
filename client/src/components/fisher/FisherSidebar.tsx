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
  Fish,
  LayoutDashboard,
  Package,
  ShoppingCart,
  BarChart3,
  Wallet,
  Settings,
  LogOut,
  Home,
  ChevronDown,
  TrendingUp,
  PieChart,
  LineChart,
  Users,
  MapPin,
  Calendar,
  Plus,
  List,
  Clock,
  CheckCircle,
  XCircle,
  User,
  Bell,
  Shield,
} from "lucide-react";

interface FisherSidebarProps {
  onLogout: () => void;
}

export function FisherSidebar({ onLogout }: FisherSidebarProps) {
  const [location] = useLocation();
  const { user } = useAuth();
  const [analyticsOpen, setAnalyticsOpen] = useState(location.startsWith("/fisher/analytics"));
  const [catchesOpen, setCatchesOpen] = useState(location.startsWith("/fisher/catches"));
  const [ordersOpen, setOrdersOpen] = useState(location.startsWith("/fisher/orders"));
  const [settingsOpen, setSettingsOpen] = useState(location.startsWith("/fisher/settings"));

  const isActive = (path: string) => location === path;
  const isParentActive = (basePath: string) => location.startsWith(basePath);

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Fish className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold" data-testid="text-brand-name">MarineCatch</span>
            <span className="text-xs text-muted-foreground">Fisher Portal</span>
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
                <SidebarMenuButton asChild isActive={isActive("/fisher")}>
                  <Link href="/fisher" data-testid="link-fisher-overview">
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Overview</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <Collapsible open={catchesOpen} onOpenChange={setCatchesOpen} className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton isActive={isParentActive("/fisher/catches")} data-testid="button-catches-menu">
                      <Package className="h-4 w-4" />
                      <span>My Catches</span>
                      <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild isActive={isActive("/fisher/catches")}>
                          <Link href="/fisher/catches" data-testid="link-all-catches">
                            <List className="h-4 w-4" />
                            <span>All Catches</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild isActive={isActive("/fisher/catches/add")}>
                          <Link href="/fisher/catches/add" data-testid="link-add-catch">
                            <Plus className="h-4 w-4" />
                            <span>Add New Catch</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild isActive={isActive("/fisher/catches/active")}>
                          <Link href="/fisher/catches/active" data-testid="link-active-catches">
                            <CheckCircle className="h-4 w-4" />
                            <span>Active Listings</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild isActive={isActive("/fisher/catches/sold")}>
                          <Link href="/fisher/catches/sold" data-testid="link-sold-catches">
                            <XCircle className="h-4 w-4" />
                            <span>Sold Items</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              <Collapsible open={ordersOpen} onOpenChange={setOrdersOpen} className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton isActive={isParentActive("/fisher/orders")} data-testid="button-orders-menu">
                      <ShoppingCart className="h-4 w-4" />
                      <span>Orders</span>
                      <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild isActive={isActive("/fisher/orders")}>
                          <Link href="/fisher/orders" data-testid="link-all-orders">
                            <List className="h-4 w-4" />
                            <span>All Orders</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild isActive={isActive("/fisher/orders/pending")}>
                          <Link href="/fisher/orders/pending" data-testid="link-pending-orders">
                            <Clock className="h-4 w-4" />
                            <span>Pending</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild isActive={isActive("/fisher/orders/completed")}>
                          <Link href="/fisher/orders/completed" data-testid="link-completed-orders">
                            <CheckCircle className="h-4 w-4" />
                            <span>Completed</span>
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
          <SidebarGroupLabel>Insights</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <Collapsible open={analyticsOpen} onOpenChange={setAnalyticsOpen} className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton isActive={isParentActive("/fisher/analytics")} data-testid="button-analytics-menu">
                      <BarChart3 className="h-4 w-4" />
                      <span>Analytics</span>
                      <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild isActive={isActive("/fisher/analytics")}>
                          <Link href="/fisher/analytics" data-testid="link-analytics-overview">
                            <PieChart className="h-4 w-4" />
                            <span>Overview</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild isActive={isActive("/fisher/analytics/sales")}>
                          <Link href="/fisher/analytics/sales" data-testid="link-analytics-sales">
                            <TrendingUp className="h-4 w-4" />
                            <span>Sales Trends</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild isActive={isActive("/fisher/analytics/performance")}>
                          <Link href="/fisher/analytics/performance" data-testid="link-analytics-performance">
                            <LineChart className="h-4 w-4" />
                            <span>Performance</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild isActive={isActive("/fisher/analytics/customers")}>
                          <Link href="/fisher/analytics/customers" data-testid="link-analytics-customers">
                            <Users className="h-4 w-4" />
                            <span>Customer Insights</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild isActive={isActive("/fisher/analytics/locations")}>
                          <Link href="/fisher/analytics/locations" data-testid="link-analytics-locations">
                            <MapPin className="h-4 w-4" />
                            <span>Location Data</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/fisher/earnings")}>
                  <Link href="/fisher/earnings" data-testid="link-earnings">
                    <Wallet className="h-4 w-4" />
                    <span>Earnings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/fisher/calendar")}>
                  <Link href="/fisher/calendar" data-testid="link-calendar">
                    <Calendar className="h-4 w-4" />
                    <span>Catch Calendar</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
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
                    <SidebarMenuButton isActive={isParentActive("/fisher/settings")} data-testid="button-settings-menu">
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                      <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild isActive={isActive("/fisher/settings/profile")}>
                          <Link href="/fisher/settings/profile" data-testid="link-settings-profile">
                            <User className="h-4 w-4" />
                            <span>Profile</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild isActive={isActive("/fisher/settings/notifications")}>
                          <Link href="/fisher/settings/notifications" data-testid="link-settings-notifications">
                            <Bell className="h-4 w-4" />
                            <span>Notifications</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild isActive={isActive("/fisher/settings/security")}>
                          <Link href="/fisher/settings/security" data-testid="link-settings-security">
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
          <Badge variant="secondary" className="text-xs">Fisher</Badge>
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
