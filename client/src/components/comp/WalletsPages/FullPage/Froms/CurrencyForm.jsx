import React, {useState} from 'react';
import './currencyForm.css'
import TokenSelector from "./TokenSelector.jsx";

const CurrencyForm = ({currencies, tokens, setSelectedTokenSymbol, setSelectedTokenAddress, selectedTokenAddress}) => {

	const [activeTokenIndex, setActiveTokenIndex] = useState('');

	React.useEffect(() => {
		setSelectedTokenSymbol(tokens[activeTokenIndex - 1]?.symbol || "ETH")
	}, [activeTokenIndex])

	return (
		<div className={'currency-box'}>
			<TokenSelector
				tokens={[{ symbol: "ETH", address: null }, ...tokens]}
				onChange={(symbol) => {
					setSelectedTokenAddress(symbol)
				}}
				setActiveTokenIndex={setActiveTokenIndex}
				selectedTokenAddress={selectedTokenAddress}
			/>
			<div className={'currency-inputs'}>
				<input
					type="number"
					className="eth-equal"
					value={currencies.currencyETH}
					placeholder={tokens[activeTokenIndex - 1]?.symbol || "ETH"}
					onChange={(e) =>  currencies.onChangeFirst(e)}
					onBlur={(e) =>  currencies.onBlurFirst(e)}
				/>
				<input
					type="number"
					className="currency-equal"
					value={currencies.currencyRate}
					placeholder={"USD"}
					onChange={(e) =>  currencies.onChangeSecond(e)}
					onBlur={(e) =>  currencies.onBlurSecond(e)}
				/>
			</div>
		</div>
	);
};

export default CurrencyForm;