"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storage = exports.MemStorage = void 0;
class MemStorage {
    constructor() {
        this.products = new Map();
        this.tracks = new Map();
        this.bookings = new Map();
        this.contactMessages = new Map();
        this.currentId = { products: 1, tracks: 1, bookings: 1, messages: 1 };
        // Initialize with mock data
        this.initializeMockData();
    }
    async getProducts() {
        return Array.from(this.products.values());
    }
    async getProduct(id) {
        return this.products.get(id);
    }
    async getTracks() {
        return Array.from(this.tracks.values());
    }
    async getTrack(id) {
        return this.tracks.get(id);
    }
    async getRelatedProducts(trackId) {
        return Array.from(this.products.values()).filter((product) => product.relatedTrackId === trackId);
    }
    async createBooking(booking) {
        const id = this.currentId.bookings++;
        const newBooking = { ...booking, id };
        this.bookings.set(id, newBooking);
        return newBooking;
    }
    async createContactMessage(message) {
        const id = this.currentId.messages++;
        const newMessage = { ...message, id };
        this.contactMessages.set(id, newMessage);
        return newMessage;
    }
    initializeMockData() {
        // Mock Tracks
        const mockTracks = [
            {
                title: "F-150",
                audioUrl: "https://example.com/track1.mp3",
                coverUrl: "https://images.unsplash.com/photo-1517697471339-4aa32003c11a",
                spotifyTrackId: "35y6CibZz03nYN50l9hYs7",
            },
            {
                title: "Good Vibes No Drama",
                audioUrl: "https://example.com/track2.mp3",
                coverUrl: "https://images.unsplash.com/photo-1650783756081-f235c2c76b6a",
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
        const mockProducts = [
            {
                name: "F-150 Tee",
                description: "T-shirt featuring F-150 artwork",
                price: "10",
                size: "M",
                imageUrl: "https://images.unsplash.com/photo-1523381294911-8d3cead13475",
                category: "clothing",
                inStock: true,
                relatedTrackId: 1,
            },
            {
                name: "Good Vibes No Drama Hoodie",
                description: "Premium hoodie with Good Vibes No Drama art",
                price: "59.99",
                size: "L",
                imageUrl: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9",
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
exports.MemStorage = MemStorage;
exports.storage = new MemStorage();
