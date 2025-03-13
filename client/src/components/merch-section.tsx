
import { useQuery } from "@tanstack/react-query";
import { type Product, type Track } from "@shared/schema";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Link } from "wouter";
import { useState } from "react";

interface MerchSectionProps {
  preview?: boolean;
}

export function MerchSection({ preview }: MerchSectionProps) {
  const [activeTrack, setActiveTrack] = useState<number | null>(null);
  
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

  const displayProducts = preview
    ? filteredProducts?.slice(0, 3)
    : filteredProducts;

  // Helper function to get track title by ID
  const getTrackTitleById = (id: number | undefined) => {
    if (!id) return "Unknown Track";
    const track = tracks?.find(t => t.id === id);
    return track ? track.title : "Unknown Track";
  };

  return (
    <section id="merch" className="container mx-auto px-4 py-16">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-3xl font-bold mb-8"
      >
        Featured Merchandise
      </motion.h2>

      <div className="mb-8">
        <div className="flex gap-2 flex-wrap">
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
        {displayProducts?.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="h-full flex flex-col">
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  {product.relatedTrackId && (
                    <div className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded-md text-xs">
                      {getTrackTitleById(product.relatedTrackId)} Design
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex flex-col items-start gap-2 p-4 flex-grow">
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-sm text-muted-foreground flex-grow">{product.description}</p>
                <div className="flex justify-between items-center w-full mt-2">
                  <span className="font-bold">${product.price}</span>
                  <Link href={`/product/${product.id}`}>
                    <Button size="sm">View Item</Button>
                  </Link>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
      <div className="text-center mt-8">
        <Link href="/merchandise">
          <Button variant="outline" size="lg">
            View All Merchandise
          </Button>
        </Link>
      </div>
    </section>
  );
}
