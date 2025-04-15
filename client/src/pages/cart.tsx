
import { useState, useEffect } from "react";
import { type Product } from "@shared/schema";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { Link } from "wouter";

export default function Cart() {
  const [cartItems, setCartItems] = useState<Product[]>([]);

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(items);
  }, []);

  const removeFromCart = (productId: number) => {
    const newItems = cartItems.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(newItems));
    setCartItems(newItems);
  };

  const total = cartItems.reduce((sum, item) => sum + (Number(item.price) || 0), 0);

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">Your cart is empty</p>
          <Link href="/merchandise">
            <Button>Browse Merchandise</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {cartItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Card>
                <CardContent className="flex items-center p-4">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-md"
                  />
                  <div className="ml-4 flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-muted-foreground">${item.price}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
          <div className="flex justify-between items-center mt-6">
            <div className="text-xl font-semibold">Total: ${total.toFixed(2)}</div>
            <Link href="/checkout">
              <Button size="lg">Proceed to Checkout</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
