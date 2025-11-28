import { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native"
import { Text } from "react-native-paper"
import { Dimensions } from 'react-native';
import { getDatabase, ref, onValue} from "firebase/database";
import { app } from '../firebaseConfig';
import { getAuth } from "firebase/auth";

import { getBarchartData, getPiechartData } from "../utils/ChartData";

import ActivityPieChart from "../components/ActivityPieChart";
import ActivityBarChart from "../components/ActivityBarChart";


export default function ChartScreen() {

    const [pieChartData, setPieChartData] = useState([]);
    const [barChartData, setBarChartData] = useState({
        labels: [],
        datasets: [{ data: [] }]
    });
    const [activitiesEmpty, setActivitiesEmpty] = useState(true);
    const [chartWidth, setChartWidth] = useState(Dimensions.get("window").width)

    const auth = getAuth(app)
    const db = getDatabase(app);
    const currentUser = auth.currentUser;

    console.log("KAAVION LEVEYS ONVALUEN ULKOPUOLELLA", chartWidth)

    useEffect(() => {
        console.log("CHART SCREENIN USEEFFECTISSÄ")
        if (!currentUser) {
            console.log("Käyttäjää ei löytynyt")
            return
        }

        if (currentUser) {
            console.log("Käyttäjä löytyi")
            const activitiesRef = ref(db, `users/${currentUser.uid}/activities`)

            onValue(activitiesRef, (snapshot) => {
                console.log("Chartscreenin onValue kuuntelijassa")
                const data = snapshot.val(); let activityList;
                if (data) {
                    console.log("Data firebasesta löytyi")
                    setActivitiesEmpty(false)
                    activityList = Object.values(data);

                    const barchartData = getBarchartData(activityList);
                    setBarChartData(barchartData);
                    console.log("Saatu data: ", barchartData)
                    const piechartData = getPiechartData(activityList);
                    setPieChartData(piechartData);

                    let newWidth;
                    if (barchartData.labels.length * 80 > Dimensions.get("window").width) {
                        newWidth = barchartData.labels.length * 80;
                    } else {
                        newWidth = Dimensions.get("window").width
                    }

                    console.log("Barchartin data: ", barchartData.labels.length * 80)
                    console.log("Chartwidth: ", newWidth)
                    setChartWidth(newWidth)


                    console.log("Chart-sivun aktiviteetit", activityList);
                } else {
                    console.log("Else haara")
                    setActivitiesEmpty(true)
                    setPieChartData([])
                    setBarChartData({
                        labels: [],
                        datasets: [{ data: [] }]
                    })
                }
            });
        }
    }, []);

    return (
        <View style={styles.container}>
            <Text variant="headlineMedium">Your activity profile</Text>
            {activitiesEmpty ?
                <Text
                    variant="titleLarge"
                    style={{ paddingTop: 50, textAlign: 'center', }}>
                    No activities yet.{"\n"}Log your first activity in home screen!
                </Text>
                :
                <View style={{ paddingTop: 30 }}>
                    <ActivityPieChart data={pieChartData} />
                    <ActivityBarChart data={barChartData} chartWidth={chartWidth} />
                </View>
            }
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        paddingTop: 20,
        paddingHorizontal: "2%"
    },
})