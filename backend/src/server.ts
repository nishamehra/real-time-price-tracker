import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import axios from 'axios';
import cors from 'cors';
import stockRoutes from './routes/stock';
import { Stock } from './models/Stock';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/stocks', stockRoutes);

mongoose.connect(process.env.MONGODB_URI as string)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const fetchData = async () => {
  try {
    const response = await axios.post('https://api.livecoinwatch.com/coins/list', {
      currency: 'USD',
      sort: 'rank',
      order: 'ascending',
      offset: 0,
      limit: 5,
      meta: false
    }, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.LIVECOINWATCH_API_KEY as string
      }
    });

    const coins = response.data;

    for (const coin of coins) {
      const { code, rate, volume, cap, delta } = coin;
      const stock = new Stock({ code, rate, volume, cap, delta });
      await stock.save();
    }
  } catch (error) {
    console.error('Error fetching data: ', error);
  }
};

setInterval(fetchData, 5000);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
