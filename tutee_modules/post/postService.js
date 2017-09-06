var firebase = require('firebase');
var tagService = require('../tag/tagService.js');

exports.createPost = function(title, description, tagString, type, uid) {
    if (title !== null && description !== null && tagString !== null)
    {
        var newPost = firebase.database().ref('Posts/').push();
        var pid = newPost.key;
        var newDate = new Date();

            // A post entry.
            var postData = {
                uid: uid,
                title: title,
                description: description,
                tagString: helperParseTags(tagString),
                date: newDate,
                type: type
            };
            //console.log(postData);
            if (postData.tagString) {
                var updates = {};
                updates['/posts/' + pid] = postData;
                firebase.database().ref().update(updates);
                tagService.updateTags(postData.tagString, pid);
                return pid;
            }
        return null;
    }
    return null;
}

exports.updatePost = function(pid, uid, newTitle, newDesc, newTagString, newType) {
    if (newTitle !== null && newDesc !== null && newTagString !== null) {
        var updates = {};

        var newData = {
            uid: uid,
            title: newTitle,
            description: newDesc,
            tagString: helperParseTags(newTagString),
            type: newType,
            date: new Date()
        };

        if (newData.tagString) {
            firebase.database().ref('/posts/'+ pid).once('value').then(function (snapshot) {
                if (snapshot.val()) {
                    tagService.removePid(snapshot.val().tagString, pid);
                    tagService.updateTags(newData.tagString, pid);
                }
            });


            updates['/posts/' + pid] = newData;
            firebase.database().ref().update(updates);
        }
        return null;
    }
    return null;
}

exports.getPost = function(pid) {
    return firebase.database().ref('posts/' + pid).once('value').then(function (snapshot) {
        console.log(snapshot.val());
        console.log(snapshot.val().date);
        if (snapshot.val()) {
            var data = {
                title: snapshot.val().title,
                description: snapshot.val().description,
                tagString: snapshot.val().tagString,
                type: snapshot.val().type,
                date: snapshot.val().date
            };
            console.log(data);
            return data;
        }
        return null;
    });
}

exports.getPostList = function(pidList) {
    var postObj;
    var finalList = [];
    var map = new Map([[Object, 'post']]);
    var pidListLength = pidList.length;
    pidList.sort();

    return firebase.database().ref('posts/').orderByKey().startAt(pidList[0]).endAt(pidList[pidListLength-1]).once('value').then(function (snapshot) {
        postObj = snapshot.val();
        //console.log(snapshot.child("posts/" +pidList[0]).key);

        Object.keys(postObj).forEach(function(key) {
            map.set(key, postObj[key]);
        });
        pidList.forEach(function(pid) {
            var mapPost = map.get(pid);
            if(mapPost) {
                finalList.push(mapPost);
            }
        });
        console.log(finalList);
        return finalList;
    });
}

exports.deletePost = function(pid) {
    var ref = firebase.database().ref('posts/' + pid);
    ref.once('value').then(function (snapshot) {
        if (snapshot.val()) {
            if (pid) {
                tagService.removePid(snapshot.val().tagString, pid);
                ref.remove();
            }
        }
    });
}

exports.parseTags = function(tagString) {
   return helperParseTags(tagString);
}

function helperParseTags(tagString) {
    var tags;
    //checks for null or undefined tags
    if (tagString === null || tagString === undefined) {
        return null;
    }
    //gets rid of whitespaces
    tagString = tagString.replace(/\s/g, "");
    //deals with any speical characters and also checks if user used #s
    if (/[^a-zA-Z0-9\s#]/g.test(tagString) || /^#/g.test(tagString) === false) {
        return null;
    }
    //makes everything lowercase for consistency and deals with starting # so that first element of array isn't empty
    var tempTags = tagString.toLowerCase();
    //deals with instances of multiple consecutive hashtags
    if (/#{2,}/g.test(tempTags)) {
        tempTags = tempTags.replace(/#{2,}/g, "#");
    }
    //deals with string that ends with 1 or more #s
    if (/#+$/g.test(tempTags)) {
        tempTags = tempTags.replace(/#+$/g,"");
    }

    if (tempTags === '') {
        return null;
    }

    return tempTags;
}
