import React, { PureComponent } from "react";

import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity, Keyboard ,TouchableHighlight} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { connect } from "react-redux";
import { scale } from "react-native-size-matters";
import { Images, Config ,Color} from '@common';
const msg = Config.SuitCRM;
import Snackbar from 'react-native-snackbar';
import { LogoSpinner } from '@components';
import {validate_email} from '../../Omni';
import ArsolApi from '@services/ArsolApi';

class ForgotPasswordScreen extends PureComponent {


    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            email:"",
            focus:false
        }
     }

     submitPress(){
        const{email}=this.state
        const { network} = this.props;

    if (email.trim() == '') {
      Snackbar.show({
        text: 'Enter Email',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: Color.lgreen
      });
    } else if (validate_email(email) === false) {
    
        Snackbar.show({
            text: 'Invalid Email',
            duration: Snackbar.LENGTH_SHORT,
            backgroundColor: Color.lgreen
          });
      }else if(!network.isConnected){
        Snackbar.show({
          text: msg.noInternet,
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: "red"
        });
      }
      else {
          this.setState({loading: true},()=>{
            this.hit_forgotPassword(email) 
        });
    }
        //this.props.navigation.navigate('Login')
     }

     hit_forgotPassword(email){
        ArsolApi.ForgotPassword_api(email)

        .then(responseJson => {
          console.log('ForgotPassword_api', responseJson);
    
          if (responseJson.ok) {
            this.setState({
              loading: false,
              });
    
            if (responseJson.data != null) {
              if (responseJson.data.hasOwnProperty('status')) {
              
                  if (responseJson.data.status == 'success') {
                   
                    if (responseJson.data.hasOwnProperty('message')) {
                        this.setState({email:""},()=>{
                            alert(responseJson.data.message)
                        })
                        
                        
                    }

                
                } else if (responseJson.data.status == 'failed') {
              
                    if (responseJson.data.hasOwnProperty('message')) {
                        alert(responseJson.data.message)
                    }
                  
                } else {
                  Snackbar.show({
                    text: msg.servErr,
                    duration: Snackbar.LENGTH_SHORT,
                    backgroundColor: "red"
                  });
                }
              } else {
                Snackbar.show({
                  text: msg.servErr,
                  duration: Snackbar.LENGTH_SHORT,
                  backgroundColor: "red"
                });
              }
            } else {
              Snackbar.show({
                text: msg.servErr,
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: "red"
              });
            }
          } else {
            if (responseJson.problem == 'NETWORK_ERROR') {
              Snackbar.show({
                text: msg.netError,
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: Color.lgreen
              });
              this.setState({
                loading: false,
               
              });
            } else if (responseJson.problem == 'TIMEOUT_ERROR') {
              Snackbar.show({
                text: msg.serTimErr,
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: Color.lgreen
              });
              this.setState({
                loading: false,
                
              });
            } else {
              Snackbar.show({
                text: msg.servErr,
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: "red"
              });
              this.setState({
                loading: false,
                
              });
            }
          }
        })
        .catch(error => {
          console.error(error);
          this.setState({
            loading: false,
            
          });
        });
     }
  renderHeader() {
    return (
      <View
        style={{
          backgroundColor: Color.bgColor,
          borderRadius: scale(5),
          justifyContent: "center",
          alignItems: "center",
          padding: scale(10),
          width: scale(180),
          alignSelf: 'center'
        }}
      >
        <Text style={{
          fontSize: scale(18),
          color: '#000',

        }}
          numberOfLines={1}
        >Forgot Password</Text>

        

      </View>
    )
  }


  onFocus() {
    this.setState({
      focus: true
    })
  }

  onBlur() {
    this.setState({
      focus: false
    })
  }

  renderEmailInput(){
    const { email } = this.state
    return(
      <View
        style={{
          borderColor:
            this.state.focus ?
              "#53ADEC"
              :
              '#ccc',
          backgroundColor: this.state.focus ?
            "#E7F0FF"
            :
            '#fff',
          height: scale(45),
          width: '95%',
          borderWidth: this.state.focus ?
            scale(1)
            :
            scale(.5),
          flexDirection: 'row',
          alignItems: "center",
          justifyContent: 'space-between',
          padding: scale(5),
          borderRadius: (8),
          marginTop: scale(5),
          marginBottom: scale(10)
        }}
      >


        <TextInput
      
          autoCapitalize='none'
          autoCorrect={false}
        
          value={email}
          placeholder={'User Email'}
          placeholderTextColor="grey"
          underlineColorAndroid='transparent'
          autoFocus={false}
          returnKeyType='done'
          onBlur={() => this.onBlur()}
          onFocus={() => this.onFocus()}
          keyboardType='email-address'
          onSubmitEditing={() => { this.submitPress()}}
        
          style={{
            color: '#000',
            height: scale(40),
            fontSize: scale(14),
            width: '80%',
            backgroundColor: 'transparent',}}
       
          onChangeText={email => this.setState({ email })}

        />

       



      </View>

    )
  }

    render() {
          
        return (
            <KeyboardAwareScrollView
                contentContainerStyle={{ flexGrow: 1, }}
                enableOnAndroid={true}
                keyboardShouldPersistTaps="handled">

                <LogoSpinner loading={this.state.loading} />
            <TouchableHighlight
              activeOpacity={1}
              underlayColor={'#ddd'}
              onPress={() => this.props.navigation.goBack()}
              style={{
                width: scale(35), height: scale(35),
                alignItems: "center",
                justifyContent: 'center',
                backgroundColor: Color.headerTintColor
              }}
            >
              <Image source={Images.backwhite}
                style={{
                  width: scale(20),
                  height: scale(20),
                }} />
            </TouchableHighlight>

            {this.renderHeader()}

            <View
            style={{
                padding: scale(10),
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 9,
                },
                shadowOpacity: 0.48,
                shadowRadius: 11.95,

                elevation: 20,
                borderRadius: scale(15),
                backgroundColor: "#fff",
                margin: scale(15),
            }}>

              <Text style={{
                fontSize: scale(12),
                fontWeight: 'bold',
                marginTop: scale(10)

              }}>User Email</Text>

             {this.renderEmailInput()}

              <TouchableOpacity

                onPress={() => { this.submitPress() }}
                style={{
                  width: scale(100),
                  height: scale(40),
                  borderRadius: scale(5),
                  backgroundColor: '#3498DB',
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignSelf:"center",
                  marginVertical:scale(20)
                }}
              >
                <Text style={styles.txt_log}
                  numberOfLines={1}
                >Submit</Text>
              </TouchableOpacity>
            </View>

            


            </KeyboardAwareScrollView>

        );
    }
}

const styles = StyleSheet.create({
    

    txt_log: {
        fontSize: scale(12),
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
        width:scale(100)
    },

     
})





ForgotPasswordScreen.defaultProps = {
    network: '',

}


const mapStateToProps = (state) => {
    return {


   
        network: state.network,



    };
};




export default connect(
    mapStateToProps,
    null
)(ForgotPasswordScreen);