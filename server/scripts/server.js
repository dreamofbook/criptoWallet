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
		console.error('Proxy error (eth-chart):', err);
		res.status(500).json({ error: 'Proxy server failed' });
	}
});

let cachedPrice = null;
let lastFetchTime = 0;

app.get('/api/eth-price', async (req, res) => {
	const now = Date.now();
	const cacheTTL = 60 * 1000; // 1 минута

	if (cachedPrice && now - lastFetchTime < cacheTTL) {
		return res.json(cachedPrice);
	}

	try {
		const cgUrl = 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd,eur,gbp,rub';
		const response = await fetch(cgUrl);

		if (!response.ok) {
			return res.status(response.status).json({ error: 'CoinGecko error' });
		}

		const data = await response.json();
		cachedPrice = data;
		lastFetchTime = now;

		res.json(data);
	} catch (err) {
		console.error('Proxy error (eth-price):', err);
		res.status(500).json({ error: 'Failed to fetch ETH price' });
	}
});

app.listen(PORT, () => {
	console.log(`🚀 Proxy server is running at http://localhost:${PORT}`);
});
