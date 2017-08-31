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
var postService = require('../tutee_modules/post/postService.js');

assert = chai.assert;
if (!firebase.apps.length) {
    firebase.initializeApp(config);
}

/**********************************************************************
Global Variables
***********************************************************************/

var tuteePost;
var tuteeUid;
var tuteeDesc;
var tuteeTags;
var tuteeTitle;
var tagString;
var actualTags;
var title;
var description;
var tags;
var correctTags;
var pid;
var uid = "this is a uid";
var post;
var newTitle = 'this is a new title';
var newDesc = 'this is a new description';
var newTags = '#new #updated #demo #random #string';
var newCorrectTags;
var pidList = [];
var postList;
var type1 = 'tutor';
var type2 = 'tutee';
var expectedSingleTag = "#tag1ecse456frenchdonutsuniversity";
var expectedTags = "#tag1#ecse456#french#donuts#university";
var dateTime = new Date();


/**********************************************************************
Tests - Alternate Flows
***********************************************************************/


describe('Typical CRUD Post Test', function () {
    //Test createPost
    it('Given random post info when creating a post then a post should be created', function (done) {
        this.timeout(5000);
        givenRandomPostInfo();
        whenCreatingPost();
        thenPostExistsInDatabase(done);
    });

    //Test getPost
    it('Given a pid when getting the post then correct post should be retrieved', function (done) {
        //givenPid();
        whenGettingPost();
        this.timeout(5000);
        thenPostRetrievedFromDatabase(done);
    });

    //Test updatePost
    it('Given a pid when updating the post then post data is changed', function (done) {
        this.timeout(5000);
        //givenPid();
        whenUpdatingPost();
        thenPostUpdatedinDatabase(done);
    });

    //Test deletePost
    it('Given an existing post when deleting a post then the post should be removed from database', function (done) {
        this.timeout(3000);
        //givenExistingPost();
        whenRemovingPost();
        thenPostNoLongerExistInDatabase(done);
    });

    //Test getPostList
    it("Given a list of pid's when searching for posts then we should get a list of posts associated to the pid's.", function (done) {
        givenaListofPids();
        whenSearchingtheDatabase();
        thenlistofPostsisReceived(done);
    });
});

describe('Null-Case Post Test', function () {
    //Test createPost
    it('Given null post info when creating a post then a post shouldn\'t be created', function (done) {
        givenNullPostInfo();
        whenCreatingPost();
        thenPostDoesNotExistInDatabase(done);
    });

    //Test getPost
    it('Given a null pid when getting the post then no post should be retrieved', function (done) {
        this.timeout(3000);
        //givenNonExistingPid();
        whenGettingPost();
        thenPostDoesNotExistInDatabase(done);
    });

    //Test updatePost
    it('Given a null pid when updating the post then no post data is changed', function (done) {
        this.timeout(3000);
        //givenPid();
        whenUpdatingPost();
        thenPostDoesNotExistInDatabase(done);
    });

    //Test deletePost
    it('Given a none existing post when deleting a post then the post should be removed from db', function (done) {
        this.timeout(3000);
        //givenNonExistingPost();
        whenRemovingPost();
        thenPostNoLongerExistInDatabase(done);
    });
});

describe('Tag Parser Test', function () {
    //Undefined tags
    it('Given undefined tag info when parsing the tag string then a null value should be returned', function (done) {
        //givenUndefinedTag();
        whenParsingTag();
        thenReturnNullTags(done);
    });

    //Null tags
    it('Given null tag info when parsing the tag string then a null value should be returned', function (done) {
        givenNullTag();
        whenParsingTag();
        thenReturnNullTags(done);
    });

    //Expected Input
    it('Given expected tag info when parsing the tag string then a correct tag string is created', function (done) {
        givenExpectedTagInfo();
        whenParsingTag();
        thenCorrectTagString(done);
    });

    //Special Characters
    it('Given tag info containing special characters when parsing the tag string then a null value should be returned', function (done) {
        givenTagInfoWithSpecialCharacters();
        whenParsingTag();
        thenReturnNullTags(done);
    });

    //Only whitespace tags
    it('Given a tag string containing only whitespaces when parsing the tag string then a null value should be returned', function (done) {
        givenOnlyWhiteSpaceTagString();
        whenParsingTag();
        thenReturnNullTags(done);
    });

    //Only # tags
    it('Given tags containing only # when parsing the tag string then a null value should be returned', function (done) {
        givenOnlyHashtags();
        whenParsingTag();
        thenReturnNullTags(done);
    });

    //Tags string that ends with #s
    it('Given tag info containing #s at the end of the string when parsing the tag string then a correct tag string is created', function (done) {
        givenHashtagsAtEndOfString();
        whenParsingTag();
        thenCorrectTagString(done);
    });

     //Tags string with no #s
    it('Given tag info containing no #s when parsing the tag string then a null value should be returned', function (done) {
        givenNoHashtags();
        whenParsingTag();
        thenReturnNullTags(done);
    });

    //Tag string with only 1 # at the beginning
    it('Given tag info containing one # at the beginning of the string when parsing the tag string then a correct tag string is created containing only 1 tag', function (done) {
       givenOneHashtagAtBeginning();
       whenParsingTag();
       thenCorrectTagStringWithOneTag(done);
   });

    //Tag string with only 1 # at the middle
    it('Given tag info containing one # at the beginning of the string when parsing the tag string then a null value should be returned', function (done) {
        givenOneHashtagAtMiddle();
        whenParsingTag();
        thenReturnNullTags(done);
    });
});


/**********************************************************************
Given
***********************************************************************/


function givenRandomPostInfo() {
    title = "This is a a post title";
    description = "This is adescription string";
    tags = "#random #demo #string";
    uid = "8cUvPiele8V55f7tFow8X29FQn03";
    correctTags = postService.parseTags(tags);
}

function givenNullPostInfo() {
    title = null;
    description = null;
    tags = null;
    uid = null;
}

function givenaListofPids() {
    pidList = ["-KfI8LzfiSnFjRWCgJt7", "-KfI8NEFcuvq1AnPfCUU", "aaaaaa", "-KfI8Pw0WZxUfk3jnyBJ", "-KfI8WRHBf4v-K6KqKYy", "-KfI8Y6GnYPGRZm05zRZ"];
}

function givenExpectedTagInfo() {
    tagString = "#tag1 #ecse456 #french #DONUTS #UniVersitY ";
}

function givenTagInfoWithSpecialCharacters() {
    tagString = "#SFSD #DSF^%$# #DFHFD";
}

function givenNullTag() {
    tagString = null;
}

function givenOnlyWhiteSpaceTagString() {
    tagString = "            ";
}

function givenOnlyHashtags() {
    tagString = "########";
}

function givenHashtagsAtEndOfString() {
    tagString = "#tag1 #ecse456 #french #DONUTS #UniVersitY ###";
}

function givenNoHashtags() {
    tagString = "tag1 ecse456 french DONUTS UniVersitY ";
}

function givenOneHashtagAtBeginning() {
    tagString = "   #tag1 ecse456 french DONUTS UniVersitY ";
}

function givenOneHashtagAtMiddle() {
    tagString = "tag1 ecse456 french #DONUTS UniVersitY ";
}


/**********************************************************************
When
***********************************************************************/


function whenCreatingPost() {
    pid = postService.createPost(title, description, tags, type1, uid);
}

function whenRemovingPost() {
    postService.deletePost(pid);
}

function whenGettingPost() {
    setTimeout(function() {
        postService.getPost(pid).then(function(data) {
            post = data;
        });
    },1000);
}

function whenUpdatingPost() {
    postService.updatePost(pid, uid, newTitle, newDesc, newTags, type1);
    newCorrectTags = postService.parseTags(newTags);
}

function whenSearchingtheDatabase() {
    postService.getPostList(pidList).then(function(list) {
        postList = list;
        //console.log(postList);
        //console.log(postList[0]);
    });

}

function whenParsingTag() {
    actualTags = postService.parseTags(tagString);
}


/**********************************************************************
Then
***********************************************************************/


function thenPostExistsInDatabase(done) {
    firebase.database().ref('posts/' + pid).once('value').then(function (snapshot) {

        assert.equal(snapshot.val().title, title, 'Title should be the same.');
        assert.equal(snapshot.val().description, description, 'description should be the same.');
        assert.equal(snapshot.val().tagString, correctTags, 'Tags should be the same.');
        assert.equal(snapshot.val().type, type1,'The type should be the same.');

        done();
    });
}

function thenPostDoesNotExistInDatabase(done) {

    setTimeout(function() {
        assert.isNull(pid, "pid should be null");

        done();
    }, 1000);
}

function thenPostNoLongerExistInDatabase(done) {

    setTimeout(function() {
        firebase.database().ref('posts/' + pid).once('value').then(function (snapshot) {

            assert.isNull(snapshot.val(), 'Post should not exist');

        done();
        });
    }, 1000);
}

function thenPostRetrievedFromDatabase(done) {
    setTimeout(function() {
        firebase.database().ref('posts/' + pid).once('value').then(function (snapshot) {

        assert.isNotNull(snapshot.val(), 'Post should exist');
        assert.equal(snapshot.val().title, post.title, 'Title should be the same.');
        assert.equal(snapshot.val().description, post.description, 'description should be the same.');
        assert.equal(snapshot.val().tagString, post.tagString, 'Tags should be the same.');
        assert.equal(snapshot.val().type, post.type, 'Type should be the same.');
        assert.equal(snapshot.val().date, post.date, 'Date should be the same.');

        done();
        });
    }, 2000);
}

function thenPostUpdatedinDatabase(done) {
    setTimeout(function() {
        firebase.database().ref('posts/' + pid).once('value').then(function (snapshot) {
            assert.isNotNull(snapshot.val(), 'Post should exist');
            assert.equal(snapshot.val().title, newTitle, 'Title should be the same.');
            assert.equal(snapshot.val().description, newDesc, 'description should be the same.');
            assert.equal(snapshot.val().tagString, newCorrectTags, 'Tags should be the same.');
            assert.equal(snapshot.val().type, type1,'The type should be the same.');

            done();
        });
   },1000);
}

function thenlistofPostsisReceived(done) {
    setTimeout(function() {
        firebase.database().ref('posts/').orderByKey().startAt(pidList[0]).endAt(pidList[pidList.length-1]).once('value').then(function (snapshot) {
            //console.log(postList[0]);
            //console.log(pidList[0]);
            for(i=0; i<pidList.length-1; i++) {
                assert.equal(snapshot.child("posts/" +pidList[i]).key, pidList[i], "Pid's should be the same");
            }
            done();
        });
    }, 1000);
}

function thenCorrectTagString (done) {
    assert.deepEqual(actualTags, expectedTags, 'Tag string should be the same.');

    done();
}

function thenCorrectTagStringWithOneTag(done) {
    assert.deepEqual(actualTags, expectedSingleTag, 'Tag string should be the same.');

    done();
}

function thenReturnNullTags (done) {
    assert.isNull(actualTags, 'Tags should not exist.');

    done();
}
