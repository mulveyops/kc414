import { useQuery } from "@tanstack/react-query";
import { type Product } from "@shared/schema";
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Link } from "wouter";
import { Button } from "./ui/button";

export function MerchSection() {
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const displayProducts = products?.slice(0, 3);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-secondary rounded w-1/4" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-secondary rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayProducts?.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card>
              <CardContent className="p-0">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
              </CardContent>
              <CardFooter className="flex flex-col items-start gap-2 p-4">
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-sm text-muted-foreground">{product.description}</p>
                <div className="flex justify-between items-center w-full">
                  <span className="font-bold">${product.price}</span>
                  <Link href={`/checkout/${product.id}`}>
                    <a className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90 transition">
                      Buy Now
                    </a>
                  </Link>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
      <div className="text-center mt-8">
        <Link href="/merchandise">
          <a>
            <Button variant="outline" size="lg">
              View All Merchandise
            </Button>
          </a>
        </Link>
      </div>
    </section>
  );
}