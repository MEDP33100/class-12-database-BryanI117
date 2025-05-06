var express = require('express');
var router = express.Router();

router.get('/', async function(req, res, next) {
  try {
    const booksCollection = req.app.locals.booksCollection;
    if (!booksCollection) {
      return res.status(500).send("Database collection not available");
    }

    const books = await booksCollection.find({}).toArray(); 
    res.render('index', { title: 'My Book Collection', books: books });
  } catch (err) {
    console.error("Error fetching books:", err);
    next(err);
  }
});

module.exports = router;