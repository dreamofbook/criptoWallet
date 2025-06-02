import React, {useMemo, useRef, useState} from 'react';
import {BrowserRouter, Route, Routes} from "react-router";
import WalletAuthForm from "../components/comp/AuthForm/WalletAuthForm.jsx";
import MainPage from "./MainPage.jsx";
import Wallets from "../components/comp/WalletsPages/BigPage/Wallets.jsx";
import FullWalletPage from "../components/comp/WalletsPages/FullPage/FullWalletPage.jsx";
import useWallets from "../customHooks/UseWallets.jsx";
import {ethers} from "ethers";
import {getTokenBalance, getTokenPriceBinance} from "../../../server/scripts/erc20Service.js";
import tokens from '../main-scripts/tokens.json'
import LoadingPage from "./LoadingPage.jsx";
import {TokenPriceProvider} from "../customHooks/UseTokenPrices.jsx";


const RoutingComp = ({}) => {

	const [rpcUrl, setRpcUrl] = useState('https://mainnet.infura.io/v3/4b2945248a5b4c7298d0323b52ceed8b');


	const basename = import.meta.env.MODE === 'development' ? '/' : '/redich.ru';

	const wall = useWallets();

	// const addressesTokensRef = useRef(new Map());
	const [addressesTokens, setAddressesTokens] = useState(new Map);

	const [tokenBalances, setTokenBalances] = useState([]);
	const [totalUSD, setTotalUSD] = useState(0);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const provider = useMemo(() => new ethers.JsonRpcProvider(rpcUrl), [rpcUrl]);

	React.useEffect(() => {
		if (wall.walletsLoaded){
			loadAssets();
		}
	}, [wall, provider]);

	const loadAssets = async () => {
		setLoading(true);
		setError("");

		const globalTokenList = [];
		let totalUsdSum = 0;

		for (const wallet of wall.wallets) {
			const address = wallet.address;
			try {
				let usdTotal = 0;
				const tokenList = [];

				const rawEth = await provider.getBalance(address);
				const eth = parseFloat(ethers.formatEther(rawEth));
				const ethPrice = await getTokenPriceBinance("ETH");
				const ethValueUSD = eth * ethPrice;
				usdTotal += ethValueUSD;

				tokenList.push({
					symbol: "ETH",
					balance: eth,
					price: ethPrice,
					valueUSD: ethValueUSD
				});

				for (const token of tokens) {
					try {
						const balance = await getTokenBalance(token.address, address, provider);
						const value = parseFloat(balance);
						if (value > 0) {
							const price = await getTokenPriceBinance(token.symbol);
							if (price) {
								const valueUSD = value * price;
								tokenList.push({
									symbol: token.symbol,
									balance: value,
									price,
									valueUSD
								});
								usdTotal += valueUSD;
							}
						}
					} catch (err) {
					}
				}

				setAddressesTokens(prev => {
					const newMap = new Map(prev);
					newMap.set(address.toString(), tokenList);
					return newMap;
				})
				globalTokenList.push(...tokenList);
				totalUsdSum += usdTotal;

			} catch (err) {
				console.warn("Ошибка при загрузке данных:", err.message);
				setError("Ошибка загрузки данных");
			}
		}

		setTokenBalances(globalTokenList);
		setTotalUSD(totalUsdSum);
		setLoading(false);
	};

	return (
		<TokenPriceProvider>
			<BrowserRouter basename={basename}>
				<Routes>
					{wall !== null? (
						<Route path="/" element={<MainPage onRpcChange={setRpcUrl} wallets={wall.wallets}/>}>
							<Route index element={<WalletAuthForm/>}/>
							<Route path={'/wallets'} element={<Wallets
								rpcUrl={rpcUrl}
								wallets={wall.wallets}
								addressesTokens={addressesTokens}
							/>}/>
							{wall.walletsLoaded && (
								wall.wallets.map((address, index) =>
								<Route
									path={`/wallets/fullpage/${address.address}`}
									key={index}
									element={<FullWalletPage address={address.address} rpcUrl={rpcUrl} addressesTokens={addressesTokens}/>}
								/>)
							)}
							<Route path={"*"} element={<WalletAuthForm />}/>
						</Route>
					) : (
						<Route index element={<LoadingPage/>}/>
					)}
				</Routes>
			</BrowserRouter>
		</TokenPriceProvider>
	);
};

export default RoutingComp;