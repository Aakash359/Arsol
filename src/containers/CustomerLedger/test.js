import React, { PureComponent } from "react";

import {
  View,

  Text,Modal,ScrollView,TextInput,
  StyleSheet,FlatList,TouchableOpacity,Alert,RefreshControl,Image,ActivityIndicator
} from 'react-native';

import { connect } from "react-redux";
import {Config, Color,Images} from '@common';
const server = Config.SuitCRM;

import { scale } from "react-native-size-matters";
import { StackActions } from '@react-navigation/native';

const msg = Config.SuitCRM;
import {NavigationBar} from '@components';


import Checkbox from 'react-native-modest-checkbox'
import DatePicker from 'react-native-datepicker';
import ArsolApi from '@services/ArsolApi';
import { LogoSpinner } from '@components';
import Snackbar from 'react-native-snackbar';



class CustomerLedgerScreen extends PureComponent {


  constructor(props) {
    super(props);
    this.state={
    loading:false,
    refresh:false,
    load_more:false,
    onEndReachedCalledDuringMomentum: true,
    page:0,
    show_list:[],
    filter:false,
    display_name:'',
  
    date:'30-03-2020'
     }
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
    this.setState({loading:true},()=>{
      this.hit_estimateListApi()
   
    })}
  }



 _filterRender(){
  
  return(
    <Modal
    transparent={true}
    animationType={'slide'}
    visible={this.state.filter}
    onRequestClose={() => {
      this.setState({filter: false});
    }}>
   <View style={{flex:1}}>

 
      
   <ScrollView style={{backgroundColor: 'rgba(0,0,0,0.5)'}}
     contentContainerStyle={{flexGrow : 1,
      justifyContent : 'center',
      alignItems: "center",
      padding:scale(5)}}
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

 <View style={{padding:scale(5),alignItems:"center"}}>
 <Text style={{fontSize:scale(12),width:scale(180),}}
 numberOfLines={1}
 >Customer Name :</Text>
 <View style={styles.userInput}>
<TextInput
placeholder='Name'
style={styles.input}
autoCorrect={false}
autoCapitalize={'none'}
underlineColorAndroid="transparent"
onChangeText={display_name => this.setState({ display_name })}
value={this.state.display_name}
/>
</View> 
 <Text style={{fontSize:scale(12),width:scale(180),}}
 numberOfLines={1}
 >Date From :</Text>
<DatePicker
          style={{ width: scale(180), marginTop: scale(5) }}
         date={this.state.date}
          placeholder="Select Date"
          mode={'date'}
          format="DD-MM-YYYY"
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          showIcon={false}
          customStyles={{
      
            placeholderText: {
              color: '#565656'
            }
          }}
          minuteInterval={10}
          onDateChange={(date) => {this.setState({date: date})}}
        
        />
         <Text style={{fontSize:scale(12),width:scale(180),}}
 numberOfLines={1}
 >Date To :</Text>
        <DatePicker
         style={{ width: scale(180), marginTop: scale(5) }}
         date={this.state.date}
          placeholder="Select Date"
          mode={'date'}
          format="DD-MM-YYYY"
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          showIcon={false}
          customStyles={{
           
            placeholderText: {
              color: '#565656'
            }
          }}
          minuteInterval={10}
          onDateChange={(date) => {this.setState({date: date})}}
        
        />



 </View>


                 


<TouchableOpacity
onPress={()=>{this.setState({filter:false})}}
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
          this.hit_estimateListApi();
        },
      );
    }
   
  }

  hit_estimateListApi(){
    const {user_id,user_type} = this.props
    const {page} = this.state
    ArsolApi.ItemDetails_api(user_id,user_type,page)

    .then(responseJson => {
      console.log('ItemDetails_api', responseJson);

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
            this.hit_estimateListApi();
          },
        );
      }
    }
  };

 _renderListItem(rowData,index) {
  console.log(rowData,index)
  return(
   
    <View style={{flexDirection:'row',padding:scale(10),justifyContent:'space-between'}}
    key={index}
    >
    <View style={{width:"80%",}}>
    <View style={{flexDirection:'row'}}>
    <Text style={styles.txth}
     numberOfLines={1}
    >Estimate Number:</Text>
    <Text style={styles.txt}
     numberOfLines={1}
    >{rowData.item.item_type}</Text>
    </View>

    <View style={{flexDirection:'row'}}>
    <Text style={styles.txth}
     numberOfLines={1}
    >Estimate Type:</Text>
    <Text style={styles.txt}
     numberOfLines={1}
    >{rowData.item.item_name}</Text>
    </View>

    <View style={{flexDirection:'row'}}>
    <Text style={styles.txth}
     numberOfLines={1}
    >Estimate Display Name:</Text>
    <Text style={styles.txt}
     numberOfLines={1}
    >{rowData.item.item_unit}</Text>
    </View>

    <View style={{flexDirection:'row'}}>
    <Text style={styles.txth}
     numberOfLines={1}
    >Estimate Date:</Text>
    <Text style={styles.txt}
     numberOfLines={1}
    >{rowData.item.item_rate}</Text>
    </View>

    <View style={{flexDirection:'row'}}>
    <Text style={styles.txth}
     numberOfLines={1}
    >Total Amount:</Text>
    <Text style={styles.txt}
     numberOfLines={1}
    >{rowData.item.hsn_sac_code}</Text>
    </View>

    <View style={{flexDirection:'row'}}>
    <Text style={styles.txth}
     numberOfLines={1}
    >Converted To Invoice:</Text>
    <Text style={styles.txt}
     numberOfLines={1}
    >{rowData.item.item_gst}</Text>
    </View>
    
 
  
    </View>
    <TouchableOpacity
     style={{backgroundColor:"#335E61",
            width:scale(50),
            height:scale(30),
            justifyContent:"center",alignItems:"center",
            borderRadius:scale(5),
            margin:scale(5)
            }}
            onPress={()=>{this.GetItem(rowData.item.item_type)}}
    >
    
        <Text style={{fontSize:scale(12),color:'#fff'}}>Edit</Text>

    </TouchableOpacity>
    
    </View>
  
    
      

      

  )
}

 FlatListItemSeparator = () => {
  return (
    <View
      style={{
        height: 1,
        width: "100%",
        backgroundColor: "#607D8B",
      }}
    />
  );
}

  //footer
  renderFooter = () => {
    if (!this.state.load_more) return <View style={{ marginBottom: scale(100),}}></View>;
    return (
      <View style={{marginBottom: scale(100),}}>
        <ActivityIndicator size="large" color="#ddd" />
      </View>
    );
  };


  render() { 
return (
     <View style={{flex:1,
     }}>
     <NavigationBar
                 leftButtonTitle={'Customer Ledger'}
              height={scale(44)}
              leftButtonTitleColor={Color.black}
              leftButtonIcon={Images.menu}
              backgroundColor={Color.headerTintColor}
              onLeftButtonPress={() => {
                this.props.navigation.toggleDrawer();
              }}

              SearchButtonIcon={Images.file}
               onSearchButtonPressHandle={() => {
                 this.setState({filter:true})
              }}

              AddButtonIcon={Images.filter}
              onAddButtonPressHandle={() => {
                 this.setState({filter:true})
              }}

              PrintButtonIcon={Images.print}
              onPrintButtonPressHandle={() => {
                 this.setState({filter:true})
              }}


           

 />
 <LogoSpinner loading={this.state.loading} />

{this._filterRender()}

<FlatList
     contentContainerStyle={{paddingBottom: scale(5), flexGrow: 1}}
  
     keyExtractor = { (item, index) => index.toString() }
     data={this.state.show_list}
     ItemSeparatorComponent={this.FlatListItemSeparator}
     renderItem={(item, index) => this._renderListItem(item,index)}
     bounces={false}
     extraData={this.state}
     refreshControl={
            <RefreshControl
              refreshing={this.state.refresh}
              onRefresh={this.onRefresh.bind(this)}
            />
          }
    ListEmptyComponent={
            <View style={{flex: 1,
        alignItems: 'center',
        justifyContent: 'center',}}>
              {this.state.loading == false ? (
                <View style={{  flex: 1,
        alignItems: 'center',
        justifyContent: 'center',}}>
                  <View style={{  backgroundColor: "#ddd",
        width: scale(80), height: scale(80),
        alignItems: "center",
        justifyContent: 'center',
        borderRadius: scale(80) / 2,
        borderWidth: 2,
        borderColor: '#AED581'}}>

                    <Image source={Images.logo} style={{   resizeMode: 'contain',
        width: scale(50),
        height: scale(50),}} />
                  </View>

                  <Text style={{    fontSize: scale(15),
        width: scale(150),
        textAlign: 'center',
        marginTop: scale(5)}}>No Record Found</Text>
                </View>
              ) : null}
            </View>
          }
     //pagination
   
       ListFooterComponent={this.renderFooter.bind(this)}
          onEndReachedThreshold={0.01}
          onMomentumScrollBegin={() => this._onMomentumScrollBegin()}
          onEndReached={this.handleLoadMore.bind(this)}          
    />

     </View>
    );
  }
}




const styles = StyleSheet.create({

  txt:{fontSize:scale(15),width:scale(150),},
  txth:{fontSize:scale(15),fontWeight:'bold'},

  userInput: {
    height: scale(40),
    backgroundColor: 'white',
 
    borderColor: 'grey',
    borderWidth: scale(1),
    width:scale(180),

    },

    input: {
      color: '#000',

      width: '73%',
      fontSize: scale(12)
      },



     
 });








CustomerLedgerScreen.defaultProps = {
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
)(CustomerLedgerScreen);