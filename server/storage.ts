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
