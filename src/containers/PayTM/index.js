import React, {PureComponent} from 'react';

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableHighlight,
  Keyboard,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {connect} from 'react-redux';

import {scale} from 'react-native-size-matters';
import {StackActions, CommonActions} from '@react-navigation/native';
import {Images, Config, Color} from '@common';

const msg = Config.SuitCRM;
import ArsolApi from '@services/ArsolApi';
import {LogoSpinner} from '@components';
import Snackbar from 'react-native-snackbar';

import Paytm from '@philly25/react-native-paytm';

class PayTMScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      payment_text:"Requesting payment, please wait...",
      payment_status:false,
      processing:false,

      title_status:"THANK YOU",
      payment_success:false,
      checkout_status:true,
      iconStatus:Image.wrong,
      responseTitle:'',
      statusMessage:''
    };
  } 

  componentDidMount() {

    Paytm.addListener(Paytm.Events.PAYTM_RESPONSE, this.onPayTmResponse);

  }
  componentWillUnmount() {
    Paytm.removeListener(Paytm.Events.PAYTM_RESPONSE, this.onPayTmResponse);
  }

  onPayTmResponse = (resp) => {
    const {STATUS, status, response,RESPMSG} = resp;
    const { paytm_details } = this.props.route.params;
   // console.log("paytm_details",JSON.stringify(paytm_details))
   console.log("paytm",resp)

    if(status=="Cancel"){
      this.setState({
        checkout_status:false,
        payment_status:false,
        processing:false,
        payment_success:true,
        iconStatus:Images.wrong,
        responseTitle:'REGISTRATION BASIC / ADVANCE FAILED',
        statusMessage:"Payment Cancel!",
       
      })
    }else if(status=="Success"){
      if(STATUS=="TXN_FAILURE"){
        this.setState({
            checkout_status:false,
            payment_status:false,
            processing:false,
            payment_success:true,
            iconStatus:Images.wrong,
            responseTitle:'REGISTRATION BASIC / ADVANCE FAILED',
            statusMessage:RESPMSG
          })
      }else if(STATUS=="TXN_SUCCESS"){
           
        this.setState({payment_text: 'Verifying payment status, please wait...',
                       loading:true});

        ArsolApi.checkTransactionStatus_api(paytm_details.ORDER_ID,paytm_details.CUST_ID)
      .then(responseJson => {
        console.log('checkTransactionStatus_api', responseJson);
         this.setState({loading:false})
        if (responseJson.ok) {
          this.setState({
            checkout_status:false,
            payment_status:false,
            processing:false,
            loading:false,
            payment_success:true,
          
          });

          if (responseJson.data != null) {
            if (responseJson.data.hasOwnProperty('status')) {
            
                if (responseJson.data.status == 'success') {
                       this.setState({
                          iconStatus:Images.correct,
                          responseTitle:'THANK YOU',
                         statusMessage: responseJson.data.message
                         })
              
              } else if (responseJson.data.status == 'failed') {
                this.setState({
                  iconStatus:Images.wrong,
                  responseTitle:'REGISTRATION BASIC / ADVANCE FAILED',
                   statusMessage: responseJson.data.message
                 })
                
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
 
    }



   

  };
  
  handlePress() {
    this.props.navigation.goBack()
  }
  checkoutPress(){
    const { paytm_details } = this.props.route.params;
    console.log("payTM",JSON.stringify(paytm_details))

    const {network} = this.props

    if (!network.isConnected) {
      Snackbar.show({
        text: msg.noInternet,
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: "red"
      });
    }else{
      this.setState({
        checkout_status:false,
        payment_status:true,
        processing:true,
        payment_text:"Redirecting to PayTM getway"
       },()=>{
        Paytm.startPayment(paytm_details);
       })

    }
    

  }

  render() {
    const {paytm_details}=this.props.route.params;
    return (
      <View style={styles.container}>
        <View
          style={{
            height: scale(50),
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#F6F6F6',
          }}>
          <TouchableHighlight
            activeOpacity={0.6}
            underlayColor="#DDDDDD"
            onPress={() => {
              this.handlePress();
            }}
            style={{
              height: 30,
              width: scale(30),
              borderRadius: scale(30) / 2,
              justifyContent: 'center',
              alignItems: 'center',
              padding: scale(5),
              margin: scale(5),
            }}>
            <Image
              style={{height: scale(20), width: scale(20)}}
              resizeMode={'contain'}
              source={Images.back}
            />
          </TouchableHighlight>

          <Text
            style={{fontSize: scale(15), width: scale(150), fontWeight: 'bold'}}
            numberOfLines={1}>
            Preparing Order
          </Text>
        </View>

        <LogoSpinner loading={this.state.loading} />

{this.state.payment_status?
  <View style={{alignItems:"center",marginTop:scale(80)}}>
    

  <View style={{alignItems:'center', justifyContent: 'center'}}>
                            <ActivityIndicator
                                animating={this.state.processing}
                                style={{height: 80}}
                                color="black"
                                size="large"/>
                            <Text style={{marginTop: 5, fontSize: 15, fontWeight: 'bold'}}>
                            {this.state.payment_text}</Text>
                        </View>
        </View>
   :null     

}

{
  this.state.payment_success?
  <View style={{alignItems:"center",marginTop:scale(80)}}>
        <Image
              style={{height: scale(20), width: scale(20)}}
              resizeMode={'contain'}
              source={this.state.iconStatus}
            />

          <Text style={{fontSize:scale(20),color:"grey"}}>{this.state.title_status}</Text>
          <Text style={{fontSize:scale(14),color:"grey",marginTop:scale(16)}}>{this.state.statusMessage}</Text>

          <TouchableOpacity style={{backgroundColor:"#ffe01b",
                       marginTop:scale(30),
                        paddingHorizontal:scale(16),
                        paddingVertical:scale(8)}}

                        onPress={() => { 
                this.props.navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              { name: 'Auth' },
            ],
          })
        )
                 }}
                          
                        >
            <Text style={{fontSize:scale(15),fontWeight:"bold"}}>LOGIN</Text>
          </TouchableOpacity>
        </View>:null
}


{this.state.checkout_status?
  <View style={{alignItems:"center",
  
  backgroundColor:"#00A7F6",
  padding:scale(20),
  alignSelf:"center",
  marginTop:scale(100),
  borderRadius:scale(5)
}}>
        <Image
              style={{height: scale(100), width: scale(100)}}
              resizeMode={'contain'}
              source={Images.paytm}
            />

          <Text style={{fontSize:scale(20),color:"#fff",marginTop:scale(10)}}>Registration Fees</Text>
          <Text style={{fontSize:scale(14),color:"#fff",marginTop:scale(16),textAlign:'center'}}>
          Amount ₹{paytm_details.TXN_AMOUNT} {"\n"}
          Mobile {paytm_details.MOBILE_NO}  {"\n"}
          Email {paytm_details.EMAIL} 
          </Text>


          <TouchableOpacity style={{backgroundColor:"#ffe01b",
                       marginTop:scale(30),
                        paddingHorizontal:scale(16),
                        paddingVertical:scale(8)}}
          onPress={()=>{this.checkoutPress()}}              
                        >


            <Text style={{fontSize:scale(15),fontWeight:"bold"}}>CHECKOUT (₹{paytm_details.TXN_AMOUNT})</Text>
          </TouchableOpacity>
        </View>:null
}



       
        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {flex: 1},
});

PayTMScreen.defaultProps = {
  network: '',
};

const mapStateToProps = state => {
  return {
    network: state.network,
  };
};

const mapDispatchToProps = dispatch => {
  const {actions} = require('@redux/UserRedux');

  return {
    login: customers => dispatch(actions.login(customers)),
    logout: () => dispatch(actions.logout()),
  };
};

export default connect(
  mapStateToProps,
  null,
)(PayTMScreen);
