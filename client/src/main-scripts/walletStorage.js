import { openDB } from 'idb';

const DB_NAME = 'web3-wallet';
const STORE_NAME = 'wallets';

async function getDb() {
	return await openDB(DB_NAME, 1, {
		upgrade(db) {
			if (!db.objectStoreNames.contains(STORE_NAME)) {
				db.createObjectStore(STORE_NAME, { keyPath: 'address' });
			}
		}
	});
}

export async function saveWalletToDb(address, encrypted, isActive = true) {
	const db = await getDb();

	// деактивировать другие
	const all = await db.getAll(STORE_NAME);
	for (const w of all) {
		await db.put(STORE_NAME, { ...w, isActive: false });
	}

	await db.put(STORE_NAME, {
		address,
		encrypted,
		isActive,
		createdAt: Date.now()
	});
}

export async function getWalletFromDb(address) {
	const db = await getDb();
	console.log(db.get(STORE_NAME, address));
	return await db.get(STORE_NAME, address);
}

export async function getActiveWallet() {
	const db = await getDb();
	const all = await db.getAll(STORE_NAME);
	return all.find(w => w.isActive);
}

export async function getAllWallets() {
	const db = await getDb();
	return await db.getAll(STORE_NAME);
}

export async function deleteWalletFromDb(address) {
	const db = await getDb();
	await db.delete(STORE_NAME, address);
}