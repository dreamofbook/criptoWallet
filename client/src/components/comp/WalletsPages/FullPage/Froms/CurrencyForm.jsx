import React from 'react';
import downArrow from '../../../../../assets/image/downArrow.svg';
import './currencyForm.css'
import UseCurrencyInput from "../../../../../customHooks/UseCurrencyInput.jsx";

const CurrencyForm = ({currency, currencies}) => {

	return (
		<div className={'currency-box'}>
			<input
				type="number"
				className="eth-equal"
				value={currencies.currencyETH}
				placeholder={'ETH'}
				onChange={(e) =>  currencies.onChangeFirst(e)}
				onBlur={(e) =>  currencies.onBlurFirst(e)}
			/>
			<input
				type="number"
				className="currency-equal"
				value={currencies.currencyRate}
				placeholder={currency}
				onChange={(e) =>  currencies.onChangeSecond(e)}
				onBlur={(e) =>  currencies.onBlurSecond(e)}
			/>
		</div>
	);
};

export default CurrencyForm;