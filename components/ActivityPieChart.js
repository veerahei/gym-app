import { PieChart } from "react-native-chart-kit"
import { View,  Dimensions } from "react-native"
import { Text } from "react-native-paper"

//Tämä komponentti sisältää varsinaisen "piirroksen" pichartista.
//Tänne välitetään data-propsina piechartData. Se on siis piechartdata, mutta tässä tiedostossa nimenä on "data"
export default function ActivityPieChart({ data }) {

    return (
        <View>
            <Text variant="titleMedium" style={{ textAlign: 'center' }}>Activity Occurrence</Text>
            <PieChart
                data={data}
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