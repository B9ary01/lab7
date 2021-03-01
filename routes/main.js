

module.exports = function(app) { 
        	const bcrypt = require('bcrypt');
		app.get('/',function(req,res){  res.render('index.html')  });	
	        app.get('/register', function(req,res) { res.render('register.html');  });
	        app.get('/addbook',function(req,res){ res.render('addbook.html');  });
	        app.get('/searchbooks',function(req,res){res.render('search.ejs'); });
	        app.get('/searchuser',function(req,res){res.render('result.ejs'); });
                app.get('/login',function(req,res){res.render('login.html'); });
	        app.get('/deleteuser',function(req,res){res.render('delete.html'); });

//register using username, email and hashed password

app.post('/registered', function (req, res) { 
        var MongoClient = require('mongodb').MongoClient;
        var url = 'mongodb://localhost';
     MongoClient.connect(url, function(err, client) {    
	if (err) throw err;
	var db = client.db ('mybookshopdb');
        var bcrypt = require('bcrypt'); 
	const saltRounds = 10;
 //hashing password to insert into database using bcrypt hash which outputs unique password by adding salt
	bcrypt.hash(req.body.password,saltRounds, function (err, hash) {
//saving username, hashed password and email into database	
	db.collection('users').insertOne({
	username:req.body.username,
	password:hash,
	email:req.body.email
}).then(function(data) {
   if (data) {
	   res.send( '<a href='+'https://www.doc.gold.ac.uk/usr/397/'+'>Home</a>'+ '<br />'+
		  'You are now registered, Your user name is: '+ req.body.username
	  + ', your password is: '+ req.body.password +
	  ' and your hashed password is: '+ hash);
   }; });  });  });  });
 

//login page
app.post('/loggedin', function (req,res) {
	const bcrypt = require('bcrypt');
        const plainPassword = req.body.password;
	const saltRounds = 10;
	var MongoClient = require('mongodb').MongoClient;
	var url = 'mongodb://localhost';
	MongoClient.connect(url,function(err, client) {
	if (err) throw err;
	var db = client.db('mybookshopdb');
//find and match the username saved in the database
	db.collection('users').findOne({
		username:req.body.username,
		email:req.body.email
	}).then(function (user) {

//display not correct if the details are wrong
 if(!user){res.send( '<a href='+'https://www.doc.gold.ac.uk/usr/397/'+'>Home</a>'+ '<br />'+ '<br />'
	 +" Please try again! User details are not correct");
 }else{

//compare the password and hashed password from the database
 bcrypt.compare(plainPassword,user.password, function(err, result) {
	if(result==true){
//if result is true, display successful and unsuccessful if it is false
	res.send('<a href='+'https://www.doc.gold.ac.uk/usr/397/'+'>Home</a>'+ '<br />'+ 
                '<br />'+ " Login Successful!");
          } 
	 else{res.send( '<a href='+'https://www.doc.gold.ac.uk/usr/397/'+'>Home</a>'+ '<br />'+ '<br />'+ " Please check your credentials, Login is UnSuccessful!");}
 }); }  });  });   });

//Delete user from database using email and username
app.post('/deleteusers', function (req,res) {
	var MongoClient = require('mongodb').MongoClient;
	var url = 'mongodb://localhost';
	MongoClient.connect(url,function(err, client) {
		if (err) throw err;
	var db = client.db('mybookshopdb');
//delete user if username and email matches with the details saved in the database
	db.collection('users').deleteMany({
		username:req.body.username,
		email:req.body.email
	}).then(function (data){ 
//if details are correct it removes the user from the database which you can check in the Username or RegisterUser page
	if(!data){res.send('<a href='+'https://www.doc.gold.ac.uk/usr/397/'+'>Home</a>'+ '<br />'+ '<br />'+ " Please try again! Details are not correct");}	
		res.send( '<a href='+'https://www.doc.gold.ac.uk/usr/397/'+'>Home</a>'+ '<br />'+ '<br />'+ " Please check the Username page or Registered User page to confirm if the user is removed from database. ");
}); }); });
	

//displays users
app.get('/userlist', function(req, res) {
// saving data in database    
        var MongoClient = require('mongodb').MongoClient;
        var url = 'mongodb://localhost';
        MongoClient.connect(url, function (err, client) {
	if (err) throw err;
	var db = client.db('mybookshopdb');
//display available users from the database
	db.collection('users').find().toArray((findErr, results) => {if (findErr) throw findErr;
	else
	res.render('list2.ejs', {availableusers:results});client.close(); 
	});  });  });


//listusers page which displays only username
app.get('/users', function(req, res) {
             var MongoClient = require('mongodb').MongoClient;
	     var url = 'mongodb://localhost';
	     MongoClient.connect(url, function (err, client) {
		 if (err) throw err;
		 var db = client.db('mybookshopdb');
		     db.collection('users').find().toArray((findErr, results) => {if (findErr) throw findErr;
		 else
           res.render('listusers.ejs', {availableusers:results});client.close();    
	});  });  });


//display all the available books
app.get('/booklist', function(req, res) {
// saving data in database
          var MongoClient = require('mongodb').MongoClient;
  	  var url = 'mongodb://localhost';
          MongoClient.connect(url, function (err, client) {
	            if (err) throw err;
	   var db = client.db('mybookshopdb');
 	   db.collection('books').find().toArray((findErr, results) => {
             if (findErr) throw findErr;
		   else
	   res.render('list.ejs', {availablebooks:results});
	   client.close();
	}); });  });


//search username of registered users
app.get('/registereduser/', function(req, res, next) {
        var MongoClient = require('mongodb').MongoClient;
        var url = 'mongodb://localhost';
        var regex= new RegExp(req.query["term"],'i');                                                                  
        MongoClient.connect(url, function (err, client) {
        var db = client.db('mybookshopdb');
//search registered users using username from the database
	db.collection('users').find({username:regex},{'username':1}).toArray((findErr,results)=>{
        var result=[];
	if(!err){    
	if(results && results.length>0){
	results.forEach(user=>{
	let obj={
	id:user.id,
	label:user.username+" , "+
	user.password};
	result.push(obj);
	});
	}
	res.jsonp(result);  
    } });
     });  });


//advance book search available in the database
app.get('/autocomplete/', function(req, res, next) {
// saving data in database
  var MongoClient = require('mongodb').MongoClient;
  var url = 'mongodb://localhost';
  var regex= new RegExp(req.query["term"],'i');
 MongoClient.connect(url, function (err, client) {
     var db = client.db('mybookshopdb');
//search books available in the database
	 db.collection('books').find({name:regex},{'name':1}).toArray((findErr,results)=>{
var result=[];
if(!err){
if(results && results.length>0){
	results.forEach(book=>{
	let obj={
	id:book.id,
	label:book.name+", " +book.price
	}; result.push(obj);
	});     }
   res.jsonp(result);
   } });   });  });


//bookadded route
app.post('/bookadded', function (req,res) {
// saving data in database
	var MongoClient = require('mongodb').MongoClient;
        var url = 'mongodb://localhost';
     MongoClient.connect(url, function(err, client) {
	    if (err) throw err;
              var db = client.db ('mybookshopdb');  
//insert books with price into database	   
	    db.collection('books').insertOne({
			       name: req.body.name,
		  	       price: req.body.price                                                                                                 });
		               client.close();
  res.send( '<a href='+'https://www.doc.gold.ac.uk/usr/397/'+'>Home</a>'+ '<br />'+'This book is added to the database, name: '+ req.body.name + ' and price '+ req.body.price);
     });  }); 


}








