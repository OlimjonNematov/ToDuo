import React, {useState} from 'react';
import {
    Modal, 
    StyleSheet, 
    Text, 
    View, 
    TextInput, 
    Button,
    SafeAreaView,
} from 'react-native';
import auth from '@react-native-firebase/auth';
// import readFromDatabase from '../services/fire';
import {addUser} from '../services/fire';

const AuthScreen = () => {
  //manage state
  const [showSignIn, setScreen] = useState(true);
  const [emailText, setEmailText] = useState('');
  const [passwordText, setPasswordText] = useState('');
  const [ageText, setAgeText] = useState('');
  const [firstNameText, setFirstNameText] = useState('');
  const [lastNameText, setLastNameText] = useState('');

  function setNewScreen() {
    setScreen(!showSignIn);
  }

  const signUserIn = (email, pass) => {
    // console.log(readFromDatabase('Users', 'YoUpATpuGFym8fdfw4SB'));
    auth().signInWithEmailAndPassword(email, pass);
  };
  const createUser = (email, pass, firstName, lastName, age) => {
    auth()
      .createUserWithEmailAndPassword(email, pass)
      .then(() => {
        //firstName, lastName, newAge, email
        var user = auth().currentUser;
        addUser(user.uid, firstNameText, lastNameText, ageText, email);
        console.log('User account created & signed in!');
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
        }

        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
        }

        console.error(error);
      });
  };

  return (
    <SafeAreaView style={styles.main}>
      {/* modal for login */}
      <Modal visible={showSignIn}>
        <SafeAreaView style={styles.main}>
          <Text style={styles.title}>LOG IN SCREEN</Text>

          <Text>Enter your email</Text>
          <View style={styles.container}>
            <TextInput
              style={styles.textInput}
              placeholder="Enter your email"
              onChangeText={text => setEmailText(text)}
            />
          </View>

          <Text>Enter your password</Text>
          <View style={styles.container}>
            <TextInput
              style={styles.textInput}
              secureTextEntry={true}
              placeholder="Enter a password"
              onChangeText={text => setPasswordText(text)}
            />
          </View>

          <View style={styles.buttonsToAuthView}>
            <Button
              style={styles.registerButton}
              title="Register"
              color="red"
              onPress={() => {
                setNewScreen();
              }}
            />
            <Button
              style={styles.logInButton}
              title="log in"
              onPress={() => {
                //send the user to welcome page
                signUserIn(emailText, passwordText);
              }}
            />
          </View>
        </SafeAreaView>
      </Modal>
      {/* Modal for register */}
      <Modal visible={!showSignIn}>
        <SafeAreaView style={styles.main}>
          <Text style={styles.title}>REGISTER SCREEN</Text>
          <View style={styles.container}>
            <Text>Enter your first name</Text>
            <TextInput onChangeText={text => setFirstNameText(text)} />
          </View>
          <View style={styles.container}>
            <Text>Enter your last name</Text>
            <TextInput onChangeText={text => setLastNameText(text)} />
          </View>
          <View style={styles.container}>
            <Text>Enter your age</Text>
            <TextInput
              // keyboardType="number-pad"
              onChangeText={text => setAgeText(text)}
            />
          </View>
          <View style={styles.container}>
            <Text>Enter email to register</Text>
            <TextInput
              placeholder="Enter your email"
              onChangeText={text => setEmailText(text)}
            />
          </View>
          <View style={styles.container}>
            <Text>Enter password to register</Text>
            <TextInput
              placeholder="Enter a passowrd"
              onChangeText={text => setPasswordText(text)}
              secureTextEntry={true}
            />
          </View>

          <View style={styles.buttonsToAuthView}>
            <Button
              style={styles.registerButton}
              title="Register"
              color="red"
              onPress={() => {
                console.log('creating user');
                //send the user to the welcome page
                createUser(emailText, passwordText);
              }}
            />
            <Button
              style={styles.logInButton}
              title="log in"
              onPress={() => {
                setNewScreen();
              }}
            />
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    alignContent: 'center',
    alignItems: 'stretch',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'silver'
  },
  textInput: {
    borderColor: 'black',
  },  
  title: {
    fontSize: 40,
    alignSelf: 'center'
  },
  container: {
    backgroundColor: 'white',
    height: '8%',
    padding: 7,
    marginTop: 10,
    borderBottomWidth: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
    borderColor: '#EBEBEB',
    borderWidth: 3,
    borderRadius: 10
  },
  logInButton: {
    flex: 1,
  },
  registerButton: {
    flex: 1,
  },
  buttonsToAuthView: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
export default AuthScreen;
