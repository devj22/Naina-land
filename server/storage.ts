import { 
  users, properties, blogPosts, messages, testimonials,
  type User, type InsertUser, 
  type Property, type InsertProperty,
  type BlogPost, type InsertBlogPost,
  type Message, type InsertMessage,
  type Testimonial, type InsertTestimonial
} from "@shared/schema";
import bcrypt from 'bcrypt';

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Property methods
  getAllProperties(): Promise<Property[]>;
  getPropertyById(id: number): Promise<Property | undefined>;
  getPropertiesByType(type: string): Promise<Property[]>;
  getFeaturedProperties(): Promise<Property[]>;
  createProperty(property: InsertProperty): Promise<Property>;
  updateProperty(id: number, property: Partial<InsertProperty>): Promise<Property | undefined>;
  deleteProperty(id: number): Promise<boolean>;
  
  // Blog methods
  getAllBlogPosts(): Promise<BlogPost[]>;
  getBlogPostById(id: number): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: number): Promise<boolean>;
  
  // Message methods
  getAllMessages(): Promise<Message[]>;
  getMessageById(id: number): Promise<Message | undefined>;
  createMessage(message: InsertMessage): Promise<Message>;
  updateMessageReadStatus(id: number, isRead: boolean): Promise<Message | undefined>;
  deleteMessage(id: number): Promise<boolean>;
  
  // Testimonial methods
  getAllTestimonials(): Promise<Testimonial[]>;
  getTestimonialById(id: number): Promise<Testimonial | undefined>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  updateTestimonial(id: number, testimonial: Partial<InsertTestimonial>): Promise<Testimonial | undefined>;
  deleteTestimonial(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
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
      image: insertTestimonial.image || "" // Ensure image is a string
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
        title: "CIDCO Approved Final Plot for Sale in TPS 10, Panvel – 101 Guntha (FSI 2.5) | Near Navi Mumbai Airport",
        description: "Own a CIDCO-approved plot in TPS 10, Panvel under NAINA. Final developed plot of 101 Guntha with 2.5 FSI. Located near Navi Mumbai International Airport. Great for investors & developers. Infrastructure by CIDCO under progress. Limited opportunity.",
        price: 12000000,
        location: "TPS 10, Panvel (NAINA Development Zone)",
        size: 254.5,
        sizeUnit: "Guntha",
        features: ["101 Guntha Final Plot under TPS 10", "CIDCO APPROVED"],
        images: ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80"],
        videoUrl: "https://youtu.be/LBBQJdUt0lA?si=xkusBVhJLBbstf6q",
        isFeatured: true,
        propertyType: "Land"
      },
      // {
      //   title: "Fertile Agricultural Land",
      //   description: "Fertile land suitable for various crops with good water source.",
      //   price: 9000000,
      //   location: "Srirangapatna, Mysore",
      //   size: 2,
      //   sizeUnit: "Acres",
      //   features: ["Borewell", "Fertile Soil", "Road Access"],
      //   images: ["https://images.unsplash.com/photo-1628744404730-5e143358539b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80"],
      //   videoUrl: "https://www.youtube.com/watch?si=QBkMVQVIKhLJcPiw&v=ycRY-EtA_y0&feature=youtu.be",
      //   isFeatured: false,
      //   propertyType: "Agricultural"
      // },
      // {
      //   title: "Commercial Land",
      //   description: "Prime commercial land suitable for business development.",
      //   price: 35000000,
      //   location: "Gachibowli, Hyderabad",
      //   size: 40,
      //   sizeUnit: "Guntha",
      //   features: ["Highway Access", "Commercial Zone", "Prime Location"],
      //   images: ["https://images.unsplash.com/photo-1628624747186-a941c476b7ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80"],
      //   isFeatured: false,
      //   propertyType: "Commercial"
      // },
      // {
      //   title: "Prime Corner Plot",
      //   description: "East-facing corner plot in a developing residential area.",
      //   price: 8500000,
      //   location: "Sholinganallur, Chennai",
      //   size: 12,
      //   sizeUnit: "Guntha",
      //   features: ["Corner Plot", "East Facing", "Residential Area"],
      //   images: ["https://images.unsplash.com/photo-1531971589569-0d9370cbe1e5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80"],
      //   isFeatured: false,
      //   propertyType: "Residential"
      // },
      // {
      //   title: "Gated Community Plot",
      //   description: "Premium plot in a gated community with all amenities.",
      //   price: 15000000,
      //   location: "Whitefield, Bangalore",
      //   size: 15,
      //   sizeUnit: "Guntha",
      //   features: ["Gated", "Park View", "24/7 Security"],
      //   images: ["https://images.unsplash.com/photo-1602941525421-8f8b81d3edbb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80"],
      //   isFeatured: true,
      //   propertyType: "Residential"
      // },
      // {
      //   title: "Premium Farmland",
      //   description: "Beautiful farmland with hill view and natural water source.",
      //   price: 7500000,
      //   location: "Devanahalli, Bangalore",
      //   size: 1,
      //   sizeUnit: "Acres",
      //   features: ["Water Source", "Hill View", "Farmhouse Permitted"],
      //   images: ["https://images.unsplash.com/photo-1543746379-c5d6bc868f57?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80"],
      //   isFeatured: false,
      //   propertyType: "Agricultural"
      // }
    ];

    // Sample blog posts
    const blogPosts: InsertBlogPost[] = [
      {
        title: "The Best Time to Buy a Plot in Karjat? Right Now – Here's Why!",
        content: `Karjat, nestled in the lush green belt of the Western Ghats in Maharashtra, has quickly emerged as a favorite among real estate investors and nature lovers alike. Known for its scenic beauty and increasing urban connectivity, this quiet town is now witnessing a steady boom in real estate interest. If you're wondering when the best time to buy a plot in Karjat is, the answer is clear: Right now. Let's dive into the reasons why 2025 might be your golden opportunity.

## Property Prices Are Still Affordable

Compared to neighboring tourist destinations like Lonavala and Alibaug, property rates in Karjat remain relatively low. As of early 2025, Karjat plot rates can start from ₹250 per sq. ft. and average around ₹4,556 per sq. ft., making it one of the most affordable investment destinations in the region. This price range is expected to rise significantly with increasing interest and infrastructure development, which makes now the perfect entry point for buyers.

## Soaring Demand for Second Homes and Rentals

As remote work culture grows and urban stress pushes families to seek peaceful weekend getaways, Karjat has seen a surge in demand for second homes. The location's natural tranquility, waterfalls, and trekking trails make it a prime spot for vacation rentals and homestays. This not only offers lifestyle value but also great rental income potential for plot owners who choose to build.

## Improved Connectivity and Infrastructure Expansion

Karjat's connectivity has been a major driver of its real estate growth. With the Karjat-Panvel railway corridor, Mumbai-Pune Expressway access, and ongoing development of road infrastructure, reaching Karjat has never been easier. Proposed developments like the Karjat-Badlapur highway and better metro and train networks will further enhance its accessibility from major cities like Mumbai, Pune, and Navi Mumbai.

## High Return on Investment

Karjat is considered one of the top emerging real estate destinations in Maharashtra. Plots purchased today are expected to appreciate in value significantly over the next few years. This appreciation is driven by growing demand, planned infrastructure, and increasing interest from investors across Mumbai Metropolitan Region (MMR).

## Eco-Friendly and Sustainable Living Options

More buyers are prioritizing green living, and Karjat offers a perfect environment to embrace sustainability. Many plot buyers are building eco-homes with features like rainwater harvesting, solar panels, and organic farming—making the area not only attractive but also future-ready.

**Conclusion:**  
From affordability and future growth to nature-rich surroundings and great connectivity, Karjat has everything a smart investor looks for. With the real estate buzz growing stronger each year, 2025 stands out as the best time to buy a plot in Karjat. Whether you're planning to build a weekend retreat, secure a long-term investment, or simply own a piece of paradise, the time to act is now.
  `,
        excerpt: "Learn the essential factors you should evaluate before making a land investment to ensure maximum returns.",
        author: "Arif Lalani",
        image: "https://images.unsplash.com/photo-1542879379-a2761ec6d9b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80"
      },
      {
        title: "Don't Wait to Invest in Panvel: Prices Are Rising, and Here's the Proof",
        content: `
      ## The Rise of Panvel Real Estate
      
      Panvel, once considered a quiet outskirt of Navi Mumbai, is now at the forefront of real estate growth. With the upcoming Navi Mumbai International Airport (NMIA), expanded infrastructure, and seamless connectivity, Panvel property price rise has caught the attention of savvy investors. If you're thinking of investing, waiting might cost you more than you think.
      
      ## 1. The Data Doesn't Lie: Panvel Property Price Rise in Numbers
      
      Over the past five years, Panvel has experienced a steady uptick in real estate prices. According to property market analytics:
      
      - Residential property rates have increased by **30% to 45%** in select nodes.  
      - Land rates near infrastructure projects have surged by **up to 60%**.  
      - **CIDCO-approved plots** have witnessed massive appreciation due to clear titles and government backing.  
      
      This price movement isn't speculative—it's proof of genuine, demand-driven growth.
      
      ## 2. Navi Mumbai International Airport: A Game-Changer
      
      The NMIA is not just a transportation project—it's an economic catalyst. As construction progresses rapidly, developers and investors are positioning themselves around the airport's influence zone.
      
      Proximity to an international airport has historically boosted property prices in surrounding areas. In Panvel's case, prices are already responding, and they are expected to **double post-commissioning** of NMIA.
      
      ## 3. CIDCO Projects and NAINA: Structured Growth, Not Speculation
      
      The City and Industrial Development Corporation (CIDCO) has ensured planned urbanization through nodes, clear titles, and robust amenities. Combine that with **NAINA** (Navi Mumbai Airport Influence Notified Area), and you get well-planned zones set for futuristic living.
      
      Properties under these frameworks offer **lower legal risks and higher resale value**, further fueling the Panvel property price rise.
      
      ## 4. Connectivity That Commands a Premium
      
      Panvel boasts a unique convergence of:
      
      - **Mumbai-Pune Expressway**  
      - **Sion-Panvel Expressway**  
      - **Panvel Railway Station** (Mumbai-Goa Route)  
      - **Upcoming Mumbai Trans-Harbour Link (MTHL)**  
      
      This superior connectivity reduces travel time to South Mumbai, Pune, and upcoming economic hubs, making Panvel ideal for both living and investment.
      
      ## 5. Affordability Today, Appreciation Tomorrow
      
      Compared to saturated markets like Bandra, Powai, or even Vashi, Panvel remains relatively affordable. A **2BHK apartment that may cost ₹45–60 lakhs today could be valued at ₹80–90 lakhs** in 3–5 years, as demand and development accelerate.
      
      This is a rare phase when the prices are still within reach but climbing fast—making now the smartest time to invest.
      
      ## 6. Testimonials & Trends from Investors
      
      Investors who've bought plots or flats in Panvel just 2-3 years ago are already seeing **ROI upwards of 25%**. Many are now reinvesting in CIDCO-approved layouts and projects near the airport site.
      
      Brokers and market analysts are calling Panvel the next **"investment goldmine"**, and the consistent upward trend supports that label.
      
      ## Final Thoughts: Don't Regret Not Investing Earlier
      
      If you're still contemplating, remember—every booming property location was once an underdog. Panvel is no longer the future—it's the present. The ongoing Panvel property price rise is backed by **data, development, and demand**.
      
      Delaying your investment could mean entering at a much higher price point. The best time to plant a tree was 20 years ago—the second-best time is now.
        `,
        excerpt: "Explore why Panvel is quickly becoming a top investment hotspot, and how current price trends signal a great time to buy.",
        author: "Arif Lalani",
        image: "https://images.unsplash.com/photo-1526948531399-320e7e40f0ca?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80",
  
      }
      ,
      {
        title: "Land Value Trends to Watch in 2023",
        content: "Analysis of current land value trends across major Indian cities, future growth prospects, and recommendations for potential investors.",
        excerpt: "Explore the emerging trends in land values and discover which regions are experiencing the highest growth rates.",
        author: "Vikram Singh",
        image: "https://images.unsplash.com/photo-1594608661623-aa0bd3a69799?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80"
      }
    ];

    // Sample testimonials
    const testimonials: InsertTestimonial[] = [
      {
        name: "Rohit Sharma",
        location: "Navi Mumbai",
        message: "Nainaland Deals made my dream of owning a plot in Panvel come true. The team was professional, transparent, and very helpful throughout the process.",
        rating: 5,
        image: "https://upload.wikimedia.org/wikipedia/commons/9/93/Google_Contacts_icon.svg"
      },
      {
        name: "Priya Desai",
        location: "Pune",
        message: "I was nervous about legal issues, but Nainaland Deals handled everything smoothly. I bought land in Khalapur with complete confidence.",
        rating: 5,
        image: "https://upload.wikimedia.org/wikipedia/commons/9/93/Google_Contacts_icon.svg"
      },
      {
        name: " Vikram Joshi",
        location: "Thane",
        message: "Great experience! The team helped me find a great investment opportunity in Karjat. Highly recommend their services.",
        rating: 4.5,
        image: "https://upload.wikimedia.org/wikipedia/commons/9/93/Google_Contacts_icon.svg"
      }
    ];

    // Add properties
    properties.forEach(property => this.createProperty(property));
    
    // Add blog posts
    blogPosts.forEach(post => this.createBlogPost(post));
    
    // Add testimonials
    testimonials.forEach(testimonial => this.createTestimonial(testimonial));
  }
}

export const storage = new MemStorage();
