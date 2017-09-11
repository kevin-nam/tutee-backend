var firebase = require('firebase');

exports.getUserData = function(uid) {
  return firebase.database().ref('users/' + uid).once('value').then(function(snapshot) {
    return snapshot.val();
  });
};

exports.createUser = function(uid, username, email, profile_picture, bio) {
  if (username !== null && email !== null && bio !== null) {
    if (profile_picture == null) {
      profile_picture = 'https://www.vccircle.com/wp-content/uploads/2017/03/default-profile.png';
    }
    firebase.database().ref('users/' + uid).set({
      username: username,
      email: email,
      profile_picture: profile_picture,
      bio: bio,
      rating: 0
    });
    return {
      username: username,
      email: email,
      profile_picture: profile_picture,
      bio: bio,
      rating: 0
    };
  }
  return null;
};


/* exports.getTutorData = function(uid) {
    return firebase.database().ref('tutor/' +uid).once('value').then(function(snapshot) {
        if(snapshot.val()) {
            var tutorData = {username: "", email: "", profile_picture: "", bio: "", rating: ""};

            var userPromise = exports.getUserData(uid);
            tutorData = userPromise.then(function(user) {
                var tempTutorData = {username: "", email: "", profile_picture: "", bio: "", rating: ""};
                tempTutorData.username = user.username;
                tempTutorData.email = user.email;
                tempTutorData.profile_picture = user.profile_picture;
                tempTutorData.bio = snapshot.val().bio;
                tempTutorData.rating = snapshot.val().rating;
                return tempTutorData;
            });
            return tutorData;
        }
        return null;
    });
};
*/
exports.updateUser = function(uid, newUsername, newEmail, new_profile_picture, newBio, newRating) {
  var updates = {};
  var newData =
        {
          username: newUsername,
          email: newEmail,
          profile_picture: new_profile_picture,
          bio: newBio,
          rating: newRating
        };
  updates['/users/' + uid] = newData;
  firebase.database().ref().update(updates);
  return updates;
};
