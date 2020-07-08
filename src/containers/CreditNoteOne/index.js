import React, {PureComponent} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
  TextInput,
  Modal,
  ScrollView,TouchableHighlight,
  StatusBar,
} from 'react-native';

import {connect} from 'react-redux';
import CardView from 'react-native-cardview';
import {Images, Color, Config} from '@common';
import {scale} from 'react-native-size-matters';
import Snackbar from 'react-native-snackbar';
import DatePicker from 'react-native-datepicker';
import RNPickerSelect from 'react-native-picker-select';
import {NavigationBar} from '@components';
import ArsolApi from '@services/ArsolApi';
import {LogoSpinner} from '@components';
const msg = Config.SuitCRM;


import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import moment from 'moment';

class CreditNoteOneScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      sales_list: [],
      inv_list: [],

      inv_no: '',
      inv_type: '',
      custom_name_value: '',
      credit_note_no: '',
      order_no: '',
      inv_date: moment(new Date()).format('DD/MM/YYYY'),
      credit_date: moment(new Date()).format('DD/MM/YYYY'),
      sales_value: '',
      project_code: '',
      edit_id:'',
      customer_state:'',
      reg_state:'',
      currency_type:'',
      email:'',
      inv_name:''

    };
  }

  componentDidMount() {
    const {network, est_reset, EditId} = this.props;
    this._subscribe = this.props.navigation.addListener('focus', () => {
      est_reset();  

      if (!network.isConnected) {
        Snackbar.show({
          text: msg.noInternet,
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: 'red',
        });
      } else {
        if (EditId != 'NO-ID') {
         //  alert(EditId)
          this.setState(
            {
              edit_id: EditId,
              loading: true,
            },
            () => {
              this.hit_CreditNoteInvoiceInfo_api('',EditId);
            },
          );
        }else{
          this.setState({loading: true,edit_id:'',inv_no:''}, () => {
           this.hit_CreditNo_api();
          });
        }

        this.setState({loading: true}, () => {
          this.hit_CreditInvoiceNo_api();
          this.hit_SalesPersonApi();
        });
    
      
      }
    });
  }

  hit_CreditNoteInvoiceInfo_api(invno,edno) {
    const {network, user_id, user_type} = this.props;
    const {inv_no,edit_id}=this.state

 

    if (network.isConnected) {
      ArsolApi.CreditNoteInvoiceInfo_api(user_id, user_type, invno,edno)

        .then(responseJson => {
          console.log('CreditNoteInvoiceInfo_api', responseJson);

          if (responseJson.ok) {
            this.setState({
              loading: false,
            });

            if (responseJson.data != null) {
              if (responseJson.data.hasOwnProperty('status')) {
                if (responseJson.data.status == 'success') {
                  if (responseJson.data.hasOwnProperty('data')) {
                    if (responseJson.data.data.length > 0) {
                      var json_object = responseJson.data.data[0];
                      this.props.est_info(json_object)
 

                      this.setState({
                        inv_type: json_object.template,
                        custom_name_value: json_object.customer_name,
                        order_no: json_object.order,
                        inv_date: json_object.inv_date,
                        credit_date: json_object.credit_date,
                        sales_value: json_object.sales_person,
                        project_code: json_object.project_code,

                        customer_state:json_object.customer_state,
                        currency_type:json_object.currency,
                        email:json_object.email,
                        inv_no:json_object.inv_id,
                        inv_name:json_object.inv_no
                      });

                      if(edno!=''){
                        this.setState({
                          credit_note_no :json_object.credit_no,
                          
                        })
                      }
                    }
                  }
                } else if (responseJson.data.status == 'failed') {
                  alert(responseJson.data.message);
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
  }

  hit_CreditInvoiceNo_api() {
    const {network, user_id, user_type} = this.props;
    if (network.isConnected) {
      ArsolApi.CreditInvoiceNo_api(user_id, user_type)

        .then(responseJson => {
          console.log('CreditInvoiceNo_api', responseJson);

          if (responseJson.ok) {
            this.setState({
              loading: false,
            });

            if (responseJson.data != null) {
              if (responseJson.data.hasOwnProperty('status')) {
                if (responseJson.data.status == 'success') {
                  if (responseJson.data.hasOwnProperty('data')) {
                    this.setState({
                      inv_list: responseJson.data.data,
                    });
                  }
                } else if (responseJson.data.status == 'failed') {
                  alert(responseJson.data.message);
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
  }

  hit_CreditNo_api() {
    const {network, user_id, user_type} = this.props;
    if (network.isConnected) {
      ArsolApi.CreditNo_api(user_id, user_type)

        .then(responseJson => {
          console.log('CreditNo_api', responseJson);

          if (responseJson.ok) {
            this.setState({
              loading: false,
            });

            if (responseJson.data != null) {
              if (responseJson.data.hasOwnProperty('status')) {
                if (responseJson.data.status == 'success') {
                  if (responseJson.data.hasOwnProperty('data')) {
                    this.setState({
                      credit_note_no: responseJson.data.data[0].credit_no,
                    });
                  }
                } else if (responseJson.data.status == 'failed') {
                  alert(responseJson.data.message);
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
  }

  hit_SalesPersonApi() {
    const {network, user_id, user_type} = this.props;
    if (network.isConnected) {
      ArsolApi.SalesPerson_api(user_id, user_type)

        .then(responseJson => {
          console.log('SalesPerson_api', responseJson);

          if (responseJson.ok) {
            this.setState({
              loading: false,
            });

            if (responseJson.data != null) {
              if (responseJson.data.hasOwnProperty('status')) {
                if (responseJson.data.status == 'success') {
                  if (responseJson.data.hasOwnProperty('data')) {
                    this.setState({
                      sales_list: responseJson.data.data,
                    });
                  }
                } else if (responseJson.data.status == 'failed') {
                  alert(responseJson.data.message);
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
  }

  nextPress() {
    const {
      edit_id,
      inv_no,
      inv_type,
      custom_name_value,
      credit_note_no,
      order_no,
      inv_date,
      credit_date,
      
      sales_value,
      project_code,

      customer_state,
      currency_type,
      reg_state,
      email

    } = this.state;

    if(inv_no==''){
      Snackbar.show({
        text: 'Select Invoice Number',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: Color.lgreen
      })
    }else{
      let details ={
        edit_id:edit_id,
        template: inv_type,
        customer_name: custom_name_value,
        inv_no:inv_no,
        credit_no: credit_note_no,
        order: order_no,
        inv_date: inv_date,
        credit_date: credit_date,
        sales_person: sales_value,
        project_code: project_code,

        customer_state:customer_state,
        currency_type:currency_type,
        reg_state:reg_state,
        email:email,
    
}
 
           this.props.est_data(details)
           this.props.navigation.navigate('CreditNoteTwo')
    }
  }

 

  render() {
    const {
      inv_list,
      inv_no,
      inv_type,
      custom_name_value,
      credit_note_no,
      order_no,
      inv_date,
      credit_date,
      sales_list,
      sales_value,
      project_code,
      edit_id,
      inv_name
    } = this.state;
    return (
      <View style={{ flex: 1, backgroundColor: "white",
           }}>
         <StatusBar  backgroundColor = "#ff8f00" />
      
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
        </View>  
          <View style={{marginLeft:scale(80),
            width:scale(190),height:scale(40),borderRadius:scale(4), backgroundColor:'#aeea00'}}>
          <Text style={{
            position: "absolute",
            marginTop:scale(7), 
            alignSelf: "center",
            fontSize: scale(18),
            color: "black",
            fontWeight: 'bold'
          }}>{this.state.edit_id ? "Edit Credit Note" : "Create Credit Note"}</Text>

        </View>


       

        <LogoSpinner loading={this.state.loading} />

        <CardView
                margin={scale(10)}
                height={505}
                width={330}
                padding={20}
                style={{backgroundColor:'#eceff1'}}
                cardElevation={2}
                cardMaxElevation={2}
                cornerRadius={20}
                marginLeft={15}
                
                >
        <KeyboardAwareScrollView 
       keyboardShouldPersistTaps="handled"
              enableOnAndroid={true}
              contentContainerStyle={{flexGrow: 1}}
        >
          <View>
            <View style={{margin: scale(15)}}>
              <View style={{marginTop: scale(5)}}>
                <Text style={{fontSize: scale(12), fontWeight: 'bold'}}>
                  Invoice Number
                </Text>
                <View
                  style={{
                    borderWidth: 1,
                    height: scale(45),
                    borderRadius: scale(5),
                    borderColor:"#e0e0e0",
                    marginTop: scale(3),
                    backgroundColor:  edit_id!=''? '#ddd':'#fff',
                  }}>
                  <View
                    style={{
                      width: '100%',
                    }}>

                      {
                        this.state.edit_id==''?
                        <RNPickerSelect
                        placeholder={{
                          label: 'Select Invoice Number',
                          value: '',
                          color: 'black',
                          fontSize: scale(12),
                          fontWeight: 'bold',
                        }}
                        style={{
                          inputIOS: styles.inputIOS,
                          inputAndroid: styles.inputAndroid,
                        }}
                        items={inv_list}
                        onValueChange={(inv_no) =>{
                          if(inv_no!=''){
                            this.setState({inv_no},() => {
                              this.hit_CreditNoteInvoiceInfo_api(inv_no,'');
                            })
                          }
                          
                        }    
                     }
                        value={inv_no}
                      
                      />:
                     
                      
                      <TextInput
                      style={{
                        width: '70%',
                        fontSize: scale(12),
                        marginStart: scale(7),
                        color: '#000',
                      }}
                      autoCorrect={false}
                      autoCapitalize={'none'}
                      returnKeyType={'next'}
                      underlineColorAndroid="transparent"
                     
                      value={inv_name}
                      editable={false}
                    />
                   
                      }
                   
                  </View>
                </View>
              </View>

              <View style={{marginTop: scale(5)}}>
                <Text style={{fontSize: scale(12), fontWeight: 'bold'}}>
                  Invoice Type
                </Text>
                <View
                  style={{
                    borderWidth: 1,
                    height: scale(45),
                    borderRadius: scale(5),
                    borderColor:"#e0e0e0",
                    marginTop: scale(3),
                    backgroundColor: '#ddd',
                  }}>
                  <TextInput
                    style={{
                      width: '70%',
                      fontSize: scale(12),
                      marginStart: scale(7),
                      color: '#000',
                    }}
                    autoCorrect={false}
                    autoCapitalize={'none'}
                    returnKeyType={'next'}
                    underlineColorAndroid="transparent"
                    onChangeText={inv_type => this.setState({inv_type})}
                    value={inv_type}
                    editable={false}
                  />
                </View>
              </View>

              <View style={{marginTop: scale(5)}}>
                <Text style={{fontSize: scale(12), fontWeight: 'bold'}}>
                  Customer Name
                </Text>
                <View
                  style={{
                    borderWidth: 1,
                    height: scale(45),
                    borderRadius: scale(5),
                    borderColor:"#e0e0e0",
                    marginTop: scale(3),
                    backgroundColor: '#ddd',
                  }}>
                  <TextInput
                    style={{
                      width: '70%',
                      fontSize: scale(12),
                      marginStart: scale(7),
                      color: '#000',
                    }}
                    autoCorrect={false}
                    autoCapitalize={'none'}
                    returnKeyType={'next'}
                    underlineColorAndroid="transparent"
                    onChangeText={custom_name_value =>
                      this.setState({custom_name_value})
                    }
                    value={custom_name_value}
                    editable={false}
                  />
                </View>
              </View>

              <View style={{marginTop: scale(5)}}>
                <Text style={{fontSize: scale(12), fontWeight: 'bold'}}>
                  Credit Note Number
                </Text>
                <View
                  style={{
                    borderWidth: 1,
                    height: scale(45),
                    borderRadius: scale(5),
                    borderColor:"#e0e0e0",
                    marginTop: scale(3),
                    backgroundColor: '#ddd',
                  }}>
                  <TextInput
                    style={{
                      width: '70%',
                      fontSize: scale(12),
                      marginStart: scale(7),
                      color: '#000',
                    }}
                    autoCorrect={false}
                    autoCapitalize={'none'}
                    returnKeyType={'next'}
                    underlineColorAndroid="transparent"
                    onChangeText={credit_note_no =>
                      this.setState({credit_note_no})
                    }
                    value={credit_note_no}
                    editable={false}
                  />
                </View>
              </View>

              <View style={{marginTop: scale(5)}}>
                <Text style={{fontSize: scale(12), fontWeight: 'bold'}}>
                  Order Number
                </Text>
                <View
                  style={{
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
                    }}
                    autoCorrect={false}
                    autoCapitalize={'none'}
                    returnKeyType={'next'}
                    underlineColorAndroid="transparent"
                    onChangeText={order_no => this.setState({order_no})}
                    value={order_no}
                  />
                </View>
              </View>

              <View style={{marginTop: scale(5)}}>
                <Text style={{fontSize: scale(12), fontWeight: 'bold'}}>
                  Invoice Date
                </Text>

                <View
                  style={{
                    borderWidth: 1,
                    height: scale(45),
                    borderRadius: scale(5),
                    borderColor:"#e0e0e0",
                    marginTop: scale(3),
                    alignItems: 'center',
                   
                  }}>
                  <DatePicker
                    style={{width: scale(305), marginTop: scale(5)}}
                    date={inv_date}
                    placeholder="Select Date"
                    mode="date"
                    format="DD/MM/YYYY"
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    //minDate={max_date}
                    showIcon={false}
                    customStyles={{
                      dateInput: {
                        height: scale(30),
                        borderColor: 'transparent',
                        backgroundColor: 'transparent',
                      },
                      disabled: {
                        backgroundColor: '#ddd',
                      },
                    }}
                    minuteInterval={10}
                    onDateChange={inv_date => {
                      this.setState({inv_date});
                    }}
                    value={inv_date}
                    disabled={true}
                  />
                </View>
              </View>

              <View style={{marginTop: scale(5)}}>
                <View style={{flexDirection: 'row'}}>
                  <Text style={{fontSize: scale(12), fontWeight: 'bold'}}>
                    Credit Date
                  </Text>
                  <Text style={{ color: '#dd2c00',fontWeight: 'bold',fontSize: scale(15), }}>*</Text>
                </View>

                <View
                  style={{
                    borderWidth: 1,
                    height: scale(45),
                    borderRadius: scale(5),
                    backgroundColor:"white",
                    borderColor:"#bdbdbd",
                    marginTop: scale(3),
                    alignItems: 'center',
                  }}>
                  <DatePicker
                    style={{width: scale(305), marginTop: scale(5)}}
                    date={credit_date}
                    placeholder="Select Date"
                    mode="date"
                    format="DD/MM/YYYY"
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    //minDate={max_date}
                    // showIcon={false}
                    customStyles={{
                      dateIcon: {
                        position: 'absolute',
                        right: 30,
                      },
                      dateInput: {
                        marginLeft:scale(-120),
                        height: scale(30),
                        borderColor: 'transparent',
                      },
                      placeholderText: {
                        color: '#565656',
                      },
                    }}
                    minuteInterval={10}
                    onDateChange={credit_date => {
                      this.setState({credit_date});
                    }}
                    value={credit_date}
                  />
                </View>
              </View>

              <View style={{marginTop: scale(5)}}>
                <Text style={{fontSize: scale(12), fontWeight: 'bold'}}>
                  Sales Person
                </Text>

                <View
                  style={{
                    borderWidth: 1,
                    height: scale(45),
                    borderRadius: scale(5),
                    backgroundColor:"white",
                    borderColor:"#bdbdbd",
                    marginTop: scale(3),
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      width: '100%',
                    }}>
                    <RNPickerSelect
                      placeholder={{
                        label: 'Select Sales Person',
                        value: '',
                        color: 'black',
                        fontSize: scale(12),
                        fontWeight: 'bold',
                      }}
                      style={{
                        inputIOS: styles.inputIOS,
                        inputAndroid: styles.inputAndroid,
                      }}
                      items={sales_list}
                      onValueChange={sales_value =>
                        this.setState({sales_value})
                      }
                      value={sales_value}
                    />
                  </View>
                </View>
              </View>

              <View style={{marginTop: scale(5)}}>
                <Text style={{fontSize: scale(12), fontWeight: 'bold'}}>
                  Project Code
                </Text>
                <View
                  style={{
                    borderWidth: 1,
                    height: scale(45),
                    borderRadius: scale(5),
                    borderColor:"#e0e0e0",
                    marginTop: scale(3),
                    backgroundColor: '#ddd',
                  }}>
                  <TextInput
                    style={{
                      width: '70%',
                      fontSize: scale(12),
                      marginStart: scale(7),
                      color: '#000',
                    }}
                    autoCorrect={false}
                    autoCapitalize={'none'}
                    returnKeyType={'next'}
                    underlineColorAndroid="transparent"
                    onChangeText={project_code => this.setState({project_code})}
                    value={project_code}
                    editable={false}
                  />
                </View>
              </View>
            </View>

           
          </View>
        </KeyboardAwareScrollView>
         </CardView> 

          <View
              style={{
                marginTop: scale(30),
                marginBottom: scale(10),
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={() => {
                    this.nextPress()
                //  this.props.navigation.navigate('CreditNoteTwo');
                }}
                style={{
                  width: scale(100),
                  height: scale(40),
                  borderRadius: scale(10),
                  backgroundColor: '#ff8f00',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={styles.txt_log} numberOfLines={1}>
                  Next
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={{color:'grey',marginBottom:scale(30),
                  textAlign:'center'}}> © ARSOL 2020-2021</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: scale(5),
  },
  radioText: {
    marginRight: scale(10),
    fontSize: scale(12),
    color: '#5D6D7E',
    fontWeight: 'bold',
  },
  radioCircle: {
    height: scale(15),
    width: scale(15),
    borderRadius: scale(10),
    borderWidth: scale(1),
    borderColor: '#3498DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedRb: {
    width: scale(15),
    height: scale(15),
    borderRadius: scale(30),
    backgroundColor: '#3498DB',
  },
  txt: {fontSize: scale(15), width: scale(150)},
  txth: {fontSize: scale(15), fontWeight: 'bold'},

  txt_h: {
    fontSize: scale(12),
    color: '#000',
    fontWeight: 'bold',
    width: scale(200),
    textAlign: 'left',
  },

  userInput: {
    height: scale(40),
    backgroundColor: 'white',
    marginBottom: scale(15),
    borderColor: 'grey',
    borderWidth: scale(1),
    width: scale(200),
    borderRadius: scale(5),
  },

  input: {
    color: '#000',
    marginLeft: scale(5),
    width: '73%',
    fontSize: scale(12),
  },

  userInputTC: {
    height: scale(100),
    backgroundColor: 'white',
    marginBottom: scale(15),
    borderColor: 'grey',
    borderWidth: scale(1),
    width: scale(200),
  },

  inputTC: {
    color: '#000',
    fontSize: scale(12),
  },
  txt_log: {
    fontSize: scale(12),
    color: 'white',
    fontWeight: 'bold',
    width: scale(100),
    textAlign: 'center',
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

CreditNoteOneScreen.defaultProps = {
  user_id: '',
  user_type: '',
  network: '',
};

const mapStateToProps = state => {
  return {
    user_id: state.user.id,
    user_type: state.user.type,
    network: state.network,
  };
};

const mapDispatchToProps = dispatch => {
  const {actions} = require('@redux/NewEstimateRedux');

  return {
    est_data: conData => dispatch(actions.est_data(conData)),
    est_info: conData => dispatch(actions.est_info(conData)),
    est_reset: () => dispatch(actions.est_reset()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CreditNoteOneScreen);