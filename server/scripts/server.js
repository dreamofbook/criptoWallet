// server.js
import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const PORT = 3001;

app.use(cors());


// ===========================
// 🚀 Новый маршрут: /api/eth-full
// ===========================

const supportedSymbols = {
	usd: 'ETHUSDT',
	eur: 'ETHEUR',
	rub: 'ETHRUB',
	kzt: 'ETHKZT'
};

let cachedFullDataByCurrency = {};
let lastFetchByCurrency = {};

app.get('/api/eth-full', async (req, res) => {

	const currency = (req.query.currency || 'usd').toLowerCase();
	const symbol = supportedSymbols[currency];

	if (!symbol) {
		return res.status(400).json({ error: `Unsupported currency: ${currency}` });
	}

	const now = Date.now();
	const cacheTTL = 60 * 1000; // 1 минутф кэш

	if (cachedFullDataByCurrency[currency] &&
		now - lastFetchByCurrency[currency] < cacheTTL) {
		return res.json(cachedFullDataByCurrency[currency]);
	}

	try {
		// 1. Получаем график
		const klineRes = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=5m&limit=288`);
		if (!klineRes.ok) throw new Error('Failed to fetch klines');
		const klineData = await klineRes.json();

		const chart = klineData.map(kline => ({
			x: kline[0], // timestamp (open time)
			y: parseFloat(kline[4]) // close price
		}));

		// 2. Получаем текущую цену
		const tickerRes = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`);
		if (!tickerRes.ok) throw new Error('Failed to fetch ticker');
		const tickerData = await tickerRes.json();
		const lastPrice = parseFloat(tickerData.price);

		// 3. Добавляем финальную точку
		chart.push({
			x: Date.now(),
			y: lastPrice
		});

		const result = {
			// symbol: 'ETHUSDT',
			// lastPrice,
			// chart
			symbol,
			currency,
			lastPrice,
			chart
		};

		cachedFullDataByCurrency[currency] = result;
		lastFetchByCurrency[currency] = now;

		res.json(result);
	} catch (err) {
		console.error('❌ /api/eth-full error:', err.message);
		res.status(500).json({ error: 'Failed to fetch full ETH data' });
	}
});


app.listen(PORT, () => {
	console.log(`🚀 Proxy server running at http://localhost:${PORT}`);
});
