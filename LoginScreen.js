import { View, StyleSheet } from "react-native"
import { useState, useEffect } from "react";
import { Text, TextInput, Button } from "react-native-paper";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { app } from './firebaseConfig';
import { useNavigation } from "@react-navigation/native";



export default function LoginScreen() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [secureTextEntry, setSecureTextEntry] = useState(true);

    const auth = getAuth(app);

    const navigation = useNavigation();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                navigation.replace("MainTabs")
            } else {
                // User is signed out
                // ...
            }
        })
        return unsubscribe
    }, [])

    const handleRegistration = () => {
        console.log("In regis")
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user
                console.log('Registered with: ', user.email, user.uid)
            })
            .catch((error) => {
                console.log(error.code, error.message);

            })
    }

    const handleLogin = () => {

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                console.log("Signed in", user.email)
            })
            .catch((error) => {
                console.log(error.code, error.message);
            });
    }

    return (
        <View style={styles.container}>

            <View style={styles.fields}>
                <TextInput
                    label="Email address"
                    value={email}
                    onChangeText={input => setEmail(input)}
                />
                <TextInput
                    secureTextEntry={secureTextEntry}
                    right={<TextInput.Icon icon="eye" onPress={() => setSecureTextEntry(!secureTextEntry)} />}
                    label="Password"
                    value={password}
                    onChangeText={input => setPassword(input)}
                />
                <Button
                    onPress={handleLogin}
                >Login</Button>
                <Button
                    onPress={handleRegistration}
                >Register</Button>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    fields: {
        width: '85%',
        gap: 10
    }
})