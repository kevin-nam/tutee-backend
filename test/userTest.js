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
var userService = require('../tutee_modules/user/userService.js');
assert = chai.assert;
if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

/** ********************************************************************
Global Variables
***********************************************************************/

var uid = 'hello';
var username = 'test username';
var email = 'test email';
var profile_picture = 'test_picture';
var bio = 'Test BIO';
var userData;
var newUsername = 'new test username';
var newEmail = 'new test email';
var new_profile_picture = 'new_test_picture';
var newBio = 'This is the newest Bio';
var newRating = 300;
var newRatingSum = 300;
var newNumOfRatings = 1;

/** ********************************************************************
Tests - Alternate Flows
***********************************************************************/

// Read User data
describe('CRUD User Tests', function() {
  // Test createUser
  it('Given a UId, when creating a user, then the user should exist.', function(
    done
  ) {
    givenAuid();
    whenCreatingTheUser();
    thenTheUserExists(done);
  });

  // Test getUserData
  it('Given a Uid, when getting the user then the user should exist.', function(
    done
  ) {
    givenAuid();
    this.timeout(5000);
    whenGettingTheUser();
    thenTheUserShouldExist(done);
  });

  // Test updateUser
  it('Given a Uid associated to a user, when updating their info then the user\'s info should be updated.', function(
    done
  ) {
    givenAuid();
    whenUpdatingTheirInfo();
    thenTheInfoShouldUpdate(done);
  });
});

describe('Null-Value Tests', function() {
  // Test nullBio
  it('Given null bio info when creating a user then the user should not be created.', function(
    done
  ) {
    givenAuidAndNullBio();
    whenCreatingTheUser();
    thenUserDoesNotExistInDatabase(done);
  });

  // Test nullEmail
  it('Given null email info when creating a user then the user should not be created', function(
    done
  ) {
    givenAuidAndNullEmail();
    whenCreatingTheUser();
    thenUserDoesNotExistInDatabase(done);
  });

  // Test falseApproval
  it('Given null username info when creating a user then the user should not be created', function(
    done
  ) {
    givenAuidAndNullUsername();
    whenCreatingTheUser();
    thenUserDoesNotExistInDatabase(done);
  });
});

/** ********************************************************************
Given
***********************************************************************/

function givenAuid() {
  uid = 'hello';
}

function givenAuidAndNullBio() {
  uid = 'test';
  bio = null;
}

function givenAuidAndNullEmail() {
  uid = 'test';
  email = null;
}

function givenAuidAndNullUsername() {
  uid = 'test';
  username = null;
}

/** ********************************************************************
When
***********************************************************************/

function whenCreatingTheUser() {
  userService.createUser(uid, username, email, profile_picture, bio);
}

function whenGettingTheUser() {
  userService.getUserData(uid).then(function(user) {
    userData = user;
  });
}

function whenUpdatingTheirInfo() {
  userService.updateUser(
    uid,
    newUsername,
    newEmail,
    new_profile_picture,
    newBio,
    newRating,
    newRatingSum,
    newNumOfRatings
  );
}

/** ********************************************************************
Then
***********************************************************************/

function thenTheUserExists(done) {
  firebase
    .database()
    .ref('users/' + uid)
    .once('value')
    .then(function(snapshot) {
      assert.equal(snapshot.val().bio, bio, 'Not the same bio.');
      assert.equal(snapshot.val().rating, -1, 'Not the same rating.');
      assert.equal(snapshot.val().email, email, 'Not the same email.');
      assert.equal(
        snapshot.val().profile_picture,
        profile_picture,
        'Not the same profile picture.'
      );
      assert.equal(snapshot.val().username, username, 'Not the same username.');
      assert.equal(snapshot.val().ratingSum, 0, 'Not the same ratingSum.');
      assert.equal(
        snapshot.val().numOfRatings,
        0,
        'Not the same number of ratings'
      );

      done();
    });
}

function thenTheUserShouldExist(done) {
  setTimeout(function() {
    firebase
      .database()
      .ref('users/' + uid)
      .once('value')
      .then(function(snapshot) {
        assert.isNotNull(snapshot.val(), 'User should exist.');
        assert.equal(snapshot.val().bio, userData.bio, 'Not the same bio.');
        assert.equal(
          snapshot.val().rating,
          userData.rating,
          'Not the same rating.'
        );
        assert.equal(
          snapshot.val().email,
          userData.email,
          'Not the same email.'
        );
        assert.equal(
          snapshot.val().profile_picture,
          userData.profile_picture,
          'Not the same profile picture.'
        );
        assert.equal(
          snapshot.val().username,
          userData.username,
          'Not the same username.'
        );

        done();
      });
  }, 1000);
}

function thenTheInfoShouldUpdate(done) {
  firebase
    .database()
    .ref('users/' + uid)
    .once('value')
    .then(function(snapshot) {
      assert.isNotNull(snapshot.val(), 'User should exist.');
      assert.equal(snapshot.val().bio, newBio, 'Bio should be the same.');
      assert.equal(
        snapshot.val().rating,
        newRating,
        'Rating should be the same.'
      );
      assert.equal(snapshot.val().email, newEmail, 'Email should be the same.');
      assert.equal(
        snapshot.val().profile_picture,
        new_profile_picture,
        'Profile picture should be the same.'
      );
      assert.equal(
        snapshot.val().username,
        newUsername,
        'Username should be the same.'
      );
      assert.equal(
        snapshot.val().ratingSum,
        newRatingSum,
        'Rating sum should be the same.'
      );
      assert.equal(
        snapshot.val().numOfRatings,
        newNumOfRatings,
        'Number of ratings should be the same.'
      );

      done();
    });
}

function thenUserDoesNotExistInDatabase(done) {
  firebase
    .database()
    .ref('users/' + uid)
    .once('value')
    .then(function(snapshot) {
      assert.isNull(snapshot.val(), 'User should be null.');

      done();
    });
}
