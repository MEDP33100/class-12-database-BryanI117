var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', async function(req, res, next) {
  try {
    // Access the collection from app.locals
    const booksCollection = req.app.locals.booksCollection;
    if (!booksCollection) {
      return res.status(500).send("Database collection not available");
    }

    const books = await booksCollection.find({}).toArray(); // Fetches all documents
    res.render('index', { title: 'My Book Collection', books: books });
  } catch (err) {
    console.error("Error fetching books:", err);
    next(err); // Pass the error to the error handler
  }
});

module.exports = router;