import { Wallet } from 'ethers';
import * as bip39 from 'bip39';
import { Buffer } from "buffer";

window.Buffer = Buffer;

export async function generateWallet(password) {
	const mnemonic = bip39.generateMnemonic();
	const wallet = Wallet.fromPhrase(mnemonic);
	const encrypted = await encryptWallet(wallet.privateKey, password);
	return { mnemonic, address: wallet.address, encrypted };
}

export async function importWalletFromMnemonic(mnemonic, password) {
	if (!bip39.validateMnemonic(mnemonic)) throw new Error('Invalid mnemonic');
	const wallet = Wallet.fromPhrase(mnemonic);
	const encrypted = await encryptWallet(wallet.privateKey, password);
	return { address: wallet.address, encrypted };
}

export async function importWalletFromPrivateKey(privateKey, password) {
	try {
		const wallet = new Wallet(privateKey);
		const encrypted = await encryptWallet(wallet.privateKey, password);
		return { address: wallet.address, encrypted };
	} catch (err) {
		throw new Error('Invalid private key');
	}
}

async function encryptWallet(privateKey, password) {
	const encoder = new TextEncoder();
	const keyMaterial = await window.crypto.subtle.importKey(
		'raw',
		encoder.encode(password),
		{ name: 'PBKDF2' },
		false,
		['deriveKey']
	);
	const salt = window.crypto.getRandomValues(new Uint8Array(16));
	const key = await window.crypto.subtle.deriveKey(
		{
			name: 'PBKDF2',
			salt,
			iterations: 100000,
			hash: 'SHA-256'
		},
		keyMaterial,
		{ name: 'AES-GCM', length: 256 },
		true,
		['encrypt']
	);
	const iv = window.crypto.getRandomValues(new Uint8Array(12));
	const encrypted = await window.crypto.subtle.encrypt(
		{ name: 'AES-GCM', iv },
		key,
		encoder.encode(privateKey)
	);
	return JSON.stringify({
		iv: Array.from(iv),
		salt: Array.from(salt),
		data: Array.from(new Uint8Array(encrypted))
	});
}

export async function decryptWallet(encryptedJson, password) {
	const decoder = new TextDecoder();
	const encoder = new TextEncoder();
	const parsed = JSON.parse(encryptedJson);

	const keyMaterial = await window.crypto.subtle.importKey(
		'raw',
		encoder.encode(password),
		{ name: 'PBKDF2' },
		false,
		['deriveKey']
	);
	const key = await window.crypto.subtle.deriveKey(
		{
			name: 'PBKDF2',
			salt: new Uint8Array(parsed.salt),
			iterations: 100000,
			hash: 'SHA-256'
		},
		keyMaterial,
		{ name: 'AES-GCM', length: 256 },
		true,
		['decrypt']
	);

	const decrypted = await window.crypto.subtle.decrypt(
		{ name: 'AES-GCM', iv: new Uint8Array(parsed.iv) },
		key,
		new Uint8Array(parsed.data)
	);
	return decoder.decode(decrypted);
}
