import { TextInput, Button, Text } from "react-native-paper"
import { Alert, View, StyleSheet } from "react-native"
import { getDatabase, push, ref, } from "firebase/database";
import { app } from './firebaseConfig';
import { act, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { getAuth } from "firebase/auth";

import DateTimePicker from '@react-native-community/datetimepicker';



export default function AddActivity() {

    const [activity, setActivity] = useState({
        activityName: "",
        activityDate: "",
        duration: "",
        description: ""
    });

    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);

    const db = getDatabase(app);
    const navigation = useNavigation();
    const auth = getAuth(app)

    const user = auth.currentUser;

    console.log(activity);
    const toggleDatePicker = () => {
        setShowPicker(!showPicker);

    }

    const onChange = ({ type }, selectedDate) => {
        if (type == "set") {
            const currentDate = selectedDate;
            setDate(currentDate);
        } else {
            toggleDatePicker();
        }
    }

    const confirmDate = () => {
        setActivity({ ...activity, activityDate: date.toDateString() })
        toggleDatePicker();
    }

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

                {showPicker && (
                    <View>
                        <DateTimePicker
                            mode="date"
                            display="spinner"
                            value={date}
                            onChange={onChange}
                            style={styles.datePicker}
                        />
                        <View style={{ flexDirection: "row", justifyContent: "center", gap: 45 }}>
                            <Button onPress={toggleDatePicker}>Cancel</Button>
                            <Button onPress={confirmDate}>Confirm</Button>
                        </View>
                    </View>
                )}

                <View style={{ flexDirection: "row", justifyContent: "space-around" }}>

                </View>
                <TextInput
                    label="Date"
                    value={activity.activityDate}
                    onChangeText={input => setActivity({ ...activity, date: input })}
                    editable={false}
                    onPressIn={toggleDatePicker}
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
    },
    datePicker: {
        height: 120,
        marginTop: -10,
    }
}); 