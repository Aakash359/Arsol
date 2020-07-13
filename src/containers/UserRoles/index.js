import React, { PureComponent } from "react";

import {
  View, TouchableHighlight, TextInput, Switch,

  Text,Dimensions,ImageBackground,
  StyleSheet,FlatList,TouchableOpacity,Alert,RefreshControl,Image,Modal
} from 'react-native';

import { connect } from "react-redux";
import {Images,Config, Color} from '@common';


import { scale } from "react-native-size-matters";
import { StackActions } from '@react-navigation/native';

import Checkbox from 'react-native-modest-checkbox'
import { ScrollView } from "react-native-gesture-handler";
const msg = Config.SuitCRM;
import ArsolApi from '@services/ArsolApi';
import { LogoSpinner } from '@components';
import Snackbar from 'react-native-snackbar';



class UserRolesScreen extends PureComponent {


  constructor(props) {
    super(props);
    this.state={
    loading:false,
    switch_status:false,
    refresh:false,
    show_list:[],
    
     edit_id:"" ,
     roles_data:[],
     search_text:'',
     btn_confirm:'Confirm '

    }
    this.array_roles = []



 }

 componentDidMount() {
  const { network} = this.props;
  if(!network.isConnected){
    Snackbar.show({
      text: msg.noInternet,
      duration: Snackbar.LENGTH_SHORT,
      backgroundColor: "red"
    });
  }else{
    this.setState({loading:true,
      switch_status: false,
      refresh: false,
      show_list: [],

      edit_id: "",
      roles_data: [],
      search_text: '',
      btn_confirm: 'Confirm '
    },()=>{
        this.array_roles = []
      this.hit_userRoleApi()
    })
  
  }
  }


  componentDidUpdate(prevProps) {
    if (this.props.network.isConnected != prevProps.network.isConnected) {
      if (this.props.network.isConnected) {
        if (this.props.navigation.isFocused()) {
          this.setState({
            loading: true,
            switch_status: false,
            refresh: false,
            show_list: [],

            edit_id: "",
            roles_data: [],
            search_text: '',
            btn_confirm: 'Confirm '
          }, () => {
            this.array_roles = []
            this.hit_userRoleApi()
          })
        }
      }
    }
  }

  hit_userRoleApi(){
    const {user_id,user_type} = this.props

    ArsolApi.UserRole_api(user_id,user_type)

    .then(responseJson => {
      console.log('UserRole_api', responseJson);

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
          roles_data:[],
          edit_id:"",
        },
        () => {
          this.hit_userRoleApi();
          this.array_roles=[]
        },
      );
    }
   
  }


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

GetItem (i) {
const {show_list,} = this.state;

  this.setState({
      switch_status:true,
      edit_id:show_list[i].user_id,
      roles_data: show_list[i].user_roles
    })
  this.array_roles=show_list[i].user_roles
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
              backgroundColor: this.props.user_id == rowData.item.user_id ? "#7B9799" : Color.btn,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: scale(5),
              minHeight: scale(30),
              maxHeight: scale(45),
              width: scale(80),


            }}
            onPress={() => { this.GetItem(rowData.index) }}
            disabled={this.props.user_id==rowData.item.user_id?true:false}

          >
            <Text style={{ color: "#fff", fontSize: scale(10) }}>Update</Text>
          </TouchableOpacity>

        </View>

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
        >{rowData.item.user_email}</Text>
        <Text style={{
          padding: scale(10),
          width: scale(100),
          fontSize: scale(12),
          textAlign: 'center',
          textAlignVertical: 'center',
          borderColor: '#ddd',
          borderRightWidth: scale(1),
          color:  this.props.user_id == rowData.item.user_id ? "grey" : "black",
        }}
          numberOfLines={2}
        >{rowData.item.user_roles[0].value?"Yes":"No"}</Text>
        <Text style={{
          padding: scale(10),
          width: scale(100),
          fontSize: scale(12),
          textAlign: 'center',
          textAlignVertical: 'center',
          borderColor: '#ddd',
          borderRightWidth: scale(1),
          color: this.props.user_id == rowData.item.user_id ? "grey" : "black",
        }}
          numberOfLines={2}
        >{rowData.item.user_roles[1 ].value ? "Yes" : "No"}</Text>
        <Text style={{
          padding: scale(10),
          width: scale(100),
          fontSize: scale(12),
          textAlign: 'center',
          textAlignVertical: 'center',
          borderColor: '#ddd',
          borderRightWidth: scale(1),
          color: this.props.user_id == rowData.item.user_id ? "grey" : "black",
        }}
          numberOfLines={2}
        >{rowData.item.user_roles[2].value ? "Yes" : "No"}</Text>

        <Text style={{
          padding: scale(10),
          width: scale(100),
          fontSize: scale(12),
          textAlign: 'center',
          textAlignVertical: 'center',
          borderColor: '#ddd',
          borderRightWidth: scale(1),
          color: this.props.user_id == rowData.item.user_id ? "grey" : "black",
        }}
          numberOfLines={2}
        >{rowData.item.user_roles[3].value ? "Yes" : "No"}</Text>

        <Text style={{
          padding: scale(10),
          width: scale(100),
          fontSize: scale(12),
          textAlign: 'center',
          textAlignVertical: 'center',
          borderColor: '#ddd',
          borderRightWidth: scale(1),
          color: this.props.user_id == rowData.item.user_id ? "grey" : "black",
        }}
          numberOfLines={2}
        >{rowData.item.user_roles[4].value ? "Yes" : "No"}</Text>
        <Text style={{
          padding: scale(10),
          width: scale(100),
          fontSize: scale(12),
          textAlign: 'center',
          textAlignVertical: 'center',
          borderColor: '#ddd',
          borderRightWidth: scale(1),
          color: this.props.user_id == rowData.item.user_id ? "grey" : "black",
        }}
          numberOfLines={2}
        >{rowData.item.user_roles[5].value ? "Yes" : "No"}</Text>

        <Text style={{
          padding: scale(10),
          width: scale(100),
          fontSize: scale(12),
          textAlign: 'center',
          textAlignVertical: 'center',
          borderColor: '#ddd',
          borderRightWidth: scale(1),
          color: this.props.user_id == rowData.item.user_id ? "grey" : "black",
        }}
          numberOfLines={2}
        >{rowData.item.user_roles[6].value ? "Yes" : "No"}</Text>
        <Text style={{
          padding: scale(10),
          width: scale(100),
          fontSize: scale(12),
          textAlign: 'center',
          textAlignVertical: 'center',
          borderColor: '#ddd',
          borderRightWidth: scale(1),
          color: this.props.user_id == rowData.item.user_id ? "grey" : "black",
        }}
          numberOfLines={2}
        >{rowData.item.user_roles[7].value ? "Yes" : "No"}</Text>
        <Text style={{
          padding: scale(10),
          width: scale(100),
          fontSize: scale(12),
          textAlign: 'center',
          textAlignVertical: 'center',
          borderColor: '#ddd',
          borderRightWidth: scale(1),
          color: this.props.user_id == rowData.item.user_id ? "grey" : "black",
        }}
          numberOfLines={2}
        >{rowData.item.user_roles[8].value ? "Yes" : "No"}</Text>
        <Text style={{
          padding: scale(10),
          width: scale(100),
          fontSize: scale(12),
          textAlign: 'center',
          textAlignVertical: 'center',
          borderColor: '#ddd',
          borderRightWidth: scale(1),
          color: this.props.user_id == rowData.item.user_id ? "grey" : "black",
        }}
          numberOfLines={2}
        >{rowData.item.user_roles[9].value ? "Yes" : "No"}</Text>

        <Text style={{
          padding: scale(10),
          width: scale(100),
          fontSize: scale(12),
          textAlign: 'center',
          textAlignVertical: 'center',
          borderColor: '#ddd',
          borderRightWidth: scale(1),
          color: this.props.user_id == rowData.item.user_id ? "grey" : "black",
        }}
          numberOfLines={2}
        >{rowData.item.user_roles[10].value ? "Yes" : "No"}</Text>

        <Text style={{
          padding: scale(10),
          width: scale(100),
          fontSize: scale(12),
          textAlign: 'center',
          textAlignVertical: 'center',
          borderColor: '#ddd',
          borderRightWidth: scale(1),
          color: this.props.user_id == rowData.item.user_id ? "grey" : "black",
        }}
          numberOfLines={2}
        >{rowData.item.user_roles[11].value ? "Yes" : "No"}</Text>

        <Text style={{
          padding: scale(10),
          width: scale(100),
          fontSize: scale(12),
          textAlign: 'center',
          textAlignVertical: 'center',
          borderColor: '#ddd',
          borderRightWidth: scale(1),
          color: this.props.user_id == rowData.item.user_id ? "grey" : "black",
        }}
          numberOfLines={2}
        >{rowData.item.user_roles[12].value ? "Yes" : "No"}</Text>

        <Text style={{
          padding: scale(10),
          width: scale(100),
          fontSize: scale(12),
          textAlign: 'center',
          textAlignVertical: 'center',
          borderColor: '#ddd',
          borderRightWidth: scale(1),
          color: this.props.user_id == rowData.item.user_id ? "grey" : "black",
        }}
          numberOfLines={2}
        >{rowData.item.user_roles[13].value ? "Yes" : "No"}</Text>

        <Text style={{
          padding: scale(10),
          width: scale(100),
          fontSize: scale(12),
          textAlign: 'center',
          textAlignVertical: 'center',
          borderColor: '#ddd',
          borderRightWidth: scale(1),
          color: this.props.user_id == rowData.item.user_id ? "grey" : "black",
        }}
          numberOfLines={2}
        >{rowData.item.user_roles[14].value ? "Yes" : "No"}</Text>

        <Text style={{
          padding: scale(10),
          width: scale(100),
          fontSize: scale(12),
          textAlign: 'center',
          textAlignVertical: 'center',
          borderColor: '#ddd',
          borderRightWidth: scale(1),
          color: this.props.user_id == rowData.item.user_id ? "grey" : "black",
        }}
          numberOfLines={2}
        >{rowData.item.user_roles[15].value ? "Yes" : "No"}</Text>

        <Text style={{
          padding: scale(10),
          width: scale(100),
          fontSize: scale(12),
          textAlign: 'center',
          textAlignVertical: 'center',
          borderColor: '#ddd',
          borderRightWidth: scale(1),
          color: this.props.user_id == rowData.item.user_id ? "grey" : "black",
        }}
          numberOfLines={2}
        >{rowData.item.user_roles[16].value ? "Yes" : "No"}</Text>

        <Text style={{
          padding: scale(10),
          width: scale(100),
          fontSize: scale(12),
          textAlign: 'center',
          textAlignVertical: 'center',
          borderColor: '#ddd',
          borderRightWidth: scale(1),
          color: this.props.user_id == rowData.item.user_id ? "grey" : "black",
        }}
          numberOfLines={2}
        >{rowData.item.user_roles[17].value ? "Yes" : "No"}</Text>

        <Text style={{
          padding: scale(10),
          width: scale(100),
          fontSize: scale(12),
          textAlign: 'center',
          textAlignVertical: 'center',
          borderColor: '#ddd',
          borderRightWidth: scale(1),
          color: this.props.user_id == rowData.item.user_id ? "grey" : "black",
        }}
          numberOfLines={2}
        >{rowData.item.user_roles[18].value ? "Yes" : "No"}</Text>

        <Text style={{
          padding: scale(10),
          width: scale(100),
          fontSize: scale(12),
          textAlign: 'center',
          textAlignVertical: 'center',
          borderColor: '#ddd',
          borderRightWidth: scale(1),
          color: this.props.user_id == rowData.item.user_id ? "grey" : "black",
        }}
          numberOfLines={2}
        >{rowData.item.user_roles[19].value ? "Yes" : "No"}</Text>

        
      </View>






    )
  }






  hit_update_user_roleApi(){
    const {
      edit_id,
      roles_data 
     } = this.state
  
  
      const {user_id,user_type,network} = this.props
      if(!network.isConnected){
        Snackbar.show({
          text: msg.noInternet,
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: "red"
        });
      }else{
        this.setState({loading:true,switch_status:false},()=>{

          ArsolApi.UpdateRole_api(
            user_id,
            user_type,
            edit_id,
            roles_data
            )

          .then(responseJson => {
            console.log('UpdateRole_api', responseJson);
      
            if (responseJson.ok) {
              this.setState({
                loading: false,
         
              });
      
              if (responseJson.data != null) {
                if (responseJson.data.hasOwnProperty('status')) {
                
                    if (responseJson.data.status == 'success') {
                    if (responseJson.data.hasOwnProperty('message')) {
                      alert(responseJson.data.message)
                      this.onRefresh()
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


  searchData=(text) =>{
   // const {roles_data}=this.state
    
    const newData = this.array_roles.filter(item => {
      const itemData = item.label.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1
    });
  

    this.setState({
      roles_data: newData,
      search_text: text
    })
  

  
  }

  


  changeSwitch = (val,index) => {
   let items = this.state.roles_data
       items[index].value=val
   this.setState({
      roles_data: items,
      btn_confirm: this.state.btn_confirm == "Confirm" ? "Confirm " : "Confirm"
    })
 }

  _renderRoles(rowData){
    return (<View style={{
      flexDirection: "row",
      justifyContent: "space-between",
    

      padding: scale(10),
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 9,
      },
      shadowOpacity: 0.48,
      shadowRadius: 11.95,

      elevation: 10,
      borderRadius: scale(15),
      backgroundColor: "#fff",
      marginHorizontal: scale(10),
      marginVertical: scale(5),
      


    }}
      key={rowData.index}
    >
      <Text style={{
        fontSize: scale(14),
        textAlignVertical: "center"
      }}
      >{rowData.item.label}</Text>

      <Switch
        onValueChange={(value) => this.changeSwitch(value, rowData.index)}
        value={rowData.item.value}

      />

    </View>)
   
  }


  //switch
  _renderPermission(){
 const {roles_data ,btn_confirm} = this.state
 
      return (
      <Modal
      transparent={true}
      animationType={'slide'}
      visible={this.state.switch_status}
      onRequestClose={() => {
        this.setState({switch_status: false,
        edit_id:"",
        roles_data:[]
        });
        this.array_roles=[]
      }}>
        <View style={{ flex: 1,
         backgroundColor: 'rgba(0,0,0,0.5)',
         justifyContent:"center",
         alignItems:"center"
         }}>

          

 <View style={{width:'90%',
                      height:"90%",
                      backgroundColor:'#fff',
                      borderRadius:scale(5)
                      }}>
<View style={{backgroundColor:"#ddd",padding:scale(5),
}}>
              <TextInput
                style={{
                  textAlign: 'center',
                  height: scale(40),
                  borderColor: '#ddd',

                  backgroundColor: "#FFFF",
                  margin: scale(5),
                  borderRadius: scale(20),
                  borderWidth: scale(1),
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 9,
                  },
                  shadowOpacity: 0.48,
                  shadowRadius: 11.95,
                  elevation: 20,
                }}
                onChangeText={(text) => this.searchData(text)}
                value={this.state.search_text}
                underlineColorAndroid='transparent'
                placeholder="Search Roles" />
</View>
            

          

             <FlatList
              style={{ flex: 1 }}
              contentContainerStyle={{  flexGrow: 1,paddingBottom:scale(100) }}
              bounces={false}
              data={roles_data}
              keyExtractor={(item, index) => index.toString()}
              ItemSeparatorComponent={this.FlatListItemSeparator}
              renderItem={(item, index) => this._renderRoles(item)}
              extraData={this.state}
              style={{ margin:scale(10),paddingBottom:scale(10) }} /> 



<View style={{flexDirection:'row',justifyContent:"space-between",
           position: 'absolute',
                bottom: 0,
                width:"100%"
}}>


                <TouchableOpacity

                  style={{
                    width: '50%',
                    backgroundColor: "#ddd",
                    justifyContent: 'center',
                    alignItems: "center",
                    padding: scale(10),
         

                  }}
                  onPress={() => {
                    this.setState({
                      edit_id:'',
                      roles_data:[],
                      switch_status:false
                    })
                    this.array_roles=[]
                  }}
                >
                  <Text style={{
                    fontSize: scale(15),
                    fontWeight: 'bold',

                  }}>Cancel</Text>
                </TouchableOpacity>   

                <TouchableOpacity
             
                  style={{
                    width: '50%',
                    backgroundColor: "#ddd",
                    justifyContent: 'center',
                    alignItems: "center",
                    padding: scale(10),
              

                  }}
                  onPress={() => this.hit_update_user_roleApi()}
                >
                  <Text style={{
                    fontSize: scale(15),
                    fontWeight: 'bold',

                  }}>{btn_confirm.trim()}</Text>
                </TouchableOpacity>   
</View>

        </View>
        </View>
    
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
          width: scale(170),
          alignSelf: 'center'
        }}
      >
        <Text style={{
          fontSize: scale(18),
          color: '#000',

        }}
          numberOfLines={1}
        >User Roles</Text>

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
        ></Text>
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
        > User Email</Text>

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
        >Invoice</Text>
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
        >Item Detail</Text>
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
        >Customer Detail</Text>
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
        >Edit Invoice</Text>
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
        >Reports</Text>
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
        >Change Password</Text>
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
        >User Details</Text>
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
        >User Roles</Text>
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
        >Balance Sheet</Text>
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
        >Estimate</Text>
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
        >Estimate List</Text>

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
        >Credit Note</Text>

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
        >Credit Note List</Text>
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
        >Customer Payment</Text>
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
        >Customer Payment List</Text>
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
        >AR Report</Text>
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
        >GST Report</Text>
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
        >Customer Ledger</Text>
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
        >Edit Company</Text>

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
        >Bank Details</Text>
         </View>
    )
  }


  render() {

    const { show_list, roles_data, loading} = this.state;

 
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
     <LogoSpinner loading={loading} />

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
    
          />

        </ScrollView>









      </View>





    </View>



              { roles_data.length>0?this._renderPermission():null}

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
  
 });



UserRolesScreen.defaultProps = {
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
)(UserRolesScreen);