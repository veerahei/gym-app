import { TextInput, Button, Text, Snackbar } from "react-native-paper"
import { Alert, View, StyleSheet, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform } from "react-native"
import { getDatabase, push, ref, } from "firebase/database";
import { app } from '../firebaseConfig';
import { act, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { getAuth } from "firebase/auth";

import DateTimePicker from '@react-native-community/datetimepicker';



export default function AddActivityScreen() {

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
    const auth = getAuth(app);

    console.log("Uuden aktiviteetin lisäyssivu renderöityy");
    console.log(activity)

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
        console.log("Uuden aktiviteetin tallennusfunktiossa");

        //Muuta kesto string numeroksi
        let minutes = Number(activity.duration)
        console.log(minutes)

        //Tallenna muuttujaan, jotta voidaan tehdä validointi. Trim poistaa tyhjät merkit alusta ja lopusta
        let name = activity.activityName.trim()
        console.log(name)

        if (!name) {
            Alert.alert("Please enter a name for the activity")
        } else if (minutes == null || minutes == "" || minutes == 0 || isNaN(minutes)) {
            Alert.alert("Insert correct duration (minutes)")

        }
        else {
            //Tehdään erikseen tallennettava muuttuja, joka tallennetaan firebaseen. Ei koiteta tässä välissä päivittää state-muuttujaa, koska ei välttämättä päivity heti.
            const activityToSave = { ...activity, activityName: name, duration: minutes }

            const currentUser = auth.currentUser;
            if (currentUser) {
                push(ref(db, `users/${currentUser.uid}/activities`), activityToSave);

            }

            navigation.popTo('HomeScreen', { added: true });
        }


    }


    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    <View style={{ marginBottom: 50 }}>
                        <Text variant="headlineMedium">Add your next activity</Text>
                    </View>
                    <View style={styles.form}>
                        <TextInput
                            label="Activity"
                            value={activity.activityName}
                            onChangeText={input => setActivity({ ...activity, activityName: input })}
                        />

                        {showPicker ? (
                            <View>
                                <Text>Date</Text>
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
                        ) : (
                            <TextInput
                                label="Date"
                                value={activity.activityDate}
                                onChangeText={input => setActivity({ ...activity, date: input })}
                                editable={false}
                                onPressIn={toggleDatePicker}
                            />
                        )}

                        <TextInput
                            label="Time spent (minutes)"
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
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
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

}); 