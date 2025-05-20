import React, {useEffect, useState} from 'react';
import {BrowserRouter, Route, Routes} from "react-router";
import WalletAuthForm from "../components/comp/AuthForm/WalletAuthForm.jsx";
import WalletLogin from "../components/comp/AuthForm/WalletLogin.jsx";
import MainPage from "./MainPage.jsx";
import {useTranslation} from "react-i18next";
import Wallets from "../components/comp/WalletsPage/Wallets.jsx";
import WalletMini from "../components/comp/WalletsPage/Wallet/Wallet-mini.jsx";
import {getAllWallets} from "../main-scripts/walletStorage.js";
import FullWalletPage from "../components/comp/WalletsPage/Wallet/FullWalletPage.jsx";
import {Wallet} from "ethers";
import UseWallets from "../customHooks/UseWallets.jsx";

const RoutingComp = () => {

	const [hasWallet, setHasWallet] = useState(false);
	const { t } = useTranslation();
	const [rpcUrl, setRpcUrl] = useState(sessionStorage.getItem('rpcUrl') || '');
	const [walletAddress, setWalletAddress] = useState('');

	const wall = UseWallets();

	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<MainPage onAddressChange={setWalletAddress} onRpcChange={setRpcUrl}/>}>
					<Route path="/auth-form" element={<WalletAuthForm onWalletReady={setWalletAddress}/>}/>
					<Route path="/sign-form" element={<WalletLogin address={walletAddress} onWalletReady={setWalletAddress}/>}/>
					<Route path={'/wallets'} element={<Wallets rpcUrl={rpcUrl}/>}/>
					{wall.walletsLoaded && (
						wall.wallets.map((address, index) =>
						<Route
							path={`/wallets/${address}`}
							key={index}
							element={<FullWalletPage address={address} rpcUrl={rpcUrl}/>}
						/>)
					)}
				</Route>
			</Routes>
		</BrowserRouter>
	);
};

export default RoutingComp;