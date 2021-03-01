
var MongoClient = require('mongodb').MongoClient;
var express = require ('express');
var bodyParser= require ('body-parser');
var path=require('path');
const app = express()
const port = 8000;

var url = "mongodb://localhost/mybookshopdb";
MongoClient.connect(url, function(err, db) {
		  if (err) throw err;
		console.log("Database created!");
		  db.close();     });

app.use(bodyParser.urlencoded({ extended: true }));

//app.use(bodyParser.json());

app.set('views', path.join(__dirname, 'views'));
require('./routes/main')(app);
app.set('views',__dirname + '/views');
app.set('view engine', 'ejs'); 
app.engine('html', require('ejs').renderFile);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
