import { ethers } from "ethers";

const ERC20_ABI = [
	"function name() view returns (string)",
	"function symbol() view returns (string)",
	"function decimals() view returns (uint8)",
	"function totalSupply() view returns (uint256)",
	"function balanceOf(address) view returns (uint256)",
	"function transfer(address to, uint amount) returns (bool)",
	"function approve(address spender, uint amount) returns (bool)",
	"function allowance(address owner, address spender) view returns (uint256)",
	"function transferFrom(address from, address to, uint amount) returns (bool)"
];

export function getTokenContract(tokenAddress, providerOrSigner) {
	return new ethers.Contract(tokenAddress, ERC20_ABI, providerOrSigner);
}

export async function getTokenPriceBinance(symbol, quote = "USDT") {
	try {
		const pair = `${symbol}${quote}`;
		const url = `https://api.binance.com/api/v3/ticker/price?symbol=${pair}`;
		const res = await fetch(url);
		if (!res.ok) throw new Error("Binance API error");
		const data = await res.json();
		return parseFloat(data.price);
	} catch (err) {
		console.error(`Ошибка получения курса ${symbol}/${quote}:`, err.message);
		return null;
	}
}

export async function getTokenBalance(tokenAddress, userAddress, provider) {
	const contract = getTokenContract(tokenAddress, provider);
	const balance = await contract.balanceOf(userAddress);
	const decimals = await contract.decimals();
	return ethers.utils.formatUnits(balance, decimals);
}

export async function getTokenInfo(tokenAddress, provider) {
	const contract = getTokenContract(tokenAddress, provider);
	const [name, symbol, decimals] = await Promise.all([
		contract.name(),
		contract.symbol(),
		contract.decimals()
	]);
	return { name, symbol, decimals };
}

export async function sendToken(tokenAddress, to, amount, signer) {
	const contract = getTokenContract(tokenAddress, signer);
	const decimals = await contract.decimals();
	const parsedAmount = ethers.utils.parseUnits(amount.toString(), decimals);
	const tx = await contract.transfer(to, parsedAmount);
	return await tx.wait();
}

export async function approveToken(tokenAddress, spender, amount, signer) {
	const contract = getTokenContract(tokenAddress, signer);
	const decimals = await contract.decimals();
	const parsedAmount = ethers.utils.parseUnits(amount.toString(), decimals);
	const tx = await contract.approve(spender, parsedAmount);
	return await tx.wait();
}
