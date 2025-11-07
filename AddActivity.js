import { TextInput, Button } from "react-native-paper"
import { Alert, View } from "react-native"
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
        navigation.replace("Home");

    }



    return (
        <View>
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
                label="Description/notes"
                value={activity.description}
                onChangeText={input => setActivity({ ...activity, description: input })}
            />

            <Button
                onPress={addActivity}
            >
                Add activity
            </Button>
        </View>
    )
}
