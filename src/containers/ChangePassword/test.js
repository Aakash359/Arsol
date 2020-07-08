import React, { PureComponent } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    FlatList,
    StyleSheet,
    TextInput,
} from 'react-native';

import { connect } from "react-redux";
import { Images, Color ,Config} from '@common';
import { scale } from "react-native-size-matters";
import Snackbar from 'react-native-snackbar';
import {NavigationBar} from '@components';
import ArsolApi from '@services/ArsolApi';
import { LogoSpinner } from '@components';
const msg = Config.SuitCRM;
import {validate_pass} from '../../Omni';
import { CommonActions, StackActions, DrawerActions } from '@react-navigation/native';
class ChangePasswordScreen extends PureComponent {


    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            new_pass: '',
            current_pass: '',
            confirm_pass:''
        }

    }

     updatePress(){
         const {current_pass,new_pass,confirm_pass}=this.state
         const{network,user_id,user_type}=this.props
          
         if(current_pass.trim()==""){
            Snackbar.show({
                text: 'Enter Current Password',
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: Color.lgreen
              });
         }else if(new_pass.trim()==""){
            Snackbar.show({
                text: 'Enter New Password',
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: Color.lgreen
              });
         }else if(validate_pass(new_pass) === false){
            Snackbar.show({
                text: 'New Password must contain both upper and lower character, 1 special character and atleast 8 character long..!!',
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: Color.lgreen
              }); 
         }else if(confirm_pass.trim()==""){
            Snackbar.show({
                text: 'Enter Confirm Password',
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: Color.lgreen
              });
         }else if(validate_pass(confirm_pass) === false){
            Snackbar.show({
                text: 'Confirm Password must contain both upper and lower character, 1 special character and atleast 8 character long..!!',
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: Color.lgreen
              }); 
         }else if(new_pass!=confirm_pass){
            Snackbar.show({
                text: 'Confirm password not match to new password',
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
                this.hit_changePassword(user_id,user_type,current_pass,new_pass) 
            });
      
         
        
        }

        //this.props.navigation.navigate('Loading')
     }

     hit_changePassword(user_id,user_type,current_pass,new_pass){

        ArsolApi.ChangePassword_api(user_id,user_type,current_pass,new_pass)

        .then(responseJson => {
          console.log('ChangePassword_api', responseJson);
    
          if (responseJson.ok) {
            this.setState({
              loading: false,
              });
    
            if (responseJson.data != null) {
              if (responseJson.data.hasOwnProperty('status')) {
              
                  if (responseJson.data.status == 'success') {
                   
                    if (responseJson.data.hasOwnProperty('message')) {
                        this.setState({    
                            new_pass: '',
                        current_pass: '',
                        confirm_pass:''},()=>{
                            alert(responseJson.data.message)

                            this.props.navigation.dispatch(
                                CommonActions.reset({
                                  index: 0,
                                  routes: [
                                    { name: 'Auth' },
                                  ],
                                })
                              )
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

    _renderFrom() {
 const {current_pass,new_pass,confirm_pass} = this.state

        return (
            <View style={{  paddingHorizontal: scale(10),
                marginHorizontal: scale(40),}}>

                <View>

                    <View style={{ marginTop: scale(20) }}>

                        <Text style={{ fontSize: scale(12), fontWeight: 'bold' }}>Current Password</Text>


                        <TextInput
                            
                            style={styles.input_text}
                            secureTextEntry
                            placeholder={'Current Password'}
                            autoCorrect={false}
                            autoCapitalize={'none'}
                            placeholderTextColor="grey"
                            underlineColorAndroid="transparent"
                            onChangeText={current_pass => this.setState({ current_pass })}
                            value={current_pass}
                            returnKeyType={'next'}
                            onSubmitEditing={() => { 
                              new_pass.trim() != ''?
                              this.new_p.focus():
                             Snackbar.show({
                               text: 'Enter Current Password',
                               duration: Snackbar.LENGTH_SHORT,
                               backgroundColor: Color.lgreen
                               });
                              }}
                        />
                    </View>

                    <View style={{ marginTop: scale(5) }}>

                        <Text style={{ fontSize: scale(12), fontWeight: 'bold' }}>New Password</Text>
                       
                        <TextInput
                             ref={(input) => { this.new_p = input; }}
                            style={styles.input_text}
                            secureTextEntry
                            placeholder={'New Password'}
                            autoCorrect={false}
                            autoCapitalize={'none'}
                            placeholderTextColor="grey"
                            underlineColorAndroid="transparent"
                            onChangeText={new_pass => this.setState({ new_pass })}
                            value={new_pass}
                            returnKeyType={'next'}
                            onSubmitEditing={() => { 
                                new_pass.trim() != ''?
                              this.confirm_p.focus():
                             Snackbar.show({
                               text: 'Enter New Password',
                               duration: Snackbar.LENGTH_SHORT,
                               backgroundColor: Color.lgreen
                               });
                              }}
                        />

                      
                    </View>

                    <View style={{ marginTop: scale(5) }}>

                        <Text style={{ fontSize: scale(12), fontWeight: 'bold' }}>Confirm Password</Text>

                        <TextInput
                             ref={(input) => { this.confirm_p = input; }}
                            style={styles.input_text}
                            secureTextEntry
                            placeholder={'Confirm Password'}
                            autoCorrect={false}
                            autoCapitalize={'none'}
                            placeholderTextColor="grey"
                            underlineColorAndroid="transparent"
                            onChangeText={confirm_pass => this.setState({ confirm_pass })}
                            value={confirm_pass}
                            returnKeyType={'done'}
                            onSubmitEditing={() => { 
                                this.updatePress()
                              }}
                        />
                        
                    </View>


                </View>



                <View
                    style={{
                        marginTop: scale(30),
                        marginBottom: scale(100),
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>

                    <TouchableOpacity
                        onPress={() => { this.updatePress() }}
                        style={{
                            width: scale(230),
                            height: scale(40),
                            borderRadius: scale(20),
                            backgroundColor: '#3498DB',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <Text style={styles.txt_log}
                            numberOfLines={1}
                        >Update</Text>
                    </TouchableOpacity>

                </View>

            </View>

        )
    }



    render() {

        return (
            <View style={{flex:1,
        }}>
         <NavigationBar
                      leftButtonTitle={'Change Password'}
                      height={scale(44)}
                      leftButtonTitleColor={Color.black}
                      leftButtonIcon={Images.menu}
                      backgroundColor={Color.headerTintColor}
                      onLeftButtonPress={() => {
                        this.props.navigation.toggleDrawer();
                      }}
                    />
                    <LogoSpinner loading={this.state.loading} />
             {this._renderFrom()}
            
            </View>

        );
    }
}




const styles = StyleSheet.create({

    txt_log: {
        fontSize: scale(12),
        color: 'white',
        fontWeight: 'bold',
        width: scale(100),
        textAlign: 'center'
    },
    input_text:{
                                
        marginTop: scale(5),
        fontSize: scale(12),
        padding: scale(7),
        borderWidth: scale(1),
        borderColor: '#808B96',
        borderRadius: scale(5)
    }
});


ChangePasswordScreen.defaultProps = {
    network: '',
    user_id: '',
     user_type:''
}


const mapStateToProps = (state) => {
    return {

        user_id: state.user.id,
        user_type: state.user.type,
        network: state.network,

    };
};


export default connect(
    mapStateToProps,
    null
)(ChangePasswordScreen);