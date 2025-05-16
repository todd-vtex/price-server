import express, { Request, Response } from 'express'
import cors from 'cors'

const app = express()

// Enable CORS for all routes
app.use(cors())

// Default base price if none is provided
const DEFAULT_BASE_PRICE = 3297.61

interface PriceResponse {
  currentPrice: number
  originalPrice: number
  timestamp: string
}

interface ErrorResponse {
  error: string
}

type PriceRequestQuery = {
  basePrice?: string
}

app.get('/price', async (req: Request<{}, PriceResponse | ErrorResponse, {}, PriceRequestQuery>, res: Response): Promise<void> => {
  try {
    // Get basePrice from query parameter or use default
    const basePriceStr = req.query.basePrice
    let basePrice = DEFAULT_BASE_PRICE

    if (basePriceStr !== undefined) {
      const parsedPrice = parseFloat(basePriceStr)
      
      // Validate the input price
      if (isNaN(parsedPrice)) {
        res.status(400).json({ 
          error: 'Invalid basePrice format. Must be a valid number.' 
        })
        return
      }
      
      if (parsedPrice <= 0) {
        res.status(400).json({ 
          error: 'Invalid basePrice value. Must be greater than 0.' 
        })
        return
      }
      
      basePrice = parsedPrice
    }

    // Calculate random price within range (±5%)
    const minPrice = basePrice * 0.95  // 5% below original
    const maxPrice = basePrice * 1.05  // 5% above original
    const currentPrice = Number((Math.random() * (maxPrice - minPrice) + minPrice).toFixed(2))

    const response: PriceResponse = {
      currentPrice,
      originalPrice: basePrice,
      timestamp: new Date().toISOString()
    }

    console.log('Generated price:', response)
    res.json(response)
  } catch (error) {
    console.error('Error generating price:', error)
    res.status(500).json({ error: 'Failed to generate price' })
  }
})

app.get('/', async (_req: Request, res: Response): Promise<void> => {
  res.json({ status: 'ok', message: 'Kitco price server is running' })
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
}) 