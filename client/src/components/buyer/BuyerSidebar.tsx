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
  ShoppingBag,
  LayoutDashboard,
  Store,
  ShoppingCart,
  Heart,
  Settings,
  LogOut,
  Home,
  ChevronDown,
  List,
  Clock,
  CheckCircle,
  XCircle,
  User,
  Bell,
  Shield,
  Truck,
  Search,
  History,
} from "lucide-react";

interface BuyerSidebarProps {
  onLogout: () => void;
}

export function BuyerSidebar({ onLogout }: BuyerSidebarProps) {
  const [location] = useLocation();
  const { user } = useAuth();
  const [ordersOpen, setOrdersOpen] = useState(location.startsWith("/buyer/orders"));
  const [settingsOpen, setSettingsOpen] = useState(location.startsWith("/buyer/settings"));

  const isActive = (path: string) => location === path;
  const isParentActive = (basePath: string) => location.startsWith(basePath);

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <ShoppingBag className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold" data-testid="text-brand-name">MarineCatch</span>
            <span className="text-xs text-muted-foreground">Buyer Portal</span>
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
                <SidebarMenuButton asChild isActive={isActive("/buyer")}>
                  <Link href="/buyer" data-testid="link-buyer-overview">
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Overview</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/buyer/marketplace")}>
                  <Link href="/buyer/marketplace" data-testid="link-marketplace">
                    <Store className="h-4 w-4" />
                    <span>Marketplace</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <Collapsible open={ordersOpen} onOpenChange={setOrdersOpen} className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton isActive={isParentActive("/buyer/orders")} data-testid="button-orders-menu">
                      <ShoppingCart className="h-4 w-4" />
                      <span>My Orders</span>
                      <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild isActive={isActive("/buyer/orders")}>
                          <Link href="/buyer/orders" data-testid="link-all-orders">
                            <List className="h-4 w-4" />
                            <span>All Orders</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild isActive={isActive("/buyer/orders/pending")}>
                          <Link href="/buyer/orders/pending" data-testid="link-pending-orders">
                            <Clock className="h-4 w-4" />
                            <span>Pending</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild isActive={isActive("/buyer/orders/processing")}>
                          <Link href="/buyer/orders/processing" data-testid="link-processing-orders">
                            <Truck className="h-4 w-4" />
                            <span>Processing</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild isActive={isActive("/buyer/orders/completed")}>
                          <Link href="/buyer/orders/completed" data-testid="link-completed-orders">
                            <CheckCircle className="h-4 w-4" />
                            <span>Completed</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild isActive={isActive("/buyer/orders/cancelled")}>
                          <Link href="/buyer/orders/cancelled" data-testid="link-cancelled-orders">
                            <XCircle className="h-4 w-4" />
                            <span>Cancelled</span>
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
          <SidebarGroupLabel>Browse</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/buyer/favorites")}>
                  <Link href="/buyer/favorites" data-testid="link-favorites">
                    <Heart className="h-4 w-4" />
                    <span>Favorites</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/buyer/history")}>
                  <Link href="/buyer/history" data-testid="link-history">
                    <History className="h-4 w-4" />
                    <span>Purchase History</span>
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
                    <SidebarMenuButton isActive={isParentActive("/buyer/settings")} data-testid="button-settings-menu">
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                      <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild isActive={isActive("/buyer/settings/profile")}>
                          <Link href="/buyer/settings/profile" data-testid="link-settings-profile">
                            <User className="h-4 w-4" />
                            <span>Profile</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild isActive={isActive("/buyer/settings/notifications")}>
                          <Link href="/buyer/settings/notifications" data-testid="link-settings-notifications">
                            <Bell className="h-4 w-4" />
                            <span>Notifications</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild isActive={isActive("/buyer/settings/security")}>
                          <Link href="/buyer/settings/security" data-testid="link-settings-security">
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
          <Badge variant="secondary" className="text-xs">Buyer</Badge>
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
