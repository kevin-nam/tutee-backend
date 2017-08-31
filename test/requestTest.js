/**********************************************************************
Initialization
***********************************************************************/
var firebase = require('firebase');
var config = {
    apiKey: "AIzaSyBYbaQwELtNm4jxpEMHuws-vmlIRv1-YBA",
    authDomain: "tutee-9b050.firebaseapp.com",
    databaseURL: "https://tutee-9b050.firebaseio.com",
    storageBucket: "tutee-9b050.appspot.com",
    messagingSenderId: "120931284750"
};
var chai = require('chai');
var mocha = require('mocha');
var rq = require('../tutee_modules/request/requestService.js');

assert = chai.assert;
if (!firebase.apps.length) {
    firebase.initializeApp(config);
}

// Variables
var tid = "testtutor";
var uid = "testtutee";
var sid = [];
var requestService;
var rate;
var duration;
var SESSIONS_REFERENCE = "sessions/"

// Login Test
describe('Sessions Request Test', function() {
  this.timeout(5000)
  beforeEach(function(done) {
    requestService = new rq.RequestService();
    setTimeout(function() {
      done()
    }, 1000)
  })

  it('Given a tutee, when retrieiving all his/her sessions, then all sessions should be present', function(done) {
    givenATutorAndATutee();
    whenTheTutorRequestsASession();
    whenTheTutorRequestsASession();
    whenTheTutorRequestsASession();
    thenTheSessionsForTuteeAreAllRetrieved(requestService.PENDING, done);
  })

  it('Given a tutee with no sessions, when retrieiving all his/her sessions, then there are no sessions received', function(done) {
    givenATutorAndATutee();
    //andNoSessionsForTheTutee
    thenThereAreNoSessionsForTuteeRetrieved(done);
  })

  it('Given a tutor, when retrieiving all his/her sessions, then all sessions should be present', function(done) {
    givenATutorAndATutee();
    whenTheTutorRequestsASession();
    whenTheTutorRequestsASession();
    whenTheTutorRequestsASession();
    thenTheSessionsForTutorAreAllRetrieved(requestService.PENDING, done);
  })

  it('Given a tutor with no sessions, when retrieiving all his/her sessions, then there are no sessions received', function(done) {
    givenATutorAndATutee();
    //andNoSessionsForTheTutor
    thenThereAreNoSessionsForTutorRetrieved(done);
  })


  it('Given a tutor and a tutee, when requesting a session with the tutee, then the session exists in the database and is pending', function(done) {
    givenATutorAndATutee();
    whenTheTutorRequestsASession();
    thenTheSessionExistsInTheDatabase(requestService.PENDING, done)
  })

  it('Given a tutor and a tutee, when requesting a session with the tutee and the tutee accepts it, then the session exists in the database and is accepted', function(done) {
    givenATutorAndATutee();
    whenTheTutorRequestsASessionAndTheTuteeAcceptsIt()
    thenTheSessionExistsInTheDatabase(requestService.ACCEPTED, done)
  })

  it('Given a tutor and a tutee, when requesting a session with the tutee and the tutee accepts it, then the session exists in the database and is rejected', function(done) {
    givenATutorAndATutee();
    whenTheTutorRequestsASessionAndTheTuteeRejectsIt()
    thenTheSessionExistsInTheDatabase(requestService.REJECTED, done)
  })

  it('Given a tutor and a tutee, when requesting an invalid session with the tutee, then the session does not exists in the database', function(done) {
    givenATutorAndATutee();
    whenTheTutorRequestAnInvalidSession()
    thenTheSessionDoesNotExistInTheDatabase(done)
  })

});

// Given
function givenATutorAndATutee() {
  tid = "testtutor";
  uid = "testtutee";
}

// When
function whenTheTutorRequestsASession() {
  rate = 10.0;
  duration = 2;
  sid.push(requestService.createSession(tid, uid, rate, duration));
}

function whenTheTutorRequestsASessionAndTheTuteeAcceptsIt() {
  rate = 10.0;
  duration = 2;
  sid.push(requestService.createSession(tid, uid, rate, duration));

  // wait a bit
  setTimeout(function() {
    requestService.acceptSession(sid);
  }, 300);
}

function whenTheTutorRequestsASessionAndTheTuteeRejectsIt() {
  rate = 10.0;
  duration = 2;
  sid.push(requestService.createSession(tid, uid, rate, duration));

  // wait a bit
  setTimeout(function() {
    requestService.rejectSession(sid);
  }, 300);
}

function whenTheTutorRequestAnInvalidSession() {
  sid.push(requestService.createSession(null, null, null, null));
}

// Then
function thenTheSessionsForTuteeAreAllRetrieved(status, done) {
  requestService.getSessionsForTutee(uid).then(function(sessions) {
    assert.equal(Object.keys(sessions).length, sid.length, 'size of sessions should be equal to ' + sid.length);
    thenTheSessionExistsInTheDatabase(status, done);
  });
}

function thenTheSessionsForTutorAreAllRetrieved(status, done) {
  requestService.getSessionsForTutor(tid).then(function(sessions) {
    assert.equal(Object.keys(sessions).length, sid.length, 'size of sessions should be equal to ' + sid.length);
    thenTheSessionExistsInTheDatabase(status, done);
  });
}

function thenThereAreNoSessionsForTuteeRetrieved(done) {
  requestService.getSessionsForTutee(uid).then(function(sessions) {
    if (sessions) {
      assert.fail(sessions, null, 'There should not be any sessions yet there are ' + Object.keys(sessions).length);
    }
    done();
  });
}

function thenThereAreNoSessionsForTutorRetrieved(done) {
  requestService.getSessionsForTutor(tid).then(function(sessions) {
    if (sessions) {
      assert.fail(sessions, null, 'There should not be any sessions yet there are ' + Object.keys(sessions).length);
    }
    done();
  });
}


function thenTheSessionExistsInTheDatabase(status, done) {
  setTimeout(function() {
    while(sid.length > 0) {
      sidToCheck = sid.pop();
      firebase.database().ref(SESSIONS_REFERENCE + sidToCheck).once('value').then(function(snapshot) {
        actualSession = snapshot.val();
        console.log(actualSession)
        assert.equal(actualSession.uid, uid, 'uid is not equal');
        assert.equal(actualSession.tid, tid, 'tid is not equal');
        assert.equal(actualSession.rate, rate, 'rate is not equal');
        assert.equal(actualSession.duration, duration, 'duration is not equal');
        assert.equal(actualSession.totalprice, duration * rate, 'totalprice is not equal');
        assert.equal(actualSession.status, status, 'status is not equal');

        // Remove from database
        firebase.database().ref().child(SESSIONS_REFERENCE + snapshot.key).remove();
      })
    }
    setTimeout(done(), 1000);


  }, 1000);

}

function thenTheSessionDoesNotExistInTheDatabase(done) {
  setTimeout(function() {
    assert.isNull(sid[0]);
    done();
  }, 1000);
}
