import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { type Product } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function Checkout() {
  const [, params] = useRoute("/checkout/:id");
  const { toast } = useToast();

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: [`/api/products/${params?.id}`],
  });

  const handleCheckout = () => {
    toast({
      title: "Demo Checkout",
      description: "This is a demo checkout process. No actual payment will be processed.",
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-secondary rounded w-1/4" />
          <div className="h-64 bg-secondary rounded" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-2xl font-bold">Product not found</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto"
      >
        <Card>
          <CardHeader>
            <CardTitle>Checkout</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-48 object-cover rounded-lg"
              />
              <div>
                <h2 className="font-semibold">{product.name}</h2>
                <p className="text-sm text-muted-foreground">{product.description}</p>
                <p className="text-lg font-bold mt-2">${product.price}</p>
              </div>
              <Button
                className="w-full"
                onClick={handleCheckout}
              >
                Complete Purchase
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
