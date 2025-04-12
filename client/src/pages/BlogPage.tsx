import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BlogCard from "@/components/ui/blog-card";
import { BlogPost } from "@shared/schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const BlogPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: blogPosts, isLoading, error } = useQuery<BlogPost[]>({
    queryKey: ['/api/blogs'],
  });
  
  // Replace the first blog post with the new content
  const newBlogPost = {
    id: 1,
    title: "The Best Time to Buy a Plot in Karjat? Right Now – Here's Why!",
    excerpt: "Discover why 2025 is the ideal time to invest in Karjat plots. Learn about rising demand, infrastructure growth, and real estate trends.",
    content: `Karjat, nestled in the lush green belt of the Western Ghats in Maharashtra, has quickly emerged as a favorite among real estate investors and nature lovers alike. Known for its scenic beauty and increasing urban connectivity, this quiet town is now witnessing a steady boom in real estate interest. If you're wondering when the best time to buy a plot in Karjat is, the answer is clear: Right now. Let's dive into the reasons why 2025 might be your golden opportunity.

H2: Property Prices Are Still Affordable
Compared to neighboring tourist destinations like Lonavala and Alibaug, property rates in Karjat remain relatively low. As of early 2025, Karjat plot rates can start from ₹250 per sq. ft. and average around ₹4,556 per sq. ft., making it one of the most affordable investment destinations in the region (Source). This price range is expected to rise significantly with increasing interest and infrastructure development, which makes now the perfect entry point for buyers.

H2: Soaring Demand for Second Homes and Rentals
As remote work culture grows and urban stress pushes families to seek peaceful weekend getaways, Karjat has seen a surge in demand for second homes. The location's natural tranquility, waterfalls, and trekking trails make it a prime spot for vacation rentals and homestays. This not only offers lifestyle value but also great rental income potential for plot owners who choose to build.

H2: Improved Connectivity and Infrastructure Expansion
Karjat's connectivity has been a major driver of its real estate growth. With the Karjat-Panvel railway corridor, Mumbai-Pune Expressway access, and ongoing development of road infrastructure, reaching Karjat has never been easier. Proposed developments like the Karjat-Badlapur highway and better metro and train networks will further enhance its accessibility from major cities like Mumbai, Pune, and Navi Mumbai.

H2: High Return on Investment
Karjat is considered one of the top emerging real estate destinations in Maharashtra. Plots purchased today are expected to appreciate in value significantly over the next few years. This appreciation is driven by growing demand, planned infrastructure, and increasing interest from investors across Mumbai Metropolitan Region (MMR).

H2: Eco-Friendly and Sustainable Living Options
More buyers are prioritizing green living, and Karjat offers a perfect environment to embrace sustainability. Many plot buyers are building eco-homes with features like rainwater harvesting, solar panels, and organic farming—making the area not only attractive but also future-ready.

Conclusion:
From affordability and future growth to nature-rich surroundings and great connectivity, Karjat has everything a smart investor looks for. With the real estate buzz growing stronger each year, 2025 stands out as the best time to buy a plot in Karjat. Whether you're planning to build a weekend retreat, secure a long-term investment, or simply own a piece of paradise, the time to act is now.`,
    author: "Real Estate Expert",
    createdAt: new Date(),
    image: "https://example.com/image.jpg"
  };

  // Filter blog posts based on search term
  const filteredBlogPosts = blogPosts?.map((post, index) => index === 0 ? newBlogPost : post).filter(post => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      post.title.toLowerCase().includes(searchLower) ||
      post.excerpt.toLowerCase().includes(searchLower) ||
      post.author.toLowerCase().includes(searchLower)
    );
  });
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <>
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Blog Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Real Estate Insights & News</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Stay informed with our latest articles, guides, and market trends in the land property industry.
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="max-w-xl mx-auto mb-12">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-10 pr-12 py-3 w-full"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="fas fa-search text-gray-400"></i>
              </div>
              {searchTerm && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearSearch} 
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <i className="fas fa-times"></i>
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          {/* Blog Posts */}
          {isLoading ? (
            <div className="text-center py-20">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
              <p className="mt-4">Loading blog posts...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20 text-red-500">
              <p>Error loading blog posts. Please try again later.</p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-semibold">
                  {searchTerm ? `Search Results for "${searchTerm}"` : "Latest Articles"}
                </h2>
                {searchTerm && filteredBlogPosts && (
                  <p className="text-gray-600 mt-2">
                    {filteredBlogPosts.length} {filteredBlogPosts.length === 1 ? "result" : "results"} found
                  </p>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredBlogPosts && filteredBlogPosts.length > 0 ? (
                  filteredBlogPosts.map((post) => (
                    <BlogCard key={post.id} post={post} />
                  ))
                ) : (
                  <div className="col-span-3 text-center py-16 bg-white rounded-lg shadow-sm">
                    <i className="fas fa-search text-4xl text-gray-400 mb-4"></i>
                    <h3 className="text-xl font-semibold mb-2">No articles found</h3>
                    <p className="text-gray-500">
                      {searchTerm 
                        ? "Try searching with different keywords" 
                        : "No blog posts available at the moment"}
                    </p>
                    {searchTerm && (
                      <Button onClick={clearSearch} className="mt-4 bg-primary">
                        Clear Search
                      </Button>
                    )}
                  </div>
                )}
              </div>
              
              
              
              
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default BlogPage;
