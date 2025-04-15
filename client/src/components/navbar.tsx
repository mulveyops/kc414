import { Link, useLocation } from "wouter";
import { ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";

export function Navbar() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/music", label: "Music" },
    { href: "/merchandise", label: "Merch" },
    { href: "/services", label: "Book Services" },
  ];

  return (
    <nav className="bg-card/50 backdrop-blur-sm sticky top-0 z-50 border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/">
            <a className="text-xl font-bold">KC414</a>
          </Link>
          <div className="flex gap-6">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <a
                  className={`text-sm transition-colors hover:text-primary ${
                    location === item.href ? "text-white" : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                </a>
              </Link>
            ))}
          </div>
          <Link href="/cart" className="relative">
            {(() => {
              const [count, setCount] = useState(0);

              useEffect(() => {
                const updateCartCount = () => {
                  const items = JSON.parse(localStorage.getItem('cart') || '[]');
                  setCount(items.length);
                };

                updateCartCount();
                window.addEventListener('cartUpdated', updateCartCount);
                window.addEventListener('storage', updateCartCount);
                return () => {
                  window.removeEventListener('cartUpdated', updateCartCount);
                  window.removeEventListener('storage', updateCartCount);
                };
              }, []);

              return (
                <>
                  <ShoppingCart className="h-5 w-5" />
                  {count > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      {count}
                    </span>
                  )}
                </>
              );
            })()}
          </Link>
        </div>
      </div>
    </nav>
  );
}