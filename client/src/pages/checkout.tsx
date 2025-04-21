// client/src/pages/checkout.tsx

// Import statements remain the same
import { useState, useEffect } from "react";
import { type Product } from "@shared/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { orderFormSchema } from "@shared/schema";


export default function Checkout() {
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<Product[]>([]);

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(items);
  }, []);

  const total = cartItems.reduce(
    (sum: number, item: any) => sum + Number(item.price),
    0,
  );

  const form = useForm({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      notes: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: unknown) => {
      await apiRequest("POST", "/api/orders", data);
    },
    onSuccess: () => {
      toast({
        title: "Order submitted",
        description: "We'll contact you soon to confirm your order.",
      });
      form.reset();
      localStorage.setItem("cart", "[]");
      window.location.href = "/";
    },
  });

  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto"
      >
        <Card>
          <CardHeader>
            <CardTitle>Complete Your Order</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Order Summary</h3>
              <div className="space-y-2">
                {cartItems.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between">
                    <span>
                      {item.name} (Size: {item.selectedSize})
                    </span>
                    <span>${item.price}</span>
                  </div>
                ))}
                <div className="border-t pt-2 font-semibold">
                  <div className="flex justify-between">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <Form onSubmit={form.handleSubmit(mutation.mutate)}>
              {/* Form fields for name, email, phone, address, notes */}
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shipping Address</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Notes</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Submitting..." : "Submit Order"}
              </Button>
            </Form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
