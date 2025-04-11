import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { BlogPost } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";

const BlogDetailPage = () => {
  const [match, params] = useRoute<{ id: string }>("/blog/:id");
  const blogId = params?.id ? parseInt(params.id) : 0;

  const { data: blogPost, isLoading, error } = useQuery<BlogPost>({
    queryKey: [`/api/blogs/${blogId}`],
    enabled: !!blogId,
  });

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  // Format date to readable string
  const formatDate = (dateString?: string | Date | null) => {
    if (!dateString) return "";
    return format(new Date(dateString), 'MMMM d, yyyy');
  };

  // Share blog post functionality
  const shareBlogPost = () => {
    if (navigator.share) {
      navigator.share({
        title: blogPost?.title,
        text: blogPost?.excerpt,
        url: window.location.href,
      })
      .catch(error => console.log('Error sharing:', error));
    } else {
      // Fallback for browsers that don't support navigator.share
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('Link copied to clipboard!'))
        .catch(error => console.log('Error copying to clipboard:', error));
    }
  };

  return (
    <>
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="text-center py-20">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
              <p className="mt-4">Loading article...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20 text-red-500">
              <p>Error loading article. Please try again later.</p>
            </div>
          ) : blogPost ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                  {/* Featured Image */}
                  <img 
                    src={blogPost.image} 
                    alt={blogPost.title} 
                    className="w-full h-80 object-cover"
                  />

                  {/* Blog Content */}
                  <div className="p-8">
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <span>
                        <i className="far fa-calendar-alt mr-2"></i>
                        {formatDate(blogPost.createdAt)}
                      </span>
                      <span className="mx-3">•</span>
                      <span>
                        <i className="far fa-user mr-2"></i>
                        {blogPost.author}
                      </span>
                    </div>

                    <h1 className="text-3xl font-bold mb-6">{blogPost.title}</h1>
                    
                    <div className="prose prose-lg max-w-none">
                      <p className="lead text-lg text-gray-600 mb-6">{blogPost.excerpt}</p>
                      
                      <div className="whitespace-pre-line">
                        {blogPost.content.split('\n\n').map((paragraph, i) => (
                          <p key={i} className="mb-4">{paragraph}</p>
                        ))}
                      </div>
                    </div>
                    
                    <Separator className="my-8" />
                    
                    {/* Share Links */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="mr-4">Share:</span>
                        <div className="flex space-x-3">
                          <Button variant="ghost" size="sm" onClick={shareBlogPost}>
                            <i className="fab fa-facebook-f text-primary"></i>
                          </Button>
                          <Button variant="ghost" size="sm" onClick={shareBlogPost}>
                            <i className="fab fa-twitter text-primary"></i>
                          </Button>
                          <Button variant="ghost" size="sm" onClick={shareBlogPost}>
                            <i className="fab fa-linkedin-in text-primary"></i>
                          </Button>
                          <Button variant="ghost" size="sm" onClick={shareBlogPost}>
                            <i className="fas fa-link text-primary"></i>
                          </Button>
                        </div>
                      </div>
                      
                      <Link href="/blog">
                        <Button variant="outline">
                          <i className="fas fa-arrow-left mr-2"></i> Back to Articles
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold mb-4">Article Not Found</h2>
              <p className="text-gray-600 mb-6">The article you're looking for doesn't exist or has been removed.</p>
              <Button asChild className="bg-primary">
                <Link href="/blog">Browse All Articles</Link>
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default BlogDetailPage;
