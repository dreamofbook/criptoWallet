import React, {useEffect, useState} from 'react';
import * as bip39 from 'bip39';
import { Wallet, isAddress } from 'ethers'

const UseValidationSettings = (value, validations) => {
	const [isEmpty, setIsEmpty] = useState(true);
	const [isEthError, setIsEthError] = useState(false);
	const [isInputValid, setIsInputValid] = useState(false);
	const [passwordError, setPasswordError] = useState(false);
	const [bipError, setBipError] = useState(false);
	const [privateKeyError, setPrivateKeyError] = useState(false);

	useEffect(() => {
		for (const validation in validations) {
			switch (validation) {
				case 'isEmpty':
					value ? setIsEmpty(false) : setIsEmpty(true);
					break;

				case 'isEthError':
					setIsEthError(!isAddress(value.trim()));
					break;
				case 'passwordError':
					const regPass = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,1000}$/;
					regPass.test(String(value)) ? setPasswordError(false) : setPasswordError(true);
					break;
				case 'bipError':
					bip39.validateMnemonic(value.trim().toLowerCase()) ? setBipError(false) : setBipError(true);
					break;

				case 'privateKeyError':
					const key = value.trim().toLowerCase();
					const isFormatOk = /^0x[0-9a-f]{64}$/.test(key);
					setPrivateKeyError(!isFormatOk)
					try {
						new Wallet(key);
						setPrivateKeyError(false);
					} catch {
						setPrivateKeyError(true);
					}
					break;
			}
		}
	}, [value])

	React.useEffect(() => {
		if (isEmpty || isEthError || passwordError || bipError || privateKeyError) {
			setIsInputValid(false);
		} else {
			setIsInputValid(true);
		}
	}, [isEmpty, isEthError, passwordError, bipError, privateKeyError]);


	return {
		isEmpty, isEthError, isInputValid, passwordError, bipError, privateKeyError
	}
};

export default UseValidationSettings;