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


// init server var
let server;

// this function starts our server and returns a Promise
function runServer() {
  const port = process.env.PORT || 8080;
  return new Promise((resolve, reject) => {
    server = app.listen(port, () => {
      console.log(`Your app is listening on port ${port}`);
      resolve(server);
    }).on('error', err => {
      reject(err)
    });
  });
}

// this function closes the server and returns a promise.
function closeServer() {
  return new Promise((resolve, reject) => {
    console.log('Closing server');
    server.close(err => {
      if (err) {
        reject(err);
        // so we don't also call `resolve()`
        return;
      }
      resolve();
    });
  });
}

// for local dev
if (require.main === module) {
  runServer().catch(err => console.error(err));
};

// export server functions
module.exports = {app, runServer, closeServer};
