import { View, FlatList, StyleSheet } from "react-native"
import { Button, Text, Card, IconButton, Snackbar, } from "react-native-paper";
import { useEffect, useState } from "react";
import { getDatabase, onValue, ref, remove, off, } from "firebase/database";
import { app } from '../firebaseConfig'
import { useNavigation } from "@react-navigation/native";
import { getAuth, signOut } from "firebase/auth";
import DeleteDialog from "../components/DeleteDialog";


export default function HomeScreen({ route }) {
    const [activities, setActivities] = useState([]); 
    const [dialogVisible, setDialogVisible] = useState(false);
    const [idToDelete, setIdToDelete] = useState("");
    const [snackbarVisible, setSnackbarVisible] = useState(false);

    const db = getDatabase(app);
    const auth = getAuth(app)

    const navigation = useNavigation();
    const currentUser = auth.currentUser; // Get current user

    console.log("Etusivu renderöity")
    console.log("Kirjautunut käyttäjä: ", currentUser.uid)

    useEffect(() => {
        if (route.params?.added) {
            setSnackbarVisible(true);
            navigation.setParams({ added: false })
        }
    }, [route.params?.added])

   
    useEffect(() => {

        console.log("HOMESCREENIN USEEFFECTISSÄ")
        /*if (!currentUser) {
            console.log("Current user ei löytynyt")
            return
        }*/

        if (currentUser) {  //If user is signed in, show user's own activities
            console.log("Current user löytyi")
            const activitiesRef = (ref(db, `users/${currentUser.uid}/activities/`));
            onValue(activitiesRef, (snapshot) => {
                console.log("On value listener asetettu aktiviteetteihin/datan arvo muuttunut?")
                const data = snapshot.val();

                if (data) {
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
        navigation.setOptions({
            headerRight: () => (
                <Button onPress={() => handleSignOut()}>Log out</Button>
            ),
        });
    }, [navigation]);

    console.log("Etusivun aktiviteetit:", activities);

    const handleSignOut = () => {
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

            <DeleteDialog
                visible={dialogVisible}
                onDismiss={() => setDialogVisible(false)}
                onConfirm={() => handleDelete(idToDelete)}
            />

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