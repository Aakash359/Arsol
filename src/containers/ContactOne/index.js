import React, {PureComponent} from 'react';

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  TouchableHighlight
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {connect} from 'react-redux';
import {Config, Color, styles, Images} from '@common';


import CardView from 'react-native-cardview';
import {scale} from 'react-native-size-matters';
import {StackActions} from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import Snackbar from 'react-native-snackbar';
const msg = Config.SuitCRM;
import ArsolApi from '@services/ArsolApi';
import {LogoSpinner, NavigationBar} from '@components';
import {validate_email, gest_no, phone_no} from '../../Omni';

class ContactOneScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,

      lang_list: [],
      currency_list: [],

      primary_contact: 'Mr.',
      fname: '',
      lname: '',
      company_name: '',
      display_name: '',
      contact_email: '',
      gst_no: '',
      phone: '',
      mobile: '',
      website: '',
      currency: '47',
      pay_term: '',
      language: '1',
      facebook: '',
      twitter: '',

      edit_id: '',
    };
  }

  componentDidMount() {
    const {network, Edit_Id} = this.props;
    this.props.con_reset();

    if (!network.isConnected) {
      Snackbar.show({
        text: msg.noInternet,
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: 'red',
      });
    } else {
      if (Edit_Id != 'NO-ID') {
        this.setState({edit_id: Edit_Id, loading: true}, () => {
          this.hit_Customer_info(Edit_Id);
        });
      }

      this.setState({loading: true}, () => {
        this.hit_Currency_list();
        this.hit_Language_list();
      });
    }
  }

  hit_Customer_info(edit_id) {
    const {user_id, user_type} = this.props;
    ArsolApi.CustomerInfo_api(user_id, user_type, edit_id)

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
                      this.props.con_info(responseJson.data.data[0]);

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
                        pay_term: responseJson.data.data[0].pay_term,
                        facebook: responseJson.data.data[0].fb,
                        twitter: responseJson.data.data[0].twitter,
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

  hit_Currency_list() {
    const {network} = this.props;
    ArsolApi.Currency_api()

      .then(responseJson => {
        console.log('Currency_dropdown', responseJson);

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
                        currency_list: responseJson.data.data,
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
  hit_Language_list() {
    const {network} = this.props;
    ArsolApi.LanguageList_api()

      .then(responseJson => {
        console.log('LanguageList_api', responseJson);

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
                        lang_list: responseJson.data.data,
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

  nextPress() {
    const {
      primary_contact,
      fname,
      lname,
      company_name,
      display_name,
      contact_email,
      gst_no,
      phone,
      mobile,
      website,
      currency,
      pay_term,
      language,
      facebook,
      twitter,
      edit_id,
    } = this.state;
    const {network} = this.props;

    if (primary_contact.trim() == '') {
      Snackbar.show({
        text: 'Select Salutation',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: Color.lgreen,
      });
    } else if (fname.trim() == '') {
      Snackbar.show({
        text: 'Enter First Name',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: Color.lgreen,
      });
    } else if (lname.trim() == '') {
      Snackbar.show({
        text: 'Enter Last Name',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: Color.lgreen,
      });
    } else if (company_name.trim() == '') {
      Snackbar.show({
        text: 'Enter Company Name',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: Color.lgreen,
      });
    } else if (display_name.trim() == '') {
      Snackbar.show({
        text: 'Enter Display Name',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: Color.lgreen,
      });
    } else if (
      contact_email.trim() != '' &&
      validate_email(contact_email) === false
    ) {
      Snackbar.show({
        text: 'Email Invalid',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: Color.lgreen,
      });
    } else if (gst_no != '' && gest_no(gst_no) === false) {
      Snackbar.show({
        text: 'Gst No. Invalid',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: Color.lgreen,
      });
    } else if (phone != '' && phone_no(phone) === false) {
      Snackbar.show({
        text: 'Phone No. Invalid',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: Color.lgreen,
      });
    } else if (mobile != '' && phone_no(mobile) === false) {
      Snackbar.show({
        text: 'Mobile No. Invalid',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: Color.lgreen,
      });
    } else if (!network.isConnected) {
      Snackbar.show({
        text: msg.noInternet,
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: 'red',
      });
    } else {
      details = {
        edit_id: edit_id,
        primary_contact: primary_contact,
        fname: fname,
        lname: lname,
        company_name: company_name,
        display_name: display_name,
        contact_email: contact_email,
        gst_no: gst_no,
        phone: phone,
        mobile: mobile,
        website: website,
        currency: currency,
        pay_term: pay_term,
        language: language,
        facebook: facebook,
        twitter: twitter,
      };

      this.props.con_data(details);
      this.props.navigation.navigate('ContactTwo');
    }
  }

  render() {
    const {
      primary_contact,
      fname,
      lname,
      company_name,
      display_name,
      contact_email,
      gst_no,
      phone,
      mobile,
      website,
      currency,
      pay_term,
      language,
      facebook,
      twitter,
    } = this.state;

    return (
      <View style={{  flex: 1,
           }}>

     

           <TouchableHighlight
              activeOpacity={1}
              underlayColor={'#ddd'}
              onPress={() => this.props.navigation.toggleDrawer()}
              style={{
                width: scale(50), 
                 width: scale(40), 
                height: scale(40),
                alignItems: "center",
                justifyContent: 'center',
                borderRadius: scale(20)
              }}
            >

                   <View style={{height:scale(40),width:scale(40),backgroundColor:'#ff8f00'}}>
                        <Image source={Images.menu} style={{
                        width: scale(30), height: scale(30),alignSelf:"center",marginTop:scale(5)


                        }} />
             </View>

          </TouchableHighlight>

        <View style={{marginLeft:scale(80),
                  width:scale(190),height:scale(40),borderRadius:scale(4), backgroundColor:'#aeea00'}}>
              <Text style={{
                marginTop:scale(7),
                position: "absolute",
                alignSelf: "center",
                fontSize: scale(18),
                color: "black",
                fontWeight: 'bold'
              }}>{this.state.edit_id ? "Edit Customer" :"New Customer"}</Text>

              </View>
<CardView
          height={505}
          width={330}
          style={{backgroundColor:'#eceff1'}}
          cardElevation={2}
          cardMaxElevation={2}
          cornerRadius={20}
          marginTop={10}
          marginLeft={15}>

        <LogoSpinner loading={this.state.loading} />

        <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
          <View style={{margin: scale(15)}}>
            <View>
              <View style={styles.cview2}>
                <Text style={styles.ctxt}>Primary Contact</Text>
                <Text style={styles.star}>*</Text>
              </View>
              <View>
                <View style={styles.cview3}>
                  <View style={styles.cview4}>
                    <RNPickerSelect
                      placeholder={{
                        label: 'Salutation',
                        value: '',
                        color: 'black',
                        fontSize: scale(10),
                        fontWeight: 'bold',
                      }}
                      items={[
                        {label: 'Mr.', value: 'Mr.'},
                        {label: 'Mrs.', value: 'Mrs.'},
                      ]}
                      style={{
                        inputIOS: styles.inputIOS,
                        inputAndroid: styles.inputAndroid,
                      }}
                      onValueChange={primary_contact => {
                        this.setState({primary_contact});
                      }}
                      value={primary_contact}
                    />
                  </View>

                  <View style={styles.cview5}>
                    <TextInput
                      placeholder="First Name"
                      autoCorrect={false}
                      autoCapitalize={'none'}
                      returnKeyType={'next'}
                      underlineColorAndroid="transparent"
                      onChangeText={fname => this.setState({fname})}
                      value={fname}
                    />
                  </View>

                  <View style={styles.cview5}>
                    <TextInput
                      placeholder="Last Name"
                      autoCorrect={false}
                      autoCapitalize={'none'}
                      returnKeyType={'next'}
                      underlineColorAndroid="transparent"
                      onChangeText={lname => this.setState({lname})}
                      value={lname}
                    />
                  </View>
                </View>
              </View>
            </View>

            <View style={{marginTop: scale(5)}}>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.ctxt}>Company Name</Text>
                <Text style={styles.star}>*</Text>
              </View>
              <View style={styles.cuserInput}>
                <TextInput
                  style={styles.cinput}
                  autoCorrect={false}
                  autoCapitalize={'none'}
                  returnKeyType={'next'}
                  underlineColorAndroid="transparent"
                  onChangeText={company_name => this.setState({company_name})}
                  value={company_name}
                />
              </View>
            </View>

            <View style={{marginTop: scale(5)}}>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.ctxt}>Display Name</Text>
                <Text style={styles.star}>*</Text>
              </View>
              <View style={styles.cuserInput}>
                <TextInput
                  style={styles.cinput}
                  autoCorrect={false}
                  autoCapitalize={'none'}
                  returnKeyType={'next'}
                  underlineColorAndroid="transparent"
                  onChangeText={display_name => this.setState({display_name})}
                  value={display_name}
                />
              </View>
            </View>

            <View style={{marginTop: scale(5)}}>
              <Text style={styles.ctxt}>Contact Email</Text>

              <View style={styles.cuserInput}>
                <TextInput
                  style={styles.cinput}
                  autoCorrect={false}
                  autoCapitalize={'none'}
                  returnKeyType={'next'}
                  underlineColorAndroid="transparent"
                  onChangeText={contact_email => this.setState({contact_email})}
                  value={contact_email}
                  keyboardType="email-address"
                />
              </View>
            </View>

            <View style={{marginTop: scale(5)}}>
              <Text style={styles.ctxt}>GST Number</Text>

              <View style={styles.cuserInput}>
                <TextInput
                  style={styles.cinput}
                  autoCorrect={false}
                  autoCapitalize={'none'}
                  returnKeyType={'next'}
                  underlineColorAndroid="transparent"
                  onChangeText={gst_no => this.setState({gst_no})}
                  value={gst_no}
                />
              </View>
            </View>

            <View style={{marginTop: scale(5)}}>
              <Text style={styles.ctxt}>Contact Phone</Text>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <View
                  style={{
                    borderWidth: 1,
                    height: scale(45),
                    borderRadius: scale(5),
                    backgroundColor:"white",
                    borderColor:"#bdbdbd",
                    marginTop: scale(3),
                    width: '48%',
                  }}>
                  <TextInput
                    style={styles.ctxtInp1}
                    placeholder="Phone"
                    autoCorrect={false}
                    autoCapitalize={'none'}
                    returnKeyType={'next'}
                    underlineColorAndroid="transparent"
                    onChangeText={phone => this.setState({phone})}
                    value={phone}
                    keyboardType="number-pad"
                  />
                </View>
                <View
                  style={{
                    borderWidth: 1,
                    height: scale(45),
                    borderRadius: scale(5),
                    backgroundColor:"white",
                    borderColor:"#bdbdbd",
                    marginTop: scale(3),
                    width: '48%',
                  }}>
                  <TextInput
                    style={styles.ctxtInp1}
                    placeholder="Mobile"
                    autoCorrect={false}
                    autoCapitalize={'none'}
                    returnKeyType={'next'}
                    underlineColorAndroid="transparent"
                    onChangeText={mobile => this.setState({mobile})}
                    value={mobile}
                    keyboardType="number-pad"
                    maxLength={10}
                  />
                </View>
              </View>
            </View>

            <View style={{marginTop: scale(5)}}>
              <Text style={styles.ctxt}>Website</Text>

              <View style={styles.cuserInput}>
                <TextInput
                  style={styles.cinput}
                  autoCorrect={false}
                  autoCapitalize={'none'}
                  returnKeyType={'next'}
                  underlineColorAndroid="transparent"
                  onChangeText={website => this.setState({website})}
                  value={website}
                  keyboardType="url"
                />
              </View>
            </View>

            <View style={{marginTop: scale(5)}}>
              <Text style={styles.ctxt}>Currency</Text>

              <View style={styles.cuserInput}>
                <RNPickerSelect
                  placeholder={{
                    label: 'Select Currency',
                    value: '',
                    color: 'black',
                    fontSize: scale(12),
                    fontWeight: 'bold',
                  }}
                  style={{
                    inputIOS: styles.inputIOS,
                    inputAndroid: styles.inputAndroid,
                  }}
                  items={this.state.currency_list}
                  onValueChange={currency => {
                    this.setState({currency});
                  }}
                  value={currency}
                />
              </View>
            </View>

            <View style={{marginTop: scale(5)}}>
              <Text style={styles.ctxt}>Payment Terms</Text>

              <View style={styles.cuserInput}>
                <TextInput
                  style={styles.cinput}
                  autoCorrect={false}
                  autoCapitalize={'none'}
                  returnKeyType={'next'}
                  underlineColorAndroid="transparent"
                  onChangeText={pay_term => this.setState({pay_term})}
                  value={pay_term}
                />
              </View>
            </View>

            <View style={{marginTop: scale(5)}}>
              <Text style={styles.ctxt}>Language</Text>

              <View style={styles.cuserInput}>
                <RNPickerSelect
                  placeholder={{
                    label: 'Select Language',
                    value: '',
                    color: 'black',
                    fontSize: scale(12),
                    fontWeight: 'bold',
                  }}
                  style={{
                    inputIOS: styles.inputIOS,
                    inputAndroid: styles.inputAndroid,
                  }}
                  items={this.state.lang_list}
                  onValueChange={language => {
                    this.setState({language});
                  }}
                  value={language}
                />
              </View>
            </View>

            <View style={{marginTop: scale(5)}}>
              <Text style={styles.ctxt}>Facebook</Text>

              <View style={styles.cuserInput}>
                <TextInput
                  style={styles.cinput}
                  autoCorrect={false}
                  autoCapitalize={'none'}
                  returnKeyType={'next'}
                  underlineColorAndroid="transparent"
                  onChangeText={facebook => this.setState({facebook})}
                  value={facebook}
                />
              </View>
            </View>

            <View style={{marginTop: scale(5)}}>
              <Text style={styles.ctxt}>Twitter</Text>

              <View style={styles.cuserInput}>
                <TextInput
                  style={styles.cinput}
                  autoCorrect={false}
                  autoCapitalize={'none'}
                  returnKeyType={'next'}
                  underlineColorAndroid="transparent"
                  onChangeText={twitter => this.setState({twitter})}
                  value={twitter}
                />
              </View>
            </View>

           
          </View>
        </KeyboardAwareScrollView>
</CardView>

              <View style={{
                        marginTop:scale(40),
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
              <TouchableOpacity
                onPress={() => {
                  this.nextPress();
                }}
                style={{
                            width: scale(100),
                            height: scale(40),
                            borderRadius: scale(10),
                            backgroundColor: '#ff8f00',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                <Text style={styles.ctxt_log} numberOfLines={1}>
                  Next
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={{color:'grey',marginTop:scale(10),
                       textAlign:'center'}}> © ARSOL 2020-2021</Text>

    
</View>
    );
  }
}

ContactOneScreen.defaultProps = {
  network: '',
  conData: '',
  user_id: '',
  user_type: '',
};

const mapStateToProps = state => {
  return {
    network: state.network,
    conData: state.conData,
    user_id: state.user.id,
    user_type: state.user.type,
  };
};

const mapDispatchToProps = dispatch => {
  const {actions} = require('@redux/NewContactRedux');

  return {
    con_data: conData => dispatch(actions.con_data(conData)),
    con_reset: () => dispatch(actions.con_reset()),
    con_info: conData => dispatch(actions.con_info(conData)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ContactOneScreen);