const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

//set port for heroku env (if can't find port in env, use 3000)
const port = process.env.PORT || 3000;

var app = express();

hbs.registerPartials(__dirname + '/views/partials');

app.set('view engine', 'hbs');

//create http request handler

//__dirname = project root path
app.use(express.static(__dirname + '/public'));

//next: tell express when the middleware is done
//app would never move on until we call next
app.use((req, res, next) => {
	//store timestamp
	var now = new Date().toString();

	//create a logger
	var log = `${now}: ${req.method} ${req.url}`;
	console.log(`${now}: ${req.method} ${req.url}`);
	fs.appendFile('server.log', log + '\n', (err) => {
		if (err) {
			console.log('Unable to append to server.log');
		}
	});

	next();
});

//maintenance middleware
//every page would redirect to maintenance page
//If the maintenance is done, comment the maintenance code
// app.use((req, res, next) => {
// 	res.render('maintenance.hbs');
// });

hbs.registerHelper('getCurrentYear', () => {
	return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
	return text.toUpperCase();
});


//req: method, title, parameter...
//res: any data or code
app.get('/', (req, res) => {

	res.render('home.hbs', {
		pageTitle: 'Home Page',
		welcomeMessage: 'welcome to my site'
	});

	//res.send('<h1>Hello Express!</h1>');

	//return json data
	// res.send({
	// 	name: 'byakuinss',
	// 	likes: [
	// 		'Game',
	// 		'Movie'
	// 	]
	// })
});

app.get('/about', (req, res) => {
	//res.send('About Page');
	
	//inject data for dynamic parameter
	//render would search the files in the view folder
	res.render('about.hbs', {
		pageTitle: 'About Page'
	});
});

app.get('/project', (req, res) => {
	res.render('project.hbs', {
		pageTitle: 'Project Page'
	});
})

app.get('/bad', (req, res) => {
	res.send({
		error: '001',
		message: 'Unable to process your request.'
	});
})

//bind application port to the machine
app.listen(port, () => {
	console.log('Server is up on port 3000.');
});