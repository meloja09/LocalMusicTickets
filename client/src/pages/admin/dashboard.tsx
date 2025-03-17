import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useConcerts, useArtists, useVenues, useOrders } from "@/hooks/use-api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
  Users,
  Music,
  MapPin,
  Calendar,
  Clock,
  Ticket,
  ShoppingCart,
  BarChart3,
  PieChart,
  LineChart,
  DollarSign,
} from "lucide-react";

// Admin sidebar component
const AdminSidebar = () => {
  const [location] = useLocation();
  
  const items = [
    { href: "/admin", label: "Dashboard", icon: <BarChart3 className="h-4 w-4 mr-2" /> },
    { href: "/admin/concerts", label: "Concerts", icon: <Calendar className="h-4 w-4 mr-2" /> },
    { href: "/admin/artists", label: "Artists", icon: <Music className="h-4 w-4 mr-2" /> },
    { href: "/admin/venues", label: "Venues", icon: <MapPin className="h-4 w-4 mr-2" /> },
  ];
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <BarChart3 className="h-5 w-5 mr-2" />
          Admin Panel
        </CardTitle>
        <CardDescription>
          Manage your PinoyTix content
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {items.map((item) => (
            <Button
              key={item.href}
              variant={location === item.href ? "default" : "ghost"}
              className="w-full justify-start"
              asChild
            >
              <Link href={item.href}>
                {item.icon}
                {item.label}
              </Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const AdminDashboard = () => {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  
  const { data: concerts, isLoading: concertsLoading } = useConcerts();
  const { data: artists, isLoading: artistsLoading } = useArtists();
  const { data: venues, isLoading: venuesLoading } = useVenues();
  const { data: orders, isLoading: ordersLoading } = useOrders();
  
  // Redirect if not admin
  useEffect(() => {
    if (user && !user.isAdmin) {
      setLocation("/");
    }
  }, [user, setLocation]);
  
  // Calculate stats
  const totalRevenue = orders
    ? orders.reduce((sum, order) => sum + order.totalAmount, 0)
    : 0;
  
  const totalTicketsSold = orders
    ? orders.reduce((sum, order) => 
        sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 
        0)
    : 0;
  
  // Get upcoming concerts
  const upcomingConcerts = concerts
    ? concerts
        .filter(concert => new Date(concert.date) > new Date())
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 5)
    : [];
    
  // Get recent orders
  const recentOrders = orders
    ? orders
        .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
        .slice(0, 5)
    : [];
  
  return (
    <div className="bg-neutral-50 min-h-screen pb-16">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-neutral-900">Admin Dashboard</h1>
          <Button asChild>
            <Link href="/">View Website</Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="hidden md:block">
            <AdminSidebar />
          </div>
          
          {/* Main Content */}
          <div className="md:col-span-3 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Concerts */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-neutral-500 font-medium">Total Concerts</p>
                      {concertsLoading ? (
                        <Skeleton className="h-8 w-16 mt-1" />
                      ) : (
                        <p className="text-2xl font-bold">{concerts?.length || 0}</p>
                      )}
                    </div>
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Total Artists */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-neutral-500 font-medium">Total Artists</p>
                      {artistsLoading ? (
                        <Skeleton className="h-8 w-16 mt-1" />
                      ) : (
                        <p className="text-2xl font-bold">{artists?.length || 0}</p>
                      )}
                    </div>
                    <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center">
                      <Music className="h-6 w-6 text-secondary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Tickets Sold */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-neutral-500 font-medium">Tickets Sold</p>
                      {ordersLoading ? (
                        <Skeleton className="h-8 w-16 mt-1" />
                      ) : (
                        <p className="text-2xl font-bold">{totalTicketsSold}</p>
                      )}
                    </div>
                    <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                      <Ticket className="h-6 w-6 text-accent" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Total Revenue */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-neutral-500 font-medium">Revenue</p>
                      {ordersLoading ? (
                        <Skeleton className="h-8 w-16 mt-1" />
                      ) : (
                        <p className="text-2xl font-bold">₱{totalRevenue.toLocaleString()}</p>
                      )}
                    </div>
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Sales Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Ticket Sales</CardTitle>
                  <CardDescription>Last 30 days</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="h-[300px] flex items-center justify-center bg-neutral-50 rounded-md">
                    <LineChart className="h-16 w-16 text-neutral-300" />
                  </div>
                </CardContent>
              </Card>
              
              {/* Revenue by Genre */}
              <Card>
                <CardHeader>
                  <CardTitle>Sales by Genre</CardTitle>
                  <CardDescription>Distribution of ticket sales</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="h-[300px] flex items-center justify-center bg-neutral-50 rounded-md">
                    <PieChart className="h-16 w-16 text-neutral-300" />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Upcoming Concerts */}
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Concerts</CardTitle>
                  <CardDescription>Next events on the calendar</CardDescription>
                </CardHeader>
                <CardContent>
                  {concertsLoading ? (
                    <div className="space-y-3">
                      {Array(5).fill(0).map((_, i) => (
                        <div key={i} className="flex gap-3 items-center">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div className="space-y-1">
                            <Skeleton className="h-4 w-40" />
                            <Skeleton className="h-3 w-20" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : upcomingConcerts.length > 0 ? (
                    <div className="space-y-4">
                      {upcomingConcerts.map((concert) => (
                        <div key={concert.id} className="flex items-start gap-3">
                          <div className="w-10 h-10 flex-shrink-0 rounded-full bg-neutral-100 flex items-center justify-center">
                            <Calendar className="h-5 w-5 text-neutral-500" />
                          </div>
                          <div>
                            <Link href={`/concerts/${concert.id}`} className="font-medium hover:text-primary">
                              {concert.title}
                            </Link>
                            <div className="text-sm text-neutral-500 flex items-center mt-1">
                              <Clock className="h-3 w-3 mr-1" />
                              {format(new Date(concert.date), 'MMM dd, yyyy - h:mm a')}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-neutral-500">
                      No upcoming concerts scheduled
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Recent Orders */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>Latest ticket purchases</CardDescription>
                </CardHeader>
                <CardContent>
                  {ordersLoading ? (
                    <div className="space-y-3">
                      {Array(5).fill(0).map((_, i) => (
                        <div key={i} className="flex gap-3 items-center">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div className="space-y-1">
                            <Skeleton className="h-4 w-40" />
                            <Skeleton className="h-3 w-20" />
                          </div>
                          <div className="ml-auto">
                            <Skeleton className="h-6 w-16" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : recentOrders.length > 0 ? (
                    <div className="space-y-4">
                      {recentOrders.map((order) => (
                        <div key={order.id} className="flex items-start gap-3">
                          <div className="w-10 h-10 flex-shrink-0 rounded-full bg-neutral-100 flex items-center justify-center">
                            <ShoppingCart className="h-5 w-5 text-neutral-500" />
                          </div>
                          <div>
                            <div className="font-medium">Order #{order.id}</div>
                            <div className="text-sm text-neutral-500 flex items-center mt-1">
                              <Users className="h-3 w-3 mr-1" />
                              {order.userId}
                              <span className="mx-1">•</span>
                              <Clock className="h-3 w-3 mr-1" />
                              {format(new Date(order.orderDate), 'MMM dd, yyyy')}
                            </div>
                          </div>
                          <div className="ml-auto">
                            <Badge variant="outline" className="font-medium">
                              ₱{order.totalAmount.toLocaleString()}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-neutral-500">
                      No recent orders
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {/* Quick Links */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button asChild className="h-auto py-6">
                <Link href="/admin/concerts">
                  <Calendar className="h-5 w-5 mr-2" />
                  Manage Concerts
                </Link>
              </Button>
              <Button asChild className="h-auto py-6" variant="outline">
                <Link href="/admin/artists">
                  <Music className="h-5 w-5 mr-2" />
                  Manage Artists
                </Link>
              </Button>
              <Button asChild className="h-auto py-6" variant="outline">
                <Link href="/admin/venues">
                  <MapPin className="h-5 w-5 mr-2" />
                  Manage Venues
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
