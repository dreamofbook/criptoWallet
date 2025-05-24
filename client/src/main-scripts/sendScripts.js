import { ethers } from 'ethers';
import { getWalletFromDb } from './walletStorage.js';
import { decryptWallet } from './walletUtils.js';

/**
 * Отправляет ETH с кошелька, зашифрованного в IndexedDB.
 *
 * @param {string} fromAddress - Адрес отправителя (ключ к walletStorage)
 * @param {string} password - Пароль для расшифровки приватного ключа
 * @param {string} toAddress - Адрес получателя
 * @param {string|number} amountEth - Сумма в ETH
 * @param {string} rpcUrl - RPC-URL (например, Infura, Alchemy, Ganache)
 * @returns {Promise<string>} - Хэш транзакции
 */
export async function sendEthTransactionFromStorage(fromAddress, password, toAddress, amountEth, rpcUrl) {
	try {
		// 1. Получаем зашифрованный ключ из IndexedDB
		const walletData = await getWalletFromDb(fromAddress.toLowerCase());

		if (!walletData) {
			throw new Error('Кошелёк не найден в хранилище');
		}

		// 2. Расшифровываем приватный ключ
		const decryptedPrivateKey = await decryptWallet(walletData.encrypted, password);

		if (!/^0x[a-fA-F0-9]{64}$/.test(decryptedPrivateKey)) {
			throw new Error('Неверный пароль или повреждённый ключ');
		}

		// 3. Инициализируем кошелёк и провайдер
		const provider = new ethers.JsonRpcProvider(rpcUrl);
		const wallet = new ethers.Wallet(decryptedPrivateKey, provider);

		// 4. Готовим и отправляем транзакцию
		const tx = {
			to: toAddress,
			value: ethers.parseEther(amountEth.toString()),
			gasLimit: 21000,
			maxFeePerGas: ethers.parseUnits('50', 'gwei'),
			maxPriorityFeePerGas: ethers.parseUnits('2', 'gwei'),
		};

		const txResponse = await wallet.sendTransaction(tx);
		console.log('⏳ Транзакция отправлена:', txResponse.hash);

		const receipt = await txResponse.wait();
		console.log('✅ Подтверждена в блоке:', receipt.blockNumber);

		return txResponse.hash;
	} catch (err) {
		console.error('❌ Ошибка при отправке:', err.message);
		throw err;
	}
}
