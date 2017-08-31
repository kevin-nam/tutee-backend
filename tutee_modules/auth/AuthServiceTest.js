// Variables
var user = {uid : 'aaa', displayName : 'bbb', email : 'ccc', photoURL : 'ddd'};
var db = firebase.database();

// Login Test
describe('Login Test', function() {
  beforeEach(function(done) {
    this.timeout(5000)
    logout();
    setTimeout(function() {
      done()
    }, 1000)
  })


  it('Given a user, when logging in, then user should exist in database', function(done) {
    givenAUser();
    whenRegistering();
    thenUserShouldExistInDatabase(done);
  })

  it('Given a user not logged in, when navigating, then the user should require authentication', function(done) {
    givenAUserNotLoggedIn()
    //whenNavigating();
    thenUserShouldRequireAuthentication(done);
  })

  it('Given a random new user, when registering, then user should exist in database', function(done) {
    givenARandomNewUser();
    whenRegistering();
    thenUserShouldExistInDatabase(done);
  })

  after(function(done) {
    var ref = firebase.database().ref().child('users/' + user.uid).remove();
    done();
  })

});

// Given
function givenAUser() {
  user = {uid : 'testtest', displayName : 'test test', email : 'email@email.com', photoURL : 'photo.jpg'};
}

function givenARandomNewUser() {
  var randomString1 = Math.random().toString(36).substr(2, 5);
  var randomString2 = Math.random().toString(36).substr(2, 5);

  user.uid = "testtest" + randomString1 + randomString2;
  user.displayName = randomString1;
  user.email = randomString2 + "@email.com";
  user.photoURL = randomString2 + ".jpg";
}

function givenAUserNotLoggedIn() {
  logout();
}

// When
function whenRegistering() {
  addUserToDatabase(user)
}

// Then
function thenUserShouldExistInDatabase(done) {
  db.ref('/users/' + user.uid).once('value').then(function(snapshot) {

    actualUser = snapshot.val();

    assert.equal(actualUser.uid, user.uid, 'uid is not equal');
    assert.equal(actualUser.username, user.displayName, 'username is not equal');
    assert.equal(actualUser.email, user.email, 'email is not equal');
    assert.equal(actualUser.profile_picture, user.photoURL, 'photoURL is not equal');

    done()
  })
}

function thenUserShouldRequireAuthentication(done) {
  assert.equal(isUserLoggedIn(), false, 'isUserLoggedIn should return false');
  getAuthStateChangedListener(function(user) {
    assert.isNull(user, 'user should be null')
    done()
  })
}

function thenUserShouldBeLoggedIn(done) {
  getAuthStateChangedListener(function(user) {
    assert.isNotNull(user, 'user should be logged in')
    done()
  })
}
