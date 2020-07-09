import React, { PureComponent } from "react";

import {
  Dimensions, View, Text, Switch,
  StyleSheet, TextInput, Image,
   TouchableOpacity,Keyboard, ImageBackground } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'


import { connect } from "react-redux";

import { scale } from "react-native-size-matters";
import { StackActions,CommonActions } from '@react-navigation/native';
import { Images, Config, Color } from '@common';
//import Snackbar from 'react-native-snackbar';
const msg = Config.SuitCRM;
import ArsolApi from '@services/ArsolApi';
import { LogoSpinner } from '@components';
import Snackbar from 'react-native-snackbar';
import {validate_email} from '../../Omni';


import { NavigationBar, ValidateTextInput } from '@components';
import LinearGradient from 'react-native-linear-gradient';
import Checkbox from 'react-native-modest-checkbox'

class LoginScreen extends PureComponent {


  constructor(props) {
    super(props);
    this.state={
    loading:false,
  //  username: 'rahul.singh@tactionsoftware.com',
  //  password: 'Rahul@123',
      username: 'abhishek@tactionsoftware.com',
      password: 'Abhi@123',
      focus:false,

      icEye: Images.eyeclose,
      isPassword: true,
      ch_remember:false
     }

 }

 componentDidMount() {
   const{email,pass,ch_remember}=this.props

   console.log(email,pass,ch_remember)
   this.setState({
     username: email,
     password: pass,
     ch_remember: ch_remember
   })
      
    this.props.logout();

    
  }

  
  

 

 

 hit_login(username,password) {

    ArsolApi.login_api(username,password)
      .then(responseJson => {
        console.log('login', responseJson);
this.setState({loading:false})
      
        if (responseJson.ok) {
          this.setState({
            loading: false,
          });
       

          if (responseJson.data != null) {
            if (responseJson.data.hasOwnProperty('status')) {
            
                if (responseJson.data.status == 'success') {
                if (responseJson.data.hasOwnProperty('message')) {
             
               //  alert(responseJson.data.message)

                     if(responseJson.data.hasOwnProperty("data")){
                         if(responseJson.data.data.length>0){

                          if(this.state.ch_remember)
                          {
                           
                            this.props.remember(
                              this.state.ch_remember,
                               username,
                                password)
                          }else{
                            this.props.remember(this.state.ch_remember, '', '')
                          }
                            
                             
                            this.props.login(responseJson.data.data[0]);
                            this.props.navigation.dispatch(
                                CommonActions.reset({
                                  index: 0,
                                  routes: [
                                    { name: 'Main' },
                                  
                                  ],
                                })
                              );
                         }
                     }

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

  _onPressHandler() {
    Keyboard.dismiss();
    const {username, password} = this.state;
    const { network} = this.props;

    if (username.trim() == '') {
      Snackbar.show({
        text: 'Enter Email',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: Color.lgreen
      });
    } else if (validate_email(username) === false) {
    
        Snackbar.show({
            text: 'Invalid Email',
            duration: Snackbar.LENGTH_SHORT,
            backgroundColor: Color.lgreen
          });
      }else if (password.trim() == '') {
      Snackbar.show({
        text: 'Enter Password',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: Color.lgreen
      });
    } else if(!network.isConnected){
      Snackbar.show({
        text: msg.noInternet,
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: "red"
      });
    }
    else {


      this.setState({loading: true},()=>{
          this.hit_login(username,password) 
      });

   
  
  }
  }


  // email

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

  //password

  onFocusPass() {
    this.setState({
      focus_p: true
    })
  }

  onBlurPass() {
    this.setState({
      focus_p: false
    })
  }


  changePwdType = () => {
    const { isPassword } = this.state;
    // set new state value
    this.setState({
      icEye: isPassword ? Images.eye : Images.eyeclose,
      isPassword: !isPassword,
    });

  };
  

  render() {
    const { username, password } = this.state;

 
return (
  <View>
  <ImageBackground
    style={[styles.fixed, styles.containter]}
      source={Images.loginbg}
>
    <KeyboardAwareScrollView
        style={[styles.fixed, styles.scrollview]}
      enableOnAndroid={true}
      keyboardShouldPersistTaps="handled">

      <LogoSpinner loading={this.state.loading} />

      <View style={{
   
        alignItems:"center",
        justifyContent:"center",
        padding:scale(20),
        marginTop:scale(150)
      

      }}>

        <View
          style={{
            borderColor:
              this.state.focus ?
                Color.headerTintColor
                :
                '#000',
           
            height: scale(50),
            width: '95%',
            borderWidth: this.state.focus ?
              scale(1)
              :
              scale(.5),
            flexDirection: 'row',
            alignItems: "center",
            justifyContent: 'space-between',
            padding: scale(5),
            borderRadius: (30),
     
            marginBottom: scale(20),
            backgroundColor:'#fff'
          }}
        >


          <TextInput

            autoCapitalize='none'
            autoCorrect={false}

            value={username}
            placeholder={'User name'}
            placeholderTextColor="grey"
            underlineColorAndroid='transparent'
            autoFocus={false}
            
            onBlur={() => this.onBlur()}
            onFocus={() => this.onFocus()}
            keyboardType='email-address'
        

            style={{
              color: '#000',
              height: scale(40),
              fontSize: scale(14),
              width: '80%',
              backgroundColor: 'transparent',
              marginStart:scale(10)
            }}

            onChangeText={username => this.setState({ username })}
              returnKeyLabel={'next'}
          returnKeyType={'next'}
          onSubmitEditing={() => {
           
              this.secondTextInput.focus() 
             
          }}
          

          />





        </View>


        <View
          style={{
            borderColor:
              this.state.focus_p ?
                Color.headerTintColor
                :
                '#000',

            height: scale(50),
            width: '95%',
            borderWidth: this.state.focus_p ?
              scale(1)
              :
              scale(.5),
            flexDirection: 'row',
            alignItems: "center",
            justifyContent: 'space-between',
            padding: scale(5),
            borderRadius: (30),
            backgroundColor: '#fff'
       
      
          }}
        >


          <TextInput
           ref={(input) => { this.secondTextInput = input; }}

            autoCapitalize='none'
            autoCorrect={false}
            secureTextEntry={this.state.isPassword}
            value={password}
            underlineColorAndroid='transparent'
            autoFocus={false}
            returnKeyLabel='done'
            returnKeyType={'done'}
            onBlur={() => this.onBlurPass()}
            onFocus={() => this.onFocusPass()}

            placeholder='Password'
        
            placeholderTextColor='gray'

            style={{
              color: '#000',
              height: scale(40),
              fontSize: scale(14),
              width: '80%',
              backgroundColor: 'transparent',
              marginStart: scale(10),
          
            }}
         
            onChangeText={(password) => {
             this.setState({password})
            }}

          onSubmitEditing={() => { this._onPressHandler() }}

          />

          <TouchableOpacity
            onPress={this.changePwdType}
            style={{marginRight:scale(10)}}
            
            >
            <Image
              source={this.state.icEye}
              style={{ height: scale(25), width: scale(25) }}
            />
          </TouchableOpacity>



        </View>

       <View style={{flexDirection:'row',justifyContent:'space-between',
             marginTop: scale(80),
             width:'100%',
             alignItem:'center'
       }}>


              <Checkbox
                checked={this.state.ch_remember}
                label='Remember'
                onChange={(val) => {
                  console.log(val.checked )
                  this.setState({ch_remember:val.checked})
                  
                }}
              />

          
           

            <TouchableOpacity
            
              onPress={() => { this.props.navigation.navigate('ForgotPassword') }}

            >
              <Text style={{
                fontSize: scale(14),
                color: "#000",
                fontWeight: 'bold',
                width: scale(150),
                textAlignVertical:"center"

              }}
                numberOfLines={1}>Forgot Password?</Text>
            </TouchableOpacity>


       </View>
         

          
          <TouchableOpacity activeOpacity={.5}
            onPress={() => { this._onPressHandler() }}
          >

            <LinearGradient
              colors={['#fe8c00', '#fe8c00', '#f83600']}
              style={{
                height: scale(40),
                paddingLeft: scale(15),
                paddingRight: scale(15),
                borderRadius: scale(20),
                marginBottom: scale(20),
                marginTop: scale(80),
              }}
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 0.9 }}
              locations={[0, 0.3, 0.9]}


            >

              <Text style={{
                fontSize: scale(18),
                textAlign: 'center',
                margin: scale(7),
                color: '#fff',
                backgroundColor: 'transparent'
              }}> SING IN </Text>

            </LinearGradient>

          </TouchableOpacity>


          <Text style={{fontSize:scale(18),width:scale(20)}}>Or</Text>


          <TouchableOpacity activeOpacity={.5}
            onPress={() => { this.props.navigation.navigate('RegistrationOne') }}

          >

            <LinearGradient
              colors={['#fe8c00', '#fe8c00','#f83600' ]}
              style={{
                height: scale(40),
                paddingLeft: scale(15),
                paddingRight: scale(15),
                borderRadius: scale(20),
                marginBottom: scale(20),
                marginTop: scale(20),
              }}
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 0.9 }}
              locations={[0, 0.3, 0.9]}


            >

              <Text style={{
                fontSize: scale(18),
                textAlign: 'center',
                margin:scale(7),
                color: '#fff',
                backgroundColor: 'transparent'
              }}> SING UP </Text>

            </LinearGradient>

          </TouchableOpacity>
        

    

      

      

      </View>


   








    </KeyboardAwareScrollView>
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
  scrollview: {
    backgroundColor: 'transparent'
  }

  
})





LoginScreen.defaultProps = {
  id: "",
  network:'',

 }


  const mapStateToProps = (state) => {
    return {
  
  
      id: state.user.id,
      email:state.user.email,
      pass:state.user.pass,
      ch_remember: state.user.ch_remember,
      network: state.network,
   
    };
  };

  const mapDispatchToProps = dispatch => {
    const {actions} = require('@redux/UserRedux');
  
    return {
      login: customers => dispatch(actions.login(customers)),
      logout: () => dispatch(actions.logout()),
      remember: (c, u, p) => dispatch(actions.remember(c,u,p)),
    };
  };


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginScreen);