import React, { useEffect, useState } from 'react';
import { getBalance, getTransactionHistory, getEthPrice, setRpcUrl } from '../../../main-scripts/balanceService.js';
import { useTranslation } from 'react-i18next';
import Transaction from "./Transaction.jsx";
import './wallet.css'

const ETHERSCAN_API_KEY = 'DIXCF84GWNNBXIWUI33HFBCET1KXC3REH3'; // Замените на свой ключ

const WalletDashboard = ({ address, rpcUrl }) => {
	const { t } = useTranslation();
	const [balance, setBalance] = useState(null);
	const [price, setPrice] = useState(null);
	const [transactions, setTransactions] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!address || !rpcUrl) return;

		async function loadData() {
			setLoading(true);
			try {
				setRpcUrl(rpcUrl);
				const [bal, ethPrice, txs] = await Promise.all([
					getBalance(address),
					getEthPrice(),
					getTransactionHistory(address, ETHERSCAN_API_KEY),
				]);
				setBalance(bal);
				setPrice(ethPrice);
				setTransactions(txs.slice(0, 20));
			} catch (err) {
				console.error(err);
			} finally {
				setLoading(false);
			}
		}

		loadData();
	}, [address, rpcUrl]);

	if (loading) return <div>{t('loading')}</div>;

	return (
		<div className={'wallet-dash-board container'}>
			<div className="glass">
				{price ? <div className={'balance'}>
					<h3>{t('balance')}<br/> <span>{balance} ETH</span></h3>
					<p className={'equal'}>≈ ${(parseFloat(balance) * price).toFixed(2)} USD</p>
				</div> : null}

				<h3 className={'transactions'}>{t('transactionHistory')}</h3>
				{transactions.length === 0 ? (
					<p>{t('noTransactions') || 'No transactions found.'}</p>
				) : (
					<div>
						{transactions.map((tx, index) =>
							<Transaction
								key={index}
								from={tx.from}
								to={tx.to}
								time={tx.timeStamp.toLocaleString()}
								value={tx.value}
								errorStatus={tx.isError ? '❌' : '✅'}
							/>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default WalletDashboard;
