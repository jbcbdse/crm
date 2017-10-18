"use strict";

// use FastCGI instead of the HTTP module
const fcgi = require('node-fastcgi');
const express = require("express");
const path = require("path");
const session = require("express-session");
const MySQLStore = require("express-mysql-session");
const expressVue = require("express-vue");
const Model = require("./models");

if("DBPASS" in process.env) {
	// this gets the DBPASS out of global vars immediately when the process starts
	// that means that dumping process.env will not dump the DBPASS
	// and setting it to a function means that dumping Model will also not dump the DBPASS, since it will dump [Function]
	// the var only exists as a let var local to this tiny block
	let DBPASS = process.env.DBPASS;
	Model.DBPASS = () => DBPASS;
	delete process.env.DBPASS;
}

let app = express();

// set up express session middleware using the same mysql DB credentials
// if(false) 
{ 
	let options = {
		host: process.env.DBHOST, 
		user: process.env.DBUSER,
		password: Model.DBPASS(), 
		database: process.env.DBNAME
	};
	let sessionStore = new MySQLStore(options);
	app.use(session({
		secret: "this is a terrible secret", 
		cookie: {}, 
		resave: false, 
		saveUninitialized: false, 
		store: sessionStore
	}));
}

app.all("*", (req, res, next) => {
	res.sendStatus(404);
});

process.stdout.on("error", function(err) {
	console.log("This is the process.stdout error handler");
	console.error(err); 
});

fcgi.createServer(app).listen();
console.log("New FCGI process started");
