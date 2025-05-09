import React, { useState, useEffect } from 'react';
import WalletDashboard from '../components/comp/WalletDashBoard/WalletDashBoard.jsx';
import SettingsPanel from '../components/comp/SettingsPanel/SettingsPanel.jsx';

const App = () => {
	const [rpcUrl, setRpcUrl] = useState(sessionStorage.getItem('rpcUrl') || '');
	const [walletAddress, setWalletAddress] = useState('');

	// Пример: подставь адрес после импорта
	// useEffect(() => {
	// 	const savedWallet = sessionStorage.getItem('wallet');
	// 	if (savedWallet) {
	// 		const { address } = JSON.parse(savedWallet);
	// 		setWalletAddress('0x742d35Cc6634C0532925a3b844Bc454e4438f44e');
	// 	}
	// }, []);

	return (
		<div>
			<SettingsPanel onRpcChange={setRpcUrl} onAddressChange={setWalletAddress}/>
			{walletAddress ? (
				<WalletDashboard address={walletAddress} rpcUrl={rpcUrl} />
			) : (
				<p>Please import or generate wallet</p>
			)}
		</div>
	);
}

export default App;
