var firebase = require('firebase');
var notificationService = require('../notifications/notificationService.js');

exports.SessionService = function() {
  this.PENDING = 'PENDING';
  this.REJECTED = 'REJECTED';
  this.ACCEPTED = 'ACCEPTED';
  this.SESSIONS_REFERENCE = 'sessions/';

  this.getSessionBySid = function(sid) {
    return firebase.database().ref(this.SESSIONS_REFERENCE)
      .orderByKey()
      .equalTo(sid)
      .once('value')
      .then(function(snapshot) {
        return snapshot.val();
      });
  };

  this.getSessions = function(uid) {
    return firebase.database().ref(this.SESSIONS_REFERENCE)
      .orderByChild('uid')
      .equalTo(uid)
      .once('value')
      .then(function(snapshot) {
        var sessions = snapshot.val();
        // console.log(sessions);
        return sessions;
      });
  };

  this.getSessionsByTid = function(tid) {
    return firebase.database().ref(this.SESSIONS_REFERENCE)
      .orderByChild('tid')
      .equalTo(tid)
      .once('value')
      .then(function(snapshot) {
        var sessions = snapshot.val();
        // console.log(sessions);
        return sessions;
      });
  };

  this.createSession = function(tid, uid, rate, duration) {
    if (tid && uid && rate && duration) {
      var newSession = firebase.database().ref(this.SESSIONS_REFERENCE).push();
      var sid = newSession.key;

      var newSessionData = {
        sid: sid,
        tid: tid,
        uid: uid,
        rate: rate,
        duration: duration,
        totalprice: duration * rate,
        status: this.PENDING
      };

      var updates = {};
      updates[this.SESSIONS_REFERENCE + sid] = newSessionData;
      firebase.database().ref().update(updates);
      notificationService.sendNotification(uid, tid, 'NEW_SESSION_REQUEST', newSessionData, function() {});
      return sid;
    }
    return null;
  };

  this.acceptSession = function(sid) {
    const accepted =this.ACCEPTED;
    var ref = firebase.database().ref(this.SESSIONS_REFERENCE + sid);
    ref.update({
      status: accepted
    });

    ref.once('value').then(function(snapshot) {
      var session = snapshot.val();

      if (session) {
        notificationService.sendNotification(session.tid, session.uid,
          'ACCEPTED_SESSION_REQUEST', session, function() {});
      }
    });
    return accepted;
  };

  this.rejectSession = function(sid) {
    const rejected =this.REJECTED;
    var ref = firebase.database().ref(this.SESSIONS_REFERENCE + sid);
    ref.update({
      status: rejected
    });
    return rejected;
  };
};
