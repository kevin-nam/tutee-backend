var express = require('express');
var router = express.Router();
var tagService = require('../tutee_modules/tag/tagService.js');

router.get('/recentTags/:num', function(req, res, next) {
  tagService.getRecentTags(req.params.num).then(function(result) {
    res.send(result);
  });
});

module.exports = router;
