import React, { PureComponent } from "react";

import { View, Text, TextInput, Image, TouchableOpacity,TouchableHighlight } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { connect } from "react-redux";
import { scale } from "react-native-size-matters";
import Snackbar from 'react-native-snackbar';
import {styles,Config, Color, Images} from '@common'; 
const msg = Config.SuitCRM;
import ArsolApi from '@services/ArsolApi';
import { LogoSpinner, NavigationBar } from '@components';
import { CommonActions,StackActions } from '@react-navigation/native';

class ContactThreeScreen extends PureComponent {


  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      remark: ''
    }

  }


  componentDidMount() {
    const { network, edit_id, contact_info } = this.props

    if (!network.isConnected) {
      Snackbar.show({
        text: msg.noInternet,
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: "red"
      });
    } else {

      if (edit_id != '') {
        this.setState({
          remark: contact_info.remark,
         
        })
      }
    }
  }


  savePress(){
    const { network,conData ,user_id,user_type, edit_id} = this.props
    const {remark}=this.state

    if (!network.isConnected) {
      Snackbar.show({
        text: msg.noInternet,
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: "red"
      });
    } else {
      this.setState({ loading: true }, () => {
        ArsolApi.Newcustomer_api(
            user_id,
            user_type,
            edit_id,
            conData.new_contact,
            conData.contact_two,
            remark)
    
        .then(responseJson => {
          console.log('Newcustomer_api', responseJson);
    
          if (responseJson.ok) {
            this.setState({
              loading: false,
       
            });
    
            if (responseJson.data != null) {
              if (responseJson.data.hasOwnProperty('status')) {
              
                  if (responseJson.data.status == 'success') {
                  
    
                     if(responseJson.data.hasOwnProperty("data")){
                           if(responseJson.data.data.length>0){
                            this.props.con_reset()
                            alert(responseJson.data.message)
                            const popAction = StackActions.pop(3);
                            this.props.navigation.dispatch(popAction);

                        

                          //   this.props.navigation.dispatch(
                          //     CommonActions.reset({
                          //     index: 1,
                          //     routes: [
                          //       { name: 'Dashboard' },
                          //       {
                          //         name: 'CustomerDetails',
                          //       },
                          //     ],
                          //   })
                          // );
                         
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

      })
    }
  }


  render() {
const {remark}=this.state
    return (
      <View style={{ justifyContent: "center", flex: 1,backgroundColor: "#fff" }}>


<View
        style={{
          height: scale(50), backgroundColor: "#80d4ff",

          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 9,
          },
          shadowOpacity: 0.48,
          shadowRadius: 11.95,

          elevation: 20,
          borderRadius: scale(15),
          margin: scale(7),
          justifyContent: "center",
          padding: scale(10)

        }}
      >



        <TouchableHighlight
          activeOpacity={1}
          underlayColor={'#ddd'}
          onPress={() => this.props.navigation.goBack()}
          style={{
            width: scale(40), height: scale(40),



            alignItems: "center",
            justifyContent: 'center',
            borderRadius: scale(20)
          }}
        >

          <Image source={Images.backwhite} style={{
            width: scale(30), height: scale(30),


          }} />

        </TouchableHighlight>

        <Text style={{
          position: "absolute",
          alignSelf: "center",
          fontSize: scale(18),
          color: "#fff",
          fontWeight: 'bold'
        }}>{this.props.edit_id ? "Edit Customer" :"New Customer"}</Text>

      </View>


<LogoSpinner loading={this.state.loading} />


        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled">

          <View style={{ margin: scale(15) }}>

            <View>
            <View style={styles.cview6}>
                <Text style={styles.ctxt}>Remarks (For Internal Use)</Text>
              </View>
              <View style={styles.cview8}>

                <TextInput
                 style={styles.ctxtInp2}
                  numberOfLines={1}
                  multiline={true}
                  autoCorrect={false}
                  autoCapitalize={'none'}
                  returnKeyType={'next'}
                  underlineColorAndroid="transparent"
                  onChangeText={remark => this.setState({ remark })}
                  value={remark}
                />

              </View>
            </View>



            <View
              style={styles.cview7}>

              <TouchableOpacity
                onPress={() => { this.savePress() }}
                style={styles.ctouch}
              >
                <Text style={styles.ctxt_log}
                  numberOfLines={1}
                >Save</Text>
              </TouchableOpacity>

            </View>



          </View>

        </KeyboardAwareScrollView>


      </View>
    );
  }
}






ContactThreeScreen.defaultProps = {
  network: '',
  conData:'',
  user_id: '',
  user_type:'',
  contact_info: '',
  edit_id:''
}

const mapStateToProps = (state) => {
  return {
   network: state.network,
   conData:state.conData,
   user_id: state.user.id,
   user_type: state.user.type,
   contact_info: state.conData.contact_info,
   edit_id: state.conData.new_contact.edit_id

  };
};


const mapDispatchToProps = dispatch => {
  const {actions} = require('@redux/NewContactRedux');

  return {
    con_data: conData => dispatch(actions.con_data(conData)),
    con_reset: () => dispatch(actions.con_reset()),
  };
};


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContactThreeScreen);