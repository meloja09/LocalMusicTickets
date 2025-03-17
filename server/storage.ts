import { 
  User, InsertUser, 
  Artist, InsertArtist, 
  Venue, InsertVenue, 
  Concert, InsertConcert, 
  TicketType, InsertTicketType, 
  Order, InsertOrder, 
  OrderItem, InsertOrderItem,
  Category, InsertCategory
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

// modify the interface with any CRUD methods
// you might need
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  
  // Artist methods
  getArtist(id: number): Promise<Artist | undefined>;
  getArtists(): Promise<Artist[]>;
  getFeaturedArtists(limit?: number): Promise<Artist[]>;
  createArtist(artist: InsertArtist): Promise<Artist>;
  updateArtist(id: number, artist: Partial<Artist>): Promise<Artist | undefined>;
  deleteArtist(id: number): Promise<boolean>;
  
  // Venue methods
  getVenue(id: number): Promise<Venue | undefined>;
  getVenues(): Promise<Venue[]>;
  getTopVenues(limit?: number): Promise<Venue[]>;
  createVenue(venue: InsertVenue): Promise<Venue>;
  updateVenue(id: number, venue: Partial<Venue>): Promise<Venue | undefined>;
  deleteVenue(id: number): Promise<boolean>;
  
  // Concert methods
  getConcert(id: number): Promise<Concert | undefined>;
  getConcertWithDetails(id: number): Promise<any | undefined>;
  getConcerts(): Promise<Concert[]>;
  getFeaturedConcerts(limit?: number): Promise<any[]>;
  getUpcomingConcerts(limit?: number): Promise<any[]>;
  getConcertsByArtist(artistId: number): Promise<Concert[]>;
  getConcertsByVenue(venueId: number): Promise<Concert[]>;
  createConcert(concert: InsertConcert): Promise<Concert>;
  updateConcert(id: number, concert: Partial<Concert>): Promise<Concert | undefined>;
  deleteConcert(id: number): Promise<boolean>;
  
  // Ticket methods
  getTicketTypesByConcert(concertId: number): Promise<TicketType[]>;
  createTicketType(ticketType: InsertTicketType): Promise<TicketType>;
  updateTicketType(id: number, ticketType: Partial<TicketType>): Promise<TicketType | undefined>;
  deleteTicketType(id: number): Promise<boolean>;
  
  // Order methods
  getOrder(id: number): Promise<Order | undefined>;
  getOrdersByUser(userId: number): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  
  // OrderItem methods
  getOrderItemsByOrder(orderId: number): Promise<OrderItem[]>;
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;

  // Category methods
  getCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Session store
  sessionStore: any;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private artists: Map<number, Artist>;
  private venues: Map<number, Venue>;
  private concerts: Map<number, Concert>;
  private ticketTypes: Map<number, TicketType>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem>;
  private categories: Map<number, Category>;
  
  userCounter: number;
  artistCounter: number;
  venueCounter: number;
  concertCounter: number;
  ticketTypeCounter: number;
  orderCounter: number;
  orderItemCounter: number;
  categoryCounter: number;
  
  sessionStore: any;

  constructor() {
    this.users = new Map();
    this.artists = new Map();
    this.venues = new Map();
    this.concerts = new Map();
    this.ticketTypes = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.categories = new Map();
    
    this.userCounter = 1;
    this.artistCounter = 1;
    this.venueCounter = 1;
    this.concertCounter = 1;
    this.ticketTypeCounter = 1;
    this.orderCounter = 1;
    this.orderItemCounter = 1;
    this.categoryCounter = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
    
    // Initialize with some data
    this.initializeData();
  }

  private initializeData() {
    // Add default categories
    const categories = [
      { name: "Pop", iconClass: "fas fa-music" },
      { name: "Rock", iconClass: "fas fa-guitar" },
      { name: "Folk", iconClass: "fas fa-drum" },
      { name: "Hip-Hop", iconClass: "fas fa-microphone-alt" },
      { name: "Electronic", iconClass: "fas fa-compact-disc" },
      { name: "Festivals", iconClass: "fas fa-theater-masks" }
    ];
    
    categories.forEach(category => {
      this.createCategory(category);
    });

    // Add sample artists
    const artists = [
      {
        name: "Sarah Geronimo",
        genre: "Pop",
        bio: "Sarah Geronimo is a Filipino singer, actress and television personality. She began her career with the release of her debut album in 2003.",
        imageUrl: "https://images.unsplash.com/photo-1604537466158-719b1972feb8?q=80&w=400&auto=format&fit=crop"
      },
      {
        name: "Bamboo",
        genre: "Rock",
        bio: "Bamboo is one of the most influential rock musicians in the Philippines, known as the vocalist of bands such as Bamboo and Rivermaya.",
        imageUrl: "https://images.unsplash.com/photo-1574161340839-1f1b8802bad9?q=80&w=400&auto=format&fit=crop"
      },
      {
        name: "Ben&Ben",
        genre: "Folk",
        bio: "Ben&Ben is a nine-piece Filipino folk-pop band known for their heartfelt lyrics and unique sound that combines traditional Filipino folk with contemporary elements.",
        imageUrl: "https://images.unsplash.com/photo-1524508762098-fd966ffb6ef9?q=80&w=400&auto=format&fit=crop"
      },
      {
        name: "Gloc-9",
        genre: "Hip-Hop",
        bio: "Gloc-9 is a Filipino rapper, songwriter, and record producer. He is considered one of the most successful and respected Filipino rappers.",
        imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop"
      },
      {
        name: "Moira Dela Torre",
        genre: "Pop",
        bio: "Moira Dela Torre is a Filipino singer-songwriter known for her emotional ballads and heartfelt performances. She rose to fame after joining 'The Voice of the Philippines'.",
        imageUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=400&auto=format&fit=crop"
      },
      {
        name: "Eraserheads",
        genre: "Rock",
        bio: "Eraserheads is one of the most iconic Filipino bands of all time, often compared to The Beatles for their influence on Philippine music. Their songs have become anthems for generations of Filipinos.",
        imageUrl: "https://images.unsplash.com/photo-1501612780327-45045538702b?q=80&w=400&auto=format&fit=crop"
      },
      {
        name: "Ely Buendia",
        genre: "Rock",
        bio: "Ely Buendia is a Filipino musician, writer and director who is best known as the vocalist, guitarist and main songwriter of the legendary Filipino rock band Eraserheads.",
        imageUrl: "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?q=80&w=400&auto=format&fit=crop"
      },
      {
        name: "Parokya ni Edgar",
        genre: "Rock",
        bio: "Parokya ni Edgar is a Filipino band formed in 1993, known for their humorous lyrics and versatile musical style that combines rock with other genres.",
        imageUrl: "https://images.unsplash.com/photo-1598387846254-9f6ccbb158ce?q=80&w=400&auto=format&fit=crop"
      },
      {
        name: "SB19",
        genre: "Pop",
        bio: "SB19 is a Filipino boy band trained under a Korean entertainment company. They are credited as the first Filipino idol group that has been trained under a Korean entertainment company.",
        imageUrl: "https://images.unsplash.com/photo-1577741314755-048d8525d31e?q=80&w=400&auto=format&fit=crop"
      },
      {
        name: "December Avenue",
        genre: "Rock",
        bio: "December Avenue is a Filipino rock band formed in 2008. Their music mainly revolves around the subject of love and romantic relationships.",
        imageUrl: "https://images.unsplash.com/photo-1564758866811-4730f2437e6f?q=80&w=400&auto=format&fit=crop"
      }
    ];
    
    artists.forEach(artist => {
      this.createArtist(artist);
    });

    // Add sample venues with enhanced information
    const venues = [
      {
        name: "Araneta Coliseum",
        address: "Araneta City, General Roxas Avenue, Cubao, Quezon City",
        location: "Quezon City",
        capacity: 15000,
        description: "The Smart Araneta Coliseum, known as the Big Dome, is a historic indoor arena in Quezon City. With a capacity of 15,000, it has hosted legendary events including the 'Thrilla in Manila' boxing match. Known for its excellent acoustics and sightlines, it remains one of the Philippines' premier concert venues for both international and local artists.",
        amenities: "VIP boxes, multiple entrances, food concessionaires, parking facilities, accessibility features",
        imageUrl: "https://images.unsplash.com/photo-1556035511-3168381ea4d4?q=80&w=600&auto=format&fit=crop"
      },
      {
        name: "Mall of Asia Arena",
        address: "Mall of Asia Complex, J.W. Diokno Boulevard, Pasay City",
        location: "Pasay City",
        capacity: 20000,
        description: "The SM Mall of Asia Arena is a world-class indoor venue featuring state-of-the-art facilities and technology. With its 20,000 seating capacity and modern design, it hosts major concerts, international sporting events, and entertainment shows. The arena offers premium seating options and an immersive experience for all attendees.",
        amenities: "Premium suites, corporate boxes, digital displays, surround sound system, multiple food outlets, merchandise stands",
        imageUrl: "https://images.unsplash.com/photo-1560281056-7fa93056a782?q=80&w=600&auto=format&fit=crop"
      },
      {
        name: "Music Museum",
        address: "Greenhills Shopping Center, Greenhills, San Juan City",
        location: "San Juan",
        capacity: 800,
        description: "The Music Museum is an intimate performance venue known for its excellent acoustics and up-close concert experience. With a capacity of 800, it offers a more personal atmosphere for smaller shows and acoustic performances. The venue has hosted countless Filipino artists and has become an institution in the local music scene since opening in 1988.",
        amenities: "Theater-style seating, professional sound system, bar service, cozy atmosphere, nearby dining options",
        imageUrl: "https://images.unsplash.com/photo-1521070144638-767ffe2fd402?q=80&w=600&auto=format&fit=crop"
      }
    ];
    
    venues.forEach(venue => {
      this.createVenue(venue);
    });

    // Add sample concerts
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
    const twoMonthsFromNow = new Date(now.getFullYear(), now.getMonth() + 2, now.getDate());
    
    const concerts = [
      {
        title: "Pop Explosion",
        date: nextMonth,
        description: "Sarah Geronimo's biggest concert of the year featuring her latest hits and classic favorites.",
        venueId: 1,
        artistId: 1,
        status: "upcoming",
        isFeatured: true,
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=400&auto=format&fit=crop"
      },
      {
        title: "Rock Legends",
        date: twoMonthsFromNow,
        description: "Bamboo returns with a powerful rock concert showcasing timeless hits and new material.",
        venueId: 2,
        artistId: 2,
        status: "upcoming",
        isFeatured: true,
        imageUrl: "https://images.unsplash.com/photo-1560452992-e3c28ffc7432?q=80&w=400&auto=format&fit=crop"
      },
      {
        title: "Folk Tales",
        date: new Date(now.getFullYear(), now.getMonth() + 3, now.getDate()),
        description: "Ben&Ben presents an intimate acoustic evening of folk music and storytelling.",
        venueId: 3,
        artistId: 3,
        status: "upcoming",
        isFeatured: false,
        imageUrl: "https://images.unsplash.com/photo-1471478331149-c72f17e33c73?q=80&w=400&auto=format&fit=crop"
      },
      {
        title: "Words & Melodies",
        date: new Date(now.getFullYear(), now.getMonth() + 2, now.getDate() + 7),
        description: "Moira Dela Torre performs her emotional ballads in an intimate setting.",
        venueId: 3,
        artistId: 5,
        status: "upcoming",
        isFeatured: true,
        imageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=400&auto=format&fit=crop"
      },
      {
        title: "OPM Reunion",
        date: new Date(now.getFullYear(), now.getMonth() + 3, now.getDate() + 14),
        description: "A special one-night concert featuring the legendary Eraserheads playing their timeless hits.",
        venueId: 1,
        artistId: 6,
        status: "upcoming",
        isFeatured: true,
        imageUrl: "https://images.unsplash.com/photo-1598517531458-8e7ee53d0599?q=80&w=400&auto=format&fit=crop"
      },
      {
        title: "Manila Sound",
        date: new Date(now.getFullYear(), now.getMonth() + 4, now.getDate()),
        description: "Parokya ni Edgar brings their unique humor and catchy tunes for a night of fun and music.",
        venueId: 2,
        artistId: 8,
        status: "upcoming",
        isFeatured: false,
        imageUrl: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?q=80&w=400&auto=format&fit=crop"
      },
      {
        title: "Pinoy Pride",
        date: new Date(now.getFullYear(), now.getMonth() + 3, now.getDate() + 21),
        description: "SB19 showcases their dynamic performances and catchy songs in this high-energy concert.",
        venueId: 2,
        artistId: 9,
        status: "upcoming",
        isFeatured: true,
        imageUrl: "https://images.unsplash.com/photo-1501612780327-45045538702b?q=80&w=400&auto=format&fit=crop"
      },
      {
        title: "Hip-Hop Night",
        date: new Date(now.getFullYear(), now.getMonth() + 2, now.getDate() + 15),
        description: "Gloc-9 delivers powerful social commentary through his rap music in this special performance.",
        venueId: 3,
        artistId: 4,
        status: "upcoming",
        isFeatured: false,
        imageUrl: "https://images.unsplash.com/photo-1564585222527-c2777a5bc6cb?q=80&w=400&auto=format&fit=crop"
      },
      {
        title: "Ely Buendia Live",
        date: new Date(now.getFullYear(), now.getMonth() + 5, now.getDate()),
        description: "The former Eraserheads frontman performs solo hits and classic songs in an intimate venue.",
        venueId: 3,
        artistId: 7,
        status: "upcoming",
        isFeatured: false,
        imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=400&auto=format&fit=crop"
      }
    ];
    
    for (const concert of concerts) {
      const createdConcert = this.createConcert(concert);
      
      // Add ticket types for each concert after concert is created (not a Promise)
      const concertId = createdConcert.id;
      const ticketTypes = [
        {
          concertId,
          name: "VIP",
          price: 5000,
          quantity: 100,
          description: "Best seats with meet & greet",
          section: "Front",
          rowStart: 1,
          rowEnd: 5,
          seatsPerRow: 20,
          isReserved: true
        },
        {
          concertId,
          name: "Gold",
          price: 3500,
          quantity: 500,
          description: "Premium seating close to stage",
          section: "Center",
          rowStart: 6,
          rowEnd: 15,
          seatsPerRow: 30,
          isReserved: true
        },
        {
          concertId,
          name: "Silver",
          price: 2000,
          quantity: 1000,
          description: "Good view of the stage",
          section: "Rear",
          rowStart: 16,
          rowEnd: 30,
          seatsPerRow: 35,
          isReserved: true
        },
        {
          concertId,
          name: "General Admission",
          price: 1000,
          quantity: 2000,
          description: "Standing area",
          section: "Floor",
          isReserved: false
        }
      ];
      
      for (const ticketType of ticketTypes) {
        this.createTicketType(ticketType);
      }
    }
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCounter++;
    const user: User = { 
      ...insertUser, 
      id, 
      isAdmin: false,
      phone: insertUser.phone || null,
      address: insertUser.address || null
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Artist methods
  async getArtist(id: number): Promise<Artist | undefined> {
    return this.artists.get(id);
  }

  async getArtists(): Promise<Artist[]> {
    return Array.from(this.artists.values());
  }

  async getFeaturedArtists(limit = 4): Promise<Artist[]> {
    const artists = Array.from(this.artists.values());
    return artists.slice(0, limit);
  }

  async createArtist(insertArtist: InsertArtist): Promise<Artist> {
    const id = this.artistCounter++;
    const artist: Artist = { 
      ...insertArtist, 
      id,
      bio: insertArtist.bio || null,
      imageUrl: insertArtist.imageUrl || null
    };
    this.artists.set(id, artist);
    return artist;
  }

  async updateArtist(id: number, artistData: Partial<Artist>): Promise<Artist | undefined> {
    const artist = this.artists.get(id);
    if (!artist) return undefined;
    
    const updatedArtist = { ...artist, ...artistData };
    this.artists.set(id, updatedArtist);
    return updatedArtist;
  }

  async deleteArtist(id: number): Promise<boolean> {
    return this.artists.delete(id);
  }

  // Venue methods
  async getVenue(id: number): Promise<Venue | undefined> {
    return this.venues.get(id);
  }

  async getVenues(): Promise<Venue[]> {
    return Array.from(this.venues.values());
  }

  async getTopVenues(limit = 3): Promise<Venue[]> {
    const venues = Array.from(this.venues.values());
    return venues.slice(0, limit);
  }

  async createVenue(insertVenue: InsertVenue): Promise<Venue> {
    const id = this.venueCounter++;
    const venue: Venue = { 
      ...insertVenue, 
      id,
      imageUrl: insertVenue.imageUrl || null
    };
    this.venues.set(id, venue);
    return venue;
  }

  async updateVenue(id: number, venueData: Partial<Venue>): Promise<Venue | undefined> {
    const venue = this.venues.get(id);
    if (!venue) return undefined;
    
    const updatedVenue = { ...venue, ...venueData };
    this.venues.set(id, updatedVenue);
    return updatedVenue;
  }

  async deleteVenue(id: number): Promise<boolean> {
    return this.venues.delete(id);
  }

  // Concert methods
  async getConcert(id: number): Promise<Concert | undefined> {
    return this.concerts.get(id);
  }

  async getConcertWithDetails(id: number): Promise<any | undefined> {
    const concert = this.concerts.get(id);
    if (!concert) return undefined;
    
    const venue = this.venues.get(concert.venueId);
    const artist = this.artists.get(concert.artistId);
    const ticketTypes = await this.getTicketTypesByConcert(id);
    
    return {
      ...concert,
      venue,
      artist,
      ticketTypes
    };
  }

  async getConcerts(): Promise<Concert[]> {
    return Array.from(this.concerts.values());
  }

  async getFeaturedConcerts(limit = 3): Promise<any[]> {
    const concertsArray = Array.from(this.concerts.values());
    const featuredConcerts = concertsArray.filter(concert => concert.isFeatured);
    const concerts = featuredConcerts.slice(0, limit);
    
    return await Promise.all(concerts.map(async concert => {
      const venue = this.venues.get(concert.venueId);
      const artist = this.artists.get(concert.artistId);
      const ticketTypes = await this.getTicketTypesByConcert(concert.id);
      const minPrice = ticketTypes.length > 0 
        ? Math.min(...ticketTypes.map(t => t.price)) 
        : 0;
      const maxPrice = ticketTypes.length > 0 
        ? Math.max(...ticketTypes.map(t => t.price)) 
        : 0;
      
      return {
        ...concert,
        venue,
        artist,
        minPrice,
        maxPrice
      };
    }));
  }

  async getUpcomingConcerts(limit = 6): Promise<any[]> {
    const concertsArray = Array.from(this.concerts.values());
    const upcomingConcerts = concertsArray
      .filter(concert => concert.status === 'upcoming')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    const concerts = limit ? upcomingConcerts.slice(0, limit) : upcomingConcerts;
    
    return await Promise.all(concerts.map(async concert => {
      const venue = this.venues.get(concert.venueId);
      const artist = this.artists.get(concert.artistId);
      const ticketTypes = await this.getTicketTypesByConcert(concert.id);
      const minPrice = ticketTypes.length > 0 
        ? Math.min(...ticketTypes.map(t => t.price)) 
        : 0;
      const maxPrice = ticketTypes.length > 0 
        ? Math.max(...ticketTypes.map(t => t.price)) 
        : 0;
      
      return {
        ...concert,
        venue,
        artist,
        minPrice,
        maxPrice
      };
    }));
  }

  async getConcertsByArtist(artistId: number): Promise<Concert[]> {
    const concerts = Array.from(this.concerts.values());
    return concerts.filter(concert => concert.artistId === artistId);
  }

  async getConcertsByVenue(venueId: number): Promise<Concert[]> {
    const concerts = Array.from(this.concerts.values());
    return concerts.filter(concert => concert.venueId === venueId);
  }

  async createConcert(insertConcert: InsertConcert): Promise<Concert> {
    const id = this.concertCounter++;
    const concert: Concert = { 
      ...insertConcert, 
      id,
      status: insertConcert.status || 'upcoming',
      imageUrl: insertConcert.imageUrl || null,
      isFeatured: insertConcert.isFeatured || false
    };
    this.concerts.set(id, concert);
    return concert;
  }

  async updateConcert(id: number, concertData: Partial<Concert>): Promise<Concert | undefined> {
    const concert = this.concerts.get(id);
    if (!concert) return undefined;
    
    const updatedConcert = { ...concert, ...concertData };
    this.concerts.set(id, updatedConcert);
    return updatedConcert;
  }

  async deleteConcert(id: number): Promise<boolean> {
    return this.concerts.delete(id);
  }

  // Ticket methods
  async getTicketTypesByConcert(concertId: number): Promise<TicketType[]> {
    const ticketTypes = Array.from(this.ticketTypes.values());
    return ticketTypes.filter(ticketType => ticketType.concertId === concertId);
  }

  async createTicketType(insertTicketType: InsertTicketType): Promise<TicketType> {
    const id = this.ticketTypeCounter++;
    const ticketType: TicketType = { ...insertTicketType, id };
    this.ticketTypes.set(id, ticketType);
    return ticketType;
  }

  async updateTicketType(id: number, ticketTypeData: Partial<TicketType>): Promise<TicketType | undefined> {
    const ticketType = this.ticketTypes.get(id);
    if (!ticketType) return undefined;
    
    const updatedTicketType = { ...ticketType, ...ticketTypeData };
    this.ticketTypes.set(id, updatedTicketType);
    return updatedTicketType;
  }

  async deleteTicketType(id: number): Promise<boolean> {
    return this.ticketTypes.delete(id);
  }

  // Order methods
  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getOrdersByUser(userId: number): Promise<Order[]> {
    const orders = Array.from(this.orders.values());
    return orders.filter(order => order.userId === userId);
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = this.orderCounter++;
    const order: Order = { 
      ...insertOrder, 
      id, 
      orderDate: new Date(), 
      status: 'completed' 
    };
    this.orders.set(id, order);
    return order;
  }

  // OrderItem methods
  async getOrderItemsByOrder(orderId: number): Promise<OrderItem[]> {
    const orderItems = Array.from(this.orderItems.values());
    return orderItems.filter(item => item.orderId === orderId);
  }

  async createOrderItem(insertOrderItem: InsertOrderItem): Promise<OrderItem> {
    const id = this.orderItemCounter++;
    const orderItem: OrderItem = { ...insertOrderItem, id };
    this.orderItems.set(id, orderItem);
    return orderItem;
  }

  // Category methods
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.categoryCounter++;
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }
}

export const storage = new MemStorage();
