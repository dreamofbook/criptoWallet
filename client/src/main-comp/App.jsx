import React, { useState } from 'react';
import WalletDashboard from '../components/comp/WalletDashBoard/WalletDashBoard.jsx';
import SettingsPanel from '../components/comp/SettingsPanel/SettingsPanel.jsx';
import WalletAuthForm from "../components/comp/AuthForm/WalletAuthForm.jsx";
import WalletLogin from "../components/comp/AuthForm/WalletLogin.jsx";
import { useTranslation } from "react-i18next";
import '../styles/App.css'
import backgroundImg from '../assets/image/background.jpg';

const App = () => {
	const [hasWallet, setHasWallet] = useState(false);
	const { t } = useTranslation();
	const [rpcUrl, setRpcUrl] = useState(sessionStorage.getItem('rpcUrl') || '');
	const [walletAddress, setWalletAddress] = useState('');

	React.useEffect(() => {
		const stored = localStorage.getItem('wallet');
		if (stored) setHasWallet(true);
		console.log(stored);
	}, [])

	return (
		<div className={'app container'}>
			<img src={backgroundImg} className={'backgroundImg'} alt=""/>
			<SettingsPanel onRpcChange={setRpcUrl} onAddressChange={setWalletAddress}/>
			{!hasWallet? (
				<WalletAuthForm onWalletReady={setWalletAddress} />
				) : walletAddress ? (
				<WalletDashboard address={walletAddress} rpcUrl={rpcUrl} />
			) : (
				<WalletLogin onWalletReady={setWalletAddress} />
				// <div className={'import-plz'}>{t('import-plz')}</div>
			)}
		</div>
	);
}

export default App;
