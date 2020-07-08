import React, { PureComponent } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    FlatList,
    StyleSheet,
    TextInput,
    TouchableHighlight,ImageBackground,Dimensions
} from 'react-native';

import { connect } from "react-redux";
import { Images, Color ,Config} from '@common';
import { scale } from "react-native-size-matters";
import Snackbar from 'react-native-snackbar';
import {NavigationBar,ValidateTextInput} from '@components';
import ArsolApi from '@services/ArsolApi';
import { LogoSpinner } from '@components';
const msg = Config.SuitCRM;
import {validate_pass} from '../../Omni';
import { CommonActions, StackActions, DrawerActions } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
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
          <View>

          <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
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
            margin:scale(15),
           
          }}
         >
 

        <Text style={{ fontSize: scale(12),
         fontWeight: 'bold',
        marginTop:scale(10)
        
          }}>Current Password</Text>
                  <ValidateTextInput
                    placeholder="Current Password"
                    onChangeTextInput={current_pass => this.setState({ current_pass })}
                    valueInput={current_pass}
                    returnKeyType={'next'}
            onSubmitEditing={() => { 
              
              this.new_p.focus()
             
              }}
                  />

    
        <Text style={{ fontSize: scale(12), fontWeight: 'bold' }}>New Password</Text>
                  <ValidateTextInput
                    getRef={(input) => { this.new_p = input; }}
                    placeholder={'New Password'}

             
                    onChangeTextInput={new_pass => this.setState({ new_pass })}
                    valueInput={new_pass}
                    returnKeyType={'next'}
                    onSubmitEditing={() => {
                      this.confirm_p.focus() 
                        
                    }}

                  />
        
        <Text style={{ fontSize: scale(12), fontWeight: 'bold' }}>Confirm Password</Text>


 <ValidateTextInput
                    getRef={(input) => { this.confirm_p = input; }}
                    placeholder={'Confirm Password'}
                   
                    onChangeTextInput={confirm_pass => this.setState({ confirm_pass })}
            valueInput={confirm_pass}
            returnKeyType={'done'}
            onSubmitEditing={() => { 
                this.updatePress()
              }}
                   
                  />
       
        
    
    <TouchableOpacity
        onPress={() => { this.updatePress() }}
        style={{
           
            
            borderRadius: scale(5),
            backgroundColor: '#3498DB',
          
            alignSelf:"center",
            marginTop:scale(50),
            marginBottom: scale(20),
            padding:scale(15),
            
        }}
    >
        <Text style={styles.txt_log}
            numberOfLines={1}
        >Update</Text>
    </TouchableOpacity>





          </KeyboardAwareScrollView>
</View>
        

        )
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
          width: scale(200),
          alignSelf: 'center'
        }}
      >
        <Text style={{
          fontSize: scale(18),
          color: '#000',

        }}
          numberOfLines={1}
        >Change Password</Text>

      </View>
    )
  }

    

    render() {

        return (
          <View>
            <ImageBackground
              style={[styles.fixed, styles.containter]}
              source={Images.listbg}>
         
            <TouchableHighlight
              activeOpacity={1}
              underlayColor={'#ddd'}
              onPress={() =>
                this.props.navigation.toggleDrawer()}
              style={{
                width: scale(35), height: scale(35),
                alignItems: "center",
                justifyContent: 'center',
                backgroundColor: Color.headerTintColor
              }}
            >
              <Image source={Images.menu}
                style={{
                  width: scale(20),
                  height: scale(20),
                }} />
            </TouchableHighlight>

            {this.renderHeader()}
                    <LogoSpinner loading={this.state.loading} />
             {this._renderFrom()}
            
            </ImageBackground>
            </View>

        );
    }
}




const styles = StyleSheet.create({

  containter: {
    width: Dimensions.get("window").width, //for full screen
    height: Dimensions.get("window").height //for full screen
  },
  fixed: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },

    txt_log: {
        fontSize: scale(12),
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        textAlignVertical:"center"
        
    },
    input_text:{
        height : scale(45),                        
        marginTop: scale(3),
        fontSize: scale(12),
        borderWidth: scale(1),
        borderColor: "#0070c6",
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