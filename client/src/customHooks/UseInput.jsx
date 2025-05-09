import React, {useState} from 'react';
import UseValidationSettings from "./UseValidationSettings.jsx";

const UseInput = (initValue, validations) => {
	const [isDirty, setIsDirty] = useState(false);
	const [address, setAddress] = useState('');
	const valid = UseValidationSettings(address, validations);

	const onChange = (e, onAddressChange) => {
		const value = e.target.value;
		setAddress(value);
		onAddressChange(value);
		sessionStorage.setItem('address', value);
	}

	const onBlur = (e) => {
		setIsDirty(true)
	}

	let errorMessage = '';

	if (isDirty){
		if (valid.isEmpty){
			errorMessage = 'Это поле не может быть пустым';
		} else if (valid.isEthError){
			errorMessage = 'Введите верный адрес ETH-кошелька';
		} else {
			errorMessage = '';
		}
	}

	console.log(valid);

	return {
		address, onChange, onBlur, isDirty, errorMessage, ...valid
	}
};

export default UseInput;