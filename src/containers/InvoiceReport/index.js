import React, { PureComponent, Fragment } from "react";
import {
  View, TouchableHighlight, Dimensions,ImageBackground
  , Animated,Keyboard,

  Text, Modal, ScrollView, TextInput, PermissionsAndroid,
  StyleSheet, FlatList, TouchableOpacity, Alert, RefreshControl, Image, ActivityIndicator
} from 'react-native';

import { connect } from "react-redux";
import { Config, Color, Images } from '@common';


import { scale } from "react-native-size-matters";
import { StackActions } from '@react-navigation/native';

const msg = Config.SuitCRM;
import { NavigationBar } from '@components';


import Checkbox from 'react-native-modest-checkbox'
import DatePicker from 'react-native-datepicker';
import ArsolApi from '@services/ArsolApi';
import { LogoSpinner } from '@components';
import Snackbar from 'react-native-snackbar';
import moment from 'moment';
import XLSX from 'xlsx';
import {
  writeFile, appendFile,
  DownloadDirectoryPath, DocumentDirectoryPath
} from 'react-native-fs';
const DDP = DocumentDirectoryPath + "/";
import RNFetchBlob from 'rn-fetch-blob';
import RNPrint from 'react-native-print';
import { FloatingAction } from 'react-native-floating-action';
import * as Animatable from 'react-native-animatable';
import Accordion from 'react-native-collapsible/Accordion';

class InvoiceReportScreen extends PureComponent {


  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      refresh: false,
      load_more: false,
      onEndReachedCalledDuringMomentum: true,
      page: 0,
      show_list: [],

      display_name: '',
      invoice_number: '',
      ch_all: false,
      ch_invoice:true,
      ch_invoice_no: false,
      ch_display_name: false,
      start_date: moment(new Date()).format('DD/MM/YYYY'),
      end_date: moment(new Date()).format('DD/MM/YYYY'),
      focus:false,






       filter_type:1

    }

  }

  componentDidMount() {
    const { network } = this.props;

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
  
          display_name: '',
          invoice_number: '',
          ch_all: false,
          ch_invoice: true,
          ch_invoice_no: false,
          ch_display_name: false,
          start_date: moment(new Date()).format('DD/MM/YYYY'),
          end_date: moment(new Date()).format('DD/MM/YYYY'),

         filter_type: 1,
          focus: false,
        
        }, () => {



          this.hit_invoicereportsApi()

        })
      }
    })
  
  }

  renderTableHeader() {

    var header = ["Invoice Date",
      "Invoice Number",
      "Customer Name",
      "Customer GSTIN",
      "Taxable Value",
      "IGST",
      "CGST",
      "SGST",
      "Total Invoice Value (INR)"
    ]

    return header.map((key, index) => {
      return (`<th>${key}</th>`)

    })
  }

  renderTableData() {
    return this.state.show_list.map((student, index) => {
      const { in_date, in_no, in_dis_name, in_gst, in_taxable,
        in_igst, in_cgst, in_sgst, total_amount } = student //destructuring


      return (
        `<tr key=${index}>
           <td>${in_date}</td>
           <td>${in_no}</td>
           <td>${in_dis_name}</td>
           <td>${in_gst}</td>
           <td>${in_taxable}</td>
           <td>${in_igst}</td>
           <td>${in_cgst}</td>
           <td>${in_sgst}</td>
           <td>${total_amount}</td>
        </tr>`
      )
    })
  }




  //print
  async printHTML() {

    let html_content =
      `<html>
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
    
    #students tr:nth-child(even){background-color: #f2f2f2;}
    
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
          <h1 id='title'>React Dynamic Table</h1>
          <table id='students'>
             <tbody>
                
             <tr>${this.renderTableHeader()}</tr>

                ${this.renderTableData()}
             </tbody>
          </table>
       </div>`



    await RNPrint.print({
      html: html_content.replace(/,/g, "")

    })
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
    const { show_list } = this.state;

    var file_arr = []
    var wscols = [];
    for (var i = 0; i < show_list.length; i++) {


      file_arr.push({
        "Invoice Date": show_list[i].in_date.replace("T00:00:00", ""),
        "Invoice Number": show_list[i].in_no,
        "Customer Name": show_list[i].in_dis_name,
        "Customer GSTIN": show_list[i].in_gst,
        "Taxable Value": show_list[i].in_taxable,
        "IGST": show_list[i].in_igst,
        "CGST": show_list[i].in_cgst,
        "SGST": show_list[i].in_sgst,
        "Total Invoice Value (INR)": show_list[i].total_amount,
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
    const wbout = XLSX.write(wb, { type: 'binary', bookType: "xlsx", });


    // console.log("wbout",output(wbout))
    var date = new Date();

    const file = DDP + "InvoiceReports_" + Math.floor(date.getTime()
      + date.getSeconds() / 2) + ".xlsx";


    //writeFile(file, output(wbout), 'ascii').then((res) =>{
    writeFile(file, wbout, 'ascii')
      .then((res) => {
        console.log("res", res)
        //    Alert.alert("exportFile success", "Exported to " + file);
        return appendFile(file, wbout, 'ascii');
      })
      .then(() => {
        RNFetchBlob.android.actionViewIntent(file, "application/vnd.ms-excel")
      })
      .catch((err) => { Alert.alert("exportFile Error", "Error " + err.message); });






  };

  filter_fun() {

    const { ch_all, ch_invoice, ch_invoice_no, ch_display_name } = this.state
    if (ch_all) {
      return 0
    } else if (ch_invoice) {
      return 1
    } else if (ch_invoice_no) {
      return 2
    } else if (ch_display_name) {
      return 3
    } else {
      return 0
    }
  }

  _checkbox_fun(val) {
    if (val == "0") {
      this.setState({
        ch_all: true,
        ch_invoice: false,
        ch_invoice_no: false,
        ch_display_name: false,
        display_name: '',
        invoice_number: '',
        start_date: moment(new Date()).format('DD/MM/YYYY'),
        end_date: moment(new Date()).format('DD/MM/YYYY'),
        focus:false,
      })
    } else if (val == "1") {
      this.setState({
        ch_all: false,
        ch_invoice: true,
        ch_invoice_no: false,
        ch_display_name: false,
        display_name: '',
        invoice_number: '',
        focus:false,

      })
    }
    else if (val == "2") {
      this.setState({
        ch_all: false,
        ch_invoice: false,
        ch_invoice_no: true,
        ch_display_name: false,
        display_name: '',

        start_date: moment(new Date()).format('DD/MM/YYYY'),
        end_date: moment(new Date()).format('DD/MM/YYYY'),
        focus:false,
      })
    }
    else if (val == "3") {
      this.setState({
        ch_all: false,
        ch_invoice: false,
        ch_invoice_no: false,
        ch_display_name: true,

        invoice_number: '',
        start_date: moment(new Date()).format('DD/MM/YYYY'),
        end_date: moment(new Date()).format('DD/MM/YYYY'),
        focus: false,
      })
    }
  }


  //refresh
  onRefresh() {
    Keyboard.dismiss()
    const { network } = this.props
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
          load_more: false,
          page: 0,
          show_list: [],
        },
        () => {
          this.hit_invoicereportsApi();
        },
      );
    }

  }

  hit_invoicereportsApi() {
    const { user_id, user_type } = this.props
    const { page, start_date, end_date, invoice_number, display_name } = this.state
    var filter_type = this.filter_fun()
     this.setState({filter_type:filter_type})
    ArsolApi.InvoiceReports_api(user_id, user_type,
      filter_type,
      start_date,
      end_date,
      invoice_number,
      display_name,
      page
    )

      .then(responseJson => {
        console.log('InvoiceReports_api', responseJson);

        if (responseJson.ok) {
          this.setState({
            loading: false,
            refresh: false
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

                  if (responseJson.data.hasOwnProperty("data")) {
                    if (responseJson.data.data.length > 0) {
                      this.setState({
                        show_list: [...this.state.show_list, ...responseJson.data.data],
                        load_more: responseJson.data.load_more
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

 


  //scroll
  _onMomentumScrollBegin = () => this.setState({
    onEndReachedCalledDuringMomentum: false
  });
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
            this.hit_invoicereportsApi();
          },
        );
      }
    }
  };

  GetItem(id) {
    alert(id)
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
        >{rowData.item.in_date}</Text>
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
        >{rowData.item.in_no}</Text>
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
        >{rowData.item.in_dis_name}</Text>
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
        >{rowData.item.in_gst}</Text>
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
        >{rowData.item.in_taxable}</Text>
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
        >{rowData.item.in_igst}</Text>
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
        >{rowData.item.in_cgst}</Text>
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
        >{rowData.item.in_sgst}</Text>
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
        >{rowData.item.total_amount}</Text>
        
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
              height: scale(30),
              width: scale(40),


            }}
            onPress={() => { this.props.navigation.navigate('InvoiceReportDetail') }}
         >
            <Text style={{ color: "#fff", fontSize: scale(10) }}>View</Text>
          </TouchableOpacity>

        </View>

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
              backgroundColor: "#0095DF",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: scale(5),
              height: scale(30),
              width: scale(60),


            }}
            onPress={() => {
              this.props.navigation.navigate('InvoiceOne', {
                EditId: rowData.item.in_id
              })
            }}
          >
            <Text style={{ color: "#fff", fontSize: scale(10) }}>Re-print</Text>
          </TouchableOpacity>

        </View>




      </View>






    )
  }


  



 

  //footer
  renderFooter = () => {
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

                textAlignVertical: 'center',
                borderColor: '#ddd',
                borderRightWidth: scale(1),
                textAlign: 'right'
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
              >{this.state.show_list.reduce((prev, next) =>
                prev + parseInt(next.in_taxable), 0)}</Text>
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
              >{this.state.show_list.reduce((prev, next) =>
                prev + parseInt(next.in_igst), 0)}</Text>
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
              >{this.state.show_list.reduce((prev, next) =>
                prev + parseInt(next.in_cgst), 0)}</Text>
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
              >{this.state.show_list.reduce((prev, next) =>
                prev + parseInt(next.in_sgst), 0)}</Text>
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
              >{this.state.show_list.reduce((prev, next) =>
                prev + parseInt(next.total_amount), 0)}</Text>
             

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

              }}
                numberOfLines={2}
              ></Text>


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
        >Invoice Report</Text>

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
        >Customer GSTIN</Text>
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
        >Taxable Value</Text>
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
        >IGST</Text>
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
        >CGST</Text>
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
        >SGST</Text>
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
        >Total Invoice Value (INR)</Text>
       
        <Text style={{

          padding: scale(10),
          width: scale(100),
          fontWeight: 'bold',
          fontSize: scale(12),

        }}
          numberOfLines={2}
        ></Text>

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



  render() {
    const { focus,ch_display_name, ch_invoice, ch_invoice_no, ch_all,
       invoice_number, display_name,filter_type } = this.state;



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

                  >Invoice Date</Text>
                </TouchableOpacity>

                <TouchableOpacity>
                  <Text
                    style={{
                      padding: scale(5),
                      borderColor: '#000',
                      borderWidth: scale(1),

                      textAlign: 'center',

                      fontSize: scale(10),
                      backgroundColor: ch_invoice_no ? Color.headerTintColor : '#ccc',
                      color: ch_invoice_no ? '#fff' : '#000',
                      maxWidth: scale(100),
                      borderRadius: scale(5),
                      marginLeft: scale(5)

                    }}
                    numberOfLines={1}
                    onPress={() => { this._checkbox_fun(2) }}
                  >Invoice Number</Text>
                </TouchableOpacity>


              </View>

              <TouchableOpacity>
                <Text
                  style={{
                    padding: scale(5),
                    borderColor: '#000',
                    borderWidth: scale(1),

                    textAlign: 'center',

                    fontSize: scale(10),
                    backgroundColor: ch_display_name ? Color.headerTintColor : '#ccc',
                    color: ch_display_name ? '#fff' : '#000',
                    width: scale(150),
                    borderRadius: scale(5)

                  }}
                  numberOfLines={1}
                  onPress={() => { this._checkbox_fun(3) }}
                >Customer Name</Text>
              </TouchableOpacity>

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
                      <View style={[styles.userInput,
                      {
                        borderColor:
                          focus ?
                            Color.headerTintColor
                            :
                            '#000',
                      }
                      ]}>
                      <TextInput
                        placeholder='Number'
                        style={styles.input}
                        autoCorrect={false}
                        autoCapitalize={'none'}
                        underlineColorAndroid="transparent"
                        onChangeText={invoice_number => this.setState({ invoice_number })}
                        value={invoice_number}
                          returnKeyLabel={'search'}
                          returnKeyType={'search'}
                          onSubmitEditing={() => {

                            this.onRefresh()

                          }}


                          onBlur={() => {
                            this.setState({ focus: false })
                          }}

                          onFocus={() => {
                            this.setState({ focus: true })
                          }}
                      />
                    </View> : null
                }

                {ch_display_name ?
                    <View style={[styles.userInput,
                    {
                      borderColor:
                        focus ?
                          Color.headerTintColor
                          :
                          '#000',
                    }
                    ]}>
                    <TextInput
                      placeholder='Name'
                      style={styles.input}
                      autoCorrect={false}
                      autoCapitalize={'none'}
                      underlineColorAndroid="transparent"
                      onChangeText={display_name => this.setState({ display_name })}
                      value={display_name}
                       returnKeyLabel={'search'}
                          returnKeyType={'search'}
                          onSubmitEditing={() => {

                            this.onRefresh()

                          }}


                          onBlur={() => {
                            this.setState({ focus: false })
                          }}

                          onFocus={() => {
                            this.setState({ focus: true })
                          }}
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
              {filter_type==0 ? "All Records" :
                  filter_type==1 ? "Date between " + this.state.start_date + " and " + this.state.end_date :
                    filter_type==2 ? "Invoice number " + invoice_number :
                      filter_type==3 ? "Customer name " + display_name :
                        ""
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




InvoiceReportScreen.defaultProps = {
  user_id: '',
  user_type: ''
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
)(InvoiceReportScreen);