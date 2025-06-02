import React from "react";
import './tokenSelector.css'
import {useTranslation} from "react-i18next";

const TokenSelector = ({ tokens, onChange, setActiveTokenIndex, selectedTokenAddress }) => {

	const {t} = useTranslation();

	return (
		<div className="token-selector">
			<label>
				{t('tokenSelectorLabel')}
			</label>
			<div className="tokens">
				<select
					value={selectedTokenAddress}
					onChange={(e) => {
						onChange(e.target.value);
						setActiveTokenIndex(e.target.selectedIndex);
					}}
					>
					{tokens.map((token) => (
						<option key={token.address} id={token.symbol} value={token.address}>
							{token.symbol}
						</option>
					))}
				</select>
			</div>
		</div>
	);
};

export default TokenSelector;
