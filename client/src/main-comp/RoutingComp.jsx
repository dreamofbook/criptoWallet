import React, {useState} from 'react';
import {BrowserRouter, Route, Routes} from "react-router";
import WalletAuthForm from "../components/comp/AuthForm/WalletAuthForm.jsx";
import WalletLogin from "../components/comp/AuthForm/WalletLogin.jsx";
import SettingsPanel from "../components/comp/SettingsPanel/SettingsPanel.jsx";
import MainPage from "./MainPage.jsx";
import {useTranslation} from "react-i18next";
import Wallets from "../components/comp/WalletsPage/Wallets.jsx";
import Wallet from "../components/comp/WalletsPage/Wallet/Wallet.jsx";

const RoutingComp = () => {

	const [hasWallet, setHasWallet] = useState(false);
	const { t } = useTranslation();
	const [rpcUrl, setRpcUrl] = useState(sessionStorage.getItem('rpcUrl') || '');
	const [walletAddress, setWalletAddress] = useState('');

	React.useEffect(() => {
		const stored = localStorage.getItem('wallet');
		if (stored) setHasWallet(true);
	}, [])

	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<MainPage onAddressChange={setWalletAddress} onRpcChange={setRpcUrl}/>}>
					<Route path="/auth-form" element={<WalletAuthForm onWalletReady={setWalletAddress}/>}/>
					<Route path="/sign-form" element={<WalletLogin address={walletAddress} onWalletReady={setWalletAddress}/>}/>
					<Route path={'/wallets'} element={<Wallets rpcUrl={rpcUrl}/>}>
						<Route path={`asd`} element={<Wallet/>}/>
					</Route>
				</Route>
			</Routes>
		</BrowserRouter>
	);
};

export default RoutingComp;