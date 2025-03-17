import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useArtists, useCreateArtist, useDeleteArtist } from "@/hooks/use-api";
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
  ArrowUpDown,
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

// Artist form schema
const artistSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  genre: z.string().min(2, { message: "Genre is required" }),
  bio: z.string().optional(),
  imageUrl: z.string().url({ message: "Valid image URL is required" }).optional().or(z.literal("")),
});

type ArtistFormValues = z.infer<typeof artistSchema>;

const AdminArtists = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const { data: artists, isLoading } = useArtists();
  const createArtistMutation = useCreateArtist();
  const deleteArtistMutation = useDeleteArtist();
  
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Artist form
  const form = useForm<ArtistFormValues>({
    resolver: zodResolver(artistSchema),
    defaultValues: {
      name: "",
      genre: "",
      bio: "",
      imageUrl: "",
    },
  });
  
  // Add new artist
  const onSubmit = async (data: ArtistFormValues) => {
    try {
      await createArtistMutation.mutateAsync(data);
      
      toast({
        title: "Success",
        description: "Artist has been created",
      });
      
      setDialogOpen(false);
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create artist",
        variant: "destructive",
      });
    }
  };
  
  // Delete artist
  const handleDelete = async (id: number) => {
    try {
      await deleteArtistMutation.mutateAsync(id);
      
      toast({
        title: "Success",
        description: "Artist has been deleted",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete artist",
        variant: "destructive",
      });
    }
  };
  
  // Filter artists by search
  const filteredArtists = artists?.filter(artist => 
    artist.name.toLowerCase().includes(search.toLowerCase()) ||
    artist.genre.toLowerCase().includes(search.toLowerCase())
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
          <h1 className="text-3xl font-bold text-neutral-900">Manage Artists</h1>
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
                  <CardTitle>Artists</CardTitle>
                  <CardDescription>
                    Manage Filipino artists for your concerts
                  </CardDescription>
                </div>
                
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Artist
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[525px]">
                    <DialogHeader>
                      <DialogTitle>Create a New Artist</DialogTitle>
                      <DialogDescription>
                        Add a new artist to your platform
                      </DialogDescription>
                    </DialogHeader>
                    
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Artist name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="genre"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Genre</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. Pop, Rock, OPM" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="bio"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Biography</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Artist biography and background"
                                  className="resize-none"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
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
                                Enter a URL for the artist's profile image
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button type="button" variant="outline">Cancel</Button>
                          </DialogClose>
                          <Button type="submit" disabled={createArtistMutation.isPending}>
                            {createArtistMutation.isPending ? "Creating..." : "Create Artist"}
                          </Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
                    <Input
                      placeholder="Search artists..."
                      className="pl-9"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  
                  {/* Artists Table */}
                  {isLoading ? (
                    <div className="space-y-4">
                      <Skeleton className="h-10 w-full" />
                      {Array(5).fill(0).map((_, i) => (
                        <Skeleton key={i} className="h-16 w-full" />
                      ))}
                    </div>
                  ) : filteredArtists && filteredArtists.length > 0 ? (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[300px]">
                              <Button variant="ghost" className="p-0 hover:bg-transparent -ml-4 h-8">
                                <span>Name</span>
                                <ArrowUpDown className="ml-2 h-4 w-4" />
                              </Button>
                            </TableHead>
                            <TableHead>Genre</TableHead>
                            <TableHead>Bio</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredArtists.map((artist) => (
                            <TableRow key={artist.id}>
                              <TableCell className="font-medium">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-neutral-100 flex-shrink-0 overflow-hidden">
                                    {artist.imageUrl ? (
                                      <img 
                                        src={artist.imageUrl} 
                                        alt={artist.name} 
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <Music className="h-5 w-5 m-auto text-neutral-400" />
                                    )}
                                  </div>
                                  <span>{artist.name}</span>
                                </div>
                              </TableCell>
                              <TableCell>{artist.genre}</TableCell>
                              <TableCell>
                                <p className="line-clamp-1 text-neutral-500">
                                  {artist.bio || "No biography available"}
                                </p>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button variant="ghost" size="icon" asChild>
                                    <Link href={`/artists/${artist.id}`}>
                                      <Music className="h-4 w-4" />
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
                                          This will permanently delete this artist.
                                          This action cannot be undone.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => handleDelete(artist.id)}
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
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-8 border rounded-lg">
                      <Music className="h-12 w-12 mx-auto text-neutral-300 mb-4" />
                      <h3 className="text-lg font-medium mb-2">No artists found</h3>
                      <p className="text-neutral-500 mb-4">
                        {search ? "Try a different search term" : "Get started by adding an artist"}
                      </p>
                      <Button onClick={() => setDialogOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Artist
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

export default AdminArtists;
