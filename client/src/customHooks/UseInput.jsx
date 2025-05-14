import {useState} from 'react';
import UseValidationSettings from "./UseValidationSettings.jsx";

const UseInput = (initValue, validations) => {
	const [isDirty, setIsDirty] = useState(false);
	const [value, setValue] = useState('');
	const valid = UseValidationSettings(value, validations);

	const onChange = (e, onAddressChange) => {
		const valueInput = e.target.value;
		setValue(valueInput);
		if (onAddressChange) onAddressChange(valueInput);
		sessionStorage.setItem('address', valueInput);
	}

	const onBlur = () => {
		setIsDirty(true)
	}

	let errorMessage = '';

	if (isDirty){
		if (valid.isEmpty){
			errorMessage = 'Это поле не может быть пустым';
		} else if (valid.isEthError){
			errorMessage = 'Введите верный адрес ETH-кошелька';
		} else if (valid.passwordError){
			errorMessage = 'Длинна пароля должна составлять то 6 символов и должен включать в себя:\nМинимум 1 спец. символ (!@#$%^&*)\nМинимум одну цифру(0-9)\nМинимум одну заглавную букву(A-Z)\nТолько латинские буквы';
		} else if (valid.bipError){
			errorMessage = 'Неверная seed-фраза. Проверьте количество слов и порядок.';
		} else {
			errorMessage = '';
		}
	}

	return {
		value, onChange, onBlur, isDirty, errorMessage, ...valid
	}
};

export default UseInput;