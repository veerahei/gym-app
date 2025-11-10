import { View, FlatList, StyleSheet } from "react-native"
import { Button, Text, Card, IconButton, MD3Colors } from "react-native-paper";
import { useEffect, useState } from "react";
import { getDatabase, onValue, ref, remove } from "firebase/database";
import { app } from './firebaseConfig';

import { useNavigation } from "@react-navigation/native";
import { getAuth, signOut } from "firebase/auth";


export default function HomeScreen() {
    const [activities, setActivities] = useState([]); //User's saved activities
    const db = getDatabase(app);
    const auth = getAuth(app)

    const navigation = useNavigation();
    const currentUser = auth.currentUser; // Get current user

    useEffect(() => {

        if (currentUser) {  //If user is signed in, show user's own activities
            const activitiesRef = ref(db, `users/${currentUser.uid}/activities/`);
            onValue(activitiesRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    setActivities(Object.entries(data).map(([key, value]) => ({ ...value, id: key }))); //Tässä kohti haetaan tietokannasta käyttäjän lisäämät aktiviteetit. Niitä luotaessa on luotu aktiviteetti id. Aktiviteetin id pitää saada mukaan tässä, jotta niitä voidaan käsitellä (esim. poistaa) tässä screenissä.
                } else {
                    setActivities([]);
                }
            })
        }
    }, []);

    console.log(activities);

    const handleSignOut = () => {
        signOut(auth)
            .then(() => (navigation.replace("Login")))
            .catch(error => console.log(error.message))
    }

    const handleDelete = (id) => {
        console.log("in delete")
        remove(ref(db, `users/${currentUser.uid}/activities/${id}`))
    }

    //Show user's activities in a list
    return (
        <View style={styles.container}>

            <Button
                onPress={handleSignOut}
            >Sign out
            </Button>

            <View style={styles.actions}>
                <Button
                    onPress={() => navigation.navigate('AddActivity')}
                    mode="contained"
                    icon="plus-circle"
                >
                    Add new activity
                </Button>
            </View>


            <Text>Your latest activities</Text>

            <FlatList
                style={styles.list}
                data={activities}
                renderItem={({ item }) =>
                    <Card style={styles.card}>

                        <Card.Title title={item.activityName} subtitle={`${item.activityDate} Duration: ${item.duration}`} />
                        <Card.Actions>
                            <IconButton icon="trash-can-outline" mode="contained" onPress={() => handleDelete(item.id)}></IconButton>
                        </Card.Actions>

                    </Card>
                }
            ></FlatList>

        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
  
    },
    actions: {
        marginBottom: 40,
    },
    list: {
        width: '100%',
        paddingHorizontal: '5%'
    },
    card: {
        marginBottom: 10,
    },
});