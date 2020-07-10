import React, { PureComponent ,Fragment} from "react";
import {
  View, TouchableHighlight, TouchableWithoutFeedback,
  ImageBackground,Dimensions,

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
      

      ch_all:false,
      ch_invoice:true,
    
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

        filter_type:1
  


     }

 }

 componentDidMount() {
  const { network} = this.props;

this._subscribe = this.props.navigation.addListener('focus', () => {
  if (!network.isConnected) {
    Snackbar.show({
      text: msg.noInternet,
      duration: Snackbar.LENGTH_SHORT,
      backgroundColor: "red"
    });
  } else {
    this.setState({ loading: true,
      refresh: false,
      load_more: false,
      onEndReachedCalledDuringMomentum: true,
      page: 0,
      show_list: [],


      ch_all: false,
      ch_invoice: true,

      start_date: moment(new Date()).format('DD/MM/YYYY'),
      end_date: moment(new Date()).format('DD/MM/YYYY'),

      totaltax_val: 0,
      totaltax0: 0,
      totaltax2: 0,
      totaltax5: 0,
      totaltax12: 0,
      totaltax18: 0,
      totaltax28: 0,
      total_igst0: 0,
      total_igst2: 0,
      total_igst5: 0,
      total_igst12: 0,
      total_igst18: 0,
      total_igst28: 0,
      total_cgst0: 0,
      total_cgst1: 0,
      total_cgst2_5: 0,
      total_cgst6: 0,
      total_cgst9: 0,
      total_cgst14: 0,
      total_sgst0: 0,
      total_sgst1: 0,
      total_sgst2_5: 0,
      total_sgst6: 0,
      total_sgst9: 0,
      total_sgst14: 0,
      total_val: 0,

      filter_type: 1
    
    }, () => {



      this.hit_gst_reportsApi()

    })
  }
})

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
   if(val == "0"){
     this.setState({
      ch_all:true,
      ch_invoice:false,
      start_date:moment(new Date()).format('DD/MM/YYYY'),
      end_date:moment(new Date()).format('DD/MM/YYYY'),
     })
   }else if(val == "1"){
    this.setState({
      ch_all:false,
      ch_invoice:true,
      start_date:moment(new Date()).format('DD/MM/YYYY'),
      end_date:moment(new Date()).format('DD/MM/YYYY'),
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
          totaltax_val: 0,
          totaltax0: 0,
          totaltax2: 0,
          totaltax5: 0,
          totaltax12: 0,
          totaltax18: 0,
          totaltax28: 0,
          total_igst0: 0,
          total_igst2: 0,
          total_igst5: 0,
          total_igst12: 0,
          total_igst18: 0,
          total_igst28: 0,
          total_cgst0: 0,
          total_cgst1: 0,
          total_cgst2_5: 0,
          total_cgst6: 0,
          total_cgst9: 0,
          total_cgst14: 0,
          total_sgst0: 0,
          total_sgst1: 0,
          total_sgst2_5: 0,
          total_sgst6: 0,
          total_sgst9: 0,
          total_sgst14: 0,
          total_val: 0,



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
    this.setState({ filter_type: filter_type })
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

    if (!this.state.load_more) return (

      <View>
        {
          this.state.show_list.length > 0 ?

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
                width: scale(100),
                fontWeight: 'bold',
                fontSize: scale(12),
                textAlign: 'center',
                textAlignVertical: 'center',
                borderColor: '#ddd',
                borderRightWidth: scale(1)
              }}
                numberOfLines={2}
              >Total:</Text>
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

              {
                totaltax_val > 0 ?
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
                  >{totaltax_val}</Text> : null}
              {
                totaltax0 > 0 ?
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
                  >{totaltax0}</Text>
                  : null}
              {
                totaltax2 > 0 ?
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
                  >{totaltax2}</Text>
                  : null}

              {
                totaltax5 > 0 ?
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
                  >{totaltax5}</Text>
                  : null}

              {
                totaltax12 > 0 ?
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
                  >{totaltax12}</Text>
                  : null}

              {
                totaltax18 > 0 ?
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
                  >{totaltax18}</Text>
                  : null}

              {
                totaltax28 > 0 ?
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
                  >{totaltax28}</Text>
                  : null}

              {/* 0 % */}
              {
                total_igst0 > 0 ?
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
                  >{total_igst0}</Text>
                  : null}

              {
                total_cgst0 > 0 ?
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
                  >{total_cgst0}</Text>
                  : null}

              {
                total_sgst0 > 0 ?

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
                  >{total_sgst0}</Text>
                  : null}

              {/* 2 % */}

              {
                total_igst2 > 0 ?
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
                  >{total_igst2}</Text>
                  : null}
              {
                total_cgst1 > 0 ?
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
                  >{total_cgst1}</Text>
                  : null}

              {
                total_sgst1 > 0 ?
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
                  >{total_sgst1}</Text>
                  : null}

              {/* 5% */}

              {
                total_igst5 > 0 ?
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
                  >{total_igst5}</Text> : null}
              {
                total_cgst2_5 > 0 ?
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
                  >{total_cgst2_5}</Text> : null}
              {
                total_sgst2_5 > 0 ?
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
                  >{total_sgst2_5}</Text> : null}




              {/* 12 % */}


              {
                total_igst12 > 0 ?
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
                  >{total_igst12}</Text> : null}
              {
                total_cgst6 > 0 ?
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
                  >{total_cgst6}</Text> : null}
              {
                total_sgst6 > 0 ?
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
                  >{total_sgst6}</Text> : null}


              {/* 18 % */}


              {
                total_igst18 > 0 ?
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
                  >{total_igst18}</Text> : null}
              {
                total_cgst9 > 0 ?
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
                  >{total_cgst9}</Text> : null}
              {
                total_sgst9 > 0 ?
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
                  >{total_sgst9}</Text> : null}


              {/* 28 % */}

              {
                total_igst28 > 0 ?
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
                  >{total_igst28}</Text> : null}
              {
                total_cgst14 > 0 ?
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
                  >{total_cgst14}</Text> : null}
              {
                total_sgst14 > 0 ?
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
                  >{total_sgst14}</Text> : null}

              {
                total_val > 0 ?
                  <Text style={{

                    padding: scale(10),
                    width: scale(100),
                    fontWeight: 'bold',
                    fontSize: scale(12),
                    textAlign: 'center',
                    textAlignVertical: 'center',

                  }}
                    numberOfLines={2}
                  >{total_val}</Text> : null}


            </View>



            : <View style={{ marginBottom: scale(100), }} />
        }

      </View>


    )

    return (
      <View style={{
        marginBottom: scale(100),
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
      }}>
        <ActivityIndicator size="small" color="#ddd" />
      </View>
    );
  };


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
        >GST Report</Text>

      </View>
    )
  }

  renderTitle() {
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
        >Invoice Date</Text>

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
        >Invoice Number</Text>
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
        >Customer Name</Text>
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
        >GST Number</Text>

        {
          totaltax_val > 0 ?
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
            >Taxable Value</Text>:null}
        {
          totaltax0 > 0 ?
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
        >Taxable Value (0%)</Text>
         :null} 
        {
          totaltax2 > 0 ?
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
        >Taxable Value (2%)</Text>
       :null}
       
        {
          totaltax5 > 0 ?
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
        >Taxable Value (5%)</Text>
       :null}

       {
          totaltax12 > 0 ?
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
        >Taxable Value (12%)</Text>
            : null}

        {
          totaltax18 > 0 ?
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
        >Taxable Value (18%)</Text>
      :null}
      
        {
          totaltax28 > 0 ?
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
        >Taxable Value (28%)</Text>
        :null}

{/* 0 % */}
        {
          total_igst0 > 0 ?
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
        >IGST (0%)</Text>
          :null}
      
        {
          total_cgst0 > 0 ?
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
        >CGST (0%)</Text>
        :null}

        {
              total_sgst0 > 0 ?
        
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
        >SGST (0%)</Text>
        :null}

        {/* 2 % */}

         {
          total_igst2 > 0 ?
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
        >IGST (2%)</Text>
        :null}
        {
              total_cgst1 > 0 ?
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
        >CGST (1%)</Text>
      :null}
      
        {
          total_sgst1 > 0 ?
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
        >SGST (1%)</Text>
          :null}

        {/* 5% */}

             {
              total_igst5 > 0 ?
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
        >IGST (5%)</Text>:null}
        {
          total_cgst2_5 > 0 ?
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
        >CGST (2.5%)</Text>:null}
             {
          total_sgst2_5 > 0 ?
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
        >SGST (2.5%)</Text>:null}


       

        {/* 12 % */}


        {
          total_igst12 > 0 ?
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
        >IGST (12%)</Text>:null}
        {
          total_cgst6 > 0 ?
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
        >CGST (6%)</Text>:null}
        {
              total_sgst6 > 0 ?
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
        >SGST (6%)</Text>:null}


        {/* 18 % */}


        {
          total_igst18 > 0 ?
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
            >IGST (18%)</Text> : null}
        {
          total_cgst9 > 0 ?
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
            >CGST (9%)</Text> : null}
        {
          total_sgst9 > 0 ?
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
            >SGST (9%)</Text> : null}


        {/* 28 % */}

        {
          total_igst28 > 0 ?
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
        >IGST (28%)</Text>:null}
        {
          total_cgst14 > 0 ?
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
        >CGST (14%)</Text>:null}
        {
          total_sgst14 > 0 ?
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
        >SGST (14%)</Text>:null}
        
{
              total_val > 0 ?
        <Text style={{

          padding: scale(10),
          width: scale(100),
          fontWeight: 'bold',
          fontSize: scale(12),

        }}
          numberOfLines={2}
        >Total Invoice Amount</Text>:null}

       


      </View>
    )
  }
  _renderListItem(rowData, index) {
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
        >{rowData.item.inv_date}</Text>
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
        >{rowData.item.inv_no}</Text>
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
        >{rowData.item.cust_name}</Text>
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
        >{rowData.item.Gst_number}</Text>
      
      {totaltax_val>0?
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
          >{rowData.item.taxable_val}</Text>
      :null}
      

        {totaltax0>0?
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
          >{rowData.item.taxable_val0}</Text>
        :null
      }

        {
          totaltax2>0?
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
            >{rowData.item.taxable_val2}</Text>
          
          :null
        }
        {
          totaltax5 > 0 ?
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
        >{rowData.item.taxable_val5}</Text>:null}

        {
          totaltax12 > 0 ?
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
            >{rowData.item.taxable_val12}</Text>:null}

        {
          totaltax18 > 0 ?
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
            >{rowData.item.taxable_val18}</Text>:null}

        {
          totaltax28 > 0 ?
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
            >{rowData.item.taxable_val28}</Text>:null}

        {/* 0% */}
        
        {total_igst0>0?
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
          >{rowData.item.igst0}</Text>
        :null}

        {
          total_cgst0 > 0 ?
        
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
        >{rowData.item.cgst0}</Text>:null}

        {
          total_sgst0 > 0 ?
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
        >{rowData.item.sgst0}</Text>:null}

        {/* 2% */}
        {
          total_igst2 > 0 ?
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
        >{rowData.item.igst2}</Text>:null}
        {
          total_cgst1 > 0 ?
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
        >{rowData.item.cgst1}</Text>:null}

        {
          total_sgst1 > 0 ?
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
        >{rowData.item.sgst1}</Text>:null}

        {/* 5% */}
     {
              total_igst5 > 0 ?
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
        >{rowData.item.igst5}</Text>:null}
        {
          total_cgst2_5 > 0 ?
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
        >{rowData.item.cgst2_5}</Text>:null}
        {
          total_sgst2_5 > 0 ?
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
        >{rowData.item.sgst2_5}</Text>:null}

        {/* 12% */}
        {
          total_igst12 > 0 ?
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
            >{rowData.item.igst12}</Text> : null}
        {
          total_cgst6 > 0 ?
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
            >{rowData.item.cgst6}</Text> : null}

        {
          total_sgst6 > 0 ?
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
            >{rowData.item.sgst6}</Text> : null}

        {/* 18% */}
   {
          total_igst18 > 0 ?
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
        >{rowData.item.igst18}</Text>:null}

        {
          total_cgst9 > 0 ?
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
        >{rowData.item.cgst9}</Text>:null}
        {
          total_sgst9 > 0 ?
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
        >{rowData.item.sgst9}</Text>:null}

        {/* 28% */}
        {
          total_igst28 > 0 ?
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
        >{rowData.item.igst28}</Text>
      :null}
      {
          total_cgst14 > 0 ?
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
        >{rowData.item.cgst14}</Text>
       :null}
       {
          total_sgst14 > 0 ?
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
        >{rowData.item.sgst14}</Text>
      :null}
        {
          total_val > 0 ?
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
        >{rowData.item.total_amt}</Text>:null}

      
      </View>






    )
  }



  render() {
    const { ch_display_name, ch_invoice, ch_invoice_no, ch_all,
      invoice_number, display_name, filter_type } = this.state;



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
              <View
                style={{
                  padding: scale(5),
                  backgroundColor: '#f1f3f6'
                }}
              >

                <View style={{
                  flexDirection: 'row',
                  marginVertical: scale(5),
                  alignItems: "center"

                }}>
                  <Text style={{
                    fontSize: scale(12),
                    fontWeight: 'bold',
                    width: scale(50)
                  }}
                    numberOfLines={2}
                  >Search Option:</Text>

                  <TouchableOpacity>
                    <Text
                      style={{
                        padding: scale(5),
                        borderColor: '#000',
                        borderWidth: scale(1),

                        textAlign: 'center',

                        fontSize: scale(10),
                        backgroundColor: ch_all ? Color.headerTintColor : '#ccc',

                        borderRadius: scale(5),
                        color: ch_all ? '#fff' : '#000',
                        marginLeft: scale(5)
                      }}
                      numberOfLines={1}
                      onPress={() => { this._checkbox_fun(0) }}
                    >All</Text>
                  </TouchableOpacity>

                  <TouchableOpacity>
                    <Text
                      style={{
                        padding: scale(5),
                        borderColor: '#000',
                        borderWidth: scale(1),

                        textAlign: 'center',

                        fontSize: scale(10),
                        backgroundColor: ch_invoice ? Color.headerTintColor : '#ccc',
                        color: ch_invoice ? '#fff' : '#000',
                        maxWidth: scale(100),
                        borderRadius: scale(5),
                        marginLeft: scale(5)

                      }}
                      numberOfLines={1}
                      onPress={() => { this._checkbox_fun(1) }}

                    >Invoice Period</Text>
                  </TouchableOpacity>

                  


                </View>

                

                <View style={{
                  flexDirection: 'row',
                  marginTop: scale(5),

                  alignItems: "center"
                }}>

                  {
                    ch_invoice ?
                      <View style={{ flexDirection: "row", }}>
                        <DatePicker
                          style={{ width: scale(100), }}
                          date={this.state.start_date}
                          placeholder="Select Start Date"
                          mode={'date'}
                          format="DD/MM/YYYY"
                          confirmBtnText="Confirm"
                          cancelBtnText="Cancel"
                          showIcon={false}
                          minuteInterval={10}
                          onDateChange={(date) => { this.setState({ start_date: date }) }}

                        />
                        <DatePicker
                          style={{ width: scale(100), marginLeft: scale(5) }}
                          date={this.state.end_date}
                          placeholder="Select End Date"
                          mode={'date'}
                          format="DD/MM/YYYY"
                          confirmBtnText="Confirm"
                          cancelBtnText="Cancel"
                          showIcon={false}
                          minuteInterval={10}
                          onDateChange={(date) => { this.setState({ end_date: date }) }}

                        />
                      </View>
                      : null
                  }

                  {
                    ch_invoice_no ?
                      <View style={styles.userInput}>
                        <TextInput
                          placeholder='Number'
                          style={styles.input}
                          autoCorrect={false}
                          autoCapitalize={'none'}
                          underlineColorAndroid="transparent"
                          onChangeText={invoice_number => this.setState({ invoice_number })}
                          value={invoice_number}
                        />
                      </View> : null
                  }

                  {ch_display_name ?
                    <View style={styles.userInput}>
                      <TextInput
                        placeholder='Name'
                        style={styles.input}
                        autoCorrect={false}
                        autoCapitalize={'none'}
                        underlineColorAndroid="transparent"
                        onChangeText={display_name => this.setState({ display_name })}
                        value={display_name}
                      />
                    </View> : null
                  }






                  <TouchableOpacity
                    onPress={() => {
                      this.onRefresh()
                    }}

                  >
                    <Text style={{
                      textAlign: 'center',
                      fontSize: scale(10),
                      padding: scale(5),
                      maxWidth: scale(100),
                      backgroundColor: '#0095DF',
                      borderRadius: scale(5),
                      color: '#fff',
                      marginLeft: scale(10),
                      height: scale(40),
                      textAlignVertical: "center",
                      minWidth: scale(60)
                    }}
                      numberOfLines={1}
                    >Search</Text>
                  </TouchableOpacity>
                </View>


                <Text
                  style={{
                    fontSize: scale(12),
                    width: scale(300),
                    marginVertical: scale(5)
                  }}
                  numberOfLines={1}
                >Report For:
              {filter_type == 0 ? "All Records" :
                    filter_type == 1 ? "Date between " +
                     this.state.start_date + " and " + this.state.end_date :""
                  }
                </Text>







              </View>





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

          {
            this.state.show_list.length > 0 ?
          

                <TouchableOpacity
                  onPress={() => {

                    if (this.state.show_list.length > 0) {
                      this.requestRunTimePermission()
                    } else {
                      alert("No Record Found")
                    }


                  }}
                  style={{
                    width: scale(100),
                    height: scale(40),
                    borderRadius: scale(10),
                    backgroundColor: Color.bgColor,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginLeft:scale(20)
                  }}
                >
                  <Text style={{
                    fontSize: scale(15),
                    color: 'white',
                    fontWeight: 'bold',
                    width: scale(100),
                    textAlign: 'center'
                  }}
                    numberOfLines={1}
                  >Export</Text>
                </TouchableOpacity>


              : null
          }






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
  txt: { fontSize: scale(12), width: scale(300), },


  userInput: {
    height: scale(40),
    backgroundColor: 'white',
    borderWidth: scale(1),
    width: scale(100),
    justifyContent: "center",
    borderRadius: scale(5),
    borderColor: "#ddd",
    marginLeft: scale(5)

  },


  title: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '300',
    marginBottom: 20,
  },
  header: {
    backgroundColor: '#F5FCFF',
    padding: 10,
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