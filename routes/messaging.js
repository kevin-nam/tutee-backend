var express = require('express');
var router = express.Router();
var messagingService = require('../tutee_modules/messaging/messagingService.js');

router.post('/send', function(req, res, next) {
    res.send(messagingService.sendMessage(req.body.uidFrom, req.body.uidTutor, req.body.uidTutee, req.body.content));
});

router.get('/get/:uidTutor/:uidTutee', function(req, res, next) {
    messagingService.getMessages(req.params.uidTutor, req.params.uidTutee).then(function(message) {
        res.send(message);
    });
});

module.exports = router;
