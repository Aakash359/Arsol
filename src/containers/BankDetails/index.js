import React, { PureComponent } from "react";

import {
  View,Keyboard,

  Text,Modal,ScrollView,TextInput,ImageBackground,Dimensions,
  StyleSheet,FlatList,TouchableOpacity,Alert,RefreshControl,Image,ActivityIndicator, TouchableHighlight
} from 'react-native';

import { connect } from "react-redux";
import {Images,Config, Color} from '@common';

import {NavigationBar} from '@components';
import { scale } from "react-native-size-matters";
import { StackActions } from '@react-navigation/native';
import { pan_no, gest_no, ifsc_no, ac_no } from '../../Omni';
const msg = Config.SuitCRM;

import ArsolApi from '@services/ArsolApi';
import { LogoSpinner } from '@components';
import Snackbar from 'react-native-snackbar';
import RNPickerSelect from 'react-native-picker-select';
import Checkbox from 'react-native-modest-checkbox'

class BankDetailsScreen extends PureComponent {


  constructor(props) {
    super(props);
    this.state={
      loading:false,
      refresh:false,
      load_more:false,
      onEndReachedCalledDuringMomentum: true,
      addItem:false,
      page:0,
      show_list:[],
      
     
      b_name:"",
      ac_name:'',
      ac_no:'',
      ifsc_code:'',
      edit_id:"",
   
      


     }

 }

 componentDidMount() {
  const { network} = this.props;
  this._subscribe = this.props.navigation.addListener('focus', () => {
    if(!network.isConnected){
      Snackbar.show({
        text: msg.noInternet,
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: "red"
      });
    }else{
      this.setState({loading:true,
        refresh: false,
        load_more: false,
        onEndReachedCalledDuringMomentum: true,
        addItem: false,
        page: 0,
        show_list: [],


        b_name: "",
        ac_name: '',
        ac_no: '',
        ifsc_code: '',
        edit_id: "",},()=>{
        this.hit_bankDetailApi()
      })} 
  })
  
  }

//add
_addItem_fun(){
  const{ b_name,
   ac_name,
   ac_no,
   ifsc_code,
   edit_id
 } = this.state

const {user_id,user_type,network} = this.props
Keyboard.dismiss()
    if(b_name.trim()==""){
      
      Snackbar.show({
        text: 'Enter Bank Name',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: Color.lgreen
      });
    }else if(ac_name.trim()==""){
  
      Snackbar.show({
        text: 'Enter Account Name',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: Color.lgreen
      });
    }else if(ac_no.trim()==""){
      
      Snackbar.show({
        text: 'Enter Account No.',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: Color.lgreen
      });
    }else if(isNaN(ac_no)){
   
      Snackbar.show({
        text: 'Account No. Invalid',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: Color.lgreen
      });
    }else if(ifsc_code.trim()==""){
      alert("Enter IFSC Code")
     }
    else if (ifsc_no(ifsc_code) === false) {
      Snackbar.show({
        text: 'IFSC No. Invalid',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: Color.lgreen
      });
    }
     else if(!network.isConnected){
      Snackbar.show({
        text: msg.noInternet,
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: "red"
      });
    }else{
      this.setState({loading:false,addItem:false},()=>{
        this.hit_addItemApi(user_id,user_type, b_name,
          ac_name,
          ac_no,
          ifsc_code,
          edit_id
        )
        
      })}
    
}

hit_addItemApi(user_id,user_type,
   b_name,
  ac_name,
  ac_no,
  ifsc_code,
  edit_id
){


    ArsolApi.AddBank_api(user_id,user_type,
      b_name,
      ac_name,
      ac_no,
              ifsc_code,
              edit_id
      )

    .then(responseJson => {
      console.log('AddBank_api', responseJson);

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
  edit_id:'',
  b_name:'',
  ac_name:'',
  ac_no:'',
  ifsc_code:''
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



 

  hit_bankDetailApi(){
    const {user_id,user_type} = this.props
    const {page} = this.state
    ArsolApi.BankDetails_api(user_id,user_type,page)

    .then(responseJson => {
      console.log('BankDetails_api', responseJson);

      if (responseJson.ok) {
        this.setState({
          loading: false,
          refresh:false
        });

        if (responseJson.data != null) {
          if (responseJson.data.hasOwnProperty('status')) {
          
              if (responseJson.data.status == 'success') {
              if (responseJson.data.hasOwnProperty('message')) {

                 if(responseJson.data.hasOwnProperty("data")){
                       if(responseJson.data.data.length>0){
                         this.setState({
                          show_list:[...this.state.show_list, ...responseJson.data.data],
                          load_more:responseJson.data.load_more
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
            refresh:false
          });
        } else if (responseJson.problem == 'TIMEOUT_ERROR') {
          Snackbar.show({
            text: msg.serTimErr,
            duration: Snackbar.LENGTH_SHORT,
            backgroundColor: Color.lgreen
          });
          this.setState({
            loading: false,
            refresh:false
          });
        } else {
          Snackbar.show({
            text: msg.servErr,
            duration: Snackbar.LENGTH_SHORT,
            backgroundColor: "red"
          });
          this.setState({
            loading: false,
            refresh:false
          });
        }
      }
    })
    .catch(error => {
      console.error(error);
      this.setState({
        loading: false,
        refresh:false
      });
    });
  }
  //refresh
  onRefresh() {
    const {network} = this.props
    if(!network.isConnected){
      Snackbar.show({
        text: msg.noInternet,
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: "red"
      });
    }else{
      this.setState(
        {
          refresh: true,
          load_more:false,
          page: 0,
          show_list: [],
        },
        () => {
          this.hit_bankDetailApi();
        },
      );
    }
   
  }
  //scroll
  _onMomentumScrollBegin = () => this.setState({onEndReachedCalledDuringMomentum: false});
  //loadmore
  handleLoadMore = () => {
    const {load_more, page} = this.state;
    const {network} = this.props;

    if(!network.isConnected){
      Snackbar.show({
        text: msg.noInternet,
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: "red"
      });
    }else if (!this.state.onEndReachedCalledDuringMomentum) {
      if (load_more) {
        this.setState(
          {
            page: page + 10,
            onEndReachedCalledDuringMomentum: true,
          },
          () => {
            this.hit_bankDetailApi();
          },
        );
      }
    }
  };
  //footer
  renderFooter = () => {
    if (!this.state.load_more) return <View style={{ marginBottom: scale(100),}}></View>;
    return (
      <View style={{marginBottom: scale(100),}}>
        <ActivityIndicator size="large" color="#ddd" />
      </View>
    );
  };

 FlatListItemSeparator = () => {
  return (
    <View
      style={{
        height: scale(5),
        width: "100%",
        
      }}
    />
  );
}




GetItem (index) {
 
const {show_list}=this.state
  
  this.setState({
    addItem:true,
    edit_id:show_list[index].id,
    b_name:show_list[index].bank_name,
    ac_name:show_list[index].ac_name,
    ac_no:show_list[index].ac_number,
    ifsc_code:show_list[index].ifsc_code,
   
  })

}

 


  _addItemRender() {
    return (
      <Modal
        transparent={true}
        animationType={'slide'}
        visible={this.state.addItem}
        onRequestClose={() => {
          this.setState({ addItem: false,
            edit_id: '',
            b_name: '',
            ac_name: '',
            ac_no: '',
            ifsc_code: ''
          
           });
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
            backgroundColor: "#fff",
            margin: scale(15),
            width: "95%",
            borderRadius: scale(5),
            padding: scale(20)
          }}>

            <Text style={{
              fontSize: scale(18),
              fontWeight: 'bold',
              marginBottom: scale(10)
            }}>{this.state.edit_id == "" ? "Add New Bank" : "Update Bank"}</Text>

           

            <View style={{
              flexDirection: "row",
              justifyContent: "space-between", alignItems: "center",
              marginTop: scale(10)
            }}
            >

              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.txt_h}>Bank Name</Text>
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
                  underlineColorAndroid="transparent"
                  onChangeText={b_name => this.setState({ b_name })}
                  value={this.state.b_name}
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
                <Text style={styles.txt_h}>Account Name</Text>
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
                  underlineColorAndroid="transparent"
                  onChangeText={ac_name => this.setState({ ac_name })}
                  value={this.state.ac_name}
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
                <Text style={styles.txt_h}>Account Number</Text>
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
                  underlineColorAndroid="transparent"
                  onChangeText={ac_no => this.setState({ ac_no })}
                  value={this.state.ac_no}
                  keyboardType='number-pad'
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
                <Text style={styles.txt_h}>IFSC Code</Text>
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
                  underlineColorAndroid="transparent"
                  onChangeText={ifsc_code => this.setState({ ifsc_code })}
                  value={this.state.ifsc_code}
                 
                />

              </View>


            </View>

           

            <View style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: scale(20),

            }}>
              <TouchableOpacity

                style={{
                  width: scale(90),
                  height: scale(30),
                  padding: scale(10),
                  backgroundColor: Color.btn,
                  borderRadius: scale(5),
                  alignItems: "center",
                  justifyContent: "center"
                }}

                onPress={() => {
                  this._addItem_fun()
                }}
              >
                <Text style={{
                  color: '#fff',
                  fontSize: scale(15),

                }}>{this.state.edit_id == "" ? "Add Bank" : "Update"}</Text>
              </TouchableOpacity>

              <TouchableOpacity

                style={{
                  width: scale(90),
                  height: scale(30),
                  padding: scale(10),
                  backgroundColor: '#ddd',
                  borderRadius: scale(5),
                  alignItems: "center",
                  justifyContent: "center",
                  marginLeft: scale(20)

                }}
                onPress={() => {
                  this.setState({
                    addItem: false,
                    edit_id: '',
                    b_name: '',
                    ac_name: '',
                    ac_no: '',
                    ifsc_code: ''
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



  renderHeader() {
    return (
      <View
        style={{
          backgroundColor: Color.bgColor,
          borderRadius: scale(5),
          justifyContent: "center",
          alignItems: "center",
          padding: scale(10),
          width: scale(150),
          alignSelf: 'center'
        }}
      >
        <Text style={{
          fontSize: scale(18),
          color: '#000',

        }}
          numberOfLines={1}
        >Bank Details</Text>

      </View>
    )
  }


  renderTitle() {
    return (
      <View style={{
        flexDirection: 'row',

        borderWidth: scale(0.5),
        borderColor: '#ccc',
        backgroundColor: '#fff'
      }}>
        <Text style={{
          padding: scale(10),
          width: scale(100),
          fontWeight: 'bold',
          fontSize: scale(12),
          textAlign: 'center',
          textAlignVertical: 'center',
          borderColor: '#ddd',
          borderRightWidth: scale(1)
        }}
          numberOfLines={2}
        >Bank Name</Text>

        <Text style={{

          padding: scale(10),
          width: scale(100),
          fontWeight: 'bold',
          fontSize: scale(12),
          textAlign: 'center',
          textAlignVertical: 'center',
          borderColor: '#ddd',
          borderRightWidth: scale(1)
        }}
          numberOfLines={2}
        >Account Name</Text>
        <Text style={{

          padding: scale(10),
          width: scale(100),
          fontWeight: 'bold',
          fontSize: scale(12),
          textAlign: 'center',
          textAlignVertical: 'center',
          borderColor: '#ddd',
          borderRightWidth: scale(1)
        }}
          numberOfLines={2}
        >Account Number</Text>
        <Text style={{

          padding: scale(10),
          width: scale(100),
          fontWeight: 'bold',
          fontSize: scale(12),
          textAlign: 'center',
          textAlignVertical: 'center',
          borderColor: '#ddd',
          borderRightWidth: scale(1)
        }}
          numberOfLines={2}
        >IFSC Code</Text>
       
        <Text style={{

          padding: scale(10),
          width: scale(100),
          fontWeight: 'bold',
          fontSize: scale(12),

        }}
          numberOfLines={2}
        ></Text>


      </View>
    )
  }

  _renderListItem(rowData, index) {
    //console.log(rowData)
    return (

      <View style={{
        flexDirection: 'row',
        borderWidth: scale(0.5),
        borderColor: '#ccc'

      }}
        key={rowData.index}
      >
        <Text style={{
          padding: scale(10),
          width: scale(100),
          fontSize: scale(12),
          textAlign: 'center',
          textAlignVertical: 'center',
          borderColor: '#ddd',
          borderRightWidth: scale(1)
        }}
          numberOfLines={2}
        >{rowData.item.bank_name}</Text>
        <Text style={{
          padding: scale(10),
          width: scale(100),
          fontSize: scale(12),
          textAlign: 'center',
          textAlignVertical: 'center',
          borderColor: '#ddd',
          borderRightWidth: scale(1)
        }}
          numberOfLines={2}
        >{rowData.item.ac_name}</Text>
        <Text style={{
          padding: scale(10),
          width: scale(100),
          fontSize: scale(12),
          textAlign: 'center',
          textAlignVertical: 'center',
          borderColor: '#ddd',
          borderRightWidth: scale(1)
        }}
          numberOfLines={2}
        >{rowData.item.ac_number}</Text>
        <Text style={{
          padding: scale(10),
          width: scale(100),
          fontSize: scale(12),
          textAlign: 'center',
          textAlignVertical: 'center',
          borderColor: '#ddd',
          borderRightWidth: scale(1)
        }}
          numberOfLines={2}
        >{rowData.item.ifsc_code}</Text>
        
        <View
          style={{
            padding: scale(10),
            width: scale(100),
            alignItems: "center",
            justifyContent: "center"
          }}
        >

          <TouchableOpacity
            style={{
              backgroundColor: Color.btn,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: scale(5),
              height: scale(30),
              width: scale(40),


            }}
            onPress={() => { this.GetItem(rowData.index) }}   >
            <Text style={{ color: "#fff", fontSize: scale(10) }}>Edit</Text>
          </TouchableOpacity>

        </View>




      </View>






    )
  }

  render() {


    return (
      <View>
        <ImageBackground
          style={[styles.fixed, styles.containter]}
          source={Images.listbg}>
        <TouchableHighlight
          activeOpacity={1}
          underlayColor={'#ddd'}
          onPress={() =>
            this.props.navigation.toggleDrawer()}
          style={{
            width: scale(35), height: scale(35),
            alignItems: "center",
            justifyContent: 'center',
            backgroundColor: Color.headerTintColor
          }}
        >
          <Image source={Images.menu}
            style={{
              width: scale(20),
              height: scale(20),
            }} />
        </TouchableHighlight>

        {this.renderHeader()}


        <LogoSpinner loading={this.state.loading} />

        <View
          style={{
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
            backgroundColor: "#fff",
            marginHorizontal: scale(10),
            marginVertical: scale(20),
            height: '70%'
          }}

        >
          <View style={{
            borderWidth: 1,
            height: '100%',
            borderColor: '#ccc',
            borderRadius: scale(5),
            paddingBottom: scale(5)

          }}>
            <TouchableOpacity style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-end",
              padding: scale(10),

              width: '100%',

            }}

              onPress={() => {
                this.setState({ addItem: true, edit_id: "" })
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
              >  Add New Bank</Text>
            </TouchableOpacity>


            <ScrollView horizontal={true}>
              <FlatList

                ListHeaderComponent={this.renderTitle.bind(this)}
                stickyHeaderIndices={[0]}
                contentContainerStyle={{
                  paddingBottom: scale(5),
                  flexGrow: 1,
                }}
                keyExtractor={(item, index) => index.toString()}
                data={this.state.show_list}
                //  ItemSeparatorComponent={this.FlatListItemSeparator}
                renderItem={(item, index) => this._renderListItem(item, index)}
                bounces={false}
                extraData={this.state}
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.refresh}
                    onRefresh={this.onRefresh.bind(this)}
                  />


                }
                ListEmptyComponent={
                  <View style={{
                    borderWidth: scale(0.5),
                    borderColor: '#ccc'

                  }}>
                    {this.state.loading == false ? (
                      <Text style={{
                        padding: scale(10),
                        fontSize: scale(12),
                        textAlignVertical: 'center',
                        color: '#ccc'


                      }}>No Data Found..!!</Text>
                    ) : null}
                  </View>
                }
                //pagination

                ListFooterComponent={this.renderFooter.bind(this)}
                onEndReachedThreshold={0.01}
                onMomentumScrollBegin={() => this._onMomentumScrollBegin()}
                onEndReached={this.handleLoadMore.bind(this)}
                onScroll={this._onScroll}
              />

            </ScrollView>









          </View>





        </View>






        {this._addItemRender()}



        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containter: {
    width: Dimensions.get("window").width, //for full screen
    height: Dimensions.get("window").height //for full screen
  },
  fixed: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },

  
  userInput: {
    height: scale(42),
    backgroundColor: 'white',
    borderWidth: scale(1),
    width: scale(180),
    justifyContent: "center",
    borderRadius: scale(5),
    borderColor: "#ddd"

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
    borderRadius: scale(5),
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
 });




BankDetailsScreen.defaultProps = {
  user_id: '',
  user_type:'',
  network:''
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
)(BankDetailsScreen);