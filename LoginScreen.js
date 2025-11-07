import { View } from "react-native"
import { useState, useEffect } from "react";
import { Text, TextInput, Button } from "react-native-paper";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { app } from './firebaseConfig';
import { useNavigation } from "@react-navigation/native";



export default function LoginScreen() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const auth = getAuth(app);

    const navigation = useNavigation();

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                navigation.replace("Home") 
            } else {
                // User is signed out
                // ...
            }
        })
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
        console.log("loginissä")
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
        <View>
            <Text>Login screen</Text>
            <TextInput
                label="Email address"
                value={email}
                onChangeText={input => setEmail(input)}
            />
            <TextInput
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
    );
}