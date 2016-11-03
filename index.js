'use strict'
const express = require('express');
const app = express();

const sio = require('socket.io');
const path = require('path');

const mongoose = require('mongoose');
const PORT = process.env.PORT || 5000;
const INDEX = path.join(__dirname, "indexc.html");
var url = process.env.MONGOLAB_URI;
mongoose.connect(url, function(err){
	if(err){
		console.log(err);
	}else{
		console.log('Connecting to mongodb!');
	}
});



var userSchema = mongoose.Schema({//Declare the MongoDB schema you'd like to use
	username: String,
	firstname: String,
	lastname: String,
	gender: String,
	phone: String,
	image: String,
	email: String,
	date_opened: {type: Date, default :Date.now}
});



var usersrec = mongoose.model('user', userSchema);

app.use(express.static(path.join(__dirname, 'public')));

const server = app
  .use((req, res) => res.sendFile(INDEX) )
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const io = sio(server);
var users = {};

io.on('connection', function(socket){
  console.log('a user with socket: '+ socket.id +' connected');

 socket.on('signup', function(data){
 	
 	var query = data;
 	function getQueryVariable(variable)
{
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
        var space = vars[i].indexOf('=');
        var name = vars[i].substr(0, space);
        var data = vars[i].substr(space+1);

       if(name == variable){return data};
       }
       return(false);
}
 	
var username = getQueryVariable("u");
var image = getQueryVariable("image");
var phone = getQueryVariable("phone");
var firstname = getQueryVariable("firstname");
var lastname = getQueryVariable("lastname");
var gender = getQueryVariable("gender");
var email = getQueryVariable("email");

signup(username, image, phone, firstname, lastname, gender, email);
socket.emit("reload", "reload");

 })

  

function signup(username, image, phone, firstname, lastname, gender, email){//Controls sending users data to mongodb

	var enteruser = new usersrec({username: username, image: image, phone: phone, firstname: firstname, lastname: lastname, gender: gender, email: email});
	enteruser.save(function(err){
		if(err) throw err;
	});
}
  
});
