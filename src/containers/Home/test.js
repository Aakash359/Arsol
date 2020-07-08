import React, { PureComponent } from "react";

import {
  View,
  ActivityIndicator,
  Keyboard,
  Text,
  Button,
  ScrollView,
  StyleSheet,
  Image, TouchableOpacity, RefreshControl, Modal, TextInput,
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
          this.hit_chartApi()
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

                <Text style={styles.txt_h}>Name</Text>
                <View style={styles.userInput}>

                  <TextInput
                    style={styles.input}

                    autoCorrect={false}
                    autoCapitalize={'none'}

                    placeholderTextColor="grey"
                    underlineColorAndroid="transparent"
                    onChangeText={name => this.setState({ name })}
                    value={this.state.name}
                  />
                </View>


                <Text style={styles.txt_h}>Unit</Text>
                <View style={styles.userInput}>

                    <RNPickerSelect
                      placeholder={{
                        label: "Select Unit",
                        value: "",

                      }}
                      items={this.state.unit_list}
                      onValueChange={(unit) => {
                        this.setState({ unit })
                        console.log(unit)
                      }}
                      value={this.state.unit}
                    />

                </View>


                <Text style={styles.txt_h}>Rate (Rs.)</Text>
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


                <Text style={styles.txt_h}>{this.state.item_type == "Goods" ? "HSN Code" : "SAC Code"}</Text>
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







                <Text style={styles.txt_h}>GST (%)</Text>

                <View style={styles.userInput}>

                  <RNPickerSelect
                    placeholder={{
                      label: "Select Gst",
                      value: "",

                    }}
                    items={this.state.gst_list}
                    onValueChange={(value) => { this.setState({ gst: value }) }}
                    value={this.state.gst}
                  />

                </View>

                <Text style={styles.txt_h}>Description </Text>
                <View style={styles.userInputTC}>

                  <TextInput
                    style={styles.inputTC}
                    placeholder={'(Maximum 150 characters)'}
                    autoCorrect={false}
                    autoCapitalize={'none'}

                    numberOfLines={1}
                    multiline={true}
                    placeholderTextColor="grey"
                    underlineColorAndroid="transparent"
                    onChangeText={des => this.setState({ des })}
                    value={this.state.des}
                    maxLength={150}
                  />
                </View>


                <View style={{
                  flexDirection: "row",
                  justifyContent: 'space-between'
                }}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={{
                      width: scale(90),
                      height: scale(30),
                      padding: scale(10),
                      backgroundColor: '#3D8EE1',
                      borderRadius: scale(8),
                      margin: scale(5)

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
                      width: scale(90),
                      height: scale(30),
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
                    }}> Save </Text>
                  </TouchableOpacity>

                </View>


              </View>



            </View>
          </ScrollView>
        </View>

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
        this.setState({loading:true,addItem:false},()=>{
          this.hit_addItemApi(user_id,user_type,item_type,
            name,
            unit,
            rate,
            hsn_sac_code,
            gst,
            des,
            )
          
        })}
      
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


  render() {

    const { chart_list,} = this.state;
    console.log(chart_list[0])

  

    var optionArray = [
    
      'Customer',
      'Item',
      'Invoice',
      'Estimate',
      'Credit Note',
      'Cancel',
  
      
    ]; 

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
     
        <View style={styles.container}>
        {/* <LogoSpinner loading={this.state.loading} /> */}

          <View style={{
          backgroundColor: "#80d4ff",
                    height: scale(170),
                    borderBottomLeftRadius: scale(50),
                    borderBottomRightRadius: scale(50),
                    width: '100%'
                   }}>

          <TouchableHighlight
            activeOpacity={1}
            underlayColor={'#ddd'}
          onPress={()=>this.props.navigation.toggleDrawer()}
          style={{width:scale(40),height:scale(40),
                  margin:scale(20),
                  
                  alignItems:"center",
                  justifyContent:'center',
                  borderRadius:scale(20)
                }}
            >
           
              <Image source={Images.menu} style={{
                width: scale(20), height: scale(20),
                
                
              }} />
          
          </TouchableHighlight>

<View style={{alignSelf:"center",position:"absolute",
top:10,
alignItems:"center",
justifyContent:"center"
}}>
            <Text style={{
              color: "#fff",
           
              fontSize: scale(20),

            }}>Welcome to ARSOL</Text>

<View style={{flexDirection:"row"}}>

              <Text style={{
                color: "#fff",
                fontSize: scale(12),
              }}>A Complete</Text>

              <Text style={{
                color: "#fff",
                fontSize: scale(12),
                marginLeft:scale(5),
                fontWeight:"bold"
              }}>AR Solutions.</Text>
</View>
           
</View>

          <TouchableHighlight
            activeOpacity={1}
            underlayColor={'#ddd'}
            onPress={() => this.ActionSheet.show() }
            style={{
              width: scale(40), height: scale(40),
              margin: scale(20),

              alignItems: "center",
              justifyContent: 'center',
              borderRadius: scale(20),
              position:'absolute',
              top:0,
              right:0
            }}
          >

            <Image source={Images.plus} style={{
              width: scale(20), height: scale(20),


            }} />

          </TouchableHighlight>


                  

             
 
            <View
              style={{
                width: '80%',
                height: scale(170),
                backgroundColor: "#fff",
                alignSelf: 'center',
                position: "absolute",
                top:70,
              padding: scale(15),
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 9,
              },
              shadowOpacity: 0.48,
              shadowRadius: 11.95,

              elevation: 20,
              borderRadius: scale(15),

              }}
            
            >
              <Image source={{ uri: this.props.user_image }}
                  style={{height:scale(60),
                          width:scale(60),
                          borderRadius:scale(30),
                          borderWidth:scale(0.5),
                          borderColor:"#000",
                          alignSelf:'center'
                         }}

            />
            <Text style={{ fontSize: scale(15), fontWeight: 'bold', color: '#000',
            alignSelf:"center",
            marginTop:scale(5)
             }}>Rahul Singh</Text>

             <View style={{flexDirection:'row',
                           justifyContent:'space-between',
                           width:"100%",
                           marginTop:scale(10)
                          

                           }}>

                           <View style={{alignItems:"center",justifyContent:"center"}}>
                <Text style={{
                  fontSize: scale(18), color: '#000',
                  alignSelf: "center",

                }}>{this.state.credit_note}</Text>
                <Text style={{
                  fontSize: scale(12), color: 'grey',
                  alignSelf: "center",
                
                }}>Credit Note</Text>
                           </View>

              <View style={{ alignItems: "center", justifyContent: "center" }}>
                <Text style={{
                  fontSize: scale(18), color: '#000',
                  alignSelf: "center",

                }}>{this.state.sale}</Text>
                <Text style={{
                  fontSize: scale(12), color: 'grey',
                  alignSelf: "center",
                  
                }}>Total Sale</Text>
              </View>
            

                           </View>
          </View>            
            
          </View>

         <View style={{marginTop:scale(75),
         backgroundColor:"#fff",
          padding: scale(15),
          shadowColor: "#000",
        
         
         }}> 
          <View style={{
            width: '100%',

            flexDirection: 'row',
            justifyContent: 'space-between'
          }}>
            <View style={{ alignItems: "center" }}>
              <Text style={{
              fontWeight: 'bold', 
               color: '#84C659',
               marginBottom:scale(5),
               fontSize:scale(18)
                }}>
                {this.state.invoice}</Text>

              <View style={{
                height: scale(30),
                
                width: scale(90),
                borderRadius: scale(15),
                borderColor: '#84C659',
                borderWidth: scale(3),
                alignItems: "center",
                justifyContent: "center"
              }}>
                <Text style={{ color: '#84C659',
                 fontWeight: 'bold',
                 fontSize:scale(10)
                  }}>
                  Invoice</Text>
              </View>

            </View>

            <View style={{ alignItems: "center" }}>
              <Text style={{ fontWeight: 'bold',
               color: '#31BABB',marginBottom:scale(5),
                fontSize: scale(18)
                }}>
                {this.state.estimate}</Text>

              <View style={{
                height: scale(30),
              
                width: scale(90),
                borderRadius: scale(15),
                borderColor: '#31BABB',
                borderWidth: scale(3),
                alignItems: "center",
                justifyContent: "center"
              }}>
                <Text style={{
                  color: '#31BABB',
                 fontWeight: 'bold',
                  fontSize: scale(10) }}>
                  Estimate</Text>
              </View>

            </View>

            <View style={{ alignItems: "center" }}>
              <Text style={{ fontWeight: 'bold', 
              color: '#797CBB',marginBottom:scale(5),
                fontSize: scale(18) }}>
                {this.state.customers}</Text>

              <View style={{
                height: scale(30),
                
                width: scale(90),
                borderRadius: scale(15),
                borderColor: '#797CBB',
                borderWidth: scale(3),
                alignItems: "center",
                justifyContent: "center"
              }}>
                <Text style={{ color: '#797CBB',
                 fontWeight: 'bold',
                 fontSize:scale(10)
                  }}>
                  Customer</Text>
              </View>

            </View>


          </View>

     
     
         </View>


     <View style={{
                  width:'100%',
                  marginTop:scale(10),
          backgroundColor: "#fff",
          borderTopLeftRadius: scale(25),
          borderTopRightRadius: scale(25),
          height:'100%'
                }}>

<View style={{flexDirection:'row',justifyContent:"space-between",
        marginVertical:scale(10),
        marginHorizontal:scale(20)

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

            style={{ marginTop: scale(2),

         

            
             }}>

{
  chart_list.length>0?
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

                    color: (opacity=2 ) => `rgba(72, 205, 253, ${opacity})`,
                  
                    labelColor: (opacity=2 ) => `rgba(75, 75, 75, ${opacity})`,
                    style: {
                      borderRadius: scale(16),
                     
                     
                    },
                    propsForDots: {
                      r: "2",
                      strokeWidth: "2", 
                      stroke: "#000"
                    },

                  }}

                  bezier
                  style={{

                    borderRadius: scale(10),
                   
                  }}
                   verticalLabelRotation={40}
                />
  :null
}
            

          </ScrollView>

      
</View>


        <ActionSheet
          ref={o => (this.ActionSheet = o)}
          //Title of the Bottom Sheet
            title={<Text style={{ color: '#000', fontSize: scale(18) }}>Which one do you like to Add ?</Text>}
          //Options Array to show in bottom sheet
          options={optionArray}
          //Define cancel button index in the option array
          //this will take the cancel option in bottom and will highlight it
          cancelButtonIndex={5}
          //If you want to highlight any specific option you can use below prop
         // destructiveButtonIndex={0}
          onPress={index => {
            //Clicking on the option will give you the index of the option clicked
            alert(optionArray[index]);
          }}
           
        />
        
   
    
         

      

</View>

</ScrollView>
    


    );
  }
}




const styles = StyleSheet.create({
  container: {
    flex: 1,
   

  },

  

  list: {
    width: scale(330),
    height: scale(120),
    margin: scale(10),
    elevation: scale(3),
    borderColor: '#85C1E9',
    padding: scale(10),



  },
  icons: { width: scale(50), height: scale(30), },
  txth: { marginLeft: scale(15), fontSize: scale(20), fontWeight: 'bold', color: '#aed581', width: scale(180) },
  txts: { marginLeft: scale(30), fontSize: scale(15), width: scale(150) },
  sview: { flexDirection: 'row', padding: scale(15), alignItems: 'center' },

  txt:{fontSize:scale(15),width:scale(150),},
  txth:{fontSize:scale(15),fontWeight:'bold'},
  userInput: {
    height: scale(30),
    backgroundColor: 'white',
    marginBottom: scale(15),
    borderColor: 'grey',
    borderWidth: scale(1),
    width:scale(200),
    borderRadius:scale(5)
    },

    input: {
      color: '#000',
      marginLeft: scale(5),
      width: '73%',
      fontSize: scale(12)
      },

      txt_h: {
        fontSize: scale(12),
        color: '#000',
        fontWeight: 'bold',
        width:scale(200),
       textAlign:'left'
        },    
  

        userInputTC: {
          height: scale(100),
          backgroundColor: 'white',
          marginBottom: scale(15),
          borderColor: 'grey',
          borderWidth: scale(1),
          width:scale(200),
          },

          inputTC: {
            color: '#000',
            fontSize: scale(12)
            },
})


HomeScreen.defaultProps = {
  user_id: '',
  user_type: '',
  user_image:''
}


const mapStateToProps = (state) => {
  return {


    user_id: state.user.id,
    user_type: state.user.type,
    network: state.network,
    user_image: state.user.image,



  };
};


export default connect(
  mapStateToProps,
  null
)(HomeScreen);