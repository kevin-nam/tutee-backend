var firebase = require('firebase');

exports.RequestService = function() {

  this.PENDING = "PENDING";
  this.REJECTED = "REJECTED";
  this.ACCEPTED = "ACCEPTED";
  this.SESSIONS_REFERENCE = "sessions/"

  this.getSessionsForTutee = function(uid) {
    return firebase.database().ref(this.SESSIONS_REFERENCE)
    .orderByChild('uid')
    .equalTo(uid)
    .once('value')
    .then(function(snapshot) {
      var sessions = snapshot.val();
      console.log(sessions);
      return sessions;
    });
  }

  this.getSessionsForTutor = function(tid) {
    return firebase.database().ref(this.SESSIONS_REFERENCE)
    .orderByChild('tid')
    .equalTo(tid)
    .once('value')
    .then(function(snapshot) {
      var sessions = snapshot.val();
      console.log(sessions);
      return sessions;
    });
  }

  this.createSession = function(tid, uid, rate, duration) {
    if (tid && uid && rate && duration) {
      var newSession = firebase.database().ref(this.SESSIONS_REFERENCE).push();
      var sid = newSession.key;

      var newSessionData = {
        tid : tid,
        uid : uid,
        rate : rate,
        duration : duration,
        totalprice: duration * rate,
        status : this.PENDING
      }

      var updates = {};
      updates[this.SESSIONS_REFERENCE + sid] = newSessionData;
      firebase.database().ref().update(updates);
      return sid;
    }
    return null;
  }

  this.acceptSession = function(sid) {
    var ref = firebase.database().ref(this.SESSIONS_REFERENCE + sid);
    ref.update({
      status : this.ACCEPTED
    });
  }

  this.rejectSession = function(sid) {
    var ref = firebase.database().ref(this.SESSIONS_REFERENCE + sid);
    ref.update({
      status : this.REJECTED
    });
  }
}
