import React, { PureComponent } from "react";

import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { connect } from "react-redux";
import { Config, Color } from '@common';
const server = Config.SuitCRM;

import { scale } from "react-native-size-matters";
import { StackActions } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import Snackbar from 'react-native-snackbar';
const msg = Config.SuitCRM;
import ArsolApi from '@services/ArsolApi';
import { LogoSpinner } from '@components'; 

class ContactOneScreen extends PureComponent {


  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      firstName: '',
      lastName: '',
      email: '',
      Currency: '47',
      language : '1',
      lang_list:[],
      currency_list: [],
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
        this.hit_Language_list()
  
      })
     }
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
  hit_Language_list() {
    const { network } = this.props
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

                  if (responseJson.data.hasOwnProperty("data")) {
                    if (responseJson.data.data.length > 0) {

                      this.setState({
                        lang_list: responseJson.data.data
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

  nextPress(){
    this.props.navigation.navigate('ContactTwo')
  }

  render() {



    return (
      <View style={{
        flex: 1,
      }}>
        <KeyboardAwareScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          enableOnAndroid={true}
          keyboardShouldPersistTaps="handled">
<LogoSpinner loading={this.state.loading} />
          <View style={styles.container}>

            <View>
              <Text style={{ textAlign: 'center', paddingBottom: scale(20), fontSize: scale(18), fontWeight: 'bold' }}>New Contact</Text>
            </View>

            <View>

              <View style={{ flexDirection: 'row', width: scale(200) }}>
                <Text style={styles.txt}>Primary Contact</Text>
                <Text style={{ color: 'red', fontSize: scale(12), }}>*</Text>
              </View>
              <View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                  <View style={{
                    height: scale(40),
                    backgroundColor: 'white',
                    borderColor: 'grey',
                    borderWidth: scale(1),
                    borderRadius: scale(5),
                    marginBottom: scale(10),
                    width: '28%'
                  }}>

                    <RNPickerSelect
                      placeholder={{
                        label: "Salutation",
                        value: "",
                        color: 'black',
                        fontSize: scale(12),
                        fontWeight: 'bold',
                      }}
                      items={[
                        { label: 'Mr.', value: 'Mr.' },
                        { label: 'Mrs.', value: 'Mrs.' },

                      ]}
                      onValueChange={(value) => { this.setState({ item_type: value }) }}
                    />

                  </View>

                  <TextInput
                    style={{
                      height: scale(40),
                      backgroundColor: 'white',
                      borderColor: 'grey',
                      borderWidth: scale(1),
                      borderRadius: scale(5),
                      width: '35%'
                    }}
                    placeholder='First Name'
                    autoCorrect={false}
                    autoCapitalize={'none'}
                    returnKeyType={'next'}
                    underlineColorAndroid="transparent"
                    onChangeText={lastName => this.setState({ lastName })}

                  />
                  <TextInput
                    style={{
                      height: scale(40),
                      backgroundColor: 'white',
                      borderColor: 'grey',
                      borderWidth: scale(1),
                      borderRadius: scale(5),
                      width: '35%'
                    }}
                    placeholder='Last Name'
                    autoCorrect={false}
                    autoCapitalize={'none'}
                    returnKeyType={'next'}
                    underlineColorAndroid="transparent"
                    onChangeText={lastName => this.setState({ lastName })}

                  />
                </View>
              </View>
            </View>


            <View>
              <View style={{ flexDirection: 'row', width: scale(200) }}>
                <Text style={styles.txt}>Company Name</Text>
                <Text style={{ color: 'red', fontSize: scale(12), }}>*</Text>
              </View>
              <View style={styles.userInput}>

                <TextInput
                  style={styles.input}
                  autoCorrect={false}
                  autoCapitalize={'none'}
                  returnKeyType={'next'}
                  underlineColorAndroid="transparent"
                  onChangeText={lastName => this.setState({ lastName })}

                />
              </View>
            </View>

            <View>
              <View style={{ flexDirection: 'row', width: scale(200) }}>
                <Text style={styles.txt}>Display Name</Text>
                <Text style={{ color: 'red', fontSize: scale(12), }}>*</Text>
              </View>
              <View style={styles.userInput}>

                <TextInput
                  style={styles.input}
                  autoCorrect={false}
                  autoCapitalize={'none'}
                  returnKeyType={'next'}
                  underlineColorAndroid="transparent"
                  onChangeText={lastName => this.setState({ lastName })}

                />
              </View>
            </View>

            <View>
              <View style={{ width: scale(200) }}>
                <Text style={styles.txt}>Contact Email</Text>
              </View>
              <View style={styles.userInput}>

                <TextInput
                  style={styles.input}
                  autoCorrect={false}
                  autoCapitalize={'none'}
                  returnKeyType={'next'}
                  underlineColorAndroid="transparent"
                  onChangeText={lastName => this.setState({ lastName })}

                />
              </View>
            </View>

            <View>
              <View style={{ width: scale(200) }}>
                <Text style={styles.txt}>GST Number</Text>
              </View>
              <View style={styles.userInput}>

                <TextInput
                  style={styles.input}
                  autoCorrect={false}
                  autoCapitalize={'none'}
                  returnKeyType={'next'}
                  underlineColorAndroid="transparent"
                  onChangeText={lastName => this.setState({ lastName })}

                />
              </View>
            </View>


            <View>
              <View>
                <Text style={styles.txt}>Contact Phone</Text>
              </View>
              <View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <TextInput
                    style={{
                      height: scale(40),
                      backgroundColor: 'white',
                      borderColor: 'grey',
                      borderWidth: scale(1),
                      borderRadius: scale(5),
                      marginBottom: scale(10),
                      width: '48%'
                    }}
                    placeholder='Phone'
                    autoCorrect={false}
                    autoCapitalize={'none'}
                    returnKeyType={'next'}
                    underlineColorAndroid="transparent"
                    onChangeText={lastName => this.setState({ lastName })}

                  />
                  <TextInput
                    style={{
                      height: scale(40),
                      backgroundColor: 'white',
                      borderColor: 'grey',
                      borderWidth: scale(1),
                      borderRadius: scale(5),
                      width: '48%'
                    }}
                    placeholder='Mobile'
                    autoCorrect={false}
                    autoCapitalize={'none'}
                    returnKeyType={'next'}
                    underlineColorAndroid="transparent"
                    onChangeText={lastName => this.setState({ lastName })}

                  />
                </View>
              </View>
            </View>

            <View>
              <View style={{ width: scale(200) }}>
                <Text style={styles.txt}>Website</Text>
              </View>
              <View style={styles.userInput}>

                <TextInput
                  style={styles.input}
                  autoCorrect={false}
                  autoCapitalize={'none'}
                  returnKeyType={'next'}
                  underlineColorAndroid="transparent"
                  onChangeText={lastName => this.setState({ lastName })}

                />
              </View>
            </View>

            <View>
              <View style={{ width: scale(200) }}>
                <Text style={styles.txt}>Currency</Text>
              </View>
                <View style={styles.userInput}>

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
    items={this.state.currency_list}
    onValueChange={(Currency) => 
    this.setState({ Currency},()=>{this.setState({Currency})})}
    value={this.state.Currency}

  />
</View>
            </View>

            <View>
              <View style={{ width: scale(200) }}>
                <Text style={styles.txt}>Payment Terms</Text>
              </View>
              <View style={styles.userInput}>

                <TextInput
                  style={styles.input}
                  autoCorrect={false}
                  autoCapitalize={'none'}
                  returnKeyType={'next'}
                  underlineColorAndroid="transparent"
                  onChangeText={lastName => this.setState({ lastName })}

                />
              </View>
            </View>

            <View>
              <View style={{ width: scale(200) }}>
                <Text style={styles.txt}>Language</Text>
              </View>
              <View style={styles.userInput}>

<RNPickerSelect
    placeholder={{
      label: "Select Language",
      value: "",
      color: 'black',
      fontSize: scale(12),
      fontWeight: 'bold',
    }}
    style={{
      inputIOS: styles.inputIOS,
      inputAndroid: styles.inputAndroid,
    }}
    items={this.state.lang_list}
    onValueChange={(language) => 
    this.setState({ language},()=>{this.setState({language})})}
    value={this.state.language}

  />
</View>
            </View>

            <View>
              <View style={{ width: scale(200) }}>
                <Text style={styles.txt}>Facebook</Text>
              </View>
              <View style={styles.userInput}>

                <TextInput
                  style={styles.input}
                  autoCorrect={false}
                  autoCapitalize={'none'}
                  returnKeyType={'next'}
                  underlineColorAndroid="transparent"
                  onChangeText={lastName => this.setState({ lastName })}

                />
              </View>
            </View>

            <View>
              <View style={{ width: scale(200) }}>
                <Text style={styles.txt}>Twitter</Text>
              </View>
              <View style={styles.userInput}>

                <TextInput
                  style={styles.input}
                  autoCorrect={false}
                  autoCapitalize={'none'}
                  returnKeyType={'next'}
                  underlineColorAndroid="transparent"
                  onChangeText={lastName => this.setState({ lastName })}

                />
              </View>
            </View>


            <View
              style={{
                flexDirection : 'row',
                marginTop: scale(30),
                marginBottom: scale(50),
                justifyContent: 'space-around',
                alignItems: 'center',
              }}>

              <TouchableOpacity
                onPress={() => { this.props.navigation.goBack() }}
                style={{
                  width: scale(130),
                  height: scale(40),
                  borderRadius: scale(20),
                  backgroundColor: '#3498DB',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Text style={styles.txt_log}
                  numberOfLines={1}
                >Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => { this.nextPress() }}
                style={{
                  width: scale(130),
                  height: scale(40),
                  borderRadius: scale(20),
                  backgroundColor: '#3498DB',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Text style={styles.txt_log}
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


const styles = StyleSheet.create({
  container: {
    paddingHorizontal: scale(10),
    marginTop: scale(5),
    marginHorizontal: scale(10),

  },

  userInput: {
    height: scale(40),
    backgroundColor: 'white',
    marginBottom: scale(10),
    borderColor: 'grey',
    borderWidth: scale(1),
    borderRadius: scale(5)
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




ContactOneScreen.defaultProps = {
  session: [],

  connection_status: ''
}


const mapStateToProps = (state) => {
  return {


    session: state.user.session_id,
    network: state.network,



  };
};


export default connect(
  mapStateToProps,
  null
)(ContactOneScreen);