import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStocks } from './store/stockSlice';
import { AppDispatch, RootState } from './store';

const App: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const stocks = useSelector((state: RootState) => state.stocks.items);
  const [selectedStock, setSelectedStock] = useState<string>('');

  useEffect(() => {
    dispatch(fetchStocks());
    const intervalId = setInterval(() => {
      dispatch(fetchStocks());
    }, 5000);

    return () => clearInterval(intervalId);
  }, [dispatch]);

  return (
    <div>
      <h1>Real-time Stock Prices</h1>
      <table>
        <thead>
          <tr>
            <th>Code</th>
            <th>Rate</th>
            <th>Volume</th>
            <th>Market Cap</th>
            <th>Delta (1hr)</th>
            <th>Delta (24hr)</th>
            <th>Delta (7d)</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock: any) => (
            <tr key={stock._id}>
              <td>{stock.code}</td>
              <td>{stock.rate}</td>
              <td>{stock.volume}</td>
              <td>{stock.cap}</td>
              <td>{stock.delta.hour}</td>
              <td>{stock.delta.day}</td>
              <td>{stock.delta.week}</td>
              <td>{new Date(stock.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => setSelectedStock('')}>Change Stock/Crypto</button>
      <div>
        <input type="text" value={selectedStock} onChange={(e) => setSelectedStock(e.target.value)} />
        <button onClick={() => dispatch(fetchStocks(selectedStock))}>Fetch Data</button>
      </div>
    </div>
  );
};

export default App;
