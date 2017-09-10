var express = require('express');
var router = express.Router();
var searchService = require('../tutee_modules/search/searchService.js');

router.post('/tags/', function(req, res, next) {
    searchService.searchPosts(req.body.tagString).then(function(result) {
        res.send(result);
    });
});

module.exports = router;
