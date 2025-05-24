import React, {useEffect, useState} from 'react';
import './wallets.css'
import {getAllWallets} from "../../../../main-scripts/walletStorage.js";
import WalletMini from './Wallet/Wallet-mini.jsx'
import CurrencyGraph from "./Canvas/CurrencyGraph.jsx";
import {useTranslation} from "react-i18next";
import {Link} from "react-router";
import UseEthData from '../../../../customHooks/UseEthData.jsx'

const CURRENCY_OPTIONS = ['USD', 'EUR'];

const Wallets = ({rpcUrl}) => {
	const {t} = useTranslation();
	const [wallets, setWallets] = useState([]);
	const [currency, setCurrency] = useState("USD");

	useEffect(() => {
		const loadWallets = async () => {
			const all = await getAllWallets();
			setWallets(all);
		};

		loadWallets();
	}, []);

	const { chart, price: exchangeRate, loading, error } = UseEthData(currency);

	return (
		<>
			{wallets.length?  (
				<div className={"wallets-box"}>
					<div className="wallets">
						<div className="currency-selector">
							<select value={currency} onChange={(e) => setCurrency(e.target.value)}>
								{CURRENCY_OPTIONS.map((option, index) => (
									<option key={index} value={option}>{option}</option>
								))}
							</select>
						</div>
						{wallets.map((wallet, index) =>
							<WalletMini
								key={index}
								address={wallet['address']}
								currency={currency}
								rpcUrl={rpcUrl}
								exchangeRate={exchangeRate}
							/>
						)}
					</div>
					<div className="canvasCard">
						{loading && <p>Загрузка графика...</p>}
						{error && <p style={{ color: 'red' }}>Ошибка: {error}</p>}
						{!loading && !error && <CurrencyGraph chartData={chart} />}
						{/*<CurrencyGraph currency={currency} data={chart} />*/}
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