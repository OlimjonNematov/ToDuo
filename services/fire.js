/*
  Various database methods
 */

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
const db = firestore();
//todo this may need some help? is checked when not logged in which leads to error
// var goalId = '',
//   userId = auth().currentUser.uid;

// returns data for specified document in collection, used for one time reads
const readFromDatabase = (collectionName, docName) => {
  let data = db.collection(collectionName.toString()).doc(docName.toString())
    .get;
  return data;
};

// testing method to list out database through a snapshot
export const listOutDatabase = () => {
  console.log('listOut Database');
  db.collection('Users')
    .get()
    .then(querySnapshot => {
      console.log('Total users: ', querySnapshot.size);

      querySnapshot.forEach(documentSnapshot => {
        console.log('User ID: ', documentSnapshot.id, documentSnapshot.data());
      });
    });
};

//creatres a document with id == uid and adds all the appropriate fields to it
export const addUser = (uid, firstName, lastName, newAge, email) => {
  db.collection('Users')
    .doc(uid)
    .set({
      firstName: firstName,
      lastName: lastName,
      age: newAge,
      email: email,
    })
    .then(ref => {
      console.log(ref);
    });
};

export const matchUser = id => {
  goalId = id;
  // MVP just matches in a queue to avoid synch, def gonna change
  /* var user = auth().currentUser;
    -if ++docs(goals) in collections(room) >= 2
      else wait
    -get 2 goal ids
    -take both goals off waiting room
  */
  addGoalToWaitingRoom();

  //only proceed if current goal is goal [0]
  //todo implement better syn
  //let goaltoGetInfo = goalId == goals[0]? goals[1]: goals[0];
  matchTheUsersAndUpdateCollection();
};

//adds goal to the waiting room
const addGoalToWaitingRoom = () => {
  db.collection('waitingRoom')
    .doc(goalId)
    .set({
      goalId: goalId,
      userId: userId,
      accountaBuddyId: '',
      matchedGoalId: '',
    });
};

//check if there is another goal to match
const matchTheUsersAndUpdateCollection = () => {
  //this goes to onResult upon continuously checking any collection change, onError on error TODO comment edtiqeutte
  db.collection('waitingRoom').onSnapshot(onResult, onError);
};

// to be ran on successful snapshot
function onResult(QuerySnapshot) {
  // todo we need to leave/close/unsubscribe from onSnapshot?
  // still listening, cannot wake up during a wakeup??
  var x = 0,
    y = 0;
  let goals = [];
  let users = [];
  QuerySnapshot.forEach(doc => {
    goals[x++] = doc.id;
    users[y++] = doc.data().userId; //might cause an error if so, change to .data.userId
  });
  if (x > 1) {
    //if the number of goals are equal to 2, then update their matched Goal id, accountabuddy id and take them off the waiting room
    //update the original goal fields
    updateMatchFields(goals, users);
  }
}

// to be ran on failed snapshot
function onError(error) {
  console.error(error);
}

// delete the goal doc from the collection
const deleteGoalFromDocument = goalId1 => {
  db.collection('waitingRoom')
    .doc(goalId1)
    .delete();
};

// updates both
const updateMatchFields = (goals, users) => {
  if (goalId == goals[0]) {
    console.log('**********users: ' + users);
    console.log('**********goals:' + goals);
    db.collection('waitingRoom')
      .get()
      .then(querySnapshot => {
        let i = 0;
        querySnapshot.forEach(currentGoalDoc => {
          db.collection('Users')
            .doc(users[i])
            .collection('goals')
            .doc(goals[i])
            .update({
              accountaBuddyId: users[!i + 0],
              matchedGoalId: goals[!i + 0],
            });
          i++;
        });
        //removes both documents from waiting room
        deleteGoalFromDocument(goals[0]);
        deleteGoalFromDocument(goals[1]);
      })
      .catch(err => {
        console.log('Error getting snapshot', err);
      });
  }
};
