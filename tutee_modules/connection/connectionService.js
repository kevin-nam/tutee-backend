var firebase = require('firebase');
exports.CONNECTION_REFERENCE = 'connection/';

exports.createNewConnection = function(uid1, uid2, callback) {
  if (uid1 && uid2 && uid1 != uid2) {
    addConnectionToFirebase(uid1, uid2, callback);
  } else {
    console.log('Error occurred when adding connection.');
  }
};

exports.getConnectionsFromUid = function(uid, callback) {
  if (uid) {
    firebase.database().ref(this.CONNECTION_REFERENCE)
      .orderByKey()
      .equalTo(uid)
      .once('value')
      .then(function(snapshot) {
        callback(snapshot.child(uid).val());
      });
  }
};

exports.deleteConnection = function(uid1, uid2, callback) {
  if (uid1 && uid2 && uid1 != uid2) {
    removeConnectionFromFirebase(uid1, uid2, callback);
  } else {
    console.log('Error occurred when adding connection.');
    callback({
      status: 'ERROR'
    });
  }
};

function removeConnectionFromFirebase(uid1, uid2, callback) {
  firebase.database().ref(exports.CONNECTION_REFERENCE + uid1).transaction(function(data) {
    if (!data || !data.connections) {
      return data;
    } else {
      var index = data.connections.indexOf(uid2);
      console.log(index);
      if (index != -1) {
        data.connections.splice(index, 1);
        return data;
      } else {
        return;
      }
    }
  }, function(error, committed, snapshot1) {
    if (error) {
      console.log('Transaction failed abnormally!', error);
      callback({status: 'FATAL_ERROR'});
    } else if (!committed) {
      console.log('No such connection exist');
      var res = {
        status: 'CONNECTION_DOES_NOT_EXIST'
      };
      callback(res);
    } else {
      firebase.database().ref(exports.CONNECTION_REFERENCE + uid2).transaction(function(data) {
        if (!data || !data.connections) {
          return data;
        } else {
          var index = data.connections.indexOf(uid1);
          if (index != -1) {
            data.connections.splice(index, 1);
            return data;
          } else {
            return;
          }
        }
      }, function(error, committed, snapshot2) {
        if (error) {
          console.log('Transaction failed abnormally!', error);
          callback({status: 'FATAL_ERROR'});
        } else {
          console.log('Connection successfully removed between ' + uid1 + ' and ' + uid2);
          var response = {
            status: 'SUCCESSFUL',
            uid1: snapshot1,
            uid2: snapshot2
          };
          callback(response);
        }
      });
    }
  });
}

function addConnectionToFirebase(uid1, uid2, callback) {
  firebase.database().ref(exports.CONNECTION_REFERENCE + uid1).transaction(function(data) {
    if (!data || !data.connections) {
      var connections = [uid2];
      return {
        uid: uid1,
        connections: connections
      };
    } else {
      if (data.connections.indexOf(uid2) == -1) {
        data.connections.push(uid2);
        return data;
      } else {
        return;
      }
    }
  }, function(error, committed, snapshot1) {
    if (error) {
      console.log('Transaction failed abnormally!', error);
      callback(error);
    } else if (!committed) {
      console.log('Connection already exists.');
      var res = {
        status: 'CONNECTION_ALREADY_EXISTS'
      };
      callback(res);
    } else {
      firebase.database().ref(exports.CONNECTION_REFERENCE + uid2).transaction(function(data) {
        if (!data || !data.connections) {
          var connections = [uid1];
          return {
            uid: uid2,
            connections: connections
          };
        } else {
          console.log('******');
          console.log(data);
          console.log(uid1);
          console.log('******');
          if (data.connections.indexOf(uid1) == -1) {
            data.connections.push(uid1);
            return data;
          } else {
            return;
          }
        }
      }, function(error, committed, snapshot2) {
        if (error) {
          console.log('Transaction failed abnormally!', error);
          callback(error);
        } else {
          console.log('Connection successfully added between ' + uid1 + ' and ' + uid2);
          var response = {
            status: 'SUCCESSFUL',
            uid1: snapshot1,
            uid2: snapshot2
          };
          callback(response);
        }
      });
    }
  });
}
