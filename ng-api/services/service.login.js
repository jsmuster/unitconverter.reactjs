const UserModel = require("../models/model.user");
let Validator = require('fastest-validator');

let jwt = require('jsonwebtoken');
const config = require('../config.js');


let users = {};
let counter = 0;

/* create an instance of the validator */
let customerValidator = new Validator();

/* use the same patterns as on the client to validate the request */
let namePattern = /([A-Za-z\-\’])*/;
let zipCodePattern = /^[0-9]{5}(?:-[0-9]{4})?$/;
let passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$/;

/* user validator shema */
const userVSchema = {
	user_name: { type: "string", min: 1, max: 50, pattern: namePattern},
	password: { type: "string", min: 2, max: 50, pattern: passwordPattern}
};

const defaultRow = { 
  inputNumber: '', 
  inputUnitMeasureId: '',
  targetUnitMeasureId: '', 
  studentResponse: '',
  answerId: '',
  avaliableUnitMeasure: [
    { value: '', label: 'Select', group: true },
    { value: '', label: '--Temperature type--', group: true },
    { value: 'Celsius', label: 'Celsius' },
    { value: 'Kelvin', label: 'Kelvin' },
    { value: 'Fahrenheit', label: 'Fahrenheit' },
    { value: 'Rankine', label: 'Rankine' },
    { value: '', label: '--Volume type--', group: true },
    { value: 'Litres', label: 'Litres' },
    { value: 'Tablespoons', label: 'Tablespoons' },
    { value: 'Cubic inches', label: 'Cubic inches' },
    { value: 'Cups', label: 'Cups' },
    { value: 'Cubic feet', label: 'Cubic feet' },
    { value: 'Gallons', label: 'Gallons' },
  ],
  avaliableAnswers: [
    { value: '', label: 'Select', group: true },
    { value: 'Correct', label: 'Correct' },
    { value: 'Incorrect', label: 'Incorrect' },
    { value: 'Invalid', label: 'Invalid' }
  ] 
};

let dataTable = {
	rows: [
		{ 
		  inputNumber: '32', 
		  inputUnitMeasureId: '2',
		  targetUnitMeasureId: '3', 
		  studentResponse: '32',
		  answerId: '2',
		  avaliableUnitMeasure: [
		    { value: '', label: 'Select', group: true },
		    { value: '', label: '--Temperature type--', group: true },
		    { value: 'Celsius', label: 'Celsius' },
		    { value: 'Kelvin', label: 'Kelvin' },
		    { value: 'Fahrenheit', label: 'Fahrenheit' },
		    { value: 'Rankine', label: 'Rankine' },
		    { value: '', label: '--Volume type--', group: true },
		    { value: 'Litres', label: 'Litres' },
		    { value: 'Tablespoons', label: 'Tablespoons' },
		    { value: 'Cubic inches', label: 'Cubic inches' },
		    { value: 'Cups', label: 'Cups' },
		    { value: 'Cubic feet', label: 'Cubic feet' },
		    { value: 'Gallons', label: 'Gallons' },
		  ],
		  avaliableAnswers: [
		    { value: '', label: 'Select', group: true },
		    { value: 'Correct', label: 'Correct' },
		    { value: 'Incorrect', label: 'Incorrect' },
		    { value: 'Invalid', label: 'Invalid' }
		  ] 
		}
	]
};

/* static login service class */
class LoginService
{
	static create(data)
	{
		var vres = customerValidator.validate(data, userVSchema);
		/* validation failed */
		if(!(vres === true))
		{
			let errors = {}, item;

			for(const index in vres)
			{
				item = vres[index];

				errors[item.field] = item.message;
			}

			throw {
			    name: "ValidationError",
			    message: errors
			};
		}

		if(users[data.user_name] == null)
		{
			let user = new UserModel(data.user_name, data.password, data.user_type);

			users[user.user_name] = user;

			return user;
		}
		else
		{
			throw {
			    name: "UserError",
			    message: 'User by that user name already exists.'
			};
		}
	}

	static retrieve(userName)
	{
		if(users[userName] != null)
		{
			return users[userName];
		}
		else
		{
			throw new Error('Unable to retrieve a user by (userName:'+ userName +')');
		}
	}

	static update(userName, data)
	{
		if(users[userName] != null)
		{
			const user = users[userName];

			Object.assign(user, data);
		}
		else
		{
			throw new Error('Unable to retrieve a user by (userName:'+ userName +')');
		}
	}

	static delete(userName)
	{
		if(users[userName] != null)
		{
			delete users[userName];
		}
		else
		{
			throw new Error('Unable to retrieve a user by (userName:'+ userName +')');
		}
	}

	static increment(userName)
	{
		if(users[userName] != null)
		{
			const user = users[userName];

			/* handle edge case */
			if(user.counter == 0)
			{
				user.counter = 1;
			}
			else
			{
				/* calculate the current counter */
				user.counter = user.counter * 2;
			}

			/* calculate the next counter */
			user.nextCounter = user.counter * 2;

			return user;
		}
		else
		{
			throw new Error('Unable to retrieve a user by (userName:'+ userName +')');
		}
	}

	static login(data)
	{
		var vres = customerValidator.validate(data, userVSchema);

		/* validation failed for user login data */
		if(!(vres === true))
		{
			let errors = {}, item;

			for(const index in vres)
			{
				item = vres[index];

				errors[item.field] = item.message;
			}

			throw {
			    name: "ValidationError",
			    message: errors
			};
		}
		//debugger;
		let user = users[data.user_name];

		if(user != null)
		{
			/* if the user already exists within the user data */
			if(data.user_name == user.user_name && data.password == user.password)
			{
				// expires in 24 hours
		    	let token = jwt.sign({username: user.user_name}, config.secret, { expiresIn: '24h' } );

		    	user.token = token;

		    	// user.counter = 0;
		    	// user.nextCounter = 1;

		    	return user;
			}
			else
			{
				throw {
				    name: "AuthenticationError",
				    message: "Incorrect username or password"
				};
			}
		}
		else
		{
			throw {
			    name: "AuthenticationError",
			    message: "Authentication failed"
			};
		}
	}

	static getUsers() {
		return users;
	}


	static getDataTable() {
		return dataTable;
	}
	static changeRow(param) {
		const {id, property, value} = param;
		dataTable.rows[id][property] = value;

		return { id, row: dataTable.rows[id]}
	}
	static deleteRow({id}) {
		dataTable.rows.splice(id, 1);
		return id;
	}
	static addRow() {
		const defRow = JSON.parse(JSON.stringify(defaultRow));
		dataTable.rows.push(defRow);
		return dataTable;
	}
}

module.exports = LoginService;
