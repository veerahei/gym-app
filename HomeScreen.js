import { View, FlatList, StyleSheet } from "react-native"
import { Button, Text, Card } from "react-native-paper";
import { useEffect, useState } from "react";
import { getDatabase, onValue, ref } from "firebase/database";
import { app } from './firebaseConfig';

import { useNavigation } from "@react-navigation/native";
import { getAuth, signOut } from "firebase/auth";




export default function HomeScreen() {
    const [plans, setPlans] = useState([]);
    const db = getDatabase(app);
    const auth = getAuth(app)

    const navigation = useNavigation();

    //Read data from referred table form data base, here from plans table/node
    useEffect(() => {
        const plansRef = ref(db, 'plans/');
        onValue(plansRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setPlans(Object.values(data));
            } else {
                setPlans([]);
            }
        })
    }, []);

    console.log(plans);

    const handleSignOut = () => {
        signOut(auth)
            .then(() => (navigation.replace("Login")))
            .catch(error => console.log(error.message))

    }

    //Show user's workoutplans in a list
    return (
        <View style={styles.container}>

            <Button
                onPress={handleSignOut}
            >Sign out</Button>
            <Text variant="bodyLarge">Your workout plans</Text>

            <Button
                onPress={() => navigation.navigate('Test')}
            >
                Add new workout plan
            </Button>

            <FlatList
                style={styles.list}
                data={plans}
                renderItem={({ item }) =>
                    <Card style={styles.card}>
                        <Card.Title title={item.planName} />
                        <Card.Content><Text>{item.exercises[0].name}</Text></Card.Content>
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