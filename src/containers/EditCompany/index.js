import React, { PureComponent } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    FlatList,
    StyleSheet,
    TextInput,
    StatusBar,
    TouchableHighlight
} from 'react-native';

import CardView from 'react-native-cardview';
import { connect } from "react-redux";
import { Images, Color, Config } from '@common';
import { scale } from "react-native-size-matters";
import Snackbar from 'react-native-snackbar';
import DatePicker from 'react-native-datepicker';
import RNPickerSelect from 'react-native-picker-select';
import { NavigationBar } from '@components';
import ArsolApi from '@services/ArsolApi';
import { LogoSpinner } from '@components';
const msg = Config.SuitCRM;
import { gest_no,zip_no, phone_no, pan_no, } from '../../Omni';
import { CommonActions, StackActions, DrawerActions } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import ImagePicker from 'react-native-image-picker';


class EditCompanyScreen extends PureComponent {


    constructor(props) {
        super(props);
        this.state = {
            loading: false,

            currency_list: [],
            constiution_list: [],
            country_list: [],
            state_list: [],

            gstNo: '',
            email: '',
            org: "",
            org_tag: '',
            currency_value: '',
            constitution_value: "",
            pan_card: '',
            bank_name: '',
            acc_name: '',
            acc_no: '',
            ifsc: '',
            regst_no: '',
            primary_no: "",
            secondary_no: "",
            country_value: "",
            address: '',
            street: '',
            state_value: "",
            city: '',
            zipcode: '',
            timezone: '',
            termsandcon: 'Thanks for your Business ',
            compcode: '',
            image_path: '',
            image_name: '',
            
            

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
              

                this.hit_CompanyInfo()
                this.hit_Currency_list()
                this.hit_Constituion_list()
                this.hit_Country_list()
            })

        }
    }

    hit_CompanyInfo() {
        const { network, user_id, user_type } = this.props
        ArsolApi.CompanyInfo_api(user_id, user_type)

            .then(responseJson => {
                console.log('CompanyInfo_api', responseJson);

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
                                            var jsonObj = responseJson.data.data[0]

                                            this.setState({

                                                gstNo: jsonObj.gstno,
                                                email: jsonObj.email,
                                                org: jsonObj.org,
                                                currency_value: jsonObj.currency,
                                                constitution_value: jsonObj.constitution,
                                                pan_card: jsonObj.pan_Card,
                                                bank_name: jsonObj.bank_name,
                                                acc_name: jsonObj.ac_name,
                                                acc_no: jsonObj.ac_no,
                                                ifsc: jsonObj.ifsc,
                                                regst_no: jsonObj.reg_no,
                                                primary_no: jsonObj.primary_no,
                                                secondary_no: jsonObj.secondary_no,
                                                country_value: jsonObj.country,
                                                address: jsonObj.address,
                                                street: jsonObj.street,
                                                state_value: jsonObj.state,
                                                city: jsonObj.city,
                                                timezone: jsonObj.time_zone,
                                                compcode: jsonObj.company_code,
                                                image_name: jsonObj.image_name,
                                                image_path: jsonObj.image_path,
                                                org_tag: jsonObj.org_tag,
                                                zipcode:jsonObj.zipcode
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


    hit_stateApi(country_value) {
        const { network } = this.props
        if (!network.isConnected) {
            Snackbar.show({
                text: msg.noInternet,
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: "red"
            });
        } else if (country_value != '') {

            this.setState({ loading: true, state_list: [] }, () => {
                ArsolApi.StateDetails_api(country_value)

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


                                                    this.setState({
                                                        state_list: responseJson.data.data,
                                                        state_value : this.state.state_value
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
                let source =  response.uri ;
                // You can also display the image using data:
                // let source = { uri: 'data:image/jpeg;base64,' + response.data };

                this.setState({


                    image_path: response.data,
                    image_name: response.fileName,
               

                });
            }
        });
    }

    //updatePress
    updatePress(){
        const {gstNo,org,org_tag,currency_value,constitution_value,pan_card,
              regst_no,primary_no,secondary_no,country_value,address,street,state_value,
              city,zipcode,termsandcon,image_path,image_name}=this.state

              const{network}=this.props

              if(currency_value.trim()==""){
                Snackbar.show({
                  text: 'Select Currency',
                  duration: Snackbar.LENGTH_SHORT,
                  backgroundColor: Color.lgreen
                });
               } if(pan_card.trim()==""){
                Snackbar.show({
                  text: 'Enter Pan Card No.',
                  duration: Snackbar.LENGTH_SHORT,
                  backgroundColor: Color.lgreen
                });
               }else if (pan_no(pan_card) === false) {
                Snackbar.show({
                  text: 'Pan No. Invalid',
                  duration: Snackbar.LENGTH_SHORT,
                  backgroundColor: Color.lgreen
                });
               }if(regst_no.trim()==""){
                Snackbar.show({
                  text: 'Enter Registraion No.',
                  duration: Snackbar.LENGTH_SHORT,
                  backgroundColor: Color.lgreen
                });
              }else if(primary_no.trim()==""){
                Snackbar.show({
                  text: 'Please enter Primary Contact..!!',
                  duration: Snackbar.LENGTH_SHORT,
                  backgroundColor: Color.lgreen
                });
              }else if (phone_no(primary_no) === false) {
                Snackbar.show({
                  text: 'Primary Phone No. Invalid',
                  duration: Snackbar.LENGTH_SHORT,
                  backgroundColor: Color.lgreen
                });
                
               }else if(secondary_no.trim()!=""){
                if (phone_no(secondary_no) === false) {
                  Snackbar.show({
                    text: 'Secondary Phone No. Invalid',
                    duration: Snackbar.LENGTH_SHORT,
                    backgroundColor: Color.lgreen
                  });
                 }
              } else if(country_value==""){
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
              else if(state_value==""){
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
               }else if(termsandcon.trim()==""){
                Snackbar.show({
                  text: 'Please enter Terms & Conditions..!!',
                  duration: Snackbar.LENGTH_SHORT,
                  backgroundColor: Color.lgreen
                });
              }else if(gstNo!="" && gest_no(gstNo.toUpperCase()) === false){
     
                Snackbar.show({
                  text: 'Gst No. Invalid',
                  duration: Snackbar.LENGTH_SHORT,
                  backgroundColor: Color.lgreen
                });
              
            }else{
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
                    this.hit_updateApi()
                  })
                }
               }
    }

    

    hit_updateApi(){

        const {gstNo,org_tag,currency_value,constitution_value,pan_card,
            regst_no,primary_no,secondary_no,country_value,address,street,state_value,
            city,zipcode,termsandcon,image_path,image_name}=this.state

        const {user_id,user_type}=this.props    

        
       
        

        ArsolApi.RegistrationUpdate_api(
            user_id,
            user_type,
            gstNo,
            org_tag,
            currency_value,
            constitution_value,
            pan_card,
            regst_no,
            primary_no,
            secondary_no,
            country_value,
            address,
            street,
            state_value,
            city,
            zipcode,
            termsandcon,
            image_path,
            image_name
          )
    
        .then(responseJson => {
          console.log('RegistrationUpdate_api', responseJson);
    
          if (responseJson.ok) {
            this.setState({
              loading: false,
            });
    
            if (responseJson.data != null) {
              if (responseJson.data.hasOwnProperty('status')) {
    
                if (responseJson.data.status == 'success') {
                
                    alert(responseJson.data.message)
                    this.props.navigation.dispatch(
                        CommonActions.reset({
                            index: 0,
                            routes: [
                                { name: 'Auth' },
                            ],
                        })
                    )
                   
    
               
    
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

    _renderListItem() {
        const { currency_list, constiution_list, country_list } = this.state;
     
        return (

<View style={{ flex:1}}>

            <CardView
          height={505}
          width={330}
          style={{backgroundColor:'#eceff1'}}
          cardElevation={2}
          cardMaxElevation={2}
          cornerRadius={20}
          marginTop={10}
          marginLeft={15}>
            <KeyboardAwareScrollView
              keyboardShouldPersistTaps="handled"
              enableOnAndroid={true}
              contentContainerStyle={{flexGrow: 1}}
            > 
            <View style={{ margin: scale(15) }}>

               

                    <View style={{ marginTop: scale(5) }}>

                        <Text style={{ fontSize: scale(12), fontWeight: 'bold' }}>GST No.</Text>

                        <View style={{
                            borderWidth: 1,
                            height: scale(45),
                            borderRadius: scale(5),
                            backgroundColor:"white",
                            borderColor:"#bdbdbd",
                            marginTop: scale(3),
                        }}>

                            <TextInput
                                style={{
                                    width: '70%',
                                    fontSize: scale(12),
                                    marginStart: scale(7),
                                    color: '#000'
                                }}
                                
                                onSubmitEditing={() => { this.secondTextInput.focus(); }}
                                
                                autoCorrect={false}
                                autoCapitalize={'none'}
                                returnKeyType={'next'}
                                underlineColorAndroid="transparent"
                                onChangeText={gstNo => this.setState({ gstNo })}
                                value={this.state.gstNo}
                            />
                        </View>

                    </View>

                    <View style={{ marginTop: scale(5) }}>

                        <Text style={{ fontSize: scale(12), fontWeight: 'bold' }}>Email Id</Text>

                        <View style={{
                            borderWidth: 1,
                            height: scale(45),
                            borderRadius: scale(5),
                            borderColor:"#bdbdbd",
                            marginTop: scale(3),
                            backgroundColor:"#ddd"
                        }}>

                            <TextInput
                                style={{
                                    width: '70%',
                                    fontSize: scale(12),
                                    marginStart: scale(7),
                                    color: '#000'
                                }}
                                
                                autoCorrect={false}
                                autoCapitalize={'none'}
                                returnKeyType={'next'}
                                underlineColorAndroid="transparent"
                                onChangeText={email => this.setState({ email })}
                                value={this.state.email}
                                editable={false}
                            />

                        </View>

                    </View>

                    <View style={{ marginTop: scale(5) }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: scale(12), fontWeight: 'bold' }}>Organisation Name</Text>
                            <Text style={{ color: 'red', fontSize: scale(12), }}>*</Text>
                        </View>

                        <View style={{
                            borderWidth: 1,
                            height: scale(45),
                            borderRadius: scale(5),
                            borderColor:"#bdbdbd",
                            
                            marginTop: scale(3),
                            backgroundColor:'#ddd'
                        }}>
                            <TextInput
                                style={{
                                
                                    width: '70%',
                                    fontSize: scale(12),
                                    marginStart: scale(7),
                                    color: '#000'
                                }}
                                placeholder={'Customer Name'}
                                autoCorrect={false}
                                autoCapitalize={'none'}
                                returnKeyType={'next'}
                                placeholderTextColor="grey"
                                underlineColorAndroid="transparent"
                                onChangeText={org => this.setState({ org })}
                                value={this.state.org}
                                editable={false}
                            />
                        </View>

                    </View>

                    <View style={{ marginTop: scale(5) }}>
                     
                            <Text style={{ fontSize: scale(12), fontWeight: 'bold' }}>Organization Tag Name (Optional)</Text>
                           
                   

                        <View style={{
                            borderWidth: 1,
                            height: scale(45),
                            borderRadius: scale(5),
                            backgroundColor:"white",
                            borderColor:"#bdbdbd",
                            marginTop: scale(3),
                        }}>
                            <TextInput
                                style={{

                                    width: '70%',
                                    fontSize: scale(12),
                                    marginStart: scale(7),
                                    color: '#000'
                                }}
                                ref={(input) => { this.secondTextInput = input; }}
                                onSubmitEditing={() => { this.thirdTextInput.focus(); }}
                               
                                placeholder={'Customer Name'}
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

                    <View style={{ marginTop: scale(5) }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: scale(12), fontWeight: 'bold' }}>Currency</Text>
                            <Text style={{ color: 'red', fontSize: scale(12), }}>*</Text>
                        </View>

                        <View style={{
                            borderWidth: 1,
                            height: scale(45),
                            borderRadius: scale(5),
                            backgroundColor:"white",
                            borderColor:"#bdbdbd",
                            marginTop: scale(3),
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
                                items={currency_list}
                                onValueChange={(currency_value) => this.setState({ currency_value })}
                                value={this.state.currency_value}

                            />

                        </View>


                    </View>

                    <View style={{ marginTop: scale(5) }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: scale(12), fontWeight: 'bold' }}>Constitution</Text>
                            <Text style={{ color: 'red', fontSize: scale(12), }}>*</Text>
                        </View>

                        <View style={{
                            borderWidth: 1,
                            height: scale(45),
                            borderRadius: scale(5),
                            backgroundColor:"white",
                            borderColor:"#bdbdbd",
                            marginTop: scale(3),
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
                                items={constiution_list}
                                onValueChange={(constitution_value) => this.setState({ constitution_value })}
                                value={this.state.constitution_value}

                            />

                        </View>


                    </View>

                    <View style={{ marginTop: scale(5) }}>

                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: scale(12), fontWeight: 'bold' }}>Pan Card</Text>
                            <Text style={{ color: 'red', fontSize: scale(12), }}>*</Text>
                        </View>

                        <View style={{
                            borderWidth: 1,
                            height: scale(45),
                            borderRadius: scale(5),
                            backgroundColor:"white",
                            borderColor:"#bdbdbd",
                            marginTop: scale(3),
                        }}>

                            <TextInput
                                style={{
                                    width: '70%',
                                    fontSize: scale(12),
                                    marginStart: scale(7),
                                    color: '#000'
                                }}
                                ref={(input) => { this.thirdTextInput = input; }}
                                onSubmitEditing={() => { this.fourthTextInput.focus(); }}
                                autoCorrect={false}
                                autoCapitalize={'none'}
                                returnKeyType={'next'}
                                underlineColorAndroid="transparent"
                                onChangeText={pan_card => this.setState({ pan_card })}
                                value={this.state.pan_card}
                            />

                        </View>

                    </View>

                    <View style={{ marginTop: scale(5) }}>

                        <Text style={{ fontSize: scale(12), fontWeight: 'bold' }}>Bank Name</Text>

                        <View style={{
                            borderWidth: 1,
                            height: scale(45),
                            borderRadius: scale(5),
                            borderColor:"#bdbdbd",
                            marginTop: scale(3),
                            backgroundColor:"#ddd"
                        }}>

                            <TextInput
                                style={{
                                    width: '70%',
                                    fontSize: scale(12),
                                    marginStart: scale(7),
                                    color: '#000'
                                }}
                                autoCorrect={false}
                                autoCapitalize={'none'}
                                returnKeyType={'next'}
                                placeholderTextColor="grey"
                                underlineColorAndroid="transparent"
                                onChangeText={bank_name => this.setState({ bank_name })}
                                value={this.state.bank_name}
                                editable={false}
                            />
                        </View>

                    </View>

                    <View style={{ marginTop: scale(5) }}>

                        <Text style={{ fontSize: scale(12), fontWeight: 'bold' }}>Account Name</Text>

                        <View style={{
                            borderWidth: 1,
                            height: scale(45),
                            borderRadius: scale(5),
                            borderColor:"#bdbdbd",
                            marginTop: scale(3),
                            backgroundColor:"#ddd"
                        }}>
                            <TextInput
                                style={{
                                    width: '70%',
                                    fontSize: scale(12),
                                    marginStart: scale(7),
                                    color: '#000'
                                }}
                                autoCorrect={false}
                                autoCapitalize={'none'}
                                returnKeyType={'next'}
                                underlineColorAndroid="transparent"
                                onChangeText={acc_name => this.setState({ acc_name })}
                                value={this.state.acc_name}
                                editable={false}
                            />
                        </View>

                    </View>

                    <View style={{ marginTop: scale(5) }}>

                        <Text style={{ fontSize: scale(12), fontWeight: 'bold' }}>Account Number</Text>

                        <View style={{
                            borderWidth: 1,
                            height: scale(45),
                            borderRadius: scale(5),
                            borderColor:"#bdbdbd",
                            marginTop: scale(3),
                            backgroundColor:'#ddd'
                        }}>
                            <TextInput
                                style={{
                                    width: '70%',
                                    fontSize: scale(12),
                                    marginStart: scale(7),
                                    color: '#000'
                                }}
                                autoCorrect={false}
                                autoCapitalize={'none'}
                                returnKeyType={'next'}
                                underlineColorAndroid="transparent"
                                onChangeText={acc_no => this.setState({ acc_no })}
                                value={this.state.acc_no}
                                editable={false}
                            />
                        </View>
                    </View>

                    <View style={{ marginTop: scale(5) }}>

                        <Text style={{ fontSize: scale(12), fontWeight: 'bold' }}>IFSC Code</Text>
                        <View style={{
                            borderWidth: 1,
                            height: scale(45),
                            borderRadius: scale(5),
                            borderColor:"#bdbdbd",
                            marginTop: scale(3),
                            backgroundColor:'#ddd'
                        }}>
                            <TextInput
                                style={{
                                    width: '70%',
                                    fontSize: scale(12),
                                    marginStart: scale(7),
                                    color: '#000'
                                }}
                                autoCorrect={false}
                                autoCapitalize={'none'}
                                returnKeyType={'next'}
                                underlineColorAndroid="transparent"
                                onChangeText={ifsc => this.setState({ ifsc })}
                                value={this.state.ifsc}
                                editable={false}
                            />
                        </View>

                    </View>

                    <View style={{ marginTop: scale(5) }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: scale(12), fontWeight: 'bold' }}>Registration Number</Text>
                            <Text style={{ color: 'red', fontSize: scale(12), }}>*</Text>
                        </View>

                        <View style={{
                            borderWidth: 1,
                            height: scale(45),
                            borderRadius: scale(5),
                            backgroundColor:"white",
                            borderColor:"#bdbdbd",
                            marginTop: scale(3),
                        }}>
                            <TextInput
                                style={{
                                    width: '70%',
                                    fontSize: scale(12),
                                    marginStart: scale(7),
                                    color: '#000'
                                }}
                                ref={(input) => { this.fourthTextInput = input; }}
                                onSubmitEditing={() => { this.fifthTextInput.focus(); }}
                                autoCorrect={false}
                                autoCapitalize={'none'}
                                returnKeyType={'next'}
                                underlineColorAndroid="transparent"
                                onChangeText={regst_no => this.setState({ regst_no })}
                                value={this.state.regst_no}
                            />
                        </View>

                    </View>

                    <View style={{ marginTop: scale(5) }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: scale(12), fontWeight: 'bold' }}>Primary Contact Number</Text>
                            <Text style={{ color: 'red', fontSize: scale(12), }}>*</Text>
                        </View>

                        <View style={{
                            borderWidth: 1,
                            height: scale(45),
                            borderRadius: scale(5),
                            backgroundColor:"white",
                            borderColor:"#bdbdbd",
                            marginTop: scale(3),
                        }}>
                            <TextInput
                                style={{
                                    width: '70%',
                                    fontSize: scale(12),
                                    marginStart: scale(7),
                                    color: '#000'
                                }}
                                ref={(input) => { this.fifthTextInput = input; }}
                                onSubmitEditing={() => { this.sixthTextInput.focus(); }}
                                autoCorrect={false}
                                autoCapitalize={'none'}
                                returnKeyType={'next'}
                                underlineColorAndroid="transparent"
                                onChangeText={primary_no => this.setState({ primary_no })}
                                value={this.state.primary_no}
                                keyboardType='name-phone-pad'
                                maxLength={10}
                            />
                        </View>

                    </View>

                    <View style={{ marginTop: scale(5) }}>

                        <Text style={{ fontSize: scale(12), fontWeight: 'bold' }}>Secondary Contact Number</Text>

                        <View style={{
                            borderWidth: 1,
                            height: scale(45),
                            borderRadius: scale(5),
                            backgroundColor:"white",
                            borderColor:"#bdbdbd",
                            marginTop: scale(3),
                        }}>
                            <TextInput
                                style={{

                                    width: '70%',
                                    fontSize: scale(12),
                                    marginStart: scale(7),
                                    color: '#000'
                                }}
                                ref={(input) => { this.sixthTextInput = input; }}
                                onSubmitEditing={() => { this.seventhTextInput.focus(); }}
                                autoCorrect={false}
                                autoCapitalize={'none'}
                                returnKeyType={'next'}
                                underlineColorAndroid="transparent"
                                onChangeText={secondary_no => this.setState({ secondary_no })}
                                value={this.state.secondary_no}
                                keyboardType='name-phone-pad'
                                maxLength={10}
                            />
                        </View>

                    </View>

                    <View style={{ marginTop: scale(5) }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: scale(12), fontWeight: 'bold' }}>Country</Text>
                            <Text style={{ color: 'red', fontSize: scale(12), }}>*</Text>
                        </View>

                        <View style={{
                            borderWidth: 1,
                            height: scale(45),
                            borderRadius: scale(5),
                            backgroundColor:"white",
                            borderColor:"#bdbdbd",
                            marginTop: scale(3),
                        }}>

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
                                onValueChange={(country_value) => {
                                    this.setState({ country_value }, () => {
                                        this.hit_stateApi(country_value)
                                    })
                                }}
                                value={this.state.country_value}
                            />

                        </View>


                    </View>

                    <View style={{ marginTop: scale(5) }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: scale(12), fontWeight: 'bold' }}>Address</Text>
                            <Text style={{ color: 'red', fontSize: scale(12), }}>*</Text>
                        </View>

                        <View style={{
                            borderWidth: 1,
                            height: scale(45),
                            borderRadius: scale(5),
                            backgroundColor:"white",
                            borderColor:"#bdbdbd",
                            marginTop: scale(3),
                        }}>
                            <TextInput
                                style={{
                                    width: '70%',
                                    fontSize: scale(12),
                                    marginStart: scale(7),
                                    color: '#000'
                                }}
                                ref={(input) => { this.seventhTextInput = input; }}
                                onSubmitEditing={() => { this.addressTextInput.focus(); }}
                                autoCorrect={false}
                                autoCapitalize={'none'}
                                returnKeyType={'next'}
                                underlineColorAndroid="transparent"
                                onChangeText={address => this.setState({ address })}
                                value={this.state.address}
                            />
                        </View>

                    </View>

                    <View style={{ marginTop: scale(5) }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: scale(12), fontWeight: 'bold' }}>Street</Text>
                            <Text style={{ color: 'red', fontSize: scale(12), }}>*</Text>
                        </View>

                        <View style={{
                            borderWidth: 1,
                            height: scale(45),
                            borderRadius: scale(5),
                            backgroundColor:"white",
                            borderColor:"#bdbdbd",
                            marginTop: scale(3),
                        }}>
                            <TextInput
                                style={{
                                    width: '70%',
                                    fontSize: scale(12),
                                    marginStart: scale(7),
                                    color: '#000'
                                }}
                                ref={(input) => { this.addressTextInput = input; }}
                                onSubmitEditing={() => { this.nineTextInput.focus(); }}
                                autoCorrect={false}
                                autoCapitalize={'none'}
                                returnKeyType={'next'}
                                underlineColorAndroid="transparent"
                                onChangeText={street => this.setState({ street })}
                                value={this.state.street}
                            />
                        </View>

                    </View>

                    <View style={{ marginTop: scale(5) }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: scale(12), fontWeight: 'bold' }}>State</Text>
                            <Text style={{ color: 'red', fontSize: scale(12), }}>*</Text>
                        </View>

                        <View style={{
                            borderWidth: 1,
                            height: scale(45),
                            borderRadius: scale(5),
                            backgroundColor:"white",
                            borderColor:"#bdbdbd",
                            marginTop: scale(3),
                        }}>

                            <RNPickerSelect
                                placeholder={{
                                    label: "State",
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
                                onValueChange={(state_value) => { this.setState({ state_value }) }}
                                value={this.state.state_value}
                            />

                        </View>


                    </View>

                    <View style={{ marginTop: scale(5) }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: scale(12), fontWeight: 'bold' }}>City</Text>
                            <Text style={{ color: 'red', fontSize: scale(12), }}>*</Text>
                        </View>

                        <View style={{
                            borderWidth: 1,
                            height: scale(45),
                            borderRadius: scale(5),
                            backgroundColor:"white",
                            borderColor:"#bdbdbd",
                            marginTop: scale(3),
                        }}>
                            <TextInput
                                style={{
                                    width: '70%',
                                    fontSize: scale(12),
                                    marginStart: scale(7),
                                    color: '#000'
                                }}
                                ref={(input) => { this.nineTextInput = input; }}
                                onSubmitEditing={() => { this.tenTextInput.focus(); }}
                                autoCorrect={false}
                                autoCapitalize={'none'}
                                returnKeyType={'next'}
                                underlineColorAndroid="transparent"
                                onChangeText={city => this.setState({ city })}
                                value={this.state.city}
                            />
                        </View>

                    </View>

                    <View style={{ marginTop: scale(5) }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: scale(12), fontWeight: 'bold' }}>Zip Code</Text>
                            <Text style={{ color: 'red', fontSize: scale(12), }}>*</Text>
                        </View>

                        <View style={{
                            borderWidth: 1,
                            height: scale(45),
                            borderRadius: scale(5),
                            backgroundColor:"white",
                            borderColor:"#bdbdbd",
                            marginTop: scale(3),
                        }}>
                            <TextInput
                                style={{
                                    width: '70%',
                                    fontSize: scale(12),
                                    marginStart: scale(7),
                                    color: '#000'
                                }}
                                ref={(input) => { this.tenTextInput = input; }}
                                onSubmitEditing={() => { this.elevenTextInput.focus(); }}
                                autoCorrect={false}
                                autoCapitalize={'none'}
                                returnKeyType={'next'}
                                underlineColorAndroid="transparent"
                                onChangeText={zipcode => this.setState({ zipcode })}
                                value={this.state.zipcode}
                                keyboardType='number-pad'
                                maxLength={6}
                            />
                        </View>

                    </View>

                    <View style={{ marginTop: scale(5) }}>

                        <Text style={{ fontSize: scale(12), fontWeight: 'bold' }}>Time Zone</Text>

                        <View style={{
                            borderWidth: 1,
                            height: scale(45),
                            borderRadius: scale(5),
                            borderColor:"#bdbdbd",
                            marginTop: scale(3),
                            backgroundColor:'#ddd'
                        }}>

                            <TextInput
                                style={{
                                    width: '70%',
                                    fontSize: scale(12),
                                    marginStart: scale(7),
                                    color: '#000'
                                }}
                                autoCorrect={false}
                                autoCapitalize={'none'}
                                returnKeyType={'next'}
                                placeholderTextColor="grey"
                                underlineColorAndroid="transparent"

                                value={this.state.timezone}
                                editable={false}
                            />
                        </View>

                    </View>

                    <View style={{ marginTop: scale(5) }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: scale(12), fontWeight: 'bold' }}>Terms & Conditions</Text>
                            <Text style={{ color: 'red', fontSize: scale(12), }}>*</Text>
                        </View>

                        <View style={{
                            height: scale(100),
                            backgroundColor:"white",
                            borderColor:"#bdbdbd",
                            borderWidth: scale(1),
                            borderRadius: scale(5),
                            marginTop: scale(3),
                        }}>
                            <TextInput
                                style={{
                                    width: '70%',
                                    fontSize: scale(12),
                                    color: '#000',
                                    marginStart: scale(7),
                                }}
                                ref={(input) => { this.elevenTextInput = input; }}
                                onSubmitEditing={() => { this.updatePress()  }}
                                numberOfLines={1}
                                multiline={true}
                                autoCorrect={false}
                                autoCapitalize={'none'}
                                returnKeyLabel='Done'
                                returnKeyType={'none'}
                                underlineColorAndroid="transparent"
                                onChangeText={termsandcon => this.setState({ termsandcon })}
                                value={this.state.termsandcon}
                            />
                        </View>

                    </View>

                    <View style={{ marginTop: scale(5) }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: scale(12), fontWeight: 'bold' }}>Company Code</Text>
                            <Text style={{ color: 'red', fontSize: scale(12), }}>*</Text>
                        </View>

                        <View style={{   borderWidth: 1,
                            height: scale(45),
                            borderRadius: scale(5),
                            borderColor:"#bdbdbd",
                            marginTop: scale(3),
                            backgroundColor:"#ddd"
                             }}>
                            <TextInput
                                style={{
                                    width: '70%',
                                    fontSize: scale(12),
                                    marginStart: scale(7),
                                    color: '#000'
                                }}
                                autoCorrect={false}
                                autoCapitalize={'none'}
                                returnKeyType={'next'}
                                underlineColorAndroid="transparent"
                                onChangeText={compcode => this.setState({ compcode })}
                                value={this.state.compcode}
                                editable={false}
                            />
                        </View>

                    </View>




                        <View style={{ marginTop: scale(5) }}>
                        <Text numberOfLines={1}>Upload Image(.png, .jpg, .jpeg)</Text>
                         
                         <View style={{flexDirection:"row",marginTop:scale(5),alignItems:'center'}}>
                             <TouchableOpacity
                              onPress={this.selectPhotoTapped.bind(this)}
                             style={{borderWidth:scale(0.5),
                                    borderRadius:scale(5),
                                    padding:scale(4)
                                    }}>
                                 <Text style={{fontSize:scale(10)}}>Choose File</Text>
                             </TouchableOpacity>

                             <Text style={{fontSize:scale(10),marginLeft:scale(5)}}>
                             
                             {this.state.image_name==""?" No file chosen":this.state.image_name
                             
                             }
                             
                             </Text>


                         </View>
                          
                         {this.state.image_path!=''?
                         
                         
                         <View style={{
                            borderColor:"#bdbdbd",
                            borderWidth: scale(1),
                            borderRadius: scale(5),
                            marginTop: scale(3),
                            padding:scale(10),
                            justifyContent:'center',
                            alignItems:'center'
                        }}>
                          
                       
                        <Image style={{height:scale(150),width:scale(200)}}
                        source={{uri:'data:image/jpeg;base64,'+this.state.image_path}}
                        resizeMode='contain'
                        />

                               <TouchableOpacity
                                    onPress={() => {
                                        this.setState({
                                            image_path: "",
                                            image_name: '',
                                           


                                        })
                                    }}
                                    
                                    style={{marginTop:scale(5)}}
                                    
                                    >

                                    <Image
                                        source={Images.reset}
                                        style={{
                                            width: scale(15),
                                            height: scale(15)
                                        }}
                                        resizeMode={'contain'}
                                    />
                                </TouchableOpacity>
                        </View>:null
                         }

                         
                      

                    </View>

           
                    



            </View>
            </KeyboardAwareScrollView> 
             </CardView>
        </View>  
        
      
        )
    }


    renderHeader() {
        return (
          <View>
    
    <TouchableHighlight
              activeOpacity={1}
              underlayColor={'#ddd'}
              onPress={() => this.props.navigation.toggleDrawer()}
              style={{
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
            }}>Edit Company Details</Text>
    </View>
          </View>
        )
      }




    render() {

        return (
            <View style={{
                justifyContent: "center",
                 flex: 1,
                 backgroundColor: "white",
           }}>
             

                {this.renderHeader()}
                
                <StatusBar  backgroundColor = "#ff8f00" />
                <LogoSpinner loading={this.state.loading} />
                {
                    this._renderListItem()
                }
               <View
                    style={{
                        
                        marginBottom: scale(-20),
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>

                    <TouchableOpacity
                        onPress={() => { this.updatePress() }}
                        style={{
                            width: scale(100),
                            height: scale(40),
                            borderRadius: scale(10),
                            backgroundColor: '#ff8f00',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <Text style={styles.txt_log}
                            numberOfLines={1}
                        >Update</Text>
                    </TouchableOpacity>

                </View>
                 <Text style={{color:'grey',margin:scale(35),
                       textAlign:'center'}}> © ARSOL 2020-2021</Text>



            </View>

        );
    }
}




const styles = StyleSheet.create({

    txt: { fontSize: scale(12), width: scale(200), fontWeight: 'bold' },

    txt_log: {
        fontSize: scale(15),
        color: 'white',
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
});


EditCompanyScreen.defaultProps = {
    user_id: '',
    user_type: '',
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
)(EditCompanyScreen);