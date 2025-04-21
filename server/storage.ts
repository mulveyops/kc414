import {
  type Product,
  type Track,
  type Booking,
  type ContactMessage,
  type InsertProduct,
  type InsertTrack,
  type InsertBooking,
  type InsertContactMessage,
} from "@shared/schema";

export interface IStorage {
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  getTracks(): Promise<Track[]>;
  getTrack(id: number): Promise<Track | undefined>;
  getRelatedProducts(trackId: number): Promise<Product[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
}

export class MemStorage implements IStorage {
  private products: Map<number, Product>;
  private tracks: Map<number, Track>;
  private bookings: Map<number, Booking>;
  private contactMessages: Map<number, ContactMessage>;
  private currentId: Record<string, number>;

  constructor() {
    this.products = new Map();
    this.tracks = new Map();
    this.bookings = new Map();
    this.contactMessages = new Map();
    this.currentId = { products: 1, tracks: 1, bookings: 1, messages: 1 };

    // Initialize with mock data
    this.initializeMockData();
  }

  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getTracks(): Promise<Track[]> {
    return Array.from(this.tracks.values());
  }

  async getTrack(id: number): Promise<Track | undefined> {
    return this.tracks.get(id);
  }

  async getRelatedProducts(trackId: number): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.relatedTrackId === trackId,
    );
  }

  async createBooking(booking: InsertBooking): Promise<Booking> {
    const id = this.currentId.bookings++;
    const newBooking = { ...booking, id };
    this.bookings.set(id, newBooking);
    return newBooking;
  }

  async createContactMessage(
    message: InsertContactMessage,
  ): Promise<ContactMessage> {
    const id = this.currentId.messages++;
    const newMessage = { ...message, id };
    this.contactMessages.set(id, newMessage);
    return newMessage;
  }

  private initializeMockData() {
    // Mock Tracks
    const mockTracks: InsertTrack[] = [
      {
        title: "F-150",
        audioUrl: "https://example.com/track1.mp3",
        coverUrl:
          "https://images.unsplash.com/photo-1517697471339-4aa32003c11a",
        spotifyTrackId: "35y6CibZz03nYN50l9hYs7",
      },
      {
        title: "Good Vibes No Drama",
        audioUrl: "https://example.com/track2.mp3",
        coverUrl:
          "https://images.unsplash.com/photo-1650783756081-f235c2c76b6a",
        spotifyTrackId: "0GBAlKy6JPxLSJCkpCzvJA",
      },
    ];

    // Create tracks first
    mockTracks.forEach((track) => {
      const id = this.currentId.tracks++;
      const sanitizedTrack = {
        ...track,
        id,
        spotifyTrackId: track.spotifyTrackId || null
      };
      this.tracks.set(id, sanitizedTrack);
    });

    // Mock Products with track relationships
    const mockProducts: (InsertProduct & { relatedTrackId?: number })[] = [
      {
        name: "F-150 Tee",
        description: "T-shirt featuring F-150 artwork",
        price: "10",
        size: "M",
        imageUrl:
          "https://images.unsplash.com/photo-1523381294911-8d3cead13475",
        category: "clothing",
        inStock: true,
        relatedTrackId: 1,
      },
      {
        name: "Good Vibes No Drama Hoodie",
        description: "Premium hoodie with Good Vibes No Drama art",
        price: "59.99",
        size: "L",
        imageUrl:
          "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9",
        category: "clothing",
        inStock: true,
        relatedTrackId: 2,
      },
    ];

    mockProducts.forEach((product) => {
      const id = this.currentId.products++;
      const sanitizedProduct = {
        ...product,
        id,
        inStock: product.inStock ?? true,
        relatedTrackId: product.relatedTrackId ?? null
      };
      this.products.set(id, sanitizedProduct);
    });
  }
}

export const storage = new MemStorage();
