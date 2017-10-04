var firebase = require('firebase');
var tagService = require('../tag/tagService.js');

exports.createPost = function(uid, title, description, tagString, type) {
  if (title !== null && description !== null && tagString !== null) {
    var newPost = firebase.database().ref('Posts/').push();
    var pid = newPost.key;
    var newDate = new Date();

    // A post entry.
    var postData = {
      uid: uid,
      title: title,
      description: description,
      tagString: helperParseTags(tagString),
      type: type,
      date: newDate,
    };
    // console.log(postData);
    if (postData.tagString) {
      var updates = {};
      updates['/posts/' + pid] = postData;
      firebase.database().ref().update(updates);
      tagService.updateTags(postData.tagString, pid);

      // Link pid to uid
      linkPidToUid(uid, pid, function() {
        return {
          'post': postData,
          'pid': pid
        };
      });
    }
    return null;
  }
  return null;
};

exports.updatePost = function(pid, uid, newTitle, newDesc, newTagString, newType) {
  if (newTitle !== null && newDesc !== null && newTagString !== null) {
    var updates = {};

    var newData = {
      uid: uid,
      title: newTitle,
      description: newDesc,
      tagString: helperParseTags(newTagString),
      type: newType,
      date: new Date(),
    };

    if (newData.tagString) {
      firebase.database().ref('/posts/' + pid).once('value').then(function(snapshot) {
        if (snapshot.val()) {
          tagService.removePid(snapshot.val().tagString, pid);
          tagService.updateTags(newData.tagString, pid);
        }
      });

      updates['/posts/' + pid] = newData;
      firebase.database().ref().update(updates);
      return newData;
    }
    return null;
  }
  return null;
};

exports.getPost = function(pid) {
  return firebase.database().ref('posts/' + pid).once('value').then(function(snapshot) {
    // console.log(snapshot.val());
    // console.log(snapshot.val().date);
    if (snapshot.val()) {
      var data = {
        title: snapshot.val().title,
        description: snapshot.val().description,
        tagString: snapshot.val().tagString,
        type: snapshot.val().type,
        date: snapshot.val().date,
      };
      // console.log(data);
      return data;
    }
    return null;
  });
};

exports.getPostList = function(pidList) {
  if ((pidList instanceof Array)) {
    var postObj;
    var finalList = [];
    var map = new Map([
      [Object, 'post'],
    ]);
    var pidListLength = pidList.length;
    pidList.sort();

    return firebase.database().ref('posts/').orderByKey().startAt(pidList[0]).endAt(pidList[pidListLength - 1]).once('value').then(function(snapshot) {
      postObj = snapshot.val();
      // console.log(snapshot.child("posts/" +pidList[0]).key);

      Object.keys(postObj).forEach(function(key) {
        map.set(key, postObj[key]);
      });
      pidList.forEach(function(pid) {
        var mapPost = map.get(pid);
        if (mapPost) {
          finalList.push(mapPost);
        }
      });
      // console.log(finalList);
      return finalList;
    });
  }
};

exports.deletePost = function(pid, callback) {
  var ref = firebase.database().ref('posts/' + pid);
  ref.once('value').then(function(snapshot) {
    if (snapshot.val()) {
      if (pid) {
        tagService.removePid(snapshot.val().tagString, pid);
        unlinkPidToUid(snapshot.val().uid, pid, function() {
          ref.remove();
          callback('Post Deleted');
        });
      }
      callback('Post Not Found');
    }
    callback('Post Not Found');
  });
};

exports.getAllPostsFromUid = function(uid) {
  return firebase.database().ref('/uidToPid/' + uid).once('value').then(function(snapshot) {
    if (snapshot.val()) {
      var pidList = snapshot.val().pidList;
      return exports.getPostList(pidList);
    } else {
      return [];
    }
  });
};

function unlinkPidToUid(uid, pid, callback) {
  firebase.database().ref('/uidToPid/' + uid).transaction(function(data) {
    if (!data || !data.pidList) {
      return data;
    } else {
      var index = data.pidList.indexOf(pid);
      if (index != -1) {
        data.pidList.splice(index, 1);
        return data;
      } else {
        return;
      }
    }
  }, function(error, committed, snapshot) {
    if (error) {
      console.log('Transaction failed abnormally!', error);
      callback(error);
    } else if (!committed) {
      console.log('PID ' + pid + ' does not exist for user ' + uid);
      var res = {
        status: 'PID_DOES_NOT_EXIST'
      };
      callback(res);
    } else {
      console.log('Uid ' + uid + ' successfully unliked with ' + pid);
      var response = {
        status: 'SUCCESSFUL',
        snapshot: snapshot
      };
      callback(response);
    }
  });
}

function linkPidToUid(uid, pid, callback) {
  firebase.database().ref('/uidToPid/' + uid).transaction(function(data) {
    if (!data || !data.pidList) {
      var pidList = [pid];
      return {
        uid: uid,
        pidList: pidList
      };
    } else {
      if (data.pidList.indexOf(pid) == -1) {
        data.pidList.push(pid);
        return data;
      } else {
        return;
      }
    }
  }, function(error, committed, snapshot) {
    if (error) {
      console.log('Transaction failed abnormally!', error);
      callback(error);
    } else if (!committed) {
      console.log('PID already exists.');
      var res = {
        status: 'PID_ALREADY_EXISTS'
      };
      callback(res);
    } else {
      console.log('Uid ' + uid + ' successfully linked with ' + pid);
      var response = {
        status: 'SUCCESSFUL',
        snapshot: snapshot
      };
      callback(response);
    }
  });
}

exports.parseTags = function(tagString) {
  return helperParseTags(tagString);
};

function helperParseTags(tagString) {
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
  var tempTags = tagString.toLowerCase();
  // deals with instances of multiple consecutive hashtags
  if (/#{2,}/g.test(tempTags)) {
    tempTags = tempTags.replace(/#{2,}/g, '#');
  }
  // deals with string that ends with 1 or more #s
  if (/#+$/g.test(tempTags)) {
    tempTags = tempTags.replace(/#+$/g, '');
  }

  if (tempTags === '') {
    return null;
  }

  return tempTags;
}
