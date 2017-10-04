var firebase = require('firebase');

exports.sendMessage = function(uidFrom, uidTutor, uidTutee, content, callback) {
  firebase.database().ref('messages/' + uidTutor + '-' + uidTutee).transaction(function(currentMsg) {
    if (currentMsg === null) {
      var newDate = new Date();
      // console.log(newDate);
      dateString = newDate.toString();
      var message = {
        tutor: uidTutor,
        tutee: uidTutee,
        messages: [{sentBy: uidFrom, content: content, date: dateString}]
      };
      return message;
    } else {
      currentMsg.messages.push({sentBy: uidFrom, content: content, date: dateString});
      return currentMsg;
    }
  }, function(error, committed, snapshot) {
    if (error) {
      // console.log('Transaction failed abnormally!', error);
      callback(error);
    } else {
      // console.log('Message Sent');
      // console.log(snapshot.val());
      callback(snapshot.val().messages[snapshot.val().messages.length-1]);
    }
  });
};

exports.getMessages = function(uidTutor, uidTutee) {
  return firebase.database().ref('messages/' +uidTutor + '-' + uidTutee).once('value').then(function(snapshot) {
    return snapshot.val().messages;
  });
};