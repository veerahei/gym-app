import { TextInput, Button, Text } from "react-native-paper"
import { Alert, View, StyleSheet } from "react-native"
import { getDatabase, push, ref, } from "firebase/database";
import { app } from './firebaseConfig';
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { getAuth } from "firebase/auth";



export default function AddActivity() {

    const [activity, setActivity] = useState({
        activityName: "",
        date: "",
        duration: "",
        description: ""
    });

    const db = getDatabase(app);
    const navigation = useNavigation();
    const auth = getAuth(app)

    const user = auth.currentUser;
    console.log(user.uid)

    //Save (write) workout plan to database and go back to home screen
    function addActivity() {
        console.log("in the function");

        const currentUser = auth.currentUser;
        if (currentUser) {
            push(ref(db, `users/${currentUser.uid}/activities`), activity);
        }


        Alert.alert("New activity added")
        navigation.popToTop();

    }



    return (
        <View style={styles.container}>

            <Text>Add your next activity</Text>

            <View style={styles.form}>
                <TextInput
                    label="Activity"
                    value={activity.activityName}
                    onChangeText={input => setActivity({ ...activity, activityName: input })}
                />
                <TextInput
                    label="Date"
                    value={activity.date}
                    onChangeText={input => setActivity({ ...activity, date: input })}
                />
                <TextInput
                    label="Time spent"
                    value={activity.duration}
                    onChangeText={input => setActivity({ ...activity, duration: input })}
                />
                <TextInput
                    label="Notes"
                    value={activity.description}
                    onChangeText={input => setActivity({ ...activity, description: input })}
                />
            </View>
            <Button
                onPress={addActivity}
                mode="contained"
                icon="check-circle"
            >
                Save activity
            </Button>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    form: {
        width: "90%",
        gap: 10,
        marginBottom: 30
    }
}); 