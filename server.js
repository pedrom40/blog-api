// includes
const express = require('express');
const morgan = require('morgan');

// setup app
const {BlogPosts} = require('./models');
const blogPostsRouter = require('./blogPostsRouter');
const app = express();

// log the http layer
app.use(morgan('common'));

// setup app to use blog post router
app.use('/blog-posts', blogPostsRouter);

// setup server
app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});
