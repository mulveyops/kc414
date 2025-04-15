
import { useQuery } from "@tanstack/react-query";
import { type Track, type Product } from "@shared/schema";
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Merchandise() {
  const [activeTrack, setActiveTrack] = useState<number | null>(null);
  const [selectedSizes, setSelectedSizes] = useState<Record<number, string>>({});
  const { toast } = useToast();
  
  const { data: products, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: tracks, isLoading: tracksLoading } = useQuery<Track[]>({
    queryKey: ["/api/tracks"],
  });

  const isLoading = productsLoading || tracksLoading;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-secondary rounded w-1/4" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-secondary rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const filteredProducts = activeTrack !== null
    ? products?.filter(product => product.relatedTrackId === activeTrack)
    : products;

  // Helper function to get track title by ID
  const getTrackTitleById = (id: number | undefined) => {
    if (!id) return "Unknown Track";
    const track = tracks?.find(t => t.id === id);
    return track ? track.title : "Unknown Track";
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4">KC414 Merchandise</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Official merchandise featuring designs from your favorite tracks
          </p>
        </motion.div>

        <div className="mb-8">
          <div className="flex gap-2 flex-wrap justify-center">
            <Button 
              variant={activeTrack === null ? "default" : "outline"} 
              onClick={() => setActiveTrack(null)}
              className="mb-2"
            >
              All Designs
            </Button>
            {tracks?.map((track) => (
              <Button
                key={track.id}
                variant={activeTrack === track.id ? "default" : "outline"}
                onClick={() => setActiveTrack(track.id)}
                className="mb-2"
              >
                {track.title}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts?.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3 }}
            >
              <Card className="overflow-hidden h-full flex flex-col">
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="object-cover w-full h-full transition-transform hover:scale-105"
                  />
                  {product.relatedTrackId && (
                    <div className="absolute top-2 right-2 bg-black/70 text-white text-xs py-1 px-2 rounded-full">
                      {getTrackTitleById(product.relatedTrackId)}
                    </div>
                  )}
                </div>
                <CardContent className="pt-6 flex-grow">
                  <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                  <p className="text-muted-foreground mb-2">{product.description}</p>
                  <p className="text-lg font-bold">${product.price}</p>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Link href={`/product/${product.id}`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      View Details
                    </Button>
                  </Link>
                  <div className="flex gap-2 flex-col">
                    <div className="flex gap-2">
                      {["S", "M", "L", "XL"].map((size) => (
                        <Button
                          key={size}
                          variant={selectedSizes[product.id] === size ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            setSelectedSizes(prev => ({
                              ...prev,
                              [product.id]: size
                            }));
                          }}
                        >
                          {size}
                        </Button>
                      ))}
                    </div>
                    <Button 
                      className="gap-2"
                      disabled={!selectedSizes[product.id]}
                      onClick={() => {
                        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
                        cart.push({...product, selectedSize: selectedSizes[product.id]});
                        localStorage.setItem('cart', JSON.stringify(cart));
                        window.dispatchEvent(new Event('cartUpdated'));
                        toast({
                          title: "Added to Cart",
                          description: `${product.name} (${selectedSizes[product.id]}) has been added to your cart`,
                        });
                        // Reset size selection
                        setSelectedSizes(prev => {
                          const next = {...prev};
                          delete next[product.id];
                          return next;
                        });
                      }}
                    >
                      <ShoppingBag className="h-4 w-4" />
                      Add to Cart
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
