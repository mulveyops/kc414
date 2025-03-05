import { useQuery } from "@tanstack/react-query";
import { type Track } from "@shared/schema";
import { AudioPlayer } from "./ui/audio-player";
import { motion } from "framer-motion";

export function MusicSection() {
  const { data: tracks, isLoading } = useQuery<Track[]>({
    queryKey: ["/api/tracks"],
  });

  if (isLoading) {
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
        {tracks?.map((track) => (
          <motion.div
            key={track.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <AudioPlayer src={track.audioUrl} title={track.title} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
