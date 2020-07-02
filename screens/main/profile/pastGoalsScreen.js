import React, { useState } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    FlatList,
} from 'react-native';
import { getArchivedGoals, getCompletedGoals } from '../../../services/getGoals';
//styles
import { appStyles, devFlatListStyles } from '../../../assets/styles/styles';
const styles = appStyles;

//displays the past goals of the user
function PastGoalsScreen({ navigation }) {
    const [goals, setGoals] = useState();

    //sets goals to the completed goals
    async function setCompleted() {
        setGoals(await getCompletedGoals());
    }

    //sets goals to the archived goals
    async function setArchived() {
        setGoals(await getArchivedGoals());
    }

    function ListItem({ item }) {
        return (
            <View style={devFlatListStyles.ListItem}>
                <Text style={devFlatListStyles.ListItemText}>{item.title}</Text>
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.main}>
                {/* back button */}
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text>
                        GO BACK
                    </Text>
                </TouchableOpacity>

                {/* toggle completed */}
                <TouchableOpacity onPress={() => setCompleted()}>
                    <Text>
                        completed
                    </Text>
                </TouchableOpacity>

                {/* toggle archived */}
                <TouchableOpacity onPress={() => setArchived()}>
                    <Text>
                        archived
                    </Text>
                </TouchableOpacity>

                {/* display list of past goals */}
                <FlatList
                    data={goals}
                    renderItem={({ item }) => <ListItem item={item} />}
                    keyExtractor={item => item.goalId} />
            </View>
        </SafeAreaView>
    )
}

export default PastGoalsScreen;