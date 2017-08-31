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
var tutorService = require('../tutee_modules/tutor/tutorService.js');
assert = chai.assert;
if (!firebase.apps.length) {
    firebase.initializeApp(config);
}

/**********************************************************************
Global Variables
***********************************************************************/


var uid = "hello";
var bio = "Test BIO";
var rating = 100;
var tutorData;
var approval = true;
var newBio = "This is the newest Bio";
var newRating = 300;
var newApproval = false;

/**********************************************************************
Tests - Alternate Flows
***********************************************************************/


// Read tutor profile data
describe('CRUD Profile Tests', function() {
  //Test createTutor
  it('Given a UId, when creating a profile, then the profile should exist for that tutor.', function(done) {
    givenAuid();
    whenCreatingTheirProfile();
    thenTheProfileExistsForTheGivenUser(done);
  });

  //Test getTutorData
  it('Given a Uid with a profile, when getting their profile then that profile should exist.', function(done) {
      givenAuid();
      this.timeout(5000);
      whenGettingTheirProfile();
      thenTheProfileShouldExist(done);
  });

  //Test updateTutor
  it('Given a Uid with a profile, when updating their profile then their profile should be updated.', function(done) {
      givenAuid();
      whenUpdatingTheirProfile();
      thenTheProfileShouldUpdate(done);
  });
});

describe('Null-Value Tests', function () {
    //Test nullBio
    it('Given null bio info when creating a profile then the profile should not be created.', function(done) {
        givenAuidAndNullBio();
        whenCreatingTheirProfile();
        thenProfileDoesNotExistInDatabase(done);
    });

    //Test nullRating
    it('Given null rating info when creating a profile then the profile should not be created', function(done) {
        givenAuidAndNullRating();
        whenCreatingTheirProfile();
        thenProfileDoesNotExistInDatabase(done);
    });

    //Test falseApproval
    it('Given a false approval rating when creating a profile then the profile should not be created', function(done) {
        givenAuidAndNullApproval();
        whenCreatingTheirProfile();
        thenProfileDoesNotExistInDatabase(done);
    });
});


/**********************************************************************
Given
***********************************************************************/

function givenAuid() {
    uid = "pbzBUjjBbfRSHNsfWsEZlQIVSwK2";
}

function givenAuidAndNullBio() {
    uid = "test";
    bio = null;
}

function givenAuidAndNullRating() {
    uid = "test";
    rating = null;
}

function givenAuidAndNullApproval() {
    uid = "test";
    approval = null;
}

/**********************************************************************
When
***********************************************************************/

function whenCreatingTheirProfile() {
    tutorService.createTutor(uid, bio, rating, approval);
}

function whenGettingTheirProfile() {
    tutorService.getTutorData(uid).then(function(profile) {
        tutorData = profile;
    });
}

function whenUpdatingTheirProfile() {
    tutorService.updateTutor(uid, newBio, newRating, newApproval);
}

/**********************************************************************
Then
***********************************************************************/

function thenTheProfileExistsForTheGivenUser(done) {
        firebase.database().ref('tutor/' + uid).once('value').then(function(snapshot) {

            assert.equal(snapshot.val().bio, bio, "Not the same bio.");
            assert.equal(snapshot.val().rating, rating, "Not the same rating.");

            done();
        });

}

function thenTheProfileShouldExist(done) {
    setTimeout(function() {
        firebase.database().ref('tutor/' + uid).once('value').then(function(snapshot) {
          assert.isNotNull(snapshot.val(), 'Profile should exist.');
          assert.equal(snapshot.val().bio, tutorData.bio, "Not the same bio.");
          assert.equal(snapshot.val().rating, tutorData.rating, "Not the same rating.");
          done();
        });
    }, 1000);
}

function thenTheProfileShouldUpdate(done) {
         firebase.database().ref('tutor/' + uid).once('value').then(function (snapshot) {

             assert.isNotNull(snapshot.val(), 'Profile should exist.');
             assert.equal(snapshot.val().bio, newBio, 'Bio should be the same.');
             assert.equal(snapshot.val().rating, newRating, 'Rating should be the same.');
             assert.equal(snapshot.val().approved, newApproval, 'Approval should be the same.');


             done();
         });
}

function thenProfileDoesNotExistInDatabase(done) {
        firebase.database().ref('tutor/' + uid).once('value').then(function (snapshot) {

            assert.isNull(snapshot.val(), "Profile should be null.");

            done();
        });
}
