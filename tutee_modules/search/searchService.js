var postService = require('../post/postService.js');
var tagService = require('../tag/tagService.js');

exports.searchPosts = function(searchTags) {
    var parsedTags = exports.parseSearchTags(searchTags);
    var postList;
    return tagService.getPidList(parsedTags, function(pids) {
        // console.log(pids);
        return postService.getPostList(pids).then(function(list) {
            postList = list;
            // console.log(postList);
            return postList;
        });
    });
};

exports.parseSearchTags = function(searchString) {
    // checks for null or undefined tags
    if (searchString === null || searchString === undefined) {
        return null;
    }
    // deals with any speical characters and also checks if user used #s
    if (/[^a-zA-Z0-9\s#]/g.test(searchString)) {
        return null;
    }
    // gets rid of whitespaces and replace with #
    searchString = searchString.replace(/\s/g, '#');
    // makes everything lowercase for consistency and deals with starting # so that first element of array isn't empty
    searchString = searchString.toLowerCase();
    var tempTags = '#' + searchString;
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
};
