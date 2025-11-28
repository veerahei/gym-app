import { PieChart } from "react-native-chart-kit"
import { View,  Dimensions } from "react-native"
import { Text } from "react-native-paper"

export default function ActivityPieChart({ data }) {
    return (
        <View>
            <Text variant="titleMedium" style={{ textAlign: 'center' }}>Activity Occurrence</Text>
            <PieChart
                data={data}
                width={Dimensions.get("window").width} 
                height={220}
                chartConfig={{
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                }}
                accessor={"occurrence"}
                backgroundColor={"transparent"}
                paddingLeft={"15"}
                absolute={false} 
            />
        </View>
    )
}