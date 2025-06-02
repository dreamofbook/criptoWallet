import React, {useMemo, useState} from 'react';
import {getAllWallets} from "../main-scripts/walletStorage.js";

const UseWallets = () => {

	const [walletsLoaded, setWalletsLoaded] = useState(false);
	const [wallets, setWallets] = useState([]);

	React.useEffect(() => {
		const loadWallets = async () => {
			const all = await getAllWallets();
			setWallets(all);
			setWalletsLoaded(true);
		};
		loadWallets();
	}, []);

	const res = useMemo(() => ({
		wallets,
		walletsLoaded
	}), [wallets, walletsLoaded]);

	return res;
};

export default UseWallets;