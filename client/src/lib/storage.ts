import { Property, BlogPost, Message, Testimonial } from "@shared/schema";
import { apiRequest } from "./queryClient";
import { getAuthHeader } from "./auth";

// Update Property type to allow price as a string with units
interface UpdatedProperty extends Omit<Property, 'price'> {
  youtubeVideo: string; // Add YouTube video link
}

// Set YouTube video URL for all properties
const youtubeVideoLink = "https://www.youtube.com/watch?si=QBkMVQVIKhLJcPiw&v=ycRY-EtA_y0&feature=youtu.be";

// Property storage operations
export const propertyStorage = {
  getAll: async (): Promise<UpdatedProperty[]> => {
    const response = await apiRequest("GET", "/api/properties");
    const properties = await response.json();
    return properties.map((property: UpdatedProperty) => ({ ...property, youtubeVideo: youtubeVideoLink }));
  },

  getById: async (id: number): Promise<UpdatedProperty> => {
    const response = await apiRequest("GET", `/api/properties/${id}`);
    const property = await response.json();
    return { ...property, youtubeVideo: youtubeVideoLink };
  },

  create: async (property: Omit<UpdatedProperty, "id" | "createdAt">): Promise<UpdatedProperty> => {
    const response = await apiRequest("POST", "/api/properties", { ...property, youtubeVideo: youtubeVideoLink, ...getAuthHeader() });
    return response.json();
  },

  update: async (id: number, property: Partial<UpdatedProperty>): Promise<UpdatedProperty> => {
    const response = await apiRequest("PUT", `/api/properties/${id}`, { ...property, youtubeVideo: youtubeVideoLink, ...getAuthHeader() });
    return response.json();
  },

  delete: async (id: number): Promise<void> => {
    await apiRequest("DELETE", `/api/properties/${id}`, getAuthHeader());
  }
};

// Blog post storage operations
export const blogStorage = {
  getAll: async (): Promise<BlogPost[]> => {
    const response = await apiRequest("GET", "/api/blogs");
    return response.json();
  },

  getById: async (id: number): Promise<BlogPost> => {
    const response = await apiRequest("GET", `/api/blogs/${id}`);
    return response.json();
  },

  create: async (blogPost: Omit<BlogPost, "id" | "createdAt">): Promise<BlogPost> => {
    const response = await apiRequest("POST", "/api/blogs", { ...blogPost, ...getAuthHeader() });
    return response.json();
  },

  update: async (id: number, blogPost: Partial<BlogPost>): Promise<BlogPost> => {
    const response = await apiRequest("PUT", `/api/blogs/${id}`, { ...blogPost, ...getAuthHeader() });
    return response.json();
  },

  delete: async (id: number): Promise<void> => {
    await apiRequest("DELETE", `/api/blogs/${id}`, getAuthHeader());
  }
};

// Message storage operations
export const messageStorage = {
  getAll: async (): Promise<Message[]> => {
    const response = await apiRequest("GET", "/api/messages", getAuthHeader());
    return response.json();
  },

  getById: async (id: number): Promise<Message> => {
    const response = await apiRequest("GET", `/api/messages/${id}`, getAuthHeader());
    return response.json();
  },

  create: async (message: Omit<Message, "id" | "isRead" | "createdAt">): Promise<Message> => {
    const response = await apiRequest("POST", "/api/messages", message);
    return response.json();
  },

  markAsRead: async (id: number): Promise<Message> => {
    const response = await apiRequest("PUT", `/api/messages/${id}/read`, getAuthHeader());
    return response.json();
  },

  delete: async (id: number): Promise<void> => {
    await apiRequest("DELETE", `/api/messages/${id}`, getAuthHeader());
  }
};

// Testimonial storage operations
export const testimonialStorage = {
  getAll: async (): Promise<Testimonial[]> => {
    const response = await apiRequest("GET", "/api/testimonials");
    return response.json();
  },

  getById: async (id: number): Promise<Testimonial> => {
    const response = await apiRequest("GET", `/api/testimonials/${id}`);
    return response.json();
  },

  create: async (testimonial: Omit<Testimonial, "id">): Promise<Testimonial> => {
    const response = await apiRequest("POST", "/api/testimonials", { ...testimonial, ...getAuthHeader() });
    return response.json();
  },

  update: async (id: number, testimonial: Partial<Testimonial>): Promise<Testimonial> => {
    const response = await apiRequest("PUT", `/api/testimonials/${id}`, { ...testimonial, ...getAuthHeader() });
    return response.json();
  },

  delete: async (id: number): Promise<void> => {
    await apiRequest("DELETE", `/api/testimonials/${id}`, getAuthHeader());
  }
}; 