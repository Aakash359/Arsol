import React, { PureComponent } from "react";

import {
  View,Keyboard,TouchableHighlight,ImageBackground,Dimensions,

  Text,Modal,ScrollView,TextInput,
  StyleSheet,FlatList,TouchableOpacity,Alert,RefreshControl,Image,ActivityIndicator
} from 'react-native';

import { connect } from "react-redux";
import {Images,Config, Color} from '@common';


import { scale } from "react-native-size-matters";
import { StackActions } from '@react-navigation/native';
const msg = Config.SuitCRM;
import ArsolApi from '@services/ArsolApi';
import { LogoSpinner } from '@components';
import Snackbar from 'react-native-snackbar';
import RNPickerSelect from 'react-native-picker-select';
import {NavigationBar} from '@components';
import {validate_email,validate_pass} from '../../Omni';

class UserDetailsScreen extends PureComponent {


  constructor(props) {
    super(props);
    this.state={
      loading:false,
      refresh:false,
      addItem:false,
      show_list:[],
      fname:'',
      lname:'',
      u_type:'Admin',
      email_id:'',
      password:'',
      ed_id: "",
      is_create:true
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
    this.setState({
       loading:true,
       ed_id:"",
      refresh: false,
      addItem: false,
      show_list: [],
      fname: '',
      lname: '',
      u_type: 'Admin',
      email_id: '',
      password: '',
      is_create:true
      },()=>{
      this.hit_userDetailApi()
    })
  }
   })
  }


  componentDidUpdate(prevProps) {
    if (this.props.network.isConnected != prevProps.network.isConnected) {
      if (this.props.network.isConnected) {
        if (this.props.navigation.isFocused()) {
          this.setState({
            loading: true,
            ed_id: "",
            refresh: false,
            addItem: false,
            show_list: [],
            fname: '',
            lname: '',
            u_type: 'Admin',
            email_id: '',
            password: '',
            is_create: true
          }, () => {
            this.hit_userDetailApi()
          })
        }
      }
    }
  }


  //add
_addUser_fun(){
  const{fname,
  lname,
  u_type,
  email_id,
  password,
  ed_id,

  } = this.state

const {user_id,user_type,network} = this.props
Keyboard.dismiss()
    if(fname==""){
      alert("Enter First Name")
    }else if(lname==""){
      alert("Enter Last  Name")
    }else if(u_type==""){
      alert("Select User Type")
    }else if(email_id==""){
      alert("Enter Email id")
     
    }else if (validate_email(email_id) === false) {
      alert("Invalid Email id")
    }else if(password==""){
      alert("Enter Password")
    }
    else if (validate_pass(password) === false) {
      alert("password must contain at least eight characters, at least one number and both lower and uppercase letters and special characters")
    }
    else if(!network.isConnected){
      Snackbar.show({
        text: msg.noInternet,
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: "red"
      });
    }else{
      this.setState({loading:true,addItem:false, ed_id:"",},()=>{
        this.hit_addUserApi(user_id,user_type,
          fname,
  lname,
  u_type,
  email_id,
  password,
  ed_id,)
        
      })}
    
}
       


  hit_userDetailApi(){
    const {user_id,user_type} = this.props

    ArsolApi.UserDetails_api(user_id,user_type)

    .then(responseJson => {
      console.log('UserDetails_api', responseJson);

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
                           is_create: responseJson.data.is_create
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


        hit_addUserApi(user_id,user_type,
      fname,
      lname,
      u_type,
      email_id,
      password,
      ed_id,)

{

ArsolApi.AddUser_post_api(user_id,user_type,
fname,
lname,
u_type,
email_id,
password,
ed_id)


 .then(responseJson => {
        console.log('AddUser_Post_api', responseJson);

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

                      alert(responseJson.data.message)

                      this.setState({
                        fname: "",
                        lname: "",
                        u_type: "",
                        email_id: "",
                        password: "",
                      }, () => {
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


hit_userDetailApi(){
    const {user_id,user_type} = this.props

    ArsolApi.UserDetails_api(user_id,user_type)

    .then(responseJson => {
      console.log('UserDetails_api', responseJson);

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
         
          show_list: [],
        },
        () => {
          this.hit_userDetailApi();
        },
      );
    }
   
  }

_onMomentumScrollBegin = () => this.setState({ onEndReachedCalledDuringMomentum: false });
  //loadmore
  handleLoadMore = () => {
    const { load_more, page } = this.state;
    const { network } = this.props;

    if (!network.isConnected) {
      Snackbar.show({
        text: msg.noInternet,
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: "red"
      });
    } else if (!this.state.onEndReachedCalledDuringMomentum) {
      if (load_more) {
        this.setState(
          {
            page: page + 10,
            onEndReachedCalledDuringMomentum: true,
          },
          () => {
            this.hit_userDetailApi();
          },
        );
      }
    }
  };



GetItem (i) {
  const { show_list } = this.state

   this.setState({
     addItem:true,
     fname: show_list[i].fname,
     lname: show_list[i].lname,
     u_type: 'Admin',
     email_id: show_list[i].email_id,
     password: show_list[i].password,
     ed_id: show_list[i].user_id,
    })
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
          width: scale(120),
          fontSize: scale(12),
          textAlign: 'center',
          textAlignVertical: 'center',
          borderColor: '#ddd',
          borderRightWidth: scale(1)
        }}
          numberOfLines={2}
        >{rowData.item.fname}</Text>
        <Text style={{
          padding: scale(10),
          width: scale(120),
          fontSize: scale(12),
          textAlign: 'center',
          textAlignVertical: 'center',
          borderColor: '#ddd',
          borderRightWidth: scale(1)
        }}
          numberOfLines={2}
        >{rowData.item.lname}</Text>
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
        >{rowData.item.usertype}</Text>
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
        >{rowData.item.email_id}</Text>

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
        >{rowData.item.created_date}</Text>

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
        >{rowData.item.created_by}</Text>


        <View
          style={{
            padding: scale(10),
            width: scale(100),
            alignItems: "center",
            justifyContent: "center",
            borderColor: '#ddd',
            borderRightWidth: scale(1)
          }}
        >

          <TouchableOpacity
            style={{
              backgroundColor: Color.btn,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: scale(5),
              minHeight: scale(30),
              maxHeight: scale(45),
              width: scale(40),


            }}
            onPress={() => { this.GetItem(rowData.index) }}

          >
            <Text style={{ color: "#fff", fontSize: scale(10) }}>Edit</Text>
          </TouchableOpacity>

        </View>

      




      </View>






    )
  }


//additem

_addUserRender(){
  return(
    <Modal
    transparent={true}
    animationType={'slide'}
    visible={this.state.addItem}
    onRequestClose={() => {
      this.setState({addItem: false});
    }}>
   <View style={{flex:1}}>

 
      
   <ScrollView style={{backgroundColor: 'rgba(0,0,0,0.5)'}}
     contentContainerStyle={{flexGrow : 1,
      justifyContent : 'center',
      alignItems: "center",
      padding:scale(5)}}
      keyboardShouldPersistTaps="handled"
     >


    <View>


      <View style={{
                backgroundColor: 'white',
      width: '90%',
      padding: scale(10),
      borderRadius: scale(5),
      alignItems:'center'
      }}>



<Text style={styles.txt_h}>First Name</Text>
 <View style={styles.userInput}>

 <TextInput
 style={styles.input}

 autoCorrect={false}
 autoCapitalize={'none'}

 placeholderTextColor="grey"
 underlineColorAndroid="transparent"
 onChangeText={fname => this.setState({ fname })}
 value={this.state.fname}
 />
 </View>

 <Text style={styles.txt_h}>Last Name</Text>
 <View style={styles.userInput}>

 <TextInput
 style={styles.input}

 autoCorrect={false}
 autoCapitalize={'none'}

 placeholderTextColor="grey"
 underlineColorAndroid="transparent"
 onChangeText={lname => this.setState({ lname })}
 value={this.state.lname}
 />
 </View>

 <Text style={styles.txt_h}>User type</Text>
 <View style={styles.userInput}>

<RNPickerSelect
     placeholder={{}}
items={[
{ label: 'Admin', value: 'Admin' },
{ label: 'User', value: 'User' },

]}
onValueChange={(u_type) =>{this.setState({item_type:u_type})
      
          }}
value={this.state.u_type}
/>

</View>

 <Text style={styles.txt_h}>Email Id</Text>
 <View style={styles.userInput}>

 <TextInput
 style={styles.input}
 keyboardType='email-address'
 autoCorrect={false}
 autoCapitalize={'none'}

 placeholderTextColor="grey"
 underlineColorAndroid="transparent"
 onChangeText={email_id => this.setState({ email_id })}
 value={this.state.email_id}
 />
 </View>

 <Text style={styles.txt_h}>Password</Text>
 <View style={styles.userInput}>

 <TextInput
 style={styles.input}

 autoCorrect={false}
 autoCapitalize={'none'}
secureTextEntry
 placeholderTextColor="grey"
 underlineColorAndroid="transparent"
 onChangeText={password => this.setState({ password })}
 value={this.state.password}
 />
 </View>


<View style={{flexDirection:"row",
          justifyContent:'space-between'
        }}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={{
            width: scale(100),
      height: scale(40),
      padding: scale(10),
      backgroundColor: '#3D8EE1',
      borderRadius: scale(8),
      margin:scale(5)
    
          }}
          onPress={() => {
            this.setState({addItem: false,  item_type:"Goods",
    name:"",
    unit:'',
    rate:"",
    hsn_sac_code:"",
    gst:"",
    des:"",});
          }}>
          <Text style={{        color: '#fff', 
           fontSize: scale(15),
          textAlign: 'center'}}> Cancel </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          style={{
            width: scale(100),
      height: scale(40),
      padding: scale(10),
      backgroundColor: '#3D8EE1',
      borderRadius: scale(8),
      margin:scale(5)
          }}
          onPress={() => {
          this._addUser_fun()
          }}>
          <Text style={{        color: '#fff', 
           fontSize: scale(15),
          textAlign: 'center'}}> Save </Text>
        </TouchableOpacity>

        </View>

    
</View>

        

      </View>
      </ScrollView>
      </View>
  
  </Modal>
  )
}

renderFOB() {
   
    return (
      <TouchableOpacity activeOpacity={0.5}
        style={{
          position: 'absolute',
          width: scale(50),
          height: scale(50),
          alignItems: 'center',
          justifyContent: 'center',
          right: 30,
          bottom: 30,
          backgroundColor: "#fff",
          borderRadius: scale(25),
          elevation: 20,
          shadowColor: "#000000",
          shadowOpacity: 0.8,
          shadowRadius: 2,
          shadowOffset: {
            height: 1,
            width: 0
          }

        }}
        onPress={() => {
          this.setState({ addItem: true, ed_id: "" })
        }}
      >

        <Image source={Images.add}

          style={{
            resizeMode: 'contain',
            width: 25,
            height: 25,
          }} />

      </TouchableOpacity>
    );
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
          width: scale(170),
          alignSelf: 'center'
        }}
      >
        <Text style={{
          fontSize: scale(18),
          color: '#000',

        }}
          numberOfLines={1}
        >User Details</Text>

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
          width: scale(120),
          fontWeight: 'bold',
          fontSize: scale(12),
          textAlign: 'center',
          textAlignVertical: 'center',
          borderColor: '#ddd',
          borderRightWidth: scale(1)
        }}
          numberOfLines={2}
        >First Name</Text>

        <Text style={{

          padding: scale(10),
          width: scale(120),
          fontWeight: 'bold',
          fontSize: scale(12),
          textAlign: 'center',
          textAlignVertical: 'center',
          borderColor: '#ddd',
          borderRightWidth: scale(1)
        }}
          numberOfLines={2}
        >Last Name</Text>
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
        >User Type</Text>
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
        >Email Id</Text>
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
        >Create Date</Text>
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
        >Create By</Text>

        <Text style={{

          padding: scale(10),
          width: scale(100),
          fontWeight: 'bold',
          fontSize: scale(12),
          borderColor: '#ddd',
          borderRightWidth: scale(1)

        }}
          numberOfLines={2}
        ></Text>
      


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
        disabled={this.state.is_create?true:false}

          onPress={() => {
          
            this.setState({ addItem: true, ed_id: "" })
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
          >  Add New User</Text>
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

            // ListFooterComponent={this.renderFooter.bind(this)}
            // onEndReachedThreshold={0.01}
            // onMomentumScrollBegin={() => this._onMomentumScrollBegin()}
            // onEndReached={this.handleLoadMore.bind(this)}
            // onScroll={this._onScroll}
          />

        </ScrollView>









      </View>





    </View>

     


{this._addUserRender()}



      
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

  txt: { fontSize: scale(12) },

  userInput: {
    height: scale(40),
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
  
 });


UserDetailsScreen.defaultProps = {
  user_id: '',
  user_type:''
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
)(UserDetailsScreen);