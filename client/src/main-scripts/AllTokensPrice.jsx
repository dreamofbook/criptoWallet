import React, {useState} from "react";
import {getTokenPriceBinance} from "../../../server/scripts/erc20Service.js";
import tokens from './tokens.json'


export const AllTokensPrice = (refreshInterval = 60000) => {
	const [price, setPrice] = useState(0)
	const [error, setError] = useState(true)
	const [isLoading, setIsLoading] = useState(false)
	let arr = new Map()

	const feData = async () => {
		try {
			setIsLoading (true)
			for (const token of [{symbol: "ETH", address: null}, ...tokens]) {
				setError(true);
				try{
					const priceToken = await getTokenPriceBinance(token.symbol);
					setError(false);
					setPrice(priceToken);
					arr.set(token.symbol, {price: price? price : 0, error: error});
				} catch (err) {
					console.warn(err);
				} finally {
				}
			}
		} catch (err) {
			console.error(err);
		} finally {
			setIsLoading(false)
		}
	}

	React.useEffect(() => {
		feData();
		const interval = setInterval(feData, refreshInterval)
		return () => clearInterval(interval)
	}, [refreshInterval])


	return (arr);
};