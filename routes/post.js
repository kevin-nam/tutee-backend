var express = require('express');
var router = express.Router();
var postService = require('../tutee_modules/post/postService.js');

router.post('/create', function(req, res, next) {
  res.send(postService.createPost(req.body.uid, req.body.title, req.body.description, req.body.tagString, req.body.type));
});

router.get('/get/:pid', function(req, res, next) {
  postService.getPost(req.params.pid).then(function(result) {
    res.send(result);
  });
});

router.post('/get/list', function(req, res, next) {
  postService.getPostList(req.body.pidList).then(function(result) {
    res.send(result);
  });
});

router.get('/get/list/user/:uid', function(req, res, next) {
  postService.getAllPostsFromUid(req.params.uid).then(function(result) {
    res.send(result);
  });
});

router.post('/update', function(req, res, next) {
  res.send(postService.updatePost(req.body.pid, req.body.uid, req.body.title, req.body.description, req.body.tagString, req.body.type));
});

router.delete('/delete/:pid', function(req, res, next) {
  postService.deletePost(req.params.pid, function(result) {
    res.send(result);
  });
});

module.exports = router;
