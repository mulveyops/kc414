
import { useQuery } from "@tanstack/react-query";
import { type Track, type Product } from "@shared/schema";
import { AudioPlayer } from "@/components/ui/audio-player";
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Link } from "wouter";
import { ShoppingBag } from "lucide-react";

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
            className="max-w-3xl mx-auto mb-16"
          >
            <iframe
              style={{ borderRadius: "12px" }}
              src="https://open.spotify.com/embed/artist/5iYiElMUXxQj6Mn8RDPImk?utm_source=generator"
              width="100%"
              height="352"
              scrolling="no"
              frameBorder="0"
              allow="autoplay; encrypted-media"
              className="shadow-xl"
            ></iframe>
          </motion.div>
        </motion.div>
        
        <div className="grid gap-12 max-w-4xl mx-auto">
          {tracksWithMerch.data?.map(({ track, relatedProducts }) => (
            <motion.div
              key={track.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-card p-6 rounded-xl shadow-lg"
            >
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3">
                  <img 
                    src={track.coverUrl} 
                    alt={track.title}
                    className="w-full aspect-square object-cover rounded-lg"
                  />
                </div>
                <div className="md:w-2/3 space-y-4">
                  <h2 className="text-3xl font-bold">{track.title}</h2>
                  
                  {track.spotifyTrackId ? (
                    <iframe
                      src={`https://open.spotify.com/embed/track/${track.spotifyTrackId}`}
                      width="100%"
                      height="152"
                      frameBorder="0"
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      loading="lazy"
                      className="rounded-lg"
                    />
                  ) : (
                    <AudioPlayer src={track.audioUrl} title={track.title} />
                  )}
                  
                  {relatedProducts.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex items-center gap-2 text-sm">
                        <ShoppingBag className="h-5 w-5" />
                        <Link href={`/merchandise?track=${track.id}`}>
                          <a className="text-primary hover:underline font-medium">
                            Shop {track.title} Merchandise
                          </a>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
