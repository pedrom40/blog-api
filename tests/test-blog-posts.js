// setup tests framework
const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');
const should = chai.should();

chai.use(chaiHttp);


describe('Blog Posts', function() {

  // start server for tests
  before(function() {
    return runServer();
  });

  // close server when done
  after(function() {
    return closeServer();
  });

  // test strategy:
  // 1. make request to `/blog-poss`
  // 2. inspect response object and prove has right code and have right keys in response object.
  it('should list items on GET', function() {

    return chai.request(app)
      .get('/blog-posts')
      .then(function(res) {

        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body.length.should.be.at.least(1);

        // each item should be an object with key/value pairs for "id", "title", "content", "author", "publishDate".
        const expectedKeys = ['id', 'title', 'content', 'author', 'publishDate'];
        res.body.forEach(function(item) {
          item.should.be.a('object');
          item.should.include.keys(expectedKeys);
        });

      });
  });

  // test strategy:
  //  1. make a POST request with data for a new item
  //  2. inspect response object and prove it has right status code and that the returned object has an `id`
  it('should add a blog post on POST', function() {
    const newPost = {
      title: 'Lorem ip some',
      content: 'foo foo foo foo',
      author: 'Emma Goldman'
    };
    const expectedKeys = ['id', 'publishDate'].concat(Object.keys(newPost));

    return chai.request(app)
      .post('/blog-posts')
      .send(newPost)
      .then(function(res) {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.all.keys(expectedKeys);
        res.body.title.should.equal(newPost.title);
        res.body.content.should.equal(newPost.content);
        res.body.author.should.equal(newPost.author)
      });
  });

  // test strategy:
  //  1. initialize some update data (we won't have an `id` yet)
  //  2. make a GET request so we can get an item to update
  //  3. add the `id` to `updateData`
  //  4. Make a PUT request with `updateData`
  //  5. Inspect the response object to ensure it has right status code and that we get back an updated item with the right data in it.
  it('should update a blog post on PUT', function() {

    // setup data for update
    const updateData = {
      title: 'Sample Blog Post',
      content: 'Here\'s some content for the blog post',
      author: 'John Doe'
    };

    return chai.request(app)
      // first have to get so we have an idea of object to update
      .get('/blog-posts')
      .then(function(res) {

        // add id to update object
        updateData.id = res.body[0].id;

        // send data for update
        return chai.request(app)
          .put(`/blog-posts/${updateData.id}`)
          .send(updateData);
      })

      // prove that the PUT request has right status code
      .then(function(res) {
        res.should.have.status(204);
      });

  });

  // test strategy:
  //  1. GET a shopping list items so we can get ID of one to delete.
  //  2. DELETE an item and ensure we get back a status 204
  it('should delete a blog post on DELETE', function() {
    return chai.request(app)
      // first have to get so we have an `id` of item to delete
      .get('/blog-posts')
      .then(function(res) {
        return chai.request(app)
          .delete(`/blog-posts/${res.body[0].id}`);
      })
      .then(function(res) {
        res.should.have.status(204);
      });
  });

});
