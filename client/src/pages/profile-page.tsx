import { useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useOrders } from "@/hooks/use-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import {
  User,
  Mail,
  Phone,
  Home,
  Settings,
  Ticket,
  Calendar,
  Clock,
  Map,
  Save,
  FileText,
  Download,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

const profileSchema = z.object({
  fullName: z.string().min(3, { message: "Full name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().optional(),
  address: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const ProfilePage = () => {
  const { user } = useAuth();
  const { data: orders, isLoading: ordersLoading } = useOrders();
  
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Setup form with user data
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address || "",
    },
  });
  
  const onSubmit = async (data: ProfileFormValues) => {
    setSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      setEditMode(false);
    }, 1000);
  };
  
  // Sort orders by date (most recent first)
  const sortedOrders = orders?.sort((a, b) => 
    new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
  );
  
  // Get upcoming concerts from orders
  const upcomingConcerts = sortedOrders?.flatMap(order => 
    order.items
      .filter(item => {
        const concertDate = item.ticketType?.concert?.date;
        return concertDate && new Date(concertDate) > new Date();
      })
      .map(item => ({
        orderId: order.id,
        concert: item.ticketType?.concert,
        ticketType: item.ticketType,
        quantity: item.quantity,
        purchaseDate: order.orderDate,
      }))
  ) || [];
  
  // Get past concerts
  const pastConcerts = sortedOrders?.flatMap(order => 
    order.items
      .filter(item => {
        const concertDate = item.ticketType?.concert?.date;
        return concertDate && new Date(concertDate) <= new Date();
      })
      .map(item => ({
        orderId: order.id,
        concert: item.ticketType?.concert,
        ticketType: item.ticketType,
        quantity: item.quantity,
        purchaseDate: order.orderDate,
      }))
  ) || [];
  
  return (
    <div className="bg-neutral-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-neutral-900">My Profile</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-2">
                  <User className="h-10 w-10" />
                </div>
                <CardTitle>{user?.fullName || user?.username}</CardTitle>
                {user?.isAdmin && (
                  <Badge className="mt-2 mx-auto">Admin</Badge>
                )}
              </CardHeader>
              
              <CardContent className="space-y-1 text-sm">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-neutral-500" />
                  <span className="text-neutral-700">{user?.email}</span>
                </div>
                {user?.phone && (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-neutral-500" />
                    <span className="text-neutral-700">{user.phone}</span>
                  </div>
                )}
                {user?.address && (
                  <div className="flex items-center">
                    <Home className="h-4 w-4 mr-2 text-neutral-500" />
                    <span className="text-neutral-700">{user.address}</span>
                  </div>
                )}
              </CardContent>
              
              <CardFooter>
                {user?.isAdmin && (
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/admin">
                      <Settings className="h-4 w-4 mr-2" />
                      Admin Dashboard
                    </Link>
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="md:col-span-3">
            <Tabs defaultValue="tickets" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="tickets">My Tickets</TabsTrigger>
                <TabsTrigger value="orders">Order History</TabsTrigger>
                <TabsTrigger value="settings">Account Settings</TabsTrigger>
              </TabsList>
              
              {/* My Tickets Tab */}
              <TabsContent value="tickets" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>My Tickets</CardTitle>
                    <CardDescription>
                      View all your upcoming and past concert tickets
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="upcoming">
                      <TabsList className="grid w-full grid-cols-2 mb-6">
                        <TabsTrigger value="upcoming">Upcoming Concerts</TabsTrigger>
                        <TabsTrigger value="past">Past Concerts</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="upcoming">
                        {ordersLoading ? (
                          <div className="space-y-4">
                            {Array(3).fill(0).map((_, i) => (
                              <Card key={i}>
                                <CardContent className="p-6">
                                  <div className="flex flex-col md:flex-row gap-4">
                                    <Skeleton className="h-32 w-full md:w-32 rounded" />
                                    <div className="flex-grow space-y-2">
                                      <Skeleton className="h-6 w-3/4" />
                                      <Skeleton className="h-4 w-1/2" />
                                      <Skeleton className="h-4 w-2/3" />
                                      <div className="flex justify-between mt-4">
                                        <Skeleton className="h-10 w-28" />
                                        <Skeleton className="h-10 w-28" />
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        ) : upcomingConcerts.length > 0 ? (
                          <div className="space-y-4">
                            {upcomingConcerts.map((item, index) => (
                              <Card key={index}>
                                <CardContent className="p-6">
                                  <div className="flex flex-col md:flex-row gap-4">
                                    <div className="h-32 w-full md:w-32 rounded bg-neutral-100 overflow-hidden">
                                      <img 
                                        src={item.concert?.imageUrl || "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"} 
                                        alt={item.concert?.title} 
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <div className="flex-grow">
                                      <h3 className="font-bold text-lg mb-1">{item.concert?.title}</h3>
                                      <div className="space-y-1 text-sm text-neutral-600 mb-3">
                                        <div className="flex items-center">
                                          <Calendar className="h-3 w-3 mr-1" />
                                          <span>{item.concert?.date && format(new Date(item.concert.date), 'EEEE, MMMM dd, yyyy')}</span>
                                        </div>
                                        <div className="flex items-center">
                                          <Clock className="h-3 w-3 mr-1" />
                                          <span>{item.concert?.date && format(new Date(item.concert.date), 'h:mm a')}</span>
                                        </div>
                                        <div className="flex items-center">
                                          <Map className="h-3 w-3 mr-1" />
                                          <span>{item.concert?.venue?.name}, {item.concert?.venue?.location}</span>
                                        </div>
                                      </div>
                                      <div className="flex justify-between items-center">
                                        <div>
                                          <Badge variant="outline" className="mr-2">
                                            {item.ticketType?.name}
                                          </Badge>
                                          <span className="text-sm text-neutral-600">
                                            x{item.quantity}
                                          </span>
                                        </div>
                                        <div className="flex gap-2">
                                          <Button variant="outline" size="sm" className="flex items-center">
                                            <Download className="h-4 w-4 mr-1" />
                                            E-Ticket
                                          </Button>
                                          <Button size="sm" asChild>
                                            <Link href={`/concerts/${item.concert?.id}`}>
                                              View
                                            </Link>
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-12 border rounded-lg">
                            <Ticket className="h-12 w-12 mx-auto text-neutral-400 mb-4" />
                            <h3 className="text-xl font-bold mb-2">No upcoming tickets</h3>
                            <p className="text-neutral-600 mb-6">
                              You don't have any upcoming concert tickets.
                            </p>
                            <Button asChild>
                              <Link href="/concerts">Browse Concerts</Link>
                            </Button>
                          </div>
                        )}
                      </TabsContent>
                      
                      <TabsContent value="past">
                        {ordersLoading ? (
                          <div className="space-y-4">
                            {Array(2).fill(0).map((_, i) => (
                              <Card key={i}>
                                <CardContent className="p-6">
                                  <div className="flex flex-col md:flex-row gap-4">
                                    <Skeleton className="h-32 w-full md:w-32 rounded" />
                                    <div className="flex-grow space-y-2">
                                      <Skeleton className="h-6 w-3/4" />
                                      <Skeleton className="h-4 w-1/2" />
                                      <Skeleton className="h-4 w-2/3" />
                                      <div className="flex justify-end mt-4">
                                        <Skeleton className="h-10 w-28" />
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        ) : pastConcerts.length > 0 ? (
                          <div className="space-y-4">
                            {pastConcerts.map((item, index) => (
                              <Card key={index} className="opacity-75">
                                <CardContent className="p-6">
                                  <div className="flex flex-col md:flex-row gap-4">
                                    <div className="h-32 w-full md:w-32 rounded bg-neutral-100 overflow-hidden">
                                      <img 
                                        src={item.concert?.imageUrl || "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"} 
                                        alt={item.concert?.title} 
                                        className="w-full h-full object-cover grayscale"
                                      />
                                    </div>
                                    <div className="flex-grow">
                                      <h3 className="font-bold text-lg mb-1">{item.concert?.title}</h3>
                                      <div className="space-y-1 text-sm text-neutral-600 mb-3">
                                        <div className="flex items-center">
                                          <Calendar className="h-3 w-3 mr-1" />
                                          <span>{item.concert?.date && format(new Date(item.concert.date), 'EEEE, MMMM dd, yyyy')}</span>
                                        </div>
                                        <div className="flex items-center">
                                          <Map className="h-3 w-3 mr-1" />
                                          <span>{item.concert?.venue?.name}, {item.concert?.venue?.location}</span>
                                        </div>
                                      </div>
                                      <div className="flex justify-between items-center">
                                        <div>
                                          <Badge variant="outline" className="mr-2">
                                            {item.ticketType?.name}
                                          </Badge>
                                          <span className="text-sm text-neutral-600">
                                            x{item.quantity}
                                          </span>
                                        </div>
                                        <Button variant="outline" size="sm" asChild>
                                          <Link href={`/concerts/${item.concert?.id}`}>
                                            View Concert
                                          </Link>
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-12 border rounded-lg">
                            <Ticket className="h-12 w-12 mx-auto text-neutral-400 mb-4" />
                            <h3 className="text-xl font-bold mb-2">No past concerts</h3>
                            <p className="text-neutral-600 mb-6">
                              You haven't attended any concerts yet.
                            </p>
                            <Button asChild>
                              <Link href="/concerts">Browse Concerts</Link>
                            </Button>
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Order History Tab */}
              <TabsContent value="orders" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Order History</CardTitle>
                    <CardDescription>
                      Review your previous transactions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {ordersLoading ? (
                      <div className="space-y-4">
                        <Skeleton className="h-10 w-full" />
                        {Array(5).fill(0).map((_, i) => (
                          <Skeleton key={i} className="h-12 w-full" />
                        ))}
                      </div>
                    ) : sortedOrders && sortedOrders.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {sortedOrders.map((order) => (
                            <TableRow key={order.id}>
                              <TableCell className="font-medium">#{order.id}</TableCell>
                              <TableCell>{format(new Date(order.orderDate), 'MMM dd, yyyy')}</TableCell>
                              <TableCell>₱{order.totalAmount.toLocaleString()}</TableCell>
                              <TableCell>
                                <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                                  {order.status === 'completed' ? (
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                  ) : (
                                    <AlertCircle className="h-3 w-3 mr-1" />
                                  )}
                                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Button variant="ghost" size="sm" className="h-8 flex items-center">
                                  <FileText className="h-4 w-4 mr-1" />
                                  <span className="hidden sm:inline">Receipt</span>
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-center py-12 border rounded-lg">
                        <FileText className="h-12 w-12 mx-auto text-neutral-400 mb-4" />
                        <h3 className="text-xl font-bold mb-2">No orders yet</h3>
                        <p className="text-neutral-600 mb-6">
                          You haven't made any purchases yet.
                        </p>
                        <Button asChild>
                          <Link href="/concerts">Browse Concerts</Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Account Settings Tab */}
              <TabsContent value="settings" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>
                      Update your profile information
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                          control={form.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Your full name" 
                                  {...field} 
                                  disabled={!editMode}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input 
                                  type="email" 
                                  placeholder="Your email address" 
                                  {...field} 
                                  disabled={!editMode}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number (Optional)</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Your phone number" 
                                  {...field} 
                                  disabled={!editMode}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Address (Optional)</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Your address" 
                                  {...field} 
                                  disabled={!editMode}
                                  className="resize-none"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="flex justify-end gap-2">
                          {editMode ? (
                            <>
                              <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => setEditMode(false)}
                              >
                                Cancel
                              </Button>
                              <Button type="submit" disabled={saving}>
                                {saving ? (
                                  <Save className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                  <Save className="mr-2 h-4 w-4" />
                                )}
                                Save Changes
                              </Button>
                            </>
                          ) : (
                            <Button 
                              type="button" 
                              onClick={() => setEditMode(true)}
                            >
                              Edit Profile
                            </Button>
                          )}
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
                
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Security</CardTitle>
                    <CardDescription>
                      Manage your password and account security
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <FormLabel>Change Password</FormLabel>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                        <Input type="password" placeholder="Current Password" disabled={!editMode} />
                        <Input type="password" placeholder="New Password" disabled={!editMode} />
                        <Input type="password" placeholder="Confirm New Password" disabled={!editMode} />
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button variant={editMode ? "default" : "outline"} disabled={!editMode}>
                        Update Password
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
