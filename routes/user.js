var express = require('express');
var router = express.Router();
var userService = require('../tutee_modules/user/userService.js');

/* TO DO */
router.get('/getUser/:uid', function(req, res, next) {
    userService.getUserData(req.params.uid).then(function(user) {
        res.send(user);
    });
});

router.post('/createUser', function(req, res, next) {
    res.send(userService.createUser(req.body.uid, req.body.username, req.body.email, req.body.profile_picture, req.body.bio, req.body.rating));
});

router.post('/updateUser', function(req, res, next) {
    res.send(userService.updateUser(req.body.uid, req.body.username, req.body.email, req.body.profile_picture, req.body.bio, req.body.rating));
});




module.exports = router;
