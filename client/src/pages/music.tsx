
import { useQuery } from "@tanstack/react-query";
import { type Track, type Product } from "@shared/schema";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TrackWithMerch {
  track: Track;
  relatedProducts: Product[];
}

export default function Music() {
  const { data: tracks, isLoading: tracksLoading } = useQuery<Track[]>({
    queryKey: ["/api/tracks"],
  });

  const tracksWithMerch = useQuery<TrackWithMerch[]>({
    queryKey: ["/api/tracks-with-merch"],
    enabled: !!tracks,
    queryFn: async () => {
      if (!tracks) return [];
      const trackMerch = await Promise.all(
        tracks.map(async (track) => {
          const res = await fetch(`/api/tracks/${track.id}/products`);
          const products = await res.json();
          return { track, relatedProducts: products };
        })
      );
      return trackMerch;
    },
  });

  if (tracksLoading || tracksWithMerch.isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-secondary rounded w-1/4" />
          <div className="h-48 bg-secondary rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4">KC414 Music</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Listen to my latest tracks and explore related merchandise
          </p>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="max-w-4xl mx-auto mb-16"
          >
            <iframe
              style={{ borderRadius: "12px" }}
              src="https://open.spotify.com/embed/artist/5iYiElMUXxQj6Mn8RDPImk?utm_source=generator"
              width="100%"
              height="450"
              scrolling="no"
              frameBorder="0"
              allow="autoplay; encrypted-media"
              className="shadow-xl"
            ></iframe>
          </motion.div>
        </motion.div>
        
        <div className="grid gap-12 max-w-5xl mx-auto">
          {tracksWithMerch.data?.map(({ track, relatedProducts }) => (
            <motion.div
              key={track.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-card rounded-xl shadow-lg overflow-hidden"
            >
              <div className="grid md:grid-cols-2 gap-0">
                <div className="p-6">
                  <h2 className="text-3xl font-bold mb-4">{track.title}</h2>
                  
                  {track.spotifyTrackId ? (
                    <iframe
                      src={`https://open.spotify.com/embed/track/${track.spotifyTrackId}`}
                      width="100%"
                      height="152"
                      frameBorder="0"
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      loading="lazy"
                      className="rounded-lg mb-4"
                    />
                  ) : (
                    <div className="mb-4">Track not available on Spotify</div>
                  )}
                </div>
                
                {relatedProducts.length > 0 && (
                  <div className="bg-accent/10 p-6 flex flex-col justify-center">
                    <h3 className="text-2xl font-semibold mb-3">Merchandise</h3>
                    <p className="text-muted-foreground mb-4">
                      Get official merchandise for "{track.title}"
                    </p>
                    <Link href={`/merchandise?track=${track.id}`}>
                      <Button className="gap-2 text-base" size="lg">
                        <ShoppingBag className="h-5 w-5" />
                        Shop {track.title} Merchandise
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
