import { View, FlatList, StyleSheet } from "react-native"
import { Button, Text, Card, IconButton, Portal, Dialog, Snackbar, } from "react-native-paper";
import { useEffect, useState } from "react";
import { getDatabase, onValue, ref, remove, off, } from "firebase/database";
import { app } from './firebaseConfig';

import { useNavigation, useRoute } from "@react-navigation/native";
import { getAuth, signOut } from "firebase/auth";


export default function HomeScreen({ route }) {
    const [activities, setActivities] = useState([]); //User's saved activities
    const [dialogVisible, setDialogVisible] = useState(false);
    const [idToDelete, setIdToDelete] = useState("");

    const [snackbarVisible, setSnackbarVisible] = useState(false);

    const hideDialog = () => setDialogVisible(false);

    const db = getDatabase(app);
    const auth = getAuth(app)

    const navigation = useNavigation();
    const currentUser = auth.currentUser; // Get current user

    console.log("Etusivu renderöity")
    console.log("Kirjautunut käyttäjä: ", currentUser.uid)


    //Näytä snackbar uuden aktiviteetin lisäyksen jälkeen
    useEffect(() => {
        if (route.params?.added) {
            setSnackbarVisible(true);
            navigation.setParams({ added: false })
        }
    }, [route.params?.added])

    //MIlloin useeffect suoritetaan: Kun sivu avataan ensimmäisen kerran. Kun data refissä muuttuu (tulee lisää tai poistetaan). Kun currentuser arvo muuttuu.
    //Currentuser haussa voi kestää hetki. Jos user on null, palataan, lopetetaan useEffect ja jatketaan currentuserin hakua. Use effect suoritetaan kun currentuser tila muuttuu, eli saadaan käyttäjän tiedot
    useEffect(() => {

        console.log("HOMESCREENIN USEEFFECTISSÄ")
        if (!currentUser) {
            console.log("Current user ei löytynyt")
            return
        }

        if (currentUser) {  //If user is signed in, show user's own activities
            console.log("Current user löytyi")
            const activitiesRef = (ref(db, `users/${currentUser.uid}/activities/`));
            onValue(activitiesRef, (snapshot) => {
                console.log("On value listener asetettu aktiviteetteihin/datan arvo muuttunut?")
                const data = snapshot.val();

                if (data) {
                    //Tässä kohti haetaan tietokannasta käyttäjän lisäämät aktiviteetit. Niitä luotaessa on luotu aktiviteetti id. Aktiviteetin id pitää saada mukaan tässä, jotta niitä voidaan käsitellä (esim. poistaa) tässä screenissä.
                    const items = Object.entries(data).map(([key, value]) => ({ ...value, id: key }));
                    items.sort((a, b) => new Date(b.activityDate) - new Date(a.activityDate))

                    console.log(items)
                    setActivities(items)
                } else {
                    setActivities([]);
                }
            })
        }
    }, []);

    useEffect(() => {
        // Use `setOptions` to update the button that we previously specified
        navigation.setOptions({
            headerRight: () => (
                <Button onPress={() => handleSignOut()}>Log out</Button>
            ),
        });
    }, [navigation]);

    console.log("Etusivun aktiviteetit:", activities);

    const handleSignOut = () => {
        //Poista kuuntelijat, kun käyttäjä kirjautuu ulos. Muuten tulee päällekkäisiä kuuntelijoita, jos käyttäjä kirjautuu ulos ja takaisin sovellukseen.
        off(ref(db, `users/${currentUser.uid}/activities/`))
        signOut(auth)
            .then(() => (navigation.replace("Login")))
            .catch(error => console.log(error.message))
    }

    const handleDelete = (id) => {
        console.log("in delete")

        remove(ref(db, `users/${currentUser.uid}/activities/${id}`))
        setDialogVisible(false)
    }

    //Show user's activities in a list
    return (
        <View style={styles.container}>
            <View style={styles.actions}>
                <Text variant="headlineMedium">Welcome to Activity Tracker</Text>
                <Button
                    onPress={() => navigation.navigate('AddActivity')}
                    mode="contained"
                    icon="plus-circle"
                >
                    Add new activity
                </Button>
            </View>

            <Text variant="headlineSmall">Your activities:</Text>

            <FlatList
                style={styles.list}
                data={activities}
                ListEmptyComponent={<Text variant="titleSmall" style={{ textAlign: 'center', paddingTop: 20, }}>No activities yet</Text>}
                renderItem={({ item }) =>
                    <Card style={styles.card}>

                        <Card.Title title={item.activityName} subtitle={`${item.activityDate}, Duration: ${item.duration} min`} />
                        <Card.Content>
                            <Text>{item.description}</Text>
                        </Card.Content>
                        <Card.Actions>
                            <IconButton icon="trash-can-outline" mode="contained" onPress={() => { setDialogVisible(true); setIdToDelete(item.id); }}></IconButton>
                        </Card.Actions>

                    </Card>
                }
            ></FlatList >



            <Portal>
                <Dialog visible={dialogVisible} onDismiss={hideDialog}>
                    <Dialog.Content><Text>Are you sure you want to delete this activity?</Text></Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setDialogVisible(false)}>Cancel</Button>
                        <Button onPress={() => handleDelete(idToDelete)}>Ok</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>

            <Snackbar
                visible={snackbarVisible}
                onDismiss={() => setSnackbarVisible(false)}
                duration={3000}
            >
                New activity added!
            </Snackbar>
        </View >
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',

    },
    actions: {
        marginTop: 30,
        marginBottom: 40,
        gap: 20
    },
    list: {
        width: '100%',
        paddingHorizontal: '5%',
        paddingTop: 10,

    },
    card: {
        marginBottom: 10,
    },
});