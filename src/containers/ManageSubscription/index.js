import React, { PureComponent } from "react";

import {
  View,
  Dimensions,
  Text,TouchableHighlight,
  StyleSheet, ImageBackground, TouchableOpacity, Alert, RefreshControl, Image, Modal, ScrollView
} from 'react-native';

import { connect } from "react-redux";
import { Images, Config, Color } from '@common';


import { scale } from "react-native-size-matters";
import { CommonActions } from '@react-navigation/native';


const msg = Config.SuitCRM;
import ArsolApi from '@services/ArsolApi';
import { LogoSpinner } from '@components';
import Snackbar from 'react-native-snackbar';
import Carousel, { Pagination } from 'react-native-snap-carousel';


const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

function wp(percentage) {
  const value = (percentage * viewportWidth) / 100;
  return Math.round(value);
}

const slideWidth = wp(75);
const itemHorizontalMargin = wp(2);

export const sliderWidth = viewportWidth;
export const itemWidth = slideWidth + itemHorizontalMargin * 2;



class ManageSubscriptionScreen extends PureComponent {


  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      activeIndex: 0,
      prompt: false,
      payCancel: false,
      show_list: [],
      refresh:false,
      plan_id:null

    }
  }

  componentDidMount() {
    const { network } = this.props;
    this._subscribe = this.props.navigation.addListener('focus', () => {
      if (!network.isConnected) {
        Snackbar.show({
          text: msg.noInternet,
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: "red"
        });
      } else {
        this.setState({ loading: true,
          activeIndex: 0,
          prompt: false,
          payCancel: false,
          show_list: [],
          refresh: false,
          plan_id: null
        }, () => {
          this.hit_subscription_Api()
        })
      }
    })
    
  }

  componentDidUpdate(prevProps) {
    if (this.props.network.isConnected != prevProps.network.isConnected) {
      if (this.props.network.isConnected) {
        if (this.props.navigation.isFocused()) {
          this.setState({
            loading: true,
            activeIndex: 0,
            prompt: false,
            payCancel: false,
            show_list: [],
            refresh: false,
            plan_id: null
          }, () => {
            this.hit_subscription_Api()
          })
        }
      }
    }
  }


  hit_subscription_Api() {
    const { network, user_id, user_type } = this.props

    if (network.isConnected) {
      ArsolApi.ManageSubscription_api(
        user_id,
        user_type)

        .then(responseJson => {
          console.log('ManageSubscription_api', responseJson);

          if (responseJson.ok) {
            this.setState({
              loading: false,
              refresh:false
            });

            if (responseJson.data != null) {
              if (responseJson.data.hasOwnProperty('status')) {

                if (responseJson.data.status == 'success') {

                  if (responseJson.data.hasOwnProperty('data')) {
                    if (responseJson.data.data.length > 0) {
                      this.setState({
                        show_list: responseJson.data.data
                      })

                    }

                  }



                } else if (responseJson.data.status == 'failed') {

                  alert(responseJson.data.message)

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
                refresh: false

              });
            } else if (responseJson.problem == 'TIMEOUT_ERROR') {
              Snackbar.show({
                text: msg.serTimErr,
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: Color.lgreen
              });
              this.setState({
                loading: false,
                refresh: false

              });
            } else {
              Snackbar.show({
                text: msg.servErr,
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: "red"
              });
              this.setState({
                loading: false,
                refresh: false

              });
            }
          }
        })
        .catch(error => {
          console.error(error);
          this.setState({
            loading: false,
            refresh: false

          });
        });
    } else {
      Snackbar.show({
        text: msg.noInternet,
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: "red"
      });
    }
  }

  btn_subscription(){
    const { network } = this.props;
    if (!network.isConnected) {
      Snackbar.show({
        text: msg.noInternet,
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: "red"
      });
    }else{
      this.setState({
        loading:true
      },()=>{
          this.hit_SubscriptionPlanPaymentApi()
      })
    }
  }

  hit_SubscriptionPlanPaymentApi() {
    const {user_id,user_type} = this.props
    
   ArsolApi.SubscriptionPlanPayment_api(user_id,user_type,this.state.plan_id)

      .then(responseJson => {
        console.log('SubscriptionPlanPayment_api', responseJson);

        if (responseJson.ok) {
          this.setState({
            loading: false,
            plan_id:null
          });

          if (responseJson.data != null) {
            if (responseJson.data.hasOwnProperty('status')) {

              if (responseJson.data.status == 'success') {

                if (responseJson.data.hasOwnProperty('data')) {
                  if (responseJson.data.data.hasOwnProperty('checksum')) {
                    if (responseJson.data.checksum != '') {

                      this.props.navigation.navigate('PayTM', {
                        paytm_details: {
                          mode: 'Staging', // 'Staging' or 'Production'
                          MID: responseJson.data.data.paytmparams.MID,
                          INDUSTRY_TYPE_ID: responseJson.data.data.paytmparams.INDUSTRY_TYPE_ID,
                          WEBSITE: responseJson.data.data.paytmparams.WEBSITE,
                          CHANNEL_ID: responseJson.data.data.paytmparams.CHANNEL_ID,
                          TXN_AMOUNT: responseJson.data.data.paytmparams.TXN_AMOUNT, // String
                          ORDER_ID: responseJson.data.data.paytmparams.ORDER_ID, // String
                          EMAIL: responseJson.data.data.paytmparams.EMAIL, // String
                          MOBILE_NO: responseJson.data.data.paytmparams.MOBILE_NO, // String
                          CUST_ID: responseJson.data.data.paytmparams.CUST_ID, // String
                          CHECKSUMHASH: responseJson.data.data.checksum, //From your server using PayTM Checksum Utility 
                          CALLBACK_URL: responseJson.data.data.paytmparams.CALLBACK_URL,
                        }
                      })



                      
                    }
                  } else {
                    alert(responseJson.data.message)

                    this.props.navigation.dispatch(
                      CommonActions.reset({
                        index: 0,
                        routes: [
                          { name: 'Auth' },
                        ],
                      })
                    )

                  }
                }




              } else if (responseJson.data.status == 'failed') {
                alert(responseJson.data.message)

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
              plan_id: null
            });
          } else if (responseJson.problem == 'TIMEOUT_ERROR') {
            Snackbar.show({
              text: msg.serTimErr,
              duration: Snackbar.LENGTH_SHORT,
              backgroundColor: Color.lgreen
            });
            this.setState({
              loading: false,
              plan_id: null
            });
          } else {
            Snackbar.show({
              text: msg.servErr,
              duration: Snackbar.LENGTH_SHORT,
              backgroundColor: "red"
            });
            this.setState({
              loading: false,
              plan_id: null
            });
          }
        }
      })
      .catch(error => {
        console.error(error);
        this.setState({
          loading: false,
          plan_id: null
        });
      });
  }

 hexToRGB(h) {
  let r = 0, g = 0, b = 0, c = 0.3;


    r = "0x" + h[1] + h[2];
    g = "0x" + h[3] + h[4];
    b = "0x" + h[5] + h[6];
  

   return "rgba(" + +r + "," + +g + "," + +b + ","+ +c+")";
  }

  _renderItem = ({ item, index }) => {
    return (
      <View style={{
        backgroundColor: item.bg,
        height: '80%',
     
        marginHorizontal: scale(5),
        marginTop: scale(20)
      }}>
        <View style={{
          height: "20%",
          alignItems: 'center',
          justifyContent: "center"
        }}>
          <Text style={{
            color: "#fff",
            fontWeight: "bold",
            fontSize: scale(18),
            textAlign: 'center'

          }}
            numberOfLines={2}
          >{item.title}</Text>

          <Text style={{
            color: "#fff",
            fontWeight: "bold",
            fontSize: scale(18),


          }}
            numberOfLines={1}
          >Rs. {item.rs}</Text>
          <Text style={{
            color: "#fff",
            fontSize: scale(15),


          }}
            numberOfLines={1}
          >Per organization/Year</Text>
        </View>


        <View style={{
          backgroundColor: "#fff", height: "79.5%",
          alignItems: 'center',
          margin: scale(1),
          padding: scale(5),

        }}>

          <Text style={{
            marginVertical: scale(5),
            color: "#000",
            fontSize: scale(15),
            textAlign: "center"
          }}
            numberOfLines={2}
          >Unlimited Invoice upto {item.customer} Customers</Text>
          <Text style={{
            marginVertical: scale(5),
            color: "#000",
            fontSize: scale(15),
          }}
            numberOfLines={1}
          > {item.user} User</Text>
          <Text style={{
            color: "#000",
            fontSize: scale(15),
            textAlign: "center"
          }}
            numberOfLines={2}
          >Unlimited Receipt entry upto {item.customer} Customers</Text>

          <Text style={{
            marginVertical: scale(5),
            color: "#000",
            fontSize: scale(15),
          }}
            numberOfLines={1}
          >Customer Support</Text>

          <Text style={{
            marginVertical: scale(5),
            color: "#000",
            fontSize: scale(15),
          }}
            numberOfLines={1}
          >Free Updates</Text>

          <Text style={{
            marginVertical: scale(5),
            color: "#000",
            fontSize: scale(15),
          }}
            numberOfLines={1}
          >GST Reports</Text>

          <Text style={{
            marginVertical: scale(5),
            color: "#000",
            fontSize: scale(15),
          }}
            numberOfLines={1}
          >AR Reports</Text>

          <TouchableOpacity

            style={{
              justifyContent: "center",
              alignItems: 'center',
              padding: scale(10),
              backgroundColor: !item.btn_visibilty ? this.hexToRGB(item.bg) : item.bg,
              marginTop: scale(20),
              borderRadius: scale(3),
              
            }}
            disabled={!item.btn_visibilty}
            onPress={() => {
              this.setState({ prompt: true, plan_id: item.plan_id })
            }}>
            <Text style={{
              color: "#fff",
              fontSize: scale(15),
            }}
              numberOfLines={1}
            >
            {item.plan_id == 1 ?"Default" : 
                item.plan_id == 2 ?"Current Plan" : 
                  item.plan_id == 3 ? "Upgrade Now":
                    item.plan_id == 4 ? "Excusive":""}</Text>
          </TouchableOpacity>

        </View>



      </View>

    )
  }

  subscribeFunction() {
    return (
      <Modal
        transparent={true}
        animationType={'slide'}
        visible={this.state.prompt}
        onRequestClose={() => {
          this.setState({ prompt: false });
        }}>
        <View style={{ flex: 1 }}>

          <ScrollView style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: 'center',
              alignItems: "center",
              padding: scale(5)
            }}
            keyboardShouldPersistTaps="handled"


          >

            <View style={{
              backgroundColor: 'white',
              width: '80%',
              padding: scale(10),
              borderRadius: scale(5),
              alignItems: 'center', justifyContent: 'center'
            }}>
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Image source={Images.alert} style={{ width: scale(50), height: scale(50) }} />
                <Text style={{ marginTop: scale(15), fontWeight: 'bold', fontSize: scale(20) }}>Are you sure ?</Text>
                <Text style={{ marginTop: scale(5), fontSize: scale(12) }}>You will be redirected to payment page</Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: scale(20)
                }}>
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
                    this.setState({
                      prompt: false,
                      payCancel: true,
                      plan_id:null

                    });
                  }}>
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: scale(15),
                      textAlign: 'center',
                    }}>
                    No
                    </Text>
                </TouchableOpacity>

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
                    this.setState({
                      prompt: false,
                     },()=>{
                        this.btn_subscription()
                     });
                  }}
                  >
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: scale(15),
                      textAlign: 'center',
                    }}>
                    {' '}
                      Yes{' '}
                  </Text>
                </TouchableOpacity>
              </View>


            </View>


          </ScrollView>
        </View>

      </Modal>
    );
  }


  paymentCancel() {
    return (
      <Modal
        transparent={true}
        animationType={'slide'}
        visible={this.state.payCancel}
        onRequestClose={() => {
          this.setState({ payCancel: false });
        }}>
        <View style={{ flex: 1 }}>

          <ScrollView style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: 'center',
              alignItems: "center",
              padding: scale(5)
            }}
            keyboardShouldPersistTaps="handled"
          >

            <View style={{
              backgroundColor: 'white',
              width: '80%',
              padding: scale(10),
              borderRadius: scale(5),
              alignItems: 'center', justifyContent: 'center'
            }}>
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Image source={Images.block} style={{ width: scale(50), height: scale(50) }} />
                <Text style={{ marginTop: scale(15), fontWeight: 'bold', fontSize: scale(20) }}>Aborted</Text>
                <Text style={{ marginTop: scale(5), fontSize: scale(12) }}>Your Request is aborted</Text>

                <TouchableOpacity
                  activeOpacity={0.7}
                  style={{
                    marginTop: scale(15),
                    width: scale(100),
                    height: scale(40),
                    padding: scale(10),
                    backgroundColor: '#3D8EE1',
                    borderRadius: scale(8),
                    margin: scale(5),
                  }}
                  onPress={() => {
                    this.setState({
                      payCancel: false,

                    });
                  }}>
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: scale(15),
                      textAlign: 'center',
                    }}>
                    Ok
                    </Text>
                </TouchableOpacity>

              </View>


            </View>


          </ScrollView>
        </View>

      </Modal>
    );
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
        >Manage Subscription</Text>

      </View>
    )
  }

 

  onRefresh() {
    const { network} = this.props;
    if (!network.isConnected) {
      Snackbar.show({
        text: msg.noInternet,
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: "red"
      });
    } else {
      this.setState(
        {
          refresh: true,
         show_list:[]
        },
        () => {
          this.hit_subscription_Api()
        
        },
      );
    }

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


      <ScrollView style={{ flex: 1,}}
        contentInsetAdjustmentBehavior="automatic"
        refreshControl={
          <RefreshControl
            onRefresh={() => this.onRefresh()}
            refreshing={this.state.refresh}
          />
        }
      >
     
        <LogoSpinner loading={this.state.loading} />

        <View style={{ height: viewportHeight }}>
          <Carousel
            ref={c => this._slider1Ref = c}
            layout={"default"}
            ref={ref => this.carousel = ref}
            data={this.state.show_list}
            sliderWidth={sliderWidth}
            itemWidth={itemWidth}
            renderItem={this._renderItem}
            onSnapToItem={activeIndex => this.setState({ activeIndex })}
            inactiveSlideScale={0.94}
            inactiveSlideOpacity={0.7}

          />

        
        </View>    


    
         

          {this.subscribeFunction()}
          {this.paymentCancel()}
        

      </ScrollView>
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

  txt: { fontSize: scale(15), width: scale(150), },
  txth: { fontSize: scale(15), fontWeight: 'bold' },

  paginationContainer: {
    paddingVertical: scale(8),

  },
  paginationDot: {
    width: scale(8),
    height: scale(8),
    borderRadius: scale(4),
    marginHorizontal: scale(8)
  }

});



ManageSubscriptionScreen.defaultProps = {
  user_id: '',
  user_type: ''
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
)(ManageSubscriptionScreen);




