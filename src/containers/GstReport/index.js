import React, { PureComponent ,Fragment} from "react";
import {
  View, TouchableHighlight, TouchableWithoutFeedback,

  Text,Modal,ScrollView,TextInput,PermissionsAndroid,
  StyleSheet,FlatList,TouchableOpacity,Alert,RefreshControl,Image,ActivityIndicator
} from 'react-native';

import { connect } from "react-redux";
import {Config, Color,Images} from '@common';


import { scale } from "react-native-size-matters";
import { StackActions } from '@react-navigation/native';

const msg = Config.SuitCRM;
import {NavigationBar} from '@components';


import Checkbox from 'react-native-modest-checkbox'
import DatePicker from 'react-native-datepicker';
import ArsolApi from '@services/ArsolApi';
import { LogoSpinner } from '@components';
import Snackbar from 'react-native-snackbar';
import moment from 'moment';
import XLSX from 'xlsx';
import { writeFile,appendFile,
        DownloadDirectoryPath,DocumentDirectoryPath } from 'react-native-fs';
//const DDP = DownloadDirectoryPath + "/";
const DDP = DocumentDirectoryPath + "/";
import RNFetchBlob from 'rn-fetch-blob';
import RNPrint from 'react-native-print';
import { FloatingAction } from 'react-native-floating-action';
import * as Animatable from 'react-native-animatable';
import Accordion from 'react-native-collapsible/Accordion';

class GstReportScreen extends PureComponent {


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

      ch_all:true,
      ch_invoice:false,
    
      start_date:moment(new Date()).format('DD/MM/YYYY'),
      end_date:moment(new Date()).format('DD/MM/YYYY'),

        totaltax_val:0,
        totaltax0:0,
        totaltax2:0,
        totaltax5:0,
        totaltax12:0,
        totaltax18:0,
        totaltax28:0,
        total_igst0:0,
        total_igst2:0,
        total_igst5:0,
        total_igst12:0,
        total_igst18:0,
        total_igst28:0,
        total_cgst0:0,
        total_cgst1:0,
        total_cgst2_5:0,
        total_cgst6:0,
        total_cgst9:0,
        total_cgst14:0,
        total_sgst0:0,
        total_sgst1:0,
        total_sgst2_5:0,
        total_sgst6:0,
        total_sgst9:0,
        total_sgst14:0,
        total_val:0,
  

     pdf_data:[],
      activeSections: [],
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
   
      

      this.hit_gst_reportsApi()
   
    })}
  }

  

 



   
  //permission
  requestRunTimePermission=()=> {
    var that = this;
    async function externalStoragePermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'External Storage Write Permission',
          message:'App needs access to Storage data.',
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        that.exportFile();
      } else {
        alert('WRITE_EXTERNAL_STORAGE permission denied');
      }
    } catch (err) {
      Alert.alert('Write permission err', err);
      console.warn(err);
    }
   }

    if (Platform.OS === 'android') {
      externalStoragePermission();
    } else {
      this.exportFile();
    }
  }
  //excel file
  exportFile() {
    const {show_list} = this.state;

   var file_arr =[]
   var wscols = [];
   for(var i =0;i<show_list.length;i++){
    
 
     file_arr.push({
       "Invoice Date":show_list[i].inv_date.replace("T00:00:00", ""),
       "Invoice Number":show_list[i].inv_no,
       "Customer Name":show_list[i].cust_name,
       "GST Number":show_list[i].Gst_number,

       "Taxable Value":show_list[i].taxable_val,
       "Taxable Value (0%)":show_list[i].taxable_val0,
       "Taxable Value (2%)":show_list[i].taxable_val2,
       "Taxable Value (5%)":show_list[i].taxable_val5,
       "Taxable Value (12%)":show_list[i].taxable_val12,
       "Taxable Value (18%)":show_list[i].taxable_val18,
       "Taxable Value (28%)":show_list[i].taxable_val28,

      "IGST (0%)":show_list[i].igst0,
       "CGST (0%)":show_list[i].cgst0,
       "SGST (0%)":show_list[i].sgst0,


      "IGST (2%)":show_list[i].igst2,
      "CGST (1%)":show_list[i].cgst1,
      "SGST (1%)":show_list[i].sgst1,


      "IGST (5%)":show_list[i].igst5,
       "CGST (2.5%)":show_list[i].cgst2_5,
       "SGST (2.5%)":show_list[i].sgst2_5,

       "IGST (12%)":show_list[i].igst12,
       "CGST (6%)":show_list[i].cgst6,
       "SGST (6%)":show_list[i].sgst6,

       "IGST (18%)":show_list[i].igst18,
       "CGST (9%)":show_list[i].cgst9,
       "SGST (9%)":show_list[i].sgst9,
     
       "IGST (28%)":show_list[i].igst28,
       "CGST (14%)":show_list[i].cgst14,
       "SGST (14%)":show_list[i].sgst14,

       "Total Amount":show_list[i].total_amt,
      
     })

   
   }
   const header = Object.keys(file_arr[0]); 
   for (var i = 0; i < header.length; i++) {  // columns length added
    wscols.push({ wch: header[i].length + 5 })
  }
  

  
    /* convert AOA back to worksheet */
    const ws = XLSX.utils.json_to_sheet(file_arr);
    ws["!cols"] = wscols;
 
    console.log(ws)
  
    /* build new workbook */
    const wb = XLSX.utils.book_new();
    console.log(wb)  
    XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
  
    /* write file */
    const wbout = XLSX.write(wb, {type:'binary', bookType:"xlsx",});
    
  
   // console.log("wbout",output(wbout))
   var date = new Date();
  
    const file = DDP + "GstReports_"+ Math.floor(date.getTime()
    + date.getSeconds() / 2)+".xlsx";
 

    //writeFile(file, output(wbout), 'ascii').then((res) =>{
      writeFile(file, wbout, 'ascii')
      .then((res) =>{
      console.log("res",res)
    //    Alert.alert("exportFile success", "Exported to " + file);
       return appendFile(file, wbout, 'ascii');
    })
   .then(() => {
      RNFetchBlob.android.actionViewIntent(file,"application/vnd.ms-excel")
    })
    .catch((err) => { Alert.alert("exportFile Error", "Error " + err.message); });
  
    
  
  
   
  
  };

  filter_fun(){
  
    const {ch_all,ch_invoice} = this.state
     if(ch_all){
       return 0
     }else if(ch_invoice){
       return 1
     }else{
       return 0
     }
}

 _checkbox_fun(val){
   if(val.label=="All"){
     this.setState({
      ch_all:true,
      ch_invoice:false,
      start_date:moment(new Date()).format('DD/MM/YYYY'),
      end_date:moment(new Date()).format('DD/MM/YYYY'),
     })
   }else if(val.label=="Invoice Period"){
    this.setState({
      ch_all:false,
      ch_invoice:true,
     })}
   
 }

 _filterRender(){
   const {ch_invoice,ch_all} = this.state;
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

 <View style={{padding:scale(5)}}>
 <Checkbox
          label='All'
          checked={ch_all}
          onChange={(checked) => this._checkbox_fun(checked)}
          labelStyle={{ fontSize: scale(15), }}
          checkboxStyle={{ width: scale(30), height: scale(30) }}
        
        />
 <Checkbox
          label='Invoice Period'
          checked={ch_invoice}
          onChange={(checked) => this._checkbox_fun(checked)}
          labelStyle={{ fontSize: scale(15), }}
          checkboxStyle={{ width: scale(30), height: scale(30) }}
        
        />    
{
  ch_invoice?
  <View>
<DatePicker
          style={{ width: scale(200), marginTop: scale(10) }}
         date={this.state.start_date}
          placeholder="Select Start Date"
          mode={'date'}
          format="DD/MM/YYYY"
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          showIcon={false}
          customStyles={{
            dateIcon: {
              position: 'absolute',
              left: scale(0),
              top: scale(4),
              marginLeft: scale(0)
            },
            dateInput: {
              marginLeft: scale(36),

            },
            placeholderText: {
              color: '#565656'
            }
          }}
          minuteInterval={10}
          onDateChange={(date) => {this.setState({start_date: date})}}
        
        />
        <DatePicker
          style={{ width: scale(200), marginTop: scale(10) }}
         date={this.state.end_date}
          placeholder="Select End Date"
          mode={'date'}
          format="DD/MM/YYYY"
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          showIcon={false}
          customStyles={{
            dateIcon: {
              position: 'absolute',
              left: scale(0),
              top: scale(4),
              marginLeft: scale(0)
            },
            dateInput: {
              marginLeft: scale(36),

            },  
            placeholderText: {
              color: '#565656'
            }
          }}
          minuteInterval={10}
          onDateChange={(date) => {this.setState({end_date: date})}}
        
        />
</View>
:null
}



      

 </View>


                 


<TouchableOpacity
onPress={()=>{this.setState({filter:false},()=>{
  this.onRefresh()
})}}
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
          this.hit_gst_reportsApi();
        },
      );
    }
   
  }

  hit_gst_reportsApi(){
    const {user_id,user_type} = this.props
    const {page,start_date,end_date,} = this.state
    var filter_type = this.filter_fun()
    ArsolApi.GstReports_api(user_id,user_type,
      filter_type,
      start_date,
      end_date,
      page
      )

    .then(responseJson => {
      console.log('GstReports_api', responseJson);

      if (responseJson.ok) {
        this.setState({
          loading: false,
          refresh:false
        });

        if (responseJson.data != null) {
          if (responseJson.data.hasOwnProperty('status')) {
          
              if (responseJson.data.status == 'success') {
              if (responseJson.data.hasOwnProperty('message')) {

                Snackbar.show({
                  text: responseJson.data.message,
                  duration: Snackbar.LENGTH_SHORT,
                  backgroundColor: Color.lgreen
                });

                 if(responseJson.data.hasOwnProperty("data")){
                       if(responseJson.data.data.length>0){
                         this.setState({
                          show_list:[...this.state.show_list, ...responseJson.data.data],
                          totaltax_val:this.state.totaltax_val+responseJson.data.data2.totaltax_val,

                          totaltax0:this.state.totaltax0+responseJson.data.data2.totaltax0,
                        
      totaltax2:this.state.totaltax2+responseJson.data.data2.totaltax2,
      totaltax5:this.state.totaltax5+responseJson.data.data2.totaltax5,
      totaltax12:this.state.totaltax12+responseJson.data.data2.totaltax12,
      totaltax18:this.state.totaltax18+responseJson.data.data2.totaltax18,
      totaltax28:this.state.totaltax28+responseJson.data.data2.totaltax28,
      
      total_igst0:this.state.total_igst0+responseJson.data.data2.total_igst0,
      total_igst2:this.state.total_igst2+responseJson.data.data2.total_igst2,
      total_igst5:this.state.total_igst5+responseJson.data.data2.total_igst5,
      total_igst12:this.state.total_igst12+responseJson.data.data2.total_igst12,
      total_igst18:this.state.total_igst18+responseJson.data.data2.total_igst18,
      total_igst28:this.state.total_igst28+responseJson.data.data2.total_igst28,

      total_cgst0:this.state.total_cgst0+responseJson.data.data2.total_cgst0,
      total_cgst1:this.state.total_cgst1+responseJson.data.data2.total_cgst1,
      total_cgst2_5:this.state.total_cgst2_5+responseJson.data.data2.total_cgst2_5,
      total_cgst6:this.state.total_cgst6+responseJson.data.data2.total_cgst6,
      total_cgst9:this.state.total_cgst9+responseJson.data.data2.total_cgst9,
      total_cgst14:this.state.total_cgst14+responseJson.data.data2.total_cgst14,

      total_scgst0:this.state.total_sgst0+responseJson.data.data2.total_sgst0,
      total_sgst1:this.state.total_sgst1+responseJson.data.data2.total_sgst1,
      total_sgst2_5:this.state.total_sgst2_5+responseJson.data.data2.total_sgst2_5,
      total_sgst6:this.state.total_sgst6+responseJson.data.data2.total_sgst6,
      total_sgst9:this.state.total_sgst9+responseJson.data.data2.total_sgst9,
      total_sgst14:this.state.total_sgst14+responseJson.data.data2.total_sgst14,
      total_val:this.state.total_val+responseJson.data.data2.total_val,

      
      
                          load_more:responseJson.data.load_more
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
            this.hit_gst_reportsApi();
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


    // 
    renderNext(){
      const {
        totaltax_val,
        totaltax0,
        totaltax2,
        totaltax5,
        totaltax12,
        totaltax18,
        totaltax28,
        total_igst0,
        total_igst2,
        total_igst5,
        total_igst12,
        total_igst18,
        total_igst28,
        total_cgst0,
        total_cgst1,
        total_cgst2_5,
        total_cgst6,
        total_cgst9,
        total_cgst14,
        total_sgst0,
        total_sgst1,
        total_sgst2_5,
        total_sgst6,
        total_sgst9,
        total_sgst14,
        total_val
      }=this.state
  
  
      var footer_View = (
        <View style={{backgroundColor: 'transparent'}}>
          <View
            style={{
              width: '94%',
              alignSelf: 'center',
  
              borderTopWidth: 0.8,
              borderLeftWidth: 0.8,
              borderRightWidth: 0.8,
              borderTopLeftRadius: scale(7),
              borderTopRightRadius: scale(7),
              borderColor: 'grey',
              padding: scale(3),
      
            
            }}>
              <Text style={{fontSize:scale(12),color:'#000',fontWeight:'700'}}>  Total</Text>
            
              <View style={{marginLeft:scale(20)}}>

              {
                totaltax_val>0?
                  <Text style={{fontSize:scale(12),color:'#000'}}>Taxable Value {totaltax_val} </Text>:null
                }
                {
                  totaltax0>0?
                  <Text style={{fontSize:scale(12),color:'#000'}}>Taxable Value (0%) {totaltax0} </Text>:null
                }
                {
                  totaltax2>0?
                  <Text style={{fontSize:scale(12),color:'#000'}}>Taxable Value (2%) {totaltax2} </Text>:null
                }
                 {
                  totaltax5>0?
                  <Text style={{fontSize:scale(12),color:'#000'}}>Taxable Value (5%) {totaltax5} </Text>:null
                }

                    {
                  totaltax12>0?
                  <Text style={{fontSize:scale(12),color:'#000'}}>Taxable Value (12%) {totaltax12} </Text>:null
                }
                  {
                  totaltax18>0?
                  <Text style={{fontSize:scale(12),color:'#000'}}>Taxable Value (12%) {totaltax18} </Text>:null
                }
                {
                  totaltax28>0?
                  <Text style={{fontSize:scale(12),color:'#000'}}>Taxable Value (28%) {totaltax28} </Text>:null
                }



                {
                  total_igst0>0?
                  <Text style={{fontSize:scale(12),color:'#000'}}>IGST (0%) {total_igst0} </Text>:null
                }


{
  total_igst2>0?
                  <Text style={{fontSize:scale(12),color:'#000'}}>IGST (2%) {total_igst2} </Text>:null
                }
                  {
                  total_igst5>0?
                  <Text style={{fontSize:scale(12),color:'#000'}}>IGST (5%) {total_igst5} </Text>:null
                }
                  {
                  total_igst12>0?
                  <Text style={{fontSize:scale(12),color:'#000'}}>IGST (12%) {total_igst12} </Text>:null
                }
                {
                  total_igst18>0?
                  <Text style={{fontSize:scale(12),color:'#000'}}>IGST (18%) {total_igst18} </Text>:null
                }

                {
                  total_igst28>0?
                  <Text style={{fontSize:scale(12),color:'#000'}}>IGST (28%) {total_igst28} </Text>:null
                }


                {
                  total_cgst0>0?
                  <Text style={{fontSize:scale(12),color:'#000'}}>CGST (0%) {total_cgst0} </Text>:null
                }


                  {
                  total_cgst1>0?
                  <Text style={{fontSize:scale(12),color:'#000'}}>CGST (1%) {total_cgst1} </Text>:null
                }
                  {
                  total_cgst2_5>0?
                  <Text style={{fontSize:scale(12),color:'#000'}}>CGST (2.5%) {total_cgst2_5} </Text>:null
                }
                {
                  total_cgst6>0?
                  <Text style={{fontSize:scale(12),color:'#000'}}>CGST (6%) {total_cgst6} </Text>:null
                }

                {
                  total_cgst9>0?
                  <Text style={{fontSize:scale(12),color:'#000'}}>CGST (9%) {total_cgst9} </Text>:null
                }

                 {
                  total_cgst14>0?
                  <Text style={{fontSize:scale(12),color:'#000'}}>CGST (14%) {total_cgst14} </Text>:null
                }
                

                {
                  total_sgst0>0?
                  <Text style={{fontSize:scale(12),color:'#000'}}>SGST (0%) {total_sgst0} </Text>:null
                }
                  {
                  total_sgst1>0?
                  <Text style={{fontSize:scale(12),color:'#000'}}>SGST (1%) {total_sgst1} </Text>:null
                }
                {
                  total_sgst2_5>0?
                  <Text style={{fontSize:scale(12),color:'#000'}}>SGST (2.5%) {total_sgst2_5} </Text>:null
                }

                {
                  total_sgst6>0?
                  <Text style={{fontSize:scale(12),color:'#000'}}>SGST (6%) {total_sgst6} </Text>:null
                }

                 {
                  total_sgst9>0?
                  <Text style={{fontSize:scale(12),color:'#000'}}>SGST (9%) {total_sgst9} </Text>:null
                }

                {
                  total_sgst14>0?
                  <Text style={{fontSize:scale(12),color:'#000'}}>SGST (14%) {total_sgst14} </Text>:null
                }

                {
                  total_val>0?
                  <Text style={{fontSize:scale(12),color:'#000'}}>Amount {total_val} </Text>:null
                }
            
  
              </View>
            
  
            
            
  
          
          </View>
        </View>
      );
      return footer_View;
    }


  renderHeader() {
    return (
      <View
        style={{
          height: scale(50), backgroundColor: "#80d4ff",
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 9,
          },
          shadowOpacity: 0.48,
          shadowRadius: 11.95,

          elevation: 20,
          borderRadius: scale(15),
          margin: scale(7),
          justifyContent: "center",
          padding: scale(10)

        }}
      >

        <View style={{ justifyContent: 'center', alignContent: 'center' }}>
          <TouchableHighlight
            activeOpacity={1}
            underlayColor={'#ddd'}
            onPress={() => this.props.navigation.toggleDrawer()}
            style={{
              width: scale(40), height: scale(40),
              alignItems: "center",
              justifyContent: 'center',
              borderRadius: scale(20)
            }}
          >

            <Image source={Images.menu} style={{
              width: scale(20), height: scale(20),


            }} />

          </TouchableHighlight>

          <Text style={{
            position: "absolute",
            alignSelf: "center",
            fontSize: scale(18),
            color: "#fff",
            fontWeight: 'bold'
          }}>Gst Report</Text>

          <TouchableHighlight
            activeOpacity={1}
            underlayColor={'#ddd'}
            onPress={() => { this.setState({ filter: true }) }}
            style={{
              position: "absolute", marginLeft: scale(280), width: scale(40), height: scale(40),
              alignItems: "center",
              justifyContent: 'center',
              borderRadius: scale(20)
            }}
          >

            <Image source={Images.filterw} style={{
              width: scale(30), height: scale(30),


            }} />

          </TouchableHighlight>
        </View>

      </View>

    )
  }

  _handleAdd(item) {
    const { navigation, network } = this.props;


 if (item == 'export') {
      if (this.state.show_list.length > 0) {
        this.requestRunTimePermission()
      } else {
        alert("No Record Found")
      }
    }

    if (network.isConnected) {

    } else {
      Snackbar.show({
        text: msg.noInternet,
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: "red"
      });
    }
  }

  //=================================================


  setSections = sections => {
    this.setState({
      activeSections: sections.includes(undefined) ? [] : sections,
    });
  };




  renderShow = (section, _, isActive) => {
    

    return (
      <Animatable.View
        duration={400}
        style={
          isActive ? styles.active : styles.inactive}

      >
   
      
              <Text style={{
                fontSize: scale(14), fontWeight: 'bold', fontStyle: 'italic',
                textTransform: 'capitalize'
              }}
                numberOfLines={1}
           >{section.cust_name}</Text>
              <Text style={styles.txt}
                numberOfLines={1}
                >Invoice Number:{section.inv_no}</Text>








      </Animatable.View>
    );
  };

  renderContent = (section, _, isActive) => {
    const { totaltax_val,
      totaltax0,
      totaltax2,
      totaltax5,
      totaltax12,
      totaltax18,
      totaltax28,
      total_igst0,
      total_igst2,
      total_igst5,
      total_igst12,
      total_igst18,
      total_igst28,
      total_cgst0,
      total_cgst1,
      total_cgst2_5,
      total_cgst6,
      total_cgst9,
      total_cgst14,
      total_sgst0,
      total_sgst1,
      total_sgst2_5,
      total_sgst6,
      total_sgst9,
      total_sgst14,
      total_val
    } = this.state
    return (
      <View>
        {
          isActive ? <Animatable.View
            duration={400}
            style={
              isActive ? styles.activeContent : styles.inactiveContent}>

            
                  <Animatable.Text style={styles.txt}
                    numberOfLines={1}
                    animation={isActive ? 'bounceIn' : undefined}
            >GST Number::{section.Gst_number}</Animatable.Text>
                  <Animatable.Text style={styles.txt}
                    numberOfLines={1}
                    animation={isActive ? 'bounceIn' : undefined}
            >Invoice Date:{section.inv_date}</Animatable.Text>
              
                  <Animatable.Text style={styles.txt}
                    numberOfLines={1}
                    animation={isActive ? 'bounceIn' : undefined}
                  >Total Amount:{section.total_amt}</Animatable.Text>
                  
            {
              totaltax_val > 0 ?
                
                  <Animatable.Text style={styles.txt}
                    numberOfLines={1}
                  >Taxable Value:{section.totaltax_val}</Animatable.Text>
                : null}


            {
              totaltax0 > 0 ?
                
                  <Animatable.Text style={styles.txt}
                    numberOfLines={1}
                  >Taxable Value(0%):{section.taxable_val0}</Animatable.Text>
                
                : null
            }

            {
              totaltax2 > 0 ?

                
                  <Text style={styles.txt}
                    numberOfLines={1}
                  >Taxable Value(2%):{section.taxable_val2}</Text>
                 : null}

            {
              totaltax5 > 0 ?
                
                  <Text style={styles.txt}
                    numberOfLines={1}
                  >Taxable Value(5%):{section.taxable_val5}</Text>
                 : null}


            {
              totaltax12 > 0 ?
                
                  <Text style={styles.txt}
                    numberOfLines={1}
                  >Taxable Value(12%):{section.taxable_val12}</Text>
             : null}

            {
              totaltax18 > 0 ?

                
                  <Text style={styles.txt}
                    numberOfLines={1}
                  >Taxable Value(18%):{section.taxable_val18}</Text>
                 : null}

            {
              totaltax28 > 0 ?
               
                  <Text style={styles.txt}
                    numberOfLines={1}
                  >Taxable Value(28%):{section.taxable_val28}</Text>
                 : null}

            {
              total_igst0 > 0 ?
                
                  <Text style={styles.txt}
                    numberOfLines={1}
                  >IGST (0%):{section.igst0}</Text>
                 : null}


            {
              total_cgst0 > 0 ?
                
                  <Text style={styles.txt}
                    numberOfLines={1}
                  >CGST (0%):{section.cgst0}</Text>
                 : null}

            {
              total_sgst0 > 0 ?
                
                  <Text style={styles.txt}
                    numberOfLines={1}
                  >SGST (0%):{section.sgst0}</Text>
                 : null}


            {
              total_igst2 > 0 ?
             
                  <Text style={styles.txt}
                    numberOfLines={1}
                  >IGST (2%):{section.igst2}</Text>
                 : null}


            {
              total_cgst1 > 0 ?
             
                  <Text style={styles.txt}
                    numberOfLines={1}
                  >CGST (1%):{section.cgst1}</Text>
                : null}


            {
              total_sgst1 > 0 ?
               
                  <Text style={styles.txt}
                    numberOfLines={1}
                  >SGST (1%):{section.sgst1}</Text>
             : null}

            {
              total_igst5 > 0 ?

                
                  <Text style={styles.txt}
                    numberOfLines={1}
                  >IGST (5%):{section.igst5}</Text>
                 : null}
            {
              total_cgst2_5 > 0 ?
                <View style={{ flexDirection: 'row' }}>
                  <Text style={styles.txth}
                    numberOfLines={1}
                  >CGST (2.5%):</Text>
                  <Text style={styles.txt}
                    numberOfLines={1}
                  >{section.cgst2_5}</Text>
                </View> : null}

            {
              total_sgst2_5 > 0 ?
               
                  <Text style={styles.txt}
                    numberOfLines={1}
                  >SGST (2.5%):{section.sgst2_5}</Text>
                : null}

            {
              total_igst12 > 0 ?
               
                  <Text style={styles.txt}
                    numberOfLines={1}
                  >IGST (12%):{section.igst12}</Text>
                : null}

            {
              total_cgst6 > 0 ?
                
                  <Text style={styles.txt}
                    numberOfLines={1}
                  >CGST (6%):{section.cgst6}</Text>
                 : null}

            {
              total_sgst6 > 0 ?
               
                  <Text style={styles.txt}
                    numberOfLines={1}
                  >SGST (6%):{section.sgst6}</Text>
              : null}

            {
              total_igst18 > 0 ?
               
                  <Text style={styles.txt}
                    numberOfLines={1}
                  >IGST (18%):{section.igst18}</Text>
                : null}

            {
              total_cgst9 > 0 ?
              
                  <Text style={styles.txt}
                    numberOfLines={1}
                  >CGST (9%):{section.cgst9}</Text>
                : null}

            {
              total_sgst9 > 0 ?
                
                  <Text style={styles.txt}
                    numberOfLines={1}
                  >SGST (9%):{section.sgst9}</Text>
            : null}

            {
              total_igst28 > 0 ?
                
                  <Text style={styles.txt}
                    numberOfLines={1}
                  >IGST (28%):{section.igst28}</Text>
                : null}

            {
              total_cgst14 > 0 ?
                
                  <Text style={styles.txt}
                    numberOfLines={1}
                  >CGST (14%):{section.cgst14}</Text>
                 : null}

            {
              total_sgst14 > 0 ?
                
                  <Text style={styles.txt}
                    numberOfLines={1}
                  >SGST (14%):{section.sgst14}</Text>
                 : null}

            {
              total_val > 0 ?
               
                  <Text style={styles.txt}
                    numberOfLines={1}
                  >Total Amount:{section.total_val}</Text>
                : null}
            








          </Animatable.View> : null
        }
      </View>



    );
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
          right: 50,
          bottom: 160,
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
          if (this.state.show_list.length > 0) {
            this.requestRunTimePermission()
          } else {
            alert("No Record Found")
          }

        }}
      >

        <Image source={Images.excel}

          style={{
            resizeMode: 'contain',
            width: 50,
            height: 50,
          }} />

      </TouchableOpacity>
    );
  }

  render() {
const {show_list,activeSections}=this.state
    
 
return (
  <View style={{
     flex: 1,
    backgroundColor: "#fff"
     }}>
    {this.renderHeader()}
 <LogoSpinner loading={this.state.loading} />
    <ScrollView
      style={{ flex: 1 }}
      contentInsetAdjustmentBehavior="automatic"
      refreshControl={
        <RefreshControl
          onRefresh={() => this.onRefresh()}
          refreshing={this.state.refresh}
        />
      }
      onEndReachedThreshold={1}
      onMomentumScrollBegin={() => this._onMomentumScrollBegin()}
      onMomentumScrollEnd={this.handleLoadMore.bind(this)}
    >

      {
        show_list.length > 0 ?
          <Accordion
            activeSections={activeSections}
            sections={show_list}
            touchableComponent={TouchableWithoutFeedback}
            expandMultiple={false}
            renderHeader={this.renderShow}
            renderContent={this.renderContent}
            duration={400}
            onChange={this.setSections}
          /> :
          <View View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {this.state.loading == false ? (
              <View style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <View style={{
                  backgroundColor: "#ddd",
                  width: scale(80), height: scale(80),
                  alignItems: "center",
                  justifyContent: 'center',
                  borderRadius: scale(80) / 2,
                  borderWidth: 2,
                  borderColor: '#AED581'
                }}>

                  <Image source={Images.logo} style={{
                    resizeMode: 'contain',
                    width: scale(50),
                    height: scale(50),
                  }} />
                </View>

                <Text style={{
                  fontSize: scale(15),
                  width: scale(150),
                  textAlign: 'center',
                  marginTop: scale(5)
                }}>No Record Found</Text>
              </View>
            ) : null}
          </View>


      }

      {this.renderFooter()}

    </ScrollView>


{this._filterRender()}


{show_list.length > 0 ? this.renderNext() : null}

    {show_list.length > 0 ? this.renderFOB() : null}

     </View>
    );
  }
}



const styles = StyleSheet.create({

  txt: { fontSize: scale(12), width: '90%' },
  txth:{fontSize:scale(12),fontWeight:'bold'},

  userInput: {
    height: scale(40),
    backgroundColor: 'white',
    marginBottom: scale(15),
    borderColor: 'grey',
    borderWidth: scale(1),
    width:scale(180),
    marginLeft:scale(30)
    },

    input: {
      color: '#000',
      marginLeft: scale(5),
      width: '73%',
      fontSize: scale(12)
      },


  active: {
    backgroundColor: 'rgba(245,252,255,1)',
    padding: scale(10),

    marginHorizontal: scale(20),
    borderTopLeftRadius: scale(10),
    borderTopRightRadius: scale(10),
    borderBottomWidth: scale(1),
    borderColor: '#ddd'
  },
  inactive: {
    backgroundColor: '#fff',

    padding: scale(10),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.48,
    shadowRadius: 11.95,
    elevation: 10,
    marginHorizontal: scale(20),
    marginVertical: scale(10),
    borderRadius: scale(10)

  },
  activeContent: {
    backgroundColor: 'rgba(245,252,255,1)',
    padding: scale(10),

    marginHorizontal: scale(20),
    borderBottomLeftRadius: scale(10),
    borderBottomRightRadius: scale(10),

  },
  inactiveContent: {
    backgroundColor: '#fff',
    height: scale(0),
    padding: scale(10),
    marginHorizontal: scale(20),



  },

     
 });



GstReportScreen.defaultProps = {
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
)(GstReportScreen);