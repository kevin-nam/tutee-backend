var express = require('express');
var router = express.Router();
var connectionService = require('../tutee_modules/connection/connectionService.js');

router.get('/get/:uid', function(req, res, next) {
  console.log(req.params.uid);
  connectionService.getConnectionsFromUid(req.params.uid, function(data) {
    res.send(data);
  });
});

router.post('/create', function(req, res, next) {
  var uid1 = req.body.uid1;
  var uid2 = req.body.uid2;
  console.log('Attempting to create connection between ' + uid1 + ' and ' + uid2);
  connectionService.createNewConnection(uid1, uid2, function(data) {
    res.send(data);
  });
});

router.post('/delete', function(req, res, next) {
  var uid1 = req.body.uid1;
  var uid2 = req.body.uid2;
  console.log('Attempting to delete connection between ' + uid1 + ' and ' + uid2);
  connectionService.deleteConnection(uid1, uid2, function(data) {
    res.send(data);
  });
});

module.exports = router;
