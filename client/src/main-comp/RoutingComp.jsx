import React, {useState} from 'react';
import {BrowserRouter, Route, Routes} from "react-router";
import WalletAuthForm from "../components/comp/AuthForm/WalletAuthForm.jsx";
import MainPage from "./MainPage.jsx";
import Wallets from "../components/comp/WalletsPages/BigPage/Wallets.jsx";
import FullWalletPage from "../components/comp/WalletsPages/FullPage/FullWalletPage.jsx";
import UseWallets from "../customHooks/UseWallets.jsx";

const RoutingComp = () => {

	const [rpcUrl, setRpcUrl] = useState(sessionStorage.getItem('rpcUrl') || '');

	const wall = UseWallets();

	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<MainPage onRpcChange={setRpcUrl} wallets={wall.wallets} />}>
					<Route path={"/auth-form"} element={<WalletAuthForm/>}/>
					<Route path={'/wallets'} element={<Wallets rpcUrl={rpcUrl}/>}/>
					{wall.walletsLoaded && (
						wall.wallets.map((address, index) =>
						<Route
							path={`/wallets/fullpage/${address}`}
							key={index}
							element={<FullWalletPage address={address} rpcUrl={rpcUrl}/>}
						/>)
					)}
					<Route path={"/*"} element={<WalletAuthForm />}/>
				</Route>
			</Routes>
		</BrowserRouter>
	);
};

export default RoutingComp;