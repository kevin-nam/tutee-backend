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
var mocha = require('mocha');
var connectionService = require('../tutee_modules/connection/connectionService.js');

assert = chai.assert;
if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

/** ********************************************************************
Global Variables
***********************************************************************/

var uidToTest;
var uidToTest2;

var uid1 = 'tester1';
var uid2 = 'tester2';
var uid3 = 'tester3';
var uid4 = 'tester4';


/** ********************************************************************
Tests
***********************************************************************/


describe('Typical Connection Test', function() {
  beforeEach(function(done) {
    setTimeout(function() {
      done();
    }, 1000);
  });

  it('Given two uids, when creating a connection, a connection should be made', function(done) {
    this.timeout(5000);
    // givenTwoUids(uid1, uid2);
    whenCreatingAConnection(uid1, uid2, function() {
      thenConnectionExistsInDatabase(uid1, uid2, 1, done);
    });
  });

  it('Given two non-connecting uids, when not creating a connection, no connection should exist', function(done) {
    this.timeout(5000);
    // givenTwoUids(uid3, uid4);
    thenConnectionDoesNotExistInDatabase(uid1, uid3, done);
  });

  it('Given a uid, when getting their connections, we should get connections', function(done) {
    this.timeout(5000);
    // givenAUid(uid1);
    whenGettingConnections(uid1, function(data) {
      console.log(data);
      thenTheConnectionIsValid(data, uid1, 1, done);
    });
  });

  it('Given two uids, when deleting a connection, the connection should no longer exist', function(done) {
    this.timeout(5000);
    // givenTwoUids(uid1, uid2);
    whenDeletingAConnection(uid1, uid2, function() {
      thenConnectionDoesNotExistInDatabase(uid1, uid2, done);
    });
  });
});


/** ********************************************************************
Given
***********************************************************************/

function givenAUid(uid) {
  uidToTest = uid;
}

function givenTwoUids(uid1, uid2) {
  uidToTest = uid1;
  uidToTest2 = uid2;
}

function givenANullUid() {
  uidToTest = null;
}


/** ********************************************************************
When
***********************************************************************/


function whenCreatingAConnection(uid1, uid2, callback) {
  setTimeout(function() {
    connectionService.createNewConnection(uid1, uid2, callback);
  }, 1000);
}

function whenDeletingAConnection(uid1, uid2, callback) {
  setTimeout(function() {
    connectionService.deleteConnection(uid1, uid2, callback);
  }, 3000);
}

function whenGettingConnections(uid, callback) {
  setTimeout(function() {
    connectionService.getConnectionsFromUid(uid, callback);
  }, 2000);
}

/** ********************************************************************
Then
***********************************************************************/


function thenConnectionExistsInDatabase(uid1, uid2, size, done) {
  firebase.database().ref('connection/' + uid1).once('value').then(function(snapshot) {
    console.log(snapshot.val());
    console.log(snapshot.val().connections);
    assert.equal(snapshot.val().uid, uid1, 'uid should be the same.');
    assert.isNotNull(snapshot.val().connections, 'connections should be not null');
    assert.equal(snapshot.val().connections.length, size, 'size should be the same.');
    assert.notEqual(snapshot.val().connections.indexOf(uid2), -1, uid2 + ' should be a connection.');
    done();
  });
}

function thenConnectionDoesNotExistInDatabase(uid1, uid2, done) {
  firebase.database().ref('connection/' + uid1).once('value').then(function(snapshot) {
    console.log(snapshot.val());
    assert.equal(snapshot.val().uid, uid1, 'uid should be the same.');
    if (snapshot.val().connections) {
      assert.equal(snapshot.val().connections.indexOf(uid2), -1, uid2 + ' should not be a connection.');
    }
    done();
  });
}

function thenTheConnectionIsValid(data, uid, size, done) {
  console.log(data);
  console.log('&&&&&&&');
  assert.equal(data.uid, uid, 'uid should be the same.');
  assert.equal(data.connections.length, size, 'size should be the same.');
  done();
}

