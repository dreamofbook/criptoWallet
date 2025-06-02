import React, {useState} from 'react';
import {useTokenPrices} from "./UseTokenPrices.jsx";

const UseCurrencyInput = (firstValue, secondValue, selectedToken) => {

	const [currencyETH, setCurrencyETH] = useState(firstValue);
	const [currencyRate, setCurrencyRate] = useState(secondValue);

	const {prices} = useTokenPrices();
	const isPricesEmpty = Object.keys(prices).length === 0;
	const exchangeRate = !isPricesEmpty && prices[selectedToken]?.price;

	const onChangeFirst = (e) => {
		const value = e.target.value;
		setCurrencyRate(exchangeRate? value * exchangeRate : null);
		setCurrencyETH(value);
	}

	const onChangeSecond = (e) => {
		const value = e.target.value;
		setCurrencyRate(value);
		setCurrencyETH(exchangeRate? value / exchangeRate : null);
	}

	return {
		currencyETH, currencyRate, onChangeFirst, onChangeSecond
	};
};

export default UseCurrencyInput;