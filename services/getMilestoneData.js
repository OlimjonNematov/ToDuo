import firestore from '@react-native-firebase/firestore';

var db = firestore().collection('Users');

//retrieve data on user's goals
export async function getGoalData(uid) {
  let goalData = [];
  await db
    .doc(uid)
    .collection('goals')
    .get()
    .then(snap => {
      snap.forEach(currentGoal => {
        let docData = currentGoal.data();
        let dataObject = {
          title: docData.goalTitle,
          description: docData.goalDescription,
          accountabuddyId: docData.accountaBuddyId,
          matchedGoalId: docData.matchedGoalId,
          goalId: docData.goalId,
          chatRoomId: docData.chatRoomId,
        };
        //add the info to goal datas
        goalData.push(dataObject);
      });
    });
  return goalData;
}
export async function getMilestonesAsObjects(uid, goalId) {
  let milestoneList = [];
  await db
    .doc(uid)
    .collection('goals')
    .doc(goalId)
    .collection('milestones')
    .get()
    .then(snap => {
      snap.forEach(currentMilestone => {
        let docData = currentMilestone.data();
        let dataObject = {
          milestoneText: docData.milestoneText,
          milestoneStatus: docData.milestoneStatus,
          milestoneDeadlineValue: docData.milestoneDeadlineValue,
          milestoneMonth: docData.milestoneMonth,
          milestoneDay: docData.milestoneDay,
          milestoneFullYear: docData.milestoneFullYear,
          completed: docData.completed,
          requestMark: docData.requestMark,
        };
        milestoneList.push(dataObject);
      });
    });
  return milestoneList;
}

export async function markMilestoneAsComplete(uid, goalId, milestone) {
  await db
    .doc(uid)
    .collection('goals')
    .doc(goalId)
    .collection('milestones')
    .doc(milestone)
    .update({
      requestMark: false,
      completed: true,
    });
}
export async function requestMilestoneCompletion(uid, goalId, milestone) {
  await db
    .doc(uid)
    .collection('goals')
    .doc(goalId)
    .collection('milestones')
    .doc(milestone)
    .update({
      requestMark: true,
      completed: false,
    });
}
