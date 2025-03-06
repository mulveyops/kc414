import { motion } from "framer-motion";

export function HeroSection() {
  // KC414's Spotify artist ID
  const spotifyArtistId = "5iYiElMUXxQj6Mn8RDPImk";

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1517697471339-4aa32003c11a)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.3)",
        }}
      />
      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold mb-6 text-white"
        >
          KC414
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl text-gray-300 mb-8"
        >
          Musician • DJ/MC • Designer
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col items-center gap-6"
        >
          <div className="flex gap-4">
            <a
              href="#music"
              className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition"
            >
              Listen Now
            </a>
            <a
              href="#merch"
              className="bg-secondary text-secondary-foreground px-6 py-3 rounded-lg hover:bg-secondary/90 transition"
            >
              Shop Merch
            </a>
          </div>
          <iframe
            style={{ borderRadius: "12px" }}
            src={
              "https://open.spotify.com/embed/artist/5iYiElMUXxQj6Mn8RDPImk?utm_source=generator"
            }
            width="100%"
            height="352"
            scrolling="no"
            frameBorder="0"
            allow="encrypted-media"
          ></iframe>
        </motion.div>
      </div>
    </section>
  );
}
