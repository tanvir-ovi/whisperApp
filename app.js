const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
var encrypt = require('mongoose-encryption');

const app = express();
app.use(express.static('public'));
app.set('view engine', 'ejs');

mongoose.set( 'useUnifiedTopology', 'true' );
mongoose.set('useFindAndModify', 'true');

mongoose.connect('mongodb://localhost:27017/userDB', { 
	useNewUrlParser: true 
});

const userSchema = new mongoose.Schema ({
	email: String,
	password: String
});

const secret = "Thisisourlittlesecret.";
userSchema.plugin(encrypt, { 
	secret: secret , 
	encryptedFields: ['password'] 
});

const User = new mongoose.model('User',userSchema);

app.use(bodyParser.urlencoded({extended:true}));

app.get('/', function(req,res) {
	res.render('home');
});

app.route('/login')
	.get(function(req,res) {
		res.render('login');
	})
	.post(function(req,res) {
		const userName = req.body.username;
		const password = req.body.password;
		User.findOne({email:userName},function(err,foundUser) {
			if(!err) {
				if(foundUser) {
					if(foundUser.password=== password) {
						res.render('secrets');
					}
				}
			} else {
				console.log(err);
			}
		});
	})


app.route('/register')
	.get( function(req,res) {
		res.render('register');
	})
	.post( function(req,res) {
		const userName = req.body.username;
		const password = req.body.password;
		const newUser = new User({
			email:userName,
			password:password
		});
		newUser.save(function(err) {
			if(!err) {
				res.render("secrets");
			} else {
				res.json(err);
			}
		});
	});





app.listen(3000, function(){
	console.log('app is running on port 3000');
});
