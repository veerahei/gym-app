import { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native"
import { Text, SegmentedButtons, Button } from "react-native-paper"
import { LineChart, PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { getDatabase, ref, onValue } from "firebase/database";
import { app } from './firebaseConfig';
import { getAuth } from "firebase/auth";



export default function ChartScreen() {

    const [activitiesData, setActivitiesData] = useState([]);
    const [pieChartData, setPieChartData] = useState([]);

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

            })
        }
    }, []);


    return (
        <View style={styles.container}>
            <Text variant="headlineMedium">How you're moving </Text>
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