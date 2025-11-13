import { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native"
import { Text, SegmentedButtons, Button } from "react-native-paper"
import { BarChart, PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { getDatabase, ref, onValue } from "firebase/database";
import { app } from './firebaseConfig';
import { getAuth } from "firebase/auth";



export default function ChartScreen() {

    const [activitiesData, setActivitiesData] = useState([]);
    const [pieChartData, setPieChartData] = useState([]);
    const [lineChartData, setLineChartData] = useState({
        labels: [],
        datasets: [{ data: [] }]
    });


    const auth = getAuth(app)
    const db = getDatabase(app);
    const currentUser = auth.currentUser;



    //Hae data tietokannasta
    useEffect(() => {

        if (currentUser) {
            const activitiesRef = ref(db, `users/${currentUser.uid}/activities`)
            onValue(activitiesRef, (snapshot) => {
                const data = snapshot.val();   //data on olio, ei lista! olio jossa avain-arvo pareja. Avain on aktiviteetin id, jota ei nyt tarvita, niin käytetään object.values joka ottaa vain arvot, ja asetetaan ne listaan alla.
                //NOTE! tässä ei toiminut suoraan state muuttuja aktiviteettien tallennukseen. Se on asynkroininen, joten sivu jumitti koko ajan, eikä näyttänyt dataa. Haen tiedot firebasesta ja tallennan ne ensin perusmuuttujaan activityList.
                let activityList = []
                if (data) {
                    activityList = (Object.values(data)) //
                } else {
                    setActivitiesData([]);
                }

                //Tietokannasta hatut aktiviteetit listana
                console.log("Aktiviteetit: ", activityList);

                //Laske esiintymät. Lähde: https://www.geeksforgeeks.org/javascript/count-occurrences-of-all-items-in-an-array-in-javascript/
                let counts = activityList.reduce((acc, curr) => {
                    acc[curr.activityName] = (acc[curr.activityName] || 0) + 1;
                    return acc;
                }, {})

                console.log("Esiintymiskerrat", counts)

                //Color palette: https://mycolor.space/
                const colors = ["#7E57C2", "#9c72e1", "#140060", "#fbeaff", "#bb8eff", "#daacff", "#facaff", "#ffe8ff", "#4d2c91"]

                console.log(Object.entries(counts))

                //Data  piechartin tarvitsemaan muotoon.
                // TÄMÄ OBJECT.ENTRIES JA MAP RAKENNE on tismalleen sama, kuin firebase luentoesimerkissä, jossa tehdään poistotoiminto. 
                const formattedData = Object.entries(counts).map(([key, value], index) => ({
                    name: key,
                    occurrence: value,
                    color: colors[index],
                    legendFontColor: "#333",
                    legendFontSize: 15,
                }));

                setPieChartData(formattedData)
                console.log("Pie chart data:", formattedData);

                //Paljonko aikaa käytetty Lähde: https://www.geeksforgeeks.org/javascript/count-occurrences-of-all-items-in-an-array-in-javascript/
                let totalTime = activityList.reduce((acc, curr) => {
                    acc[curr.activityName] = (acc[curr.activityName] || 0) + Number(curr.duration);
                    return acc;
                }, {})

                console.log(totalTime)

                const chartData = {
                    labels: Object.keys(totalTime),
                    datasets: [
                        {
                            data: Object.values(totalTime),
                        },
                    ],
                };

                setLineChartData(chartData)

                console.log(chartData.labels)

            })
        }
    }, []);


    const labelWidth = 80; // Width of each label
    const chartWidth = lineChartData.labels.length * labelWidth;

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
                    data={lineChartData}
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