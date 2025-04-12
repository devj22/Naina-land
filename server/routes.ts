import express, { type Express } from "express";
import type { Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertPropertySchema, 
  insertBlogPostSchema, 
  insertMessageSchema, 
  insertTestimonialSchema 
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes (prefix with /api)
  const apiRouter = express.Router();

  // Property routes
  apiRouter.get('/properties', async (req: Request, res: Response) => {
    try {
      const { type, featured } = req.query;
      
      let properties;
      if (type) {
        properties = await storage.getPropertiesByType(type as string);
      } else if (featured === 'true') {
        properties = await storage.getFeaturedProperties();
      } else {
        properties = await storage.getAllProperties();
      }
      
      res.json(properties);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch properties' });
    }
  });

  apiRouter.get('/properties/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const property = await storage.getPropertyById(id);
      
      if (!property) {
        return res.status(404).json({ message: 'Property not found' });
      }
      
      res.json(property);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch property' });
    }
  });

  // Blog routes
  apiRouter.get('/blogs', async (req: Request, res: Response) => {
    try {
      const blogs = await storage.getAllBlogPosts();
      res.json(blogs);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch blog posts' });
    }
  });

  apiRouter.get('/blogs/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const blog = await storage.getBlogPostById(id);
      
      if (!blog) {
        return res.status(404).json({ message: 'Blog post not found' });
      }
      
      res.json(blog);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch blog post' });
    }
  });

  // Testimonial routes
  apiRouter.get('/testimonials', async (req: Request, res: Response) => {
    try {
      const testimonials = await storage.getAllTestimonials();
      res.json(testimonials);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch testimonials' });
    }
  });

  apiRouter.get('/testimonials/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const testimonial = await storage.getTestimonialById(id);
      
      if (!testimonial) {
        return res.status(404).json({ message: 'Testimonial not found' });
      }
      
      res.json(testimonial);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch testimonial' });
    }
  });

  apiRouter.post('/testimonials', async (req: Request, res: Response) => {
    try {
      const testimonialData = insertTestimonialSchema.parse(req.body);
      const testimonial = await storage.createTestimonial(testimonialData);
      res.status(201).json(testimonial);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: 'Invalid testimonial data', errors: error.errors });
      } else {
        res.status(500).json({ message: 'Failed to create testimonial' });
      }
    }
  });

  apiRouter.put('/testimonials/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const testimonialData = insertTestimonialSchema.partial().parse(req.body);
      const testimonial = await storage.updateTestimonial(id, testimonialData);
      
      if (!testimonial) {
        return res.status(404).json({ message: 'Testimonial not found' });
      }
      
      res.json(testimonial);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: 'Invalid testimonial data', errors: error.errors });
      } else {
        res.status(500).json({ message: 'Failed to update testimonial' });
      }
    }
  });

  apiRouter.delete('/testimonials/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteTestimonial(id);
      
      if (!success) {
        return res.status(404).json({ message: 'Testimonial not found' });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete testimonial' });
    }
  });

  app.use('/api', apiRouter);

  const httpServer = createServer(app);
  return httpServer;
}
