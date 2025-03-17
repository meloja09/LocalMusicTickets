import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useFeaturedConcerts, useUpcomingConcerts, useFeaturedArtists, useTopVenues, useCategories } from "@/hooks/use-api";
import { Search, Calendar, MapPin, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: featuredConcerts, isLoading: isLoadingFeatured } = useFeaturedConcerts(3);
  const { data: upcomingConcerts, isLoading: isLoadingUpcoming } = useUpcomingConcerts(6);
  const { data: featuredArtists, isLoading: isLoadingArtists } = useFeaturedArtists(4);
  const { data: topVenues, isLoading: isLoadingVenues } = useTopVenues(3);
  const { data: categories, isLoading: isLoadingCategories } = useCategories();

  const formatPrice = (min: number, max: number) => {
    return `₱${min.toLocaleString()} - ₱${max.toLocaleString()}`;
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-cover bg-center h-[500px] flex items-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1609127638075-e7dd633a499f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')" }}>
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/80 to-primary/70"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-white font-bold text-4xl md:text-5xl mb-4">
              Experience Filipino Music Live
            </h1>
            <p className="text-white text-lg mb-8">
              Discover and book tickets to the best local concerts and events in the Philippines
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-grow">
                <Input
                  type="text"
                  placeholder="Search for concerts, artists, or venues"
                  className="w-full px-5 py-6 rounded-md shadow-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button className="absolute right-1 top-1/2 transform -translate-y-1/2" variant="ghost" size="icon">
                  <Search className="h-5 w-5" />
                </Button>
              </div>
              <Button className="bg-accent text-neutral-900 hover:bg-accent/90 px-6 py-3 h-auto">
                Find Events
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-16 container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-neutral-900">Featured Events</h2>
          <Link href="/concerts" className="text-primary font-medium hover:underline flex items-center">
            View All <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {isLoadingFeatured ? (
            Array(3).fill(0).map((_, i) => (
              <Card key={i} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300">
                <div className="h-48 bg-gray-200 animate-pulse"></div>
                <CardContent className="p-5">
                  <div className="flex items-center mb-3 gap-2">
                    <div className="bg-gray-200 h-6 w-24 rounded animate-pulse"></div>
                    <div className="bg-gray-200 h-6 w-32 rounded animate-pulse"></div>
                  </div>
                  <div className="bg-gray-200 h-7 w-3/4 mb-2 rounded animate-pulse"></div>
                  <div className="bg-gray-200 h-4 w-full mb-1 rounded animate-pulse"></div>
                  <div className="bg-gray-200 h-4 w-2/3 mb-4 rounded animate-pulse"></div>
                  <div className="flex justify-between items-center">
                    <div className="bg-gray-200 h-6 w-20 rounded animate-pulse"></div>
                    <div className="bg-gray-200 h-10 w-28 rounded animate-pulse"></div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : featuredConcerts && featuredConcerts.length > 0 ? (
            featuredConcerts.map((concert) => (
              <Card key={concert.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300">
                <div className="relative">
                  <img 
                    src={concert.imageUrl || "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} 
                    alt={concert.title} 
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-accent text-neutral-900 px-3 py-1 rounded-full font-medium text-sm">
                    Featured
                  </div>
                </div>
                <CardContent className="p-5">
                  <div className="flex items-center mb-3 flex-wrap gap-2">
                    <span className="text-sm text-neutral-600 bg-neutral-100 px-2 py-1 rounded flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {format(new Date(concert.date), 'MMM dd, yyyy')}
                    </span>
                    <span className="text-sm text-neutral-600 bg-neutral-100 px-2 py-1 rounded flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {concert.venue?.name || 'Venue TBA'}
                    </span>
                  </div>
                  <h3 className="font-bold text-xl mb-2">{concert.title}</h3>
                  <p className="text-neutral-700 mb-4 line-clamp-2">{concert.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-primary">
                      {formatPrice(concert.minPrice || 1000, concert.maxPrice || 5000)}
                    </span>
                    <Button asChild>
                      <Link href={`/concerts/${concert.id}`}>Get Tickets</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-3 text-center py-8">
              <p className="text-neutral-500">No featured concerts available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 bg-neutral-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-neutral-900 mb-8 text-center">Browse By Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {isLoadingCategories ? (
              Array(6).fill(0).map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-4 shadow-sm animate-pulse flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-200 mb-3"></div>
                  <div className="h-5 w-16 bg-gray-200 rounded"></div>
                </div>
              ))
            ) : categories && categories.length > 0 ? (
              categories.map((category) => (
                <Link key={category.id} href={`/concerts?category=${category.name}`} className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition duration-300 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <i className={`${category.iconClass} text-primary text-xl`}></i>
                  </div>
                  <h3 className="font-medium">{category.name}</h3>
                </Link>
              ))
            ) : (
              <div className="col-span-6 text-center py-4">
                <p className="text-neutral-500">No categories available.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-neutral-900">Upcoming Events</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <i className="fas fa-th-large"></i>
            </Button>
            <Button variant="outline" size="icon">
              <i className="fas fa-list"></i>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoadingUpcoming ? (
            Array(6).fill(0).map((_, i) => (
              <Card key={i} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300">
                <div className="h-48 bg-gray-200 animate-pulse"></div>
                <CardContent className="p-5">
                  <div className="flex items-center mb-3 gap-2">
                    <div className="bg-gray-200 h-6 w-24 rounded animate-pulse"></div>
                    <div className="bg-gray-200 h-6 w-32 rounded animate-pulse"></div>
                  </div>
                  <div className="bg-gray-200 h-7 w-3/4 mb-2 rounded animate-pulse"></div>
                  <div className="bg-gray-200 h-4 w-full mb-1 rounded animate-pulse"></div>
                  <div className="bg-gray-200 h-4 w-2/3 mb-4 rounded animate-pulse"></div>
                  <div className="flex justify-between items-center">
                    <div className="bg-gray-200 h-6 w-20 rounded animate-pulse"></div>
                    <div className="bg-gray-200 h-10 w-28 rounded animate-pulse"></div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : upcomingConcerts && upcomingConcerts.length > 0 ? (
            upcomingConcerts.map((concert) => (
              <Card key={concert.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300">
                <div className="relative">
                  <img 
                    src={concert.imageUrl || `https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`} 
                    alt={concert.title} 
                    className="w-full h-48 object-cover"
                  />
                </div>
                <CardContent className="p-5">
                  <div className="flex items-center mb-3 flex-wrap gap-2">
                    <span className="text-sm text-neutral-600 bg-neutral-100 px-2 py-1 rounded flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {format(new Date(concert.date), 'MMM dd, yyyy')}
                    </span>
                    <span className="text-sm text-neutral-600 bg-neutral-100 px-2 py-1 rounded flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {concert.venue?.name || 'Venue TBA'}
                    </span>
                  </div>
                  <h3 className="font-bold text-xl mb-2">{concert.title}</h3>
                  <p className="text-neutral-700 mb-4 line-clamp-2">{concert.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-primary">
                      {formatPrice(concert.minPrice || 1000, concert.maxPrice || 5000)}
                    </span>
                    <Button asChild>
                      <Link href={`/concerts/${concert.id}`}>Get Tickets</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-3 text-center py-8">
              <p className="text-neutral-500">No upcoming concerts available at the moment.</p>
            </div>
          )}
        </div>
        
        <div className="flex justify-center mt-10">
          <Button variant="outline" asChild className="border-primary text-primary hover:bg-primary hover:text-white">
            <Link href="/concerts">Load More Events</Link>
          </Button>
        </div>
      </section>

      {/* Featured Artists */}
      <section className="py-16 bg-gradient-to-r from-secondary to-primary">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Featured Artists</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {isLoadingArtists ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-sm rounded-lg p-5 animate-pulse">
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full bg-white/30 mb-4"></div>
                    <div className="h-6 w-20 bg-white/30 mb-1 rounded"></div>
                    <div className="h-4 w-12 bg-white/30 rounded"></div>
                  </div>
                </div>
              ))
            ) : featuredArtists && featuredArtists.length > 0 ? (
              featuredArtists.map((artist) => (
                <Link key={artist.id} href={`/artists/${artist.id}`} className="bg-white/10 backdrop-blur-sm rounded-lg p-5 hover:bg-white/20 transition duration-300 flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-white">
                    <img 
                      src={artist.imageUrl || "https://images.unsplash.com/photo-1522196772883-393d879eb14d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"} 
                      alt={artist.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-bold text-white text-lg mb-1">{artist.name}</h3>
                  <p className="text-white/80 text-sm">{artist.genre}</p>
                </Link>
              ))
            ) : (
              <div className="col-span-4 text-center py-8">
                <p className="text-white/80">No featured artists available at the moment.</p>
              </div>
            )}
          </div>
          
          <div className="flex justify-center mt-10">
            <Button className="bg-white text-primary hover:bg-white/90" asChild>
              <Link href="/artists">View All Artists</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 container mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-contain bg-no-repeat bg-right opacity-10" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')" }}></div>
          
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">Never Miss a Beat!</h2>
            <p className="text-neutral-700 mb-6">
              Sign up for our newsletter to get concert alerts, exclusive promotions, and early access to ticket sales for your favorite Filipino artists.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                type="email"
                placeholder="Your email address"
                className="flex-grow px-5 py-6"
              />
              <Button className="bg-accent text-neutral-900 hover:bg-accent/90 px-6 py-3 h-auto">
                Subscribe
              </Button>
            </div>
            
            <p className="text-neutral-500 text-sm mt-4">
              By subscribing, you agree to our <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Venues */}
      <section className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-neutral-900 mb-8 text-center">Top Venues</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {isLoadingVenues ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="relative rounded-lg overflow-hidden h-64 bg-gray-200 animate-pulse"></div>
              ))
            ) : topVenues && topVenues.length > 0 ? (
              topVenues.map((venue) => (
                <Link key={venue.id} href={`/venues/${venue.id}`} className="relative rounded-lg overflow-hidden h-64 group">
                  <img 
                    src={venue.imageUrl || "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} 
                    alt={venue.name} 
                    className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
                    <h3 className="font-bold text-white text-xl mb-1">{venue.name}</h3>
                    <p className="text-white/80 text-sm mb-2">{venue.location}</p>
                    <div className="flex items-center text-white/80 text-sm">
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" /> Upcoming Events
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-3 text-center py-8">
                <p className="text-neutral-500">No venues available at the moment.</p>
              </div>
            )}
          </div>
          
          <div className="flex justify-center mt-10">
            <Button variant="outline" asChild className="border-primary text-primary hover:bg-primary hover:text-white">
              <Link href="/venues">View All Venues</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* App Promotion */}
      <section className="py-16 container mx-auto px-4">
        <div className="bg-secondary rounded-xl shadow-lg p-8 md:p-0 flex flex-col md:flex-row overflow-hidden">
          <div className="md:w-1/2 p-0 md:p-12 flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-white mb-4">Get Our Mobile App</h2>
            <p className="text-white/80 mb-6">
              Download the PinoyTix app for a faster, more convenient way to discover and book tickets to the best concerts in the Philippines.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="outline" className="bg-black text-white border-transparent hover:bg-black/80 hover:text-white">
                <svg className="h-5 w-5 mr-2" viewBox="0 0 384 512" xmlns="http://www.w3.org/2000/svg">
                  <path fill="currentColor" d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
                </svg>
                <div>
                  <div className="text-xs">Download on the</div>
                  <div className="font-medium">App Store</div>
                </div>
              </Button>
              
              <Button variant="outline" className="bg-black text-white border-transparent hover:bg-black/80 hover:text-white">
                <svg className="h-5 w-5 mr-2" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                  <path fill="currentColor" d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/>
                </svg>
                <div>
                  <div className="text-xs">Get it on</div>
                  <div className="font-medium">Google Play</div>
                </div>
              </Button>
            </div>
          </div>
          
          <div className="md:w-1/2 mt-8 md:mt-0 flex justify-center">
            <img 
              src="https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
              alt="PinoyTix Mobile App" 
              className="max-h-[400px] object-cover rounded-xl md:rounded-none md:rounded-r-xl"
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-neutral-900 mb-8 text-center">What Our Users Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Testimonial 1 */}
            <div className="bg-white rounded-lg shadow-sm p-6 relative">
              <div className="text-accent text-4xl absolute top-4 right-4 opacity-20">
                <i className="fas fa-quote-right"></i>
              </div>
              <div className="flex items-center mb-4">
                <div className="flex text-accent">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                </div>
              </div>
              <p className="text-neutral-700 mb-6">
                "PinoyTix made it so easy to find and buy tickets for my favorite OPM bands. The seating chart was clear and the checkout process was smooth. Highly recommend!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <img 
                    src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" 
                    alt="Maria Santos" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold">Maria Santos</h4>
                  <p className="text-neutral-500 text-sm">Manila, Philippines</p>
                </div>
              </div>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-white rounded-lg shadow-sm p-6 relative">
              <div className="text-accent text-4xl absolute top-4 right-4 opacity-20">
                <i className="fas fa-quote-right"></i>
              </div>
              <div className="flex items-center mb-4">
                <div className="flex text-accent">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star-half-alt"></i>
                </div>
              </div>
              <p className="text-neutral-700 mb-6">
                "I've been using PinoyTix for all my concert needs. Their exclusive pre-sales have helped me score great seats for popular shows that would've sold out immediately!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" 
                    alt="Juan Dela Cruz" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold">Juan Dela Cruz</h4>
                  <p className="text-neutral-500 text-sm">Cebu City, Philippines</p>
                </div>
              </div>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-white rounded-lg shadow-sm p-6 relative">
              <div className="text-accent text-4xl absolute top-4 right-4 opacity-20">
                <i className="fas fa-quote-right"></i>
              </div>
              <div className="flex items-center mb-4">
                <div className="flex text-accent">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                </div>
              </div>
              <p className="text-neutral-700 mb-6">
                "As a concert enthusiast from Davao, I appreciate how PinoyTix includes events from all over the Philippines, not just Manila. The mobile app is a game-changer!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <img 
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" 
                    alt="Ana Reyes" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold">Ana Reyes</h4>
                  <p className="text-neutral-500 text-sm">Davao City, Philippines</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
