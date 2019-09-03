import axios from 'axios';

import { UserInfoModel } from './user-data';

let user = new UserInfoModel();


class UserService {
	constructor() {
		this.bIsLoggedIn = false;
		this.setUserData = this.setUserData.bind(this);
		this.getUserData = this.getUserData.bind(this);
		this.isLoggedIn = this.isLoggedIn.bind(this);
		this.getDataTable = this.getDataTable.bind(this);

		let userData = JSON.parse(localStorage.getItem("userData"));

		if(userData != null && userData.user_name != null && userData.token != null) {
			user.user_name = userData.user_name;
			user.user_type = userData.user_type;


			this.bIsLoggedIn = true;
		}
	}


	setUserData(userData) {
		user.user_name = userData.user_name;
		user.user_type = userData.user_type;
		user.token = userData.token;
	}

	getUserData() {
		return user;
	}

	isLoggedIn() {
		return this.bIsLoggedIn;
	}

	getUser() {
		return user;
	}

	login(loginData, callBack) {
		axios.post('http://localhost:3000/api/v1/user/login', loginData).then(response => {
			let data = response.data;

			if(data.success === true) {

				this.setUserData(data.user);

				this.bIsLoggedIn = true;

				localStorage.setItem("userData", JSON.stringify(data.user));

				if(callBack != null) callBack(true, data.user)
			}
		}).catch(err => { 
			if(callBack != null) callBack(false,err) 
		});
	}

	logOut() {
	  	localStorage.removeItem("userData");
	  	this.bIsLoggedIn = false;
	  }  

	loadUser(callBack, user_name = null) {
		const userToLoad = user;
		if(userToLoad != null && userToLoad.user_name != null) {
			if(user_name != null) userToLoad.user_name = user_name;

			axios.get('http://localhost:3000/api/v1/user/login/' + userToLoad.user_name).then(response => {
				const data = response.data;

				if(data != null && data.user != null && data.user.user_name != null) {

					if(userToLoad.user_name === data.user.user_name) {
						if(callBack != null) callBack(true,data);
					}

					this.setUserData(data.user);
				} else {
					callBack(false,data);
					alert("There was an error at loading '/api/v1/user/" + userToLoad.user_name + "'")
				}

			}).catch(err => {alert('Opps, something went wrong: ' + err); callBack(false) });
		} else {
			if(callBack != null) callBack(false, userToLoad.user_name);
		}
	}


	getDataTable(callBack) {
		axios.get('http://localhost:3000/api/v1/user/getTable').then(response => {
			if(callBack != null) callBack(response.data);
		}).catch(err => alert('Opps, something went wrong: ' + err));
	}

	changeDataTableRow(id, property, value, callBack) {
		axios.post('http://localhost:3000/api/v1/user/changeRow', {id, property, value}).then(response => {
			if(response.data.success === true && callBack != null) callBack(response.data.id, response.data.row);
		}).catch(err => alert('Opps, something went wrong: ' + err));
		}

	removeRow(id, callBack) {
		axios.post('http://localhost:3000/api/v1/user/deleteRow', {id}).then(response => {
			if(response.data.success === true && callBack != null) callBack(response.data.id);
		}).catch(err => alert('Opps, something went wrong: ' + err));
	}
	addRow(callBack) {
		axios.get('http://localhost:3000/api/v1/user/addRow').then(response => {
			if(response.data.success === true && callBack != null) callBack(response.data.newDataTable);
		}).catch(err => alert('Opps, something went wrong: ' + err));
	}


}


let userService = new UserService();

export default userService;