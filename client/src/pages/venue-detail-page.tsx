import { useRoute, Link } from "wouter";
import { useVenue, useConcerts } from "@/hooks/use-api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Concert } from "@shared/schema";
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
import { 
  Users, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  ParkingSquare, 
  Coffee, 
  Utensils, 
  Wifi, 
  Accessibility, 
  CheckCircle2,
  Clock
} from "lucide-react";

const VenueDetailPage = () => {
  const [_, params] = useRoute("/venues/:id");
  const venueId = params ? parseInt(params.id) : 0;
  const { data: venue, isLoading } = useVenue(venueId);

  if (isLoading) {
    return (
      <div className="bg-neutral-50 min-h-screen pb-16">
        <div className="h-[400px] bg-gray-200 animate-pulse"></div>
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-64 mb-8" />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <Skeleton className="h-10 w-1/2 mb-4" />
                <div className="space-y-3 mb-6">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-3/4" />
                </div>
                
                <Skeleton className="h-10 w-full mb-6" />
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  {Array(6).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-24 rounded" />
                  ))}
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <Skeleton className="h-8 w-3/4 mb-4" />
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <Skeleton className="h-6 w-full" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <Skeleton className="h-6 w-full" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <Skeleton className="h-6 w-full" />
                  </div>
                </div>
                
                <Skeleton className="h-[200px] mt-6 rounded" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <Skeleton className="h-8 w-48 mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
    );
  }

  if (!venue) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-neutral-900 mb-4">Venue Not Found</h2>
        <p className="text-neutral-600 mb-6">The venue you're looking for does not exist or has been removed.</p>
        <Button asChild>
          <Link href="/venues">View All Venues</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-neutral-50 min-h-screen pb-16">
      {/* Hero Banner */}
      <div className="w-full h-[400px] relative">
        <img 
          src={venue.imageUrl || "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"} 
          alt={venue.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8">
          <div className="container mx-auto">
            <h1 className="text-white font-bold text-3xl md:text-4xl mb-2">
              {venue.name}
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-white">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{venue.location}</span>
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                <span>Capacity: {venue.capacity.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/venues">Venues</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>{venue.name}</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <Tabs defaultValue="about" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="about">About</TabsTrigger>
                  <TabsTrigger value="facilities">Facilities</TabsTrigger>
                  <TabsTrigger value="photos">Photos</TabsTrigger>
                </TabsList>
                
                <TabsContent value="about">
                  <div className="prose max-w-none mb-6">
                    <h2 className="text-2xl font-bold mb-4">About {venue.name}</h2>
                    
                    <p className="mb-6">
                      {venue.description || `${venue.name} is one of the top concert venues in ${venue.location}, Philippines.
                      With a capacity of ${venue.capacity.toLocaleString()} people, it's the perfect place
                      for both intimate shows and large-scale performances by Filipino and international artists.`}
                    </p>
                    
                    <div className="bg-neutral-50 rounded-lg p-4 mb-6">
                      <h3 className="font-bold mb-2">Venue Details</h3>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <MapPin className="h-5 w-5 mr-2 text-primary flex-shrink-0 mt-1" />
                          <div>
                            <span className="font-medium">Address:</span>
                            <div>{venue.address}</div>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <Users className="h-5 w-5 mr-2 text-primary flex-shrink-0 mt-1" />
                          <div>
                            <span className="font-medium">Capacity:</span>
                            <div>{venue.capacity.toLocaleString()} people</div>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <Phone className="h-5 w-5 mr-2 text-primary flex-shrink-0 mt-1" />
                          <div>
                            <span className="font-medium">Contact:</span>
                            <div>+63 (2) 8123 4567</div>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <Mail className="h-5 w-5 mr-2 text-primary flex-shrink-0 mt-1" />
                          <div>
                            <span className="font-medium">Email:</span>
                            <div>info@{venue.name.toLowerCase().replace(/\s+/g, '')}.ph</div>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <Globe className="h-5 w-5 mr-2 text-primary flex-shrink-0 mt-1" />
                          <div>
                            <span className="font-medium">Website:</span>
                            <div>www.{venue.name.toLowerCase().replace(/\s+/g, '')}.ph</div>
                          </div>
                        </li>
                      </ul>
                    </div>
                    
                    {venue.amenities && (
                      <div className="mb-6">
                        <h3 className="text-xl font-bold mb-2">Amenities</h3>
                        <div className="bg-neutral-50 rounded-lg p-4">
                          <ul className="space-y-1">
                            {venue.amenities && venue.amenities.split(',').map((amenity: string, index: number) => (
                              <li key={index} className="flex items-center">
                                <CheckCircle2 className="h-4 w-4 mr-2 text-primary flex-shrink-0" />
                                <span>{amenity.trim()}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                    
                    <h3 className="text-xl font-bold mb-2">Transportation & Parking</h3>
                    <p>
                      The venue is easily accessible by public and private transportation.
                      Parking is available on-site for a fee. Taxis and ride-sharing services
                      are readily available in the area.
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="facilities">
                  <h2 className="text-2xl font-bold mb-6">Facilities & Amenities</h2>
                  
                  {venue.amenities ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                      {venue.amenities && venue.amenities.split(',').map((amenity: string, index: number) => {
                        // Determine which icon to show based on amenity text
                        let Icon = CheckCircle2;
                        const amenityLower = amenity.trim().toLowerCase();
                        
                        if (amenityLower.includes('parking')) Icon = ParkingSquare;
                        else if (amenityLower.includes('food') || amenityLower.includes('concession')) Icon = Utensils;
                        else if (amenityLower.includes('wifi')) Icon = Wifi;
                        else if (amenityLower.includes('access')) Icon = Accessibility;
                        else if (amenityLower.includes('vip') || amenityLower.includes('premium')) Icon = CheckCircle2;
                        else if (amenityLower.includes('coffee') || amenityLower.includes('beverage')) Icon = Coffee;
                        
                        return (
                          <div key={index} className="flex items-start p-4 bg-neutral-50 rounded-lg">
                            <Icon className="h-6 w-6 text-primary mr-3 flex-shrink-0" />
                            <div>
                              <h3 className="font-bold mb-1">{amenity.trim()}</h3>
                              <p className="text-sm text-neutral-600">
                                Available at {venue.name}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                      <div className="flex items-start p-4 bg-neutral-50 rounded-lg">
                        <ParkingSquare className="h-6 w-6 text-primary mr-3 flex-shrink-0" />
                        <div>
                          <h3 className="font-bold mb-1">Parking</h3>
                          <p className="text-sm text-neutral-600">
                            Secure parking available with 500+ spaces
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start p-4 bg-neutral-50 rounded-lg">
                        <Coffee className="h-6 w-6 text-primary mr-3 flex-shrink-0" />
                        <div>
                          <h3 className="font-bold mb-1">Concessions</h3>
                          <p className="text-sm text-neutral-600">
                            Multiple food and beverage stands throughout
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start p-4 bg-neutral-50 rounded-lg">
                        <Utensils className="h-6 w-6 text-primary mr-3 flex-shrink-0" />
                        <div>
                          <h3 className="font-bold mb-1">Food Court</h3>
                          <p className="text-sm text-neutral-600">
                            Various dining options including local Filipino cuisine
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start p-4 bg-neutral-50 rounded-lg">
                        <Wifi className="h-6 w-6 text-primary mr-3 flex-shrink-0" />
                        <div>
                          <h3 className="font-bold mb-1">Free Wi-Fi</h3>
                          <p className="text-sm text-neutral-600">
                            High-speed internet access throughout the venue
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start p-4 bg-neutral-50 rounded-lg">
                        <Accessibility className="h-6 w-6 text-primary mr-3 flex-shrink-0" />
                        <div>
                          <h3 className="font-bold mb-1">Accessibility</h3>
                          <p className="text-sm text-neutral-600">
                            Wheelchair accessible facilities and seating areas
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start p-4 bg-neutral-50 rounded-lg">
                        <CheckCircle2 className="h-6 w-6 text-primary mr-3 flex-shrink-0" />
                        <div>
                          <h3 className="font-bold mb-1">VIP Lounges</h3>
                          <p className="text-sm text-neutral-600">
                            Premium areas with exclusive services and amenities
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <h3 className="font-bold text-xl mb-4">Seating Layout</h3>
                  <div className="aspect-video rounded-lg overflow-hidden bg-neutral-100 flex items-center justify-center">
                    <div className="text-center p-4">
                      <svg
                        width="500"
                        height="300"
                        viewBox="0 0 500 300"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        {/* Simple venue seating layout */}
                        <rect x="150" y="240" width="200" height="40" fill="#FF6B35" stroke="#000" />
                        <text x="250" y="265" fontSize="16" textAnchor="middle" fill="white">Stage</text>
                        
                        <rect x="100" y="160" width="300" height="60" fill="#e2e8f0" stroke="#000" />
                        <text x="250" y="195" fontSize="16" textAnchor="middle">VIP</text>
                        
                        <rect x="50" y="80" width="400" height="60" fill="#e2e8f0" stroke="#000" />
                        <text x="250" y="115" fontSize="16" textAnchor="middle">Regular</text>
                        
                        <rect x="100" y="20" width="300" height="40" fill="#e2e8f0" stroke="#000" />
                        <text x="250" y="45" fontSize="16" textAnchor="middle">Balcony</text>
                      </svg>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="photos">
                  <h2 className="text-2xl font-bold mb-6">Photo Gallery</h2>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {/* Sample gallery - in a real app these would come from the API */}
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                      <div key={n} className="aspect-square overflow-hidden rounded-lg bg-neutral-100">
                        <img 
                          src={`https://images.unsplash.com/photo-${1560000000000 + n * 10000}?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80`} 
                          alt={`${venue.name} gallery image ${n}`} 
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8 sticky top-20">
              <h2 className="text-xl font-bold mb-4">Location & Directions</h2>
              
              <p className="text-neutral-700 mb-4">{venue.address}</p>
              
              <div className="aspect-square bg-neutral-100 rounded-lg overflow-hidden mb-4">
                {/* Map placeholder - in a real app this would be an actual map */}
                <div className="w-full h-full flex items-center justify-center bg-neutral-200">
                  <MapPin className="h-10 w-10 text-neutral-400" />
                </div>
              </div>
              
              <Button className="w-full mb-4">
                Get Directions
              </Button>
              
              <div className="mt-6">
                <h3 className="font-bold mb-2">Nearby Transportation</h3>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm">
                    <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                    5 min walk from LRT Station
                  </li>
                  <li className="flex items-center text-sm">
                    <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                    Bus stops along Main Avenue
                  </li>
                  <li className="flex items-center text-sm">
                    <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                    Taxi stand at venue entrance
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* Upcoming Concerts */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold mb-6">Upcoming Events at {venue.name}</h2>
          
          {venue.concerts && venue.concerts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {venue.concerts.map((concert: Concert) => (
                <Link href={`/concerts/${concert.id}`} key={concert.id}>
                  <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col">
                    <div className="h-40 overflow-hidden bg-neutral-100">
                      <img 
                        src={concert.imageUrl || "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} 
                        alt={concert.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-5 flex-grow flex flex-col">
                      <h3 className="font-bold text-lg mb-1">{concert.title}</h3>
                      <div className="flex items-center text-neutral-600 text-sm mb-1">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>{format(new Date(concert.date), 'MMM dd, yyyy')}</span>
                      </div>
                      <div className="flex items-center text-neutral-600 text-sm mb-2">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{format(new Date(concert.date), 'h:mm a')}</span>
                      </div>
                      <p className="text-neutral-700 text-sm line-clamp-2 mb-4">{concert.description}</p>
                      <Button className="mt-auto" variant="outline">
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg bg-neutral-50">
              <Calendar className="h-12 w-12 mx-auto text-neutral-400 mb-4" />
              <h3 className="text-xl font-bold mb-2">No Upcoming Events</h3>
              <p className="text-neutral-600 mb-6">
                There are no scheduled events at {venue.name} at the moment.
              </p>
              <Button asChild variant="outline">
                <Link href="/concerts">Browse All Concerts</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VenueDetailPage;
