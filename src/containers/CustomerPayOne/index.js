import React, { PureComponent } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    FlatList,
    StyleSheet,
    TextInput,
    Modal,
    ScrollView,
  Keyboard, TouchableHighlight
} from 'react-native';

import { connect } from "react-redux";
import { Images, Color, Config } from '@common';
import { scale } from "react-native-size-matters";
import Snackbar from 'react-native-snackbar';
import ArsolApi from '@services/ArsolApi';
import CardView from 'react-native-cardview';
import DatePicker from 'react-native-datepicker';
import RNPickerSelect from 'react-native-picker-select';
import { NavigationBar } from '@components';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import moment from 'moment';

const msg = Config.SuitCRM;

import Checkbox from 'react-native-modest-checkbox'
import SlidingUpPanel from 'rn-sliding-up-panel';
import { CommonActions, StackActions, DrawerActions } from '@react-navigation/native';


class CustomerPayOneScreen extends PureComponent {


    constructor(props) {
        super(props);

        this.state = {
            loading: false,
           
            bank_value: '',
           

            pay_list: [
                { label: 'Bank Transfer', value: 'Bank Transfer' },
                { label: 'Cheque', value: 'Cheque' },
                 { label: 'Cash', value: 'Cash' }],

            
            edit_id: '',

            addNewBank: false,
            b_name: '',
            ac_name: '',
            ac_no: '',
            ifsc_code: '',
            bank_edit_id : '',


            bank_list: [],

          


            search_company:false,
            search_date: moment(new Date()).format('DD/MM/YYYY'),

            company_list:[],
            company_value:'',
            utr_chq:'',
            payment_mode_value: '',
            item_list:[],

            editModal: false,
            edit_index: null,

            amt_receive:'',
            tds:'',
            round_off:'',
            advCheck:false,
            adv_account: 0,


        }

    }

    componentDidMount() {
      const { network, EditId} = this.props;
     // est_reset(); 
      this._subscribe = this.props.navigation.addListener('focus', () => {
        if (!network.isConnected) {
          Snackbar.show({
            text: msg.noInternet,
            duration: Snackbar.LENGTH_SHORT,
            backgroundColor: "red"
          });
        } else {

          if (EditId != 'NO-ID' || '') {
            //  alert(EditId)
            this.setState(
              {
                edit_id: EditId,
                loading: true,
              },
              () => {
                this.hit_BankNameListApi(),
                  this.hit_CompanyNameApi()
                this.hit_CustomerPaymentInfo_api(EditId);
              },
            );
          } else {
            this.setState({ loading: true, search_company: true }, () => {
              this.hit_CompanyNameApi(),
                this.hit_BankNameListApi()
            })
          }






        }
      })


      
    }
  hit_CustomerPaymentInfo_api(edit_id){
    const { network, user_id, user_type } = this.props;
    ArsolApi.CustomerPaymentInfo_api(user_id, user_type, edit_id)

      .then(responseJson => {
        console.log('CustomerPaymentInfo_api', responseJson);

        if (responseJson.ok) {
        

          if (responseJson.data != null) {
            if (responseJson.data.hasOwnProperty('status')) {
              if (responseJson.data.status == 'success') {
                if (responseJson.data.hasOwnProperty('data')) {
                  if (responseJson.data.data.length > 0) {
                    var json_object = responseJson.data.data[0];
                   // this.props.est_info(json_object)


                    this.setState({

                      bank_value: json_object.bank_id,
                      search_date: json_object.rec_date,
                  
                      company_value: json_object.company_id,
                      utr_chq: json_object.utr_cheque,
                      payment_mode_value: json_object.mode_of_payment,
                      item_list: json_object.invoice_list,

                      
                    
                    });
                 
                   
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

    hit_CompanyNameApi() {
        const { network, user_id, user_type } = this.props
        if (network.isConnected) {
            ArsolApi.CompanyName_api(
                user_id,
                user_type,
            )

                .then(responseJson => {
                    console.log('CompanyName_api', responseJson);

                    if (responseJson.ok) {
                        this.setState({
                            loading: false,
                        });

                        if (responseJson.data != null) {
                            if (responseJson.data.hasOwnProperty('status')) {

                                if (responseJson.data.status == 'success') {

                                    if (responseJson.data.hasOwnProperty('data')) {
                                        if (responseJson.data.data.length > 0) {
                                            this.setState({
                                                company_list: responseJson.data.data,
                                                company_value:responseJson.data.data[0].value
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


    hit_BankNameListApi() {
        const { network, user_id, user_type } = this.props
        if (network.isConnected) {
            ArsolApi.BankNameList_api(
                user_id,
                user_type,
            )

                .then(responseJson => {
                    console.log('BankNameList_api', responseJson);

                    if (responseJson.ok) {
                        this.setState({
                            loading: false,
                        });

                        if (responseJson.data != null) {
                            if (responseJson.data.hasOwnProperty('status')) {

                                if (responseJson.data.status == 'success') {

                                    if (responseJson.data.hasOwnProperty('data')) {
                                        if (responseJson.data.data.length > 0) {
                                            this.setState({
                                                bank_list: responseJson.data.data
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

    hit_CustomerPaymentApi() {
      const { network, user_id, user_type } = this.props
      const {company_value,search_date}= this.state
  
      if (network.isConnected) {
        ArsolApi.CustomerPayment_api(
          user_id,
          user_type,
          company_value,
          search_date
        )
  
          .then(responseJson => {
            console.log('CustomerPayment_api', responseJson);
  
            if (responseJson.ok) {
              this.setState({
                loading: false,
              });
  
              if (responseJson.data != null) {
                if (responseJson.data.hasOwnProperty('status')) {
  
                  if (responseJson.data.status == 'success') {
  
                    if (responseJson.data.hasOwnProperty('data')) {
                      if (responseJson.data.data.length > 0) {
                        this.setState({
                          item_list: responseJson.data.data
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
      }else{
        Snackbar.show({
          text: msg.noInternet,
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: "red"
      });
      }
    }

    _addItem_fun(){
      const{ b_name,
       ac_name,
       ac_no,
       ifsc_code,
       bank_edit_id
     } = this.state

    
    const {user_id,user_type,network} = this.props
    Keyboard.dismiss()
        if(b_name.trim()==""){
          alert("Enter Bank Name")
        }else if(ac_name.trim()==""){
          alert("Enter Account Name")
        }else if(ac_no.trim()==""){
          alert("Enter Account No.")
        }else if(isNaN(ac_no)){
          alert("Account No. Invalid")
        }else if(ifsc_code.trim()==""){
          alert("Enter IFSC Code")
         }else if(!network.isConnected){
          Snackbar.show({
            text: msg.noInternet,
            duration: Snackbar.LENGTH_SHORT,
            backgroundColor: "red"
          });
        }else{
          this.setState({loading:false,addNewBank:false},()=>{
            this.hit_addItemApi(user_id,user_type, b_name,
              ac_name,
              ac_no,
              ifsc_code,
              bank_edit_id)
            
          })}
        
    }

    _addBankModal() {
        return (
            <Modal
                transparent={true}
                animationType={'slide'}
                visible={this.state.addNewBank}
                onRequestClose={() => {
                    this.setState({
                        addNewBank: false,
                        b_name: '',
                        ac_name: '',
                        ac_no: '',
                        ifsc_code: '',
                        bank_edit_id : '',
                    });
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


                        <View>


                            <View style={{
                                backgroundColor: 'white',
                                width: '90%',
                                padding: scale(10),
                                borderRadius: scale(5),
                                alignItems: 'center'
                            }}>



                                <Text style={styles.txt_h}>Bank Name</Text>
                                <View style={styles.userInput}>

                                    <TextInput
                                        style={styles.input}

                                        autoCorrect={false}
                                        autoCapitalize={'none'}

                                        placeholderTextColor="grey"
                                        underlineColorAndroid="transparent"
                                        onChangeText={b_name => this.setState({ b_name })}
                                        value={this.state.b_name}
                                    />
                                </View>

                                <Text style={styles.txt_h}>Account Name</Text>
                                <View style={styles.userInput}>

                                    <TextInput
                                        style={styles.input}

                                        autoCorrect={false}
                                        autoCapitalize={'none'}

                                        placeholderTextColor="grey"
                                        underlineColorAndroid="transparent"
                                        onChangeText={ac_name => this.setState({ ac_name })}
                                        value={this.state.ac_name}

                                    />
                                </View>

                                <Text style={styles.txt_h}>Account No.</Text>
                                <View style={styles.userInput}>

                                    <TextInput
                                        style={styles.input}

                                        autoCorrect={false}
                                        autoCapitalize={'none'}

                                        placeholderTextColor="grey"
                                        underlineColorAndroid="transparent"
                                        onChangeText={ac_no => this.setState({ ac_no })}
                                        value={this.state.ac_no}
                                        keyboardType='number-pad'

                                    />
                                </View>

                                <Text style={styles.txt_h}>IFSC Code</Text>
                                <View style={styles.userInput}>

                                    <TextInput
                                        style={styles.input}

                                        autoCorrect={false}
                                        autoCapitalize={'none'}

                                        placeholderTextColor="grey"
                                        underlineColorAndroid="transparent"
                                        onChangeText={ifsc_code => this.setState({ ifsc_code })}
                                        value={this.state.ifsc_code}
                                    />
                                </View>




                                <View style={{
                                    flexDirection: "row",
                                    justifyContent: 'space-between'
                                }}>
                                    <TouchableOpacity
                                        activeOpacity={0.7}
                                        style={{
                                            width: scale(100),
                                            height: scale(40),
                                            padding: scale(10),
                                            backgroundColor: '#3D8EE1',
                                            borderRadius: scale(8),
                                            margin: scale(5)

                                        }}
                                        onPress={() => {
                                            this.setState({
                                                addNewBank: false,
                                                b_name: '',
                                                ac_name: '',
                                                ac_no: '',
                                                ifsc_code: '',
                                                
                                            });
                                        }}>
                                        <Text style={{
                                            color: '#fff',
                                            fontSize: scale(15),
                                            textAlign: 'center'
                                        }}> Cancel </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        activeOpacity={0.7}
                                        style={{
                                            width: scale(100),
                                            height: scale(40),
                                            padding: scale(10),
                                            backgroundColor: '#3D8EE1',
                                            borderRadius: scale(8),
                                            margin: scale(5)
                                        }}
                                        onPress={() => {
                                             this._addItem_fun()
                                        }}>
                                        <Text style={{
                                            color: '#fff',
                                            fontSize: scale(15),
                                            textAlign: 'center'
                                        }}>{this.state.bank_edit_id != '' ? 'Update' : "Save"}</Text>
                                    </TouchableOpacity>

                                </View>


                            </View>



                        </View>
                    </ScrollView>
                </View>

            </Modal>
        )
    }


    hit_addItemApi(user_id,user_type,
      b_name,
     ac_name,
     ac_no,
     ifsc_code,
     bank_edit_id
    
   ){
   
   
       ArsolApi.AddBank_api(user_id,user_type,
         b_name,
         ac_name,
         ac_no,
        ifsc_code,
        bank_edit_id
         )
   
       .then(responseJson => {
         console.log('AddBank_api', responseJson);
         console.log(user_id, user_type, b_name,ac_name,ac_no,ifsc_code, bank_edit_id)
   
         if (responseJson.ok) {
           this.setState({
             loading: false,
      
           });
   
           if (responseJson.data != null) {
             if (responseJson.data.hasOwnProperty('status')) {
             
                 if (responseJson.data.status == 'success') {
                 if (responseJson.data.hasOwnProperty('message')) {
   
                    if(responseJson.data.hasOwnProperty("data")){
                          if(responseJson.data.data.length>0){
                            
                           alert(responseJson.data.message)
                        
    this.setState({
     b_name:'',
     ac_name:'',
     ac_no:'',
     ifsc_code:'',
      bank_edit_id : ''
    },()=>{
     this.onRefresh()
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


     GetItem(bank_value) {
      const {bank_list} = this.state

      this.setState({
        addNewBank:true,
        bank_edit_id : bank_value,
        b_name : '',
        ac_name :'',
        ac_no :'',
        ifsc_code:'',
      })

      }


    

    _searchRender(){
        const {search_company,search_date,company_value,company_list} = this.state;
       return(
         <Modal
         transparent={true}
         animationType={'slide'}
         visible={search_company}
         onRequestClose={() => {
           this.setState({search_company: false});
         }}>
        <View style={{flex:1}}>
     
      
           
        <ScrollView style={{backgroundColor: 'rgba(0,0,0,0.5)'}}
          contentContainerStyle={{flexGrow : 1,
           justifyContent : 'center',
           alignItems: "center",
           padding:scale(5)}}
           enableOnAndroid={true}
                     keyboardShouldPersistTaps="handled"
          >
            <View>
     
     
           <View style={{
                     backgroundColor: 'white',
                   borderRadius: scale(5),
                   width:scale(250),
                    
           }}>
       <View style={{height:scale(40),
       justifyContent:'center',alignItems:'center'}}>
       <Text style={{fontSize:scale(15),color:"#00B5FF",fontWeight:'500'}}
       numberOfLines={1}
       >Filter Search Result</Text>
       </View>
            
      <View style={{height:scale(2),backgroundColor:"#00B5FF",}}/>
     
      <View style={{padding:scale(5),alignItems: 'center'}}>

                 <Text
                    style={{fontSize: scale(12), width: scale(180),}}
                    numberOfLines={1}>
                    Company Name :
                  </Text>
                  <View style={{ height: scale(40),
    backgroundColor: 'white',
   borderColor: 'grey',
    borderWidth: scale(1),
    width: scale(180),
    marginTop:scale(5)
    }}>

                    <RNPickerSelect
                      placeholder={{}}
                      items={company_list}
                      InputAccessoryView={() => null}
                      onValueChange={company_value =>
                        this.setState({company_value:company_value})
                      }
                      value={company_value}
                    />
                  </View>

                  <Text
                    style={{fontSize: scale(12), width: scale(180),marginTop:scale(7)}}
                    numberOfLines={1}>
                    Date :
                  </Text>
           <DatePicker
                    style={{width: scale(180), marginTop: scale(5)}}
                    date={search_date}
                    placeholder="Select Date"
                    mode={'date'}
                    format="DD/MM/YYYY"
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    showIcon={false}
                    customStyles={{
                      placeholderText: {
                        color: '#565656',
                      },
                    }}
                    minuteInterval={10}
                    onDateChange={date => {
                      this.setState({search_date: date});
                    }}
                  />
     
      </View>
            
     
                      
     
     
     <TouchableOpacity
     onPress={()=>{this.setState({search_company:false},()=>{this.hit_CustomerPaymentApi()}
     
     
     )}}
     >
     <View style={{backgroundColor:"#00B5FF",height:scale(40),alignItems:"center",
     justifyContent:'center',
     borderRadius: scale(4),
     
     }}>
         <Text style={{fontSize:scale(18),color:"#fff",fontWeight:'bold'}}
       numberOfLines={1}
       >Apply</Text>
     </View>
     </TouchableOpacity>
     
         
     </View>
     
             
     
           </View>
           </ScrollView>
           </View>
       
       </Modal>
       )
      }

    _bankRender(){
      const { bank_value, payment_mode_value, pay_list, bank_list,
        utr_chq, bank_edit_id, company_value, company_list, search_date, edit_id} = this.state
        return(
            <View style={{padding:scale(5),
                        backgroundColor:"#fff",
                        borderWidth:scale(1),
                        borderColor:'#ddd',
                        borderBottomEndRadius:scale(7),
                        borderBottomStartRadius:scale(7)
                        }}>
            {edit_id!=''?
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: scale(5), alignItems: 'center' }}>

              <Text style={{ fontSize: scale(12), fontWeight: 'bold' }}>Company Name</Text>

              <View style={{
                borderWidth: 1,
                height: scale(45),
                borderRadius: scale(5),
                borderColor: "#0070c6",
                marginTop: scale(3),
                width: '70%',
                backgroundColor:"#ddd"

              }}>

                <RNPickerSelect
                  placeholder={{
                    label: "Select Company Name",
                    value: "",
                    color: 'black',
                    fontSize: scale(12),
                    fontWeight: 'bold',
                  }}
                  style={{
                    inputIOS: styles.inputIOS,
                    inputAndroid: styles.inputAndroid,
                  }}
                  items={company_list}
                  onValueChange={(company_value) =>
                    this.setState({
                      company_value
                      
                      })}
                  value={company_value}
                  disabled={true}
                />



              </View>

            </View>:null}

            <View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
            
            <Text style={{ fontSize: scale(12), fontWeight: 'bold',}}>Bank</Text>
            
            
            <View style={{
                borderWidth: 1,
                height: scale(45),
                borderRadius: scale(5),
                borderColor: "#0070c6",
                flexDirection: "row",
                alignItems: 'center',
                justifyContent: "space-evenly",
                width:'70%'
            }}>
            
            <View style={{width : '70%'}}>
            
            <RNPickerSelect
                    placeholder={{
                        label: "Select Bank",
                        value: "",
                        color: 'black',
                        fontSize: scale(12),
                        fontWeight: 'bold',
                    }}
                    style={{
                        inputIOS: styles.inputIOS,
                        inputAndroid: styles.inputAndroid,
                      }}
                    items={bank_list}
                    onValueChange={(bank_value) => this.setState({ bank_value })}
                    value={bank_value}
                />
            
            </View>
            
            
            
            
                <View style={{ flexDirection: "row" }}>
                    <TouchableOpacity
                        onPress={() => {
                            this.setState({ addNewBank: true, bank_edit_id:"" })
                        }}>
                        <Image source={Images.plusblue} style={{ width: scale(25), height: scale(25), marginLeft: scale(5) }} />
                    </TouchableOpacity>


                    {
                        bank_value != '' ?
                    <TouchableOpacity
                     onPress={() => this.GetItem(bank_value)}>
                        <Image source={Images.edit} style={{ width: scale(25), height: scale(25), marginLeft: scale(5) }} />
                    </TouchableOpacity>

                    : null

                        }
                </View>
            
            
            
            </View>
            
            </View>
                     
                           
            <View style={{ flexDirection:"row",justifyContent:"space-between",marginTop:scale(5),alignItems:'center' }}>
            
            <Text style={{ fontSize: scale(12), fontWeight: 'bold' }}>Mode of Payment</Text>
            
            <View style={{
                                            borderWidth: 1,
                                            height: scale(45),
                                            borderRadius: scale(5),
                                            borderColor: "#0070c6",
                                            marginTop: scale(3),
                                            width:'70%'
                                        
                                        }}>
                                       
                                        <RNPickerSelect
                                                placeholder={{
                                                    label: "Select Payment Mode",
                                                    value: "",
                                                    color: 'black',
                                                    fontSize: scale(12),
                                                    fontWeight: 'bold',
                                                }}
                                                style={{
                                                    inputIOS: styles.inputIOS,
                                                    inputAndroid: styles.inputAndroid,
                                                  }}
                                                items={pay_list}
                                                onValueChange={(payment_mode_value) => 
                                                this.setState({ payment_mode_value:payment_mode_value,
                                                         utr_chq:''
                                                
                                                 })}
                                                value={payment_mode_value}
                                            />
                                    
                                           
            
                                        </View>
             
             </View>
            
            
            {
                payment_mode_value!=''&&payment_mode_value!='Cash'?
                <View style={{flexDirection:"row",justifyContent:"space-between",marginTop:scale(5),
                alignItems:"center" }}>
            
                                                <Text style={{ fontSize: scale(12),
                                                 fontWeight: 'bold' }}>{payment_mode_value=='Bank Transfer'?"UTR Number":"Cheque Number"}</Text>
            
                                                <View style={{
                                                    borderWidth: 1,
                                                    height: scale(45),
                                                    borderRadius: scale(5),
                                                    borderColor: "#0070c6",
                                                    marginTop: scale(3),
                                                    width:'70%'
            
                                                }}>
            
                                                    <TextInput
                                                        style={{
                                                            fontSize: scale(12),
                                                            marginStart: scale(7)
                                                        }}
                                                        autoCorrect={false}
                                                        autoCapitalize={'none'}
                                                        returnKeyType={'next'}
                                                        underlineColorAndroid="transparent"
                                                        onChangeText={utr_chq => this.setState({ utr_chq })}
                                                        value={utr_chq}
                                                    />
            
                                                </View>
            
                                            </View>
                 : null
            }

            {edit_id != '' ?
            <View style={{
              flexDirection: "row", justifyContent: "space-between", marginTop: scale(5),
              alignItems: "center"
            }}>

              <Text style={{
                fontSize: scale(12),
                fontWeight: 'bold'
              }}>Date</Text>

              <View style={{
                borderWidth: 1,
                height: scale(45),
                borderRadius: scale(5),
                borderColor: "#0070c6",
                marginTop: scale(3),
                width: '70%',
                alignItems:"center"


              }}>

                <DatePicker
                  style={{ width: '100%', 
                         marginTop: scale(5),
                         paddingHorizontal:scale(5)
                     }}
                  date={search_date}
                  placeholder="Select Date"
                  mode={'date'}
                  format="DD/MM/YYYY"
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  showIcon={true}
                  customStyles={{
                    dateIcon: {
                      position: 'absolute',
                      right: 0

                    },
                    dateInput: {
                   
                       
                      height: scale(30),
                      borderColor: 'transparent',
                      
                   
                      alignItems:'flex-start',
                






                    },
                    placeholderText: {
                      color: '#565656'
                    }
                  }}
                  minuteInterval={10}
                  onDateChange={date => {
                    this.setState({ search_date: date });
                  }}  
                />

              </View>

            </View>:null}
             </View>
        )
    } 
    
      FlatListItemSeparator = () => {
        return (
          <View
            style={{
              height: 1,
              width: '100%',
              backgroundColor: '#607D8B',
            }}
          />
        );
      };

       checkedFun(ch,i){
           console.log(ch)
           const {item_list}=this.state
           const newArray = [...item_list];
           newArray[i].select = ch.checked;

           this.setState({
            item_list:newArray
           })

       }

       editItem(index) {
        const {item_list} = this.state;
    
        this.setState(() => {
          return {
            editModal: true,
            edit_index: index,
        
            amt_receive: item_list[index].amt_receive,
            tds: item_list[index].tds,
            round_off: item_list[index].round_off,
        
          };
        });
      }


  savePress() {
    const {amt_receive, tds, round_off, } = this.state;

  
      var a = 0;
      var t = 0;
      var r = 0;

      if (!isNaN(amt_receive)) {
        a = amt_receive;
        
      }

      if (!isNaN(tds)) {
        t = tds;
       
      }

      if (!isNaN(round_off)) {

        r = round_off;
       
      }

      this.updateList(a,t,r);
    
  }

      updateList(a,t,r) {
        const {edit_index, item_list} = this.state;
  
        const newArray = [...item_list];
     
      
    

        newArray[edit_index].amt_receive = a.toString();
        newArray[edit_index].tds = t.toString();
        newArray[edit_index].round_off = r.toString();
        newArray[edit_index].closing_balance = parseInt(newArray[edit_index].opening_balance) - a - t - r 
    
     
    
        this.setState(() => {
          return {
            item_list: newArray,
            editModal: false,
            edit_index: null,
            amt_receive: '',
            tds: '',
            round_off: '',
          };
        });
      }

      editNewItem = () => {
        const { amt_receive, tds, round_off, } = this.state;
        return (
          <Modal
            transparent={true}
            animationType={'slide'}
            visible={this.state.editModal}
            onRequestClose={() => {
              this.setState({editModal: false});
            }}>
            <View style={{flex: 1}}>
              <ScrollView
                style={{backgroundColor: 'rgba(0,0,0,0.5)'}}
                contentContainerStyle={{
                  flexGrow: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: scale(5),
                }}
                keyboardShouldPersistTaps="handled">
                <View>
                  <View
                    style={{
                      backgroundColor: 'white',
                      width: '90%',
                      padding: scale(10),
                      borderRadius: scale(5),
                      alignItems: 'center',
                    }}>
                
    
                    <Text style={styles.txt_h}>Amount Received</Text>
                    <View style={styles.userInput}>
                      <TextInput
                        style={styles.input}
                        autoCorrect={false}
                        autoCapitalize={'none'}
                        placeholderTextColor="grey"
                        underlineColorAndroid="transparent"
                        onChangeText={amt_receive => this.setState({amt_receive})}
                        value={amt_receive}
                        keyboardType="number-pad"
                      />
                    </View>
    
                    <Text style={styles.txt_h}>TDS</Text>
                    <View style={styles.userInput}>
                      <TextInput
                        style={styles.input}
                        autoCorrect={false}
                        autoCapitalize={'none'}
                        placeholderTextColor="grey"
                        underlineColorAndroid="transparent"
                        onChangeText={tds => this.setState({tds})}
                        value={tds}
                        keyboardType="number-pad"
                      />
                    </View>
    
                    <Text style={styles.txt_h}>Round Off</Text>
                    <View style={styles.userInput}>
                      <TextInput
                        style={styles.input}
                        autoCorrect={false}
                        autoCapitalize={'none'}
                        placeholderTextColor="grey"
                        underlineColorAndroid="transparent"
                        onChangeText={round_off => this.setState({round_off})}
                        value={round_off}
                      />
                    </View>
    
                   
    
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
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
                            editModal: false,
                            edit_index: null,
                            des: '',
                            qty: '',
                            rate: '',
                            hsn_sac_code: '',
                            discounts: '',
                          });
                        }}>
                        <Text
                          style={{
                            color: '#fff',
                            fontSize: scale(15),
                            textAlign: 'center',
                          }}>
                          Cancel
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
                          this.savePress();
                        }}>
                        <Text
                          style={{
                            color: '#fff',
                            fontSize: scale(15),
                            textAlign: 'center',
                          }}>
                          {' '}
                          Save{' '}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </ScrollView>
            </View>
          </Modal>
        );
      };

      nextPress(){
      const{item_list,bank_value,payment_mode_value,utr_chq,
        company_value,search_date}=this.state;

        const newData = item_list.filter(item => {return item.select ==true});

        const {network}=this.props



        if(company_value==""){
          Snackbar.show({
            text: 'Select Company Name',
            duration: Snackbar.LENGTH_SHORT,
            backgroundColor: Color.lgreen
          });
        }else if(search_date==''){
          Snackbar.show({
            text: 'Select Date',
            duration: Snackbar.LENGTH_SHORT,
            backgroundColor: Color.lgreen
          });
        }else if(!newData.length>0){
          Snackbar.show({
            text: 'Select Invoice Number',
            duration: Snackbar.LENGTH_SHORT,
            backgroundColor: Color.lgreen
          });

        }
        else if(bank_value==''){
          
        this.flatListRef.scrollToOffset({ animated: true, offset: 0 });
          Snackbar.show({
            text: 'Select Bank',
            duration: Snackbar.LENGTH_SHORT,
            backgroundColor: Color.lgreen
          });
        }else if(payment_mode_value==''){

        this.flatListRef.scrollToOffset({ animated: true, offset: 0 });
          Snackbar.show({
            text: 'Select mode of payment',
            duration: Snackbar.LENGTH_SHORT,
            backgroundColor: Color.lgreen
          });
        }else if(payment_mode_value=="Bank Transfer"||payment_mode_value=="Cheque"){
          if(payment_mode_value=="Bank Transfer"&&utr_chq==""){
            Snackbar.show({
              text: 'Enter UTR Number',
              duration: Snackbar.LENGTH_SHORT,
              backgroundColor: Color.lgreen
            });
          }else if(payment_mode_value=="Cheque"&&utr_chq==""){
            Snackbar.show({
              text: 'Enter Cheque Number',
              duration: Snackbar.LENGTH_SHORT,
              backgroundColor: Color.lgreen
            });
          }else if (!network.isConnected) {
            Snackbar.show({
              text: msg.noInternet,
              duration: Snackbar.LENGTH_SHORT,
              backgroundColor: "red"
            });
          }else{
            this.setState({
              loading:true
            },()=>{
              this.hit_ReceivePayment_api()
            })
          }
        }else if (!network.isConnected) {
          Snackbar.show({
            text: msg.noInternet,
            duration: Snackbar.LENGTH_SHORT,
            backgroundColor: "red"
          });
        }else{
          this.setState({
            loading:true
          },()=>{
            this.hit_ReceivePayment_api()
          })
        }



      }

      hit_ReceivePayment_api(){
        const{item_list,bank_value,payment_mode_value,utr_chq,
          company_value,advCheck,adv_account,edit_id,search_date}=this.state;
        
        const {user_id,user_type}=this.props
        const newData = item_list.filter(item => {return item.select ==true});

       // console.log(JSON.stringify(newData))


        const total_amt =newData.reduce((prev, next) => prev + parseInt(next.total_amt), 0)
        const amt_receive =newData.reduce((prev, next) => prev + parseInt(next.amt_receive), 0)
        const tds_amt =newData.reduce((prev, next) => prev + parseInt(next.tds), 0)
        const round_off =newData.reduce((prev, next) => prev + parseInt(next.round_off), 0)
        const balance = total_amt - amt_receive - tds_amt - round_off;


        ArsolApi.ReceivePayment_api(
          user_id,
          user_type, 
          bank_value,
          payment_mode_value,
          utr_chq,
          JSON.stringify(newData),
         
          advCheck,
         
          total_amt,
          amt_receive,
          tds_amt,
          round_off,
          balance,
          
          adv_account,
          search_date,
          company_value,
          edit_id,
      )

          .then(responseJson => {
              console.log('ReceivePayment_api', responseJson);

              if (responseJson.ok) {
                  this.setState({
                      loading: false,
                  });

                  if (responseJson.data != null) {
                      if (responseJson.data.hasOwnProperty('status')) {

                          if (responseJson.data.status == 'success') {

                              alert(responseJson.data.message)
                              const popAction = StackActions.pop(1);
                              this.props.navigation.dispatch(popAction);


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

      

      renderFlatList(rowData, index) {
        console.log(rowData);
        return (
          <View
            style={{
              flexDirection: 'row',
              padding: scale(10),
              justifyContent: 'space-between',
            }}
            key={rowData.index}>
            <View style={{width: '92%',}}>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.txth} numberOfLines={1}>
                Invoice Number :
                </Text>
                <Text style={styles.txt} numberOfLines={1}>
                  {rowData.item.inv_number}
                </Text>
              </View>
    
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.txth} numberOfLines={1}>
                Invoice Type :
                </Text>
                <Text style={styles.txt} numberOfLines={1}>
                  {rowData.item.inv_type}
                </Text>
              </View>

              <View style={{flexDirection: 'row'}}>
                <Text style={styles.txth} numberOfLines={1}>
                Customer Name :
                </Text>
                <Text style={styles.txt} numberOfLines={1}>
                  {rowData.item.customer_name}
                </Text>
              </View>

              <View style={{flexDirection: 'row'}}>
                <Text style={styles.txth} numberOfLines={1}>
                Invoice Date :
                </Text>
                <Text style={styles.txt} numberOfLines={1}>
                  {rowData.item.inv_date}
                </Text>
              </View>

              <View style={{flexDirection: 'row'}}>
                <Text style={styles.txth} numberOfLines={1}>
                Total Amount :
                </Text>
                <Text style={styles.txt} numberOfLines={1}>
                  {rowData.item.total_amt}
                </Text>
              </View>

              <View style={{flexDirection: 'row'}}>
                <Text style={styles.txth} numberOfLines={1}>
                Opening Balance :
                </Text>
                <Text style={styles.txt} numberOfLines={1}>
                  {rowData.item.opening_balance}
                </Text>
              </View>

              {
            rowData.item.select?
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.txth} numberOfLines={1}>
                Amount Received:
                </Text>
                <Text style={styles.txt} numberOfLines={1}>
                  {rowData.item.amt_receive}
                </Text>
              </View>:null}

              {
            rowData.item.select?
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.txth} numberOfLines={1}>
               TDS:
                </Text>
                <Text style={styles.txt} numberOfLines={1}>
                  {rowData.item.tds}
                </Text>
              </View>:null}

              {
            rowData.item.select?
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.txth} numberOfLines={1}>
               Round Off:
                </Text>
                <Text style={styles.txt} numberOfLines={1}>
                  {rowData.item.round_off}
                </Text>
              </View>:null}

              {
            rowData.item.select?

              <View style={{flexDirection: 'row'}}>
                <Text style={styles.txth} numberOfLines={1}>
                Closing Balance :
                </Text>
                <Text style={styles.txt} numberOfLines={1}>
                  {rowData.item.closing_balance.toString()}
                </Text>
              </View>:null}

              

            

              



           
            </View>
            <View >
             
            
             <Checkbox
            label=''
            checked={rowData.item.select}
            onChange={(checked) => {this.checkedFun(checked,rowData.index)}}
           
           />
         
           {
            rowData.item.select?
            <TouchableOpacity
                style={{
                 
                  width: scale(33),
                  height: scale(25),
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop:scale(10)
          
                }}
                onPress={() => {
                  this.editItem(rowData.index);
                }}>
    <Image source={Images.pencil}
    style={{ width: scale(25), 
             height: scale(25) 
             }} />

              
              </TouchableOpacity>:null
           }

             
            </View>
          </View>
        );
      }

   

      renderNext = () => {
        const {item_list}=this.state
       
         const newData = item_list.filter(item => {return item.select ==true});

         const amt_receive =newData.reduce((prev, next) => prev + parseInt(next.amt_receive), 0)
         const tds_amt =newData.reduce((prev, next) => prev + parseInt(next.tds), 0)
         const round_off =newData.reduce((prev, next) => prev + parseInt(next.round_off), 0)

         const total_sum = amt_receive+tds_amt+round_off



        var footer_View = (
          <View>
            <View
              style={{
                width: '94%',
                alignSelf: 'center',
    
                borderTopWidth: 0.8,
                borderLeftWidth: 0.8,
                borderRightWidth: 0.8,
                borderTopLeftRadius: scale(7),
                borderTopRightRadius: scale(7),
                borderColor: '#ddd',
                padding: scale(10),
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text style={{ fontSize: scale(12) }}>View Details</Text>
    
                <TouchableOpacity onPress={() => this._panel.show()}>
                  <Image
                    source={Images.arrows}
                    style={{
                      resizeMode: 'contain',
                      width: scale(25),
                      height: scale(25),
                    }}
                  />
                </TouchableOpacity>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: scale(12), fontWeight: 'bold' }}>
                  Total Amount Receive: 
                </Text>
                <Text
                  style={{ fontSize: scale(12), fontWeight: 'bold', color: 'green' }}> {total_sum}
                </Text>
              </View>
    
              <TouchableOpacity
              onPress={() => { 
                this.nextPress()
                
                }}

                disabled={!total_sum>0?true:false}
             
              >
                <View
                  style={{
                    width: '90%',
                    height: scale(60),
                    backgroundColor: !total_sum>0?'#ddd':'#3498DB',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: scale(40),
                    alignSelf: 'center',
                    borderRadius: scale(7),
                    marginTop: scale(10),
                  }}>
                  <Text style={{
                    textAlign: 'center',
                    color: '#fff',
                    fontSize: scale(15),
                  }}>{!total_sum>0?"Select Invoice Enter Amount":"Receive Payment"}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        );
    
        return footer_View;
      };

      renderSlidingUpPanel() {
        const {item_list ,advCheck,adv_account,edit_id} = this.state;

        const newData = item_list.filter(item => {return item.select ==true});
        const total_amt =newData.reduce((prev, next) => prev + parseInt(next.total_amt), 0)
        const amt_receive =newData.reduce((prev, next) => prev + parseInt(next.amt_receive), 0)
        const tds =newData.reduce((prev, next) => prev + parseInt(next.tds), 0)
        const round_off =newData.reduce((prev, next) => prev + parseInt(next.round_off), 0)
        const balance = total_amt - amt_receive - tds - round_off;
        const total_sum = amt_receive+tds+round_off
    
        var footer_View = (
          <SlidingUpPanel ref={c => (this._panel = c)}>
            <View style={{ flex: 1 }}>
              <View
                style={{
                  position: 'absolute',
                  bottom: 0,
    
                  backgroundColor: '#fff',
    
                  width: '95%',
                  alignSelf: 'center',
    
                  padding: scale(10),
                  borderTopEndRadius: scale(7),
                  borderTopStartRadius: scale(7)
                }}>
                <View
                  style={{
                    width: '100%',
                    alignItems: 'center',
                    height: scale(40),
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
    
                  <View>
                  {
                      edit_id != '' ? null : <Checkbox
                        label='Advance/On Account'
                        checked={advCheck}
                        onChange={(val) => { this.setState({ advCheck: val.checked, adv_account: 0 }) }}
                      />

                  }
                    
                  </View>
    
                  <TouchableOpacity onPress={() => this._panel.hide()}>
                    <Image
                      source={Images.interface}
                      style={{
                        resizeMode: 'contain',
                        width: scale(25),
                        height: scale(25),
                      }}
                    />
                  </TouchableOpacity>
                </View>
    
                <View
                  style={{
                    width: '100%',
                    height: scale(60),
                    alignItems: 'center',
                    height: scale(40),
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={{ fontSize: scale(12), fontWeight: 'bold' }}>
                    Total Amount 
                     </Text>
                  <View
                    style={{
                      height: scale(35),
                      backgroundColor: '#ddd',
                      borderColor: 'grey',
                      borderWidth: scale(1),
                      width: scale(200),
                      borderRadius: scale(5),
                    }}>
                    <TextInput
                      style={{ fontSize: scale(12) }}
                      autoCorrect={false}
                      autoCapitalize={'none'}
                      returnKeyType={'next'}
                  
                      underlineColorAndroid="transparent"
                      //onChangeText={ total_amount => this.setState({total_amount})}
                      value={total_amt.toString()}
                      editable={false}
                    />
                  </View>
                </View>
    
                <View
                  style={{
                    width: '100%',
                    height: scale(60),
                    alignItems: 'center',
                    height: scale(40),
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={{ fontSize: scale(12), fontWeight: 'bold' }}>
                    Amount Received
                     </Text>
                  <View
                    style={{
                      height: scale(35),
                      backgroundColor: '#ddd',
                      borderColor: 'grey',
                      borderWidth: scale(1),
                      width: scale(200),
                      borderRadius: scale(5),
                    }}>
                    <TextInput
                      style={{ fontSize: scale(12) }}
                      autoCorrect={false}
                      autoCapitalize={'none'}
                      returnKeyType={'next'}
                      placeholderTextColor="grey"
                      underlineColorAndroid="transparent"
                      // onChangeText={ amount_recvd => this.setState({amount_recvd})}
                      value={amt_receive.toString()}
                      editable={false}
                    />
                  </View>
                </View>
                <View
                  style={{
                    width: '100%',
                    height: scale(60),
                    alignItems: 'center',
                    height: scale(40),
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={{ fontSize: scale(12), fontWeight: 'bold' }}>
                    TDS Amount
                     </Text>
                  <View
                    style={{
                      height: scale(35),
                      backgroundColor: '#ddd',
                      borderColor: 'grey',
                      borderWidth: scale(1),
                      width: scale(200),
                      borderRadius: scale(5),
                    }}>
                    <TextInput
                      style={{ fontSize: scale(12) }}
                      autoCorrect={false}
                      autoCapitalize={'none'}
                      returnKeyType={'next'}
                      placeholderTextColor="grey"
                      underlineColorAndroid="transparent"
                      // onChangeText={ tds_amount => this.setState({tds_amount})}
                      value={tds.toString()}  
                      editable={false}
                    />
                  </View>
                </View>
                <View
                  style={{
                    width: '100%',
                    height: scale(60),
                    alignItems: 'center',
                    height: scale(40),
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={{ fontSize: scale(12), fontWeight: 'bold' }}>
                    Round Of
                     </Text>
                  <View
                    style={{
                      height: scale(35),
                      backgroundColor: '#ddd',
                      borderColor: 'grey',
                      borderWidth: scale(1),
                      width: scale(200),
                      borderRadius: scale(5),
                    }}>
                    <TextInput
                      style={{ fontSize: scale(12) }}
                      autoCorrect={false}
                      autoCapitalize={'none'}
                      returnKeyType={'next'}
                      placeholderTextColor="grey"
                      underlineColorAndroid="transparent"
                      // onChangeText={ round_of => this.setState({round_of})}
                      value={round_off.toString()}
                      editable={false}
                    />
                  </View>
                </View>
    
                <View
                  style={{
                    width: '100%',
                    height: scale(60),
                    alignItems: 'center',
                    height: scale(40),
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={{ fontSize: scale(12), fontWeight: 'bold' }}>
                    Balance
                     </Text>
                  <View
                    style={{
                      height: scale(35),
                      backgroundColor: '#ddd',
                      borderColor: 'grey',
                      borderWidth: scale(1),
                      width: scale(200),
                      borderRadius: scale(5),
                    }}>
                    <TextInput
                      style={{ fontSize: scale(12) }}
                      autoCorrect={false}
                      autoCapitalize={'none'}
                      returnKeyType={'next'}
                      placeholderTextColor="grey"
                      underlineColorAndroid="transparent"
                      // onChangeText={ round_of => this.setState({round_of})}
                      value={balance.toString()}
                      editable={false}
                   
                    />
                  </View>
                </View>
    
                {
                  advCheck ? 
                  <View
                  style={{
                    width: '100%',
                    height: scale(60),
                    alignItems: 'center',
                    height: scale(40),
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={{ fontSize: scale(12), fontWeight: 'bold' }}>
                    Adv./On Account
                     </Text>
                  <View
                    style={{
                      height: scale(35),
                      backgroundColor: '#fff',
                      borderColor: 'grey',
                      borderWidth: scale(1),
                      width: scale(200),
                      borderRadius: scale(5),
                    }}>
                    <TextInput
                      style={{ fontSize: scale(12) }}
                      autoCorrect={false}
                      autoCapitalize={'none'}
                      returnKeyType={'next'}
                      placeholderTextColor="grey"
                      underlineColorAndroid="transparent"
                      
                      onChangeText={adv_account => {
                    if (adv_account.trim() == '') {
                      this.setState({adv_account: 0});
                    } else if (isNaN(adv_account)) {
                      this.setState({adv_account: 0});
                    } else {
                      this.setState({adv_account: parseInt(adv_account)});
                    }
                  }}
                  value={adv_account.toString()}
                      value={adv_account.toString()}
                      keyboardType="number-pad"
                    />

                  </View>
                </View>
    
                  : null 
                }
    
                
    
                <TouchableOpacity
                onPress={() => { this.nextPress()}}
                disabled={!newData.length>0?true:false}
                >
                  <View
                    style={{
                      width: '90%',
                      height: scale(60),
                      backgroundColor: !total_sum>0?'#ddd':'#3498DB',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: scale(40),
                      alignSelf: 'center',
                      borderRadius: scale(7),
                      marginTop: scale(10),
                    }}>
                   <Text style={{
                    textAlign: 'center',
                    color: '#fff',
                    fontSize: scale(15),
                  }}>{!total_sum>0?"Select Invoice Enter Amount":"Receive Payment"}</Text>
                  </View>
                </TouchableOpacity>
    
    
              </View>
            </View>
          </SlidingUpPanel>
        );
    
        return footer_View;
    
      }

  
      
      
    render() {
      const { company_list, item_list, edit_id } = this.state

        return (
            <View style={{
             flex: 1, borderTopColor: '#aeea00', 
           }}>



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
<View style={{marginLeft:scale(80),marginTop:scale(20),
                  width:scale(190),height:scale(40),borderRadius:scale(4), backgroundColor:'#aeea00'}}>
              <Text style={{
                marginTop:scale(7),
                position: "absolute",
                alignSelf: "center",
                fontSize: scale(18),
                color: "black",
                fontWeight: 'bold'
              }}>{this.state.edit_id ? "Edit Customer Payment" : "Customer Payment"}</Text>
 </View>
            {
                company_list.length > 0 && edit_id == '' ?


                  <TouchableHighlight
                    activeOpacity={1}
                    underlayColor={'#ddd'}
                    onPress={() => {
                      if (this.state.company_list.length > 0) {
                        this.setState({ search_company: true })
                      }}}
                    style={{
                      width: scale(40), height: scale(40),
                      position: "absolute",
                      alignSelf: 'flex-end',


                      alignItems: "center",
                      justifyContent: 'center',
                      borderRadius: scale(20)
                    }}
                  >

                    <Image source={Images.search} style={{
                      width: scale(30), height: scale(30),


                    }} />

                  </TouchableHighlight>:null
}


            </View>

      
              
                {this._searchRender()}
                {this.editNewItem()}
                {this._addBankModal()}

<CardView
          height={505}
          width={330}
          style={{backgroundColor:'#eceff1'}}
          cardElevation={2}
          cardMaxElevation={2}
          cornerRadius={20}
          marginTop={10}
          marginLeft={15}>
            
          <FlatList
            ref={(ref) => { this.flatListRef = ref; }}
          contentContainerStyle={{flexGrow: 1, paddingBottom: scale(5)}}
          data={item_list}
          keyExtractor={(item, index) => index.toString()}
          ListHeaderComponent={this._bankRender()}
         // stickyHeaderIndices={[0]}
          bounces={false}
          extraData={this.state}
          ItemSeparatorComponent={this.FlatListItemSeparator}
          renderItem={item => this.renderFlatList(item)}
          ListEmptyComponent={
            <View
              style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              {this.state.loading == false ? (
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  
                  <View
                    style={{
                      backgroundColor: '#ddd',
                      width: scale(80),
                      height: scale(80),
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: scale(80) / 2,
                      borderWidth: 2,
                      borderColor: '#AED581',
                    }}>
                    <Image
                      source={Images.logo}
                      style={{
                        resizeMode: 'contain',
                        width: scale(50),
                        height: scale(50),
                      }}
                    />
                  </View>
                  <Text
                    style={{
                      fontSize: scale(15),
                      width: scale(150),
                      textAlign: 'center',
                      marginTop: scale(5),
                      color:'red'
                    }}>
                    Please Search Customer..!!
                  </Text>
                </View>
              ) : null}
            </View>
          }
          onEndReachedThreshold={0.01}
        />
</CardView>
            
              
           

{item_list.length > 0 ? this.renderNext() : null}
{this.renderSlidingUpPanel()}

                

             

            </View>

        );
    }
}




const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flexDirection: 'row',
    },
    radioText: {
        marginRight: scale(10),
        fontSize: scale(12),
        color: '#5D6D7E',
        fontWeight: 'bold'
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
    txt: { fontSize: scale(12), width: scale(150), },
    txth: { fontSize: scale(12), fontWeight: 'bold' },

    txt_h: {
        fontSize: scale(12),
        color: '#000',
        fontWeight: 'bold',
        width: scale(200),
        textAlign: 'left'
    },

    userInput: {
        height: scale(40),
        backgroundColor: 'white',
        marginBottom: scale(15),
        borderColor: 'grey',
        borderWidth: scale(1),
        width: scale(200),
        borderRadius: scale(5)
    },

    input: {
        color: '#000',
        marginLeft: scale(5),
        width: '73%',
        fontSize: scale(12)
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
        fontSize: scale(12)
    },
    txt_log: {
        fontSize: scale(12),
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


CustomerPayOneScreen.defaultProps = {
    session: [],
    user_id: '',
    user_type: '',
}


const mapStateToProps = (state) => {
    return {

        session: state.user.session_id,
        network: state.network,
        user_id: state.user.id,
        user_type: state.user.type,

    };
};

const mapDispatchToProps = dispatch => {
    const { actions } = require('@redux/NewEstimateRedux');

    return {
        est_data: conData => dispatch(actions.est_data(conData)),
    };
};


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CustomerPayOneScreen);