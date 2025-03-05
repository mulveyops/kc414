import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Music, Mic, HeadphonesIcon } from "lucide-react";

export function ServicesSection() {
  const services = [
    {
      icon: <HeadphonesIcon className="h-6 w-6" />,
      title: "DJ Services",
      description: "Professional DJ services for any event or venue"
    },
    {
      icon: <Mic className="h-6 w-6" />,
      title: "MC",
      description: "Experienced MC to keep your event energetic and engaging"
    },
    {
      icon: <Music className="h-6 w-6" />,
      title: "Live Performance",
      description: "Book a live performance for your next event"
    }
  ];

  return (
    <section id="services" className="container mx-auto px-4 py-16">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-3xl font-bold mb-8"
      >
        Services
      </motion.h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.map((service, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2 }}
          >
            <Card className="h-full">
              <CardHeader>
                <div className="mb-4">{service.icon}</div>
                <CardTitle>{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{service.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
