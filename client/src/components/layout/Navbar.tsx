import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  User,
  LogOut,
  Music,
  MapPin,
  Search,
  Menu,
  X,
  UserCircle,
  ShieldCheck,
} from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();

  // Close mobile menu when location changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);
  
  // Mobile menu toggle
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <span className="text-primary font-bold text-2xl">PinoyTix</span>
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8">
          <Link href="/" className={`text-neutral-800 hover:text-primary font-medium ${location === '/' ? 'text-primary' : ''}`}>
            Home
          </Link>
          <Link href="/concerts" className={`text-neutral-800 hover:text-primary font-medium ${location === '/concerts' ? 'text-primary' : ''}`}>
            Concerts
          </Link>
          <Link href="/artists" className={`text-neutral-800 hover:text-primary font-medium ${location === '/artists' ? 'text-primary' : ''}`}>
            Artists
          </Link>
          <Link href="/venues" className={`text-neutral-800 hover:text-primary font-medium ${location === '/venues' ? 'text-primary' : ''}`}>
            Venues
          </Link>
        </div>
        
        {/* User Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" size="icon" aria-label="Search">
            <Search className="h-5 w-5" />
          </Button>
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <UserCircle className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="px-2 py-1.5 text-sm font-medium">
                  {user.fullName || user.username}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">My Profile</Link>
                </DropdownMenuItem>
                {user.isAdmin && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="cursor-pointer flex items-center">
                        <ShieldCheck className="mr-2 h-4 w-4" />
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-500">
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild>
              <Link href="/auth">Sign In</Link>
            </Button>
          )}
        </div>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-neutral-800" 
          onClick={toggleMenu}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>
      
      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white pb-4 px-4">
          <div className="flex flex-col space-y-3">
            <Link href="/" className={`text-neutral-800 hover:text-primary font-medium py-2 ${location === '/' ? 'text-primary' : ''}`}>
              Home
            </Link>
            <Link href="/concerts" className={`text-neutral-800 hover:text-primary font-medium py-2 ${location === '/concerts' ? 'text-primary' : ''}`}>
              Concerts
            </Link>
            <Link href="/artists" className={`text-neutral-800 hover:text-primary font-medium py-2 ${location === '/artists' ? 'text-primary' : ''}`}>
              Artists
            </Link>
            <Link href="/venues" className={`text-neutral-800 hover:text-primary font-medium py-2 ${location === '/venues' ? 'text-primary' : ''}`}>
              Venues
            </Link>
            
            <div className="border-t border-gray-200 my-2 pt-2"></div>
            
            {user ? (
              <>
                <Link href="/profile" className="text-neutral-800 hover:text-primary font-medium py-2 flex items-center">
                  <User className="mr-2 h-4 w-4" /> My Profile
                </Link>
                {user.isAdmin && (
                  <Link href="/admin" className="text-neutral-800 hover:text-primary font-medium py-2 flex items-center">
                    <ShieldCheck className="mr-2 h-4 w-4" /> Admin Dashboard
                  </Link>
                )}
                <button 
                  onClick={handleLogout}
                  className="text-red-500 hover:text-red-700 font-medium py-2 flex items-center"
                >
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </button>
              </>
            ) : (
              <Link href="/auth">
                <Button className="w-full">Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
