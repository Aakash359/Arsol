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
  ActivityIndicator,TouchableHighlight,ImageBackground,Dimensions
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
     

      pdf_data: [],
    };
  }

  componentDidMount() {
    const {network} = this.props;
    this._subscribe = this.props.navigation.addListener('focus', () => {
      if (!network.isConnected) {
        Snackbar.show({
          text: msg.noInternet,
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: 'red',
        });
      } else {
        this.setState({ loading: true,
          refresh: false,
          onEndReachedCalledDuringMomentum: true,
          show_list: [],
          data2: '',
          customer_list: [],
          customer_value: '',
          start_date: moment(new Date()).format('DD/MM/YYYY'),
          end_date: moment(new Date()).format('DD/MM/YYYY'),


          pdf_data: [],
        }, () => {
          this.hit_CompanyNameApi();

        });
      }

    })
   
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
          loading: false,
          data2: '',
          pdf_data: [],
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




  //footer
  renderFooter = () => {
    const {show_list} = this.state
   
    if (this.state.show_list.length > 0)
    return (
      <View>

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

            }}
              numberOfLines={2}
        >{show_list.reduce((prev, next) => prev + parseInt(next.debit), 0)}</Text>
            <Text style={{

              padding: scale(10),
              width: scale(100),
              fontWeight: 'bold',
              fontSize: scale(12),
              textAlign: 'center',
              textAlignVertical: 'center',

            }}
              numberOfLines={2}
        >{show_list.reduce((prev, next) => prev + parseInt(next.credit), 0)}</Text>

     </View>
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

          }}
            numberOfLines={2}
          >Dr</Text>
          <Text style={{

            padding: scale(10),
            width: scale(100),
            fontWeight: 'bold',
            fontSize: scale(12),
            textAlign: 'center',
            textAlignVertical: 'center',

          }}
            numberOfLines={2}
          >Closing Balance</Text>
          <Text style={{

            padding: scale(10),
            width: scale(100),
            fontWeight: 'bold',
            fontSize: scale(12),
            textAlign: 'center',
            textAlignVertical: 'center',

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

          }}
            numberOfLines={2}
          >{show_list.reduce((prev, next) => prev + parseInt(next.debit), 0) - show_list.reduce((prev, next) => prev + parseInt(next.credit), 0)}</Text>

        </View>
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

          }}
            numberOfLines={2}
          >{show_list.reduce((prev, next) => prev + parseInt(next.debit), 0)}</Text>
          <Text style={{

            padding: scale(10),
            width: scale(100),
            fontWeight: 'bold',
            fontSize: scale(12),
            textAlign: 'center',
            textAlignVertical: 'center',

          }}
            numberOfLines={2}
          >{show_list.reduce((prev, next) => prev + parseInt(next.credit), 0) + show_list.reduce((prev, next) => prev + parseInt(next.debit), 0) - show_list.reduce((prev, next) => prev + parseInt(next.credit), 0)}</Text>

        </View>
          </View>
            )
    return (<View style={{ marginBottom: scale(100), }} />)

   
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
          width: scale(200),
          alignSelf: 'center'
        }}
      >
        <Text style={{
          fontSize: scale(18),
          color: '#000',

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

        }}
          numberOfLines={2}
        >Date</Text>

        <Text style={{

          padding: scale(10),
          width: scale(100),
          fontWeight: 'bold',
          fontSize: scale(12),
          textAlign: 'center',
          textAlignVertical: 'center',
    
        }}
          numberOfLines={2}
        >Particulars</Text>
        <Text style={{

          padding: scale(10),
          width: scale(100),
          fontWeight: 'bold',
          fontSize: scale(12),
          textAlign: 'center',
          textAlignVertical: 'center',
     
        }}
          numberOfLines={2}
        >Voucher Type</Text>
        <Text style={{

          padding: scale(10),
          width: scale(100),
          fontWeight: 'bold',
          fontSize: scale(12),
          textAlign: 'center',
          textAlignVertical: 'center',
  
        }}
          numberOfLines={2}
        >Desc</Text>
        <Text style={{

          padding: scale(10),
          width: scale(100),
          fontWeight: 'bold',
          fontSize: scale(12),
          textAlign: 'center',
          textAlignVertical: 'center',
       
        }}
          numberOfLines={2}
        >Debit</Text>
        <Text style={{

          padding: scale(10),
          width: scale(100),
          fontWeight: 'bold',
          fontSize: scale(12),
          textAlign: 'center',
          textAlignVertical: 'center',
         
        }}
          numberOfLines={2}
        >Credit</Text>

        




      </View>
    )
  }
  _renderListItem(rowData, index) {
    
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
 
        }}
          numberOfLines={2}
        >{rowData.item.date}</Text>
        <Text style={{
          padding: scale(10),
          width: scale(100),
          fontSize: scale(12),
          textAlign: 'center',
          textAlignVertical: 'center',
   
        }}
          numberOfLines={2}
        >{rowData.item.particular}</Text>
        <Text style={{
          padding: scale(10),
          width: scale(100),
          fontSize: scale(12),
          textAlign: 'center',
          textAlignVertical: 'center',
       
        }}
          numberOfLines={2}
        >{rowData.item.voucher}</Text>
        <Text style={{
          padding: scale(10),
          width: scale(100),
          fontSize: scale(12),
          textAlign: 'center',
          textAlignVertical: 'center',
  
        }}
          numberOfLines={2}
        >{rowData.item.description}</Text>

        <Text style={{
          padding: scale(10),
          width: scale(100),
          fontSize: scale(12),
          textAlign: 'center',
          textAlignVertical: 'center',
  
        }}
          numberOfLines={2}
        >{rowData.item.debit}</Text>

        <Text style={{
          padding: scale(10),
          width: scale(100),
          fontSize: scale(12),
          textAlign: 'center',
          textAlignVertical: 'center',

        }}
          numberOfLines={2}
        >{rowData.item.credit}</Text>

      

      </View>






    )
  }



  render() {
    const { customer_list,customer_value ,data2} = this.state;



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
                    width: scale(100)
                  }}
                    numberOfLines={2}
                  >Customer Name:</Text>

                  <View style={styles.userInput}>
                    <RNPickerSelect
                      placeholder={{
                        label: "Select Customer Name",
                        value: "",
                        color: 'black',
                        fontSize: scale(12),
                        fontWeight: 'bold',
                      }}
                      style={{
                        inputIOS: styles.inputIOS,
                        inputAndroid: styles.inputAndroid,
                      }}
                      items={customer_list}
                      onValueChange={customer_value =>
                        this.setState({ customer_value })
                      }
                      value={customer_value}
                    />
                  </View>

                 

                 




                </View>



                <View style={{
                  flexDirection: 'row',
                  marginTop: scale(5),

                  alignItems: "center"
                }}>

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


              







              </View>

              {this.state.show_list.length>0?
              
                <View style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  padding: scale(10)
                }}>
                  <Text style={{
                    width: scale(200),
                    textAlign: 'center',
                    fontSize: scale(12),
                    fontWeight: 'bold'
                  }}
                    numberOfLines={2}
                  >{data2.company_name}</Text>

                  <Text style={{
                    width: scale(200),
                    textAlign: 'center',
                    fontSize: scale(12),

                  }}
                    numberOfLines={2}
                  >{data2.cust_address}</Text>

                  <Text style={{
                    width: scale(200),
                    textAlign: 'center',
                    fontSize: scale(12),

                  }}
                    numberOfLines={2}
                  >{data2.cust_zip}</Text>


                  <Text style={{
                    width: scale(200),
                    textAlign: 'center',
                    fontSize: scale(12),

                  }}
                    numberOfLines={2}
                  >Leader Account-{data2.ledger_account}</Text>



                  <Text style={{
                    width: scale(200),
                    textAlign: 'center',
                    fontSize: scale(12),

                  }}
                    numberOfLines={2}
                  >{this.state.start_date} to {this.state.end_date}</Text>

                </View>
              :null
              
              }

             





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


                        }}>{this.state.customer_value!=""?
                            "No Data Found..!!" : "Please select Customer..!!"
                           }</Text>
                      ) : null}
                    </View>
                  }
                  //pagination

                  ListFooterComponent={this.renderFooter.bind(this)}
                  onEndReachedThreshold={0.01}
            
                />

              </ScrollView>









            </View>





          </View>

          {
            this.state.show_list.length>0?
            <View
            style={{
            flexDirection: "row",
            justifyContent: 'space-between',
            width: scale(250),
            alignSelf: "center"

          }}
          >
            <TouchableOpacity
            onPress={() => {

              if (this.state.show_list.length > 0) {
                this.printHTML()
              } else {
                alert("No Record Found")
              }
            }}
            style={{
              width: scale(100),
              height: scale(40),
              borderRadius: scale(10),
              backgroundColor: Color.headerTintColor,
              justifyContent: 'center',
              alignItems: 'center'
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
            >Print</Text>
          </TouchableOpacity>

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
              alignItems: 'center'
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


        </View>:null
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
    width: scale(150),
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
