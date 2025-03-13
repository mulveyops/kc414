
import { motion } from "framer-motion";
import { Card } from "./ui/card";

export function BioSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-3xl font-bold mb-6 text-center">About KC414</h2>
          
          <Card className="p-6 shadow-lg">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/3">
                <img 
                  src="/IMG_2586.jpeg" 
                  alt="KC414" 
                  className="w-full h-auto rounded-lg shadow-md object-cover aspect-square"
                />
              </div>
              
              <div className="md:w-2/3 space-y-4">
                <p className="text-lg">
                  KC414 is a multi-talented artist based in the heart of the electronic music scene. With a unique blend of production styles and an ear for innovative sounds, KC414 has been crafting memorable tracks that resonate with audiences worldwide.
                </p>
                
                <p>
                  From high-energy performances as a DJ/MC to crafting custom soundscapes in the studio, KC414 brings passion and creativity to every project. Beyond music, KC414 extends artistic vision into merchandise design, creating a cohesive brand experience for fans.
                </p>
                
                <p>
                  With influences ranging from classic electronic pioneers to contemporary underground scenes, KC414's sound continues to evolve while maintaining a distinctive signature style that fans have come to love.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
