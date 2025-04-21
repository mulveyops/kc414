import { useQuery } from "@tanstack/react-query";
import { type Track, type Product } from "@shared/schema";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Link } from "wouter";
import { ShoppingBag } from "lucide-react";

interface TrackWithMerch {
  track: Track;
  relatedProducts: Product[];
}

interface MusicSectionProps {
  preview?: boolean;
}

export function MusicSection({ preview }: MusicSectionProps) {
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

  const displayTracks = preview 
    ? tracksWithMerch.data?.slice(0, 2) 
    : tracksWithMerch.data;

  return (
    <section id="music" className="container mx-auto px-4 py-16">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-3xl font-bold mb-8"
      >
        Latest Tracks
      </motion.h2>
      <div className="grid gap-8">
        {displayTracks?.map(({ track, relatedProducts }) => (
          <motion.div
            key={track.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            {track.spotifyTrackId ? (
              <iframe
                src={`https://open.spotify.com/embed/track/${track.spotifyTrackId}?utm_source=generator`}
                width="100%"
                height="352"
                frameBorder="0"
                allowFullScreen
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="rounded-lg"
                style={{ borderRadius: "12px" }}
              />
            ) : (
              <div className="bg-card p-4 rounded-lg text-muted-foreground">
                Track not available on Spotify
              </div>
            )}
            {relatedProducts.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ShoppingBag className="h-4 w-4" />
                <Link href={`/merchandise?track=${track.id}`}>
                  <a className="hover:text-primary transition-colors">
                    Shop {track.title} Merchandise
                  </a>
                </Link>
              </div>
            )}
          </motion.div>
        ))}
      </div>
      {preview && (
        <div className="text-center mt-8">
          <Link href="/music">
            <Button variant="outline" size="lg">
              View All Tracks
            </Button>
          </Link>
        </div>
      )}
    </section>
  );
}