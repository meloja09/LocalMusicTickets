import { useState } from "react";
import { Link } from "wouter";
import { useVenues } from "@/hooks/use-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, MapPin, Users } from "lucide-react";

const VenuesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: venues, isLoading } = useVenues();

  // Filter venues based on search query
  const filteredVenues = venues?.filter((venue) =>
    venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    venue.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    venue.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-neutral-50 min-h-screen pb-16">
      {/* Hero Section */}
      <section className="relative bg-cover bg-center h-[300px] flex items-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1566737236500-c8ac43014a67?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')" }}>
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/80 to-primary/70"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-white font-bold text-4xl md:text-5xl mb-4">
              Venues
            </h1>
            <p className="text-white text-lg">
              Discover top concert venues across the Philippines
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-12">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search for venues by name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 py-6 text-lg"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-5 w-5" />
          </div>
        </div>
        
        {/* Results Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-neutral-900">
            {isLoading ? "Loading venues..." : `${filteredVenues?.length || 0} Venues Found`}
          </h2>
        </div>
        
        {/* Venues Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="h-48 bg-gray-200 animate-pulse"></div>
                <CardContent className="p-5">
                  <Skeleton className="h-6 w-48 rounded mb-2" />
                  <Skeleton className="h-4 w-36 rounded mb-2" />
                  <Skeleton className="h-4 w-24 rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredVenues && filteredVenues.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVenues.map((venue) => (
              <Link key={venue.id} href={`/venues/${venue.id}`}>
                <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col">
                  <div className="relative h-48 overflow-hidden bg-neutral-100">
                    <img 
                      src={venue.imageUrl || "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"} 
                      alt={venue.name} 
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="font-bold text-white text-xl">{venue.name}</h3>
                        <div className="flex items-center text-white/80 text-sm">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>{venue.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-5 flex-grow">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center text-neutral-600 text-sm">
                        <Users className="h-4 w-4 mr-1" />
                        <span>Capacity: {venue.capacity.toLocaleString()}</span>
                      </div>
                      <div className="text-sm text-primary font-medium">
                        View Details
                      </div>
                    </div>
                    <p className="text-neutral-700 text-sm line-clamp-2">
                      {venue.address}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-neutral-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-2">No venues found</h3>
            <p className="text-neutral-600 mb-6">
              We couldn't find any venues matching your search criteria.
            </p>
            <Button onClick={() => setSearchQuery("")}>
              Clear Search
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VenuesPage;
