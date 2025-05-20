// server.js
import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const PORT = 3001;

app.use(cors());

app.get('/api/eth-chart', async (req, res) => {
	try {
		const binanceURL = 'https://api.binance.com/api/v3/klines?symbol=ETHUSDT&interval=5m&limit=288';
		const response = await fetch(binanceURL);

		if (!response.ok) {
			return res.status(response.status).json({ error: 'Binance API error' });
		}

		const data = await response.json();
		res.json(data);
	} catch (err) {
		console.error('Proxy error:', err);
		res.status(500).json({ error: 'Proxy server failed' });
	}
});

app.listen(PORT, () => {
	console.log(`🚀 Proxy server is running at http://localhost:${PORT}`);
});
