/** ********************************************************************
Initialization
***********************************************************************/
var firebase = require('firebase-admin');
var serviceAccount = require('../firebase-admin-cred.json');

var chai = require('chai');
var searchService = require('../tutee_modules/search/searchService.js');

var assert = chai.assert;
if (!firebase.apps.length) {
  firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: 'https://tutee-9b050.firebaseio.com'
  });
}

/** ********************************************************************
Global Variables
***********************************************************************/


var singleTag = 'demo';
var multipleTags = 'ale kevin vitto h3lp h3lp3r';
var postList = [];
var searchString;
var actualTags;
var expectedTags = '#tag1#ecse456#french#donuts#university';
var expectedSingleTag = '#tag1ecse456frenchdonutsuniversity';
var pidListSingle = ['-KfI8LzfiSnFjRWCgJt7', '-KfI8NEFcuvq1AnPfCUU', '-KfI8Pw0WZxUfk3jnyBJ', '-KfI8WRHBf4v-K6KqKYy', '-KfI8Y6GnYPGRZm05zRZ', '-KgMwPIYphUcmL1Y_aYI', '-KgPw9RbIj0zeVji7pDR'];
var pidListMultiple = ['-KfI93pClbK7uvvXpxpA', '-KfIWsgQrhV68VKGnbeA', '-KfIX3_533FRgk_xrc4f'];

/** ********************************************************************
Tests - Alternate Flows
***********************************************************************/


describe('Post Search Test', function() {
  // Single Tag Search (Tag Exists)
  it('Given a user when searching for a single tag then posts containing that tag are returned', function(done) {
    this.timeout(6000);
    // givenauser();
    whenSearchingforaSingleTag();
    thenPostswithThatTagReturned(done);
  });

  it('Given a user when searching for multiple tags then posts containing those tags are returned', function(done) {
    this.timeout(6000);
    // givenauser();
    whenSearchingforMultipleTags();
    thenPostswithThoseTagsAreReturned(done);
  });
});

describe('Search Parser Test', function() {
  // Undefined search
  it('Given undefined search info when parsing the search string then a null value should be returned', function(done) {
    // givenUndefinedSearch();
    whenParsingSearch();
    thenReturnNullTags(done);
  });

  // Null search
  it('Given null search info when parsing the search string then a null value should be returned', function(done) {
    givenNullSearch();
    whenParsingSearch();
    thenReturnNullTags(done);
  });

  // Expected Input
  it('Given expected search info when parsing the search string then a correct tag string is created', function(done) {
    givenExpectedSearchInfo();
    whenParsingSearch();
    thenCorrectTagString(done);
  });

  // Special Characters
  it('Given search info containing special characters when parsing the search string then a null value should be returned', function(done) {
    givenSearchInfoWithSpecialCharacters();
    whenParsingSearch();
    thenReturnNullTags(done);
  });

  // Only whitespace search
  it('Given a search string containing only whitespaces when parsing the search string then a null value should be returned', function(done) {
    givenOnlyWhiteSpaceSearchString();
    whenParsingSearch();
    thenReturnNullTags(done);
  });

  // Only # search
  it('Given search info containing only # when parsing the search string then a null value should be returned', function(done) {
    givenOnlyHashtags();
    whenParsingSearch();
    thenReturnNullTags(done);
  });

  // Tags string that ends with #s
  it('Given search info containing #s at the end of the string when parsing the search string then a correct tag string is created', function(done) {
    givenHashtagsAtEndOfString();
    whenParsingSearch();
    thenCorrectTagString(done);
  });

  // Search string with no spaces between words
  it('Given search info containing no spaces between the words of the string when parsing the search string then a correct tag string is created containing only 1 tag', function(done) {
    givenNoSpacesBetweenWords();
    whenParsingSearch();
    thenCorrectTagStringWithOneTag(done);
  });

  // Tag string with only 1 # at the middle
  it('Given search info containing one # at the beginning of the string when parsing the search string then a correct tag string is created', function(done) {
    givenOneHashtagAtMiddle();
    whenParsingSearch();
    thenCorrectTagString(done);
  });
});


/** ********************************************************************
Given
***********************************************************************/


function givenNullSearch() {
  searchString = null;
}

function givenExpectedSearchInfo() {
  searchString = 'tag1 ecse456 french DONUTS UniVersitY';
}

function givenSearchInfoWithSpecialCharacters() {
  searchString = '#SFSD #DSF^%$# DFHFD';
}

function givenOnlyWhiteSpaceSearchString() {
  searchString = '            ';
}

function givenOnlyHashtags() {
  searchString = '########';
}

function givenHashtagsAtEndOfString() {
  searchString = 'tag1 ecse456 french DONUTS UniVersitY ###';
}

function givenNoSpacesBetweenWords() {
  searchString = '  tag1ecse456frenchDONUTSUniVersitY ';
}

function givenOneHashtagAtMiddle() {
  searchString = 'tag1 ecse456 french #DONUTS UniVersitY ';
}


/** ********************************************************************
When
***********************************************************************/


function whenSearchingforaSingleTag() {
  searchService.searchPosts(singleTag).then(function(list) {
    postList = list;
    // console.log(postList);
  });
}

function whenSearchingforMultipleTags() {
  searchService.searchPosts(multipleTags).then(function(list) {
    postList = list;
    // console.log(postList);
  });
}

function whenParsingSearch() {
  actualTags = searchService.parseSearchTags(searchString);
}


/** ********************************************************************
Then
***********************************************************************/


function thenPostswithThatTagReturned(done) {
  setTimeout(function() {
    postList.sort();
    pidListSingle.sort();
    // console.log(postList);
    // console.log(pidListSingle);
    // console.log(postList[0].date);
    firebase.database().ref('posts/' + pidListSingle[0]).once('value').then(function(snapshot) {
      // console.log(snapshot.val().date);
      // console.log(postList[0].date);
      assert.equal(snapshot.val().date, postList[0].date, 'Dates should be the same.');
    });
    firebase.database().ref('posts/' + pidListSingle[1]).once('value').then(function(snapshot) {
      // console.log(snapshot.val().date);
      // console.log(postList[1].date);
      assert.equal(snapshot.val().date, postList[1].date, 'Dates should be the same.');
    });
    firebase.database().ref('posts/' + pidListSingle[2]).once('value').then(function(snapshot) {
      // console.log(snapshot.val().date);
      // console.log(postList[2].date);
      assert.equal(snapshot.val().date, postList[2].date, 'Dates should be the same.');
    });
    firebase.database().ref('posts/' + pidListSingle[3]).once('value').then(function(snapshot) {
      // console.log(snapshot.val().date);
      // console.log(postList[3].date);
      assert.equal(snapshot.val().date, postList[3].date, 'Dates should be the same.');
    });
    firebase.database().ref('posts/' + pidListSingle[4]).once('value').then(function(snapshot) {
      // console.log(snapshot.val().date);
      // console.log(postList[4].date);
      assert.equal(snapshot.val().date, postList[4].date, 'Dates should be the same.');
    });
    firebase.database().ref('posts/' + pidListSingle[5]).once('value').then(function(snapshot) {
      // console.log(snapshot.val().date);
      // console.log(postList[5].date);
      assert.equal(snapshot.val().date, postList[5].date, 'Dates should be the same.');
    });
    firebase.database().ref('posts/' + pidListSingle[6]).once('value').then(function(snapshot) {
      // console.log(snapshot.val().date);
      // console.log(postList[6].date);
      assert.equal(snapshot.val().date, postList[6].date, 'Dates should be the same.');
    });
    done();
  }, 1000);
}

function thenPostswithThoseTagsAreReturned(done) {
  setTimeout(function() {
    postList.sort();
    pidListMultiple.sort();
    // console.log(postList);
    // console.log(pidListMultiple);
    // console.log(postList[0].date);
    firebase.database().ref('posts/' + pidListMultiple[0]).once('value').then(function(snapshot) {
      // console.log(snapshot.val().date);
      // console.log(postList[0].date);
      assert.equal(snapshot.val().date, postList[0].date, 'Dates should be the same.');
    });
    firebase.database().ref('posts/' + pidListMultiple[1]).once('value').then(function(snapshot) {
      // console.log(snapshot.val().date);
      // console.log(postList[1].date);
      assert.equal(snapshot.val().date, postList[1].date, 'Dates should be the same.');
    });
    firebase.database().ref('posts/' + pidListMultiple[2]).once('value').then(function(snapshot) {
      // console.log(snapshot.val().date);
      // console.log(postList[2].date);
      assert.equal(snapshot.val().date, postList[2].date, 'Dates should be the same.');
    });
    done();
  }, 1000);
}

function thenReturnNullTags(done) {
  assert.isNull(actualTags, 'Tags should not exist.');

  done();
}

function thenCorrectTagString(done) {
  assert.deepEqual(actualTags, expectedTags, 'Tag string should be the same.');

  done();
}

function thenCorrectTagStringWithOneTag(done) {
  assert.deepEqual(actualTags, expectedSingleTag, 'Tag string should be the same.');

  done();
}
