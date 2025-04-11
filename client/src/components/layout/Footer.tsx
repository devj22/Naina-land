import { Link } from "wouter";

const Footer = () => {
  return (
    <footer className="bg-[#50312F] text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div>
            <h3 className="text-xl font-semibold mb-6">Nainaland Deals</h3>
            <p className="text-gray-300 mb-6">
            Your Trusted Partner in Land Property Investments
Delivering premium land opportunities in Panvel, Khalapur, Karjat, and beyond—since 2005.
With expert guidance and a commitment to transparency, we make land investment simple, secure, and rewarding.

            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition">Home</Link>
              </li>
              <li>
                <Link href="/properties" className="text-gray-300 hover:text-white transition">Properties</Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-300 hover:text-white transition">Blog</Link>
              </li>
              <li>
                <a href="/#about" className="text-gray-300 hover:text-white transition">About Us</a>
              </li>
              <li>
                <a href="/#contact" className="text-gray-300 hover:text-white transition">Contact Us</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-6">Contact Us</h3>
            <ul className="space-y-3">
              <li className="text-gray-300">
                Email: infonainaland@gmail.com
              </li>
              <li className="text-gray-300">
                Phone: +91 12345 67890
              </li>
              <li className="text-gray-300">
                Address: 123 Land St, Panvel, India
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-[#3C2523] pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} Nainaland Deals. All rights reserved.
            </p>
            <div className="flex space-x-4 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition">Privacy Policy</a>
              <a href="#" className="hover:text-white transition">Terms of Service</a>
              <a href="#" className="hover:text-white transition">Sitemap</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
