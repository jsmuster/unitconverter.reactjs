export class UserInfoModel
{
	constructor(obj: any = null)
	{

		this.user_name = '';
		this.user_type = '';
		this.token = '';
		if(obj != null)
		{
			Object.assign(this, obj);
		}
	}
}