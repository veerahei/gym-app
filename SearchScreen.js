import { useState } from "react";
import { View, StyleSheet, FlatList, Image } from "react-native";
import { Button, Text, TextInput, Card, Searchbar } from "react-native-paper";

export default function SearchScreen() {

    const [input, setInput] = useState("");
    const [exercises, setExercises] = useState([]);
    const [latestSearch, setLatestSearch] = useState("");

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

        setLatestSearch(input)
        setInput("");

    }


    const handleClearSearch = () => {
        setExercises([]);
        setLatestSearch("");
    }

    console.log(exercises);

    return (
        
        <View style={styles.container} >
            <Text style={{ paddingTop: 40, paddingBottom: 20 }} variant="titleMedium">Search inspiration for your next workout</Text>
            <Searchbar style={styles.input}
                placeholder="e.g. targeted area, equipment, movement"
                value={input}
                onChangeText={text => setInput(text)}
            />
            <View style={{flexDirection: "row", gap: 10}}>
                <Button
                    
                    onPress={handleFetch}
                >
                    Search
                </Button>
                <Button
                    onPress={handleClearSearch}
                >Clear
                </Button>
            </View>
            {latestSearch != "" &&
                <Text variant="labelSmall">Your search for '{latestSearch}'</Text>}

            <FlatList
                style={{
                    marginTop: 10, width: '100%',
                    paddingHorizontal: '5%'
                }}
                data={exercises}
                renderItem={({ item }) =>
                    <Card style={{ marginBottom: 20, flex: 1, }}>

                        <Card.Title title={item.name.charAt(0).toUpperCase() + item.name.slice(1)} />
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