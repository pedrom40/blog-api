// includes
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

// setup model
const {BlogPosts} = require('./models');


// manually create some blog posts
BlogPosts.create('Creating Your 1st API', 'Once you get the hang of it, you will never look back.', 'Hello World');
BlogPosts.create('Understanding Express.js', 'If you have any experience with JavaScript, then you already have a head start.', 'Hello World');


// POST (create) route
router.post('/', jsonParser, (req, res) => {

  // check for required fields
  const reqFieldsMsg = checkForRequiredFields(['title', 'content', 'author'], req);
  if (reqFieldsMsg !== 'success') {
    console.log(reqFieldsMsg);
    return res.status(400).send(reqFieldsMsg);
  }

  const post = BlogPosts.create(req.body.title, req.body.content, req.body.author);
  res.status(201).json(post);
});

// GET (read) route
router.get('/', (req, res) => {
  res.json(BlogPosts.get());
});

// PUT (update) route
router.put('/:id', jsonParser, (req, res) => {

  // check for required fields
  const reqFieldsMsg = checkForRequiredFields(['id', 'title', 'content', 'author'], req);
  if (reqFieldsMsg !== 'success') {
    console.log(reqFieldsMsg);
    return res.status(400).send(reqFieldsMsg);
  }

  // make sure id's match
  const idMsg = idsCheck(req.params.id, req.body.id);
  if (idMsg !== 'success') {
    console.error(idMsg);
    return res.status(400).send(idMsg);
  }

  console.log(`Updating blog post \`${req.params.id}\``);
  BlogPosts.update({
    id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    author: req.body.author
  });
  res.status(204).end();
});

// DELETE route
router.delete('/:id', (req, res) => {
  BlogPosts.delete(req.params.id);
  console.log(`Deleted blog post \`${req.params.ID}\``);
  res.status(204).end();
});


// function that checks for required fields
function checkForRequiredFields (requiredFields, req) {

  // loop through fields
  for (let i=0; i<requiredFields.length; i++) {

    // isolate field
    const field = requiredFields[i];

    // if field not found in request
    if (!(field in req.body)) {

      // return name of missing field
      return `Missing \`${field}\` in request body`;

    }

  }

  // if here, then all fields passed in
  return 'success';

}

// function that makes sure id in params and body match
function idsCheck (paramId, bodyId) {

  // if they don't match
  if (paramId !== bodyId) {
    return `Request path id (${paramId}) and request body id (${bodyId}) must match`;
  }

  // they do match
  return 'success';

}


// export router
module.exports = router;
