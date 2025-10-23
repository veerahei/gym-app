import { Text, TextInput, Button } from "react-native-paper"
import { View } from "react-native"
import { getDatabase, push, ref, } from "firebase/database";
import { app } from './firebaseConfig';
import { useState } from "react";

export default function Test() {
    const [workoutPlan, setWorkoutPlan] = useState("");

    const db = getDatabase(app);

    function addWorkoutPlan() {
        console.log("in the function")
        push(ref(db, 'plans/'), workoutPlan)
    }


    return (
        <View>
            <TextInput
                label="Name of the workout plan"
                value={workoutPlan}
                onChangeText={input => setWorkoutPlan(input)}
            />
            <Button
                onPress={addWorkoutPlan}
            >
                Add new workout plan
            </Button>
        </View>
    )
}
