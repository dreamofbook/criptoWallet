import { JsonRpcProvider } from 'ethers';
import { formatEther } from 'ethers';

let provider = null;

export function setRpcUrl(rpcUrl) {
	provider = new JsonRpcProvider(rpcUrl);
}

export async function getBalance(address) {
	if (!provider) throw new Error("Provider not initialized");
	const balanceWei = await provider.getBalance(address);
	return formatEther(balanceWei);
}

export async function getEthPrice() {
	try {
		const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd");
		const json = await res.json();
		return json.ethereum.usd;
	} catch (err) {
		return null;
	}
}

export async function getTransactionHistory(address, etherscanApiKey) {
	try {
		const url = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&sort=desc&apikey=${etherscanApiKey}`;
		const res = await fetch(url);
		const data = await res.json();
		if (data.status !== "1") return [];
		return data.result.map(tx => ({
			hash: tx.hash,
			from: tx.from,
			to: tx.to,
			value: formatEther(tx.value),
			timeStamp: new Date(tx.timeStamp * 1000),
			isError: tx.isError === "1"
		}));
	} catch (err) {
		return [];
	}
}
