import { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native"
import { Text, } from "react-native-paper"
import { BarChart, PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { getDatabase, ref, onValue, off, } from "firebase/database";
import { app } from './firebaseConfig';
import { getAuth } from "firebase/auth";

import { getBarchartData, getPiechartData } from "./ChartData";


export default function ChartScreen() {

    const [pieChartData, setPieChartData] = useState([]);
    const [barChartData, setBarChartData] = useState({
        labels: [],
        datasets: [{ data: [] }]
    });

    const auth = getAuth(app)
    const db = getDatabase(app);
    const currentUser = auth.currentUser;


    //Hae data tietokannasta. Tämä suoritetaan aina ja ensimmäisenä, kun käyttäjä avaa Chart-tabin.
    useEffect(() => {
        console.log("CHART SCREENIN USEEFFECTISSÄ")
        if (!currentUser) {
            console.log("Käyttäjää ei löytynyt")
            return
        }

        //Tarkista että käyttäjä on kirjautunut
        if (currentUser) {
            console.log("Käyttäjä löytyi")
            const activitiesRef = ref(db, `users/${currentUser.uid}/activities`)

            onValue(activitiesRef, (snapshot) => {
                console.log("Chartscreenin onValue kuuntelijassa")
                const data = snapshot.val(); let activityList;
                if (data) {
                    console.log("Data firebasesta löytyi")

                    activityList = Object.values(data);

                    const barchartData = getBarchartData(activityList);
                    setBarChartData(barchartData);

                    const piechartData = getPiechartData(activityList);
                    setPieChartData(piechartData);

                    console.log("Chart-sivun aktiviteetit", activityList);
                } else {
                    console.log("Else haara")
                }
            });
        }
    }, []);


    const labelWidth = 80; // Width of each label
    const chartWidth = barChartData.labels.length * labelWidth;

    return (
        <View style={styles.container}>
            <Text variant="headlineMedium">Your activity profile</Text>
            <PieChart
                data={pieChartData}
                width={Dimensions.get("window").width} // from react-native
                height={220}
                chartConfig={{
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                }}
                accessor={"occurrence"}
                backgroundColor={"transparent"}
                paddingLeft={"15"}
                absolute={false} // Näyttääkö prosentteina vai tod. lukuina
            />
            <ScrollView horizontal={true}>
                <BarChart
                    data={barChartData}
                    width={chartWidth}
                    height={220}
                    chartConfig={{
                        backgroundColor: "#7E57C2",
                        backgroundGradientFrom: "#7E57C2",
                        backgroundGradientTo: "#7E57C2",
                        decimalPlaces: 2, // optional, defaults to 2dp
                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        style: {
                            borderRadius: 16
                        },
                        propsForDots: {
                            r: "6",
                            strokeWidth: "2",
                            stroke: "#ffa726"
                        }
                    }}
                    bezier
                    style={{
                        marginVertical: 8,
                        borderRadius: 16
                    }}
                />
            </ScrollView>
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
})