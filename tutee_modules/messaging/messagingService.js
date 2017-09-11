var firebase = require('firebase');

exports.sendMessage = function(uidFrom, uidTutor, uidTutee, content) {
    firebase.database().ref('messages/' + uidTutor + '-' + uidTutee).transaction(function(currentMsg) {
        if (currentMsg === null) {
            var newDate = new Date();
            console.log(newDate);
            var message = {
              tutor: uidTutor,
              tutee: uidTutee,
              messages: [{sentBy: uidFrom, content: content, date: newDate}]
            };
            return message;
        } else {
            currentMsg.messages.push({sentBy: uidFrom, content: content, date: newDate});
            return currentMsg;
        }
    }, function(error, committed, snapshot) {
        if (error) {
            console.log('Transaction failed abnormally!', error);
        } else {
            console.log('Message Sent');
            console.log(snapshot.val());
            return snapshot.val();
        }
        console.log('The message looks like this: ', snapshot.val());
    });
};

exports.getMessages = function(uidTutor, uidTutee) {
    return firebase.database().ref('messages/' +uidTutor + '-' + uidTutee).once('value').then(function(snapshot) {
        return snapshot.val().messages;
    });
};
