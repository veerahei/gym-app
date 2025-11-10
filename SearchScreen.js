import { useState } from "react";
import { View, StyleSheet, FlatList, Image } from "react-native";
import { Button, Text, TextInput, Card, Searchbar } from "react-native-paper";

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
            <Text style={{ marginTop: 100 }}>Search inspiration for your next workout</Text>
            <Searchbar style={styles.input}
                placeholder=""
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
                style={{
                    marginTop: 10, width: '100%',
                    paddingHorizontal: '5%'
                }}
                data={exercises}
                renderItem={({ item }) =>
                    <Card style={{ marginBottom: 20, flex: 1, }}>

                        <Card.Title title={item.name} />
                        <View style={{ backgroundColor: "white", marginHorizontal: 20, alignItems: "center", justifyContent: 'center', marginBottom: 20, borderRadius: 10, }}>
                            <Image
                                source={{ uri: item.gifUrl }}
                                style={{ width: "100%", height: 200, resizeMode: "contain", }}
                            >

                            </Image>
                        </View>

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