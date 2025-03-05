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
      (product) => product.relatedTrackId === trackId
    );
  }

  async createBooking(booking: InsertBooking): Promise<Booking> {
    const id = this.currentId.bookings++;
    const newBooking = { ...booking, id };
    this.bookings.set(id, newBooking);
    return newBooking;
  }

  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const id = this.currentId.messages++;
    const newMessage = { ...message, id };
    this.contactMessages.set(id, newMessage);
    return newMessage;
  }

  private initializeMockData() {
    // Mock Tracks
    const mockTracks: InsertTrack[] = [
      {
        title: "Summer Nights",
        audioUrl: "https://example.com/track1.mp3", // This needs to be changed to real track URL
        coverUrl: "https://images.unsplash.com/photo-1517697471339-4aa32003c11a" // This needs to be changed to real cover art
      },
      {
        title: "City Lights",
        audioUrl: "https://example.com/track2.mp3", // This needs to be changed to real track URL
        coverUrl: "https://images.unsplash.com/photo-1650783756081-f235c2c76b6a" // This needs to be changed to real cover art
      }
    ];

    // Create tracks first
    mockTracks.forEach((track) => {
      const id = this.currentId.tracks++;
      this.tracks.set(id, { ...track, id });
    });

    // Mock Products with track relationships
    const mockProducts: (InsertProduct & { relatedTrackId?: number })[] = [
      {
        name: "Summer Nights Tee",
        description: "T-shirt featuring the Summer Nights album artwork",
        price: "29.99",
        imageUrl: "https://images.unsplash.com/photo-1523381294911-8d3cead13475",
        category: "clothing",
        inStock: true,
        relatedTrackId: 1 // Related to "Summer Nights" track
      },
      {
        name: "City Lights Hoodie",
        description: "Premium hoodie with City Lights album art",
        price: "59.99",
        imageUrl: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9",
        category: "clothing",
        inStock: true,
        relatedTrackId: 2 // Related to "City Lights" track
      }
    ];

    mockProducts.forEach((product) => {
      const id = this.currentId.products++;
      this.products.set(id, { ...product, id });
    });
  }
}

export const storage = new MemStorage();