import React, { PureComponent } from "react";

import {Dimensions,ImageBackground,
    View, PermissionsAndroid, TouchableHighlight, TouchableWithoutFeedback, Animated,

    Text, Modal, ScrollView, TextInput,
    StyleSheet, FlatList, TouchableOpacity, Alert, RefreshControl, Image, ActivityIndicator
} from 'react-native';
//test
import { connect } from "react-redux";
import { Config, Color, Images } from '@common';
const server = Config.SuitCRM;

import { scale } from "react-native-size-matters";
import { StackActions } from '@react-navigation/native';

const msg = Config.SuitCRM;
import { NavigationBar } from '@components';


import Checkbox from 'react-native-modest-checkbox'
import DatePicker from 'react-native-datepicker';
import ArsolApi from '@services/ArsolApi';
import { LogoSpinner } from '@components';
import Snackbar from 'react-native-snackbar';

import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import moment from 'moment';
import XLSX from 'xlsx';
import {
    writeFile, appendFile,
    DownloadDirectoryPath, DocumentDirectoryPath
} from 'react-native-fs';
//const DDP = DownloadDirectoryPath + "/";
const DDP = DocumentDirectoryPath + "/";
import RNFetchBlob from 'rn-fetch-blob';
import RNPrint from 'react-native-print';

import * as Animatable from 'react-native-animatable';
import Accordion from 'react-native-collapsible/Accordion';

class BalanceTabScreen extends PureComponent {


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
            ch_customer_name: false,
            ch_ason: false,

            start_date: moment(new Date()).format('DD/MM/YYYY'),
            end_date: moment(new Date()).format('DD/MM/YYYY'),
            ason_date: moment(new Date()).format('DD/MM/YYYY'),

            customer_type: 'balance',
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
                this.hit_arreportsApi()

            })
        }
    }

    _checkbox_fun(val) {
        if (val.label == "All") {
            this.setState({
                ch_all: true,
                ch_invoice: false,
                ch_customer_name: false,
                ch_ason: false,
                display_name: '',
                invoice_number: '',
                start_date: moment(new Date()).format('DD/MM/YYYY'),
                end_date: moment(new Date()).format('DD/MM/YYYY'),
                ason_date: moment(new Date()).format('DD/MM/YYYY'),

            })
        } else if (val.label == "Invoice Date") {
            this.setState({
                ch_all: false,
                ch_invoice: true,
                ch_customer_name: false,
                ch_ason: false,
                display_name: '',
                invoice_number: '',
                start_date: moment(new Date()).format('DD/MM/YYYY'),
                end_date: moment(new Date()).format('DD/MM/YYYY'),
                ason_date: moment(new Date()).format('DD/MM/YYYY'),
            })
        }

        else if (val.label == "Customer Name") {
            this.setState({
                ch_all: false,
                ch_invoice: false,
                ch_customer_name: true,
                ch_ason: false,
                display_name: '',
                invoice_number: '',
                start_date: moment(new Date()).format('DD/MM/YYYY'),
                end_date: moment(new Date()).format('DD/MM/YYYY'),
                ason_date: moment(new Date()).format('DD/MM/YYYY'),
            })
        }

        else if (val.label == "As on") {
            this.setState({
                ch_all: false,
                ch_invoice: false,
                ch_customer_name: false,
                ch_ason: true,
                display_name: '',
                invoice_number: '',
                start_date: moment(new Date()).format('DD/MM/YYYY'),
                end_date: moment(new Date()).format('DD/MM/YYYY'),
                ason_date: moment(new Date()).format('DD/MM/YYYY'),
            })
        }
    }

    _filterRender() {
        const { ch_customer_name,
            ch_invoice,
            ch_all,
            customer_type,
            ch_ason,
            display_name,
            ason_date,
            start_date,
            end_date,
        } = this.state;


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
                                    >Filter customer {customer_type}</Text>
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

                                    {
                                        customer_type == "balance" ?
                                            <View>
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
                                                                date={start_date}
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
                                                                date={end_date}
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
                                            </View>
                                            : null

                                    }






                                    <Checkbox
                                        label='Customer Name'
                                        checked={ch_customer_name}
                                        onChange={(checked) => this._checkbox_fun(checked)}
                                        labelStyle={{ fontSize: scale(15), }}
                                        checkboxStyle={{ width: scale(30), height: scale(30) }}

                                    />
                                    {ch_customer_name ?
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

                                    {customer_type != "balance" ?
                                        <View>
                                            <Checkbox
                                                label='As on'
                                                checked={ch_ason}
                                                onChange={(checked) => this._checkbox_fun(checked)}
                                                labelStyle={{ fontSize: scale(15), }}
                                                checkboxStyle={{ width: scale(30), height: scale(30) }}

                                            />

                                            {
                                                ch_ason ?
                                                    <View>
                                                        <DatePicker
                                                            style={{ width: scale(200), marginTop: scale(10) }}
                                                            date={ason_date}
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
                                                            onDateChange={(date) => { this.setState({ ason_date: date }) }}

                                                        />

                                                    </View>
                                                    : null
                                            }
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
                    this.hit_arreportsApi();
                },
            );
        }

    }

    filter_fun() {

        const { ch_all, ch_invoice, ch_customer_name, ch_ason } = this.state
        if (ch_all) {
            return 0
        } else if (ch_invoice) {
            return 1
        } else if (ch_customer_name) {
            return 2
        } else if (ch_ason) {
            return 3
        } else {
            return 0
        }
    }

    hit_arreportsApi() {
        const { user_id, user_type } = this.props
        const { page, start_date, end_date, display_name, ason_date, customer_type } = this.state
        var filter_type = this.filter_fun()


        ArsolApi.ARReports_api(user_id,
            user_type,
            customer_type,
            filter_type,
            start_date,
            end_date,
            display_name,
            ason_date,
            page
        )

            .then(responseJson => {
                console.log('ARReports_api', responseJson);

                if (responseJson.ok) {
                    this.setState({
                        loading: false,
                        refresh: false
                    });

                    if (responseJson.data != null) {
                        if (responseJson.data.hasOwnProperty('status')) {

                            if (responseJson.data.status == 'success') {
                                if (responseJson.data.hasOwnProperty('message')) {

                                    if (responseJson.data.hasOwnProperty("data")) {
                                        if (responseJson.data.data.length > 0) {
                                            this.setState({
                                                show_list: [...this.state.show_list, ...responseJson.data.data],
                                                load_more: responseJson.data.load_more
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
                        this.hit_arreportsApi();
                    },
                );
            }
        }
    };





    //footer
    renderFooter = () => {
        if (!this.state.load_more) return <View style={{ marginBottom: scale(100), }}></View>;
        return (
            <View style={{ marginBottom: scale(100), }}>
                <ActivityIndicator size="large" color="#ddd" />
            </View>
        );
    };


    setMenuRef = ref => {
        this._menu = ref;
    };

    hideMenu = () => {
        this._menu.hide();
    };

    showMenu = () => {
        this._menu.show();
    };

    ItemPress(item) {
        this._menu.hide();
        this.setState({
            customer_type: item,
            display_name: '',
            invoice_number: '',
            ch_all: true,
            ch_invoice: false,
            ch_customer_name: false,
            ch_ason: false,
            start_date: moment(new Date()).format('DD/MM/YYYY'),
            end_date: moment(new Date()).format('DD/MM/YYYY'),
            ason_date: moment(new Date()).format('DD/MM/YYYY'),
        }, () => {
            this.onRefresh()
        })

    }

    // 
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
                    {customer_type == 'balance' ?
                        <View style={{ marginLeft: scale(20) }}>
                            <Text style={{ fontSize: scale(12), color: '#000' }}>Total Amount:{show_list.reduce((prev, next) => prev + parseInt(next.total_amt), 0)} </Text>
                            <Text style={{ fontSize: scale(12), color: '#000' }}>Amount Received:{show_list.reduce((prev, next) => prev + parseInt(next.amt_receive), 0)} </Text>
                            <Text style={{ fontSize: scale(12), color: '#000' }}>Balance:{show_list.reduce((prev, next) => prev + parseInt(next.balance), 0)} </Text>
                        </View> :
                        customer_type == 'summary' ?
                            <View style={{ marginLeft: scale(20) }}>
                                <Text style={{ fontSize: scale(12), color: '#000' }}>Balance:{show_list.reduce((prev, next) => prev + parseInt(next.balance), 0)} </Text>
                            </View> :
                            customer_type == "aging" ?
                                <View style={{ marginLeft: scale(20) }}>
                                    <Text style={{ fontSize: scale(12), color: '#000' }}>0-30:{show_list.reduce((prev, next) => prev + parseInt(next.day0_30), 0)} </Text>
                                    <Text style={{ fontSize: scale(12), color: '#000' }}>31-60:{show_list.reduce((prev, next) => prev + parseInt(next.day31_60), 0)} </Text>
                                    <Text style={{ fontSize: scale(12), color: '#000' }}>61-90:{show_list.reduce((prev, next) => prev + parseInt(next.day61_90), 0)} </Text>
                                    <Text style={{ fontSize: scale(12), color: '#000' }}>91-120:{show_list.reduce((prev, next) => prev + parseInt(next.day91_120), 0)} </Text>
                                    <Text style={{ fontSize: scale(12), color: '#000' }}>121-above:{show_list.reduce((prev, next) => prev + parseInt(next.day121_above), 0)} </Text>
                                </View> : null
                    }





                </View>
            </View>
        );
        return footer_View;
    }

    //file export
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
        const { show_list, customer_type } = this.state;

        var file_arr = []
        var wscols = [];
        for (var i = 0; i < show_list.length; i++) {

            if (customer_type == 'balance') {
                file_arr.push({
                    "Invoice Number": show_list[i].in_no,
                    "Customer Name": show_list[i].in_dis_name,
                    "Invoice Date": show_list[i].in_date,
                    "Total Amount": show_list[i].total_amt,
                    "Amount Received": show_list[i].amt_receive,
                    "Receipt date": show_list[i].rec_date,
                    "Balance": show_list[i].balance,
                })
            } else if (customer_type == 'summary') {
                file_arr.push({

                    "Customer Name": show_list[i].cust_name,
                    "Balance": show_list[i].balance,

                })
            } else if (customer_type == 'aging') {
                file_arr.push({

                    "Customer Name": show_list[i].cust_name,
                    "0-30": show_list[i].day0_30,
                    "31-60": show_list[i].day31_60,
                    "61-90": show_list[i].day61_90,
                    "91-120": show_list[i].day91_120,
                    "121-above": show_list[i].day121_above,

                })
            }




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

        const file = DDP + "customer_" + customer_type + Math.floor(date.getTime()
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
    const { ch_display_name, ch_invoice, ch_invoice_no, ch_all,
       invoice_number, display_name,filter_type } = this.state;



    return (
      <View>
        <ImageBackground
          style={[styles.fixed, styles.containter]}
          source={Images.listbg}>
       

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
                        backgroundColor: ch_display_name ? Color.headerTintColor : '#ccc',
                        color: ch_display_name ? '#fff' : '#000',
                        width: scale(100),
                        borderRadius: scale(5),
                        marginLeft:scale(5)


                      }}
                      numberOfLines={1}
                      onPress={() => { this._checkbox_fun(2) }}
                    >Customer Name</Text>
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







BalanceTabScreen.defaultProps = {
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
)(BalanceTabScreen);