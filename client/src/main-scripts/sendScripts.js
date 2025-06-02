import { ethers } from 'ethers';
import { getWalletFromDb } from './walletStorage.js';
import { decryptWallet } from './walletUtils.js';
import { sendToken, getTokenContract } from '../../../server/scripts/erc20Service.js';

/**
 * Отправляет ETH или токен с зашифрованного кошелька.
 *
 * @param {object} params
 * @param {string} params.fromAddress
 * @param {string} params.password
 * @param {string} params.toAddress
 * @param {string|number} params.amount
 * @param {string} params.rpcUrl
 * @param {string|null} [params.tokenAddress] — если null, отправляем ETH; если указан, отправляем токен
 * @returns {Promise<string>} — Хэш транзакции
 */
export async function sendAssetFromStorage({ fromAddress, password, toAddress, amount, rpcUrl, tokenAddress = null }) {
	try {
		const walletData = await getWalletFromDb(fromAddress);
		if (!walletData) throw new Error('Кошелёк не найден в хранилище');

		const decryptedPrivateKey = await decryptWallet(walletData.encrypted, password);
		console.log(decryptedPrivateKey);
		if (!/^0x[a-fA-F0-9]{64}$/.test(decryptedPrivateKey)) throw new Error('Неверный пароль или повреждённый ключ');

		const provider = new ethers.JsonRpcProvider(rpcUrl);
		const wallet = new ethers.Wallet(decryptedPrivateKey, provider);

		if (!amount || isNaN(amount)) {
			throw new Error("Сумма не указана или некорректна");
		}

		if (tokenAddress === null) {
			// Отправка ETH
			const tx = {
				to: toAddress,
				value: ethers.parseEther(amount.toString()),
				gasLimit: 21000,
				maxFeePerGas: ethers.parseUnits('50', 'gwei'),
				maxPriorityFeePerGas: ethers.parseUnits('2', 'gwei'),
			};
			const txResponse = await wallet.sendTransaction(tx);
			const receipt = await txResponse.wait();
			return txResponse.hash;
		} else {
			// Отправка ERC-20 токена
			const txReceipt = await sendToken(tokenAddress, toAddress, amount, wallet);
			return txReceipt.hash;
		}

	} catch (err) {
		console.error('❌ Ошибка при отправке актива:', err.message);
		throw err;
	}
}
