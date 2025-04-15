
import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { type Product } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export default function Product() {
  const [, params] = useRoute("/product/:id");
  const { toast } = useToast();
  
  const { data: product, isLoading } = useQuery<Product>({
    queryKey: [`/api/products/${params?.id}`],
  });

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    toast({
      title: "Added to Cart",
      description: `${product?.name} has been added to your cart`,
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
        className="grid md:grid-cols-2 gap-8"
      >
        <div>
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full rounded-lg shadow-lg"
          />
        </div>
        <div className="space-y-6">
          <h1 className="text-4xl font-bold">{product.name}</h1>
          <p className="text-xl text-muted-foreground">{product.description}</p>
          <p className="text-3xl font-bold">${product.price}</p>
          <Button size="lg" onClick={addToCart} className="w-full gap-2">
            <ShoppingCart className="h-5 w-5" />
            Add to Cart
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
