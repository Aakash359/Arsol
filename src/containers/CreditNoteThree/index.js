import React, { PureComponent } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    FlatList,
    StyleSheet,
    TextInput,
    Modal,
    ScrollView,Alert,TouchableHighlight
} from 'react-native';

import { connect } from "react-redux";
import { Images, Color,Config } from '@common';
import { scale } from "react-native-size-matters";
import Snackbar from 'react-native-snackbar';
import CardView from 'react-native-cardview';
import {NavigationBar} from '@components';
import ArsolApi from '@services/ArsolApi';
import { LogoSpinner } from '@components';
const msg = Config.SuitCRM;
import {validate_email} from '../../Omni';
import { CommonActions, StackActions, DrawerActions } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import RNPrint from 'react-native-print';

class CreditNoteThreeScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      customer_name:'',
      tc: 'Thanks for your Business',
      email:'',
  


    };
  }

  

  componentDidMount() {
    const { network,new_estimate,user_name,edit_id,estimate_info} = this.props;
    this._subscribe = this.props.navigation.addListener('focus', () => {
   

          
        
         this.setState({
          tc: estimate_info.term_conditions,
          customer_name:estimate_info.customer_notes,
          email:new_estimate.email,
       
         })  
 
         
 

    })
   
    }

  async printHTML(html_content) {
    await RNPrint.print({
      html: html_content
    })
  }

    saveEstimate(){
        const {customer_name,tc,email,sendEmail,sub,body}=this.state
        const {network,new_estimate,estimate_two,user_id,user_type}=this.props
        if (!network.isConnected) {
            Snackbar.show({
              text: msg.noInternet,
              duration: Snackbar.LENGTH_SHORT,
              backgroundColor: "red"
            });
          } else {
            this.setState({ loading: true }, () => {
              ArsolApi.NewCreditNote_api(
                  user_id,
                  user_type,
                  new_estimate,
                  estimate_two,
                  customer_name,
                  tc,
                  )
          
              .then(responseJson => {
                console.log('NewCreditNote_api', responseJson);
          
                if (responseJson.ok) {
                  this.setState({
                    loading: false,
             
                  });
          
                  if (responseJson.data != null) {
                    if (responseJson.data.hasOwnProperty('status')) {
                    
                        if (responseJson.data.status == 'success') {
                               alert(responseJson.data.message)

                          const popAction = StackActions.pop(3);
                          this.props.navigation.dispatch(popAction);
                          if (responseJson.data.data.length > 0) {



                         //   const popAction = StackActions.pop(3);
                          //  this.props.navigation.dispatch(popAction);

                            // Works on both Android and iOS
                            Alert.alert(
                              'New CreditNote',
                              responseJson.data.message,
                              [

                                {
                                  text: 'Cancel',
                                  onPress: () => console.log('Cancel Pressed'),
                                  style: 'cancel'
                                },
                                {
                                  text: 'Print', onPress: () => {

                                    this.printHTML(responseJson.data.data[0].html)
                                  }
                                }
                              ],
                              { cancelable: false }
                            );

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
                    alert(msg.servErr)
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
      
            })
          }
    }



  _renderEmail() {
      const {customer_name,tc,email}=this.state
    return (
       <CardView
                margin={scale(10)}
                height={505} 
                width={330}
                padding={20}
                style={{backgroundColor:'#eceff1'}}
                cardElevation={2}
                cardMaxElevation={2}
                cornerRadius={20}
                marginLeft={15}
                
                >
        <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
              enableOnAndroid={true}
              contentContainerStyle={{flexGrow: 1}}
            > 
       
      <View style={{paddingHorizontal: scale(10)}}>


        <View>
          <Text
            style={{
              fontSize: scale(12),
              fontWeight: 'bold',
              marginTop: scale(10),
            }}>
            Customer Notes
          </Text>

          <View
            style={{
              height: scale(100),
              marginTop: scale(5),
              borderColor: 'grey',
              borderWidth: scale(1),
              borderRadius: scale(5),
              backgroundColor:"white",
            }}>
            <TextInput
              style={{
                color: '#000',
                fontSize: scale(12),
                backgroundColor:"white",
              }}
              
              autoCorrect={false}
              autoCapitalize={'none'}
              returnKeyType={'next'}
              numberOfLines={1}
              multiline={true}
              placeholderTextColor="grey"
              underlineColorAndroid="transparent"
              onChangeText={customer_name => this.setState({customer_name})}
              value={customer_name}
            />
          </View>

          <Text
            style={{
              fontSize: scale(12),
              fontWeight: 'bold',
              marginTop: scale(10),
            }}>
            Terms & Conditions
          </Text>

          <View
            style={{
              height: scale(100),
              marginTop: scale(5),
              borderColor: 'grey',
              borderWidth: scale(1),
              borderRadius: scale(5),
              backgroundColor:"white",
            }}>
            <TextInput
              style={{
                color: '#000',
                fontSize: scale(12),
              }}
              autoCorrect={false}
              autoCapitalize={'none'}
              returnKeyType={'next'}
              numberOfLines={5}
              multiline={true}
              placeholderTextColor="grey"
              underlineColorAndroid="transparent"
              onChangeText={tc => this.setState({tc})}
              value={tc}
            />
          </View>

          <Text
            style={{
              fontSize: scale(12),
              fontWeight: 'bold',
              marginTop: scale(10),
            }}>
            Email to
          </Text>

          <TextInput
            style={{
              marginTop: scale(5),
              fontSize: scale(12),
              padding: scale(7),
              borderWidth: scale(1),
              borderColor: '#808B96',
              borderRadius: scale(5),
              backgroundColor:"white",
            }}
            autoCorrect={false}
            autoCapitalize={'none'}
            returnKeyType={'next'}
            placeholderTextColor="grey"
            underlineColorAndroid="transparent"
            onChangeText={email => this.setState({ email })}
            value={email}
            keyboardType='email-address'
          />

         
        </View>
      </View>
      </KeyboardAwareScrollView>
   </CardView>    
    );
  }




  render() {
    return (
      <View style={{flex: 1, backgroundColor:"white", }}>
<View>
      <TouchableHighlight
              activeOpacity={1}
              underlayColor={'#ddd'}
              onPress={() => this.props.navigation.goBack()}
              style={{
                width: scale(40),
                height: scale(40),
                alignItems: "center",
                justifyContent: 'center',
                borderRadius: scale(20)
              }}
            >
       <View style={{height:scale(40),width:scale(40),backgroundColor:'#ff8f00'}}>
                                <Image source={Images.backwhite} style={{
                                      width: scale(30), height: scale(30),alignSelf:"center",marginTop:scale(5)


                                    }} />
                    </View>
        </TouchableHighlight>
      </View>  
      
       <View style={{marginLeft:scale(80),
                    width:scale(190),height:scale(40),borderRadius:scale(4), backgroundColor:'#aeea00'}}>
        <Text style={{
          marginTop:scale(7),
          position: "absolute",
          alignSelf: "center",
          fontSize: scale(18),
          color: "black",
          fontWeight: 'bold'
        }}>{'New Credit Note'}</Text>
      
      </View>
        {/* <NavigationBar
          leftButtonTitle={'New Credit Note'}
          height={scale(44)}
          leftButtonTitleColor={Color.black}
          leftButtonIcon={Images.back}
          backgroundColor={Color.headerTintColor}
          onLeftButtonPress={() => {
            this.props.navigation.goBack();
          }}
        /> */}
  <LogoSpinner loading={this.state.loading} />
        {this._renderEmail()}

        <View
                style={{
                  marginTop: scale(30),
                  marginBottom: scale(10),
                  justifyContent: 'center',
                  alignItems: 'center',
                 
                }}>
                 <TouchableOpacity
                    style={{
                    width: scale(100),
                    height: scale(40),
                    borderRadius: scale(10),
                    backgroundColor: '#ff8f00',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
            

            onPress={() => { this.saveEstimate()}}
          
            >
                <Text style={{
                    
                    textAlign: 'center',
                    color: '#fff',
                    fontSize: scale(17),
                }}>Save Credit</Text>
                
            </TouchableOpacity>
              </View>
         <Text style={{color:'grey',marginBottom:scale(30),
                       textAlign:'center'}}> © ARSOL 2020-2021</Text>
      
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  txt_h: {
    fontSize: scale(12),
    color: '#000',
    fontWeight: 'bold',
    width: scale(200),
    textAlign: 'left',
  },
  userInput: {
    height: scale(40),
    backgroundColor: 'white',
    marginBottom: scale(5),
    borderColor: 'grey',
    borderWidth: scale(1),
    width: scale(200),
    borderRadius: scale(5),
  },
  input: {
    color: '#000',
    marginLeft: scale(5),
    width: '98%',
    fontSize: scale(12),
  },
  radioText: {
    marginRight: scale(10),
    fontSize: scale(12),
    color: '#000',
    fontWeight: 'bold',
  },
  radioCircle: {
    height: scale(15),
    width: scale(15),
    borderRadius: scale(10),
    borderWidth: scale(1),
    borderColor: '#3498DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedRb: {
    width: scale(15),
    height: scale(15),
    borderRadius: scale(30),
    backgroundColor: '#3498DB',
  },
  txt: {fontSize: scale(15), width: scale(150)},
  txth: {fontSize: scale(15), fontWeight: 'bold'},
  txt_log: {
    fontSize: scale(12),
    color: 'white',
    fontWeight: 'bold',
    width: scale(100),
    textAlign: 'center',
  },
});

CreditNoteThreeScreen.defaultProps = {

  new_estimate:'',
  estimate_two:'',
  user_id: '',
  user_type: '',
  network:'',
  user_name:'',
  estimate_info:'',
  edit_id:'',
};

const mapStateToProps = state => {
  return {
    user_id: state.user.id,
    user_type: state.user.type,
    user_name: state.user.Name,
    network: state.network,
    new_estimate: state.estData.new_estimate,
    estimate_two: state.estData.estimate_two,
    estimate_info: state.estData.estimate_info,
    edit_id: state.estData.new_estimate.edit_id,

  };
};

export default connect(
  mapStateToProps,
  null,
)(CreditNoteThreeScreen);