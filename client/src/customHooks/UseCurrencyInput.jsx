import React, {useState} from 'react';
import UseInput from "./UseInput.jsx";

const UseCurrencyInput = (firstValue, secondValue, ethBalance, exchangeRate) => {

	const [isDirtyFirst, setIsDirtyFirst] = useState(false);
	const [isDirtySecond, setIsDirtySecond] = useState(false);
	const [currencyETH, setCurrencyETH] = useState(firstValue);
	const [currencyRate, setCurrencyRate] = useState(secondValue);
	const [isEmptyFirst, setIsEmptyFirst] = useState(false);
	const [isEmptySecond, setIsEmptySecond] = useState(false);

	const [active, setActive] = useState(null);

	const onChangeFirst = (e) => {
		const value = e.target.value;
		setCurrencyRate(value * exchangeRate);
		setCurrencyETH(value);
		value? setIsEmptyFirst(true) : setIsDirtyFirst(false);
	}

	const onChangeSecond = (e) => {
		const value = e.target.value;
		setCurrencyRate(value);
		setCurrencyETH(value / exchangeRate);
		value? setIsEmptySecond(true) : setIsDirtySecond(false);
	}

	const onBlurFirst = () => {
		setIsDirtyFirst(true);
	}

	const onBlurSecond = () => {
		setIsDirtySecond(true);
	}



	return {
		currencyETH, currencyRate, onChangeFirst, onChangeSecond, onBlurFirst, onBlurSecond,
	};
};

export default UseCurrencyInput;