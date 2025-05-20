import React, {useEffect, useState} from 'react';
import './wallets.css'
import {getAllWallets} from "../../../main-scripts/walletStorage.js";
import WalletMini from './Wallet/Wallet-mini.jsx'
import CurrencyGraph from "./Canvas/CurrencyGraph.jsx";
import {useTranslation} from "react-i18next";
import {Link} from "react-router";

const CURRENCY_OPTIONS = ['USD', 'EUR', 'RUB', 'KZT', 'CNY'];

const Wallets = ({rpcUrl}) => {
	const {t} = useTranslation();
	const [wallets, setWallets] = useState([]);
	const [currency, setCurrency] = useState("USD");

	useEffect(() => {
		loadWallets();
	}, );

	const loadWallets = async () => {
		const all = await getAllWallets();
		setWallets(all);
	};



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
							/>
						)}
					</div>
					<div className="canvasCard">
						<CurrencyGraph currency={currency} />
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