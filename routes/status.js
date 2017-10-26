var express = require('express');
var router = express.Router();

router.get('/isAlive', function(req, res, next) {
  res.send('alive');
});

module.exports = router;