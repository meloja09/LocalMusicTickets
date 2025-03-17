import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useConcerts, useArtists, useVenues, useCreateConcert, useDeleteConcert } from "@/hooks/use-api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import {
  BarChart3,
  Calendar,
  Music,
  MapPin,
  Plus,
  Edit,
  Trash2,
  Search,
  ListFilter,
  Filter,
  ArrowUpDown,
  Clock,
  Ticket,
  Users,
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

// Concert form schema
const concertSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description is required" }),
  date: z.string().min(1, { message: "Date is required" }),
  imageUrl: z.string().url({ message: "Valid image URL is required" }).optional().or(z.literal("")),
  venueId: z.string().min(1, { message: "Venue is required" }),
  artistId: z.string().min(1, { message: "Artist is required" }),
  isFeatured: z.boolean().default(false),
  status: z.string().default("upcoming"),
});

type ConcertFormValues = z.infer<typeof concertSchema>;

const AdminConcerts = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const { data: concerts, isLoading } = useConcerts();
  const { data: artists, isLoading: artistsLoading } = useArtists();
  const { data: venues, isLoading: venuesLoading } = useVenues();
  
  const createConcertMutation = useCreateConcert();
  const deleteConcertMutation = useDeleteConcert();
  
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedConcert, setSelectedConcert] = useState<number | null>(null);
  
  // Concert form
  const form = useForm<ConcertFormValues>({
    resolver: zodResolver(concertSchema),
    defaultValues: {
      title: "",
      description: "",
      date: "",
      imageUrl: "",
      venueId: "",
      artistId: "",
      isFeatured: false,
      status: "upcoming",
    },
  });
  
  // Format date for input
  const formatDateForInput = (date: Date): string => {
    return date.toISOString().slice(0, 16);
  };
  
  // Add new concert
  const onSubmit = async (data: ConcertFormValues) => {
    try {
      const concertData = {
        ...data,
        venueId: parseInt(data.venueId),
        artistId: parseInt(data.artistId),
        date: new Date(data.date),
      };
      
      await createConcertMutation.mutateAsync(concertData);
      
      toast({
        title: "Success",
        description: "Concert has been created",
      });
      
      setDialogOpen(false);
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create concert",
        variant: "destructive",
      });
    }
  };
  
  // Delete concert
  const handleDelete = async (id: number) => {
    try {
      await deleteConcertMutation.mutateAsync(id);
      
      toast({
        title: "Success",
        description: "Concert has been deleted",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete concert",
        variant: "destructive",
      });
    }
  };
  
  // Filter concerts by search
  const filteredConcerts = concerts?.filter(concert => 
    concert.title.toLowerCase().includes(search.toLowerCase())
  );
  
  // Redirect if not admin
  useEffect(() => {
    if (user && !user.isAdmin) {
      setLocation("/");
    }
  }, [user, setLocation]);
  
  return (
    <div className="bg-neutral-50 min-h-screen pb-16">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-neutral-900">Manage Concerts</h1>
          <Button asChild>
            <Link href="/admin">Back to Dashboard</Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="hidden md:block">
            <AdminSidebar />
          </div>
          
          {/* Main Content */}
          <div className="md:col-span-3 space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle>Concerts</CardTitle>
                  <CardDescription>
                    Manage your concert events
                  </CardDescription>
                </div>
                
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Concert
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[625px]">
                    <DialogHeader>
                      <DialogTitle>Create a New Concert</DialogTitle>
                      <DialogDescription>
                        Fill in the details to add a new concert event
                      </DialogDescription>
                    </DialogHeader>
                    
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                        <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Title</FormLabel>
                              <FormControl>
                                <Input placeholder="Concert title" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Concert description"
                                  className="resize-none"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Date & Time</FormLabel>
                                <FormControl>
                                  <Input
                                    type="datetime-local"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Status</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="upcoming">Upcoming</SelectItem>
                                    <SelectItem value="ongoing">Ongoing</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="artistId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Artist</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select artist" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {artistsLoading ? (
                                      <SelectItem value="loading" disabled>Loading...</SelectItem>
                                    ) : artists && artists.length > 0 ? (
                                      artists.map((artist) => (
                                        <SelectItem key={artist.id} value={artist.id.toString()}>
                                          {artist.name}
                                        </SelectItem>
                                      ))
                                    ) : (
                                      <SelectItem value="no-artists" disabled>No artists available</SelectItem>
                                    )}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="venueId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Venue</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select venue" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {venuesLoading ? (
                                      <SelectItem value="loading" disabled>Loading...</SelectItem>
                                    ) : venues && venues.length > 0 ? (
                                      venues.map((venue) => (
                                        <SelectItem key={venue.id} value={venue.id.toString()}>
                                          {venue.name}
                                        </SelectItem>
                                      ))
                                    ) : (
                                      <SelectItem value="none" disabled>No venues available</SelectItem>
                                    )}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="imageUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Image URL</FormLabel>
                              <FormControl>
                                <Input placeholder="https://example.com/image.jpg" {...field} />
                              </FormControl>
                              <FormDescription>
                                Enter a URL for the concert image
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="isFeatured"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">Featured</FormLabel>
                                <FormDescription>
                                  Show this concert in the featured section on homepage
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button type="button" variant="outline">Cancel</Button>
                          </DialogClose>
                          <Button type="submit" disabled={createConcertMutation.isPending}>
                            {createConcertMutation.isPending ? "Creating..." : "Create Concert"}
                          </Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Search and Filters */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-grow">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
                      <Input
                        placeholder="Search concerts..."
                        className="pl-9"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </div>
                    <Button variant="outline" className="sm:w-auto">
                      <Filter className="h-4 w-4 mr-2" />
                      Filters
                    </Button>
                  </div>
                  
                  {/* Concerts Table */}
                  {isLoading ? (
                    <div className="space-y-4">
                      <Skeleton className="h-10 w-full" />
                      {Array(5).fill(0).map((_, i) => (
                        <Skeleton key={i} className="h-16 w-full" />
                      ))}
                    </div>
                  ) : filteredConcerts && filteredConcerts.length > 0 ? (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[300px]">
                              <Button variant="ghost" className="p-0 hover:bg-transparent -ml-4 h-8">
                                <span>Title</span>
                                <ArrowUpDown className="ml-2 h-4 w-4" />
                              </Button>
                            </TableHead>
                            <TableHead>Artist</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredConcerts.map((concert) => {
                            const concertArtist = artists?.find(a => a.id === concert.artistId);
                            
                            return (
                              <TableRow key={concert.id}>
                                <TableCell className="font-medium">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded bg-neutral-100 flex-shrink-0 overflow-hidden">
                                      {concert.imageUrl ? (
                                        <img 
                                          src={concert.imageUrl} 
                                          alt={concert.title} 
                                          className="w-full h-full object-cover"
                                        />
                                      ) : (
                                        <Calendar className="h-5 w-5 m-auto text-neutral-400" />
                                      )}
                                    </div>
                                    <div>
                                      <div className="font-medium">{concert.title}</div>
                                      {concert.isFeatured && (
                                        <Badge variant="secondary" className="mt-1">Featured</Badge>
                                      )}
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  {concertArtist?.name || "-"}
                                </TableCell>
                                <TableCell>
                                  {format(new Date(concert.date), 'MMM dd, yyyy')}
                                </TableCell>
                                <TableCell>
                                  <Badge variant={
                                    concert.status === "upcoming" ? "default" :
                                    concert.status === "ongoing" ? "secondary" :
                                    concert.status === "completed" ? "outline" :
                                    "destructive"
                                  }>
                                    {concert.status.charAt(0).toUpperCase() + concert.status.slice(1)}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end gap-2">
                                    <Button variant="ghost" size="icon" asChild>
                                      <Link href={`/concerts/${concert.id}`}>
                                        <Ticket className="h-4 w-4" />
                                      </Link>
                                    </Button>
                                    <Button variant="ghost" size="icon">
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="icon" className="text-destructive">
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            This will permanently delete this concert and all associated tickets.
                                            This action cannot be undone.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                                          <AlertDialogAction
                                            onClick={() => handleDelete(concert.id)}
                                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                          >
                                            Delete
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-8 border rounded-lg">
                      <Calendar className="h-12 w-12 mx-auto text-neutral-300 mb-4" />
                      <h3 className="text-lg font-medium mb-2">No concerts found</h3>
                      <p className="text-neutral-500 mb-4">
                        {search ? "Try a different search term" : "Get started by adding a concert"}
                      </p>
                      <Button onClick={() => setDialogOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Concert
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminConcerts;
