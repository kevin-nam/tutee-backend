var firebase = require('firebase-admin');

// tokenize the string of post tags
exports.tokenizeTags = function(tagString) {
  var tags;
  // checks for null or undefined tags
  if (tagString === null || tagString === undefined) {
    return null;
  }
  // gets rid of whitespaces
  tagString = tagString.replace(/\s/g, '');
  // deals with any speical characters and also checks if user used #s
  if (/[^a-zA-Z0-9\s#]/g.test(tagString) || /^#/g.test(tagString) === false) {
    return null;
  }
  // makes everything lowercase for consistency and deals with starting # so that first element of array isn't empty
  var tempTags = tagString.toLowerCase().substring(1);
  // deals with instances of multiple consecutive hashtags
  if (/#{2,}/g.test(tempTags)) {
    tempTags = tempTags.replace(/#{2,}/g, '#');
  }
  // deals with string that ends with 1 or more #s
  if (/#+$/g.test(tempTags)) {
    tempTags = tempTags.replace(/#+$/g, '');
  }

  tags = tempTags.split(/#/g);

  // deals with strings of whitespaces or #s
  if (tags[0] === '') {
    return null;
  }

  return tags;
};

// takes a string of tags, tokenizes them, and updates/pushes them to the database with the pid
exports.updateTags = function(tagString, pid) {
  var tags;
  tags = exports.tokenizeTags(tagString);
  tags.forEach(function(element) {
    firebase.database().ref('/tags/').child(element).child(pid).set(pid);
  });
};

// removes the pids in tags for posts whose tags have been updated
exports.removePid = function(tagString, pid) {
  var tags;
  tags = exports.tokenizeTags(tagString);
  tags.forEach(function(element) {
    firebase.database().ref('/tags/').child(element).child(pid).set({});
  });
};

exports.getPidListForATag = function(tag) {
  var ref = firebase.database().ref('/tags/');
  return ref.child(tag).once('value').then(function(snapshot) {
    var pidList = new Set();
    if (snapshot.val()) {
      values = Object.keys(snapshot.val());
      values.forEach(function(pid) {
        pidList.add(pid);
      });
      return Array.from(pidList);
    }
    return null;
  });
};

exports.getPidList = function(tagString, callback) {
  var counter = 0;
  var container;
  var pidList = new Set();
  var tags = exports.tokenizeTags(tagString);
  // console.log(tags)
  var ref = firebase.database().ref('/tags/');
  if (tags) {
    for (var i=0; i < tags.length; i++) {
      container = exports.getPidListForATag(tags[i]).then(function(pids) {
        pids.forEach(function(pid) {
          pidList.add(pid);
        });
        if (++counter == tags.length) {
          return callback(Array.from(pidList));
        }
      });
    }
    return container;
  } else {
    return callback(null);
  }
};
