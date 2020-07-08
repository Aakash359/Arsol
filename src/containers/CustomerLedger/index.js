import React, {PureComponent, Fragment} from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TextInput,
  PermissionsAndroid,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Image,
  ActivityIndicator,TouchableHighlight
} from 'react-native';

import {connect} from 'react-redux';
import {Config, Color, Images} from '@common';

import {scale} from 'react-native-size-matters';
import {StackActions} from '@react-navigation/native';

const msg = Config.SuitCRM;
import {NavigationBar} from '@components';

import Checkbox from 'react-native-modest-checkbox';
import DatePicker from 'react-native-datepicker';
import ArsolApi from '@services/ArsolApi';
import {LogoSpinner} from '@components';
import Snackbar from 'react-native-snackbar';
import moment from 'moment';
import XLSX from 'xlsx';
import {writeFile, appendFile, DownloadDirectoryPath} from 'react-native-fs';
const DDP = DownloadDirectoryPath + '/';
import RNFetchBlob from 'rn-fetch-blob';
import RNPrint from 'react-native-print';
import RNPickerSelect from 'react-native-picker-select';
import { FloatingAction } from 'react-native-floating-action';

class CustomerLedgerScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      refresh: false,
      onEndReachedCalledDuringMomentum: true,
      show_list: [],
      data2:'',
      customer_list: [],
      customer_value: '',
      start_date: moment(new Date()).format('DD/MM/YYYY'),
      end_date: moment(new Date()).format('DD/MM/YYYY'),
      filter: false,

      pdf_data: [],
    };
  }

  componentDidMount() {
    const {network} = this.props;

    if (!network.isConnected) {
      Snackbar.show({
        text: msg.noInternet,
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: 'red',
      });
    } else {
      this.setState({loading: true}, () => {
        this.hit_CompanyNameApi();
        //  this.hit_customer_ledgerApi()
      });
    }
  }

  renderTableHeader() {
    var header = [
      'Date',
      'Particulars',
      'Voucher Type',
      'Desc',
      'Debit',
      'Credit',
    ];

    return header.map((key, index) => {
      return `<th>${key}</th>`;
    });
  }

  renderTableData() {
    return this.state.show_list.map((ledger, index) => {
      const {date, particular, voucher, description, debit, credit} = ledger; //destructuring

      return `<tr key=${index}>
           <td>${date}</td>
           <td>${particular}</td>
           <td>${voucher}</td>
           <td>${description}</td>
           <td>${debit}</td>
           <td>${credit}</td>
 
        </tr>`;
    });
  }

  hit_CompanyNameApi() {
    const {network, user_id, user_type} = this.props;
    if (network.isConnected) {
      ArsolApi.CompanyName_api(user_id, user_type)

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
                        customer_list: responseJson.data.data,
                        filter:true
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
  }

  //print
  async printHTML() {
    const {data2,show_list}=this.state
    let html_content = `<html>
    <head>
    <style type="text/css">

    #title {
      text-align: center;
      font-family: arial, sans-serif;
    }
    
    #students {
      text-align: center;
      font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
      border-collapse: collapse;
      border: 3px solid #ddd;
      width: 100%;
    }
    
    #students td, #students th {
      border: 1px solid #ddd;
      padding: 8px;
    }
    
    
    
    #students tr:hover {background-color: #ddd;}
    
    #students th {
      padding-top: 12px;
      padding-bottom: 12px;
      text-align: center;
      background-color: #4CAF50;
      color: white;
    }


    </style>


    </head>

 
          <div>
          <h1 id='title'>${data2.company_name}</h1>
          <h1 id='title'>${data2.cust_address}</h1>
          <h1 id='title'>${data2.cust_zip}</h1>
          <h1 id='title'>Ledger Account -${data2.ledger_account}</h1>

          <table id='students'>
             <tbody>
                
             <tr>${this.renderTableHeader()}</tr>

                 ${this.renderTableData()}

           <tr bgcolor="lightblue">
           <td></td>
           <td></td>
           <td></td>
           <td></td>
           <td>${show_list.reduce((prev, next) => prev + parseInt(next.debit), 0)}</td>
           <td>${show_list.reduce((prev, next) => prev + parseInt(next.credit), 0)}</td>
           </tr>

           <tr bgcolor="lightblue">
           <td></td>
           <td>Dr</td>
           <td>Closing Balance</td>
           <td></td>
           <td></td>
           <td>${show_list.reduce((prev, next) => prev + parseInt(next.debit), 0)-show_list.reduce((prev, next) => prev + parseInt(next.credit), 0)}</td>
           </tr>

           <tr bgcolor="lightblue">
           <td></td>
           <td></td>
           <td></td>
           <td></td>
           <td>${show_list.reduce((prev, next) => prev + parseInt(next.debit), 0)}</td>
           <td>${show_list.reduce((prev, next) => prev + parseInt(next.credit), 0)+show_list.reduce((prev, next) => prev + parseInt(next.debit), 0)-show_list.reduce((prev, next) => prev + parseInt(next.credit), 0)}</td>
           </tr>


             </tbody>
          </table>
       </div>`;

    await RNPrint.print({
      html: html_content.replace(/,/g, ''),
    });
  }

  //permission
  requestRunTimePermission = () => {
    var that = this;
    async function externalStoragePermission() {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'External Storage Write Permission',
            message: 'App needs access to Storage data.',
          },
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
  };
  //excel file
  exportFile() {
    const {show_list,data2} = this.state;

    var file_arr = [];
    var wscols = [];
    for (var i = 0; i < show_list.length; i++) {
      file_arr.push({
        Date: show_list[i].date,
        Particulars: show_list[i].particular,
        'Voucher Type': show_list[i].voucher,
        Desc: show_list[i].description,
        Debit: show_list[i].debit,
        Credit: show_list[i].credit,
      });
    }

    file_arr.push({
      Date: "",
      Particulars: "",
      'Voucher Type': "",
      Desc: "",
      Debit: show_list.reduce((prev, next) => prev + parseInt(next.debit), 0),
      Credit: show_list.reduce((prev, next) => prev + parseInt(next.credit), 0),
    }); 

    file_arr.push({
      Date: "",
      Particulars: "Dr",
      'Voucher Type': "Closing Balance",
      Desc: "",
      Debit: "",
      Credit: show_list.reduce((prev, next) => prev + parseInt(next.debit), 0)-show_list.reduce((prev, next) => prev + parseInt(next.credit), 0),
    }); 

    file_arr.push({
      Date: "",
      Particulars: "",
      'Voucher Type': "",
      Desc: "",
      Debit: show_list.reduce((prev, next) => prev + parseInt(next.debit), 0),
      Credit: show_list.reduce((prev, next) => prev + parseInt(next.credit), 0)+show_list.reduce((prev, next) => prev + parseInt(next.debit), 0)-show_list.reduce((prev, next) => prev + parseInt(next.credit), 0),
    }); 



    const header = Object.keys(file_arr[0]);
    for (var i = 0; i < header.length; i++) {
      // columns length added
      wscols.push({wch: header[i].length + 5});
    }

    var ws0 = XLSX.utils.json_to_sheet([
      { A: data2.company_name }
    ], {header: ["A",], skipHeader: true});
     
    /* Write data starting at A2 */
     const ws1 = XLSX.utils.sheet_add_json(ws0, [
      { A: data2.cust_address },
    ], {skipHeader: true, origin: "A2"});

    const ws2 = XLSX.utils.sheet_add_json(ws1, [
      { A: data2.cust_zip },
    ], {skipHeader: true, origin: "A3"});

    const ws3 = XLSX.utils.sheet_add_json(ws2, [
      { A: "Customer Ledger - "+data2.ledger_account },
    ], {skipHeader: true, origin: "A4"});


       const   ws = XLSX.utils.sheet_add_json(ws3,file_arr,{ origin: 'A7' });

       ws['!cols'] = wscols;
 

       console.log(ws);

 

    /* build new workbook */
    const wb = XLSX.utils.book_new();
   
    
     console.log(wb);
    XLSX.utils.book_append_sheet(wb, ws, 'SheetJS');

    /* write file */
    const wbout = XLSX.write(wb, {type: 'binary', bookType: 'xlsx'});

    // console.log("wbout",output(wbout))
    var date = new Date();

    const file =
      DDP +
      'CustomerLedger_' +
      Math.floor(date.getTime() + date.getSeconds() / 2) +
      '.xlsx';

    //writeFile(file, output(wbout), 'ascii').then((res) =>{
    writeFile(file, wbout, 'ascii')
      .then(res => {
        console.log('res', res);
        //    Alert.alert("exportFile success", "Exported to " + file);
        return appendFile(file, wbout, 'ascii');
      })
      .then(() => {
        RNFetchBlob.android.actionViewIntent(file, 'application/vnd.ms-excel');
      })
      .catch(err => {
        Alert.alert('exportFile Error', 'Error ' + err.message);
      });
  }

  _filterRender() {
    const {customer_value, customer_list} = this.state;

    return (
      <Modal
        transparent={true}
        animationType={'slide'}
        visible={this.state.filter}
        onRequestClose={() => {
          this.setState({filter: false});
        }}>
        <View style={{flex: 1}}>
          <ScrollView
            style={{backgroundColor: 'rgba(0,0,0,0.5)'}}
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: 'center',
              alignItems: 'center',
              padding: scale(5),
            }}>
            <View>
              <View
                style={{
                  backgroundColor: 'white',
                  borderRadius: scale(5),
                  width: scale(250),
                }}>
                <View
                  style={{
                    height: scale(40),
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: scale(15),
                      color: '#00B5FF',
                      fontWeight: '500',
                    }}
                    numberOfLines={1}>
                    Filter Search Result
                  </Text>
                </View>

                <View style={{height: scale(2), backgroundColor: '#00B5FF'}} />

                <View style={{padding: scale(5), alignItems: 'center'}}>
                  <Text
                    style={{fontSize: scale(12), width: scale(180)}}
                    numberOfLines={1}>
                    Customer Name :
                  </Text>
                  <View style={styles.userInput}>
                    <RNPickerSelect
                      placeholder={{
                        label: 'Select Customer',
                        value: '',
                      }}
                      items={customer_list}
                      onValueChange={customer_value =>
                        this.setState({customer_value})
                      }
                      value={customer_value}
                    />
                  </View>
                  <Text
                    style={{fontSize: scale(12), width: scale(180)}}
                    numberOfLines={1}>
                    Date From :
                  </Text>
                  <DatePicker
                    style={{width: scale(180), marginTop: scale(5)}}
                    date={this.state.start_date}
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
                      this.setState({start_date: date});
                    }}
                  />
                  <Text
                    style={{fontSize: scale(12), width: scale(180)}}
                    numberOfLines={1}>
                    Date To :
                  </Text>
                  <DatePicker
                    style={{width: scale(180), marginTop: scale(5)}}
                    date={this.state.end_date}
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
                      this.setState({end_date: date});
                    }}
                  />
                </View>

                <TouchableOpacity
                  onPress={() => {
                    if (
                      (this.state.customer_value != '') &
                      (this.state.start_date != '') &
                      (this.state.end_date != '')
                    ) {
                      this.onRefresh();
                    } else {
                      alert('Select Customer Name');
                    }
                  }}>
                  <View
                    style={{
                      backgroundColor: '#00B5FF',
                      height: scale(40),
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: scale(4),
                    }}>
                    <Text
                      style={{
                        fontSize: scale(18),
                        color: '#fff',
                        fontWeight: 'bold',
                      }}
                      numberOfLines={1}>
                      Apply
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    );
  }

  //refresh
  onRefresh() {
    const {network} = this.props;
    if (!network.isConnected) {
      Snackbar.show({
        text: msg.noInternet,
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: 'red',
      });
    } else {
      this.setState(
        {
          refresh: true,
          show_list: [],
          filter: false,
          loading: false,
        },
        () => {
          this.hit_customer_ledgerApi();
        },
      );
    }
  }

  hit_customer_ledgerApi() {
    const {user_id, user_type} = this.props;
    const {start_date, end_date, customer_value} = this.state;

    ArsolApi.Customer_Ledger_post_api(
      user_id,
      user_type,
      customer_value,
      start_date,
      end_date,
    )

      .then(responseJson => {
        console.log('Customer_Ledger_post_api', responseJson);

        if (responseJson.ok) {
          this.setState({
            loading: false,
            refresh: false,
          });

          if (responseJson.data != null) {
            if (responseJson.data.hasOwnProperty('status')) {
              if (responseJson.data.status == 'success') {
                if (responseJson.data.hasOwnProperty('message')) {
                  Snackbar.show({
                    text: responseJson.data.message,
                    duration: Snackbar.LENGTH_SHORT,
                    backgroundColor: Color.lgreen,
                  });

                  if (responseJson.data.hasOwnProperty('data')) {
                    if (responseJson.data.data.length > 0) {
                      this.setState({
                        show_list: [
                          ...this.state.show_list,
                          ...responseJson.data.data,

                        ],
                        data2:responseJson.data.data2
             
                      });
                    }
                  }
                }
              } else if (responseJson.data.status == 'failed') {
                if (responseJson.data.hasOwnProperty('message')) {
                  alert(responseJson.data.message);
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
              refresh: false,
            });
          } else if (responseJson.problem == 'TIMEOUT_ERROR') {
            Snackbar.show({
              text: msg.serTimErr,
              duration: Snackbar.LENGTH_SHORT,
              backgroundColor: Color.lgreen,
            });
            this.setState({
              loading: false,
              refresh: false,
            });
          } else {
            Snackbar.show({
              text: msg.servErr,
              duration: Snackbar.LENGTH_SHORT,
              backgroundColor: 'red',
            });
            this.setState({
              loading: false,
              refresh: false,
            });
          }
        }
      })
      .catch(error => {
        console.error(error);
        this.setState({
          loading: false,
          refresh: false,
        });
      });
  }

  _renderListItem(rowData, index) {
    console.log(rowData, index);
    return (
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
          marginHorizontal: scale(20),
          marginVertical: scale(10)
        }}
        key={index}>
        
         
            <Text style={{
              fontSize: scale(14), fontWeight: 'bold', fontStyle: 'italic',
              textTransform: 'capitalize'}} numberOfLines={1}>
              {rowData.item.particular}
            </Text>
          

         
            <Text style={styles.txt} numberOfLines={1}>
             Date: {rowData.item.date}
            </Text>
          

         

          
            <Text style={styles.txt} numberOfLines={1}>
            Voucher Type:{rowData.item.voucher}
            </Text>
          

          
            <Text style={styles.txt} numberOfLines={1}>
            Desc:{rowData.item.description}
            </Text>
         
        <View style={{
          borderRadius: scale(3),
          borderColor: '#73C6B6',
          padding: scale(5),
       
         
          borderWidth: scale(1),
          borderRadius: scale(10),
          marginTop: scale(5)

        }}>
        <View style={{flexDirection:'row',
        width:'75%',
        justifyContent: 'space-between',

        }}>
            <Text numberOfLines={1}>
              Debit
          </Text>
            <Text numberOfLines={1}>
              {rowData.item.debit}
            </Text>
        </View>
        
 <View style={{flexDirection:'row',
        
        justifyContent: 'space-between',

        }}>
            <Text numberOfLines={1}>
              Credit
          </Text>

            <Text numberOfLines={1}>
              {rowData.item.credit}
            </Text>

        </View>
          
        </View>
          
            
          

          
          
          
       
      </View>
    );
  }

  FlatListItemSeparator = () => {
    return (
      <View
        style={{
          height: scale(5),
          width: '100%',
          
        }}
      />
    );
  };

  renderHeader(){
    const {data2}=this.state
    var header_View =(
      <View
        style={{width:'100%',
                alignItems:"center",
                borderBottomColor:'#000',
                borderBottomWidth:scale(1),
                padding:scale(5)
                }}
      >


            <Text style={{fontSize:scale(12),color:'#000',fontWeight:'bold'}}>{data2.company_name}</Text>
            <Text style={{fontSize:scale(12),color:'#000',}}>{data2.cust_address}</Text>
            <Text style={{fontSize:scale(12),color:'#000',}}>{data2.cust_zip}</Text>
            <View style={{flexDirection:"row"}}>
            <Text style={{fontSize:scale(12),color:'#000',}}>Ledger Account - </Text>
            <Text style={{fontSize:scale(12),color:'#000',fontWeight:'bold'}}> {data2.ledger_account}</Text>
            </View>

           

      </View>
    )

    return header_View;
  }

   // 
   renderNext(){
    const {
    show_list
    }=this.state


    var footer_View = (
  
        <View
          style={{
            width: '100%',
            alignSelf: 'center',

            borderTopWidth: 1,
            borderLeftWidth: 1,
            borderRightWidth: 1,
            borderBottomWidth:1,
            borderTopLeftRadius: scale(7),
            borderTopRightRadius: scale(7),
            borderColor: 'grey',
            padding: scale(3),
          
    
          
          }}>
          
          
            <View style={{margin:scale(3)}}>

            <View style={{flexDirection:'row',justifyContent:'space-between',alignSelf:'flex-end',width:scale(100)}}>
            <Text style={{fontSize:scale(12),color:'#000',fontWeight:'bold'}}>Debit</Text>
            <Text style={{fontSize:scale(12),color:'#000',fontWeight:'bold'}}>Credit</Text>
            </View>
            <View style={{height:scale(1),backgroundColor:"#000"}}/>
            <View style={{flexDirection:'row',justifyContent:'space-between',alignSelf:'flex-end',width:scale(100)}}>
            <Text style={{fontSize:scale(12),color:'#000',fontWeight:'bold'}}> {show_list.reduce((prev, next) => prev + parseInt(next.debit), 0)}</Text>
            <Text style={{fontSize:scale(12),color:'#000',fontWeight:'bold'}}> {show_list.reduce((prev, next) => prev + parseInt(next.credit), 0)}</Text>
            </View>

            <View style={{flexDirection:'row',justifyContent:'space-between',}}>
            <Text style={{fontSize:scale(12),color:'#000',fontWeight:'bold'}}>Dr Closing Balance </Text>
                <View style={{flexDirection:'row',justifyContent:'space-between',alignSelf:'flex-end',width:scale(100)}}>
            <Text> </Text>
            <Text style={{fontSize:scale(12),color:'#000',fontWeight:'bold'}}>{show_list.reduce((prev, next) => prev + parseInt(next.debit), 0)-show_list.reduce((prev, next) => prev + parseInt(next.credit), 0)}</Text>
            </View>
            </View>

            <View style={{height:scale(1),backgroundColor:"#000"}}/>
            <View style={{flexDirection:'row',justifyContent:'space-between',alignSelf:'flex-end',width:scale(100)}}>
            <Text style={{fontSize:scale(12),color:'#000',fontWeight:'bold'}}> {show_list.reduce((prev, next) => prev + parseInt(next.debit), 0)}</Text>
            <Text style={{fontSize:scale(12),color:'#000',fontWeight:'bold'}}>{show_list.reduce((prev, next) => prev + parseInt(next.credit), 0)+show_list.reduce((prev, next) => prev + parseInt(next.debit), 0)-show_list.reduce((prev, next) => prev + parseInt(next.credit), 0)}</Text>
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
          }}>Customer Ledger</Text>

          <TouchableHighlight
            activeOpacity={1}
            underlayColor={'#ddd'}
            onPress={() => { this.printHTML() }}
            style={{
              position: "absolute", right:35, width: scale(40), height: scale(40),
              alignItems: "center",
              justifyContent: 'center',
              borderRadius: scale(20)
            }}
          >

            <Image source={Images.print} style={{
              width: scale(20), height: scale(20),


            }} />

          </TouchableHighlight>

          <TouchableHighlight
            activeOpacity={1}
            underlayColor={'#ddd'}
            onPress={() => { this.setState({ filter: true }) }}
            style={{
              position: "absolute", right: 0, width: scale(40), height: scale(40),
              alignItems: "center",
              justifyContent: 'center',
              borderRadius: scale(20)
            }}
          >

            <Image source={Images.filterw} style={{
              width: scale(20), height: scale(20),


            }} />

          </TouchableHighlight>
        </View>

      </View>

    )
  }

  _handleAdd(item) {
    const { navigation, network } = this.props;


    if (item == 'print') {
      this.printHTML()

    } else if (item == 'export') {
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
          bottom: 250,
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
 const{show_list}=this.state
    const actions = [
      {
        text: 'Print pdf',
        icon: Images.print,
        name: 'print',
        position: 1,
        textStyle: { fontSize: scale(10) },
        buttonSize: scale(30),
        textContainerStyle: {
          height: scale(30),
          alignItems: 'center',
          justifyContent: 'center',
        },
      },
      {
        text: 'Export Excel',
        icon: Images.file,
        name: 'export',

        position: 2,
        textStyle: { fontSize: scale(10) },
        buttonSize: scale(30),
        textContainerStyle: {
          height: scale(30),
          alignItems: 'center',
          justifyContent: 'center',
        },
      },

    ];

    return (
      <View style={{
        justifyContent: "center", flex: 1,
        backgroundColor: "#fff"}}>
      
        <LogoSpinner loading={this.state.loading} />

        {this._filterRender()}
  
        <FlatList
        
          contentContainerStyle={{ paddingBottom: scale(5), flexGrow: 1 }}
            
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={this.renderHeader.bind(this)}
          stickyHeaderIndices={[0]}
       
          keyExtractor={(item, index) => index.toString()}
          data={this.state.show_list}
          ItemSeparatorComponent={this.FlatListItemSeparator}
          renderItem={item => this._renderListItem(item)}
          bounces={false}
          extraData={this.state}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refresh}
              onRefresh={this.onRefresh.bind(this)}
            />
          }
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
                    }}>
                    No Record Found
                  </Text>
                </View>
              ) : null}
            </View>
          }
          //pagination

        //  ListFooterComponent={show_list.length > 0 ? this.renderNext() : null}
          
          //     onEndReachedThreshold={0.01}
          //     onMomentumScrollBegin={() => this._onMomentumScrollBegin()}
          //     onEndReached={this.handleLoadMore.bind(this)}
        />


        
        {show_list.length > 0 ? this.renderNext() : null}
        {show_list.length > 0 ? this.renderFOB() : null}

      </View>
    );
  }
}

const styles = StyleSheet.create({
  txt: { fontSize: scale(12) },


  userInput: {
    height: scale(40),
    backgroundColor: 'white',

    borderColor: 'grey',
    borderWidth: scale(1),
    width: scale(180),
  },

  input: {
    color: '#000',

    width: '73%',
    fontSize: scale(12),
  },
});

CustomerLedgerScreen.defaultProps = {
  user_id: '',
  user_type: '',
};

const mapStateToProps = state => {
  return {
    user_id: state.user.id,
    user_type: state.user.type,
    network: state.network,
  };
};

export default connect(
  mapStateToProps,
  null,
)(CustomerLedgerScreen);
