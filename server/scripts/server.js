// server.js
import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const PORT = 3001;

app.use(cors());

const allowedTokens = [
	"USDT", "USDC", "DAI", "WETH", "LINK",
	"UNI", "AAVE", "MKR", "COMP", "MATIC"
];

let cachedFullDataByPair = {};
let lastFetchByPair = {};

app.get('/api/eth-full', async (req, res) => {
	const base = (req.query.base || "ETH").toUpperCase();
	const quote = (req.query.quote || "USDT").toUpperCase();

	const symbol = `${base}${quote}`;
	const reverseSymbol = `${quote}${base}`;
	const now = Date.now();
	const cacheTTL = 60 * 1000;

	if (
		cachedFullDataByPair[symbol] &&
		now - lastFetchByPair[symbol] < cacheTTL
	) {
		return res.json(cachedFullDataByPair[symbol]);
	}

	try {
		const klineRes = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=5m&limit=288`);
		if (!klineRes.ok) throw new Error("Ошибка запроса Kline данных");
		const klineData = await klineRes.json();

		const chart = klineData.map(kline => ({
			x: kline[0],
			y: parseFloat(kline[4])
		}));

		const tickerRes = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`);
		if (!tickerRes.ok) throw new Error("Ошибка запроса текущей цены");
		const tickerData = await tickerRes.json();

		const result = {
			base,
			quote,
			lastPrice: parseFloat(tickerData.price),
			chart
		};

		cachedFullDataByPair[symbol] = result;
		lastFetchByPair[symbol] = now;

		return res.json(result);
	} catch (err) {
		console.warn(err.message);
		const klineRes = await fetch(`https://api.binance.com/api/v3/klines?symbol=${reverseSymbol}&interval=5m&limit=288`);
		if (!klineRes.ok) throw new Error("Ошибка запроса Kline данных");
		const klineData = await klineRes.json();

		const chart = klineData.map(kline => ({
			x: kline[0],
			y: parseFloat(kline[4])
		}));

		const tickerRes = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${reverseSymbol}`);
		if (!tickerRes.ok) throw new Error("Ошибка запроса текущей цены");
		const tickerData = await tickerRes.json();

		const result = {
			base,
			quote,
			lastPrice: parseFloat(tickerData.price),
			chart
		};

		cachedFullDataByPair[symbol] = result;
		lastFetchByPair[symbol] = now;

		return res.json(result);
	}
});


app.listen(PORT, () => {
	console.log(`🚀 Proxy server running at http://localhost:${PORT}`);
});
