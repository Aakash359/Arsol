import React, { PureComponent } from "react";

import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { connect } from "react-redux";
import { Images } from '@common';
import CardView from 'react-native-cardview';
import { scale } from "react-native-size-matters";
import Snackbar from 'react-native-snackbar';
import ArsolApi from '@services/ArsolApi';
import { LogoSpinner } from '@components'; 
import {zip_no, phone_no, invoice_no,} from '../../Omni';
import TimeZone from 'react-native-timezone';
import { Color } from '@common';
import ImagePicker from 'react-native-image-picker';
import { CommonActions, StackActions, DrawerActions } from '@react-navigation/native';
class RegistrationThreeScreen extends PureComponent {


  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      country_list : [],
      subscription_list : [],
      state_list : [],

      regNo: '',
      pcno: '',
      scno: '',
      country: '96',
      address: '',
      street: '',
      state_v: '',
      city: '',
      zipcode: '',
      subplan: '1',
      tandc: '',
      timezone: '',
      ccode: '',
      invoicno: '',
      image_data: '',
      image_name: '',
   
    }

  }

  componentDidMount() {
    const { network ,regData} = this.props    
 
    if (!network.isConnected) {
      Snackbar.show({
        text: msg.noInternet,
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: "red"
      });
    } else {
      this.setState({ loading: true }, () => {
        this.getTimeZone()
        this.hit_Country_list()
        this.hit_Subscription_list( regData.email)
      })
     }
  }

  getTimeZone = async() => {
    const timeZone = await TimeZone.getTimeZone().then(zone => zone);
    this.setState({timezone:timeZone})
   }



  hit_Country_list() {
    const { network } = this.props
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

  hit_Subscription_list(email) {
    const { network } = this.props

    ArsolApi.Subscription_api(email)

      .then(responseJson => {
        console.log('Subscription_api', responseJson);

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
                        subscription_list : responseJson.data.data
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
  
  hit_stateApi(){
    const { network } = this.props
    if (!network.isConnected) {
      Snackbar.show({
        text: msg.noInternet,
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: "red"
      });
    } else if(this.state.country!='') {
     
      this.setState({ loading: true,state_list:[] }, () => {
        ArsolApi.StateDetails_api(this.state.country)

        .then(responseJson => {
          console.log('Subscription_dropdown', responseJson);
  
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
                          state_list : responseJson.data.data,
                          state_v:""
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
      })

    }
  }

  //handle press
  handleNext(){

    alert('asj')
    const {
      regNo,
      pcno,
      scno,
      country,
      address,
      street,
      state_v,
      city,
      zipcode,
      subplan,
      tandc,
      timezone,
      ccode,
      invoicno,
    
    } = this.state

    const {network} = this.props

    

    if(regNo.trim()==""){
      Snackbar.show({
        text: 'Enter Registraion No.',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: Color.lgreen
      });
    }else if(pcno.trim()==""){
      Snackbar.show({
        text: 'Please enter Primary Contact..!!',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: Color.lgreen
      });
    }else if (phone_no(pcno) === false) {
      Snackbar.show({
        text: 'Primary Phone No. Invalid',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: Color.lgreen
      });
      
     }else if(scno.trim()!=""){
      if (phone_no(scno) === false) {
        Snackbar.show({
          text: 'Secondary Phone No. Invalid',
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: Color.lgreen
        });
       }
    } else if(country==""){
      Snackbar.show({
        text: 'Select Country',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: Color.lgreen
      });
    }else if(address.trim()==""){
      Snackbar.show({
        text: 'Please enter Address..!!',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: Color.lgreen
      });
    }
    else if(street.trim()==""){
      Snackbar.show({
        text: 'Please enter Street..!!',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: Color.lgreen
      });
    }
    else if(state_v==""){
      Snackbar.show({
        text: 'Select State',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: Color.lgreen
      });
    } else if(city.trim()==""){
      Snackbar.show({
        text: 'Please select City..!!',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: Color.lgreen
      });
    } 
    else if(zipcode.trim()==""){
      Snackbar.show({
        text: 'Please enter Zipcode..!!',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: Color.lgreen
      });
    }else if (zip_no(zipcode) === false) {
      Snackbar.show({
        text: 'Zipcode Invalid',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: Color.lgreen
      });
     } else if(subplan.trim()==""){
      Snackbar.show({
        text: 'Select Subscription Plan',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: Color.lgreen
      });
    } else if(tandc.trim()==""){
      Snackbar.show({
        text: 'Please enter Terms & Conditions..!!',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: Color.lgreen
      });
    }    else if(ccode.trim()==""){ 
      Snackbar.show({
        text: 'Please enter Company Code..!!',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: Color.lgreen
      });
    }else if(invoicno.trim()==""){ 
      Snackbar.show({
        text: 'Please enter Invoice No.',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: Color.lgreen
      });
    }else if (invoice_no(invoicno) === false) {
      Snackbar.show({
        text: 'Invoice No. Invalid',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: Color.lgreen
      });
     } else{
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
          this.hit_registrationApi()
        })
      }
     }
  }

  //hit registration
  hit_registrationApi(){

    const {
      regNo,
      pcno,
      scno,
      country,
      address,
      street,
      state_v,
      city,
      zipcode,
      subplan,
      tandc,
      timezone,
      ccode,
      invoicno,
      image_data,
      image_name,
    } = this.state
    const {regData} = this.props
    
    console.log(this.props.regData)
    ArsolApi.Registration_api(

      regData.fname,
      regData.lname,
      regData.email,
      regData.pan_no,
      regData.gst_no,
      regData.org_name,
      regData.org_tag_name,
      regData.currency,
      regData.constitution,
      regData.bank_name,
      regData.ac_name,
      regData.ac_number,
      regData.ifsc_code,
      regNo,
      pcno,
      scno,
      country,
      address,
      street,
      state_v,
      city,
      zipcode,
      subplan,
      tandc,
      timezone,
      ccode,
      invoicno,
      image_data,
      image_name,
    )

    .then(responseJson => {
      console.log('Registration_api', responseJson);

      if (responseJson.ok) {
        this.setState({
          loading: false,
        });

        if (responseJson.data != null) {
          if (responseJson.data.hasOwnProperty('status')) {

            if (responseJson.data.status == 'success') {
            
              if(responseJson.data.hasOwnProperty('data')){
                if(responseJson.data.data.hasOwnProperty('checksum')){
                  if(responseJson.data.checksum!=''){
                   this.props.navigation.dispatch(
                     CommonActions.reset({
                     index: 1,
                     routes: [
                       { name: 'Login' },
                       {
                         name: 'PayTM',
                         params: { paytm_details: {
                       mode: 'Staging', // 'Staging' or 'Production'
                       MID: responseJson.data.data.paytmparams.MID,
                       INDUSTRY_TYPE_ID: responseJson.data.data.paytmparams.INDUSTRY_TYPE_ID,
                       WEBSITE: responseJson.data.data.paytmparams.WEBSITE,
                       CHANNEL_ID: responseJson.data.data.paytmparams.CHANNEL_ID,
                       TXN_AMOUNT:responseJson.data.data.paytmparams.TXN_AMOUNT, // String
                       ORDER_ID: responseJson.data.data.paytmparams.ORDER_ID, // String
                       EMAIL: responseJson.data.data.paytmparams.EMAIL, // String
                       MOBILE_NO: responseJson.data.data.paytmparams.MOBILE_NO, // String
                       CUST_ID: responseJson.data.data.paytmparams.CUST_ID, // String
                       CHECKSUMHASH: responseJson.data.data.checksum, //From your server using PayTM Checksum Utility 
                       CALLBACK_URL: responseJson.data.data.paytmparams.CALLBACK_URL,
                                       } },
                       },
                     ],
                   })
                 );
                  }
               }else{
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

  //imagepicker
  selectPhotoTapped() {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true
      }
    };

    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled photo picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        let source = { uri: response.uri };

        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.setState({

         
          image_data:response.data,
          image_name:response.fileName

        });
      }
    });
  }

//   restrict = (event) => {
         
         

//         const regex = value.replace("/[^A-Za-z]/ig,");

//         const key = String.fromCharCode(!event.charCode ? event.which : event.charCode);

//             if (!regex.test(key)) {

//             event.preventDefault(); 

//            return false;

//     }

// }


  render() {
    const { country_list, subscription_list } = this.state

    return (
      <View style={{ flex: 1 ,backgroundColor:"white",}}>
     
      <View style={{marginLeft:scale(80),marginTop:scale(25),
            width:scale(180),height:scale(40),borderRadius:scale(4), backgroundColor:'#aeea00'}}>
              <Text style={{ marginTop:scale(5), textAlign: 'center', 
              paddingBottom: scale(20), fontSize: scale(18), fontWeight: 'bold' }}>Registration</Text>
            </View>
      <CardView
          height={400}
          width={330}
          style={{backgroundColor:'#eceff1'}}
          cardElevation={2}
          cardMaxElevation={2}
          cornerRadius={20}
          marginTop={10}
          marginLeft={15}>

        <KeyboardAwareScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          enableOnAndroid={true}
          keyboardShouldPersistTaps="handled">
<LogoSpinner loading={this.state.loading} />
          <View style={styles.container}>

             
    
        
            <View>
            <View style={{ flexDirection: 'row',  width: scale(200), }}>
              <Text style={styles.txt}>Registration Number</Text>
              <Text style={{ color: 'red', fontSize: scale(12), }}>*</Text>
              </View>
              <View style={styles.userInput}>
               
                <TextInput
                  onSubmitEditing={() => { this.regTextInput.focus(); }}
                  style={styles.input}
                  placeholder={'Registration No'}
                  autoCorrect={false}
                  autoCapitalize={'none'}
                  returnKeyType={'next'}
                  placeholderTextColor="grey"
                  underlineColorAndroid="transparent"
                  onChangeText={regNo => this.setState({ regNo })}
                  value={this.state.regNo}
                  maxLength={21}q
                  
                />
              </View>

            </View>

            <View>
            <View style={{ flexDirection: 'row',  width: scale(200), }}>
            <Text style={styles.txt} numberOfLines={1}>Primary Contact Number</Text>
                <Text style={{ color: 'red', fontSize: scale(12), }}>*</Text>
              </View>
              
              <View style={styles.userInput}>

                <TextInput
                ref={(input) => { this.regTextInput = input; }}
                                onSubmitEditing={() => { this.priTextInput.focus(); }}
                               
                  style={styles.input}
                  placeholder={'9876543210'}
                  autoCorrect={false}
                  autoCapitalize={'none'}
                  returnKeyType={'next'}
                  placeholderTextColor="grey"
                  underlineColorAndroid="transparent"
                  onChangeText={pcno => this.setState({ pcno })}
                  value={this.state.pcno}
                  keyboardType='phone-pad'
                  maxLength={10}
                />
              </View>

            </View>

            <View>
              <Text style={styles.txt}>Secondary Contact Number</Text>
              <View style={styles.userInput}>

                <TextInput
                  ref={(input) => { this.priTextInput = input; }}
                                onSubmitEditing={() => { this.secTextInput.focus(); }}
                  style={styles.input}
                  placeholder={'9876543210'}
                  autoCorrect={false}
                  autoCapitalize={'none'}
                  returnKeyType={'next'}
                  placeholderTextColor="grey"
                  underlineColorAndroid="transparent"
                  onChangeText={scno => this.setState({ scno })}
                  value={this.state.scno}
                  keyboardType='phone-pad'
                  maxLength={10}
                />
              </View>

            </View>

            <View>
            <View style={{ flexDirection: 'row',  width: scale(200), }}>
            <Text style={styles.txt}>Country</Text>
                <Text style={{ color: 'red', fontSize: scale(12), }}>*</Text>
              </View>
             
              <View style={styles.userInput}>

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
                  this.setState({ country},()=>{this.hit_stateApi()})}
                  value={this.state.country}
          
                />
              </View>

            </View>

            <View>
            <View style={{ flexDirection: 'row',  width: scale(200), }}>
            <Text style={styles.txt}>Address</Text>
                <Text style={{ color: 'red', fontSize: scale(12), }}>*</Text>
              </View>
            
              <View style={styles.userInput}>

                <TextInput
                   ref={(input) => { this.secTextInput = input; }}
                                onSubmitEditing={() => { this.addTextInput.focus(); }}
                  style={styles.input}
                  placeholder={'Address'}
                  autoCorrect={false}
                  autoCapitalize={'none'}
                  returnKeyType={'next'}
                  placeholderTextColor="grey"
                  underlineColorAndroid="transparent"
                  onChangeText={address => this.setState({ address })}
                  value={this.state.address}
                  
                />
              </View>

            </View>

            <View>
            <View style={{ flexDirection: 'row',  width: scale(200), }}>
            <Text style={styles.txt}>Street</Text>
                <Text style={{ color: 'red', fontSize: scale(12), }}>*</Text>
              </View>
             
              <View style={styles.userInput}>

                <TextInput
                   ref={(input) => { this.addTextInput = input; }}
                                onSubmitEditing={() => { this.strTextInput.focus(); }}
                  style={styles.input}
                  placeholder={'Street'}
                  autoCorrect={false}
                  autoCapitalize={'none'}
                  returnKeyType={'next'}
                  placeholderTextColor="grey"
                  underlineColorAndroid="transparent"
                  onChangeText={street => this.setState({ street })}
                  value={this.state.street}
                />
              </View>

            </View>

            <View>
            <View style={{ flexDirection: 'row',  width: scale(200), }}>
            <Text style={styles.txt}>State</Text>
                <Text style={{ color: 'red', fontSize: scale(12), }}>*</Text>
              </View>
             
              <View style={styles.userInput}>

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
                  items={this.state.state_list}
                  onValueChange={(state_v) => {this.setState({state_v})} }
                  value={this.state.state_v}
                />

                

              </View>

            </View>

            <View>
            <View style={{ flexDirection: 'row',  width: scale(200), }}>
            <Text style={styles.txt}>City</Text>
                <Text style={{ color: 'red', fontSize: scale(12), }}>*</Text>
              </View>
              
              <View style={styles.userInput}>

                <TextInput
                   ref={(input) => { this.strTextInput = input; }}
                                onSubmitEditing={() => { this.citTextInput.focus(); }}
                  style={styles.input}
                  placeholder={'City'}
                  autoCorrect={false}
                  autoCapitalize={'none'}
                  returnKeyType={'next'}
                  placeholderTextColor="grey"
                  underlineColorAndroid="transparent"
                  onChangeText={city => this.setState({ city })}
                  value={this.state.city}
                />
              </View>

            </View>

            <View>
            <View style={{ flexDirection: 'row',  width: scale(200), }}>
            <Text style={styles.txt}>ZipCode</Text>
                <Text style={{ color: 'red', fontSize: scale(12), }}>*</Text>
              </View>
              
              <View style={styles.userInput}>

                <TextInput
                   ref={(input) => { this.citTextInput = input; }}
                                onSubmitEditing={() => { this.zipTextInput.focus(); }}
                  style={styles.input}
                  placeholder={'Zip/Postal Code'}
                  autoCorrect={false}
                  autoCapitalize={'none'}
                  returnKeyType={'next'}
                  placeholderTextColor="grey"
                  underlineColorAndroid="transparent"
                  onChangeText={zipcode => this.setState({ zipcode })}
                  value={this.state.zipcode}
                  keyboardType='number-pad'
                  maxLength={6}
                />
              </View>

            </View>

            <View>
            <View style={{ flexDirection: 'row',  width: scale(200), }}>
            <Text style={styles.txt} numberOfLines={1}>Subscription Plan</Text>
                <Text style={{ color: 'red', fontSize: scale(12), }}>*</Text>
              </View>
              
              <View style={styles.userInput}>

              <RNPickerSelect
                  placeholder={{
                    label: "Subscription Plan",
                    value: "",
                    color: 'black',
                    fontSize: scale(12),
                    fontWeight: 'bold',
                  }}
                  style={{
                    inputIOS: styles.inputIOS,
                    inputAndroid: styles.inputAndroid,
                  }}
                  items={subscription_list}
                  onValueChange={(subplan) => this.setState({ subplan })}
                  value={this.state.subplan}
          
                />

              </View>

            </View>

            <View>
            <View style={{ flexDirection: 'row',  width: scale(200), }}>
            <Text style={styles.txt} numberOfLines={1}>Terms & Conditions</Text>
                <Text style={{ color: 'red', fontSize: scale(12), }}>*</Text>
              </View>
              
              <View style={styles.userInputTC}>

                <TextInput
                  ref={(input) => { this.zipTextInput = input; }}
                  onSubmitEditing={() => { this.temTextInput.focus(); }}
                  style={styles.inputTC}
                  placeholder={'Terms & Conditions'}
                  autoCorrect={false}
                  autoCapitalize={'none'}
                  returnKeyType={'next'}
                  numberOfLines={1}
                  multiline={true}
                  placeholderTextColor="grey"
                  underlineColorAndroid="transparent"
                  onChangeText={tandc => this.setState({ tandc })}
                  value={this.state.tandc}
                 
                />
              </View>

            </View>

            <View>
              <Text style={styles.txt}>Time Zone</Text>
              <View style={styles.userInput}>

                <TextInput
                 ref={(input) => { this.temTextInput = input; }}
                                onSubmitEditing={() => { this.timeTextInput.focus(); }}
                  style={styles.input}
                  autoCorrect={false}
                  autoCapitalize={'none'}
                  returnKeyType={'next'}
                  placeholderTextColor="grey"
                  underlineColorAndroid="transparent"
                  onChangeText={timezone => this.setState({ timezone })}
                  value={this.state.timezone}
                />
              </View>

            </View>

            <View>
            <View style={{ flexDirection: 'row',  width: scale(200), }}>
            <Text style={styles.txt} numberOfLines={1}>Company Code</Text>
                <Text style={{ color: 'red', fontSize: scale(12), }}>*</Text>
              </View>
             
              <View style={styles.userInput}>

                   
                <TextInput
                   ref={(input) => { this.timeTextInput = input; }}
                                onSubmitEditing={() => { this.comTextInput.focus(); }}
                  style={styles.input}
                  placeholder={'Company Code'}
                  autoCorrect={false}
                  autoCapitalize={'none'}
                  returnKeyType={'next'}
                  placeholderTextColor="grey"
                  underlineColorAndroid="transparent"
                 
                  
                  onChangeText={(ccode) => {

      
                    this.setState({
                      ccode,
                    })
                  }}

                  
                  
                  value={this.state.ccode}
                  keyboardType='defualt'
                  maxLength={3}
                />
              </View>

            </View>

            <View>
            <View style={{ flexDirection: 'row',  width: scale(200), }}>
            <Text style={styles.txt} numberOfLines={1}>Initial Invoice Number</Text>
                <Text style={{ color: 'red', fontSize: scale(12), }}>*</Text>
              </View>
             
              <View style={styles.userInput}>

                <TextInput
                   ref={(input) => { this.comTextInput = input; }}
                                onSubmitEditing={() => { this.iniTextInput.focus(); }}
                  style={styles.input}
                  placeholder={'Initial Invoice Number'}
                  autoCorrect={false}
                  autoCapitalize={'none'}
                  returnKeyType={'next'}
                  placeholderTextColor="grey"
                  underlineColorAndroid="transparent"
                  onChangeText={invoicno => this.setState({ invoicno })}
                  value={this.state.invoicno}
                  keyboardType='numeric'
                  maxLength={3}
                />
              </View>

            </View>

            <View>
              <Text style={styles.txt} numberOfLines={1}>Upload Image(.png, .jpg, .jpeg)</Text>
              <View style={styles.userInput}>


                <View style={{
                  flexDirection: "row",
                  height: scale(40),
                  justifyContent: 'space-around',
                  alignItems: 'center'
                }}>

                  <TouchableOpacity
                    onPress={this.selectPhotoTapped.bind(this)}
                    style={{
                      width: "90%",
                      height: "90%",
                      justifyContent:"center",
                      alignItems:'center'
                      //backgroundColor: 'red'
                    }}>

                    <Text style={{ color: 'black', fontSize: scale(15), }}
                      numberOfLines={1}
                    >{this.state.image_name}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {this.setState({image_data:"",
                                                   image_name:''})}}>

                    <Image
                      source={Images.reset}
                      style={{
                        width: scale(15),
                        height: scale(15)
                      }}
                      resizeMode={'contain'}
                    />
                  </TouchableOpacity>

                </View>
              </View>
              

            </View>
            
          </View>

         
        </KeyboardAwareScrollView>
 </CardView>

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
              <Text style={styles.txt_next}
                numberOfLines={1}
              >Submit</Text>
            </TouchableOpacity>

          </View>

          <View
            style={{
              marginTop: scale(20),
              marginBottom: scale(20),
              justifyContent: 'center',
              alignItems: 'center',
            }}>

            <Text style={{color:'#ff8f00'}}>Already a member ?</Text>

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
          <Text style={{color:'grey',marginTop:scale(20),
          textAlign:'center'}}> © ARSOL 2020-2021</Text>
        
          </View>

      </View>
    );
  }
}




const styles = StyleSheet.create({
  container: {

    marginTop: scale(-10),
    marginHorizontal: scale(30),
    paddingVertical:scale(40),
    marginLeft:scale(15),
    marginRight:scale(15),

  },

  userInput: {
    marginTop:scale(5),
    height: scale(40),
    backgroundColor: 'white',
    marginBottom: scale(15),
    borderColor: "#e0e0e0",
    borderWidth: scale(1),
    borderRadius: scale(4)
  },
  userInputTC: {
    height: scale(100),
    backgroundColor: 'white',
    marginBottom: scale(15),
    borderColor: "#e0e0e0",
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
  inputTC: {
    color: '#000',
    fontSize: scale(12)
  },
  txt: {
    fontSize: scale(12),
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'auto'
  },
  txt_next: {
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


RegistrationThreeScreen.defaultProps = {
  network: '',
  regData:'',
}


const mapStateToProps = (state) => {
  return {
   regData:state.regData,
   network: state.network,
};
};

const mapDispatchToProps = dispatch => {
  const {actions} = require('@redux/RegistrationRedux');

  return {
    res_data: reg => dispatch(actions.res_data(reg)),
    reg_reset: () => dispatch(actions.reg_reset()),
  };
};


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RegistrationThreeScreen);