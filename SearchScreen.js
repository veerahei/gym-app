import { View, StyleSheet } from "react-native";
import { Button, Text } from "react-native-paper";


export default function SearchScreen() {

    return (
        <View style={styles.container}>
            <Text variant="displaySmall">This is the search screen</Text>
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
});