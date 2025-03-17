import { useState } from "react";
import { Link } from "wouter";
import { useConcerts, useCategories } from "@/hooks/use-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { Calendar, MapPin, Search, LayoutGrid, List } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const ConcertsPage = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all-categories");
  const [location, setLocation] = useState("all-locations");
  const [dateFilter, setDateFilter] = useState("all-dates");

  const { data: concerts, isLoading } = useConcerts();
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  // Filter the concerts based on the search query and filters
  const filteredConcerts = concerts?.filter((concert) => {
    if (searchQuery && !concert.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // More filters would be implemented based on actual data structure
    return true;
  });

  const formatPrice = (min: number, max: number) => {
    return `₱${min.toLocaleString()} - ₱${max.toLocaleString()}`;
  };

  return (
    <div className="bg-neutral-50 min-h-screen pb-16">
      {/* Hero Section */}
      <section className="relative bg-cover bg-center h-[300px] flex items-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')" }}>
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/80 to-primary/70"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-white font-bold text-4xl md:text-5xl mb-4">
              Upcoming Concerts
            </h1>
            <p className="text-white text-lg">
              Find and book tickets to the best Filipino concerts and live music events
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-8">
        {/* Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
          <div className="flex flex-col md:flex-row items-stretch gap-4">
            <div className="relative flex-grow">
              <Input
                type="text"
                placeholder="Search events"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
            </div>
            
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="flex-grow">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-categories">All Categories</SelectItem>
                {!categoriesLoading && categories?.map((cat) => (
                  <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger className="flex-grow">
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-locations">All Locations</SelectItem>
                <SelectItem value="manila">Manila</SelectItem>
                <SelectItem value="cebu">Cebu</SelectItem>
                <SelectItem value="davao">Davao</SelectItem>
                <SelectItem value="baguio">Baguio</SelectItem>
                <SelectItem value="iloilo">Iloilo</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="flex-grow">
                <SelectValue placeholder="All Dates" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-dates">All Dates</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="tomorrow">Tomorrow</SelectItem>
                <SelectItem value="weekend">This Weekend</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
            
            <Button className="whitespace-nowrap">
              Filter
            </Button>
          </div>
        </div>
        
        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-neutral-900">
            {isLoading ? "Loading concerts..." : `${filteredConcerts?.length || 0} Concerts Found`}
          </h2>
          <div className="flex gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Concert Listings */}
        {isLoading ? (
          <div className={`grid ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"} gap-6`}>
            {Array(9).fill(0).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="h-48 bg-gray-200 animate-pulse"></div>
                <CardContent className="p-5">
                  <div className="flex items-center mb-3 gap-2">
                    <Skeleton className="h-6 w-24 rounded" />
                    <Skeleton className="h-6 w-32 rounded" />
                  </div>
                  <Skeleton className="h-7 w-3/4 mb-2 rounded" />
                  <Skeleton className="h-4 w-full mb-1 rounded" />
                  <Skeleton className="h-4 w-2/3 mb-4 rounded" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-6 w-20 rounded" />
                    <Skeleton className="h-10 w-28 rounded" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredConcerts && filteredConcerts.length > 0 ? (
          <div className={`grid ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"} gap-6`}>
            {filteredConcerts.map((concert) => (
              <Card key={concert.id} className={`overflow-hidden ${viewMode === "list" ? "flex flex-col md:flex-row" : ""}`}>
                <div className={viewMode === "list" ? "md:w-1/3" : ""}>
                  <img 
                    src={concert.imageUrl || "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} 
                    alt={concert.title} 
                    className="w-full h-48 object-cover"
                  />
                </div>
                <CardContent className={`p-5 ${viewMode === "list" ? "md:w-2/3" : ""}`}>
                  <div className="flex items-center mb-3 flex-wrap gap-2">
                    <span className="text-sm text-neutral-600 bg-neutral-100 px-2 py-1 rounded flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {format(new Date(concert.date), 'MMM dd, yyyy')}
                    </span>
                    <span className="text-sm text-neutral-600 bg-neutral-100 px-2 py-1 rounded flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {concert.venue?.name || "Venue"}
                    </span>
                  </div>
                  <h3 className="font-bold text-xl mb-2">{concert.title}</h3>
                  <p className="text-neutral-700 mb-4 line-clamp-2">{concert.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-primary">
                      {/* Price range would normally come from ticket types */}
                      ₱1,500 - ₱3,500
                    </span>
                    <Button asChild>
                      <Link href={`/concerts/${concert.id}`}>Get Tickets</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-neutral-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-2">No concerts found</h3>
            <p className="text-neutral-600 mb-6">
              Try adjusting your search filters to find what you're looking for.
            </p>
            <Button onClick={() => {
              setSearchQuery("");
              setCategory("all-categories");
              setLocation("all-locations");
              setDateFilter("all-dates");
            }}>
              Clear Filters
            </Button>
          </div>
        )}
        
        {/* Pagination */}
        {filteredConcerts && filteredConcerts.length > 0 && (
          <div className="flex justify-center mt-10">
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
              Load More
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConcertsPage;
