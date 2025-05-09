import React, {useEffect, useState} from 'react';

const UseValidationSettings = (value, validations) => {
	const [isEmpty, setIsEmpty] = useState(true);
	const [isEthError, setIsEthError] = useState(false);
	const [isInputValid, setIsInputValid] = useState(false);

	useEffect(() => {
		for (const validation in validations) {
			switch (validation) {
				case 'isEmpty':
					value ? setIsEmpty(false) : setIsEmpty(true);
					break;

				case 'isEthError':
					const regEther = /^0x[0-9a-fA-F]{40}$/;
					regEther.test(String(value)) ? setIsEthError(false) : setIsEthError(true);
					break;

			}
		}
	}, [value])

	React.useEffect(() => {
		if (isEmpty || isEthError){
			setIsInputValid(true);
		} else {
			setIsInputValid(false);
		}
	}, [isEmpty, isEthError]);


	return {
		isEmpty, isEthError, isInputValid
	}
};

export default UseValidationSettings;