import React, { PureComponent, Fragment } from "react";
import {
  View, TouchableHighlight, TouchableWithoutFeedback, Animated,

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
      filter: false,
      display_name: '',
      invoice_number: '',
      ch_all: true,
      ch_invoice: false,
      ch_invoice_no: false,
      ch_display_name: false,
      start_date: moment(new Date()).format('DD/MM/YYYY'),
      end_date: moment(new Date()).format('DD/MM/YYYY'),


      pdf_data: [],

      activeSections: [],

    }

  }

  componentDidMount() {
    const { network } = this.props;


    if (!network.isConnected) {
      Snackbar.show({
        text: msg.noInternet,
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: "red"
      });
    } else {
      this.setState({ loading: true }, () => {



        this.hit_invoicereportsApi()

      })
    }
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
    if (val.label == "All") {
      this.setState({
        ch_all: true,
        ch_invoice: false,
        ch_invoice_no: false,
        ch_display_name: false,
        display_name: '',
        invoice_number: '',
        start_date: moment(new Date()).format('DD/MM/YYYY'),
        end_date: moment(new Date()).format('DD/MM/YYYY'),
      })
    } else if (val.label == "Invoice Date") {
      this.setState({
        ch_all: false,
        ch_invoice: true,
        ch_invoice_no: false,
        ch_display_name: false,
        display_name: '',
        invoice_number: '',

      })
    }
    else if (val.label == "Invoice Number") {
      this.setState({
        ch_all: false,
        ch_invoice: false,
        ch_invoice_no: true,
        ch_display_name: false,
        display_name: '',

        start_date: moment(new Date()).format('DD/MM/YYYY'),
        end_date: moment(new Date()).format('DD/MM/YYYY'),
      })
    }
    else if (val.label == "Customer Name") {
      this.setState({
        ch_all: false,
        ch_invoice: false,
        ch_invoice_no: false,
        ch_display_name: true,

        invoice_number: '',
        start_date: moment(new Date()).format('DD/MM/YYYY'),
        end_date: moment(new Date()).format('DD/MM/YYYY'),
      })
    }
  }

  _filterRender() {
    const { ch_display_name, ch_invoice, ch_invoice_no, ch_all } = this.state;
    return (
      <Modal
        transparent={true}
        animationType={'slide'}
        visible={this.state.filter}
        onRequestClose={() => {
          this.setState({ filter: false });
        }}>
        <View style={{ flex: 1 }}>



          <ScrollView style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: 'center',
              alignItems: "center",
              padding: scale(5)
            }}
            enableOnAndroid={true}
            keyboardShouldPersistTaps="handled"
          >


            <View>


              <View style={{
                backgroundColor: 'white',
                borderRadius: scale(5),
                width: scale(250),

              }}>
                <View style={{
                  height: scale(40),
                  justifyContent: 'center', alignItems: 'center'
                }}>
                  <Text style={{ fontSize: scale(15), color: "#00B5FF", fontWeight: '500' }}
                    numberOfLines={1}
                  >Filter Search Result</Text>
                </View>

                <View style={{ height: scale(2), backgroundColor: "#00B5FF", }} />

                <View style={{ padding: scale(5) }}>
                  <Checkbox
                    label='All'
                    checked={ch_all}
                    onChange={(checked) => this._checkbox_fun(checked)}
                    labelStyle={{ fontSize: scale(15), }}
                    checkboxStyle={{ width: scale(30), height: scale(30) }}

                  />
                  <Checkbox
                    label='Invoice Date'
                    checked={ch_invoice}
                    onChange={(checked) => this._checkbox_fun(checked)}
                    labelStyle={{ fontSize: scale(15), }}
                    checkboxStyle={{ width: scale(30), height: scale(30) }}

                  />
                  {
                    ch_invoice ?
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
                          onDateChange={(date) => { this.setState({ start_date: date }) }}

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
                          onDateChange={(date) => { this.setState({ end_date: date }) }}

                        />
                      </View>
                      : null
                  }


                  <Checkbox
                    label='Invoice Number'
                    checked={ch_invoice_no}
                    onChange={(checked) => this._checkbox_fun(checked)}
                    labelStyle={{ fontSize: scale(15), }}
                    checkboxStyle={{ width: scale(30), height: scale(30) }}
                  />
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
                          value={this.state.invoice_number}
                        />
                      </View> : null
                  }

                  <Checkbox
                    label='Customer Name'
                    checked={ch_display_name}
                    onChange={(checked) => this._checkbox_fun(checked)}
                    labelStyle={{ fontSize: scale(15), }}
                    checkboxStyle={{ width: scale(30), height: scale(30) }}

                  />
                  {ch_display_name ?
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
                    </View> : null
                  }
                </View>





                <TouchableOpacity
                  onPress={() => {
                    this.setState({ filter: false }, () => {
                      this.onRefresh()
                    })
                  }}
                >
                  <View style={{
                    backgroundColor: "#00B5FF", height: scale(40), alignItems: "center",
                    justifyContent: 'center',
                    borderRadius: scale(4),

                  }}>
                    <Text style={{ fontSize: scale(18), color: "#fff", fontWeight: 'bold' }}
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

  async printHTML(html_content) {
    await RNPrint.print({
      html: html_content
    })
  }

  //Reprint Invoice View Api

  hit_Reprint(invoice_id) {
    const { user_id, user_type, } = this.props
    const { page, start_date, end_date, invoice_number, display_name } = this.state
    ArsolApi.Reprint_post_api(user_id, user_type,

    )

      .then(responseJson => {
        console.log('Reprint_post_api', responseJson);

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
                      // Works on both Android and iOS
                      Alert.alert(
                        'New Estimate',
                        responseJson.data.message,
                        [

                          {
                            text: 'Cancel',
                            onPress: () => console.log('Cancel Pressed'),
                            style: 'cancel'
                          },
                          {
                            text: 'Print', onPress: () => {

                              this.printHTML(responseJson.data.data[0].html)
                            }
                          }
                        ],
                        { cancelable: false }
                      );

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




  //footer
  renderFooter = () => {
    if (!this.state.load_more) return <View style={{ marginBottom: scale(100), }}></View>;
    return (
      <View style={{ marginTop: scale(10), }}>
        <ActivityIndicator size="large" color="#ddd" />
      </View>
    );
  };

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
          }}>Invoice Report</Text>
          

          <TouchableHighlight
            activeOpacity={1}
            underlayColor={'#ddd'}
            onPress={() => { this.printHTML() }}
            style={{
              position: "absolute", right: 35, width: scale(40), height: scale(40),
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
          bottom: 100,
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
      //  transition="backgroundColor"
      >
        <TouchableOpacity
          // key={index}
          onPress={() => { this.props.navigation.navigate('InvoiceReportDetail') }}>
          <Text style={{
            fontSize: scale(14), fontWeight: 'bold', fontStyle: 'italic',
            textTransform: 'capitalize'
          }}
            numberOfLines={1}
          >{section.in_dis_name}</Text>
        </TouchableOpacity>
        <Text style={styles.txt}
          numberOfLines={1}
        >Invoice Number:{section.in_no}</Text>

        <TouchableHighlight
          activeOpacity={1}
          underlayColor={'#ddd'}


          onPress={() => {
            this.hit_Reprint()

          }}

          style={{
            width: scale(40), height: scale(40),
            alignItems: "center",
            justifyContent: 'center',
            borderRadius: scale(20),
            position: 'absolute',
            right: 0,
            bottom: 0
          }}
        >

          <Image source={Images.printer} style={{
            width: scale(20), height: scale(20),
          }} />

        </TouchableHighlight>


      </Animatable.View>
    );
  };

  renderContent(section, _, isActive) {
    return (
      <View>
        {
          isActive ? <Animatable.View
            duration={400}

            style={
              isActive ? styles.activeContent : styles.inactiveContent}>
            <Animatable.Text style={styles.txt}
              animation={isActive ? 'bounceIn' : undefined}
            >
              {"Invoice Date:" + section.in_date.replace("T00:00:00", "")}
            </Animatable.Text>


            <Animatable.Text style={styles.txt}
              numberOfLines={1}
              animation={isActive ? 'bounceIn' : undefined}
            >Customer GSTIN:{section.in_gst}</Animatable.Text>



            <Animatable.Text style={styles.txt}
              numberOfLines={1}
              animation={isActive ? 'bounceIn' : undefined}
            >Taxable Value:{section.in_taxable}</Animatable.Text>



            <Animatable.Text style={styles.txt}
              numberOfLines={1}
              animation={isActive ? 'bounceIn' : undefined}
            >IGST:{section.in_igst}</Animatable.Text>



            <Animatable.Text style={styles.txt}
              numberOfLines={1}
              animation={isActive ? 'bounceIn' : undefined}
            >CGST:{section.in_cgst}</Animatable.Text>


            <Animatable.Text style={styles.txt}
              numberOfLines={1}
              animation={isActive ? 'bounceIn' : undefined}
            >SGST:{section.in_sgst}</Animatable.Text>



            <Animatable.Text style={styles.txt}
              numberOfLines={1}
              animation={isActive ? 'bounceIn' : undefined}
            >Total Invoice Value (INR):{section.total_amount}</Animatable.Text>

            <TouchableHighlight
              activeOpacity={1}
              underlayColor={'#ddd'}


              // onPress={() => {
              //   this.props.navigation.navigate('InvoiceOne', {
              //     EditId: section.in_id
              //   })
              // }}

              style={{
                width: scale(40), height: scale(40),
                alignItems: "center",
                justifyContent: 'center',
                borderRadius: scale(20),
                position: 'absolute',
                right: 0,
                bottom: 30
              }}
            >

              <Image source={Images.eye} style={{
                width: scale(20), height: scale(20),
              }} />

            </TouchableHighlight>


            <TouchableHighlight
              activeOpacity={1}
              underlayColor={'#ddd'}


              // onPress={() => {
              //   this.props.navigation.navigate('InvoiceOne', {
              //     EditId: section.in_id
              //   })
              // }}

              style={{
                width: scale(40), height: scale(40),
                alignItems: "center",
                justifyContent: 'center',
                borderRadius: scale(20),
                position: 'absolute',
                right: 0,
                bottom: 0
              }}
            >

              <Image source={Images.print} style={{
                width: scale(20), height: scale(20),
              }} />

            </TouchableHighlight>
          </Animatable.View> : null
        }
      </View>



    );
  }


  renderNext() {
    const { show_list, customer_type } = this.state


    var footer_View = (
      <View style={{ backgroundColor: 'transparent' }}>
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
          <Text style={{ fontSize: scale(12), color: '#000', fontWeight: '700' }}>  Total custmer {customer_type}</Text>

          <View style={{ marginLeft: scale(20) }}>
            <Text style={{ fontSize: scale(12), color: '#000' }}>
              Texable Value:{show_list.reduce((prev, next) =>
                prev + parseInt(next.in_taxable), 0)} </Text>
            <Text style={{ fontSize: scale(12), color: '#000' }}>
              IGST:{show_list.reduce((prev, next) =>
                prev + parseInt(next.in_igst), 0)} </Text>
            <Text style={{ fontSize: scale(12), color: '#000' }}>
              CGST:{show_list.reduce((prev, next) =>
                prev + parseInt(next.in_cgst), 0)} </Text>
            <Text style={{ fontSize: scale(12), color: '#000' }}>
              SGST:{show_list.reduce((prev, next) =>
                prev + parseInt(next.in_sgst), 0)} </Text>
            <Text style={{ fontSize: scale(12), color: '#000' }}>
              Total Invoice Value (INR):{show_list.reduce((prev, next) =>
                prev + parseInt(next.total_amount), 0)} </Text>
          </View>






        </View>
      </View>
    );
    return footer_View;
  }


  render() {
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

    const { activeSections, show_list } = this.state;

    return (
      <View style={{
        flex: 1,
        backgroundColor: "#fff"
      }}>
        {this.renderHeader()}
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
              < View style={{
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
              </ View>


          }

          {this.renderFooter()}

        </ScrollView>






        <LogoSpinner loading={this.state.loading} />

        {this._filterRender()}


        {show_list.length > 0 ? this.renderFOB() : null}
        {show_list.length > 0 ? this.renderNext() : null}
      </View>
    );
  }
}



const styles = StyleSheet.create({

  txt: { fontSize: scale(12), width: '90%' },


  userInput: {
    height: scale(40),
    backgroundColor: 'white',
    marginBottom: scale(15),
    borderColor: 'grey',
    borderWidth: scale(1),
    width: scale(180),
    marginLeft: scale(30)
  },

  input: {
    color: '#000',
    marginLeft: scale(5),
    width: '73%',
    fontSize: scale(12)
  },


  title: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '300',
    marginBottom: 20,
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