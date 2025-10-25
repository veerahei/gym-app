import { TextInput, Button } from "react-native-paper"
import { View } from "react-native"
import { getDatabase, push, ref, } from "firebase/database";
import { app } from './firebaseConfig';
import { useState } from "react";

export default function Test() {
    const [workoutPlan, setWorkoutPlan] = useState({
        planName: "",
        exercises: []
    });

    const [exercise, setExercise] = useState({
        name: '',
        sets: '',
        reps: ''
    });

    const db = getDatabase(app);


    //Add one exercise to a workoutplan
    function addExercise() {
        setWorkoutPlan({ ...workoutPlan, exercises: [...workoutPlan.exercises, exercise] });

        setExercise({
            name: '',
            sets: '',
            reps: ''
        })
    }

    console.log(workoutPlan)

    //Save (write) workout plan to database
    function addWorkoutPlan() {
        console.log("in the function");
        push(ref(db, 'plans/'), workoutPlan);
    }

    return (
        <View>
            <TextInput
                label="Name of the workout plan"
                value={workoutPlan.planName}
                onChangeText={input => setWorkoutPlan({ ...workoutPlan, planName: input })}
            />
            <TextInput
                label="Exercise name"
                value={exercise.name}
                onChangeText={input => setExercise({ ...exercise, name: input })}
            />
            <TextInput
                label="Sets"
                value={exercise.sets}
                onChangeText={input => setExercise({ ...exercise, sets: input })}
            />
            <TextInput
                label="Reps"
                value={exercise.reps}
                onChangeText={input => setExercise({ ...exercise, reps: input })}
            />
            <Button
                onPress={addExercise}
            >Add exercise to workout plan
            </Button>
            <Button
                onPress={addWorkoutPlan}
            >
                Add new workout plan
            </Button>
        </View>
    )
}
