var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// Import the MongoDB client
const { MongoClient, ServerApiVersion } = require('mongodb');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// MongoDB Connection URI - REPLACE with your actual connection string
const uri = "mongodb+srv://bryaniturbide91:TestOne117@cluster0.siwcmk5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; // Ensure 'myAppData' is your database name

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connectMongo() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    // Make the db instance available to your routes
    // You can attach it to the 'app' object or pass it down through request objects
    // For simplicity here, we'll attach it to app.locals so it's accessible in route handlers
    app.locals.db = client.db('myAppData'); // 'myAppData' should be your database name
    app.locals.booksCollection = app.locals.db.collection('books'); // 'books' is your collection name

  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1); // Exit the process if DB connection fails
  }
}

connectMongo().catch(console.error);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Close MongoDB connection when the app is shutting down (optional but good practice)
process.on('SIGINT', async () => {
  await client.close();
  console.log('MongoDB connection closed.');
  process.exit(0);
});

module.exports = app;

