// includes
const express = require('express');
const shared = require('./shared');
const bodyParser = require('body-parser');
const router = express.Router();
const jsonParser = bodyParser.json();

// setup model
const {BlogPosts} = require('./models');


// manually create some blog posts
BlogPosts.create('Creating Your 1st API', 'Once you get the hang of it, you will never look back.', 'Hello World');
BlogPosts.create('Understanding Express.js', 'If you have any experience with JavaScript, then you already have a head start.', 'Hello World');


// POST (create) route
router.post('/', jsonParser, (req, res) => {

  // check for required fields
  const reqFieldsMsg = shared.checkForRequiredFields(['title', 'content', 'author'], req);
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
  const reqFieldsMsg = shared.checkForRequiredFields(['id', 'title', 'content', 'author'], req);
  if (reqFieldsMsg !== 'success') {
    console.log(reqFieldsMsg);
    return res.status(400).send(reqFieldsMsg);
  }

  // make sure id's match
  const idMsg = shared.idsCheck(req.params.id, req.body.id);
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


// export router
module.exports = router;
