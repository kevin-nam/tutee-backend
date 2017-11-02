var express = require('express');
var router = express.Router();
var sessionService = require('../tutee_modules/session/sessionService.js');
var session = new sessionService.SessionService();


router.post('/create', function(req, res, next) {
  res.send(session.createSession(req.body.tid, req.body.uid, req.body.rate, req.body.duration));
});

router.get('/get/:uid', function(req, res, next) {
  session.getSessions(req.params.uid).then(function(result) {
    res.send(result);
  });
});

router.get('/get/session/:sid', function(req, res, next) {
  session.getSessionBySid(req.params.sid).then(function(result) {
    res.send(result);
  });
});

router.post('/accept', function(req, res, next) {
  res.send(session.acceptSession(req.body.sid));
});

router.post('/reject', function(req, res, next) {
  res.send(session.rejectSession(req.body.sid));
});

module.exports = router;
