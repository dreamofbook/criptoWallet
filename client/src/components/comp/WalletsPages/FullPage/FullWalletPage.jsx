import React, {useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";
import {formatEther, JsonRpcProvider} from "ethers";
import copyBtn from "../../../../assets/image/copyButton.svg";
import './fullWallet.css'
import TransactionDetails from "./transactions/TransactionDetails.jsx";
import {getTransactionHistory, setRpcUrl} from "../../../../main-scripts/balanceService.js";
import SendForm from "./Froms/SendForm.jsx";
import UseEthData from "../../../../customHooks/UseEthData.jsx";
import tokens from '../../../../main-scripts/tokens.json'
import {useTokenPrices} from "../../../../customHooks/UseTokenPrices.jsx";

const ETHERSCAN_API_KEY = 'DIXCF84GWNNBXIWUI33HFBCET1KXC3REH3';

const FullWalletPage = ({address, rpcUrl, addressesTokens}) => {

	const {t} = useTranslation();
	const [transactionActive, setTransactionActive] = useState(false);
	const [transactions, setTransactions] = useState([]);
	const [loadingTransactions, setLoadingTransactions] = useState(false);

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

	const copy = () => {
		const copyText = document.querySelector('.wallet .glass .address-box code')
		window.navigator.clipboard.writeText(copyText.textContent);
	}

	const { prices } = useTokenPrices(); // 🔧 добавлен хук получения централизованных цен
	const tokenList = addressesTokens.get(address.toString()) || [];



	return (
		<div className="full-wallet-component">
			{/*<div className="currency-selector">*/}
			{/*	<select value={currency} onChange={(e) => setCurrency(e.target.value)}>*/}
			{/*		{CURRENCY_OPTIONS.map((option, index) => (*/}
			{/*			<option key={index} value={option}>{option}</option>*/}
			{/*		))}*/}
			{/*	</select>*/}
			{/*</div>*/}
			<div className="wallet">
				<div className={"wallet-info glass"}>
					<div className={'address-box'}>
						<h4>{t('wallet-address')}: <code>{address}</code></h4>
						<button className="copy-btn" onClick={() => copy()}>
							<img src={copyBtn} alt=""/>
						</button>
					</div>
					<div className="balance-box">
						{tokenList.length > 0 ? (
							tokenList.map((token) => {
								const currentPrice = prices[token.symbol]?.price || 0;
								const valueUSD = token.balance * currentPrice;
								return (
									<div key={token.symbol} className={`token ${token.symbol}`}>
										{t('balance-value')}: {token.balance} {token.symbol}<br />
										{t('atThisRatePhrase')}: ${currentPrice}<br />
										{t('amountTokenPrice')}: ${valueUSD.toFixed(2)}
									</div>
								)
							})
						) : (
							<>Loading...</>
						)}
					</div>
				</div>
			</div>
			<SendForm fromAddress={address} tokens={tokens} rpcUrl={rpcUrl} allTokensPrice={prices}/>
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