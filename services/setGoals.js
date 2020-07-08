//constants
import { status } from './universalConstants';
//firebase
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
// import { matchGoals } from './matchGoals';
var userId, user;
const db = firestore();
const usersCollection = db.collection('Users');

var goalId = '',
    otherGoal = '',
    otherUser = '';
var waitingRoom;

//refreshes the constants so they're available when methods are called
function refreshConsts() {
    if (auth().currentUser) {
        userId = auth().currentUser.uid;
        user = usersCollection.doc(userId);
    }
}

//creates a goal and adds it to the user's goal collection
export const addGoalToUserGoalCollection = (
    goalTitle,
    goalDescription,
    goalMilestones,
    goalCategory,
) => {
    //create a document with auto generated ID and add title, description and milestones.
    setCategory(goalCategory);
    refreshConsts();
    user
        .collection('goals')
        .add({
            goalTitle: goalTitle,
            goalDescription: goalDescription,
            goalMilestones: goalMilestones,
            userId: userId,
            status: status.matching,
            category: goalCategory,
        })
        .then(docRef => {
            //add the goal id to current user
            user
                .collection('goals')
                .doc(docRef.id)
                .update({ goalId: docRef.id });

            //match the goals
            matchGoals(docRef.id, goalCategory);
        });
};

//sets the category for the goal
const setCategory = (category) => {
    waitingRoom = db
        .collection('WaitingRooms')
        .doc(category)
        .collection('goals');
}

//matches the goals of two different users in the same waitingRoom
const matchGoals = (id) => {
    goalId = id;

    //add goal to waiting room
    addGoalToWaitingRoom();
    //match goals when goals from 2 different users are in a waiting room
    matchUsersUpdateCollection();
};

//adds goal to the waiting room
function addGoalToWaitingRoom() {
    waitingRoom
        .doc(goalId)
        .set({
            goalId: goalId,
            userId: userId,
            accountaBuddyId: '',
            matchedGoalId: '',
        });
};

//matches users and updates the database with the match data
async function matchUsersUpdateCollection() {
    //find match
    let match = await matchUsers('<');
    if (match.length == 0)
        match = await matchUsers('>');

    //if match found
    if (match.length > 0) {
        otherGoal = match[0].goalId;
        otherUser = match[0].userId;

        //update collection
        await db.collection('ChatRooms').add({
            exists: true, //todo
        }).then(documentRef => {
            updateCollection(documentRef.id);
        });
    }
}

//finds another user to match to this goal
async function matchUsers(compare) {
    var match = [];
    await waitingRoom
        .where('userId', compare, userId)
        .limit(1)
        .get()
        .then(snap => {
            snap.forEach(doc => {
                let docData = doc.data()
                let dataObject = {
                    goalId: docData.goalId,
                    userId: docData.userId,
                };
                match.push(dataObject)
            })
        })
    return match;
}

//updates the fields of both goals
async function updateCollection(chatId) {
    //updating this user's goal
    await user
        .collection('goals')
        .doc(goalId)
        .update({
            accountaBuddyId: otherUser,
            matchedGoalId: otherGoal,
            chatRoomId: chatId,
            status: status.inProgress, //TODO: once stage 2 implemented, change to status.planning
        });

    //updating matched user's goal
    await usersCollection
        .doc(otherUser)
        .collection('goals')
        .doc(otherGoal)
        .update({
            accountaBuddyId: userId,
            matchedGoalId: goalId,
            chatRoomId: chatId,
            status: status.inProgress,//TODO: once stage 2 implemented, change to status.planning
        })

    //remove goals from waiting room
    removeGoals(goalId);
    removeGoals(otherGoal);

    //see if this deletes extra chatrooms, it does
    await db.collection('ChatRooms')
        .doc(chatId)
        .delete();
}

//removes specified goal from the waiting room
function removeGoals(goal) {
    waitingRoom
        .doc(goal)
        .delete()
}

//updates the status of the provided goal to the provided status
export function updateStatus(goalID, status) {
    user
        .collection('goals')
        .doc(goalID)
        .update({
            status: status
        });
}