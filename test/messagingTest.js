/** ********************************************************************
Initialization
***********************************************************************/

var firebase = require('firebase');
var config = {
  apiKey: 'AIzaSyBYbaQwELtNm4jxpEMHuws-vmlIRv1-YBA',
  authDomain: 'tutee-9b050.firebaseapp.com',
  databaseURL: 'https://tutee-9b050.firebaseio.com',
  storageBucket: 'tutee-9b050.appspot.com',
  messagingSenderId: '120931284750'
};
var chai = require('chai');
var messagingService = require('../tutee_modules/messaging/messagingService.js');
assert = chai.assert;
if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

/** ********************************************************************
Global Variables
***********************************************************************/


var uidTutor = '';
var uidTutee = '';
var content = '';
var messageID;


/** ********************************************************************
Tests - Alternate Flows
***********************************************************************/


// Read Message data
describe('Send/Get Message Tests', function() {
  // Test tutor sends message
  it('Given a tutor and a tutee, when the tutor sends a message, then the message should exist.', function(done) {
    this.timeout(5000);
    givenTwoUsersAndMessage();
    whenTutorSendsTheMessage(function(data) {
      thenTheMessageShouldExist(data, done);
    });
  });

  // Test tutee sends a message
  it('Given a tutor and a tutee, when the tutee sends a message, then the message should exist.', function(done) {
    this.timeout(5000);
    givenTwoUsersAndA2ndMessage();
    whenTuteeSendsTheMessage(function(data) {
      thenTheMessageShouldExist(data, done);
    });
  });

  // Test getting the messages in a convo
  it('Given a tutor and a tutee, when retrieving their messages, then the messages should exist.', function(done) {
    givenTwoMessagingUsers();
    whenGettingTheirMessages(function(data) {
      thenTheMessagesShouldExist(data, done);
    });
  });
});


/** ********************************************************************
Given
***********************************************************************/

function givenTwoUsersAndMessage() {
  uidTutor = 'Tutor';
  uidTutee = 'Tutee';
  content = 'This is the first message!';
  messageID = 0;
}

function givenTwoUsersAndA2ndMessage() {
  uidTutor = 'Tutor';
  uidTutee = 'Tutee';
  content = 'This is the second message!';
  messageID = 1;
}

function givenTwoMessagingUsers() {
  uidTutor = 'Tutor';
  uidTutee = 'Tutee';
}

/** ********************************************************************
When
***********************************************************************/

function whenTutorSendsTheMessage(callback) {
  messagingService.sendMessage(uidTutor, uidTutor, uidTutee, content, callback);
}

function whenTuteeSendsTheMessage(callback) {
  messagingService.sendMessage(uidTutee, uidTutor, uidTutee, content, callback);
}

function whenGettingTheirMessages(callback) {
  messagingService.getMessages(uidTutor, uidTutee).then(function(messageList) {
    callback(messageList);
  });
}

/** ********************************************************************
Then
***********************************************************************/

function thenTheMessageShouldExist(messageData, done) {
  // console.log('Message Data: ' + messageData.sentBy);
  firebase.database().ref('messages/' + uidTutor + '-' + uidTutee).once('value').then(function(snapshot) {
    // console.log('Snapshot Data: ' + snapshot.val().messages[messageID].sentBy);
    assert.equal(snapshot.val().messages[messageID].sentBy, messageData.sentBy, 'Not the same uid sent by.');
    assert.equal(snapshot.val().messages[messageID].content, messageData.content, 'Not the same content.');
    assert.equal(snapshot.val().messages[messageID].date, messageData.date, 'Not the same username.');

    done();
  });
}

function thenTheMessagesShouldExist(messages, done) {
  firebase.database().ref('messages/' + uidTutor + '-' + uidTutee).once('value').then(function(snapshot) {
    assert.deepEqual(snapshot.val().messages, messages, 'Not the same messages.');

    firebase.database().ref('messages/'+ uidTutor + '-' + uidTutee).remove();

    done();
  });
}
