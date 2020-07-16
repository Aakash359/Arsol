import React, { PureComponent } from "react";

import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Image,
  TouchableHighlight,
  Dimensions,
  ImageBackground
} from 'react-native';

import { NavigationBar } from '@components';
import { connect } from "react-redux";
import { Config, Color, Images } from '@common';
import { scale } from "react-native-size-matters";
import Snackbar from 'react-native-snackbar';
import { LogoSpinner } from '@components';
import ArsolApi from '@services/ArsolApi';
import { TouchableOpacity } from "react-native-gesture-handler";
const msg = Config.SuitCRM;


class CustomerScreen extends PureComponent {


  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      primary_contact: '',
      fname: '',
      lname: '',
      company_name: '',
      display_name: '',
      contact_email: '',
      gst_no: '',
      phone: '',
      mobile: '',
      website: '',
      currency: '',
      pay_term: '',
      lang: '',
      fb: '',
      twitter: '',
      country: '',
      address: '',
      city: '',
      state: '',
      zipcode: '',
      phone_add: '',
      fax: '',
      sp_country: '',
      sp_address: '',
      sp_city: '',
      sp_state: '',
      sp_zipcode: '',
      sp_phone_add: '',
      sp_fax: '',
      remark: '',
      cust_id: '',


      personal_info: true,
      other_details : false,
      billing : false,
      shipping : false,
      remarks : false,
    };

  }


  componentDidMount() {
    const { network, Cust_id } = this.props;
    //alert(Cust_id);

    if (!network.isConnected) {
      Snackbar.show({
        text: msg.noInternet,
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: "red"
      });
    } else {

      if (Cust_id != 'NO-ID') {
        this.setState({ cust_id: Cust_id, loading: true,
          primary_contact: '',
          fname: '',
          lname: '',
          company_name: '',
          display_name: '',
          contact_email: '',
          gst_no: '',
          phone: '',
          mobile: '',
          website: '',
          currency: '',
          pay_term: '',
          lang: '',
          fb: '',
          twitter: '',
          country: '',
          address: '',
          city: '',
          state: '',
          zipcode: '',
          phone_add: '',
          fax: '',
          sp_country: '',
          sp_address: '',
          sp_city: '',
          sp_state: '',
          sp_zipcode: '',
          sp_phone_add: '',
          sp_fax: '',
          remark: '',
          personal_info: true,
          other_details: false,
          billing: false,
          shipping: false,
          remarks: false,
        
        
        
        
        }, () => {
          this.hit_Customer_info(Cust_id);
        });
      }
    }

  }

  componentDidUpdate(prevProps) {
    const { network, Cust_id } = this.props;
    if (this.props.network.isConnected != prevProps.network.isConnected) {
      if (this.props.network.isConnected) {
        if (this.props.navigation.isFocused()) {
          if (Cust_id != 'NO-ID') {
            this.setState({
              cust_id: Cust_id, loading: true,
              primary_contact: '',
              fname: '',
              lname: '',
              company_name: '',
              display_name: '',
              contact_email: '',
              gst_no: '',
              phone: '',
              mobile: '',
              website: '',
              currency: '',
              pay_term: '',
              lang: '',
              fb: '',
              twitter: '',
              country: '',
              address: '',
              city: '',
              state: '',
              zipcode: '',
              phone_add: '',
              fax: '',
              sp_country: '',
              sp_address: '',
              sp_city: '',
              sp_state: '',
              sp_zipcode: '',
              sp_phone_add: '',
              sp_fax: '',
              remark: '',
              personal_info: true,
              other_details: false,
              billing: false,
              shipping: false,
              remarks: false,




            }, () => {
              this.hit_Customer_info(Cust_id);
            });
          }
        }
      }
    }
  }
  
  _infoFunction = () => {
    this.setState(state => ({
      personal_info: !state.personal_info,
   
      other_details: false,
      billing: false,
      shipping: false,
      remarks: false,
    }));
  };

  _otherFunction = () => {
    this.setState(state => ({
      other_details: !state.other_details,
      personal_info: false,
   
      billing: false,
      shipping: false,
      remarks: false,
    }));
  };

  _billingFunction = () => {
    this.setState(state => ({
      billing: !state.billing,
      personal_info: false,
      other_details: false,
 
      shipping: false,
      remarks: false,
    }));
  };

  _shippingFunction = () => {
    this.setState(state => ({
      shipping: !state.shipping,
      personal_info: false,
      other_details: false,
      billing: false,

      remarks: false,
    }));
  };

  _remarksFunction = () => {
    this.setState(state => ({
      remarks: !state.remarks,
      personal_info: false,
      other_details: false,
      billing: false,
      shipping: false,
    
    }));
  };



  hit_Customer_info(customer_id) {
    const { user_id, user_type } = this.props;
    ArsolApi.CustomerInfo_api(user_id, user_type, customer_id)

      .then(responseJson => {
        console.log('CustomerInfo_api', responseJson);

        if (responseJson.ok) {
          this.setState({
            loading: false,
          });

          if (responseJson.data != null) {
            if (responseJson.data.hasOwnProperty('status')) {
              if (responseJson.data.status == 'success') {
                if (responseJson.data.hasOwnProperty('message')) {
                  if (responseJson.data.hasOwnProperty('data')) {
                    if (responseJson.data.data.length > 0) {

                      this.setState({

                        fname: responseJson.data.data[0].fname,
                        lname: responseJson.data.data[0].lname,
                        company_name: responseJson.data.data[0].company_name,
                        display_name: responseJson.data.data[0].display_name,
                        contact_email: responseJson.data.data[0].contact_email,
                        gst_no: responseJson.data.data[0].gst_no,
                        phone: responseJson.data.data[0].phone,
                        mobile: responseJson.data.data[0].mobile,
                        website: responseJson.data.data[0].website,
                        currency: responseJson.data.data[0].currency,
                        pay_term: responseJson.data.data[0].pay_term,
                        lang: responseJson.data.data[0].lang,
                        fb: responseJson.data.data[0].fb,
                        twitter: responseJson.data.data[0].twitter,
                        country: responseJson.data.data[0].country,
                        address: responseJson.data.data[0].address,
                        city: responseJson.data.data[0].city,
                        state: responseJson.data.data[0].state,
                        zipcode: responseJson.data.data[0].zipcode,
                        phone_add: responseJson.data.data[0].phone_add,
                        fax: responseJson.data.data[0].fax,
                        sp_country: responseJson.data.data[0].sp_country,
                        sp_address: responseJson.data.data[0].sp_address,
                        sp_city: responseJson.data.data[0].sp_city,
                        sp_state: responseJson.data.data[0].sp_state,
                        sp_zipcode: responseJson.data.data[0].sp_zipcode,
                        sp_phone_add: responseJson.data.data[0].sp_phone_add,
                        sp_fax: responseJson.data.data[0].sp_fax,
                        remark: responseJson.data.data[0].remark,

                      });
                    }
                  }
                }
              } else if (responseJson.data.status == 'failed') {
                if (responseJson.data.hasOwnProperty('message')) {
                  alert(responseJson.data.message);
                }
              } else {
                Snackbar.show({
                  text: msg.servErr,
                  duration: Snackbar.LENGTH_SHORT,
                  backgroundColor: 'red',
                });
              }
            } else {
              Snackbar.show({
                text: msg.servErr,
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: 'red',
              });
            }
          } else {
            Snackbar.show({
              text: msg.servErr,
              duration: Snackbar.LENGTH_SHORT,
              backgroundColor: 'red',
            });
          }
        } else {
          if (responseJson.problem == 'NETWORK_ERROR') {
            Snackbar.show({
              text: msg.netError,
              duration: Snackbar.LENGTH_SHORT,
              backgroundColor: Color.lgreen,
            });
            this.setState({
              loading: false,
            });
          } else if (responseJson.problem == 'TIMEOUT_ERROR') {
            Snackbar.show({
              text: msg.serTimErr,
              duration: Snackbar.LENGTH_SHORT,
              backgroundColor: Color.lgreen,
            });
            this.setState({
              loading: false,
            });
          } else {
            Snackbar.show({
              text: msg.servErr,
              duration: Snackbar.LENGTH_SHORT,
              backgroundColor: 'red',
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
          width: scale(150),
          alignSelf: 'center'
        }}
      >
        <Text style={{
          fontSize: scale(18),
          color: '#000',

        }}
          numberOfLines={1}
        >Item Details</Text>

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

        <ScrollView>

          <View style={{ margin: scale(10) }}>
            
              <View style={styles.btnView}>

              <View style={{ flexDirection: "row",
               justifyContent:'space-between',
               }}>
                <Text style={styles.btnText}
                    numberOfLines={1}
                >PERSONAL INFO</Text>
                <TouchableOpacity onPress={() => this._infoFunction()}>
                    <Image source={this.state.personal_info ? Images.downarrow:Images.next}
                    style={{
                      width: scale(30),
                      height: scale(30),
                    }} />
                </TouchableOpacity>

              </View>

            </View>

            {this.state.personal_info ?

              <View>

                <View style={{ marginTop: scale(15), flexDirection: 'row' }}>
                  <Text style={styles.ctxt}
                      numberOfLines={1}>Primary Contact :</Text>
                  <Text style={styles.txt}
                      numberOfLines={2}>{this.state.primary_contact} {this.state.fname} {this.state.lname}</Text>
                </View>

                <View style={{ marginTop: scale(5), flexDirection: 'row' }}>
                  <Text style={styles.ctxt}
                      numberOfLines={1}
                  >Company Name :</Text>
                  <Text style={styles.txt}
                      numberOfLines={2}> {this.state.company_name}</Text>
                </View>

                <View style={{ marginTop: scale(5), flexDirection: 'row' }}>
                  <Text style={styles.ctxt}
                      numberOfLines={1}>Display Name :</Text>
                  <Text style={styles.txt}
                      numberOfLines={2}> {this.state.display_name}</Text>
                </View>

                <View style={{ marginTop: scale(5), flexDirection: 'row' }}>
                  <Text style={styles.ctxt}
                      numberOfLines={1}>Contact Email :</Text>
                  <Text style={styles.txt}
                      numberOfLines={2}> {this.state.contact_email}</Text>
                </View>

                <View style={{ marginTop: scale(5), flexDirection: 'row' }}>
                  <Text style={styles.ctxt}
                      numberOfLines={1}>GST Number :</Text>
                  <Text style={styles.txt}
                      numberOfLines={2}> {this.state.gst_no}</Text>
                </View>

                <View style={{ marginTop: scale(5), flexDirection: 'row' }}>
                  <Text style={styles.ctxt}
                      numberOfLines={1}>Contact Phone :</Text>
                  <Text style={styles.txt}
                      numberOfLines={2}> {this.state.phone}  {this.state.mobile}</Text>
                </View>

                <View style={{ marginTop: scale(5), flexDirection: 'row' }}>
                  <Text style={styles.ctxt}
                      numberOfLines={1}
                  >Website : </Text>
                  <Text style={styles.txt}
                      numberOfLines={2}> {this.state.website}</Text>
                </View>

              </View>
              : null
            }

              <View style={styles.btnView}>

              <View style={{ flexDirection: "row", 
              justifyContent:'space-between',  }}>
                  <Text style={styles.btnText}
                    numberOfLines={1}>OTHER DETAILS</Text>
                <TouchableOpacity onPress={() => this._otherFunction()}>
                    <Image source={this.state.other_details ? Images.downarrow : Images.next}
                    style={{
                     
                      width: scale(30),
                      height: scale(30),
                      
                    }} />
                </TouchableOpacity>

              </View>
            </View>

            {this.state.other_details ?

              <View style={{width:scale(300) }}>

                <View style={{ marginTop: scale(5), flexDirection: 'row' }}>
                  <Text style={styles.ctxt}
                      numberOfLines={1}>Currency : </Text>
                  <Text style={styles.txt}
                      numberOfLines={2}> {this.state.currency}</Text>
                </View>

                <View style={{ marginTop: scale(5), flexDirection: 'row' }}>
                  <Text style={styles.ctxt}
                      numberOfLines={1}>Payment Terms : </Text>
                  <Text style={styles.txt}
                      numberOfLines={2}> {this.state.pay_term}</Text>
                </View>

                <View style={{ marginTop: scale(5), flexDirection: 'row' }}>
                  <Text style={styles.ctxt}
                      numberOfLines={1}>Language : </Text>
                  <Text style={styles.txt}
                      numberOfLines={2}> {this.state.lang}</Text>
                </View>

                <View style={{ marginTop: scale(5), flexDirection: 'row' }}>
                  <Text style={styles.ctxt}
                      numberOfLines={1}>Facebook : </Text>
                  <Text style={styles.txt}
                      numberOfLines={2}> {this.state.fb}</Text>
                </View>

                <View style={{ marginTop: scale(5), flexDirection: 'row' }}>
                  <Text style={styles.ctxt}
                      numberOfLines={1}>Twitter : </Text>
                  <Text style={styles.txt}
                      numberOfLines={2}> {this.state.twitter}</Text>
                </View>

              </View>
              : null
            }

              <View style={styles.btnView}>

                <View style={{
                  flexDirection: "row",
                  justifyContent: 'space-between',
                }}>
                  <Text style={styles.btnText}
                    numberOfLines={1}>BILLING ADDRESS</Text>
                <TouchableOpacity onPress={() => this._billingFunction()}>
                    <Image source={this.state.billing ? Images.downarrow : Images.next}
                    style={{
                      
                      width: scale(30),
                      height: scale(30),
                      
                    }} />
                </TouchableOpacity>

              </View>
            </View>

            {this.state.billing ?

              <View style={{width:scale(300) }}>

                <View style={{ marginTop: scale(5), flexDirection: 'row' }}>
                  <Text style={styles.ctxt}
                      numberOfLines={1}>Country : </Text>
                  <Text style={styles.txt}
                      numberOfLines={2}> {this.state.country}</Text>
                </View>

                <View style={{ marginTop: scale(5), flexDirection: 'row' }}>
                  <Text style={styles.ctxt}
                      numberOfLines={1}>Address : </Text>
                  <Text style={styles.txt}
                      numberOfLines={2}> {this.state.address}</Text>
                </View>

                <View style={{ marginTop: scale(5), flexDirection: 'row' }}>
                  <Text style={styles.ctxt}
                      numberOfLines={1}>City : </Text>
                  <Text style={styles.txt}
                      numberOfLines={2}> {this.state.city}</Text>
                </View>

                <View style={{ marginTop: scale(5), flexDirection: 'row' }}>
                  <Text style={styles.ctxt}
                      numberOfLines={1}>State : </Text>
                  <Text style={styles.txt}
                      numberOfLines={2}> {this.state.state}</Text>
                </View>

                <View style={{ marginTop: scale(5), flexDirection: 'row' }}>
                  <Text style={styles.ctxt}
                      numberOfLines={1}>Zipcode : </Text>
                  <Text style={styles.txt}
                      numberOfLines={2}> {this.state.zipcode}</Text>
                </View>

                <View style={{ marginTop: scale(5), flexDirection: 'row' }}>
                  <Text style={styles.ctxt}
                      numberOfLines={1}>Phone : </Text>
                  <Text style={styles.txt}
                      numberOfLines={1}> {this.state.phone_add}</Text>
                </View>

                <View style={{ marginTop: scale(5), flexDirection: 'row' }}>
                  <Text style={styles.ctxt}
                      numberOfLines={1}>Fax : </Text>
                  <Text style={styles.txt}
                      numberOfLines={2}> {this.state.fax}</Text>
                </View>

              </View>
              : null
            }


              <View style={styles.btnView}>

                <View style={{
                  flexDirection: "row",
                  justifyContent: 'space-between',
                }}>
                  <Text style={styles.btnText}
                    numberOfLines={1}>SHIPPING ADDRESS</Text>
                <TouchableOpacity onPress={() => this._shippingFunction()}>
                    <Image source={this.state.shipping ? Images.downarrow : Images.next}
                    style={{
                      
                      width: scale(30),
                      height: scale(30),
                    
                    }} />
                </TouchableOpacity>

              </View>

            </View>

            {this.state.shipping ?

              <View style={{width:scale(300) }}>

                <View style={{ marginTop: scale(5), flexDirection: 'row' }}>
                  <Text style={styles.ctxt}
                  numberOfLines={1}>Country : </Text>
                  <Text style={styles.txt}>
                      numberOfLines={2} {this.state.sp_country}</Text>
                </View>

                <View style={{ marginTop: scale(5), flexDirection: 'row' }}>
                  <Text style={styles.ctxt}
                      numberOfLines={1}>Address : </Text>
                  <Text style={styles.txt}
                      numberOfLines={2}> {this.state.sp_address}</Text>
                </View>

                <View style={{ marginTop: scale(5), flexDirection: 'row' }}>
                  <Text style={styles.ctxt}>City : </Text>
                  <Text style={styles.txt}> {this.state.sp_city}</Text>
                </View>

                <View style={{ marginTop: scale(5), flexDirection: 'row' }}>
                  <Text style={styles.ctxt}
                      numberOfLines={1}>State : </Text>
                  <Text style={styles.txt}
                      numberOfLines={2}> {this.state.sp_state}</Text>
                </View>

                <View style={{ marginTop: scale(5), flexDirection: 'row' }}>
                  <Text style={styles.ctxt}
                      numberOfLines={1}>Zipcode : </Text>
                  <Text style={styles.txt}
                      numberOfLines={2}> {this.state.sp_zipcode}</Text>
                </View>

                <View style={{ marginTop: scale(5), flexDirection: 'row' }}>
                  <Text style={styles.ctxt}
                      numberOfLines={1}>Phone : </Text>
                  <Text style={styles.txt}
                      numberOfLines={2}> {this.state.sp_phone_add}</Text>
                </View>

                <View style={{ marginTop: scale(5), flexDirection: 'row' }}>
                  <Text style={styles.ctxt}
                      numberOfLines={1}>Fax : </Text>
                  <Text style={styles.txt}
                      numberOfLines={2}> {this.state.sp_fax}</Text>
                </View>

              </View>
              : null
            }

              <View style={styles.btnView}>

                <View style={{
                  flexDirection: "row",
                  justifyContent: 'space-between',
                }}>
                  <Text style={styles.btnText}
                    numberOfLines={1}>REMARKS</Text>
                <TouchableOpacity onPress={() => this._remarksFunction()}>
                    <Image source={this.state.remarks ? Images.downarrow : Images.next}
                    style={{
                     
                      width: scale(30),
                      height: scale(30),
                    
                    }} />
                </TouchableOpacity>

              </View>
            </View>

            {this.state.remarks ?

              <View style={{width:scale(300) }}>

                <View style={{ marginTop: scale(5), marginBottom: scale(80), flexDirection: 'row', width: '80%' }}>
                  <Text style={styles.ctxt}
                      numberOfLines={1}>Remarks : </Text>
                  <Text style={styles.txt}
                      numberOfLines={2}> {this.state.remark}</Text>
                </View>

              </View>
              : null
            }





          </View>


        </ScrollView>



    </ImageBackground>
    </View>
    );
  }
}


const styles = StyleSheet.create({
  ctxt: {
    fontSize: scale(12),
    fontWeight: 'bold',
    width:scale(100)
   
  },

  txt: {
    fontSize: scale(12),
    width: scale(200)

  },
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

  btnView:{
    height: scale(50),
    justifyContent: 'center',
    borderColor: Color.headerTintColor,
    borderWidth: scale(2),
    borderRadius: scale(5),
    backgroundColor: "#fff",
    padding: scale(5),
    marginVertical:scale(10)
  },
  btnText: {
    textAlign: 'center',
    width: scale(200),
    fontSize: scale(15),
    textAlignVertical: 'center'}
});




CustomerScreen.defaultProps = {
  user_id: '',
  user_type: ''
}


const mapStateToProps = (state) => {
  return {
    user_id: state.user.id,
    user_type: state.user.type,
    session: state.user.session_id,
    network: state.network,

  };
};


export default connect(
  mapStateToProps,
  null
)(CustomerScreen);