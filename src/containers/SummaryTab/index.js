import React, { PureComponent } from "react";

import {
    Dimensions, ImageBackground,
    View, PermissionsAndroid, TouchableHighlight, TouchableWithoutFeedback, Animated,

    Text, Modal, ScrollView, TextInput,Keyboard,
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

class SummaryTabScreen extends PureComponent {


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
            ch_all: true,
            ch_customer_name: false,
            ch_ason: false,
            ason_date: moment(new Date()).format('DD/MM/YYYY'),
    
           
            focus:false


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
        if (val == 0) {
            this.setState({
                display_name: '',
                ch_all: true,
                ch_customer_name: false,
                ch_ason: false,
                ason_date: moment(new Date()).format('DD/MM/YYYY'),
                focus:false


            })
        } else if (val == 2) {
            this.setState({
                display_name: '',
                ch_all: false,
                ch_customer_name: true,
                ch_ason: false,
                ason_date: moment(new Date()).format('DD/MM/YYYY'),
                focus: false
            })
        }

        else if (val == 3) {
            this.setState({
                display_name: '',
                ch_all: false,
                ch_customer_name: false,
                ch_ason: true,
                ason_date: moment(new Date()).format('DD/MM/YYYY'),
                focus: false
            })
        }


    }



    //refresh
    onRefresh() {
        const { network } = this.props
        Keyboard.dismiss();
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

        const { ch_all, ch_customer_name, ch_ason } = this.state
        if (ch_all) {
            return 0
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
        const { page, display_name,ason_date } = this.state
        var filter_type = this.filter_fun()
        this.setState({ filter_type: filter_type })


        ArsolApi.ARReports_api(
            user_id,
            user_type,
            'summary',
            filter_type,
            '',
            '',
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
        const { show_list } = this.state;

        var file_arr = []
        var wscols = [];
        for (var i = 0; i < show_list.length; i++) {

         
                file_arr.push({

                    "Customer Name": show_list[i].cust_name,
                    "Balance": show_list[i].balance,

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

        const file = DDP + "customer_summary" + Math.floor(date.getTime()
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




    //footer
    renderFooter = () => {
        const { show_list } = this.state
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
                                width: scale(200),
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
                                width: scale(110),
                                fontWeight: 'bold',
                                fontSize: scale(12),
                                textAlign: 'center',
                                textAlignVertical: 'center',
                                borderColor: '#ddd',
                                borderRightWidth: scale(1)
                            }}
                                numberOfLines={2}
                            >{show_list.reduce((prev, next) => prev + parseInt(next.balance), 0)}</Text>
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
                backgroundColor: '#fff',
                
            }}>
                <Text style={{
                    padding: scale(10),
                    width: scale(200),
                    fontWeight: 'bold',
                    fontSize: scale(12),
                    textAlign: 'center',
                    textAlignVertical: 'center',
                    borderColor: '#ddd',
                    borderRightWidth: scale(1)
                }}
                    numberOfLines={2}
                >Name of Customer</Text>

                <Text style={{

                    padding: scale(10),
                    width: scale(110),
                    fontWeight: 'bold',
                    fontSize: scale(12),
                    textAlign: 'center',
                    textAlignVertical: 'center',
                    borderColor: '#ddd',
                    borderRightWidth: scale(1)
                }}
                    numberOfLines={2}
                >Amount</Text>
               

            </View>
        )
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
                    width: scale(200),
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
                    width: scale(110),
                    fontSize: scale(12),
                    textAlign: 'center',
                    textAlignVertical: 'center',
                    borderColor: '#ddd',
                    borderRightWidth: scale(1)
                }}
                    numberOfLines={2}
                >{rowData.item.balance}</Text>




            </View>






        )
    }



    render() {
        const { ch_customer_name, ch_ason, ch_all,focus,
            display_name, filter_type } = this.state;



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
                                                backgroundColor: ch_customer_name ? Color.headerTintColor : '#ccc',
                                                color: ch_customer_name ? '#fff' : '#000',
                                                width: scale(100),
                                                borderRadius: scale(5),
                                                marginLeft: scale(5)


                                            }}
                                            numberOfLines={1}
                                            onPress={() => { this._checkbox_fun(2) }}
                                        >Customer Name</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity>
                                        <Text
                                            style={{
                                                padding: scale(5),
                                                borderColor: '#000',
                                                borderWidth: scale(1),

                                                textAlign: 'center',

                                                fontSize: scale(10),
                                                backgroundColor: ch_ason ? Color.headerTintColor : '#ccc',
                                                color: ch_ason ? '#fff' : '#000',
                                                width: scale(100),
                                                borderRadius: scale(5),
                                                marginLeft: scale(5)


                                            }}
                                            numberOfLines={1}
                                            onPress={() => { this._checkbox_fun(3) }}
                                        >As on</Text>
                                    </TouchableOpacity>
                                </View>



                                <View style={{
                                    flexDirection: 'row',
                                    marginTop: scale(5),

                                    alignItems: "center"
                                }}>

                                   



                                    {ch_customer_name ?
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


                                    { ch_ason?

                                        <DatePicker
                                            style={{ width: scale(100), }}
                                            date={this.state.ason_date}
                                            placeholder="Select Date"
                                            mode={'date'}
                                            format="DD/MM/YYYY"
                                            confirmBtnText="Confirm"
                                            cancelBtnText="Cancel"
                                            showIcon={false}
                                            minuteInterval={10}
                                            onDateChange={(date) => { this.setState({ ason_date: date }) }}

                                        />
                                        :null
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
                                           filter_type == 2 ? "Customer name " + display_name :
                                                filter_type == 3 ? "Records as on " + this.state.ason_date :
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
                                    marginLeft: scale(20)
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







SummaryTabScreen.defaultProps = {
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
)(SummaryTabScreen);