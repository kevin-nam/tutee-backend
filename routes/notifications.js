var express = require('express');
var router = express.Router();
var notificationService = require('../tutee_modules/notifications/notificationService.js');

router.post('/send', function(req, res, next) {
  notificationService.sendNotification(req.body.uid, req.body.uidFrom, req.body.type, req.body.msg, req.body.content, function(notification) {
    res.send(notification);
  });
});

router.post('/acknowledge', function(req, res, next) {
  notificationService.acknowledge(req.body.uid, function(notification) {
    res.send(notification);
  });
});

module.exports = router;
