import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute, AdminRoute } from "./lib/protected-route";

// Pages
import HomePage from "@/pages/home-page";
import ConcertsPage from "@/pages/concerts-page";
import ConcertDetailPage from "@/pages/concert-detail-page";
import ArtistsPage from "@/pages/artists-page";
import ArtistDetailPage from "@/pages/artist-detail-page";
import VenuesPage from "@/pages/venues-page";
import VenueDetailPage from "@/pages/venue-detail-page";
import CheckoutPage from "@/pages/checkout-page";
import ProfilePage from "@/pages/profile-page";
import AuthPage from "@/pages/auth-page";
import NotFound from "@/pages/not-found";

// Admin Pages
import AdminDashboard from "@/pages/admin/dashboard";
import AdminConcerts from "@/pages/admin/concerts";
import AdminArtists from "@/pages/admin/artists";
import AdminVenues from "@/pages/admin/venues";

// Layout
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={HomePage}/>
      <Route path="/concerts" component={ConcertsPage}/>
      <Route path="/concerts/:id" component={ConcertDetailPage}/>
      <Route path="/artists" component={ArtistsPage}/>
      <Route path="/artists/:id" component={ArtistDetailPage}/>
      <Route path="/venues" component={VenuesPage}/>
      <Route path="/venues/:id" component={VenueDetailPage}/>
      <Route path="/auth" component={AuthPage}/>
      
      {/* Protected routes */}
      <ProtectedRoute path="/checkout/:concertId" component={CheckoutPage} />
      <ProtectedRoute path="/profile" component={ProfilePage} />
      
      {/* Admin routes */}
      <AdminRoute path="/admin" component={AdminDashboard} />
      <AdminRoute path="/admin/concerts" component={AdminConcerts} />
      <AdminRoute path="/admin/artists" component={AdminArtists} />
      <AdminRoute path="/admin/venues" component={AdminVenues} />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider defaultTheme="light">
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Router />
            </main>
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
