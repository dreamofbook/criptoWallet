import { getWalletFromDb } from './walletStorage.js';
import { decryptWallet } from './walletUtils.js';

export async function verifyWalletPassword(address, password) {
	try {
		const walletData = await getWalletFromDb(address.toLowerCase());
		if (!walletData || !walletData.encrypted) return false;

		const decryptedKey = await decryptWallet(walletData.encrypted, password);

		const isValid = /^0x[a-fA-F0-9]{64}$/.test(decryptedKey);
		return isValid;
	} catch (err) {
		return false;
	}
}
