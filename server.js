// includes
const express = require('express');
const router = express.Router();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

// setup app
const {BlogPosts} = require('./models');
const app = express();


// log the http layer
app.use(morgan('common'));


// manually create some blog posts
BlogPosts.create('Creating Your 1st API', 'Once you get the hang of it, you will never look back.', 'Hello World');
BlogPosts.create('Understanding Express.js', 'If you have any experience with JavaScript, then you already have a head start.', 'Hello World');


// first route
app.get('/blog-posts', (req, res) => {
  res.json(BlogPosts.get());
});


// setup server
app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});
