import { useState } from "react";
import { useRoute, Link } from "wouter";
import { useConcert, useTicketTypes } from "@/hooks/use-api";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Calendar,
  Clock,
  MapPin,
  Music,
  Users,
  Info,
  TicketIcon,
  Share2,
  Heart,
  Plus,
  Minus,
} from "lucide-react";

const ConcertDetailPage = () => {
  const [_, params] = useRoute("/concerts/:id");
  const concertId = params ? parseInt(params.id) : 0;
  const { data: concert, isLoading } = useConcert(concertId);
  const { data: ticketTypes, isLoading: loadingTickets } = useTicketTypes(concertId);
  const { user } = useAuth();
  
  const [selectedTickets, setSelectedTickets] = useState<{[key: number]: number}>({});
  
  const handleTicketChange = (ticketTypeId: number, quantity: number) => {
    setSelectedTickets(prev => ({
      ...prev,
      [ticketTypeId]: quantity
    }));
  };
  
  const incrementTicket = (ticketTypeId: number) => {
    const currentQty = selectedTickets[ticketTypeId] || 0;
    const ticketType = ticketTypes?.find(t => t.id === ticketTypeId);
    
    if (ticketType && currentQty < ticketType.quantity) {
      handleTicketChange(ticketTypeId, currentQty + 1);
    }
  };
  
  const decrementTicket = (ticketTypeId: number) => {
    const currentQty = selectedTickets[ticketTypeId] || 0;
    if (currentQty > 0) {
      handleTicketChange(ticketTypeId, currentQty - 1);
    }
  };

  const totalSelectedTickets = Object.values(selectedTickets).reduce((sum, qty) => sum + qty, 0);
  
  const totalPrice = ticketTypes
    ?.map(ticket => ({
      price: ticket.price,
      quantity: selectedTickets[ticket.id] || 0
    }))
    .reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;

  return (
    <div className="bg-neutral-50 min-h-screen pb-16">
      {isLoading ? (
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col space-y-8">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-[300px] w-full rounded-lg" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6">
                <Skeleton className="h-10 w-3/4" />
                <div className="space-y-4">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-2/3" />
                </div>
              </div>
              <div>
                <Skeleton className="h-64 w-full rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      ) : concert ? (
        <>
          {/* Hero Banner */}
          <div className="w-full h-[300px] relative">
            <img 
              src={concert.imageUrl || "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"} 
              alt={concert.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8">
              <div className="container mx-auto">
                <h1 className="text-white font-bold text-3xl md:text-4xl mb-2">
                  {concert.title}
                </h1>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-white">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{format(new Date(concert.date), 'EEEE, MMMM dd, yyyy')}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{format(new Date(concert.date), 'h:mm a')}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{concert.venue?.name}, {concert.venue?.location}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4 py-8">
            {/* Breadcrumbs */}
            <Breadcrumb className="mb-6">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/concerts">Concerts</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink>{concert.title}</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h1 className="text-2xl font-bold text-neutral-900 mb-1">{concert.title}</h1>
                      <div className="flex items-center text-neutral-600">
                        <Music className="h-4 w-4 mr-1" />
                        <span>Presented by {concert.artist?.name}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon">
                        <Share2 className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Heart className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>

                  <Tabs defaultValue="details" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="details">Details</TabsTrigger>
                      <TabsTrigger value="venue">Venue</TabsTrigger>
                      <TabsTrigger value="artist">Artist</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="details" className="pt-4">
                      <div className="prose max-w-none">
                        <p>{concert.description}</p>
                        
                        <h3 className="text-lg font-bold mt-6 mb-4">Event Information</h3>
                        <ul className="space-y-2">
                          <li className="flex items-start">
                            <Calendar className="h-5 w-5 mr-2 text-primary flex-shrink-0 mt-1" />
                            <div>
                              <span className="font-medium">Date & Time:</span>
                              <div>{format(new Date(concert.date), 'EEEE, MMMM dd, yyyy')} at {format(new Date(concert.date), 'h:mm a')}</div>
                            </div>
                          </li>
                          <li className="flex items-start">
                            <MapPin className="h-5 w-5 mr-2 text-primary flex-shrink-0 mt-1" />
                            <div>
                              <span className="font-medium">Venue:</span>
                              <div>{concert.venue?.name}, {concert.venue?.location}</div>
                              <div className="text-sm text-neutral-600">{concert.venue?.address}</div>
                            </div>
                          </li>
                          <li className="flex items-start">
                            <Info className="h-5 w-5 mr-2 text-primary flex-shrink-0 mt-1" />
                            <div>
                              <span className="font-medium">Additional Information:</span>
                              <ul className="list-disc ml-5 mt-1 text-neutral-700">
                                <li>Doors open 1 hour before the event</li>
                                <li>Outside food and drinks are not allowed</li>
                                <li>Parking is available at the venue</li>
                                <li>Children below 7 years old are not allowed</li>
                              </ul>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="venue" className="pt-4">
                      <div className="space-y-4">
                        <div className="aspect-video rounded-lg overflow-hidden">
                          <img 
                            src={concert.venue?.imageUrl || "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} 
                            alt={concert.venue?.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <h3 className="text-xl font-bold">{concert.venue?.name}</h3>
                        <p className="text-neutral-700">{concert.venue?.address}</p>
                        
                        <div className="flex items-center">
                          <Users className="h-5 w-5 mr-2 text-primary" />
                          <span>Capacity: {concert.venue?.capacity.toLocaleString()} people</span>
                        </div>
                        
                        <h4 className="font-bold mt-4">Venue Facilities</h4>
                        <ul className="grid grid-cols-2 gap-2">
                          <li className="flex items-center">
                            <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                            Air-conditioned
                          </li>
                          <li className="flex items-center">
                            <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                            Food court
                          </li>
                          <li className="flex items-center">
                            <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                            Parking
                          </li>
                          <li className="flex items-center">
                            <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                            Accessible facilities
                          </li>
                          <li className="flex items-center">
                            <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                            VIP lounges
                          </li>
                          <li className="flex items-center">
                            <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                            Security services
                          </li>
                        </ul>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="artist" className="pt-4">
                      <div className="flex flex-col sm:flex-row gap-6">
                        <div className="sm:w-1/3">
                          <div className="rounded-lg overflow-hidden">
                            <img 
                              src={concert.artist?.imageUrl || "https://images.unsplash.com/photo-1522196772883-393d879eb14d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"} 
                              alt={concert.artist?.name} 
                              className="w-full aspect-square object-cover"
                            />
                          </div>
                        </div>
                        <div className="sm:w-2/3">
                          <h3 className="text-xl font-bold mb-2">{concert.artist?.name}</h3>
                          <div className="mb-2 inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                            {concert.artist?.genre}
                          </div>
                          <p className="text-neutral-700 mb-4">
                            {concert.artist?.bio || "No artist information available."}
                          </p>
                          <Button asChild variant="outline">
                            <Link href={`/artists/${concert.artist?.id}`}>View Artist Profile</Link>
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
                
                {/* Tickets Section */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-bold mb-6 flex items-center">
                    <TicketIcon className="h-5 w-5 mr-2 text-primary" />
                    Available Tickets
                  </h2>
                  
                  {loadingTickets ? (
                    <div className="space-y-4">
                      {Array(3).fill(0).map((_, i) => (
                        <div key={i} className="border rounded-lg p-4 animate-pulse">
                          <div className="flex justify-between">
                            <Skeleton className="h-6 w-32" />
                            <Skeleton className="h-6 w-20" />
                          </div>
                          <Skeleton className="h-4 w-full mt-2" />
                          <Skeleton className="h-4 w-2/3 mt-1" />
                        </div>
                      ))}
                    </div>
                  ) : ticketTypes && ticketTypes.length > 0 ? (
                    <div className="space-y-4">
                      {ticketTypes.map((ticket) => (
                        <div key={ticket.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-bold text-lg">{ticket.name}</h3>
                              <p className="text-neutral-600 text-sm">
                                {ticket.quantity} tickets available
                              </p>
                            </div>
                            <span className="font-bold text-primary text-lg">
                              ₱{ticket.price.toLocaleString()}
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center mt-4">
                            <div className="text-sm text-neutral-600">
                              {ticket.quantity > 0 ? (
                                <span className="text-green-600 font-medium">In Stock</span>
                              ) : (
                                <span className="text-red-600 font-medium">Sold Out</span>
                              )}
                            </div>
                            
                            <div className="flex items-center space-x-3">
                              <Button 
                                variant="outline" 
                                size="icon" 
                                onClick={() => decrementTicket(ticket.id)}
                                disabled={!selectedTickets[ticket.id] || ticket.quantity === 0}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              
                              <span className="w-8 text-center">
                                {selectedTickets[ticket.id] || 0}
                              </span>
                              
                              <Button 
                                variant="outline" 
                                size="icon" 
                                onClick={() => incrementTicket(ticket.id)}
                                disabled={ticket.quantity === 0 || (selectedTickets[ticket.id] || 0) >= ticket.quantity}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      <div className="mt-6 border-t pt-4">
                        <div className="flex justify-between items-center mb-4">
                          <span className="font-medium">Total Tickets:</span>
                          <span>{totalSelectedTickets}</span>
                        </div>
                        <div className="flex justify-between items-center mb-6">
                          <span className="font-bold text-lg">Total Amount:</span>
                          <span className="font-bold text-primary text-lg">₱{totalPrice.toLocaleString()}</span>
                        </div>
                        
                        <Button 
                          className="w-full" 
                          size="lg"
                          disabled={totalSelectedTickets === 0}
                          asChild
                        >
                          <Link href={user ? `/checkout/${concertId}` : "/auth"}>
                            {user ? "Proceed to Checkout" : "Sign In to Book Tickets"}
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-neutral-600">No tickets available for this concert.</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Sidebar */}
              <div>
                {/* Quick Booking */}
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Quick Booking</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-600">Date:</span>
                        <span className="font-medium">{format(new Date(concert.date), 'MMM dd, yyyy')}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-600">Time:</span>
                        <span className="font-medium">{format(new Date(concert.date), 'h:mm a')}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-600">Venue:</span>
                        <span className="font-medium">{concert.venue?.name}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-600">Artist:</span>
                        <span className="font-medium">{concert.artist?.name}</span>
                      </div>
                      
                      <div className="border-t pt-4 mt-4">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-neutral-600">Price Range:</span>
                          <span className="font-bold text-primary">
                            {ticketTypes && ticketTypes.length > 0 ? (
                              `₱${Math.min(...ticketTypes.map(t => t.price)).toLocaleString()} - ₱${Math.max(...ticketTypes.map(t => t.price)).toLocaleString()}`
                            ) : (
                              "TBA"
                            )}
                          </span>
                        </div>
                        <div className="text-xs text-neutral-500 mb-4">
                          *Price depends on selected section
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" asChild>
                      <a href="#tickets">Get Tickets</a>
                    </Button>
                  </CardFooter>
                </Card>
                
                {/* Venue Map */}
                <Card>
                  <CardHeader>
                    <CardTitle>Venue Map</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-square rounded-lg overflow-hidden bg-neutral-100 flex items-center justify-center">
                      <div className="text-center p-4">
                        <svg
                          width="200"
                          height="200"
                          viewBox="0 0 200 200"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          {/* Simple venue layout */}
                          <rect x="50" y="120" width="100" height="40" fill="#FF6B35" stroke="#000" />
                          <text x="100" y="145" fontSize="12" textAnchor="middle" fill="white">Stage</text>
                          
                          <rect x="30" y="80" width="140" height="30" fill="#e2e8f0" stroke="#000" />
                          <text x="100" y="100" fontSize="10" textAnchor="middle">VIP</text>
                          
                          <rect x="20" y="40" width="160" height="30" fill="#e2e8f0" stroke="#000" />
                          <text x="100" y="60" fontSize="10" textAnchor="middle">General Admission</text>
                          
                          <rect x="40" y="10" width="120" height="20" fill="#e2e8f0" stroke="#000" />
                          <text x="100" y="24" fontSize="10" textAnchor="middle">Balcony</text>
                        </svg>
                      </div>
                    </div>
                    <div className="mt-4 text-sm text-neutral-600">
                      Tap on a section to see available tickets and prices
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="container mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">Concert Not Found</h2>
          <p className="text-neutral-600 mb-6">The concert you're looking for does not exist or has been removed.</p>
          <Button asChild>
            <Link href="/concerts">View All Concerts</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default ConcertDetailPage;
