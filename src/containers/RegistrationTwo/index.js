import React, { PureComponent } from "react";
import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { connect } from "react-redux";
import { Config, Color } from '@common';

import LinearGradient from 'react-native-linear-gradient';
import { scale } from "react-native-size-matters";
import CardView from 'react-native-cardview';
import Snackbar from 'react-native-snackbar';
const msg = Config.SuitCRM;
import { LogoSpinner } from '@components';
import RNPickerSelect from 'react-native-picker-select';
import ArsolApi from '@services/ArsolApi';
import { pan_no, gest_no, ifsc_no, ac_no } from '../../Omni';
import { StackActions, CommonActions } from '@react-navigation/native';

//In this array use the value which you are loading in select

const company = { I: "1", P: "2", C: "3" };

class RegistrationTwoScreen extends PureComponent {


  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      currency_list: [],
      constiution_list: [],

      panNo: '',
      gstNo: '',
      orgName: '',
      Currency: '47',
      Constitution: '',
      BankName: '',
      AccountName: '',
      AccountNumber: '',
      Ifsc: '',
      org_tag: '',
      focus: false,

    }

  }

  componentDidMount() {
    const { network } = this.props

    if (!network.isConnected) {
      Snackbar.show({
        text: msg.noInternet,
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: "red"
      });
    } else {
      this.setState({ loading: true }, () => {
        this.hit_Currency_list()
        this.hit_Constituion_list()
      })

    }
  }

  //Pan Card
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
  _scrollToInput(reactNode: pan) {
    // Add a 'scroll' ref to your ScrollView
    this.scroll.props.scrollToFocusedInput(reactNode)
  }

  //GST
  onFocusGST() {
    this.setState({
      focus_g: true
    })
  }

  onBlurGST() {
    this.setState({
      focus_g: false
    })
  }
  _scrollToInput(reactNode: gst) {
    // Add a 'scroll' ref to your ScrollView
    this.scroll.props.scrollToFocusedInput(reactNode)
  }

  //ORG Name
  onFocusOrg() {
    this.setState({
      focus_o: true
    })
  }

  onBlurOrg() {
    this.setState({
      focus_o: false
    })
  }

  //Tag Name
  onFocusTag() {
    this.setState({
      focus_t: true
    })
  }

  onBlurTag() {
    this.setState({
      focus_t: false
    })
  }

  //Currency
  onFocusPick() {
    this.setState({
      focus_p: true
    })
  }

  onBlurPick() {
    this.setState({
      focus_p: false
    })
  }

  //Constition
  onFocusCon() {
    this.setState({
      focus_c: true
    })
  }

  onBlurCon() {
    this.setState({
      focus_c: false
    })
  }

  //Bank
  onFocusBan() {
    this.setState({
      focus_b: true
    })
  }

  onBlurBan() {
    this.setState({
      focus_b: false
    })
  }

  //Account
  onFocusAcc() {
    this.setState({
      focus_a: true
    })
  }

  onBlurAcc() {
    this.setState({
      focus_a: false
    })
  }


  //Account Number
  onFocusNum() {
    this.setState({
      focus_n: true
    })
  }

  onBlurNum() {
    this.setState({
      focus_n: false
    })
  }

  //IFSC
  onFocusIFS() {
    this.setState({
      focus_i: true
    })
  }

  onBlurIFS() {
    this.setState({
      focus_i: false
    })
  }





  hit_Currency_list() {
    const { network } = this.props
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

                  if (responseJson.data.hasOwnProperty("data")) {
                    if (responseJson.data.data.length > 0) {

                      this.setState({
                        currency_list: responseJson.data.data
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


  hit_Constituion_list() {
    const { network } = this.props
    ArsolApi.Constitution_api()

      .then(responseJson => {
        console.log('Constitution_dropdown', responseJson);

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
                        constiution_list: responseJson.data.data
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

  handleNext() {
    //
    //alert('test')
    const { panNo,
      gstNo,
      orgName,
      org_tag,
      Currency,
      Constitution,
      BankName,
      AccountName,
      AccountNumber,
      Ifsc } = this.state

    if (panNo.trim() == "") {
      Snackbar.show({
        text: 'Enter Pan Card No.',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: Color.lgreen
      });
    } else if (pan_no(panNo) === false) {
      Snackbar.show({
        text: 'Pan No. Invalid',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: Color.lgreen
      });
    } else if (gstNo != "" && gest_no(gstNo) === false) {

      Snackbar.show({
        text: 'Gst No. Invalid',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: Color.lgreen
      });

    } else if (orgName.trim() == "") {
      Snackbar.show({
        text: 'Enter Org. Name',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: Color.lgreen
      });
    } else if (Currency.trim() == "") {
      Snackbar.show({
        text: 'Select Currency',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: Color.lgreen
      });
    } else if (Constitution.trim() == "") {
      Snackbar.show({
        text: 'Enter Constitution',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: Color.lgreen
      });
    } else if (BankName.trim() == "") {
      Snackbar.show({
        text: 'Enter Bank Name',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: Color.lgreen
      });
    } else if (AccountName.trim() == "") {
      Snackbar.show({
        text: 'Enter Account No.',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: Color.lgreen
      });
    } else if (AccountNumber.trim() == "") {
      Snackbar.show({
        text: 'Enter Account No.',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: Color.lgreen
      });
    } else if (isNaN(AccountNumber)) {
      Snackbar.show({
        text: 'Account No. Invalid',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: Color.lgreen
      });
    } else if (Ifsc.trim() == "") {
      Snackbar.show({
        text: 'Enter IFSC Code',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: Color.lgreen
      });
    } else if (ifsc_no(Ifsc) === false) {
      Snackbar.show({
        text: 'IFSC No. Invalid',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: Color.lgreen
      });
    } else {
      let reg = {

        fname: this.props.regData.fname,
        lname: this.props.regData.lname,
        email: this.props.regData.email,
        pan_no: panNo,
        gst_no: gstNo,
        org_name: orgName,
        org_tag_name: org_tag,
        currency: Currency,
        constitution: Constitution,
        bank_name: BankName,
        ac_name: AccountName,
        ac_number: AccountNumber,
        ifsc_code: Ifsc,
      }
      this.props.res_data(reg)
      // console.log(this.props.regData)
      this.props.navigation.navigate('RegistrationThree')
    }
  }

  render() {
    const { currency_list, constiution_list } = this.state


    return (
      <View style={{
        flex: 1, backgroundColor: "white"
      }}>

        <View style={{
          marginLeft: scale(80), marginTop: scale(25),
          width: scale(180), height: scale(40), borderRadius: scale(4), backgroundColor: '#aeea00'
        }}>
          <Text style={{
            marginTop: scale(5), textAlign: 'center',
            paddingBottom: scale(20), fontSize: scale(18), fontWeight: 'bold'
          }}>Registration</Text>
        </View>

        <View style={{
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
          backgroundColor: "#eceff1",
          marginHorizontal: scale(10),
          marginVertical: scale(20),
          height: '70%'
        }}>

          <KeyboardAwareScrollView

            contentContainerStyle={{ flexGrow: 1, }}
            enableOnAndroid={true}
            keyboardShouldPersistTaps="handled"
            innerRef={ref => {
              this.scroll = ref
            }}
          >
            <LogoSpinner loading={this.state.loading} />
            <View style={styles.container}>



              <View>
                <View style={{ flexDirection: 'row', width: scale(200), }}>
                  <Text style={styles.txt}>Pan Card No.</Text>
                  <Text style={{ color: 'red', fontSize: scale(12), }}>*</Text>
                </View>

                <View style={{
                  borderColor:
                    this.state.focus ?
                      Color.headerTintColor
                      :
                      "#bdbdbd",

                  height: scale(40),
                  width: '100%',
                  borderWidth: this.state.focus ?
                    scale(1)
                    :
                    scale(.5),

                  marginTop: scale(10),
                  borderWidth: scale(1),
                  borderRadius: scale(4),
                  backgroundColor: "white",
                  marginBottom: scale(10),

                }}
                >

                  <TextInput
                    onFocus={(pan: Pan) => {
                      // `bind` the function if you're using ES6 classes
                      this._scrollToInput(ReactNative.findNodeHandle(first.target))
                    }}
                    onBlur={() => this.onBlur()}
                    onFocus={() => this.onFocus()}
                    style={styles.input}
                    placeholder={'AAAAA0000A'}
                    autoCorrect={false}
                    autoCapitalize={'none'}
                    returnKeyType={'next'}
                    placeholderTextColor="grey"
                    underlineColorAndroid="transparent"
                    onSubmitEditing={() => { this.secondTextInput.focus(); }}

                    onEndEditing={() => {
                      const pan = this.state.panNo;

                      if (pan.length >= 4) {
                        const letter = pan[3];
                        const comp = company[letter.toUpperCase()]

                        if (comp)
                          this.setState({ Constitution: comp })


                      }

                    }}
                    onChangeText={panNo => this.setState({ panNo })}

                    value={this.state.panNo}
                  />
                </View>

              </View>

              <View>
                <Text style={styles.txt} numberOfLines={1}>GST Number (Optional)</Text>
                <View style={{
                  borderColor:
                    this.state.focus_g ?
                      Color.headerTintColor
                      :
                      "#bdbdbd",

                  height: scale(40),
                  width: '100%',
                  borderWidth: this.state.focus_g ?
                    scale(1)
                    :
                    scale(.5),

                  marginTop: scale(10),
                  borderWidth: scale(1),
                  borderRadius: scale(4),
                  backgroundColor: "white",
                  marginBottom: scale(10),

                }}
                >

                  <TextInput
                    onFocus={(gst: Gst) => {
                      // `bind` the function if you're using ES6 classes
                      this._scrollToInput(ReactNative.findNodeHandle(gst.target))
                    }}
                    onBlur={() => this.onBlurGST()}
                    onFocus={() => this.onFocusGST()}
                    ref={(input) => { this.secondTextInput = input; }}
                    onSubmitEditing={() => { this.thirdTextInput.focus(); }}
                    style={styles.input}
                    placeholder={'00AAAAA0000A1ZA'}
                    autoCorrect={false}
                    autoCapitalize={'none'}
                    returnKeyType={'next'}
                    placeholderTextColor="grey"
                    underlineColorAndroid="transparent"
                    onChangeText={gstNo => this.setState({ gstNo })}
                    value={this.state.gstNo}
                  />
                </View>

              </View>

              <View>
                <View style={{ flexDirection: 'row', width: scale(200), }}>
                  <Text style={styles.txt}>Organization Name</Text>
                  <Text style={{ color: 'red', fontSize: scale(12), }}>*</Text>
                </View>

                <View style={{
                  borderColor:
                    this.state.focus_o ?
                      Color.headerTintColor
                      :
                      "#bdbdbd",

                  height: scale(40),
                  width: '100%',
                  borderWidth: this.state.focus_o ?
                    scale(1)
                    :
                    scale(.5),

                  marginTop: scale(10),
                  borderWidth: scale(1),
                  borderRadius: scale(4),
                  backgroundColor: "white",
                  marginBottom: scale(10),

                }}>

                  <TextInput
                    onBlur={() => this.onBlurOrg()}
                    onFocus={() => this.onFocusOrg()}
                    ref={(input) => { this.thirdTextInput = input; }}
                    onSubmitEditing={() => { this.fourthTextInput.focus(); }}
                    style={styles.input}
                    placeholder={'Organization Name'}
                    autoCorrect={false}
                    autoCapitalize={'none'}
                    returnKeyType={'next'}
                    placeholderTextColor="grey"
                    underlineColorAndroid="transparent"
                    onChangeText={orgName => this.setState({ orgName })}
                    value={this.state.orgName}
                  />
                </View>

              </View>


              <View>
                <Text style={styles.txt} numberOfLines={1}>Organization Tag Name (Optional)</Text>
                <View style={{
                  borderColor:
                    this.state.focus_t ?
                      Color.headerTintColor
                      :
                      "#bdbdbd",

                  height: scale(40),
                  width: '100%',
                  borderWidth: this.state.focus_t ?
                    scale(1)
                    :
                    scale(.5),

                  marginTop: scale(10),
                  borderWidth: scale(1),
                  borderRadius: scale(4),
                  backgroundColor: "white",
                  marginBottom: scale(10),

                }}>

                  <TextInput
                    onBlur={() => this.onBlurTag()}
                    onFocus={() => this.onFocusTag()}
                    ref={(input) => { this.fourthTextInput = input; }}
                    onSubmitEditing={() => { this.fifthTextInput.focus(); }}
                    style={styles.input}
                    placeholder={'Organization Tag Name '}
                    autoCorrect={false}
                    autoCapitalize={'none'}
                    returnKeyType={'next'}
                    placeholderTextColor="grey"
                    underlineColorAndroid="transparent"
                    onChangeText={org_tag => this.setState({ org_tag })}
                    value={this.state.org_tag}
                  />
                </View>

              </View>

              <View>
                <View style={{ flexDirection: 'row', width: scale(200), }}>
                  <Text style={styles.txt}>Currency</Text>
                  <Text style={{ color: 'red', fontSize: scale(12), }}>*</Text>
                </View>

                <View style={{
                  borderColor:
                    this.state.focus_p ?
                      Color.headerTintColor
                      :
                      "#bdbdbd",

                  height: scale(40),
                  width: '100%',
                  borderWidth: this.state.focus_p ?
                    scale(1)
                    :
                    scale(.5),

                  marginTop: scale(10),
                  borderWidth: scale(1),
                  borderRadius: scale(4),
                  backgroundColor: "white",
                  marginBottom: scale(10),

                }}>

                  <RNPickerSelect
                    placeholder={{
                      label: "Select Currency",
                      value: "",
                      color: 'black',
                      fontSize: scale(12),
                      fontWeight: 'bold',
                    }}
                    style={{
                      inputIOS: styles.inputIOS,
                      inputAndroid: styles.inputAndroid,
                    }}
                    onBlur={() => this.onBlurPick()}
                    onFocus={() => this.onFocusPick()}
                    items={currency_list}
                    onValueChange={(Currency) => this.setState({ Currency })}
                    value={this.state.Currency}

                  />

                </View>

              </View>

              <View>
                <View style={{ flexDirection: 'row', width: scale(200), }}>
                  <Text style={styles.txt}>Constitution</Text>
                  <Text style={{ color: 'red', fontSize: scale(12), }}>*</Text>
                </View>
                <View style={{
                  borderColor:
                    this.state.focus_c ?
                      Color.headerTintColor
                      :
                      "#bdbdbd",

                  height: scale(40),
                  width: '100%',
                  borderWidth: this.state.focus_c ?
                    scale(1)
                    :
                    scale(.5),

                  marginTop: scale(10),
                  borderWidth: scale(1),
                  borderRadius: scale(4),
                  backgroundColor: "white",
                  marginBottom: scale(10),

                }}>


                  <RNPickerSelect
                    placeholder={{
                      label: "Select Business",
                      value: "",
                      color: 'black',
                      fontSize: scale(12),
                      fontWeight: 'bold',
                    }}
                    style={{
                      inputIOS: styles.inputIOS,
                      inputAndroid: styles.inputAndroid,
                    }}
                    onBlur={() => this.onBlurCon()}
                    onFocus={() => this.onFocusCon()}
                    items={constiution_list}
                    onValueChange={(Constitution) => this.setState({ Constitution })}
                    value={this.state.Constitution}

                  />

                </View>

              </View>

              <View>
                <View style={{ flexDirection: 'row', width: scale(200), }}>
                  <Text style={styles.txt}>Bank Name</Text>
                  <Text style={{ color: 'red', fontSize: scale(12), }}>*</Text>
                </View>

                <View style={{
                  borderColor:
                    this.state.focus_b ?
                      Color.headerTintColor
                      :
                      "#bdbdbd",

                  height: scale(40),
                  width: '100%',
                  borderWidth: this.state.focus_b ?
                    scale(1)
                    :
                    scale(.5),

                  marginTop: scale(10),
                  borderWidth: scale(1),
                  borderRadius: scale(4),
                  backgroundColor: "white",
                  marginBottom: scale(10),

                }}>

                  <TextInput
                    onBlur={() => this.onBlurBan()}
                    onFocus={() => this.onFocusBan()}
                    ref={(input) => { this.fifthTextInput = input; }}
                    onSubmitEditing={() => { this.sixthTextInput.focus(); }}
                    style={styles.input}
                    placeholder={'Bank Name'}
                    autoCorrect={false}
                    autoCapitalize={'none'}
                    returnKeyType={'next'}
                    placeholderTextColor="grey"
                    underlineColorAndroid="transparent"
                    onChangeText={BankName => this.setState({ BankName })}
                    value={this.state.BankName}
                  />
                </View>

              </View>

              <View>
                <View style={{ flexDirection: 'row', width: scale(200), }}>
                  <Text style={styles.txt}>Account Name</Text>
                  <Text style={{ color: 'red', fontSize: scale(12), }}>*</Text>
                </View>

                <View style={{
                  borderColor:
                    this.state.focus_a ?
                      Color.headerTintColor
                      :
                      "#bdbdbd",

                  height: scale(40),
                  width: '100%',
                  borderWidth: this.state.focus_a ?
                    scale(1)
                    :
                    scale(.5),

                  marginTop: scale(10),
                  borderWidth: scale(1),
                  borderRadius: scale(4),
                  backgroundColor: "white",
                  marginBottom: scale(10),

                }}>

                  <TextInput
                    onBlur={() => this.onBlurAcc()}
                    onFocus={() => this.onFocusAcc()}
                    ref={(input) => { this.sixthTextInput = input; }}
                    onSubmitEditing={() => { this.seventhTextInput.focus(); }}
                    style={styles.input}
                    placeholder={'Account Name'}
                    autoCorrect={false}
                    autoCapitalize={'none'}
                    returnKeyType={'next'}
                    placeholderTextColor="grey"
                    underlineColorAndroid="transparent"
                    onChangeText={AccountName => this.setState({ AccountName })}
                    value={this.state.AccountName}
                  />
                </View>

              </View>

              <View>
                <View style={{ flexDirection: 'row', width: scale(200), }}>
                  <Text style={styles.txt}>Account Number</Text>
                  <Text style={{ color: 'red', fontSize: scale(12), }}>*</Text>
                </View>

                <View style={{
                  borderColor:
                    this.state.focus_n ?
                      Color.headerTintColor
                      :
                      "#bdbdbd",

                  height: scale(40),
                  width: '100%',
                  borderWidth: this.state.focus_n ?
                    scale(1)
                    :
                    scale(.5),

                  marginTop: scale(10),
                  borderWidth: scale(1),
                  borderRadius: scale(4),
                  backgroundColor: "white",
                  marginBottom: scale(10),

                }}>

                  <TextInput
                    onBlur={() => this.onBlurNum()}
                    onFocus={() => this.onFocusNum()}
                    ref={(input) => { this.seventhTextInput = input; }}
                    onSubmitEditing={() => { this.eightTextInput.focus(); }}
                    style={styles.input}
                    placeholder={'Account Number'}
                    autoCorrect={false}
                    autoCapitalize={'none'}
                    returnKeyType={'next'}
                    placeholderTextColor="grey"
                    underlineColorAndroid="transparent"
                    onChangeText={AccountNumber => this.setState({ AccountNumber })}
                    value={this.state.AccountNumber}
                    keyboardType='number-pad'
                  />
                </View>

              </View>

              <View>
                <View style={{ flexDirection: 'row', width: scale(200), }}>
                  <Text style={styles.txt}>IFSC Code</Text>
                  <Text style={{ color: 'red', fontSize: scale(12), }}>*</Text>
                </View>

                <View style={{
                  borderColor:
                    this.state.focus_i ?
                      Color.headerTintColor
                      :
                      "#bdbdbd",

                  height: scale(40),
                  width: '100%',
                  borderWidth: this.state.focus_i ?
                    scale(1)
                    :
                    scale(.5),

                  marginTop: scale(10),
                  borderWidth: scale(1),
                  borderRadius: scale(4),
                  backgroundColor: "white",
                  marginBottom: scale(10),

                }}>

                  <TextInput
                    onBlur={() => this.onBlurIFS()}
                    onFocus={() => this.onFocusIFS()}
                    ref={(input) => { this.eightTextInput = input; }}
                    onSubmitEditing={() => { this.handleNext() }}
                    style={styles.input}
                    placeholder={'IFSC Code'}
                    autoCorrect={false}
                    autoCapitalize={'none'}
                    returnKeyLabel={'Done'}
                    returnKeyType={'done'}
                    placeholderTextColor="grey"
                    underlineColorAndroid="transparent"
                    onChangeText={Ifsc => this.setState({ Ifsc })}
                    value={this.state.Ifsc}
                  />
                </View>

              </View>


            </View>
          </KeyboardAwareScrollView>



        </View>

        <View
          style={{
            marginTop: scale(20),
            marginBottom: scale(10),
            justifyContent: 'center',
            alignItems: 'center',
          }}>

          <TouchableOpacity
            onPress={() => { this.handleNext() }}
            style={{

              width: scale(100),
              height: scale(40),
              borderRadius: scale(12),
              backgroundColor: '#ff8f00',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <LinearGradient style={styles.linearGradient}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#ffa726', '#ff8f00', '#ff6f00']} >
              <Text style={styles.txt_log}
                numberOfLines={1}
              >Next</Text>
            </LinearGradient>
          </TouchableOpacity>

        </View>

        <View
          style={{
            marginTop: scale(5),
            marginBottom: scale(20),
            justifyContent: 'center',
            alignItems: 'center',
          }}>

          <Text style={{ color: '#ff8f00' }}>Already a member ?</Text>

          <TouchableOpacity
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
            style={{
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Text style={styles.txt_signin}
              numberOfLines={1}
            >Sign In</Text>
          </TouchableOpacity>

        </View>

        <View >
          <Text style={{
            color: 'grey', marginTop: scale(20),
            textAlign: 'center'
          }}> © ARSOL 2020-2021</Text>

        </View>

      </View>
    );
  }
}



const styles = StyleSheet.create({
  container: {

    marginTop: scale(-10),
    marginHorizontal: scale(30),
    paddingVertical: scale(40),
    marginLeft: scale(15),
    marginRight: scale(15),

  },

  linearGradient: {
    width: scale(100),
    height: scale(40),
    borderRadius: scale(12),
    justifyContent: 'center',
    alignItems: 'center'
  },

  userInput: {
    marginTop: scale(5),
    height: scale(40),
    backgroundColor: 'white',
    marginBottom: scale(15),
    borderColor: "#bdbdbd",
    borderWidth: scale(1),
    borderRadius: scale(4)
  },
  userImg: {
    position: 'absolute',
    zIndex: scale(99),
    width: scale(22),
    height: scale(22),
    left: scale(10),
    top: scale(9),
  },
  input: {
    color: '#000',
    marginLeft: scale(5),
    width: '73%',
    fontSize: scale(12)
  },
  txt: {
    fontSize: scale(12),
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'auto'
  },
  txt_log: {
    fontSize: scale(12),
    color: 'white',
    fontWeight: 'bold',
    width: scale(100),
    textAlign: 'center'
  },
  txt_signin: {
    fontSize: scale(12),
    color: 'black',
    fontWeight: 'bold',
    width: scale(100),
    textAlign: 'center'
  },
  inputIOS: {
    fontSize: scale(12),
    paddingVertical: scale(12),
    paddingHorizontal: scale(10),
    color: 'black',
    paddingRight: scale(40),
  },
  inputAndroid: {
    fontSize: scale(12),
    paddingHorizontal: scale(10),
    paddingVertical: scale(8),
    color: 'black',
    paddingRight: scale(40),
  },
})



RegistrationTwoScreen.defaultProps = {

  network: '',
  regData: '',


}


const mapStateToProps = (state) => {
  return {
    regData: state.regData,
    network: state.network,
  };
};

const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux/RegistrationRedux');

  return {
    res_data: reg => dispatch(actions.res_data(reg)),
    reg_reset: () => dispatch(actions.reg_reset()),
  };
};


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RegistrationTwoScreen);