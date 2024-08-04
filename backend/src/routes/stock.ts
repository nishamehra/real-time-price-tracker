import { Router } from 'express';
import { Stock } from '../models/Stock';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { code } = req.query;
    const query = code ? { code } : {};
    const stocks = await Stock.find(query).sort({ timestamp: -1 }).limit(20);
    res.json(stocks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;
