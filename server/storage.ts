import bcrypt from 'bcrypt';
import { User, InsertUser } from "@shared/schema";
import { 
  properties, blogPosts, messages, testimonials,
  type Message, type InsertMessage,
  type Testimonial, type InsertTestimonial
} from "@shared/schema";

// Types
export interface Property {
  id: number;
  title: string;
  description: string;
  price: number;
  location: string;
  size: number;
  sizeUnit: string;
  features: string[];
  images: string[];
  videoUrl: string;
  isFeatured: boolean;
  propertyType: string;
  createdAt: Date;
}

export interface BlogPost {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  image: string;
  createdAt: Date;
}

export interface InsertProperty extends Omit<Property, 'id' | 'createdAt'> {}
export interface InsertBlogPost extends Omit<BlogPost, 'id' | 'createdAt'> {}

// Storage interface
interface Storage {
  getProperties(): Property[];
  getProperty(id: number): Property | undefined;
  getBlogs(): BlogPost[];
  getBlog(id: number): BlogPost | undefined;
}

export class MemStorage implements Storage {
  private users: Map<number, User>;
  private properties: Map<number, Property>;
  private blogPosts: Map<number, BlogPost>;
  private messages: Map<number, Message>;
  private testimonials: Map<number, Testimonial>;
  
  private userCurrentId: number;
  private propertyCurrentId: number;
  private blogPostCurrentId: number;
  private messageCurrentId: number;
  private testimonialCurrentId: number;

  constructor() {
    this.users = new Map();
    this.properties = new Map();
    this.blogPosts = new Map();
    this.messages = new Map();
    this.testimonials = new Map();
    
    this.userCurrentId = 1;
    this.propertyCurrentId = 1;
    this.blogPostCurrentId = 1;
    this.messageCurrentId = 1;
    this.testimonialCurrentId = 1;
    
    // Initialize with admin user
    this.createUser({
      username: "admin",
      password: "Naina@32145" // Will be hashed in the createUser method
    });
    
    // Add sample data
    this.initializeSampleData();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    // Hash the password using bcrypt with a salt of 10 rounds
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    const user: User = { ...insertUser, password: hashedPassword, id };
    this.users.set(id, user);
    return user;
  }

  // Property methods
  async getAllProperties(): Promise<Property[]> {
    return Array.from(this.properties.values());
  }

  async getPropertyById(id: number): Promise<Property | undefined> {
    return this.properties.get(id);
  }

  async getPropertiesByType(type: string): Promise<Property[]> {
    return Array.from(this.properties.values()).filter(
      (property) => property.propertyType === type
    );
  }

  async getFeaturedProperties(): Promise<Property[]> {
    return Array.from(this.properties.values()).filter(
      (property) => property.isFeatured
    );
  }

  async createProperty(insertProperty: InsertProperty): Promise<Property> {
    const id = this.propertyCurrentId++;
    const timestamp = new Date();
    const property: Property = { 
      ...insertProperty, 
      id, 
      createdAt: timestamp, 
      sizeUnit: insertProperty.sizeUnit || "", // Ensure sizeUnit is a string
      features: insertProperty.features || [], // Ensure features is an array
      images: insertProperty.images || [], // Ensure images is an array
      videoUrl: insertProperty.videoUrl || "", // Ensure videoUrl is a string
      isFeatured: insertProperty.isFeatured || false // Ensure isFeatured is a boolean
    };
    this.properties.set(id, property);
    return property;
  }

  async updateProperty(id: number, updateData: Partial<InsertProperty>): Promise<Property | undefined> {
    const property = this.properties.get(id);
    if (!property) return undefined;
    
    const updatedProperty = { ...property, ...updateData };
    this.properties.set(id, updatedProperty);
    return updatedProperty;
  }

  async deleteProperty(id: number): Promise<boolean> {
    return this.properties.delete(id);
  }

  // Blog methods
  async getAllBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values());
  }

  async getBlogPostById(id: number): Promise<BlogPost | undefined> {
    return this.blogPosts.get(id);
  }

  async createBlogPost(insertBlogPost: InsertBlogPost): Promise<BlogPost> {
    const id = this.blogPostCurrentId++;
    const timestamp = new Date();
    const blogPost: BlogPost = { ...insertBlogPost, id, createdAt: timestamp };
    this.blogPosts.set(id, blogPost);
    return blogPost;
  }

  async updateBlogPost(id: number, updateData: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const blogPost = this.blogPosts.get(id);
    if (!blogPost) return undefined;
    
    const updatedBlogPost = { ...blogPost, ...updateData };
    this.blogPosts.set(id, updatedBlogPost);
    return updatedBlogPost;
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    return this.blogPosts.delete(id);
  }

  // Message methods
  async getAllMessages(): Promise<Message[]> {
    return Array.from(this.messages.values());
  }

  async getMessageById(id: number): Promise<Message | undefined> {
    return this.messages.get(id);
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.messageCurrentId++;
    const timestamp = new Date();
    const message: Message = { ...insertMessage, id, isRead: false, createdAt: timestamp };
    this.messages.set(id, message);
    return message;
  }

  async updateMessageReadStatus(id: number, isRead: boolean): Promise<Message | undefined> {
    const message = this.messages.get(id);
    if (!message) return undefined;
    
    const updatedMessage = { ...message, isRead };
    this.messages.set(id, updatedMessage);
    return updatedMessage;
  }

  async deleteMessage(id: number): Promise<boolean> {
    return this.messages.delete(id);
  }

  // Testimonial methods
  async getAllTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values());
  }

  async getTestimonialById(id: number): Promise<Testimonial | undefined> {
    return this.testimonials.get(id);
  }

  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const id = this.testimonialCurrentId++;
    const testimonial: Testimonial = { 
      ...insertTestimonial, 
      id,
      image: insertTestimonial.image || null // Ensure image is string | null
    };
    this.testimonials.set(id, testimonial);
    return testimonial;
  }

  async updateTestimonial(id: number, updateData: Partial<InsertTestimonial>): Promise<Testimonial | undefined> {
    const testimonial = this.testimonials.get(id);
    if (!testimonial) return undefined;
    
    const updatedTestimonial = { ...testimonial, ...updateData };
    this.testimonials.set(id, updatedTestimonial);
    return updatedTestimonial;
  }

  async deleteTestimonial(id: number): Promise<boolean> {
    return this.testimonials.delete(id);
  }

  // Initialize with sample data
  private initializeSampleData() {
    // Sample properties
    const properties: InsertProperty[] = [
      {
        title: "48 Guntha Land in Nadhal, Khalapur ₹6.5 Lakh/Guntha",
        description: "Presenting a 48 Guntha land parcel for sale in Nadhal, Khalapur at just ₹6.5 lakh per guntha — an excellent opportunity under the MSRDC Smart City Development Plan. Strategically located just 10 km from the Mumbai-Pune Expressway and 23 km from the upcoming Navi Mumbai International Airport, this property offers unbeatable connectivity and immense future value. Surrounded by mega infrastructure projects like the JNPT Chowk Road expansion and the Virar-Alibaug Multimodal Corridor, the land is in close proximity to major residential and commercial zones including Godrej Township, Hiranandani Fortune City, L&T Depot, and SCMS Institute. With clear title, single ownership, and an FSI of 0.15 in an eco-sensitive Matheran buffer zone, this land is perfect for low-density residential plotting, a weekend bungalow, boutique resort, or long-term investment. The MSRDC Smart City plan ensures planned development, which adds to the appreciation potential of this strategically located parcel. Whether you're an investor, developer, or end-user, this land in Khalapur promises strong ROI and green living near one of Maharashtra's fastest-developing corridors.",
        price: 31200000,
        location: "Nadhal, Khalapur, Maharashtra",
        size: 48,
        sizeUnit: "Guntha",
        features: ["MSRDC Smart City Zone", "FSI 0.15 (Eco-sensitive zone)", "Clear Title", "Single Owner", "10 km from Mumbai-Pune Expressway", "23 km from Navi Mumbai Airport", "Surrounded by major infrastructure projects"],
        images: ["https://img.youtube.com/vi/8AB-0F_hTmQ/maxresdefault.jpg"],
        videoUrl: "https://www.youtube.com/watch?v=8AB-0F_hTmQ&t=17s",
        isFeatured: true,
        propertyType: "Land"
      }
    ];

    // Sample blog posts
    const blogPosts: InsertBlogPost[] = [
      {
        title: "The Best Time to Buy a Plot in Karjat? Right Now – Here's Why!",
        content: `Karjat, nestled in the lush green belt of the Western Ghats in Maharashtra, has quickly emerged as a favorite among real estate investors and nature lovers alike. Known for its scenic beauty and increasing urban connectivity, this quiet town is now witnessing a steady boom in real estate interest. If you're wondering when the best time to buy a plot in Karjat is, the answer is clear: Right now. Let's dive into the reasons why 2025 might be your golden opportunity.

Property Prices Are Still Affordable
Compared to neighboring tourist destinations like Lonavala and Alibaug, property rates in Karjat remain relatively low. As of early 2025, Karjat plot rates can start from ₹250 per sq. ft. and average around ₹4,556 per sq. ft., making it one of the most affordable investment destinations in the region. This price range is expected to rise significantly with increasing interest and infrastructure development, which makes now the perfect entry point for buyers.

Soaring Demand for Second Homes and Rentals
As remote work culture grows and urban stress pushes families to seek peaceful weekend getaways, Karjat has seen a surge in demand for second homes. The location's natural tranquility, waterfalls, and trekking trails make it a prime spot for vacation rentals and homestays. This not only offers lifestyle value but also great rental income potential for plot owners who choose to build.

Improved Connectivity and Infrastructure Expansion
Karjat's connectivity has been a major driver of its real estate growth. With the Karjat-Panvel railway corridor, Mumbai-Pune Expressway access, and ongoing development of road infrastructure, reaching Karjat has never been easier. Proposed developments like the Karjat-Badlapur highway and better metro and train networks will further enhance its accessibility from major cities like Mumbai, Pune, and Navi Mumbai.

High Return on Investment
Karjat is considered one of the top emerging real estate destinations in Maharashtra. Plots purchased today are expected to appreciate in value significantly over the next few years. This appreciation is driven by growing demand, planned infrastructure, and increasing interest from investors across Mumbai Metropolitan Region (MMR).

Eco-Friendly and Sustainable Living Options
More buyers are prioritizing green living, and Karjat offers a perfect environment to embrace sustainability. Many plot buyers are building eco-homes with features like rainwater harvesting, solar panels, and organic farming—making the area not only attractive but also future-ready.

Conclusion:
From affordability and future growth to nature-rich surroundings and great connectivity, Karjat has everything a smart investor looks for. With the real estate buzz growing stronger each year, 2025 stands out as the best time to buy a plot in Karjat. Whether you're planning to build a weekend retreat, secure a long-term investment, or simply own a piece of paradise, the time to act is now.`,
        excerpt: "Learn why 2025 is the perfect time to invest in Karjat's booming real estate market.",
        author: "Arif Lalani",
        image: "https://images.unsplash.com/photo-1526948531399-320e7e40f0ca?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=800&q=80"
      },
      {
        title: "Don't Wait to Invest in Panvel: Prices Are Rising, and Here's the Proof",
        content: `The Rise of Panvel Real Estate

Panvel, once considered a quiet outskirt of Navi Mumbai, is now at the forefront of real estate growth. With the upcoming Navi Mumbai International Airport (NMIA), expanded infrastructure, and seamless connectivity, Panvel property price rise has caught the attention of savvy investors. If you're thinking of investing, waiting might cost you more than you think.

1. The Data Doesn't Lie: Panvel Property Price Rise in Numbers

Over the past five years, Panvel has experienced a steady uptick in real estate prices. According to property market analytics:

- Residential property rates have increased by 30% to 45% in select nodes
- Land rates near infrastructure projects have surged by up to 60%
- CIDCO-approved plots have witnessed massive appreciation due to clear titles and government backing

This price movement isn't speculative—it's proof of genuine, demand-driven growth.

2. Navi Mumbai International Airport: A Game-Changer

The NMIA is not just a transportation project—it's an economic catalyst. As construction progresses rapidly, developers and investors are positioning themselves around the airport's influence zone.

Proximity to an international airport has historically boosted property prices in surrounding areas. In Panvel's case, prices are already responding, and they are expected to double post-commissioning of NMIA.

3. CIDCO Projects and NAINA: Structured Growth, Not Speculation

The City and Industrial Development Corporation (CIDCO) has ensured planned urbanization through nodes, clear titles, and robust amenities. Combine that with NAINA (Navi Mumbai Airport Influence Notified Area), and you get well-planned zones set for futuristic living.

Properties under these frameworks offer lower legal risks and higher resale value, further fueling the Panvel property price rise.

4. Connectivity That Commands a Premium

Panvel boasts a unique convergence of:
- Mumbai-Pune Expressway
- Sion-Panvel Expressway
- Panvel Railway Station (Mumbai-Goa Route)
- Upcoming Mumbai Trans-Harbour Link (MTHL)

This superior connectivity reduces travel time to South Mumbai, Pune, and upcoming economic hubs, making Panvel ideal for both living and investment.

5. Affordability Today, Appreciation Tomorrow

Compared to saturated markets like Bandra, Powai, or even Vashi, Panvel remains relatively affordable. A 2BHK apartment that may cost ₹45–60 lakhs today could be valued at ₹80–90 lakhs in 3–5 years, as demand and development accelerate.

This is a rare phase when the prices are still within reach but climbing fast—making now the smartest time to invest.

Final Thoughts: Don't Regret Not Investing Earlier

If you're still contemplating, remember—every booming property location was once an underdog. Panvel is no longer the future—it's the present. The ongoing Panvel property price rise is backed by data, development, and demand.

Delaying your investment could mean entering at a much higher price point. The best time to plant a tree was 20 years ago—the second-best time is now.`,
        excerpt: "Explore why Panvel is quickly becoming a top investment hotspot, and how current price trends signal a great time to buy.",
        author: "Arif Lalani",
        image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=800&q=80"
      }
    ];

    // Add properties
    properties.forEach(property => {
      const id = this.propertyCurrentId++;
      const timestamp = new Date();
      const newProperty: Property = { 
        ...property, 
        id, 
        createdAt: timestamp,
        sizeUnit: property.sizeUnit || "",
        features: property.features || [],
        images: property.images || [],
        videoUrl: property.videoUrl || "",
        isFeatured: property.isFeatured || false
      };
      this.properties.set(id, newProperty);
    });

    // Add blog posts
    blogPosts.forEach(post => {
      const id = this.blogPostCurrentId++;
      const timestamp = new Date();
      const newPost: BlogPost = { ...post, id, createdAt: timestamp };
      this.blogPosts.set(id, newPost);
    });

    // Sample testimonials
    const sampleTestimonials: InsertTestimonial[] = [
      {
        name: "Rajesh Kumar",
        location: "Mumbai",
        message: "Nainaland Deals helped me find the perfect plot for my dream home. Their expertise in the local market and transparent approach made the entire process smooth and hassle-free.",
        rating: 5,
        image: "https://randomuser.me/api/portraits/men/1.jpg"
      },
      {
        name: "Priya Sharma",
        location: "Pune",
        message: "I was looking to invest in land property, and Nainaland Deals provided excellent guidance. They understood my requirements perfectly and found me a great investment opportunity.",
        rating: 5,
        image: "https://randomuser.me/api/portraits/women/1.jpg"
      },
      {
        name: "Amit Patel",
        location: "Navi Mumbai",
        message: "The team at Nainaland Deals is highly professional and knowledgeable. They helped me navigate through various options and made sure I got the best deal for my investment.",
        rating: 4,
        image: "https://randomuser.me/api/portraits/men/2.jpg"
      }
    ];

    // Add sample testimonials
    sampleTestimonials.forEach(testimonial => {
      const id = this.testimonialCurrentId++;
      this.testimonials.set(id, { 
        ...testimonial, 
        id,
        image: testimonial.image || null // Ensure image is string | null
      });
    });
  }

  getProperties(): Property[] {
    return Array.from(this.properties.values());
  }

  getProperty(id: number): Property | undefined {
    return this.properties.get(id);
  }

  getBlogs(): BlogPost[] {
    return Array.from(this.blogPosts.values());
  }

  getBlog(id: number): BlogPost | undefined {
    return this.blogPosts.get(id);
  }
}

export const storage = new MemStorage();
