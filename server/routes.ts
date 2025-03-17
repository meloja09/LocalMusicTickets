import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { 
  insertArtistSchema, 
  insertVenueSchema, 
  insertConcertSchema, 
  insertTicketTypeSchema, 
  insertOrderSchema, 
  insertOrderItemSchema 
} from "@shared/schema";
import { z } from "zod";

const isAdmin = (req: any, res: any, next: any) => {
  if (!req.isAuthenticated() || !req.user.isAdmin) {
    return res.status(403).json({ message: "Forbidden: Admin access required" });
  }
  next();
};

const isAuthenticated = (req: any, res: any, next: any) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized: Login required" });
  }
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  setupAuth(app);

  // Artist routes
  app.get("/api/artists", async (req, res) => {
    try {
      const artists = await storage.getArtists();
      res.json(artists);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch artists" });
    }
  });

  app.get("/api/artists/featured", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 4;
      const artists = await storage.getFeaturedArtists(limit);
      res.json(artists);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured artists" });
    }
  });

  app.get("/api/artists/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const artist = await storage.getArtist(id);
      
      if (!artist) {
        return res.status(404).json({ message: "Artist not found" });
      }
      
      // Get concerts by this artist
      const concerts = await storage.getConcertsByArtist(id);
      
      res.json({ ...artist, concerts });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch artist" });
    }
  });

  app.post("/api/artists", isAdmin, async (req, res) => {
    try {
      const artistData = insertArtistSchema.parse(req.body);
      const artist = await storage.createArtist(artistData);
      res.status(201).json(artist);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid artist data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create artist" });
    }
  });

  app.put("/api/artists/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const artistData = req.body;
      const artist = await storage.updateArtist(id, artistData);
      
      if (!artist) {
        return res.status(404).json({ message: "Artist not found" });
      }
      
      res.json(artist);
    } catch (error) {
      res.status(500).json({ message: "Failed to update artist" });
    }
  });

  app.delete("/api/artists/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteArtist(id);
      
      if (!success) {
        return res.status(404).json({ message: "Artist not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete artist" });
    }
  });

  // Venue routes
  app.get("/api/venues", async (req, res) => {
    try {
      const venues = await storage.getVenues();
      res.json(venues);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch venues" });
    }
  });

  app.get("/api/venues/top", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 3;
      const venues = await storage.getTopVenues(limit);
      res.json(venues);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch top venues" });
    }
  });

  app.get("/api/venues/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const venue = await storage.getVenue(id);
      
      if (!venue) {
        return res.status(404).json({ message: "Venue not found" });
      }
      
      // Get concerts at this venue
      const concerts = await storage.getConcertsByVenue(id);
      
      res.json({ ...venue, concerts });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch venue" });
    }
  });

  app.post("/api/venues", isAdmin, async (req, res) => {
    try {
      const venueData = insertVenueSchema.parse(req.body);
      const venue = await storage.createVenue(venueData);
      res.status(201).json(venue);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid venue data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create venue" });
    }
  });

  app.put("/api/venues/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const venueData = req.body;
      const venue = await storage.updateVenue(id, venueData);
      
      if (!venue) {
        return res.status(404).json({ message: "Venue not found" });
      }
      
      res.json(venue);
    } catch (error) {
      res.status(500).json({ message: "Failed to update venue" });
    }
  });

  app.delete("/api/venues/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteVenue(id);
      
      if (!success) {
        return res.status(404).json({ message: "Venue not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete venue" });
    }
  });

  // Concert routes
  app.get("/api/concerts", async (req, res) => {
    try {
      const concerts = await storage.getConcerts();
      res.json(concerts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch concerts" });
    }
  });

  app.get("/api/concerts/featured", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 3;
      const concerts = await storage.getFeaturedConcerts(limit);
      res.json(concerts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured concerts" });
    }
  });

  app.get("/api/concerts/upcoming", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 6;
      const concerts = await storage.getUpcomingConcerts(limit);
      res.json(concerts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch upcoming concerts" });
    }
  });

  app.get("/api/concerts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const concert = await storage.getConcertWithDetails(id);
      
      if (!concert) {
        return res.status(404).json({ message: "Concert not found" });
      }
      
      res.json(concert);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch concert" });
    }
  });

  app.post("/api/concerts", isAdmin, async (req, res) => {
    try {
      const concertData = insertConcertSchema.parse(req.body);
      const concert = await storage.createConcert(concertData);
      res.status(201).json(concert);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid concert data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create concert" });
    }
  });

  app.put("/api/concerts/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const concertData = req.body;
      const concert = await storage.updateConcert(id, concertData);
      
      if (!concert) {
        return res.status(404).json({ message: "Concert not found" });
      }
      
      res.json(concert);
    } catch (error) {
      res.status(500).json({ message: "Failed to update concert" });
    }
  });

  app.delete("/api/concerts/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteConcert(id);
      
      if (!success) {
        return res.status(404).json({ message: "Concert not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete concert" });
    }
  });

  // Ticket routes
  app.get("/api/concerts/:concertId/tickets", async (req, res) => {
    try {
      const concertId = parseInt(req.params.concertId);
      const ticketTypes = await storage.getTicketTypesByConcert(concertId);
      res.json(ticketTypes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch ticket types" });
    }
  });

  app.post("/api/tickets", isAdmin, async (req, res) => {
    try {
      const ticketTypeData = insertTicketTypeSchema.parse(req.body);
      const ticketType = await storage.createTicketType(ticketTypeData);
      res.status(201).json(ticketType);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid ticket type data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create ticket type" });
    }
  });

  app.put("/api/tickets/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const ticketTypeData = req.body;
      const ticketType = await storage.updateTicketType(id, ticketTypeData);
      
      if (!ticketType) {
        return res.status(404).json({ message: "Ticket type not found" });
      }
      
      res.json(ticketType);
    } catch (error) {
      res.status(500).json({ message: "Failed to update ticket type" });
    }
  });

  app.delete("/api/tickets/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteTicketType(id);
      
      if (!success) {
        return res.status(404).json({ message: "Ticket type not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete ticket type" });
    }
  });

  // Order routes
  app.get("/api/orders", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user!.id;
      const orders = await storage.getOrdersByUser(userId);
      
      // Fetch order items for each order
      const ordersWithItems = await Promise.all(orders.map(async (order) => {
        const items = await storage.getOrderItemsByOrder(order.id);
        return { ...order, items };
      }));
      
      res.json(ordersWithItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.get("/api/orders/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const order = await storage.getOrder(id);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      // Check if the order belongs to the authenticated user
      if (order.userId !== req.user!.id && !req.user!.isAdmin) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const items = await storage.getOrderItemsByOrder(id);
      
      res.json({ ...order, items });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  app.post("/api/orders", isAuthenticated, async (req, res) => {
    try {
      const orderData = insertOrderSchema.parse({
        ...req.body,
        userId: req.user!.id
      });
      
      const { ticketItems } = req.body;
      
      if (!ticketItems || !Array.isArray(ticketItems) || ticketItems.length === 0) {
        return res.status(400).json({ message: "Order must contain ticket items" });
      }
      
      // Create the order
      const order = await storage.createOrder(orderData);
      
      // Create order items
      const orderItems = await Promise.all(
        ticketItems.map(async (item: any) => {
          const orderItemData = insertOrderItemSchema.parse({
            orderId: order.id,
            ticketTypeId: item.ticketTypeId,
            quantity: item.quantity,
            unitPrice: item.unitPrice
          });
          
          return storage.createOrderItem(orderItemData);
        })
      );
      
      res.status(201).json({ ...order, items: orderItems });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid order data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  // Category routes
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
