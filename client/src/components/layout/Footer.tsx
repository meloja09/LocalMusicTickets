import { Link } from "wouter";
import { Facebook, Twitter, Instagram, Youtube, MapPin, Phone, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-neutral-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Column 1: About */}
          <div className="lg:col-span-2">
            <h3 className="font-bold text-2xl mb-6">PinoyTix</h3>
            <p className="text-neutral-400 mb-6">
              Supporting local Filipino artists by connecting fans with live music experiences across the Philippines.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-primary transition duration-300">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-white hover:text-primary transition duration-300">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-white hover:text-primary transition duration-300">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-white hover:text-primary transition duration-300">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-neutral-400 hover:text-white transition duration-300">Home</Link></li>
              <li><Link href="/concerts" className="text-neutral-400 hover:text-white transition duration-300">Concerts</Link></li>
              <li><Link href="/artists" className="text-neutral-400 hover:text-white transition duration-300">Artists</Link></li>
              <li><Link href="/venues" className="text-neutral-400 hover:text-white transition duration-300">Venues</Link></li>
              <li><Link href="/" className="text-neutral-400 hover:text-white transition duration-300">About Us</Link></li>
            </ul>
          </div>
          
          {/* Column 3: Support */}
          <div>
            <h4 className="font-bold text-lg mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-neutral-400 hover:text-white transition duration-300">FAQs</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white transition duration-300">Terms of Service</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white transition duration-300">Privacy Policy</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white transition duration-300">Refund Policy</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white transition duration-300">Ticket Verification</a></li>
            </ul>
          </div>
          
          {/* Column 4: Contact */}
          <div>
            <h4 className="font-bold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-primary mr-3 flex-shrink-0 mt-1" />
                <span className="text-neutral-400">123 Paseo de Roxas, Makati City, Philippines</span>
              </li>
              <li className="flex items-start">
                <Phone className="h-5 w-5 text-primary mr-3 flex-shrink-0 mt-1" />
                <span className="text-neutral-400">+63 (2) 8123 4567</span>
              </li>
              <li className="flex items-start">
                <Mail className="h-5 w-5 text-primary mr-3 flex-shrink-0 mt-1" />
                <span className="text-neutral-400">support@pinoytix.ph</span>
              </li>
            </ul>
          </div>
        </div>
        
        <hr className="border-neutral-800 mb-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-neutral-500 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} PinoyTix. All rights reserved.
          </p>
          <div className="flex items-center">
            <span className="text-neutral-500 text-sm mr-4">Payment Partners:</span>
            <div className="flex space-x-3">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px" className="text-neutral-400">
                <path fill="currentColor" d="M32 10A14 14 0 1 0 32 38A14 14 0 1 0 32 10Z" />
                <path fill="currentColor" d="M16 10A14 14 0 1 0 16 38A14 14 0 1 0 16 10Z" />
                <path fill="#323232" d="M18,24c0,4.755,2.376,8.95,6,11.48c3.624-2.53,6-6.725,6-11.48s-2.376-8.95-6-11.48 C20.376,15.05,18,19.245,18,24z" />
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px" className="text-neutral-400">
                <path fill="currentColor" d="M45,35c0,2.209-1.791,4-4,4H7c-2.209,0-4-1.791-4-4V13c0-2.209,1.791-4,4-4h34c2.209,0,4,1.791,4,4V35z" />
                <path fill="#323232" d="M15.186 19l-2.626 7.832c0 0-.667-3.313-.733-3.729-1.495-3.411-3.701-3.221-3.701-3.221L10.726 30v-.002h3.161L18.258 19H15.186zM17.689 30L20.56 30 22.296 19 19.389 19zM38.008 19h-3.021l-4.71 11h2.852l.588-1.571h3.596L37.619 30h2.613L38.008 19zM34.513 26.328l1.563-4.157.818 4.157H34.513zM26.369 22.206c0-.606.498-1.057 1.926-1.057.928 0 1.991.177 1.991.177l.466-2.242c0 0-1.358-.515-2.691-.515-3.019 0-4.576 1.444-4.576 3.272 0 3.306 3.979 2.853 3.979 4.551 0 .291-.186.964-1.907.964-1.523 0-2.932-.485-2.932-.485L22.111 29c0 0 1.394.583 3.08.583 1.865 0 4.675-1.343 4.675-3.513C29.867 23.175 26.369 23.549 26.369 22.206z" />
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px" className="text-neutral-400">
                <path fill="currentColor" d="M45,35c0,2.2-1.8,4-4,4H7c-2.2,0-4-1.8-4-4V13c0-2.2,1.8-4,4-4h34c2.2,0,4,1.8,4,4V35z" />
                <path fill="#323232" d="M19.8,18.2v9.5h-3.7v-9.5H19.8 M20.8,15.2h-5.6c-0.6,0-1.1,0.5-1.1,1.1v13.4c0,0.6,0.5,1.1,1.1,1.1h5.6c0.6,0,1.1-0.5,1.1-1.1 V16.3C21.9,15.7,21.4,15.2,20.8,15.2L20.8,15.2z" />
                <path fill="#323232" d="M31.9,18.2v9.5h-3.7v-9.5H31.9 M33.7,15.2h-7.4c-0.6,0-1.1,0.5-1.1,1.1v13.4c0,0.6,0.5,1.1,1.1,1.1h7.4c0.6,0,1.1-0.5,1.1-1.1 V16.3C34.8,15.7,34.3,15.2,33.7,15.2L33.7,15.2z" />
                <path fill="#323232" d="M32.4 22.3h-4.7v-0.6h4.7V22.3z" />
                <path fill="#323232" d="M32.4 23.9h-4.7v-0.6h4.7V23.9z" />
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px" className="text-neutral-400">
                <path fill="currentColor" d="M28.9,11.9H18.3l-1.2,7.9h3.9c1.7-0.1,2.8,0.4,3.2,1.5c0.4,1,0.3,2.2-0.4,3c-0.7,0.8-1.7,1.4-3.1,1.4 c-1.6,0-3.3-1-3.4-2.6h-4.1c0.1,1.3,0.6,2.5,1.5,3.5c1.2,1.3,3,2.1,5.1,2.2c2.1,0.1,3.9-0.6,5.1-1.8c1.2-1.1,1.9-2.6,1.9-4.1 c0-0.6-0.1-1.1-0.2-1.6c-0.3-1.3-1-2.3-2-2.9c-1-0.6-2.4-0.9-4.1-0.9h-1.3l0.4-2.7h8.2V11.9z M37.4,37.9H10.6c-3.1,0-5.6-2.5-5.6-5.6 V15.6c0-3.1,2.5-5.6,5.6-5.6h26.9c3.1,0,5.6,2.5,5.6,5.6v16.7C43,35.4,40.5,37.9,37.4,37.9z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
