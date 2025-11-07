import { View, FlatList, StyleSheet } from "react-native"
import { Button, Text, Card } from "react-native-paper";
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


            <Button
                onPress={() => navigation.navigate('Test')}
            >
                Add new activity
            </Button>

            <FlatList
                style={styles.list}
                data={activities}
                renderItem={({ item }) =>
                    <Card style={styles.card}>
                        <Card.Title title={item.activityName} />
                        <Button onPress={() => handleDelete(item.id)}>Delete</Button>
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
        justifyContent: 'center',
    },
    list: {
        width: '90%',
    },
    card: {
        marginBottom: 10,

    }
});