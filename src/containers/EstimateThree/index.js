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
    ScrollView,Alert,
    TouchableHighlight
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

import { CommonActions, StackActions, DrawerActions } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import moment from 'moment';
import Checkbox from 'react-native-modest-checkbox';
import RNPrint from 'react-native-print';

class EstimateThreeScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      emailModal:false,
      customer_name:'',
      tc: 'Thanks for your Business',
      email:'',
      sendEmail:false,
      sub:"",
      body:''


    };
  }

  

  componentDidMount() {
    const { network,new_estimate,user_name,edit_id,estimate_info} = this.props;
    this._subscribe = this.props.navigation.addListener('focus', () => {
      var content= `Dear ${new_estimate.custom_name} ,\nThank for your business. Please find your attached Invoice.We appreciate your prompt payment.\nInvoice no. ${new_estimate.est_no}\nInvoice Date. ${moment(new Date()).format('DD/MM/YYYY')}\nThanks,\n${user_name}`
         


           if(edit_id!=''){
        
         this.setState({
          tc: estimate_info.term_conditions,
          customer_name:estimate_info.customer_notes,
          sendEmail:estimate_info.email_check=="0"?false:true
         })  
 
         }else{
          this.setState({
            email:new_estimate.email,
            sub:"invoice "+new_estimate.est_no,
            body:content
        })
         }
 

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
              ArsolApi.NewEstimate_api(
                  user_id,
                  user_type,
                  new_estimate,
                  estimate_two,
                  customer_name,
                  tc,
                  email,
                  sendEmail,
                  sub,
                  body)
          
              .then(responseJson => {
                console.log('NewEstimate_api', responseJson);
          
                if (responseJson.ok) {
                  this.setState({
                    loading: false,
             
                  });
          
                  if (responseJson.data != null) {
                    if (responseJson.data.hasOwnProperty('status')) {
                    
                        if (responseJson.data.status == 'success') {
                              //alert(responseJson.data.message)

                              
                                  if(responseJson.data.data.length>0){



                                     const popAction = StackActions.pop(3);
                                    this.props.navigation.dispatch(popAction);
                                    
                                    // Works on both Android and iOS
                                    Alert.alert(
                                      'New Estimate',
                                      responseJson.data.message,
                                      [
                                        
                                        {
                                          text: 'Cancel',
                                          onPress: () => console.log('Cancel Pressed'),
                                          style: 'cancel'
                                        },
                                        { text: 'Print', onPress: () => {

                                          this.printHTML(responseJson.data.data[0].html)
                                        }}
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

  update_CheckBox(val){
  this.setState({
      sendEmail:val.checked
  })
  }

  _renderEmail() {
      const {customer_name,tc,email,sendEmail}=this.state
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
              backgroundColor:"white",
              borderColor:"#bdbdbd",
              borderWidth: scale(1),
              borderRadius: scale(5),
            }}>
            <TextInput
              style={{
                
                fontSize: scale(12),
                color: '#000',
                
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
              backgroundColor:"white",
              borderColor:"#bdbdbd",
              borderWidth: scale(1),
              borderRadius: scale(5),
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
              borderColor:"#e0e0e0",
              backgroundColor:"white",
              borderRadius: scale(5),
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

          <View style={{marginTop: scale(15),}}>
            <Checkbox
              label="Send Email ?"
             onChange={(checked) => this.update_CheckBox(checked)} 
             checked={sendEmail}
              labelBefore
            />



            <TouchableOpacity 
           onPress={()=>{this.setState({emailModal:true})}}
            >
            <Text style={{fontSize:scale(12),
                          color:'#1B7BAA',
                          marginLeft:scale(10),
                          textDecorationLine: 'underline',}}>Email Body</Text>
            </TouchableOpacity>


           
             
        
        
          </View>
        </View>
      </View>
      </KeyboardAwareScrollView>
      </CardView> 
    );
  }


  renderModal(){
      const {sub,body}=this.state
      return(
        <Modal
        transparent={true}
        animationType={'slide'}
        visible={this.state.emailModal}
        onRequestClose={() => {
          this.setState({emailModal: false});
        }}>
        <View style={{flex: 1}}>
          <ScrollView
            style={{backgroundColor: 'rgba(0,0,0,0.5)'}}
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: 'center',
              alignItems: 'center',
              padding: scale(5),
            }}
            keyboardShouldPersistTaps="handled">
            <View>
              <View
                style={{
                  backgroundColor: 'white',
                  width: '90%',
                  padding: scale(10),
                  borderRadius: scale(5),
                  alignItems: 'center',
                }}>

<Text style={styles.txt_h}>Subject</Text>
                <View style={styles.userInput}>
                  <TextInput
                    style={styles.input}
                    autoCorrect={false}
                    autoCapitalize={'none'}
                    placeholderTextColor="grey"
                    underlineColorAndroid="transparent"
                    onChangeText={sub => this.setState({sub})}
                    value={this.state.sub}
                  />
                </View>

                <Text style={styles.txt_h}>Body</Text>
                <View style={{
                      height: scale(140),
    backgroundColor: 'white',
    marginBottom: scale(5),
    borderColor: 'grey',
    borderWidth: scale(1),
    width: scale(200),
    borderRadius: scale(5),
                }}>
                  <TextInput
                    style={styles.input}
                    autoCorrect={false}
                    autoCapitalize={'none'}
                    placeholderTextColor="grey"
                    underlineColorAndroid="transparent"
                    onChangeText={body => this.setState({body})}
                    value={this.state.body}
                    multiline={true}
                  />
                </View>

               
                 

                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={{
                      width: scale(100),
                      height: scale(40),
                      padding: scale(10),
                      backgroundColor: '#3D8EE1',
                      borderRadius: scale(8),
                      margin: scale(5),
                    }}
                    onPress={() => {
                   this.setState({emailModal:false})
                    }}>
                    <Text
                      style={{
                        color: '#fff',
                        fontSize: scale(15),
                        textAlign: 'center',
                      }}>
                      {' '}
                      Okay !{' '}
                    </Text>
                  </TouchableOpacity>
          


                </View>
                </View>
                </ScrollView>
                </View>
                </Modal>

      )
  }

  render() {
    return (
     

<View style={{flex: 1,  }}>


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
                          }}>{this.props.edit_id ? "Edit Estimate" : "New Estimate"}</Text>

                </View>

   
    


            <LogoSpinner loading={this.state.loading} />

                {this._renderEmail()}

               {this.renderModal()}

              <View
                style={{
                  marginTop:scale(40),
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
                    alignItems: 'center'
                  }}
            

            onPress={() => { this.saveEstimate()}}
          
            >
                <Text style={{
                    
                    textAlign: 'center',
                    color: '#fff',
                    fontSize: scale(17),
                }}>Save Estimate</Text>
                
            </TouchableOpacity>
              </View>


                <Text style={{color:'grey',marginTop:scale(10),
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

EstimateThreeScreen.defaultProps = {

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
)(EstimateThreeScreen);