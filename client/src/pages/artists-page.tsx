import { useState } from "react";
import { Link } from "wouter";
import { useArtists } from "@/hooks/use-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Music } from "lucide-react";

const ArtistsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: artists, isLoading } = useArtists();

  // Filter artists based on search query
  const filteredArtists = artists?.filter((artist) =>
    artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    artist.genre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-neutral-50 min-h-screen pb-16">
      {/* Hero Section */}
      <section className="relative bg-cover bg-center h-[300px] flex items-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')" }}>
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/80 to-primary/70"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-white font-bold text-4xl md:text-5xl mb-4">
              Filipino Artists
            </h1>
            <p className="text-white text-lg">
              Discover amazing local talent from across the Philippines
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
              placeholder="Search for artists by name or genre..."
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
            {isLoading ? "Loading artists..." : `${filteredArtists?.length || 0} Artists Found`}
          </h2>
        </div>
        
        {/* Artists Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array(8).fill(0).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="aspect-square bg-gray-200 animate-pulse"></div>
                <CardContent className="p-5">
                  <Skeleton className="h-6 w-24 rounded mb-2" />
                  <Skeleton className="h-4 w-16 rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredArtists && filteredArtists.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredArtists.map((artist) => (
              <Link key={artist.id} href={`/artists/${artist.id}`}>
                <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col">
                  <div className="aspect-square overflow-hidden bg-neutral-100">
                    <img 
                      src={artist.imageUrl || "https://images.unsplash.com/photo-1522196772883-393d879eb14d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"} 
                      alt={artist.name} 
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-5 flex-grow flex flex-col">
                    <h3 className="font-bold text-xl mb-1">{artist.name}</h3>
                    <div className="flex items-center text-neutral-600 text-sm mb-2">
                      <Music className="h-3 w-3 mr-1" />
                      <span>{artist.genre}</span>
                    </div>
                    {artist.bio && (
                      <p className="text-neutral-700 text-sm line-clamp-2 mt-auto">
                        {artist.bio}
                      </p>
                    )}
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
            <h3 className="text-xl font-bold text-neutral-900 mb-2">No artists found</h3>
            <p className="text-neutral-600 mb-6">
              We couldn't find any artists matching your search criteria.
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

export default ArtistsPage;
