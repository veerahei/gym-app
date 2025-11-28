import { View, StyleSheet, TouchableWithoutFeedback, Keyboard, Image, Alert } from "react-native"
import { useState, useEffect } from "react";
import { TextInput, Button } from "react-native-paper";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { app } from '../firebaseConfig';
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from 'react-native-safe-area-context';


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
            } 
        })
        return unsubscribe
    }, [])

    const handleRegistration = () => {
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user
            })
            .catch((error) => {
                console.log(error.code, error.message); 
                if(error.code == "auth/email-already-in-use"){
                    Alert.alert("Email is already in use. Log in instead. ")
                }else if (error.code == "auth/invalid-email"){
                    Alert.alert("Invalid email.")
                } else if(error.code == "auth/weak-password"){
                    Alert.alert("Password should be at least 6 characters")
                }

            })
    }

    const handleLogin = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => { 
                const user = userCredential.user;
            })
            .catch((error) => {
                console.log(error.code, error.message);
                if(error.code == "auth/invalid-credential") {
                    Alert.alert("Invalid email or password. New user? Fill in your credentials and click 'Register'.")
                }else if(error.code == "auth/invalid-email"){
                    Alert.alert("Invalid email.")
                }
            });
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
                <View style={styles.container}>
                    <Image
                        source={require("../assets/FullLogo_Transparent.png")}
                        style={{ width: 250, height: 200 }}
                    />
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
                        >Register
                        </Button>
                    </View>
                </View >
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        paddingTop: 60
        
    },
    fields: {
        width: '85%',
        gap: 10
    }
})