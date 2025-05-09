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
				setTransactions(txs.slice(0, 5)); // Показываем последние 5 транзакций
			} catch (err) {
				console.error(err);
			} finally {
				setLoading(false);
			}
		}

		loadData();
	}, [address, rpcUrl]);

	if (loading) return <div>{t('loading') || 'Loading...'}</div>;

	return (
		<div>
			<h2>{t('balance')}: {balance} ETH</h2>
			{price && <p>≈ ${(parseFloat(balance) * price).toFixed(2)} USD</p>}

			<h3>{t('transactionHistory')}</h3>
			{transactions.length === 0 ? (
				<p>{t('noTransactions') || 'No transactions found.'}</p>
			) : (
				<ul>
					{transactions.map(tx => (
						<Transaction
							key={tx.id}
							from={tx.from}
							to={tx.to}
							time={tx.timeStamp.toLocaleString()}
							value={tx.value}
							error={tx.isError ? '❌' : '✅'}
						/>
					))}
				</ul>
			)}
		</div>
	);
};

export default WalletDashboard;
