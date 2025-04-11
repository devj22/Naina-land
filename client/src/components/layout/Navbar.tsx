import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <nav className="bg-white shadow-md fixed w-full z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-primary flex items-center">
              <img 
                src="https://i.ibb.co/0Rh8Z061/Whats-App-Image-2025-03-28-at-2-02-20-PM-removebg-preview-2.png" 
                alt="Nainaland Deals Logo" 
                className="h-10 mr-2" 
              />
              Nainaland Deals
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={toggleMobileMenu} className="text-neutral-dark focus:outline-none">
              <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
            </button>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link href="/" className={`font-medium ${isActive('/') ? 'text-primary border-b-2 border-primary' : 'hover:text-primary transition'}`}>
              Home
            </Link>
            <Link href="/properties" className={`font-medium ${isActive('/properties') ? 'text-primary border-b-2 border-primary' : 'hover:text-primary transition'}`}>
              Properties
            </Link>
            <Link href="/blog" className={`font-medium ${isActive('/blog') ? 'text-primary border-b-2 border-primary' : 'hover:text-primary transition'}`}>
              Blog
            </Link>
            <Link href="/faq" className="font-medium hover:text-primary transition">FAQ</Link>
            <a href="/#about" className="font-medium hover:text-primary transition">About Us</a>
            <a href="/#contact" className="font-medium hover:text-primary transition">Contact Us</a>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'} bg-white border-t`}>
        <div className="container mx-auto px-4 py-2 space-y-2">
          <Link href="/" onClick={closeMobileMenu} className={`block py-2 font-medium ${isActive('/') ? 'text-primary' : 'hover:text-primary transition'}`}>
            Home
          </Link>
          <Link href="/properties" onClick={closeMobileMenu} className={`block py-2 font-medium ${isActive('/properties') ? 'text-primary' : 'hover:text-primary transition'}`}>
            Properties
          </Link>
          <Link href="/blog" onClick={closeMobileMenu} className={`block py-2 font-medium ${isActive('/blog') ? 'text-primary' : 'hover:text-primary transition'}`}>
            Blog
          </Link>
          <Link href="/faq" onClick={closeMobileMenu} className="block py-2 font-medium hover:text-primary transition">FAQ</Link>
          <a href="/#about" onClick={closeMobileMenu} className="block py-2 font-medium hover:text-primary transition">About Us</a>
          <a href="/#contact" onClick={closeMobileMenu} className="block py-2 font-medium hover:text-primary transition">Contact Us</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
