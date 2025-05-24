import React, {useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";
import {formatEther, JsonRpcProvider} from "ethers";
import copyBtn from "../../../../assets/image/copyButton.svg";
import './fullWallet.css'
import TransactionDetails from "./transactions/TransactionDetails.jsx";
import {getTransactionHistory, setRpcUrl} from "../../../../main-scripts/balanceService.js";
import SendForm from "./Froms/SendForm.jsx";
import UseEthData from "../../../../customHooks/UseEthData.jsx";

const ETHERSCAN_API_KEY = 'DIXCF84GWNNBXIWUI33HFBCET1KXC3REH3';
const CURRENCY_OPTIONS = ['USD', 'EUR', 'RUB', 'KZT'];

const FullWalletPage = ({address, rpcUrl}) => {

	const {t} = useTranslation();
	const [ethBalance, setEthBalance] = useState(null);
	// const [exchangeRate, setExchangeRate] = useState(null);
	const [currency, setCurrency] = useState("USD");
	const [transactionActive, setTransactionActive] = useState(false);

	const [transactions, setTransactions] = useState([]);
	const [loadingTransactions, setLoadingTransactions] = useState(false);

	const {price: exchangeRate} = UseEthData();

	React.useEffect( () => {
		async function loadData() {
			setLoadingTransactions(true);
			try {
				setRpcUrl(rpcUrl);
				const txs = await Promise.all([
					getTransactionHistory(address, ETHERSCAN_API_KEY),
				]);
				setTransactions(txs.slice(0, 20));
			} catch (err) {
				console.error(err);
			} finally {
				setLoadingTransactions(false);
			}
		}

		loadData();
	}, [transactionActive]);


	useEffect(() => {
		if (!address || !rpcUrl) return;
		const provider = new JsonRpcProvider(rpcUrl);
		provider.getBalance(address).then(balance => {
			setEthBalance(parseFloat(formatEther(balance)));
		});
	}, [address, rpcUrl]);

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
			<SendForm address={address} currency={currency} ethBalance={ethBalance} exchangeRate={exchangeRate}/>
			<div className="tran-sel">
				<button
					className="transaction-select"
					onClick={() => {
						setTransactionActive(!transactionActive)
						console.log(transactionActive)
					}}
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
					<div>
						{loadingTransactions? (
							<div className="error-message">
								{t('loading-transactionFALSE')}
							</div>
						) : (
							<div className="transactions-list">
								{transactions.map((tx, index) =>
									<TransactionDetails
										key={index}
										from={tx.from}
										to={tx.to}
										time={tx.timeStamp}
										value={tx.value}
										errorStatus={tx.isError ? '❌' : '✅'}
									/>
								)}
							</div>
						)}
					</div>
				):(
					<div className="transactions-noneactive">
					</div>
				)}
			</div>
		</div>
	);
};

export default FullWalletPage;