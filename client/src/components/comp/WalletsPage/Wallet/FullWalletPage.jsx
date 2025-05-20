import React, {useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";
import {formatEther, JsonRpcProvider} from "ethers";
import copyBtn from "../../../../assets/image/copyButton.svg";
import {Link} from "react-router";
import FastButtons from "../fastButtons/FastButtons.jsx";
import './fullWallet.css'
import Transaction from "../../WalletDashBoard/Transaction.jsx";


const CURRENCY_OPTIONS = ['USD', 'EUR', 'RUB', 'KZT', 'CNY'];

const FullWalletPage = ({address, rpcUrl}) => {

	const {t} = useTranslation();
	const [ethBalance, setEthBalance] = useState(null);
	const [exchangeRate, setExchangeRate] = useState(null);
	const [currency, setCurrency] = useState("USD");
	const [transactionActive, setTransactionActive] = useState(false);


	useEffect(() => {
		if (!address || !rpcUrl) return;
		const provider = new JsonRpcProvider(rpcUrl);
		provider.getBalance(address).then(balance => {
			setEthBalance(parseFloat(formatEther(balance)));
		});
	}, [address, rpcUrl]);

	useEffect(() => {
		if (!currency) return;
		fetch(`https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=${currency.toLowerCase()}`)
			.then(res => res.json())
			.then(data => setExchangeRate(data.ethereum[currency.toLowerCase()]))
			.catch(err => console.error('Ошибка получения курса', err));
	}, [currency]);

	const fiatValue = ethBalance && exchangeRate
		? (ethBalance * exchangeRate).toFixed(2)
		: '...';

	const copy = () => {
		const copyText = document.querySelector('.wallet .glass .address-box code')
		window.navigator.clipboard.writeText(copyText.textContent);
	}

	return (
		<div className="full-wallet-component">
			<div className="currency-selector">
				<select value={currency} onChange={(e) => setCurrency(e.target.value)}>
					{CURRENCY_OPTIONS.map((option, index) => (
						<option key={index} value={option}>{option}</option>
					))}
				</select>
			</div>
			<div className="wallet">
				<div className={"wallet-info glass"}>
					<div className={'address-box'}>
						<h4>{t('wallet-address')}: <code>{address}</code></h4>
						<button className="copy-btn" onClick={() => copy()}>
							<img src={copyBtn} alt=""/>
						</button>
					</div>
					<div className={'balance-box'}>
						<div className={"balance-value"}>
							{t('balance-value')}: <strong>{ethBalance} ETH</strong>
						</div>
						<div className={"finally-amount"}>
							<p>{t('finally-amount')}: <strong>{fiatValue} {currency}</strong></p>
						</div>
						<div className={'balance-currency'}>
							<span>{t('currency-value')}: {exchangeRate ? `${exchangeRate} ${currency}` : '...'} / ETH</span>
						</div>
					</div>
				</div>
			</div>
			<FastButtons address={address} isMini={false}/>
			<div className="tran-sel">
				<button
					className="transaction-select"
					onClick={() => setTransactionActive(!transactionActive)}
				>
					{transactionActive? (
							t('to-transaction-noneActive')
						) : (
							t('to-transaction-active')
					)}
				</button>
			</div>
			<div className="transactions-active">
				{transactionActive? (
					<div></div>
				):(
					<div></div>
				)}
			</div>
		</div>
	);
};

export default FullWalletPage;