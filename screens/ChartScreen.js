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

    useEffect(() => {
        if (!currentUser) {
            return
        }

        if (currentUser) {
            const activitiesRef = ref(db, `users/${currentUser.uid}/activities`)

            onValue(activitiesRef, (snapshot) => {
                const data = snapshot.val(); let activityList;
                if (data) {
                    setActivitiesEmpty(false)
                    activityList = Object.values(data);

                    const barchartData = getBarchartData(activityList);
                    setBarChartData(barchartData);
                    const piechartData = getPiechartData(activityList);
                    setPieChartData(piechartData);

                    let newWidth;
                    if (barchartData.labels.length * 80 > Dimensions.get("window").width) {
                        newWidth = barchartData.labels.length * 80;
                    } else {
                        newWidth = Dimensions.get("window").width
                    }
                    setChartWidth(newWidth)

                } else {
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