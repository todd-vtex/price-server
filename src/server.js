"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
// Enable CORS for all routes
app.use((0, cors_1.default)());
// Base price from your current implementation
const BASE_PRICE = 3297.61;
app.get('/price', (req, res) => {
    try {
        // Calculate random price within range (±5%)
        const minPrice = BASE_PRICE * 0.95; // 5% below original
        const maxPrice = BASE_PRICE * 1.05; // 5% above original
        const currentPrice = Number((Math.random() * (maxPrice - minPrice) + minPrice).toFixed(2));
        const response = {
            currentPrice,
            originalPrice: BASE_PRICE,
            timestamp: new Date().toISOString()
        };
        console.log('Generated price:', response);
        res.json(response);
    }
    catch (error) {
        console.error('Error generating price:', error);
        res.status(500).json({ error: 'Failed to generate price' });
    }
});
// Health check endpoint
app.get('/', (req, res) => {
    res.json({ status: 'ok', message: 'Kitco price server is running' });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
