var firebase = require('firebase');

exports.getUserData = function(uid) {
  return firebase.database().ref('users/' +uid).once('value').then(function(snapshot) {
      return snapshot.val();
  });
}

exports.createTutor = function(uid, bio, rating, approved) {
   if (bio !== null && rating !== null && approved !== null) {
     firebase.database().ref('tutor/' + uid).set({
       bio: bio,
       rating: rating,
       approved: approved
     });
   }
   return null;
}


exports.getTutorData = function(uid) {
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
}

exports.updateTutor = function(uid, newBio, newRating, newApproval) {
    var updates = {};
    var newData =
    {
        bio: newBio,
        rating: newRating,
        approved: newApproval
    };
    updates['/tutor/' + uid] = newData;
    firebase.database().ref().update(updates);
}
