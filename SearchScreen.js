import { useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { Button, Text, TextInput, Card } from "react-native-paper";

export default function SearchScreen() {

    const [input, setInput] = useState("");
    const [exercises, setExercises] = useState([]);

    const handleFetch = () => {
        fetch(`https://www.exercisedb.dev/api/v1/exercises/search?q=${input}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Error in fetch: ${response.statusText}`)
                }
                return response.json();
            })
            .then(data => setExercises(data.data))
            .catch(error => console.log(error))

        setInput("");
    }

    console.log(exercises);

    return (
        <View style={styles.container} >
            <TextInput style={styles.input}
                label="Search exercises"
                value={input}
                onChangeText={text => setInput(text)}
            />
            <Button
                mode="contained"
                onPress={handleFetch}
            >
                Search
            </Button>
            <FlatList
                style={{ width: '90%' }}
                data={exercises}
                renderItem={({ item }) =>
                    <Card>
                        <Card.Cover source={{ uri: item.gifUrl }} />
                        <Card.Title title={item.name} />
                        <Card.Content>
                            <Text>{item.instructions}</Text>
                        </Card.Content>
                    </Card>
                }
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
    input: {
        width: '90%',
    }
});