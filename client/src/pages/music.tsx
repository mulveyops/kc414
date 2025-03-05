import { useQuery } from "@tanstack/react-query";
import { type Track, type Product } from "@shared/schema";
import { AudioPlayer } from "@/components/ui/audio-player";
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Link } from "wouter";

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
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold mb-8"
        >
          KC414 Music
        </motion.h1>
        <div className="grid gap-8">
          {tracksWithMerch.data?.map(({ track, relatedProducts }) => (
            <motion.div
              key={track.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <AudioPlayer src={track.audioUrl} title={track.title} />

              {relatedProducts.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">Related Merchandise</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {relatedProducts.map((product) => (
                      <Card key={product.id} className="overflow-hidden">
                        <CardContent className="p-0">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-32 object-cover"
                          />
                        </CardContent>
                        <CardFooter className="p-4">
                          <div className="flex justify-between items-center w-full">
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-muted-foreground">${product.price}</p>
                            </div>
                            <Link href={`/checkout/${product.id}`}>
                              <a className="bg-primary text-primary-foreground px-3 py-1 rounded text-sm hover:bg-primary/90 transition">
                                Buy Now
                              </a>
                            </Link>
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
