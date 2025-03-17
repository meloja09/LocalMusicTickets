import { useRoute, Link } from "wouter";
import { useArtist } from "@/hooks/use-api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Facebook, Twitter, Instagram, Youtube, Music, Calendar, MapPin, Share2, Link as LinkIcon } from "lucide-react";

const ArtistDetailPage = () => {
  const [_, params] = useRoute("/artists/:id");
  const artistId = params ? parseInt(params.id) : 0;
  const { data: artist, isLoading } = useArtist(artistId);

  if (isLoading) {
    return (
      <div className="bg-neutral-50 min-h-screen pb-16">
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-64 mb-8" />
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <Skeleton className="aspect-square w-full rounded-lg" />
              <div className="mt-4 space-y-3">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
                <div className="flex space-x-3 mt-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="h-10 w-10 rounded-full" />
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-3">
              <Skeleton className="h-12 w-3/4 mb-4" />
              <div className="space-y-3 mb-6">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-3/4" />
              </div>
              
              <Skeleton className="h-10 w-full mb-6" />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Array(4).fill(0).map((_, i) => (
                  <div key={i} className="flex">
                    <Skeleton className="h-24 w-24 rounded mr-3" />
                    <div className="flex-grow space-y-2">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-neutral-900 mb-4">Artist Not Found</h2>
        <p className="text-neutral-600 mb-6">The artist you're looking for does not exist or has been removed.</p>
        <Button asChild>
          <Link href="/artists">View All Artists</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-neutral-50 min-h-screen pb-16">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/artists">Artists</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>{artist.name}</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="aspect-square overflow-hidden rounded-lg mb-4">
                <img 
                  src={artist.imageUrl || "https://images.unsplash.com/photo-1522196772883-393d879eb14d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"} 
                  alt={artist.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <h1 className="text-2xl font-bold mb-1">{artist.name}</h1>
              <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm mb-4">
                {artist.genre}
              </div>
              
              <div className="flex justify-between items-center mt-6">
                <h3 className="font-medium">Follow Artist</h3>
                <div className="flex space-x-3">
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                    <Facebook className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                    <Twitter className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                    <Instagram className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="border-t border-b py-4 my-4">
                <Button asChild className="w-full">
                  <Link href={`/concerts?artist=${artist.id}`}>
                    View Upcoming Concerts
                  </Link>
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <Button variant="ghost" size="sm" className="text-primary flex items-center gap-1">
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
                <Button variant="ghost" size="sm" className="text-primary flex items-center gap-1">
                  <LinkIcon className="h-4 w-4" />
                  Copy Link
                </Button>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <Tabs defaultValue="about" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="about">About</TabsTrigger>
                  <TabsTrigger value="concerts">Concerts</TabsTrigger>
                  <TabsTrigger value="gallery">Gallery</TabsTrigger>
                </TabsList>
                
                <TabsContent value="about">
                  <div className="prose max-w-none mb-6">
                    <h2 className="text-2xl font-bold mb-4">About {artist.name}</h2>
                    <p>{artist.bio || "No bio available for this artist."}</p>
                    
                    {/* Sample additional content - in a real app this would come from the API */}
                    <h3 className="text-xl font-bold mt-8 mb-4">Background</h3>
                    <p>
                      {artist.name} has been a prominent figure in the {artist.genre} scene in the Philippines.
                      With multiple chart-topping hits and sold-out concerts, they continue to inspire a generation
                      of music lovers across the country.
                    </p>
                    
                    <h3 className="text-xl font-bold mt-8 mb-4">Achievements</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Awit Award for Best Performance by a Group (2022)</li>
                      <li>MYX Music Award for Favorite Artist (2021)</li>
                      <li>Platinum Record for Debut Album (2020)</li>
                      <li>Featured in Billboard Philippines Top 10 (2019)</li>
                    </ul>
                  </div>
                </TabsContent>
                
                <TabsContent value="concerts">
                  <h2 className="text-2xl font-bold mb-6">Upcoming Concerts</h2>
                  
                  {artist.concerts && artist.concerts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {artist.concerts.map((concert) => (
                        <Link href={`/concerts/${concert.id}`} key={concert.id}>
                          <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                            <div className="flex">
                              <div className="w-1/3 h-24 overflow-hidden bg-neutral-100">
                                <img 
                                  src={concert.imageUrl || "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-4.0.3&auto=format&fit=crop&w=240&q=80"} 
                                  alt={concert.title} 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <CardContent className="p-4 w-2/3">
                                <h3 className="font-medium text-lg mb-1 line-clamp-1">{concert.title}</h3>
                                <div className="text-sm text-neutral-600 flex items-center mb-1">
                                  <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
                                  <span>{format(new Date(concert.date), 'MMM dd, yyyy')}</span>
                                </div>
                                <div className="text-sm text-neutral-600 flex items-center">
                                  <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                                  <span className="line-clamp-1">
                                    {/* Venue name would come from joined data in API */}
                                    Venue Name
                                  </span>
                                </div>
                              </CardContent>
                            </div>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 border rounded-lg bg-neutral-50">
                      <Music className="h-12 w-12 mx-auto text-neutral-400 mb-4" />
                      <h3 className="text-xl font-bold mb-2">No Upcoming Concerts</h3>
                      <p className="text-neutral-600 mb-6">
                        {artist.name} doesn't have any scheduled concerts at the moment.
                      </p>
                      <Button asChild variant="outline">
                        <Link href="/concerts">Browse All Concerts</Link>
                      </Button>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="gallery">
                  <h2 className="text-2xl font-bold mb-6">Photo Gallery</h2>
                  
                  {/* Sample gallery - in a real app this would come from the API */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <div key={n} className="aspect-square overflow-hidden rounded-lg bg-neutral-100">
                        <img 
                          src={`https://images.unsplash.com/photo-${1510000000000 + n * 10000}?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80`} 
                          alt={`${artist.name} gallery image ${n}`} 
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                  
                  <div className="text-center mt-8">
                    <Button variant="outline">
                      View More Photos
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold mb-6">Similar Artists</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Sample similar artists - in a real app this would come from the API */}
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="text-center">
                    <div className="aspect-square overflow-hidden rounded-full mb-3 bg-neutral-100 mx-auto max-w-[120px]">
                      <img 
                        src={`https://images.unsplash.com/photo-${1520000000000 + n * 10000}?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80`} 
                        alt={`Similar artist ${n}`} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="font-medium">Artist Name {n}</h3>
                    <p className="text-sm text-neutral-600">Genre</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistDetailPage;
