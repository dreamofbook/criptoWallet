import React, { useEffect, useState } from 'react';
import { getAllWallets, saveWalletToDb } from '../../../main-scripts/walletStorage.js';
import './WalletSelector.css';

const WalletSelector = ({ onAddressChange }) => {
	const [wallets, setWallets] = useState([]);
	const [active, setActive] = useState('');

	useEffect(() => {
		loadWallets();
	}, []);

	const loadWallets = async () => {
		const all = await getAllWallets();
		setWallets(all);
		const current = all.find(w => w.isActive);
		if (current) setActive(current.address);
	};

	const handleChange = async (e) => {
		const address = e.target.value;
		const selected = wallets.find(w => w.address === address);
		if (selected) {
			await saveWalletToDb(selected.address, selected.encrypted, true);
			setActive(selected.address);
			onAddressChange(selected.address);
		}
	};

	return (
		<div className="WalletSelector">
			<label>Кошелек:</label>
			<select value={active} onChange={handleChange}>
				{wallets.map(w => (
					<option key={w.address} value={w.address}>
						{w.address.slice(0, 6)}...{w.address.slice(-4)}
					</option>
				))}
			</select>
		</div>
	);
};

export default WalletSelector;
