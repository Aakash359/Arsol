import React, { PureComponent } from "react";

import {
    View, Keyboard,

    Text, Modal, ScrollView, TextInput,
    StyleSheet, FlatList, TouchableOpacity, Alert, RefreshControl, Image, ActivityIndicator, TouchableHighlight
} from 'react-native';

import { connect } from "react-redux";
import { Images, Config, Color } from '@common';

import { NavigationBar } from '@components';
import { scale } from "react-native-size-matters";
import { StackActions } from '@react-navigation/native';

const msg = Config.SuitCRM;

import ArsolApi from '@services/ArsolApi';
import { LogoSpinner } from '@components';
import Snackbar from 'react-native-snackbar';
import RNPickerSelect from 'react-native-picker-select';
import Checkbox from 'react-native-modest-checkbox'

class BankDetailsScreen extends PureComponent {


    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            refresh: false,
            load_more: false,
            onEndReachedCalledDuringMomentum: true,
            addItem: false,
            page: 0,
            show_list: [],


            b_name: "",
            ac_name: '',
            ac_no: '',
            ifsc_code: '',
            edit_id: "",




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
                this.setState({
                    loading: true,
                    refresh: false,
                    load_more: false,
                    onEndReachedCalledDuringMomentum: true,
                    addItem: false,
                    page: 0,
                    show_list: [],


                    b_name: "",
                    ac_name: '',
                    ac_no: '',
                    ifsc_code: '',
                    edit_id: "",
                }, () => {
                    this.hit_bankDetailApi()
                })
            }
        })

    }

    //add
    _addItem_fun() {
        const { b_name,
            ac_name,
            ac_no,
            ifsc_code,
            edit_id
        } = this.state

        const { user_id, user_type, network } = this.props
        Keyboard.dismiss()
        if (b_name.trim() == "") {
            alert("Enter Bank Name")
        } else if (ac_name.trim() == "") {
            alert("Enter Account Name")
        } else if (ac_no.trim() == "") {
            alert("Enter Account No.")
        } else if (isNaN(ac_no)) {
            alert("Account No. Invalid")
        } else if (ifsc_code.trim() == "") {
            alert("Enter IFSC Code")
        } else if (!network.isConnected) {
            Snackbar.show({
                text: msg.noInternet,
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: "red"
            });
        } else {
            this.setState({ loading: false, addItem: false }, () => {
                this.hit_addItemApi(user_id, user_type, b_name,
                    ac_name,
                    ac_no,
                    ifsc_code,
                    edit_id
                )

            })
        }

    }

    hit_addItemApi(user_id, user_type,
        b_name,
        ac_name,
        ac_no,
        ifsc_code,
        edit_id
    ) {


        ArsolApi.AddBank_api(user_id, user_type,
            b_name,
            ac_name,
            ac_no,
            ifsc_code,
            edit_id
        )

            .then(responseJson => {
                console.log('AddBank_api', responseJson);

                if (responseJson.ok) {
                    this.setState({
                        loading: false,

                    });

                    if (responseJson.data != null) {
                        if (responseJson.data.hasOwnProperty('status')) {

                            if (responseJson.data.status == 'success') {
                                if (responseJson.data.hasOwnProperty('message')) {

                                    if (responseJson.data.hasOwnProperty("data")) {
                                        if (responseJson.data.data.length > 0) {

                                            alert(responseJson.data.message)

                                            this.setState({
                                                edit_id: '',
                                                b_name: '',
                                                ac_name: '',
                                                ac_no: '',
                                                ifsc_code: ''
                                            }, () => {
                                                this.onRefresh()
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

                        });
                    } else if (responseJson.problem == 'TIMEOUT_ERROR') {
                        Snackbar.show({
                            text: msg.serTimErr,
                            duration: Snackbar.LENGTH_SHORT,
                            backgroundColor: Color.lgreen
                        });
                        this.setState({
                            loading: false,

                        });
                    } else {
                        Snackbar.show({
                            text: msg.servErr,
                            duration: Snackbar.LENGTH_SHORT,
                            backgroundColor: "red"
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





    hit_bankDetailApi() {
        const { user_id, user_type } = this.props
        const { page } = this.state
        ArsolApi.BankDetails_api(user_id, user_type, page)

            .then(responseJson => {
                console.log('BankDetails_api', responseJson);

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
                    this.hit_bankDetailApi();
                },
            );
        }

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
                        this.hit_bankDetailApi();
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

    FlatListItemSeparator = () => {
        return (
            <View
                style={{
                    height: scale(5),
                    width: "100%",

                }}
            />
        );
    }




    GetItem(index) {

        const { show_list } = this.state

        this.setState({
            addItem: true,
            edit_id: show_list[index].id,
            b_name: show_list[index].bank_name,
            ac_name: show_list[index].ac_name,
            ac_no: show_list[index].ac_number,
            ifsc_code: show_list[index].ifsc_code,

        })

    }

    _renderListItem(rowData) {
        //   console.log(rowData)
        return (

            <View style={{
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
                key={rowData.index}
            >

                <Text style={{
                    fontSize: scale(14), fontWeight: 'bold', fontStyle: 'italic',
                    textTransform: 'capitalize'
                }}
                    numberOfLines={1}
                >{rowData.item.bank_name}</Text>



                <Text style={styles.txt}
                    numberOfLines={1}
                >Account Name:{rowData.item.ac_name}</Text>



                <Text style={styles.txt}
                    numberOfLines={1}
                >Account Number:{rowData.item.ac_number}</Text>



                <Text style={styles.txt}
                    numberOfLines={1}
                >IFSC Code:{rowData.item.ifsc_code}</Text>

                <TouchableHighlight
                    activeOpacity={1}
                    underlayColor={'#ddd'}
                    onPress={() => { this.GetItem(rowData.index) }}
                    style={{
                        width: scale(40), height: scale(40),
                        alignItems: "center",
                        justifyContent: 'center',
                        borderRadius: scale(20),
                        position: 'absolute',
                        right: -10,
                        top: -12
                    }}
                >

                    <Image source={Images.pencil} style={{
                        width: scale(20), height: scale(20),


                    }} />

                </TouchableHighlight>



            </View>







        )
    }

    //additem
    _addItemRender() {
        return (
            <Modal
                transparent={true}
                animationType={'slide'}
                visible={this.state.addItem}
                onRequestClose={() => {
                    this.setState({
                        addItem: false,
                        edit_id: '',
                        b_name: '',
                        ac_name: '',
                        ac_no: '',
                        ifsc_code: ''
                    });
                }}>
                <View style={{ flex: 1 }}>



                    <ScrollView style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                        contentContainerStyle={{
                            flexGrow: 1,
                            justifyContent: 'center',
                            alignItems: "center",
                            padding: scale(5)
                        }}
                        keyboardShouldPersistTaps="handled"
                    >


                        <View>


                            <View style={{
                                backgroundColor: 'white',
                                width: '90%',
                                padding: scale(10),
                                borderRadius: scale(5),
                                alignItems: 'center'
                            }}>



                                <Text style={styles.txt_h}>Bank Name</Text>
                                <View style={styles.userInput}>

                                    <TextInput
                                        style={styles.input}

                                        autoCorrect={false}
                                        autoCapitalize={'none'}

                                        placeholderTextColor="grey"
                                        underlineColorAndroid="transparent"
                                        onChangeText={b_name => this.setState({ b_name })}
                                        value={this.state.b_name}
                                    />
                                </View>

                                <Text style={styles.txt_h}>Account Name</Text>
                                <View style={styles.userInput}>

                                    <TextInput
                                        style={styles.input}

                                        autoCorrect={false}
                                        autoCapitalize={'none'}

                                        placeholderTextColor="grey"
                                        underlineColorAndroid="transparent"
                                        onChangeText={ac_name => this.setState({ ac_name })}
                                        value={this.state.ac_name}

                                    />
                                </View>

                                <Text style={styles.txt_h}>Account No.</Text>
                                <View style={styles.userInput}>

                                    <TextInput
                                        style={styles.input}

                                        autoCorrect={false}
                                        autoCapitalize={'none'}

                                        placeholderTextColor="grey"
                                        underlineColorAndroid="transparent"
                                        onChangeText={ac_no => this.setState({ ac_no })}
                                        value={this.state.ac_no}
                                        keyboardType='number-pad'

                                    />
                                </View>

                                <Text style={styles.txt_h}>IFSC Code</Text>
                                <View style={styles.userInput}>

                                    <TextInput
                                        style={styles.input}

                                        autoCorrect={false}
                                        autoCapitalize={'none'}

                                        placeholderTextColor="grey"
                                        underlineColorAndroid="transparent"
                                        onChangeText={ifsc_code => this.setState({ ifsc_code })}
                                        value={this.state.ifsc_code}
                                    />
                                </View>




                                <View style={{
                                    flexDirection: "row",
                                    justifyContent: 'space-between'
                                }}>
                                    <TouchableOpacity
                                        activeOpacity={0.7}
                                        style={{
                                            width: scale(100),
                                            height: scale(40),
                                            padding: scale(10),
                                            backgroundColor: '#3D8EE1',
                                            borderRadius: scale(8),
                                            margin: scale(5)

                                        }}
                                        onPress={() => {
                                            this.setState({
                                                addItem: false,
                                                edit_id: '',
                                                b_name: '',
                                                ac_name: '',
                                                ac_no: '',
                                                ifsc_code: ''
                                            });
                                        }}>
                                        <Text style={{
                                            color: '#fff',
                                            fontSize: scale(15),
                                            textAlign: 'center'
                                        }}> Cancel </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        activeOpacity={0.7}
                                        style={{
                                            width: scale(100),
                                            height: scale(40),
                                            padding: scale(10),
                                            backgroundColor: '#3D8EE1',
                                            borderRadius: scale(8),
                                            margin: scale(5)
                                        }}
                                        onPress={() => {
                                            this._addItem_fun()
                                        }}>
                                        <Text style={{
                                            color: '#fff',
                                            fontSize: scale(15),
                                            textAlign: 'center'
                                        }}>{this.state.edit_id != '' ? 'Update' : "Save"}</Text>
                                    </TouchableOpacity>

                                </View>


                            </View>



                        </View>
                    </ScrollView>
                </View>

            </Modal>
        )
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
                }}>Bank Details</Text>

            </View>
        )
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
                    right: 30,
                    bottom: 30,
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
                    this.setState({ addItem: true, ed_id: "" })
                }}
            >

                <Image source={Images.add}

                    style={{
                        resizeMode: 'contain',
                        width: 25,
                        height: 25,
                    }} />

            </TouchableOpacity>
        );
    }


    render() {


        return (
            <View style={{
                justifyContent: "center", flex: 1, backgroundColor: '#fff'
            }}>




                <LogoSpinner loading={this.state.loading} />


                <FlatList
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={this.renderHeader.bind(this)}
                    stickyHeaderIndices={[0]}
                    contentContainerStyle={{ paddingBottom: scale(5), flexGrow: 1 }}
                    keyExtractor={(item, index) => index.toString()}
                    data={this.state.show_list}
                    ItemSeparatorComponent={this.FlatListItemSeparator}
                    renderItem={(item, index) => this._renderListItem(item)}
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
                    //pagination

                    ListFooterComponent={this.renderFooter.bind(this)}
                    onEndReachedThreshold={0.01}
                    onMomentumScrollBegin={() => this._onMomentumScrollBegin()}
                    onEndReached={this.handleLoadMore.bind(this)}
                />

                {this._addItemRender()}
                {this.renderFOB()}

            </View>
        );
    }
}

const styles = StyleSheet.create({

    txt: { fontSize: scale(12) },

    userInput: {
        height: scale(40),
        backgroundColor: 'white',
        marginBottom: scale(15),
        borderColor: 'grey',
        borderWidth: scale(1),
        width: scale(200),
        borderRadius: scale(5)
    },

    input: {
        color: '#000',
        marginLeft: scale(5),
        width: '73%',
        fontSize: scale(12)
    },

    txt_h: {
        fontSize: scale(12),
        color: '#000',
        fontWeight: 'bold',
        width: scale(200),
        textAlign: 'left'
    },


    userInputTC: {
        height: scale(100),
        backgroundColor: 'white',
        marginBottom: scale(15),
        borderColor: 'grey',
        borderWidth: scale(1),
        width: scale(200),
    },

    inputTC: {
        color: '#000',
        fontSize: scale(12)
    },
});




BankDetailsScreen.defaultProps = {
    user_id: '',
    user_type: '',
    network: ''
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
)(BankDetailsScreen);