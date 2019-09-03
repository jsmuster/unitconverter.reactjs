let express = require('express');
let LoginService = require('../services/service.login');
let defense = require('../defense.middleware');


function main()
{
	/* populate the login service with static data */
	let data = {user_name: 'jsmastery', password: 'Imustjs1', user_type: 'admin'};
	let dataa = {user_name: 'student1', password: 'Student1', user_type: 'user'};

	LoginService.create(data);
	LoginService.create(dataa);

	return router;
}

var router = express.Router();

/* GET user listing. */
router.get('/', async function(req, res, next)
{
	res.json({error: "Invalid User UID."});
});

router.post('/login', async (req, res, next) =>
{
	const data = req.body;
	debugger;

	try
	{
		const user = await LoginService.login(data);

		// created the user!
		return res.status(201).json({ success: true, user: user });
	}
	catch(err)
	{
		if (err.name === 'ValidationError')
		{
        	return res.status(400).json({ error: err.message });
		}
		else if (err.name === 'AuthenticationError')
		{
        	return res.status(401).json({ error: err.message });
		}

		// unexpected error
		return next(err);
	}
});

/* adds a new customer to the list */
router.post('/add', defense.validateToken, async (req, res, next) =>
{
	const data = req.body;

	try
	{
		const user = await LoginService.create(data);

		// created the user!
		return res.status(201).json({ success: true, user_name: user.user_name });
	}
	catch(err)
	{
		if(err.name === 'ValidationError')
		{
			// indicate problem with authorizing the user
        	return res.status(401).json({ error: err.message });
		}
		else if(err.name == "UserError")
		{
			// indicate conflict
			return res.status(409).json({ error: err.message });
		}

		// unexpected error
		return next(err);
	}
});

// router.use('/login/:id', defense.validateToken);

/* retrieves a user by user_name */
router.get('/login/:id', async (req, res, next) =>
{
	try
	{
		const user = await LoginService.retrieve(req.params.id);

		/* transform result into a json object */
		const nuser = {user_name: user.user_name, user_type: user.user_type}

		return res.json({ user: nuser });
	}
	catch(err)
	{
		// unexpected error
		return next("No such user logined");
	}
});

/* updates the user by user_name */
router.put('/login/:id', async (req, res, next) =>
{
	try
	{
		const user = await LoginService.update(req.params.id, req.body);

		/* transform result into a json object */
		const nuser = {user_name: user.user_name, counter: user.counter, nextCounter: user.nextCounter}

		return res.json({ user: nuser });
	}
	catch(err)
	{
		// unexpected error
		return next(err);
	}
});

/* removes the user from the user list by user_name */
router.delete('/login/:id', async (req, res, next) =>
{
	try
	{
		const user = await LoginService.delete(req.params.id);

		return res.json({success: true});
	}
	catch(err)
	{
		// unexpected error
		return next(err);
	}
});


router.get('/load-users', async (req,res,next) => {
	let users = await LoginService.getUsers();
	return  res.json({ user: users });
})



router.get('/getTable', async (req, res, next) => {
	let dataTable = await LoginService.getDataTable();
	return res.json(dataTable);
});

router.post('/changeRow', async (req, res, next) => {
	let {id, row} = await LoginService.changeRow(req.body);
	return res.json({success: true, id, row});
});

router.post('/deleteRow', async (req, res, next) => {
	let id  = await LoginService.deleteRow(req.body);
	return res.json({success: true, id: id});
});

router.get('/addRow', async (req, res, next) => {
	let newDataTable = await LoginService.addRow();
	return res.json({success: true, newDataTable: newDataTable});
});


module.exports = main();
