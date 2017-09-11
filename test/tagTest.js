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
var tagService = require('../tutee_modules/tag/tagService.js');
assert = chai.assert;
if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

/** ********************************************************************
Global Variables
***********************************************************************/


var multiTags = '#random#new#test#kevin';
var singleTag = '#random';
var badTags = ' hey sammy';
var pidList;
var tagString;
var actualTags;
var expectedTags = ['tag1', 'ecse456', 'french', 'donuts', 'university'];
var expectedSingleTag = ['tag1ecse456frenchdonutsuniversity'];
var newTags;
var pid = 'tagtest';
var pidObj = {'tagtest': 'tagtest'};
var newPid = 'tagtest2';
var newPidObj = {'tagtest': 'tagtest', 'tagtest2': 'tagtest2'};


/** ********************************************************************
Tests - Alternate Flows
***********************************************************************/


describe('Tag Tokenization Test', function() {
  // Undefined tags
  it('Given undefined tag info when tokenizing the tag string then a null value should be returned', function(done) {
    // givenUndefinedTag();
    whenTokenizingTag();
    thenReturnNull(done);
  });

  // Null tags
  it('Given null tag info when tokenizing the tag string then a null value should be returned', function(done) {
    givenNullTag();
    whenTokenizingTag();
    thenReturnNull(done);
  });

  // Expected Input
  it('Given expected tag info when tokenizing the tag string then a correct tag array is created', function(done) {
    givenExpectedTagInfo();
    whenTokenizingTag();
    thenCorrectTagArray(done);
  });

  // Special Characters
  it('Given tag info containing special characters when tokenizing the tag string then a null value should be returned', function(done) {
    givenTagInfoWithSpecialCharacters();
    whenTokenizingTag();
    thenReturnNull(done);
  });

  // Only whitespace tags
  it('Given a tag string containing only whitespaces when tokenizing the tag string then a null value should be returned', function(done) {
    givenOnlyWhiteSpaceTagString();
    whenTokenizingTag();
    thenReturnNull(done);
  });

  // Only # tags
  it('Given tags containing only # when tokenizing the tag string then a null value should be returned', function(done) {
    givenOnlyHashtags();
    whenTokenizingTag();
    thenReturnNull(done);
  });

  // Tags string that ends with #s
  it('Given tag info containing #s at the end of the string when tokenizing the tag string then a correct tag array is created', function(done) {
    givenHashtagsAtEndOfString();
    whenTokenizingTag();
    thenCorrectTagArray(done);
  });

  // Tags string with no #s
  it('Given tag info containing no #s when tokenizing the tag string then a null value should be returned', function(done) {
    givenNoHashtags();
    whenTokenizingTag();
    thenReturnNull(done);
  });

  // Tag string with only 1 # at the beginning
  it('Given tag info containing one # at the beginning of the string when tokenizing the tag string then a correct tag array is created containing only 1 tag', function(done) {
    givenOneHashtagAtBeginning();
    whenTokenizingTag();
    thenCorrectTagArrayWithOneTag(done);
  });

  // Tag string with only 1 # at the middle
  it('Given tag info containing one # at the beginning of the string when tokenizing the tag string then a null value should be returned', function(done) {
    givenOneHashtagAtMiddle();
    whenTokenizingTag();
    thenReturnNull(done);
  });
});

describe('Tag Update Test', function() {
  // new tags
  it('Given a new set of tags when updating tag table then the tags will appear on the database', function(done) {
    this.timeout(5000);
    givenNewTags();
    whenUpdatingNewTags();
    thenAddNewTagsToDatabase(done);
  });
  // existing tags
  it('Given an existing set of tags when updating tag table then the tags will contain new pids in the database', function(done) {
    this.timeout(5000);
    // givenExistingTags();
    whenUpdatingExistingTags();
    thenAddPidToExistingTagsInDatabase(done);
  });
});

describe('Pid Remove Test', function() {
  // remove pids
  it('Given an existing set of tags when removing pids from tag table then the tags in the database will no longer contain the pid', function(done) {
    this.timeout(5000);
    // givenExistingTags();
    whenRemovingAPid();
    thenPidIsRemovedFromDatabase(done);
  });
  // remove tags
  it('Given an existing set of tags when removing all pids for that tag from tag table then the tags in the database will no longer exist', function(done) {
    this.timeout(5000);
    // givenExistingTags();
    whenRemovingAllPid();
    thenTagIsRemovedFromDatabase(done);
  });
});

describe('Pid List Test', function() {
  // Pid List for a single tag
  it('Given a tagString containing one tag when getting the list of pids for that tag then the pid list is returned containing all the pids for that tag', function(done) {
    // givenASingleExistingTag();
    whenGettingPidList(singleTag);
    thenPidListReturned(done);
  });
  // Pid List for mutliple tags
  it('Given a tagString containing mutliple tags when getting the list of pids for those tags then the pid list is returned containing all the pids for that tag', function(done) {
    // givenASingleExistingTag();
    whenGettingPidList(multiTags);
    thenMultiTagPidListReturned(done);
  });
  // Pid List for bad tags
  it('Given a tagString containing mutliple tags taht don\'t exist when getting the list of pids for that tag then the pid list is returned containing null', function(done) {
    // givenASingleExistingTag();
    whenGettingPidList(badTags);
    thenPidListReturnedIsNull(done);
  });
});


/** ********************************************************************
Given
***********************************************************************/


function givenExpectedTagInfo() {
  tagString = '#tag1#ecse456#french#DONUTS#UniVersitY';
}

function givenTagInfoWithSpecialCharacters() {
  tagString = '#SFSD #DSF^%$# #DFHFD';
}

function givenNullTag() {
  tagString = null;
}

function givenOnlyWhiteSpaceTagString() {
  tagString = '            ';
}

function givenOnlyHashtags() {
  tagString = '########';
}

function givenHashtagsAtEndOfString() {
  tagString = '#tag1 #ecse456 #french #DONUTS #UniVersitY ###';
}

function givenNoHashtags() {
  tagString = 'tag1 ecse456 french DONUTS UniVersitY ';
}

function givenOneHashtagAtBeginning() {
  tagString = '   #tag1 ecse456 french DONUTS UniVersitY ';
}

function givenOneHashtagAtMiddle() {
  tagString = 'tag1 ecse456 french #DONUTS UniVersitY ';
}

function givenNewTags() {
  newTags = '#nicky #khoi #katie #judy';
}


/** ********************************************************************
When
***********************************************************************/


function whenTokenizingTag() {
  actualTags = tagService.tokenizeTags(tagString);
}

function whenUpdatingNewTags() {
  tagService.updateTags(newTags, pid);
}

function whenUpdatingExistingTags() {
  tagService.updateTags(newTags, newPid);
}

function whenRemovingAPid() {
  tagService.removePid(newTags, newPid);
}

function whenRemovingAllPid() {
  tagService.removePid(newTags, pid);
}

function whenGettingPidList(list) {
  tagService.getPidList(list, function(pids) {
    pidList = pids;
  });
}


/** ********************************************************************
Then
***********************************************************************/


function thenCorrectTagArray(done) {
  assert.deepEqual(actualTags, expectedTags, 'Tag array should be the same.');

  done();
}

function thenCorrectTagArrayWithOneTag(done) {
  assert.deepEqual(actualTags, expectedSingleTag, 'Tag array should be the same.');

  done();
}

function thenReturnNull(done) {
  assert.isNull(actualTags, 'Tags should not exist.');

  done();
}

function thenAddNewTagsToDatabase(done) {
  firebase.database().ref('tags/').once('value').then(function(snapshot) {
    assert.deepEqual(snapshot.val().khoi, pidObj, 'Pid should be the same.');
    assert.deepEqual(snapshot.val().katie, pidObj, 'Pid should be the same.');
    assert.deepEqual(snapshot.val().judy, pidObj, 'Pid should be the same.');
    assert.deepEqual(snapshot.val().nicky, pidObj, 'Pid should be the same.');

    done();
  });
}

function thenAddPidToExistingTagsInDatabase(done) {
  firebase.database().ref('tags/').once('value').then(function(snapshot) {
    assert.deepEqual(snapshot.val().khoi, newPidObj, 'Pid should be the same.');
    assert.deepEqual(snapshot.val().nicky, newPidObj, 'Pid should be the same.');
    assert.deepEqual(snapshot.val().judy, newPidObj, 'Pid should be the same.');
    assert.deepEqual(snapshot.val().katie, newPidObj, 'Pid should be the same.');

    done();
  });
}

function thenPidIsRemovedFromDatabase(done) {
  firebase.database().ref('tags/').once('value').then(function(snapshot) {
    assert.deepEqual(snapshot.val().nicky, pidObj, 'Pid should be removed.');
    assert.deepEqual(snapshot.val().khoi, pidObj, 'Pid should be removed.');
    assert.deepEqual(snapshot.val().katie, pidObj, 'Pid should be removed.');
    assert.deepEqual(snapshot.val().judy, pidObj, 'Pid should be removed.');

    done();
  });
}

function thenTagIsRemovedFromDatabase(done) {
  firebase.database().ref('tags/').once('value').then(function(snapshot) {
    assert.isUndefined(snapshot.val().khoi, 'Tag should be removed.');
    assert.isUndefined(snapshot.val().katie, 'Tag should be removed.');
    assert.isUndefined(snapshot.val().judy, 'Tag should be removed.');
    assert.isUndefined(snapshot.val().nicky, 'Tag should be removed.');

    done();
  });
}

function thenPidListReturned(done) {
  setTimeout(function() {
    firebase.database().ref('tags/').once('value').then(function(snapshot) {
      assert.deepEqual(pidList, Object.keys(snapshot.val().random), 'Pid list should be the same.');
      done();
    }, 1000);
  });
}

function thenMultiTagPidListReturned(done) {
  var testArr = [];
  var arr;
  var mySet;
  var final;
  firebase.database().ref('tags/').once('value').then(function(snapshot) {
    arr = testArr.concat(Object.keys(snapshot.val().random), Object.keys(snapshot.val().new), Object.keys(snapshot.val().test), Object.keys(snapshot.val().kevin));
    mySet = new Set(arr);
    final = Array.from(mySet);
    console.log(final);
    assert.deepEqual(pidList, final, 'Pid list should be the same.');

    done();
  });
}

function thenPidListReturnedIsNull(done) {
  assert.isNull(pidList, 'Pid list should not exist.');

  done();
}
