var firebase = require('firebase');

exports.getUserData = function(uid) {
  return firebase
    .database()
    .ref('users/' + uid)
    .once('value')
    .then(function(snapshot) {
      return snapshot.val();
    });
};

exports.createUser = function(uid, username, email, profile_picture, bio) {
  if (username !== null && email !== null && bio !== null) {
    if (profile_picture == null) {
      profile_picture =
        'https://www.vccircle.com/wp-content/uploads/2017/03/default-profile.png';
    }
    firebase
      .database()
      .ref('users/' + uid)
      .set({
        username: username,
        email: email,
        profile_picture: profile_picture,
        bio: bio,
        rating: -1,
        ratingSum: 0,
        numOfRatings: 0
      });
    return {
      username: username,
      email: email,
      profile_picture: profile_picture,
      bio: bio,
      rating: -1,
      ratingSum: 0,
      numOfRatings: 0
    };
  }
  return null;
};

exports.updateUser = function(
  uid,
  newUsername,
  newEmail,
  new_profile_picture,
  newBio
) {
  var updates = {};
  var newData = {
    username: newUsername,
    email: newEmail,
    profile_picture: new_profile_picture,
    bio: newBio
  };
  updates['/users/' + uid] = newData;
  firebase
    .database()
    .ref()
    .child('/users/' + uid)
    .update(newData);
  return updates;
};

exports.updateRating = function(uid, newRating, newSum, newNumOfRatings) {
  var updates = {};
  var newData = {
    rating: Math.round(newRating * 10) / 10,
    ratingSum: newSum,
    numOfRatings: newNumOfRatings
  };
  updates['/users/' + uid] = newData;
  firebase
    .database()
    .ref()
    .child('/users/' + uid)
    .update(newData);
  return updates;
};
