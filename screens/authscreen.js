import React, {useState} from 'react';
import {
    Modal, 
    StyleSheet, 
    Text, 
    View, 
    TextInput, 
    Button,
    SafeAreaView,
    TouchableOpacity,
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

          <Text style={styles.title}>LOG IN</Text>

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

          
          <View style={styles.buttons}>
            <TouchableOpacity 
              style={styles.logInButton}
              onPress={() => {
                //send user to welcome screen
                signUserIn(emailText, passwordText);
              }}>
              <Text style={styles.buttonText}>
                LOG IN
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.link}
              onPress={() => {
                //send user to register screen
                setNewScreen();
              }}>
              <Text style={styles.registerLinkText}>
                REGISTER
              </Text>
            </TouchableOpacity>
            
          </View>
        </SafeAreaView>
      </Modal>
      {/* Modal for register */}
      <Modal visible={!showSignIn}>
        <SafeAreaView style={styles.main}>

          <Text style={styles.title}>REGISTER SCREEN</Text>

          <View style={styles.container}>
            <Text>Enter your first name</Text>
            <TextInput 
              onChangeText={text => setFirstNameText(text)} 
              placeholder="John" />
          </View>

          <View style={styles.container}>
            <Text>Enter your last name</Text>
            <TextInput 
              onChangeText={text => setLastNameText(text)}
              placeholder="Doe" />
          </View>

          <View style={styles.container}>
            <Text>Enter your age</Text>
            <TextInput
              onChangeText={text => setAgeText(text)}
              placeholder="69" />
          </View>

          <View style={styles.container}>
            <Text>Enter email to register</Text>
            <TextInput
              placeholder="example@example.com"
              onChangeText={text => setEmailText(text)}
            />
          </View>

          <View style={styles.container}>
            <Text>Enter password to register</Text>
            <TextInput
              placeholder="1234abcd"
              onChangeText={text => setPasswordText(text)}
              secureTextEntry={true}
            />
          </View>

          <View style={styles.buttons}>
            <TouchableOpacity
              style={styles.registerButton}
              onPress={() => {
                console.log('creating user');
                //send user to the welcome screen
                createUser(emailText, passwordText);
              }}>
              <Text style={styles.buttonText}>SIGN UP</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.link}
              onPress={() => {
                //send user to log in screen
                setNewScreen();
              }}>
              <Text style={styles.loginLinkText}>LOG IN</Text>
            </TouchableOpacity>

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
    backgroundColor: 'silver',
  },
  textInput: {
  },  
  title: {
    fontSize: 40,
    alignSelf: 'center',
  },
  container: {
    backgroundColor: 'white',
    height: '8%',
    padding: 7,
    marginTop: 10,
    alignItems: 'stretch',
    justifyContent: 'center',
    borderColor: '#EBEBEB',
    borderWidth: 3,
    borderRadius: 10,
    marginBottom: 8,
  },

  //buttons--------------------
  buttons: {
    justifyContent: 'center',
    marginTop: 15
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
    letterSpacing: 2
  },
  logInButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#42aaf5',
    borderRadius: 60,
    height: 40,
  },
  registerButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e33232',
    borderRadius: 60,
    height: 40
  },

  //links----------------------
  link: {
    alignItems: 'center',
    marginTop: 10
  },
  loginLinkText: {
    color: '#42aaf5',
    fontWeight: 'bold',
    fontSize: 15,
    letterSpacing: 2
  },
  registerLinkText: {
    color: '#e33232',
    fontWeight: 'bold',
    fontSize: 15,
    letterSpacing: 2
  }
});
export default AuthScreen;
