import React from 'react'
import './Input.css'


function isInvalid({valid, touched, shouldValidate}) {
	return !valid && shouldValidate && touched
}

const Input = props => {

	const inputType = props.type || 'text';
	const cls = ['form-group', 'Input'];
	const htmlFor = inputType + '-' + Math.random();

	if (isInvalid(props)) {
		cls.push('invalid');
	}

	return (
		<div className={cls.join(' ')}>
			<label htmlFor={htmlFor} >{props.label}</label>
			<input
				className="form-control"
				type={inputType}
			 	id={htmlFor}
			 	value={props.value}
			 	onChange={props.onChange}
			 	placeholder={props.placeholder}
			 />

			 {isInvalid(props) ?  <span>{props.errorMessage || 'Provide valid value'}</span> : null}

			
		</div>
	)
}


export default Input