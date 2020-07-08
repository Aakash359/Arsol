import React, { PureComponent } from "react";

import {
  View,
  ActivityIndicator,
  Keyboard,
  Text,
  Button,
  ScrollView,
  StyleSheet,
  Image, TouchableOpacity, RefreshControl, Modal, TextInput,Alert,
  Dimensions, TouchableHighlight
} from 'react-native';

import { connect } from "react-redux";
import { Images, Config, Color } from '@common';


import { scale, s } from "react-native-size-matters";
import { StackActions } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
const msg = Config.SuitCRM;
import ArsolApi from '@services/ArsolApi';
import { LogoSpinner } from '@components';
import Snackbar from 'react-native-snackbar';

import {
  LineChart,


} from "react-native-chart-kit";
import ActionSheet from 'react-native-actionsheet';
import Ripple from 'react-native-material-ripple';

class HomeScreen extends PureComponent {


  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      refresh: false,
      dashboard: "false",
     
      invoice: "",
      estimate: "",
      credit_note: "",
      sale: "",
      items: "",
      customers: "",

      page:0,
      addItem:false,
      item_type:"Goods",
      name:"",
      unit:'',
      rate:"",
      hsn_sac_code:"",
      gst:"",
      des:"",
      unit_list:[],
      gst_list:[],
      chart_list: [],
    }
  }

  componentDidMount() {

    const { network, user_id, user_type } = this.props;
    if (!network.isConnected) {
      Snackbar.show({
        text: msg.noInternet,
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: "red"
      });
    } else {
      this.setState({ loading: true }, () => {
          this.hit_homeApi(user_id, user_type),
          this.hit_unit_listApi(),
          this.hit_gst_listApi()
          this.hit_chartApi()
     
      })

    }
  }

  onRefresh() {
    const { network, user_id, user_type } = this.props;
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
          data: '',
          data_stacked: '',
          h_data: '',
          v_data_stacked: '',
          chart_list:[]
        },
        () => {
          this.hit_homeApi(user_id, user_type)
         // this.hit_chartApi()
        },
      );
    }

  }

  hit_homeApi(id, type) {
    ArsolApi.dashboard_api(id, type)

      .then(responseJson => {
        console.log('dashboard', responseJson);

        if (responseJson.ok) {
          this.setState({
            loading: false,
            refresh: false
          });

          if (responseJson.data != null) {
            if (responseJson.data.hasOwnProperty('status')) {

              if (responseJson.data.status == 'success') {
                if (responseJson.data.hasOwnProperty('message')) {



                  if (responseJson.data.hasOwnProperty("data")) {
                    if (responseJson.data.data.length > 0) {
                      this.setState({
                        dashboard: responseJson.data.dashboard,
                        invoice: responseJson.data.data[0].invoice,
                        estimate: responseJson.data.data[0].estimate,
                        credit_note: responseJson.data.data[0].credit_note,
                        sale: responseJson.data.data[0].sale,
                        items: responseJson.data.data[0].items,
                        customers: responseJson.data.data[0].customers
                      })
                      Snackbar.show({
                        text: responseJson.data.message,
                        duration: Snackbar.LENGTH_SHORT,
                        backgroundColor: Color.lgreen
                      });
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
  }
  hit_chartApi() {
    const {user_id,user_type} = this.props;
    ArsolApi.MonthlyChart_post_api(user_id, user_type)

      .then(responseJson => {
        console.log('MonthlyChart_post_api', responseJson);

        if (responseJson.ok) {
          this.setState({
            loading: false,
            refresh: false
          });

          if (responseJson.data != null) {
            if (responseJson.data.hasOwnProperty('status')) {

              if (responseJson.data.status == 'success') {
                if (responseJson.data.hasOwnProperty('message')) {



                  if (responseJson.data.hasOwnProperty("data")) {
                    if (responseJson.data.data.length > 0) {
                      this.setState({

                        chart_list: responseJson.data.data
                      })
                      Snackbar.show({
                        text: responseJson.data.message,
                        duration: Snackbar.LENGTH_SHORT,
                        backgroundColor: Color.lgreen
                      });
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
  }



  _addItemRender() {
    return (
      <Modal
        transparent={true}
        animationType={'slide'}
        visible={this.state.addItem}
        onRequestClose={() => {
          this.setState({ addItem: false });
        }}>
       
  


          <ScrollView style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            contentContainerStyle={{
              flex: 1,
              justifyContent: 'center',
              alignItems: "center",
              padding: scale(5)
            }}
            keyboardShouldPersistTaps="handled"
          >


            <View style={{
                      backgroundColor:"#fff",
                      margin:scale(15),
                      width:"95%",
                      borderRadius:scale(5),
                      padding:scale(20)
                      }}>

                      <Text style={{
                        fontSize:scale(18),
                        fontWeight:'bold',
                        marginBottom:scale(10)
                      }}>Add New Item</Text>

            <View style={{flexDirection:"row",
            justifyContent:"space-between",alignItems:"center",
            }}
            >

              <Text style={styles.txt_h}>Item Type</Text>
              <View style={styles.userInput}>

                <RNPickerSelect
                  placeholder={{}}
                  items={[
                    { label: 'Goods', value: 'Goods' },
                    { label: 'Service', value: 'Service' },

                  ]}
                  onValueChange={(value) => {
                    this.setState({ item_type: value })
                    console.log(value)
                  }}
                  value={this.state.item_type}
                />

              </View>


            </View>

            <View style={{
              flexDirection: "row",
              justifyContent: "space-between", alignItems: "center",
              marginTop:scale(10)
            }}
            >

              <View style={{flexDirection:'row'}}>
                <Text style={styles.txt_h}>Name</Text>
                <Text style={{color:'red',fontSize:scale(15),
                textAlignVertical:"center"}}> *</Text>
              </View>
       

              <View style={styles.userInput}>

                <TextInput
                  style={styles.input}
                  autoCorrect={false}
                  autoCapitalize={'none'}
                  underlineColorAndroid="transparent"
                  onChangeText={name => this.setState({ name })}
                  value={this.state.name}
                />

              </View>


            </View>

            <View style={{
              flexDirection: "row",
              justifyContent: "space-between", alignItems: "center",
              marginTop: scale(10)
            }}
            >

              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.txt_h}>Unit</Text>
                <Text style={{
                  color: 'red', fontSize: scale(15),
                  textAlignVertical: "center"
                }}> *</Text>
              </View>


              <View style={styles.userInput}>

                <RNPickerSelect
                  placeholder={{
                    label: "Select Unit",
                    value: "",
                    color: 'black',
                    fontSize: scale(12),
                    fontWeight: 'bold',
                  }}
                  style={{
                    inputIOS: styles.inputIOS,
                    inputAndroid: styles.inputAndroid,
                  }}
                  items={this.state.unit_list}
                  onValueChange={(unit) => {
                    this.setState({ unit })
                    console.log(unit)
                  }}
                  value={this.state.unit}
                />

              </View>


            </View>

            <View style={{
              flexDirection: "row",
              justifyContent: "space-between", alignItems: "center",
              marginTop: scale(10)
            }}
            >

              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.txt_h}>Rate (Rs.)</Text>
                <Text style={{
                  color: 'red', fontSize: scale(15),
                  textAlignVertical: "center"
                }}> *</Text>
              </View>


              <View style={styles.userInput}>

                <TextInput
                  style={styles.input}

                  autoCorrect={false}
                  autoCapitalize={'none'}
                  keyboardType={'number-pad'}
                  placeholderTextColor="grey"
                  underlineColorAndroid="transparent"
                  onChangeText={rate => this.setState({ rate })}
                  value={this.state.rate}
                />

              </View>


            </View>

            <View style={{
              flexDirection: "row",
              justifyContent: "space-between", alignItems: "center",
              marginTop: scale(10)
            }}
            >

              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.txt_h}>{this.state.item_type == "Goods" ? "HSN Code" : "SAC Code"}</Text>
                <Text style={{
                  color: 'red', fontSize: scale(15),
                  textAlignVertical: "center"
                }}> *</Text>
              </View>


              <View style={styles.userInput}>

                <TextInput
                  style={styles.input}

                  autoCorrect={false}
                  autoCapitalize={'none'}

                  placeholderTextColor="grey"
                  underlineColorAndroid="transparent"
                  onChangeText={hsn_sac_code => this.setState({ hsn_sac_code })}
                  value={this.state.hsn_sac_code}
                />

              </View>


            </View>


            <View style={{
              flexDirection: "row",
              justifyContent: "space-between", alignItems: "center",
              marginTop: scale(10)
            }}
            >

              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.txt_h}>GST (%)</Text>
                <Text style={{
                  color: 'red', fontSize: scale(15),
                  textAlignVertical: "center"
                }}> *</Text>
              </View>


              <View style={styles.userInput}>

                <RNPickerSelect
                  placeholder={{
                    label: "Select Gst",
                    value: "",
                    color: 'black',
                    fontSize: scale(12),
                    fontWeight: 'bold',

                  }}
                  style={{
                    inputIOS: styles.inputIOS,
                    inputAndroid: styles.inputAndroid,
                  }}
                  items={this.state.gst_list}
                  onValueChange={(value) => { this.setState({ gst: value }) }}
                  value={this.state.gst}
                />

              </View>


            </View>

            <View style={{
              flexDirection: "row",
              justifyContent: "space-between", alignItems: "center",
              marginTop: scale(10)
            }}
            >

              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.txt_h}>Description</Text>
                <Text style={{
                  color: 'red', fontSize: scale(15),
                  textAlignVertical: "center"
                }}> *</Text>
              </View>


              <View style={styles.userInputTC}>

                <TextInput
                  style={styles.inputTC}
                  placeholder={'(Maximum 150 characters)'}
                 
                  autoCorrect={false}
                  autoCapitalize={'none'}

                  numberOfLines={1}
                  multiline={true}
                  placeholderTextColor="#ddd"
                  underlineColorAndroid="transparent"
                  onChangeText={des => this.setState({ des })}
                  value={this.state.des}
                  maxLength={150}
                />
              </View>


            </View>

            <View style={{
              flexDirection: "row",
               alignItems:"center",
              marginTop:scale(20),
             
            }}>
              <TouchableOpacity
               
                style={{
                  width: scale(90),
                  height: scale(30),
                  padding: scale(10),
                  backgroundColor: Color.btn,
                  borderRadius: scale(5),
                  alignItems:"center",
                  justifyContent:"center"
                 }}

                onPress={() => {
                  this._addItem_fun()
                }}
                >
                <Text style={{
                  color: '#fff',
                  fontSize: scale(15),
                  
                }}>Add Items</Text>
              </TouchableOpacity>

              <TouchableOpacity
                
                style={{
                  width: scale(90),
                  height: scale(30),
                  padding: scale(10),
                  backgroundColor: '#ddd',
                  borderRadius: scale(5),
                  alignItems:"center",
                  justifyContent:"center",
                  marginLeft:scale(20)
              
                }}
                onPress={() => {
                  this.setState({
                    addItem: false, item_type: "Goods",
                    name: "",
                    unit: '',
                    rate: "",
                    hsn_sac_code: "",
                    gst: "",
                    des: "",
                  });
                }}
              
                
                >
                <Text style={{
                  color: '#fff',
                  fontSize: scale(15),
                  textAlign: 'center'
                }}>Cancel</Text>
              </TouchableOpacity>

            </View>




            


           


            </View>
          </ScrollView>
       

     
      </Modal>
    )
  }

  _addItem_fun(){
    const{ item_type,
    name,
    unit,
    rate,
    hsn_sac_code,
    gst,
    des,
    
  
    } = this.state
  
  const {user_id,user_type,network} = this.props
  Keyboard.dismiss()
      if(name==""){
        alert("Enter Name")
      }else if(unit==""){
        alert("Select Unit")
      }else if(rate==""){
        alert("Enter Rate")
      }else if(hsn_sac_code==""){
  
        if(item_type=="Goods"){
          alert("Enter Hsn Code")
        }else{
          alert("Enter Sac Code")
        }
       
      }else if(gst==""){
        alert("Select Gst")
      }else if(des==""){
        alert("Enter Description")
      }else if(!network.isConnected){
        Snackbar.show({
          text: msg.noInternet,
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: "red"
        });
      }else{
        this.setState({ loading: true, addItem: false }, () => {
          this.hit_addItemApi(user_id, user_type, item_type,
            name.replace(/  +/g, ' '),
            unit,
            rate,
            hsn_sac_code.replace(/  +/g, ' '),
            gst,
            des.replace(/  +/g, ' '),
          
          )

        })
      
      }
      
  }


  hit_addItemApi(user_id,user_type,item_type,
    name,
    unit,
    rate,
    hsn_sac_code,
    gst,
    des,){
      ArsolApi.AddItem_post_api(user_id,user_type,item_type,
        name,
        unit,
        rate,
        hsn_sac_code,
        gst,
        des,
        ""
        )
  
      .then(responseJson => {
        console.log('AddItem_post_api', responseJson);
  
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
    item_type:"Goods",
    name:"",
    unit:'',
    rate:"",
    hsn_sac_code:"",
    gst:"",
    des:"",
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
  
    hit_gst_listApi(){
      const {user_id,user_type} = this.props
      const {page} = this.state
      ArsolApi.GstList_api(user_id,user_type,page)
  
      .then(responseJson => {
        console.log('GstList_api', responseJson);
  
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
                           this.setState({
                            gst_list:responseJson.data.data,
                           })
                           Snackbar.show({
                            text: responseJson.data.message,
                            duration: Snackbar.LENGTH_SHORT,
                            backgroundColor: Color.lgreen
                          });
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
  
    hit_unit_listApi(){
      const {user_id,user_type} = this.props
      const {page} = this.state
      ArsolApi.UnitList_api(user_id,user_type,page)
  
      .then(responseJson => {
        console.log('UnitList_api', responseJson);
  
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
                           this.setState({
                            unit_list:responseJson.data.data,
                           })
                           Snackbar.show({
                            text: responseJson.data.message,
                            duration: Snackbar.LENGTH_SHORT,
                            backgroundColor: Color.lgreen
                          });
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

    no_auth=()=>{
      Alert.alert(
        "Sorry",
        "You are not authorised to access this page.!!",
        [{ text: "OK", onPress: () => console.log("OK Pressed") }],
        { cancelable: false }
      );
    }


  render() {

    const { invoice, estimate, credit_note, sale, items, customers, chart_list} = this.state;
   

  



    return (
      
<ScrollView style={styles.container}
        contentInsetAdjustmentBehavior="automatic"
        refreshControl={
          <RefreshControl
            onRefresh={() => this.onRefresh()}
            refreshing={this.state.refresh}
          />
        }
      >
         <LogoSpinner loading={this.state.loading} /> 
 <TouchableHighlight
            activeOpacity={1}
            underlayColor={'#ddd'}
            onPress={() =>
             this.props.navigation.toggleDrawer()}
            style={{
              width: scale(35), height: scale(35),
              alignItems: "center",
              justifyContent: 'center',
              backgroundColor:Color.headerTintColor
            }}
          >
         <Image source={Images.menu} 
         style={{
                 width: scale(20),
                height: scale(20),
                }}/>
</TouchableHighlight>

  <Text 
  style={{
           fontSize:scale(20),
           fontWeight:'bold',
           textAlign:"center",
           marginHorizontal:scale(20)
        }}
        numberOfLines={1}
        >Welcome to ARSOL</Text>
  <Text
          style={{
            fontSize: scale(12),
            textAlign: "center"
          }}
          numberOfLines={1}
        >A Complete AR Solutions.</Text>

 <View
 style={{
   backgroundColor:Color.headerTintColor,
   margin:scale(10),
   padding:scale(15),
   borderRadius:scale(5)
  }}
 >


    <View
    style={{
      flexDirection:'row',
      justifyContent:"space-between",
      }}
    >

            
              <Ripple 
                style={styles.view1}
                rippleColor={Color.headerTintColor} rippleOpacity={0.54}
              onPress={() => {
                if (this.props.rolelist.reports){
                  this.props.navigation.navigate('InvoiceList') 
                }else{
                  this.no_auth()
                }
                  
              }}

              >

                <Image
                  style={styles.img1}
                  source={Images.invoice}
                  resizeMode={'contain'}
                />

                <Text
                  style={styles.txt1}
                  numberOfLines={1}
                >ALL INVOICE</Text>
                <Text
                  style={styles.txt2}
                  numberOfLines={1}
                >Total Invoice: {invoice}</Text>

              </Ripple>
  
 


   <Ripple style={styles.view1}
    rippleColor={Color.headerTintColor} rippleOpacity={0.54}
              onPress={() => {
                if (this.props.rolelist.estimate_list) {
                  this.props.navigation.navigate('EstimateList')
                } else {
                  this.no_auth()
                }

             
              }}
   >

              <Image
                style={styles.img1}
                source={Images.estimate}
                resizeMode={'contain'}
              />

              <Text
                style={styles.txt1}
                numberOfLines={1}
              >ALL Estimate</Text>
              <Text
                style={styles.txt2}
                numberOfLines={1}
              >Total Estimate: {estimate}</Text>
            </Ripple>  

    </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: "space-between",
              marginTop:scale(12)
            }}
          >

            <Ripple style={styles.view1}
              rippleColor={Color.headerTintColor} rippleOpacity={0.54}
              onPress={() => {
                if (this.props.rolelist.credit_note_list) {
                  this.props.navigation.navigate('CreditNoteList')
                } else {
                  this.no_auth()
                }
               
              }}
            >

              <Image
                style={styles.img1}
                source={Images.credit}
                resizeMode={'contain'}
              />

              <Text
                style={styles.txt1}
                numberOfLines={1}
              >ALL CREDIT NOTE</Text>
              <Text
                style={styles.txt2}
                numberOfLines={1}
              >Total credit note: {credit_note}</Text>
            </Ripple>
            <View style={styles.view1}
              
             
            >

              <Image
                style={styles.img1}
                source={Images.sale}
                resizeMode={'contain'}
              />

              <Text
                style={styles.txt1}
                numberOfLines={1}
              >TOTAL SALE</Text>
              <Text
                style={styles.txt2}
                numberOfLines={1}
              >{sale}</Text>
            </View>

          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: "space-between",
              marginTop: scale(12)
            }}
          >

            <Ripple style={styles.view1}
              rippleColor={Color.headerTintColor} rippleOpacity={0.54}
             
              onPress={() => {
             

                if (this.props.rolelist.item_detail) {
                     this.props.navigation.navigate('ItemDetails')
                } else {
                  this.no_auth()
                }
              }}
              
            >

              <Image
                style={styles.img1}
                source={Images.items}
                resizeMode={'contain'}
              />

              <Text
                style={styles.txt1}
                numberOfLines={1}
              >ALL ITEMS</Text>
              <Text
                style={styles.txt2}
                numberOfLines={1}
              >{items} Item(s) created</Text>
            </Ripple>
            <Ripple style={styles.view1}
              rippleColor={Color.headerTintColor} rippleOpacity={0.54}
              onPress={() => {
                

                if (this.props.rolelist.customer_detail) {
                  this.props.navigation.navigate('CustomerDetails')
                } else {
                  this.no_auth()
                }
              }}
          
            >

              <Image
                style={styles.img1}
                source={Images.customer}
                resizeMode={'contain'}
              />

              <Text
                style={styles.txt1}
                numberOfLines={1}
              >ALL CUSTOMERS</Text>
              <Text
                style={styles.txt2}
                numberOfLines={1}
              >{customers} Customer(s) created</Text>
            </Ripple>

          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: "space-between",
              marginTop: scale(12)
            }}
          >

            <View style={styles.view1}
           >

              

              <Text
                style={{
                  fontSize: scale(14),
                  textAlign: "center",
                  fontWeight: 'bold',
                 
                }}
                numberOfLines={1}
              >CUSTOMER ITEM</Text>
              <Ripple style={{flexDirection:"row",
               alignItems:"center",
               marginTop:scale(5)
              
              }}
                rippleColor={Color.headerTintColor} rippleOpacity={0.54}
                onPress={() => {
                  if (this.props.rolelist.customer_detail) {
                    this.props.navigation.navigate('ContactOne')
                  } else {
                    this.no_auth()
                  }

              
                }}
              >
                <Image source={Images.add}
                       style={{height:scale(20),
                              width:scale(20)
                       }}
                />
                <Text
                  style={styles.txt2}
                  numberOfLines={1}
                >  Add customer</Text>
              </Ripple>

              <Ripple style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: scale(5)

              }}
                rippleColor={Color.headerTintColor} rippleOpacity={0.54}
                onPress={() => {

                  if (this.props.rolelist.item_detail) {
                    this.setState({
                      addItem: true
                    })
                  } else {
                    this.no_auth()
                  }
          

          }}
              >
                <Image source={Images.add}
                  style={{
                    height: scale(20),
                    width: scale(20)
                  }}
                />
                <Text
                  style={styles.txt2}
                  numberOfLines={1}
                >  Add item</Text>
              </Ripple>
             
             
            </View>
          

          </View>



          <View style={{
            width: '100%',
            marginTop: scale(10),
            backgroundColor: "#fff",
            height: '100%',
            borderRadius:scale(5),
            height:scale(350)
          
           

          }}>

            <View style={{
              flexDirection: 'row', justifyContent: "space-between",
              marginVertical: scale(10),
              marginHorizontal: scale(20)

            }}
            >
              <Text style={{
                fontSize: scale(14),
                color: '#000',
                fontWeight: 'bold',


              }}>Invoice Total </Text>
              <Text style={{
                fontSize: scale(14),
                color: '#000',
              }}> Monthly</Text>

            </View>



            <ScrollView horizontal={true}

              style={{
                marginTop: scale(2),
                borderRadius: scale(5),
             }}>

              {
                chart_list.length > 0 ?
                  <LineChart

                    data={chart_list[0]}

                    //     width={chart_list[0].labels.length * 20 + 50}


                    width={Dimensions.get("window").width} // from react-native
                    height={scale(300)}
                    yAxisLabel="₹"
                    //   yAxisSuffix="k"
                    yAxisInterval={1} // optional, defaults to 1
                    chartConfig={{
                      backgroundColor: "#fff",
                      backgroundGradientFrom: "#fff",
                      backgroundGradientTo: "#fff",
                      decimalPlaces: 0, // optional, defaults to 2dp

                      color: (opacity = 2) => `rgba(72, 205, 253, ${opacity})`,

                      labelColor: (opacity = 2) => `rgba(75, 75, 75, ${opacity})`,
                    
                      propsForDots: {
                        r: "2",
                        strokeWidth: "2",
                        stroke: "#000"
                      },
                      style:{

                      }

                    }}

                    bezier
                  
                    verticalLabelRotation={40}
                  />
                  : null
              }


            </ScrollView>


          </View>
 </View>           


       
        {this._addItemRender()} 
   
    
         

      



</ScrollView>
    


    );
  }
}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:"#fff"
  },
  view1:{
    padding: scale(10),
    backgroundColor: "#fff",
    borderRadius: scale(10),
    justifyContent: 'center',
    alignContent: 'center',
    width: '48%',
    minHeight:scale(120),
 
 
  },
  img1: {
    height: scale(60),
    width: scale(60),
    alignSelf: "center",
    margin: scale(5)
  },
  txt1: {
    fontSize: scale(14),
    textAlign: "center",
    fontWeight: 'bold',
  },
  txt2: {
    fontSize: scale(12),
    textAlign: "center",
    color:'#7F8181'
 },

  list: {
    width: scale(330),
    height: scale(120),
    margin: scale(10),
    elevation: scale(3),
    borderColor: '#85C1E9',
    padding: scale(10),



  },

 
  userInput: {
    height: scale(42),
    backgroundColor: 'white',
    borderWidth: scale(1),
    width: scale(200),
    justifyContent:"center",
    borderRadius:scale(5),
    borderColor:"#ddd"
   
  },

  input: {

   
  
    fontSize: scale(12)
  },

  txt_h: {
    fontSize: scale(12),
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'left'
  },


  userInputTC: {  
    height: scale(60),
    borderRadius:scale(5),
    borderColor: '#ddd',
    borderWidth: scale(1),
    width: scale(200),
  },

  inputTC: {
    color: '#000',
    fontSize: scale(12)
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


HomeScreen.defaultProps = {
  user_id: '',
  user_type: '',
  user_image:'',
  rolelist:''
}


const mapStateToProps = (state) => {
  return {


    user_id: state.user.id,
    user_type: state.user.type,
    network: state.network,
    user_image: state.user.image,
    rolelist: state.user.rolelist



  };
};


export default connect(
  mapStateToProps,
  null
)(HomeScreen);