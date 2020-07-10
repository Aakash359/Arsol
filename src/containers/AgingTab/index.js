import React, { PureComponent } from "react";

import {
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

class AgingTabScreen extends PureComponent {


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
                    }}>AR Report</Text>

                    <TouchableHighlight
                        activeOpacity={1}
                        underlayColor={'#ddd'}
                        onPress={() => { this.setState({ filter: true }) }}
                        style={{
                            position: "absolute",
                            width: scale(40), height: scale(40),
                            alignItems: "center",
                            justifyContent: 'center',
                            borderRadius: scale(20),
                            right: 20
                        }}
                    >

                        <Image source={Images.filterw} style={{
                            width: scale(30), height: scale(30),


                        }} />

                    </TouchableHighlight>

                    <TouchableHighlight
                        activeOpacity={1}
                        underlayColor={'#ddd'}
                        onPress={() => { this.showMenu() }}
                        style={{
                            position: "absolute",
                            width: scale(20), height: scale(40),
                            alignItems: "center",
                            justifyContent: 'center',
                            borderRadius: scale(20),
                            right: 0
                        }}
                    >

                        <Image source={Images.more} style={{
                            width: scale(30), height: scale(30),


                        }} />

                    </TouchableHighlight>
                </View>

            </View>

        )
    }

    _handleAdd(item) {



        if (item == 'export') {
            if (this.state.show_list.length > 0) {
                this.requestRunTimePermission()
            } else {
                alert("No Record Found")
            }
        }


    }

    //=================================================


    setSections = sections => {
        this.setState({
            activeSections: sections.includes(undefined) ? [] : sections,
        });
    };




    renderShow = (section, _, isActive) => {
        const { customer_type } = this.state;

        return (
            <Animatable.View
                duration={400}
                style={
                    isActive ? styles.active : styles.inactive}

            >
                {

                    customer_type == "balance" ?
                        <View>
                            <Text style={{
                                fontSize: scale(14), fontWeight: 'bold', fontStyle: 'italic',
                                textTransform: 'capitalize'
                            }}
                                numberOfLines={1}
                            >{section.in_dis_name}</Text>
                            <Text style={styles.txt}
                                numberOfLines={1}
                            >Invoice Number:{section.in_no}</Text>



                        </View> :
                        customer_type == "summary" ?
                            <View>
                                <Text style={{
                                    fontSize: scale(14), fontWeight: 'bold', fontStyle: 'italic',
                                    textTransform: 'capitalize'
                                }}
                                    numberOfLines={1}
                                >{section.cust_name}</Text>
                            </View> :
                            customer_type == "aging" ?
                                <View>
                                    <Text style={{
                                        fontSize: scale(14), fontWeight: 'bold', fontStyle: 'italic',
                                        textTransform: 'capitalize'
                                    }}
                                        numberOfLines={1}
                                    >{section.cust_name}</Text>

                                </View> : null


                }





            </Animatable.View>
        );
    };

    renderContent = (section, _, isActive) => {
        const { customer_type } = this.state;
        return (
            <View>
                {
                    isActive ? <Animatable.View
                        duration={400}
                        style={
                            isActive ? styles.activeContent : styles.inactiveContent}>

                        {
                            customer_type == "balance" ?
                                <View>
                                    <Animatable.Text style={styles.txt}
                                        numberOfLines={1}
                                        animation={isActive ? 'bounceIn' : undefined}
                                    >Invoice Date:{section.in_date}</Animatable.Text>
                                    <Animatable.Text style={styles.txt}
                                        numberOfLines={1}
                                        animation={isActive ? 'bounceIn' : undefined}
                                    >Receipt Date:{section.rec_date}</Animatable.Text>
                                    <Animatable.Text style={styles.txt}
                                        numberOfLines={1}
                                        animation={isActive ? 'bounceIn' : undefined}
                                    >Total Amount:{section.total_amt}</Animatable.Text>
                                    <Animatable.Text style={styles.txt}
                                        numberOfLines={1}
                                        animation={isActive ? 'bounceIn' : undefined}
                                    >Amount Received:{section.amt_receive}</Animatable.Text>
                                    <Animatable.Text style={styles.txt}
                                        numberOfLines={1}
                                        animation={isActive ? 'bounceIn' : undefined}
                                    >Balance:{section.balance}</Animatable.Text>
                                </View> :
                                customer_type == "summary" ?
                                    <View>
                                        <Animatable.Text style={styles.txt}
                                            numberOfLines={1}
                                            animation={isActive ? 'bounceIn' : undefined}
                                        >Balance:{section.balance}</Animatable.Text>
                                    </View> :
                                    customer_type == "aging" ?
                                        <View>

                                            <Animatable.Text style={styles.txt}
                                                numberOfLines={1}
                                                animation={isActive ? 'bounceIn' : undefined}
                                            >0-30:{section.day0_30}</Animatable.Text>
                                            <Animatable.Text style={styles.txt}
                                                numberOfLines={1}
                                                animation={isActive ? 'bounceIn' : undefined}
                                            >31-60:{section.day31_60}</Animatable.Text>
                                            <Animatable.Text style={styles.txt}
                                                numberOfLines={1}
                                                animation={isActive ? 'bounceIn' : undefined}
                                            >61-90:{section.day61_90}</Animatable.Text>
                                            <Animatable.Text style={styles.txt}
                                                numberOfLines={1}
                                                animation={isActive ? 'bounceIn' : undefined}
                                            >91-120:{section.day91_120}</Animatable.Text>
                                            <Animatable.Text style={styles.txt}
                                                numberOfLines={1}
                                                animation={isActive ? 'bounceIn' : undefined}
                                            >121 and above:{section.day121_above}</Animatable.Text>

                                        </View> : null
                        }








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

    render() {
        const { show_list, customer_type, multipleSelect, activeSections, } = this.state

        return (
            <View style={{
                flex: 1,
                backgroundColor: "#fff"
            }}>
                {this.renderHeader()}
                <View style={{ position: 'relative', top: -5, alignSelf: "flex-end" }}>
                    <Menu
                        ref={this.setMenuRef}
                        button={<View></View>}
                    >
                        <MenuItem onPress={() => this.ItemPress("balance")}
                            textStyle={{
                                fontSize: scale(15),
                                color: customer_type == "balance" ? '#fff' : '#000'

                            }}
                            style={{
                                backgroundColor: customer_type == "balance" ? 'green' : '#ddd',

                            }}

                        >Customer Balance</MenuItem>
                        <MenuItem onPress={() => this.ItemPress("summary")}
                            textStyle={{
                                fontSize: scale(15),
                                color: customer_type == "summary" ? '#fff' : '#000'
                            }}
                            style={{ backgroundColor: customer_type == "summary" ? 'green' : '#ddd' }}
                        >
                            Customer Summary</MenuItem>
                        <MenuItem onPress={() => this.ItemPress("aging")}
                            textStyle={{
                                fontSize: scale(15),
                                color: customer_type == "aging" ? '#fff' : '#000'
                            }}
                            style={{ backgroundColor: customer_type == "aging" ? 'green' : '#ddd' }}
                        >
                            Customer Aging</MenuItem>


                    </Menu>
                </View>
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








AgingTabScreen.defaultProps = {
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
)(AgingTabScreen);