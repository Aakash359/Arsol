import React, { PureComponent } from "react";

import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity, TouchableHighlight } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { connect } from "react-redux";
import { Config, Images, styles, Color } from '@common';


import { scale } from "react-native-size-matters";


import Snackbar from 'react-native-snackbar';
const msg = Config.SuitCRM;
import RNPickerSelect from 'react-native-picker-select';
import ArsolApi from '@services/ArsolApi';
import { LogoSpinner, NavigationBar } from '@components';
import { phone_no, zip_no } from '../../Omni';
class ContactTwoScreen extends PureComponent {


  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      country: '96',
      address: '',
      city: '',
      state_bill: '',
      zipcode: '',
      phone_add: '',
      fax: '',
      sp_country: '96',
      sp_address: '',
      sp_city: '',
      sp_state: '',
      sp_zipcode: '',
      sp_phone_add: '',
      sp_fax: '',

      country_list: [],
      state_list_bill: [],
      state_list_ship: [],
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
          address: contact_info.address,
          city: contact_info.city,
          zipcode: contact_info.zipcode,
          phone_add: contact_info.phone_add,
          fax: contact_info.fax,

          sp_address: contact_info.sp_address,
          sp_city: contact_info.sp_city,
          sp_zipcode: contact_info.sp_zipcode,
          sp_phone_add: contact_info.sp_phone_add,
          sp_fax: contact_info.sp_fax,
        })
      }

      this.setState({ loading: true }, () => {

        this.hit_Country_list()

      })
    }
  }

  hit_Country_list() {

    ArsolApi.Country_api()

      .then(responseJson => {
        console.log('Country_dropdown', responseJson);

        if (responseJson.ok) {
          this.setState({
            loading: false,
          });

          if (responseJson.data != null) {
            if (responseJson.data.hasOwnProperty('status')) {

              if (responseJson.data.status == 'success') {
                if (responseJson.data.hasOwnProperty('message')) {

                  if (responseJson.data.hasOwnProperty("data")) {
                    if (responseJson.data.data.length > 0) {

                      this.setState({
                        country_list: responseJson.data.data
                      })
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

  hit_stateApi(country, ad_type) {
    const { network } = this.props
    if (!network.isConnected) {
      Snackbar.show({
        text: msg.noInternet,
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: "red"
      });
    } else if (country != '') {

      this.setState({ loading: true, state_list: [] }, () => {
        ArsolApi.StateDetails_api(country)

          .then(responseJson => {
            console.log('StateDetails_api', responseJson);

            if (responseJson.ok) {
              this.setState({
                loading: false,
              });

              if (responseJson.data != null) {
                if (responseJson.data.hasOwnProperty('status')) {

                  if (responseJson.data.status == 'success') {
                    if (responseJson.data.hasOwnProperty('message')) {

                      if (responseJson.data.hasOwnProperty("data")) {
                        if (responseJson.data.data.length > 0) {



                          if (ad_type == "bill") {
                            this.setState({
                              state_list_bill: responseJson.data.data,
                              state_bill: '',
                            })
                          } else {
                            this.setState({
                              state_list_ship: responseJson.data.data,
                              sp_state: '',
                            })
                          }
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
      })

    }
  }


  nextPress() {
    const {
      country,
      address,
      city,
      state_bill,
      zipcode,
      phone_add,
      fax,
      sp_country,
      sp_address,
      sp_city,
      sp_state,
      sp_zipcode,
      sp_phone_add,
      sp_fax,
      edit_id

    } = this.state
    const { network } = this.props

    if (country.trim() == "") {
      Snackbar.show({
        text: 'Select Country',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: Color.lgreen
      });
    } else if (address.trim() == "") {
      Snackbar.show({
        text: 'Enter Address',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: Color.lgreen
      });
    } else if (city.trim() == "") {
      Snackbar.show({
        text: 'Enter City',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: Color.lgreen
      });
    } else if (state_bill.trim() == "") {
      Snackbar.show({
        text: 'Select State',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: Color.lgreen
      });
    } else if (zipcode.trim() == "") {
      Snackbar.show({
        text: 'Enter Zipcode',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: Color.lgreen
      });
    } else if (zip_no(zipcode) === false) {
      Snackbar.show({
        text: 'ZipCode Invalid',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: Color.lgreen
      });
    }
    else if (phone_add.trim() == "") {
      Snackbar.show({
        text: 'Enter Phone No.',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: Color.lgreen
      });
    } else if (phone_no(phone_add) === false) {
      Snackbar.show({
        text: 'Phone No. Invalid',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: Color.lgreen
      });
    } else if (sp_country.trim() == "") {
      Snackbar.show({
        text: 'Select Shipping Country',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: Color.lgreen
      });
    } else if (sp_address.trim() == "") {
      Snackbar.show({
        text: 'Enter Shipping Address',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: Color.lgreen
      });
    } else if (sp_city.trim() == "") {
      Snackbar.show({
        text: 'Enter Shipping City',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: Color.lgreen
      });
    } else if (sp_state.trim() == "") {
      Snackbar.show({
        text: 'Select Shipping State',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: Color.lgreen
      });
    } else if (sp_zipcode.trim() == "") {
      Snackbar.show({
        text: 'Enter Shipping Zipcode',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: Color.lgreen
      });
    } else if (zip_no(sp_zipcode) === false) {
      Snackbar.show({
        text: 'ZipCode Shipping Invalid',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: Color.lgreen
      });
    }
    else if (sp_phone_add.trim() == "") {
      Snackbar.show({
        text: 'Enter Shipping Phone No.',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: Color.lgreen
      });
    } else if (phone_no(sp_phone_add) === false) {
      Snackbar.show({
        text: 'Shipping Phone No. Invalid',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: Color.lgreen
      });
    } else if (!network.isConnected) {
      Snackbar.show({
        text: msg.noInternet,
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: "red"
      });
    } else {
      details = {
        edit_id:edit_id,
        country: country,
        address: address,
        city: city,
        state_bill: state_bill,
        zipcode: zipcode,
        phone_add: phone_add,
        fax: fax,
        sp_country: sp_country,
        sp_address: sp_address,
        sp_city: sp_city,
        sp_state: sp_state,
        sp_zipcode: sp_zipcode,
        sp_phone_add: sp_phone_add,
        sp_fax: sp_fax,

      }

      this.props.con_two(details)
      this.props.navigation.navigate('ContactThree')

    }

  }


  render() {
    const {
      country,
      address,
      city,
      state_bill,
      zipcode,
      phone_add,
      fax,
      sp_country,
      sp_address,
      sp_city,
      sp_state,
      sp_zipcode,
      sp_phone_add,
      sp_fax,
      country_list,
      state_list_bill,
      state_list_ship

    } = this.state
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
              <Text style={styles.ctext2}>Billing Address</Text>
            </View>


            <View>
              <View style={styles.cview2}>
                <Text style={styles.ctxt}>Country</Text>
                <Text style={styles.star}>*</Text>
              </View>


              <View style={styles.cuserInput}>

                <RNPickerSelect
                  placeholder={{
                    label: "Select Country",
                    value: "",
                    color: 'black',
                    fontSize: scale(12),
                    fontWeight: 'bold',
                  }}
                  style={{
                    inputIOS: styles.inputIOS,
                    inputAndroid: styles.inputAndroid,
                  }}
                  items={country_list}
                  onValueChange={(country) =>
                    this.setState({ country }, () => { this.hit_stateApi(country, "bill") })}
                  value={country}

                />
              </View>
            </View>

            <View style={{ marginTop: scale(5) }}>
                <View style={{ flexDirection: 'row' }}>
                <Text style={styles.ctxt}>Address</Text>
                <Text style={styles.star}>*</Text>
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
                  onChangeText={address => this.setState({ address })}
                  value={address}

                />
              </View>
            </View>

            <View>
              <View style={styles.cview2}>
                <Text style={styles.ctxt}>City</Text>
                <Text style={styles.star}>*</Text>
              </View>
              <View style={styles.cuserInput}>

                <TextInput
                  style={styles.cinput}
                  autoCorrect={false}
                  autoCapitalize={'none'}
                  returnKeyType={'next'}
                  underlineColorAndroid="transparent"
                  onChangeText={city => this.setState({ city })}
                  value={city}

                />
              </View>
            </View>

            <View>
              <View style={styles.cview2}>
                <Text style={styles.ctxt}>State</Text>
                <Text style={styles.star}>*</Text>
              </View>


              <View style={styles.cuserInput}>

                <RNPickerSelect
                  placeholder={{
                    label: "Select State",
                    value: "",
                    color: 'black',
                    fontSize: scale(12),
                    fontWeight: 'bold',
                  }}
                  style={{
                    inputIOS: styles.inputIOS,
                    inputAndroid: styles.inputAndroid,
                  }}
                  items={state_list_bill}
                  onValueChange={(state_bill) =>
                    this.setState({ state_bill })}
                  value={state_bill}

                />
              </View>



            </View>

            <View>
              <View style={styles.cview2}>
                <Text style={styles.ctxt}>ZipCode</Text>
                <Text style={styles.star}>*</Text>
              </View>
              <View style={styles.cuserInput}>

                <TextInput
                  style={styles.cinput}
                  autoCorrect={false}
                  autoCapitalize={'none'}
                  returnKeyType={'next'}
                  underlineColorAndroid="transparent"
                  onChangeText={zipcode => this.setState({ zipcode })}
                  value={zipcode}
                  maxLength={6}
                  keyboardType='number-pad'

                />
              </View>
            </View>

            <View>
              <View style={styles.cview2}>
                <Text style={styles.ctxt}>Phone</Text>
                <Text style={styles.star}>*</Text>
              </View>
              <View style={styles.cuserInput}>

                <TextInput
                  style={styles.cinput}
                  autoCorrect={false}
                  autoCapitalize={'none'}
                  returnKeyType={'next'}
                  underlineColorAndroid="transparent"
                  onChangeText={phone_add => this.setState({ phone_add })}
                  value={phone_add}
                  keyboardType='number-pad'
                  maxLength={10}

                />
              </View>
            </View>


            <View>
              <View style={styles.cview6}>
                <Text style={styles.ctxt}>Fax</Text>

              </View>
              <View style={styles.cuserInput}>

                <TextInput
                  style={styles.cinput}
                  autoCorrect={false}
                  autoCapitalize={'none'}
                  returnKeyType={'next'}
                  underlineColorAndroid="transparent"
                  onChangeText={fax => this.setState({ fax })}
                  value={fax}

                />
              </View>
            </View>


            <View style={styles.cview9}
            >
              <TouchableOpacity style={styles.ctouch2}
                onPress={() => {
                  this.setState({
                    sp_country: country,
                    sp_address: address,
                    sp_city: city,
                    sp_state: state_bill,
                    sp_zipcode: zipcode,
                    sp_phone_add: phone_add,
                    sp_fax: fax
                  })
                }}

              >
                <Image source={Images.copy}
                  style={styles.cimg1}
                />
                <Text style={styles.ctext3}> Copy Billing Address</Text>
              </TouchableOpacity>
            </View>




            <View>
              <Text style={styles.ctext4}>Shipping Address</Text>
            </View>


            <View>
              <View style={styles.cview2}>
                <Text style={styles.ctxt}>Country</Text>
                <Text style={styles.star}>*</Text>
              </View>
              <View style={styles.cuserInput}>

                <RNPickerSelect
                  placeholder={{
                    label: "Select Country",
                    value: "",
                    color: 'black',
                    fontSize: scale(12),
                    fontWeight: 'bold',
                  }}
                  style={{
                    inputIOS: styles.inputIOS,
                    inputAndroid: styles.inputAndroid,
                  }}
                  items={country_list}
                  onValueChange={(sp_country) =>
                    this.setState({ sp_country },
                     () => { this.hit_stateApi(sp_country, "ship") })}
                  value={sp_country}

                />
              </View>
            </View>

            <View>
              <View style={styles.cview2}>
                <Text style={styles.ctxt}>Address</Text>
                <Text style={styles.star}>*</Text>
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
                  onChangeText={sp_address => this.setState({ sp_address })}
                  value={sp_address}
                />
              </View>
            </View>

            <View>
              <View style={styles.cview2}>
                <Text style={styles.ctxt}>City</Text>
                <Text style={styles.star}>*</Text>
              </View>
              <View style={styles.cuserInput}>

                <TextInput
                  style={styles.cinput}
                  autoCorrect={false}
                  autoCapitalize={'none'}
                  returnKeyType={'next'}
                  underlineColorAndroid="transparent"
                  onChangeText={sp_city => this.setState({ sp_city })}
                  value={sp_city}

                />
              </View>
            </View>

            <View>
              <View style={styles.cview2}>
                <Text style={styles.ctxt}>State</Text>
                <Text style={styles.star}>*</Text>
              </View>
              <View style={styles.cuserInput}>

                <RNPickerSelect
                  placeholder={{
                    label: "Select State",
                    value: "",
                    color: 'black',
                    fontSize: scale(12),
                    fontWeight: 'bold',
                  }}
                  style={{
                    inputIOS: styles.inputIOS,
                    inputAndroid: styles.inputAndroid,
                  }}
                  items={state_list_ship}
                  onValueChange={(sp_state) =>
                    this.setState({ sp_state })}
                  value={sp_state}

                />
              </View>
            </View>

            <View>
              <View style={styles.cview2}>
                <Text style={styles.ctxt}>ZipCode</Text>
                <Text style={styles.star}>*</Text>
              </View>
              <View style={styles.cuserInput}>

                <TextInput
                  style={styles.cinput}
                  autoCorrect={false}
                  autoCapitalize={'none'}
                  returnKeyType={'next'}
                  underlineColorAndroid="transparent"
                  onChangeText={sp_zipcode => this.setState({ sp_zipcode })}
                  value={sp_zipcode}
                  maxLength={6}
                  keyboardType='number-pad'

                />
              </View>
            </View>

            <View>
              <View style={styles.cview2}>
                <Text style={styles.ctxt}>Phone</Text>
                <Text style={styles.star}>*</Text>
              </View>
              <View style={styles.cuserInput}>

                <TextInput
                  style={styles.cinput}
                  autoCorrect={false}
                  autoCapitalize={'none'}
                  returnKeyType={'next'}
                  underlineColorAndroid="transparent"
                  onChangeText={sp_phone_add => this.setState({ sp_phone_add })}
                  value={sp_phone_add}
                  keyboardType='number-pad'
                  maxLength={10}

                />
              </View>
            </View>


            <View>
              <View style={styles.cview6}>
                <Text style={styles.ctxt}>Fax</Text>

              </View>
              <View style={styles.cuserInput}>

                <TextInput
                  style={styles.cinput}
                  autoCorrect={false}
                  autoCapitalize={'none'}
                  returnKeyType={'next'}
                  underlineColorAndroid="transparent"
                  onChangeText={sp_fax => this.setState({ sp_fax })}
                  value={sp_fax}

                />
              </View>
            </View>


            <View
              style={styles.cview7}>

              <TouchableOpacity
                onPress={() => { this.nextPress() }}
                style={styles.ctouch}
              >
                <Text style={styles.ctxt_log}
                  numberOfLines={1}
                >Next</Text>
              </TouchableOpacity>

            </View>


          </View>

        </KeyboardAwareScrollView>


      </View>
    );
  }
}




ContactTwoScreen.defaultProps = {
  network: '',
  conData: '',
  user_id: '',
  user_type: '',
  contact_info: ''
}


const mapStateToProps = (state) => {
  return {
    network: state.network,
    conData: state.conData,
    user_id: state.user.id,
    user_type: state.user.type,
    contact_info: state.conData.contact_info,
    edit_id: state.conData.new_contact.edit_id

  };
};

const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux/NewContactRedux');

  return {
    con_two: conData => dispatch(actions.con_two(conData)),
    con_reset: () => dispatch(actions.con_reset()),
  };
};


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContactTwoScreen);