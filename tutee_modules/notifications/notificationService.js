var firebase = require('firebase');
var userService = require('../user/userService.js');

const NEW_CONNECTION_REQUEST = 'NEW_CONNECTION_REQUEST';
const NEW_SESSION_REQUEST = 'NEW_SESSION_REQUEST';
const ACCEPTED_SESSION_REQUEST = 'ACCEPTED_SESSION_REQUEST';
const ACCEPTED_CONNECTION_REQUEST = 'ACCEPTED_CONNECTION_REQUEST';
const NEW_MESSAGE = 'NEW_MESSAGE';

exports.sendNotification = function(uid, uidFrom, type, content, callback) {
  userService.getUserData(uidFrom).then(function(user) {
    var username = uidFrom;
    if (user) {
      username = user.username;
    }

    firebase.database().ref('notifications/' + uid).transaction(
      function(data) {
        if (data === null || !data.notifications) {
          var notification = exports.parseAndCreateNotification(uid, uidFrom, username,
            type,
            content);

          return {
            uid: uid,
            notifications: [notification]
          };
        } else {
          console.log('exists');
          var notification = exports.parseAndCreateNotification(uid, uidFrom,
            username,
            type,
            content);

          data.notifications.push(notification);

          return data;
        }
      }, function(error, committed, snapshot) {
        if (error) {
          console.log('Transaction failed abnormally!', error);
          callback(error);
        } else {
          // console.log('Sending notification', snapshot);
          callback(snapshot);
        }
      });
  });
};

exports.parseAndCreateNotification = function(uid, uidFrom, username, type,
  content) {
  if (type == NEW_CONNECTION_REQUEST) {
    return {
      uidFrom: uidFrom,
      userNameFrom: username,
      type: NEW_CONNECTION_REQUEST,
      msg: 'New connection request from ' + username
    };
  } else if (type == NEW_SESSION_REQUEST) {
    return {
      uidFrom: uidFrom,
      userNameFrom: username,
      type: NEW_SESSION_REQUEST,
      msg: 'New session request from ' + username
    };
  } else if (type == NEW_MESSAGE) {
    return {
      uidFrom: uidFrom,
      userNameFrom: username,
      type: NEW_MESSAGE,
      msg: 'New message from ' + uidFrom
    };
  } else if (type == ACCEPTED_CONNECTION_REQUEST) {
    return {
      uidFrom: uidFrom,
      userNameFrom: username,
      type: ACCEPTED_CONNECTION_REQUEST,
      msg: username + ' accepted your connection request!'
    };
  } else if (type == ACCEPTED_SESSION_REQUEST) {
    return {
      uidFrom: uidFrom,
      userNameFrom: username,
      type: ACCEPTED_SESSION_REQUEST,
      msg: username + ' accepted your session request!'
    };
  } else {
    return null;
  }
};

exports.acknowledge = function(uid, callback) {
  console.log(uid);

  firebase.database().ref('notifications/' + uid).transaction(
    function(data) {
      console.log(data);
      if (!data) {
        return {
          uid: uid,
          notifications: []
        };
      } else {
        data.notifications = [];
        return data;
      }
    }, function(error, committed, snapshot) {
      if (error) {
        console.log('Transaction failed abnormally!', error);
        callback(error);
      } else {
        callback(snapshot);
      }
    });
};
