import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PropertyCard from "@/components/ui/property-card";
import { Property } from "@shared/schema";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const PropertiesPage = () => {
  const [location] = useLocation();
  const params = new URLSearchParams(location.split('?')[1]);
  
  const [filters, setFilters] = useState({
    location: "Any Location",
    searchTerm: ""
  });
  
  const { data: properties, isLoading, error } = useQuery<Property[]>({
    queryKey: ['/api/properties'],
  });
  
  // Filter properties based on selected filters
  const filteredProperties = properties?.filter(property => {
    // Filter by location (if not "Any Location")
    if (filters.location !== "Any Location" && !property.location.includes(filters.location)) {
      return false;
    }
    
    // Filter by search term (title only)
    if (filters.searchTerm && !property.title.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  // Update filters
  const handleLocationChange = (value: string) => {
    setFilters({...filters, location: value});
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({...filters, searchTerm: e.target.value});
  };
  
  const resetFilters = () => {
    setFilters({
      location: "Any Location",
      searchTerm: ""
    });
  };

  return (
    <>
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Discover Your Perfect Land</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Browse our extensive portfolio of premium land properties and find the perfect investment opportunity.
            </p>
          </div>
          
          {/* Search and Filter Section */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">Search by Title</label>
                <Input 
                  type="text" 
                  placeholder="Search property titles..." 
                  value={filters.searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <Select 
                  value={filters.location} 
                  onValueChange={handleLocationChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Any Location">Any Location</SelectItem>
                    <SelectItem value="Panvel">Panvel</SelectItem>
                    <SelectItem value="Kanvel">Kanvel</SelectItem>
                    <SelectItem value="Kharjot">Kharjot</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button variant="outline" onClick={resetFilters}>
                Reset Filters
              </Button>
            </div>
          </div>
          
          {/* Property Listings */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">
              {isLoading ? "Loading properties..." : 
               filteredProperties?.length ? `${filteredProperties.length} Properties Found` : 
               "No properties match your criteria"}
            </h2>
            
            {error && (
              <div className="text-red-500 text-center py-4">
                Error loading properties. Please try again later.
              </div>
            )}
            
            {!isLoading && !error && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProperties?.map(property => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default PropertiesPage;
