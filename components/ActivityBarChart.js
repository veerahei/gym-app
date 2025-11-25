import { BarChart } from 'react-native-chart-kit';
import { View, ScrollView, } from "react-native"
import { Text } from 'react-native-paper';


//Tämä sisältää "piirroksen" barchartista, joka näytetään chartscreenissä
//Tänne välitetään propsit data, joka on Chartscreenin BarChartData, ja chartWidth, joka vaihtelee, mutta on vähintään näytön leveys
export default function ActivityBarChart({ data, chartWidth }) {

    return (
        <View>
            <Text variant="titleMedium" style={{ textAlign: 'center' }}>Total Time By Activity</Text>
            <ScrollView horizontal={true}>
                <BarChart
                    key={data.labels.join("-")}
                    data={data}
                    width={chartWidth}
                    height={300}
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
                    style={{
                        marginVertical: 8,
                        //borderRadius: 16
                    }}
                    fromZero={true}
                    showValuesOnTopOfBars={true}
                />
            </ScrollView>
        </View>
    )
}