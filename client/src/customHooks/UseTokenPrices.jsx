import React, { createContext, useContext, useEffect, useState } from 'react';
import { getTokenPriceBinance } from '../../../server/scripts/erc20Service.js';
import tokens from '../main-scripts/tokens.json';

const TokenPriceContext = createContext({});

export const TokenPriceProvider = ({ children }) => {
	const [prices, setPrices] = useState({});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const fetchPrices = async () => {
		setLoading(true);
		const result = {};

		try {
			const allTokens = [{ symbol: 'ETH', address: null}, ...tokens];
			for (const token of allTokens) {
				try {
					const price = await getTokenPriceBinance(token.symbol);
					result[token.symbol] = {
						price,
						error: false
					};
				} catch (e) {
					console.warn(`Ошибка загрузки курса ${token.symbol}:`, e);
					result[token.symbol] = {
						price: 0,
						error: true
					};
				}
			}
			setPrices(result);
			setError(null);
		} catch (e) {
			setError('Ошибка загрузки курсов.');
			console.error(e);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchPrices();
		const interval = setInterval(fetchPrices, 60000);
		return () => clearInterval(interval);
	}, []);

	const updateTokenPrice = (symbol, newPrice) => {
		setPrices(prev => ({
			...prev,
			[symbol]: {
				price: newPrice,
				error: false
			}
		}));
	};

	return (
		<TokenPriceContext.Provider value={{ prices, loading, error, updateTokenPrice }}>
			{children}
		</TokenPriceContext.Provider>
	);
};

export const useTokenPrices = () => useContext(TokenPriceContext);
