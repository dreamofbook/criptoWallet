import React, { useEffect, useState } from 'react';
import { JsonRpcProvider, formatEther } from 'ethers';
import './wallet-mini.css';
import {Link} from "react-router";
import {useTranslation} from "react-i18next";
import copyBtn from '../../../../assets/image/copyButton.svg'
import FastButtons from "../fastButtons/FastButtons.jsx";

const WalletMini = ({ address, rpcUrl, currency }) => {
	const {t} = useTranslation();
	const [ethBalance, setEthBalance] = useState(null);
	const [exchangeRate, setExchangeRate] = useState(null);

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
		<div className="wallet-component">
			<div className="wallet">
				<div className="glass">
					<div className={"wallet-info"}>
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
					<div className="btnLink">
						<Link to={`/wallets/${address}`}>
							<div className="toWallet-btn">
								{t("toWallet-btn")}
							</div>
						</Link>
					</div>
				</div>
			</div>
			<FastButtons address={address} isMini={true}/>
		</div>
	);
};

export default WalletMini;
