exports.login = function() {
  if (!firebase.auth().currentUser) {
    var provider = new firebase.auth.FacebookAuthProvider();
    provider.addScope('user_likes');
    provider.setCustomParameters({
      'display': 'popup'
    });

    firebase.auth().signInWithPopup(provider)
    .then(function(result) {
      //addUserToDatabase(result.user)
    })
    .catch(function(error) {
      console.log(error)
    });

  } else {
    console.log('Already logged in')
  }
}

exports.logout = function() {
  if (firebase.auth().currentUser) {
    firebase.auth().signOut();
  } else {
    console.log('Already signed out')
  }
}

exports.isUserLoggedIn = function() {
  if (firebase.auth().currentUser) {
    return true;
  } else {
    return false;
  }
}

exports.addUserToDatabase = function(user) {
  if (user) {
    firebase.database().ref('users/' + user.uid).set({
      uid : user.uid,
      username: user.displayName,
      email: user.email,
      profile_picture : user.photoURL
    });
  }
}

exports.getCurrentUser = function() {
  return firebase.auth().currentUser;
}

exports.verifyIfUserIsLoggedIn = function() {
  getAuthStateChangedListener(function(user) {
    if (user) {
      addUserToDatabase(user);
    } else {
      window.location.replace("/");
    }
  });
}

exports.getAuthStateChangedListener = function(callback) {
  firebase.auth().onAuthStateChanged(function(user) {
    callback(user)
  });
}
