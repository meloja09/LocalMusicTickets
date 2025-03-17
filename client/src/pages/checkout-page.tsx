import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { useConcert, useTicketTypes, useCreateOrder } from "@/hooks/use-api";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Calendar,
  Clock,
  MapPin,
  CreditCard,
  Ticket,
  ShoppingCart,
  CheckCircle,
  CircleDollarSign,
  Loader2,
} from "lucide-react";

const paymentSchema = z.object({
  fullName: z.string().min(3, { message: "Full name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(10, { message: "Valid phone number is required" }),
  paymentMethod: z.enum(["credit_card", "gcash", "paymaya", "bank_transfer"], {
    required_error: "Please select a payment method",
  }),
  cardNumber: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvc: z.string().optional(),
  specialRequests: z.string().optional(),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

const CheckoutPage = () => {
  const [_, params] = useRoute("/checkout/:concertId");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const concertId = params ? parseInt(params.id) : 0;
  
  const { data: concert, isLoading: concertLoading } = useConcert(concertId);
  const { data: ticketTypes, isLoading: ticketsLoading } = useTicketTypes(concertId);
  const { user } = useAuth();
  const createOrderMutation = useCreateOrder();
  
  const [selectedTickets, setSelectedTickets] = useState<{[key: number]: number}>({});
  const [processingOrder, setProcessingOrder] = useState(false);
  
  // Initialize form with user data if available
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      paymentMethod: "credit_card",
      specialRequests: "",
    },
  });
  
  // Check URL params for ticket selections
  useEffect(() => {
    const url = new URL(window.location.href);
    const ticketParam = url.searchParams.get("tickets");
    
    if (ticketParam) {
      try {
        const ticketsData = JSON.parse(decodeURIComponent(ticketParam));
        setSelectedTickets(ticketsData);
      } catch (e) {
        console.error("Invalid ticket data in URL");
      }
    }
  }, []);
  
  // Calculate totals
  const totalTickets = Object.values(selectedTickets).reduce((sum, qty) => sum + qty, 0);
  
  const ticketSubtotal = ticketTypes
    ?.map(ticket => ({
      price: ticket.price,
      quantity: selectedTickets[ticket.id] || 0
    }))
    .reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
  
  const serviceFee = totalTickets * 50; // ₱50 per ticket service fee
  const totalAmount = ticketSubtotal + serviceFee;
  
  const onSubmit = async (data: PaymentFormValues) => {
    if (totalTickets === 0) {
      toast({
        title: "No tickets selected",
        description: "Please select at least one ticket to continue",
        variant: "destructive",
      });
      return;
    }
    
    setProcessingOrder(true);
    
    // Prepare ticket items for the order
    const ticketItems = ticketTypes
      ?.filter(ticket => selectedTickets[ticket.id] && selectedTickets[ticket.id] > 0)
      .map(ticket => ({
        ticketTypeId: ticket.id,
        quantity: selectedTickets[ticket.id],
        unitPrice: ticket.price
      }));
    
    try {
      await createOrderMutation.mutateAsync({
        totalAmount,
        paymentMethod: data.paymentMethod,
        ticketItems
      });
      
      toast({
        title: "Order successful!",
        description: "Your tickets have been booked successfully",
      });
      
      // Simulate payment processing
      setTimeout(() => {
        setProcessingOrder(false);
        setLocation("/profile");
      }, 2000);
    } catch (error) {
      setProcessingOrder(false);
      toast({
        title: "Order failed",
        description: "There was an error processing your order",
        variant: "destructive",
      });
    }
  };
  
  // If no tickets are selected and we're not in the loading state, redirect back to concert page
  useEffect(() => {
    if (!concertLoading && !ticketsLoading && totalTickets === 0) {
      toast({
        title: "No tickets selected",
        description: "Please select tickets before proceeding to checkout",
        variant: "destructive",
      });
      setLocation(`/concerts/${concertId}`);
    }
  }, [concertLoading, ticketsLoading, totalTickets, concertId, setLocation, toast]);
  
  if (concertLoading || ticketsLoading) {
    return (
      <div className="bg-neutral-50 min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-12 w-48 mb-8" />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <Skeleton className="h-8 w-36 mb-2" />
                    <Skeleton className="h-4 w-64" />
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {Array(4).fill(0).map((_, i) => (
                      <div key={i} className="space-y-2">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card>
                  <CardHeader>
                    <Skeleton className="h-6 w-32" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!concert) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-neutral-900 mb-4">Concert Not Found</h2>
        <p className="text-neutral-600 mb-6">The concert you're trying to book tickets for does not exist.</p>
        <Button onClick={() => setLocation("/concerts")}>
          Browse Concerts
        </Button>
      </div>
    );
  }
  
  return (
    <div className="bg-neutral-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-neutral-900">Checkout</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Payment Form */}
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Information</CardTitle>
                  <CardDescription>
                    Complete your ticket purchase for {concert.title}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Contact Information</h3>
                        
                        <FormField
                          control={form.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your full name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input type="email" placeholder="your@email.com" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                  <Input placeholder="+63 XXX XXX XXXX" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Payment Method</h3>
                        
                        <FormField
                          control={form.control}
                          name="paymentMethod"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                >
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="credit_card" />
                                    </FormControl>
                                    <FormLabel className="font-normal cursor-pointer flex items-center gap-2">
                                      <CreditCard className="h-4 w-4" />
                                      Credit/Debit Card
                                    </FormLabel>
                                  </FormItem>
                                  
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="gcash" />
                                    </FormControl>
                                    <FormLabel className="font-normal cursor-pointer flex items-center gap-2">
                                      <div className="text-blue-500 font-bold text-sm">GCash</div>
                                    </FormLabel>
                                  </FormItem>
                                  
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="paymaya" />
                                    </FormControl>
                                    <FormLabel className="font-normal cursor-pointer flex items-center gap-2">
                                      <div className="text-purple-500 font-bold text-sm">PayMaya</div>
                                    </FormLabel>
                                  </FormItem>
                                  
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="bank_transfer" />
                                    </FormControl>
                                    <FormLabel className="font-normal cursor-pointer flex items-center gap-2">
                                      <CircleDollarSign className="h-4 w-4" />
                                      Bank Transfer
                                    </FormLabel>
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        {form.watch("paymentMethod") === "credit_card" && (
                          <div className="space-y-4 p-4 border rounded-md">
                            <div>
                              <FormLabel>Card Number</FormLabel>
                              <Input placeholder="1234 5678 9012 3456" />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <FormLabel>Expiry Date</FormLabel>
                                <Input placeholder="MM/YY" />
                              </div>
                              <div>
                                <FormLabel>CVC</FormLabel>
                                <Input placeholder="123" />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Additional Information</h3>
                        
                        <FormField
                          control={form.control}
                          name="specialRequests"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Special Requests (Optional)</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Any special requirements or notes for the organizer"
                                  className="resize-none"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full"
                        disabled={processingOrder}
                        size="lg"
                      >
                        {processingOrder ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                          </>
                        ) : (
                          <>
                            Complete Purchase
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
            
            {/* Order Summary */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-neutral-50 rounded-lg p-4 mb-4">
                    <h3 className="font-bold text-lg mb-2">{concert.title}</h3>
                    <div className="flex items-center text-sm text-neutral-600 mb-1">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{format(new Date(concert.date), 'EEEE, MMMM dd, yyyy')}</span>
                    </div>
                    <div className="flex items-center text-sm text-neutral-600 mb-1">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{format(new Date(concert.date), 'h:mm a')}</span>
                    </div>
                    <div className="flex items-center text-sm text-neutral-600">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{concert.venue?.name}, {concert.venue?.location}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <h4 className="font-medium">Selected Tickets:</h4>
                    
                    {ticketTypes?.map(ticket => {
                      const quantity = selectedTickets[ticket.id] || 0;
                      if (quantity === 0) return null;
                      
                      return (
                        <div key={ticket.id} className="flex justify-between items-center text-sm">
                          <div className="flex items-center">
                            <Ticket className="h-4 w-4 mr-2 text-primary" />
                            <span>{ticket.name} x {quantity}</span>
                          </div>
                          <span>₱{(ticket.price * quantity).toLocaleString()}</span>
                        </div>
                      );
                    })}
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span>₱{ticketSubtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Service Fee:</span>
                      <span>₱{serviceFee.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg mt-4">
                      <span>Total:</span>
                      <span className="text-primary">₱{totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col items-start bg-neutral-50 border-t rounded-b-lg space-y-2 text-xs text-neutral-600">
                  <div className="flex items-start">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Tickets will be emailed to you after purchase</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Payment is secure and encrypted</span>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
