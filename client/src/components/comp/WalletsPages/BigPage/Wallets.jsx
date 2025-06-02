import React, {useEffect, useState} from 'react';
import './wallets.css'
import WalletMini from './Wallet/Wallet-mini.jsx'
import CurrencyGraph from "./Canvas/CurrencyGraph.jsx";
import {useTranslation} from "react-i18next";
import {Link} from "react-router";
import UseEthData from '../../../../customHooks/UseEthData.jsx'
import tokn from '../../../../main-scripts/tokens.json'
import LoadingPage from "../../../../main-comp/LoadingPage.jsx";
import {useTokenPrices} from "../../../../customHooks/UseTokenPrices.jsx";

const tokens = [{symbol: "ETH", address: null}, ...tokn];

const Wallets = ({rpcUrl, wallets, addressesTokens}) => {
	const {t} = useTranslation();
	const [currencyBase, setCurrencyBase] = useState("ETH");
	const [currencyQuote, setCurrencyQuote] = useState("USDT");
	const { chart, loading, error } = UseEthData(currencyBase, currencyQuote);
	const { prices } = useTokenPrices(); // 🔧 централизованное получение курсов

	return (
		<>
			{wallets.length?  (
				<div className={"wallets-box"}>
					<div className="wallets">
						<div className="selectors">
							<div className="currency-selector">
								<select value={currencyBase} onChange={(e) => setCurrencyBase(e.target.value)}>
									{tokens.map((token, index) => (
										<option key={index} value={token.symbol}>{token.symbol}</option>
									))}
								</select>
							</div>
							<div className="currency-selector">
								<select value={currencyQuote} onChange={(e) => setCurrencyQuote(e.target.value)}>
									{tokens.map((token, index) => (
										<option key={index} value={token.symbol}>{token.symbol}</option>
									))}
								</select>
							</div>
						</div>
						{addressesTokens.size > 0 ? (
							<>
								{wallets.map((wallet, index) =>
									<WalletMini
										key={index}
										address={wallet['address']}
										currency={{
											base: currencyBase,
											quote: currencyQuote,
										}}
										rpcUrl={rpcUrl}
										addressesTokens={addressesTokens}
										length={wallets.length}
									/>
								)}
							</>
						) : (
							<>
								<LoadingPage/>
							</>
						)}
					</div>
					<div className="canvasCard">
						{loading && <p>Загрузка графика...</p>}
						{error && <p style={{ color: 'red' }}>Ошибка: {error}</p>}
						{!loading && !error && <CurrencyGraph chartData={chart} />}
					</div>
				</div>
			) : (
				<div className="wallets-error">
					<Link to="/sign-form">
						{t('SingNav')}
					</Link> or
					<Link to="/auth-form">
						{t('wallets-error-import')}
					</Link>
					 wallet
				</div>
			)}
		</>
	);
};

export default Wallets;