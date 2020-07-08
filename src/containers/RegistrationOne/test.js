import React, { PureComponent } from "react";

import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { connect } from "react-redux";
import { Config, Color } from '@common';
import LinearGradient from 'react-native-linear-gradient';
import CardView from 'react-native-cardview';
import { scale } from "react-native-size-matters";

import Snackbar from 'react-native-snackbar';
const msg = Config.SuitCRM;

import {validate_email} from '../../Omni';
import { StackActions,CommonActions } from '@react-navigation/native';
class RegistrationOneScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      firstName: '',
      lastName: '',
      email: '',
      toggle: true,
    };
    
  }
   

  componentDidMount() {
    this.props.reg_reset();
  }

 hasFocus()
 {
        this.setState({
            toggle: !this.state.toggle
        })
    }

 lostFocus(){
        this.setState({
            toggle:this.state.toggle,
        })

    }

handlerBlur = (input) => {
    this.setState({
        [input]:false
    });
};

  handleNext() {
    const {firstName, lastName, email} = this.state;
    if (firstName.trim() == '') {
      Snackbar.show({
        text: 'Enter First Name',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: Color.lgreen,
      });
    } else if (lastName.trim() == '') {
      Snackbar.show({
        text: 'Enter Last Name',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: Color.lgreen,
      });
    } else if (email.trim() == '') {
      Snackbar.show({
        text: 'Enter Email',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: Color.lgreen,
      });
    } else if (validate_email(email) === false) {
      Snackbar.show({
        text: 'Enter Invalid Email',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: Color.lgreen,
      });
    } else {
      let reg = {
        fname: firstName,
        lname: lastName,
        email: email,
      };
      this.props.res_data(reg);
      this.props.navigation.navigate('RegistrationTwo');
    }
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
        }}>
        <View
          style={{
            marginLeft: scale(90),
            marginTop: scale(25),
            width: scale(180),
            height: scale(40),
            borderRadius: scale(4),
            backgroundColor: '#aeea00',
          }}>
          <Text
            style={{
              marginTop: scale(5),
              textAlign: 'center',
              paddingBottom: scale(20),
              fontSize: scale(18),
              fontWeight: 'bold',
            }}>
            Registration
          </Text>
        </View>

        <CardView
          width={330}
          height={400}
          style={{backgroundColor: '#eceff1'}}
          cardElevation={2}
          cardMaxElevation={2}
          cornerRadius={20}
          marginTop={10}
          marginLeft={15}>
          <KeyboardAwareScrollView
            contentContainerStyle={{flexGrow: 1}}
            enableOnAndroid={true}
            keyboardShouldPersistTaps="handled">
            <View style={styles.container}>
              <View>
                <View style={{flexDirection: 'row', width: scale(200)}}>
                  <Text style={styles.txt}>First Name</Text>
                  <Text style={{color: 'red', fontSize: scale(12)}}>*</Text>
                </View>
                <View style={styles.userInput}>
                  <TextInput
                    style={[styles.input, this.state.toggle && styles.textInputAlt]}
                    onFocus={()=>this.hasFocus()}  
                    onBlur={()=>this.lostFocus()}
                    placeholder={'John'}
                    autoCorrect={false}
                    autoCapitalize={'none'}
                    returnKeyType={'next'}
                    placeholderTextColor="grey"
                    underlineColorAndroid="transparent"
                    onChangeText={firstName => this.setState({firstName})}
                  />
                </View>
              </View>

              <View>
                <View style={{flexDirection: 'row', width: scale(200)}}>
                  <Text style={styles.txt}>Last Name</Text>
                  <Text style={{color: 'red', fontSize: scale(12)}}>*</Text>
                </View>
                <View style={styles.userInput}>
                  <TextInput
                    style={styles.input}
                    placeholder={'Doe'}
                    autoCorrect={false}
                    autoCapitalize={'none'}
                    returnKeyType={'next'}
                    placeholderTextColor="grey"
                    underlineColorAndroid="transparent"
                    onChangeText={lastName => this.setState({lastName})}
                  />
                </View>
              </View>

              <View>
                <View style={{flexDirection: 'row', width: scale(200)}}>
                  <Text style={styles.txt}>Email</Text>
                  <Text style={{color: 'red', fontSize: scale(12)}}>*</Text>
                </View>
                <View style={styles.userInput}>
                  <TextInput
                    style={styles.input}
                    placeholder={'example@domain.com'}
                    autoCorrect={false}
                    autoCapitalize={'none'}
                    returnKeyType={'next'}
                    placeholderTextColor="grey"
                    underlineColorAndroid="transparent"
                    onChangeText={email => this.setState({email})}
                  />
                </View>
              </View>
            </View>
          </KeyboardAwareScrollView>
        </CardView>

        <View
          style={{
            marginTop: scale(20),
            marginBottom: scale(10),
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={() => {
              this.handleNext();
            }}
            style={{
              width: scale(100),
              height: scale(40),
              borderRadius: scale(12),
              backgroundColor: '#ff8f00',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <LinearGradient
              style={styles.linearGradient}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              colors={['#ffa726', '#ff8f00', '#ff6f00']}>
              <Text style={styles.txt_log} numberOfLines={1}>
                Next
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <View
            style={{
              marginTop: scale(50),
              marginBottom: scale(20),
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{color: '#ff8f00'}}>Already a member ?</Text>

            <TouchableOpacity
              onPress={() => {
                this.props.navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{name: 'Auth'}],
                  }),
                );
              }}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={styles.txt_signin} numberOfLines={1}>
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View>
          <Text
            style={{
              color: 'grey',
              marginTop: scale(1),
              textAlign: 'center',
            }}>
            © ARSOL 2020-2021
          </Text>
        </View>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    
    
    marginTop: scale(20),
    marginHorizontal: scale(30),
    paddingVertical:scale(40),
    marginLeft:scale(15),
    marginRight:scale(15),
    

  },

  linearGradient: {
    width: scale(100),
    height: scale(40),
    borderRadius: scale(12),
   
    justifyContent: 'center',
    alignItems: 'center'
},

  userInput: {

    marginTop:scale(5),
    height: scale(40),
    backgroundColor: 'white',
    marginBottom: scale(15),
    borderColor: "#e0e0e0",
    borderWidth: scale(1),
    borderRadius: scale(4)
  },
   input: {
    color: '#000',
    marginLeft: scale(5),
    width: '73%',
    fontSize: scale(12)
  },
   textInputAlt: {
    borderColor: '#e71636',
  },
  userImg: {
    position: 'absolute',
    zIndex: scale(99),
    width: scale(22),
    height: scale(22),
    left: scale(10),
    top: scale(9),
  },
 
  txt: {
    fontSize: scale(12),
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'auto'
  },
  txt_log: {
    fontSize: scale(12),
    color: 'white',
    fontWeight: 'bold',
    width: scale(100),
    textAlign: 'center'
  },
  txt_signin: {
    fontSize: scale(12),
    color: 'black',
    fontWeight: 'bold',
    width: scale(100),
    textAlign: 'center'
  }
})




RegistrationOneScreen.defaultProps = {
  regData:'',
  network:''

}


const mapStateToProps = (state) => {
  return {

    regData:state.regData,

    network: state.network,


  };
};

const mapDispatchToProps = dispatch => {
  const {actions} = require('@redux/RegistrationRedux');

  return {
    res_data: reg => dispatch(actions.res_data(reg)),
    reg_reset: () => dispatch(actions.reg_reset()),
  };
};


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RegistrationOneScreen);