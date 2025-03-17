import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { 
  Artist, 
  Venue, 
  InsertArtist, 
  InsertVenue, 
  Concert, 
  InsertConcert, 
  InsertTicketType,
  InsertOrder
} from "@shared/schema";

// Artist hooks
export function useArtists() {
  return useQuery<Artist[], Error>({
    queryKey: ["/api/artists"],
  });
}

export function useFeaturedArtists(limit?: number) {
  return useQuery<Artist[], Error>({
    queryKey: ["/api/artists/featured", limit],
  });
}

export function useArtist(id: number) {
  return useQuery<any, Error>({
    queryKey: [`/api/artists/${id}`],
    enabled: !!id,
  });
}

export function useCreateArtist() {
  return useMutation({
    mutationFn: async (artistData: InsertArtist) => {
      const res = await apiRequest("POST", "/api/artists", artistData);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/artists"] });
    },
  });
}

export function useUpdateArtist(id: number) {
  return useMutation({
    mutationFn: async (artistData: Partial<Artist>) => {
      const res = await apiRequest("PUT", `/api/artists/${id}`, artistData);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/artists"] });
      queryClient.invalidateQueries({ queryKey: [`/api/artists/${id}`] });
    },
  });
}

export function useDeleteArtist() {
  return useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/artists/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/artists"] });
    },
  });
}

// Venue hooks
export function useVenues() {
  return useQuery<Venue[], Error>({
    queryKey: ["/api/venues"],
  });
}

export function useTopVenues(limit?: number) {
  return useQuery<Venue[], Error>({
    queryKey: ["/api/venues/top", limit],
  });
}

export function useVenue(id: number) {
  return useQuery<any, Error>({
    queryKey: [`/api/venues/${id}`],
    enabled: !!id,
  });
}

export function useCreateVenue() {
  return useMutation({
    mutationFn: async (venueData: InsertVenue) => {
      const res = await apiRequest("POST", "/api/venues", venueData);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/venues"] });
    },
  });
}

export function useUpdateVenue(id: number) {
  return useMutation({
    mutationFn: async (venueData: Partial<Venue>) => {
      const res = await apiRequest("PUT", `/api/venues/${id}`, venueData);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/venues"] });
      queryClient.invalidateQueries({ queryKey: [`/api/venues/${id}`] });
    },
  });
}

export function useDeleteVenue() {
  return useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/venues/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/venues"] });
    },
  });
}

// Concert hooks
export function useConcerts() {
  return useQuery<Concert[], Error>({
    queryKey: ["/api/concerts"],
  });
}

export function useFeaturedConcerts(limit?: number) {
  return useQuery<any[], Error>({
    queryKey: ["/api/concerts/featured", limit],
  });
}

export function useUpcomingConcerts(limit?: number) {
  return useQuery<any[], Error>({
    queryKey: ["/api/concerts/upcoming", limit],
  });
}

export function useConcert(id: number) {
  return useQuery<any, Error>({
    queryKey: [`/api/concerts/${id}`],
    enabled: !!id,
  });
}

export function useCreateConcert() {
  return useMutation({
    mutationFn: async (concertData: InsertConcert) => {
      const res = await apiRequest("POST", "/api/concerts", concertData);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/concerts"] });
    },
  });
}

export function useUpdateConcert(id: number) {
  return useMutation({
    mutationFn: async (concertData: Partial<Concert>) => {
      const res = await apiRequest("PUT", `/api/concerts/${id}`, concertData);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/concerts"] });
      queryClient.invalidateQueries({ queryKey: [`/api/concerts/${id}`] });
    },
  });
}

export function useDeleteConcert() {
  return useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/concerts/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/concerts"] });
    },
  });
}

// Ticket hooks
export function useTicketTypes(concertId: number) {
  return useQuery<any[], Error>({
    queryKey: [`/api/concerts/${concertId}/tickets`],
    enabled: !!concertId,
  });
}

export function useCreateTicketType() {
  return useMutation({
    mutationFn: async (ticketTypeData: InsertTicketType) => {
      const res = await apiRequest("POST", "/api/tickets", ticketTypeData);
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [`/api/concerts/${data.concertId}/tickets`] });
    },
  });
}

// Order hooks
export function useOrders() {
  return useQuery<any[], Error>({
    queryKey: ["/api/orders"],
  });
}

export function useOrder(id: number) {
  return useQuery<any, Error>({
    queryKey: [`/api/orders/${id}`],
    enabled: !!id,
  });
}

export function useCreateOrder() {
  return useMutation({
    mutationFn: async (orderData: { totalAmount: number, paymentMethod: string, ticketItems: any[] }) => {
      const res = await apiRequest("POST", "/api/orders", orderData);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
    },
  });
}

// Categories
export function useCategories() {
  return useQuery<any[], Error>({
    queryKey: ["/api/categories"],
  });
}
