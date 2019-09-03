class UserModel
{
	constructor(user_name, password, user_type)
	{
		this.user_name = user_name;
		this.password = password;
		this.user_type = user_type;
		this.token = null;

	}
}

module.exports = UserModel;