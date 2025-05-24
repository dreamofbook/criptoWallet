import React, {useState} from 'react';
import {getAllWallets} from "../main-scripts/walletStorage.js";

const UseWallets = () => {

	const [walletsLoaded, setWalletsLoaded] = useState(false);
	const [wallets, setWallets] = useState([]);

	React.useEffect(() => {
		loadWallets();
	}, [])

	const loadWallets = async () => {
		const all = await getAllWallets();
		setWallets(() => {
			const arr = [];
			all.forEach(wallets => {
				arr.push(wallets.address)
			})
			return arr;
		});
		setWalletsLoaded(true);
	};

	return {
		wallets, walletsLoaded
	}
};

export default UseWallets;