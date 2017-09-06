var express = require('express');
var router = express.Router();
var postService = require('../tutee_modules/post/postService.js');

/* TO DO */
router.get('/get/:pid', function(req, res, next) {
    console.log(req.params.pid);
  res.send(postService.getPost(req.params.pid));
});

module.exports = router;
