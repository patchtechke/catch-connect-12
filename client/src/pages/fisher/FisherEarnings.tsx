import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { FisherLayout } from "@/components/fisher/FisherLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
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
import { useState } from "react";
import {
  Wallet,
  TrendingUp,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Calendar,
  CreditCard,
  BanknoteIcon,
  PiggyBank,
  CircleDollarSign,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const mockEarningsData = [
  { month: "Jan", earnings: 8500, expenses: 1200, net: 7300 },
  { month: "Feb", earnings: 11200, expenses: 1500, net: 9700 },
  { month: "Mar", earnings: 14500, expenses: 1800, net: 12700 },
  { month: "Apr", earnings: 10800, expenses: 1400, net: 9400 },
  { month: "May", earnings: 16200, expenses: 2100, net: 14100 },
  { month: "Jun", earnings: 19500, expenses: 2500, net: 17000 },
];

const mockTransactions = [
  { id: 1, date: "2024-06-15", type: "sale", description: "Tilapia - 50kg", amount: 5000, status: "completed" },
  { id: 2, date: "2024-06-14", type: "sale", description: "Nile Perch - 30kg", amount: 4500, status: "completed" },
  { id: 3, date: "2024-06-13", type: "payout", description: "Weekly Payout", amount: -8500, status: "completed" },
  { id: 4, date: "2024-06-12", type: "sale", description: "Catfish - 25kg", amount: 2800, status: "pending" },
  { id: 5, date: "2024-06-11", type: "sale", description: "Sardines - 100kg", amount: 6000, status: "completed" },
  { id: 6, date: "2024-06-10", type: "fee", description: "Platform Fee", amount: -250, status: "completed" },
];

const mockPayoutMethods = [
  { id: 1, type: "mpesa", name: "M-Pesa", number: "+254 712 ***678", isDefault: true },
  { id: 2, type: "bank", name: "Bank Transfer", number: "KCB ****1234", isDefault: false },
];

export default function FisherEarnings() {
  const { session } = useAuth();
  const [timeRange, setTimeRange] = useState("30d");

  const { data: statsData, isLoading } = useQuery({
    queryKey: ["/api/fisher/stats"],
    enabled: !!session?.accessToken,
    queryFn: async () => {
      const res = await fetch("/api/fisher/stats", {
        headers: { Authorization: `Bearer ${session?.accessToken}` },
      });
      if (!res.ok) throw new Error("Failed to fetch stats");
      return res.json();
    },
  });

  const totalEarnings = mockEarningsData.reduce((sum, m) => sum + m.earnings, 0);
  const totalExpenses = mockEarningsData.reduce((sum, m) => sum + m.expenses, 0);
  const netEarnings = totalEarnings - totalExpenses;

  return (
    <FisherLayout breadcrumbs={[{ label: "Earnings" }]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-page-title">Earnings</h1>
            <p className="text-muted-foreground">Track your revenue, payouts, and financial performance</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]" data-testid="select-time-range">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="12m">Last 12 months</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" data-testid="button-export">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-balance">KES 24,500</div>
              <Button variant="outline" size="sm" className="mt-2 w-full" data-testid="button-withdraw">
                <BanknoteIcon className="h-4 w-4 mr-2" />
                Withdraw
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-total-earnings">
                KES {totalEarnings.toLocaleString()}
              </div>
              <div className="flex items-center text-xs text-green-500 mt-1 gap-1">
                <ArrowUpRight className="h-3 w-3" />
                <span>+22.5% from last period</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-net-profit">
                KES {netEarnings.toLocaleString()}
              </div>
              <div className="flex items-center text-xs text-green-500 mt-1 gap-1">
                <ArrowUpRight className="h-3 w-3" />
                <span>+18.3% from last period</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <PiggyBank className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-pending">KES 2,800</div>
              <div className="flex items-center text-xs text-muted-foreground mt-1 gap-1">
                <span>Awaiting confirmation</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Earnings Overview</CardTitle>
              <CardDescription>Monthly earnings and net profit trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockEarningsData}>
                    <defs>
                      <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="netGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      formatter={(value: number) => [`KES ${value.toLocaleString()}`, ""]}
                    />
                    <Area
                      type="monotone"
                      dataKey="earnings"
                      stroke="hsl(var(--chart-1))"
                      fillOpacity={1}
                      fill="url(#earningsGradient)"
                      name="Gross Earnings"
                    />
                    <Area
                      type="monotone"
                      dataKey="net"
                      stroke="hsl(var(--chart-2))"
                      fillOpacity={1}
                      fill="url(#netGradient)"
                      name="Net Profit"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Payout Methods</CardTitle>
              <CardDescription>Manage your withdrawal options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockPayoutMethods.map((method) => (
                <div
                  key={method.id}
                  className="flex items-center justify-between p-4 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
                      {method.type === "mpesa" ? (
                        <CircleDollarSign className="h-5 w-5 text-primary" />
                      ) : (
                        <CreditCard className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{method.name}</p>
                      <p className="text-sm text-muted-foreground">{method.number}</p>
                    </div>
                  </div>
                  {method.isDefault && (
                    <Badge variant="secondary">Default</Badge>
                  )}
                </div>
              ))}
              <Button variant="outline" className="w-full" data-testid="button-add-payout">
                Add Payout Method
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <div>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your latest financial activities</CardDescription>
            </div>
            <Button variant="outline" size="sm" data-testid="button-view-all-transactions">
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockTransactions.map((transaction) => (
                  <TableRow key={transaction.id} data-testid={`transaction-row-${transaction.id}`}>
                    <TableCell className="text-muted-foreground">
                      {new Date(transaction.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-medium">{transaction.description}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          transaction.type === "sale"
                            ? "default"
                            : transaction.type === "payout"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {transaction.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={transaction.status === "completed" ? "secondary" : "outline"}
                        className={transaction.status === "completed" ? "text-green-500" : "text-yellow-500"}
                      >
                        {transaction.status}
                      </Badge>
                    </TableCell>
                    <TableCell
                      className={`text-right font-medium ${
                        transaction.amount > 0 ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {transaction.amount > 0 ? "+" : ""}KES {Math.abs(transaction.amount).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Breakdown</CardTitle>
              <CardDescription>Earnings vs Expenses comparison</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockEarningsData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      formatter={(value: number) => [`KES ${value.toLocaleString()}`, ""]}
                    />
                    <Bar dataKey="earnings" fill="hsl(var(--chart-1))" name="Earnings" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expenses" fill="hsl(var(--chart-3))" name="Expenses" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Financial Goals</CardTitle>
              <CardDescription>Track your progress towards targets</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Monthly Target (KES 100,000)</span>
                  <span className="font-medium">80%</span>
                </div>
                <Progress value={80} />
                <p className="text-xs text-muted-foreground">KES 20,000 remaining</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Quarterly Target (KES 300,000)</span>
                  <span className="font-medium">58%</span>
                </div>
                <Progress value={58} />
                <p className="text-xs text-muted-foreground">KES 126,000 remaining</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Annual Target (KES 1,200,000)</span>
                  <span className="font-medium">35%</span>
                </div>
                <Progress value={35} />
                <p className="text-xs text-muted-foreground">KES 780,000 remaining</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </FisherLayout>
  );
}
